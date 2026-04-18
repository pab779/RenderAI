"""Extract editable object maps from local PPTX templates.

The web app uses this metadata to render PowerPoint/Canva-like editable layers
instead of treating each template slide as a flat background image.
"""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path

from pptx import Presentation
from pptx.enum.shapes import MSO_SHAPE_TYPE


ROOT = Path(__file__).resolve().parents[1]
CATALOG_PATH = ROOT / "assets" / "local-brochure-templates" / "local-template-catalog.json"
OUTPUT_PATH = ROOT / "assets" / "local-brochure-templates" / "local-template-objects.json"


def pct(value: int, total: int) -> float:
    if not total:
        return 0.0
    return round(max(0.0, min(100.0, (float(value) / float(total)) * 100.0)), 4)


def clean_text(value: str) -> str:
    text = re.sub(r"\s+", " ", value or "").strip()
    return text[:900]


def rgb_to_hex(rgb) -> str:
    if rgb is None:
        return ""
    try:
        return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"
    except Exception:
        return ""


def first_text_style(shape) -> dict:
    style = {
        "fontFamily": "",
        "fontSize": 0,
        "bold": False,
        "italic": False,
        "color": "",
        "align": "",
    }
    try:
        paragraphs = list(shape.text_frame.paragraphs)
        for paragraph in paragraphs:
            if paragraph.alignment is not None:
                style["align"] = str(paragraph.alignment).split(".")[-1].lower()
            for run in paragraph.runs:
                if not clean_text(run.text):
                    continue
                font = run.font
                if font.name:
                    style["fontFamily"] = font.name
                if font.size:
                    style["fontSize"] = round(float(font.size.pt), 2)
                style["bold"] = bool(font.bold)
                style["italic"] = bool(font.italic)
                try:
                    style["color"] = rgb_to_hex(font.color.rgb)
                except Exception:
                    pass
                return style
    except Exception:
        pass
    return style


def placeholder_type(shape) -> str:
    try:
        return str(shape.placeholder_format.type).split(".")[-1].lower()
    except Exception:
        return ""


def object_role(kind: str, shape, text: str, area: float) -> str:
    name = (getattr(shape, "name", "") or "").lower()
    ph = placeholder_type(shape)
    lower = (text or "").lower()
    if kind == "image":
        if area >= 55 or "background" in name:
            return "background"
        if "picture" in ph or "image" in name or "photo" in name:
            return "photo"
        return "image"
    if "title" in ph or "title" in name or len(text) <= 70 and area > 5:
        return "title"
    if "subtitle" in ph or "subtitle" in name or "subt" in lower:
        return "subtitle"
    if "date" in name or "footer" in name or area < 1.4:
        return "caption"
    return "body"


def shape_fill_hex(shape) -> str:
    try:
        fill = shape.fill
        if not fill or not fill.fore_color:
            return ""
        return rgb_to_hex(fill.fore_color.rgb)
    except Exception:
        return ""


def extract_shape(shape, z_index: int, slide_w: int, slide_h: int) -> dict | None:
    left = getattr(shape, "left", 0)
    top = getattr(shape, "top", 0)
    width = getattr(shape, "width", 0)
    height = getattr(shape, "height", 0)
    area = pct(width, slide_w) * pct(height, slide_h)
    if width <= 0 or height <= 0:
        return None

    text = ""
    has_text = False
    try:
        has_text = bool(shape.has_text_frame)
        text = clean_text(shape.text if has_text else "")
    except Exception:
        has_text = False

    shape_type = getattr(shape, "shape_type", None)
    is_picture = shape_type == MSO_SHAPE_TYPE.PICTURE
    is_placeholder_picture = placeholder_type(shape) in {"picture", "clip_art", "media_clip"}

    if is_picture or is_placeholder_picture:
        kind = "image"
    elif text:
        kind = "text"
    else:
        # Keep only meaningful decorative blocks; tiny shapes are noise.
        if area < 0.85:
            return None
        kind = "shape"

    obj = {
        "id": f"obj-{z_index + 1}",
        "kind": kind,
        "role": object_role(kind, shape, text, area),
        "name": getattr(shape, "name", "") or "",
        "placeholderType": placeholder_type(shape),
        "x": pct(left, slide_w),
        "y": pct(top, slide_h),
        "width": pct(width, slide_w),
        "height": pct(height, slide_h),
        "z": z_index,
    }

    if kind == "text":
        obj["text"] = text
        obj["style"] = first_text_style(shape)
    elif kind == "shape":
        obj["fill"] = shape_fill_hex(shape)

    return obj


def extract_template(entry: dict) -> dict:
    pptx_path = ROOT / entry.get("pptxPath", "")
    if not pptx_path.exists():
        return {"error": f"missing pptx: {entry.get('pptxPath', '')}", "slides": []}

    prs = Presentation(str(pptx_path))
    slide_w = int(prs.slide_width)
    slide_h = int(prs.slide_height)
    slides = []

    for slide_index, slide in enumerate(prs.slides, start=1):
        objects = []
        for z_index, shape in enumerate(slide.shapes):
            obj = extract_shape(shape, z_index, slide_w, slide_h)
            if obj:
                objects.append(obj)
        slides.append({
            "slide": slide_index,
            "objectCount": len(objects),
            "objects": objects,
        })

    return {
        "slideSize": {
            "width": slide_w,
            "height": slide_h,
            "ratio": round(slide_w / max(slide_h, 1), 4),
        },
        "slides": slides,
    }


def iter_catalog_entries(catalog: dict):
    for group in ("brochure", "ppt"):
        for entry in catalog.get(group, []) or []:
            yield group, entry


def main() -> None:
    catalog = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    templates = {}
    for group, entry in iter_catalog_entries(catalog):
        template_id = entry.get("id")
        if not template_id:
            continue
        print(f"extracting {group}: {entry.get('label', template_id)}")
        templates[template_id] = {
            "id": template_id,
            "group": group,
            "label": entry.get("label", ""),
            **extract_template(entry),
        }

    payload = {
        "version": 1,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "templates": templates,
    }
    OUTPUT_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {OUTPUT_PATH.relative_to(ROOT)} with {len(templates)} templates")


if __name__ == "__main__":
    main()
