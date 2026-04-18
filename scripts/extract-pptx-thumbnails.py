"""
Extract slide preview thumbnails from PPTX files for the template gallery.
PPTX files are ZIP archives. Canva exports include:
  - docProps/thumbnail.jpeg  (presentation thumbnail)
  - ppt/media/image*.png/jpg (slide images)

This script extracts per-slide images by looking at ppt/media/ and ppt/slides/
and saves them to assets/template-previews/slides/ as 400x250 JPEGs.
"""

import os
import sys
import json
import zipfile
import re
from pathlib import Path
from PIL import Image
import io

# Paths
BASE_DIR = Path(__file__).parent.parent
CATALOG_PATH = BASE_DIR / "assets/local-brochure-templates/local-template-catalog.json"
SLIDES_DIR = BASE_DIR / "assets/template-previews/slides"
SLIDES_DIR.mkdir(parents=True, exist_ok=True)

THUMB_W, THUMB_H = 400, 250  # 16:10 output

def extract_thumbnail(pptx_path: Path, min_size: int = 100) -> Image.Image | None:
    """
    Try to extract the docProps/thumbnail image from a PPTX.
    Only return it if it's large enough (width >= min_size).
    """
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            names = z.namelist()
            for candidate in ['docProps/thumbnail.jpeg', 'docProps/thumbnail.jpg',
                               'docProps/thumbnail.png', 'docProps/Thumbnail.jpeg']:
                if candidate in names:
                    data = z.read(candidate)
                    img = Image.open(io.BytesIO(data)).convert('RGB')
                    if img.width >= min_size and img.height >= min_size:
                        return img
                    else:
                        print(f"  thumbnail too small ({img.width}x{img.height}), skipping")
    except Exception as e:
        print(f"  thumbnail err: {e}")
    return None


def extract_slide_images(pptx_path: Path) -> list[Image.Image]:
    """Extract images from ppt/media/ that are used as slide backgrounds/content."""
    images = []
    try:
        with zipfile.ZipFile(pptx_path, 'r') as z:
            media_files = sorted([n for n in z.namelist()
                                   if n.startswith('ppt/media/') and
                                   re.search(r'\.(jpg|jpeg|png)$', n, re.I)])
            for mf in media_files[:15]:  # max 15 images
                try:
                    data = z.read(mf)
                    img = Image.open(io.BytesIO(data)).convert('RGB')
                    # Only include reasonably sized images (slide backgrounds are large)
                    if img.width >= 200 and img.height >= 150:
                        images.append(img)
                except Exception:
                    pass
    except Exception as e:
        print(f"  media err: {e}")
    return images


def make_thumb(img: Image.Image, w: int = THUMB_W, h: int = THUMB_H) -> Image.Image:
    """Resize image to w×h, cropping to fill."""
    src_ratio = img.width / img.height
    tgt_ratio = w / h
    if src_ratio > tgt_ratio:
        # Image is wider — fit height, crop width
        new_h = h
        new_w = int(h * src_ratio)
    else:
        # Image is taller — fit width, crop height
        new_w = w
        new_h = int(w / src_ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - w) // 2
    top = (new_h - h) // 2
    return img.crop((left, top, left + w, top + h))


def process_template(entry: dict, pptx_base_dir: Path, force: bool = False) -> int:
    """Process one template entry from the catalog. Returns number of slides saved."""
    pptx_path_rel = entry.get('pptxPath', '')
    if not pptx_path_rel:
        print(f"  [SKIP] No pptxPath for {entry['id']}")
        return 0

    pptx_path = BASE_DIR / pptx_path_rel
    if not pptx_path.exists():
        print(f"  [MISS] PPTX not found: {pptx_path}")
        return 0

    slide_previews = entry.get('slidePreviews', [])
    if not slide_previews:
        print(f"  [SKIP] No slidePreviews defined for {entry['id']}")
        return 0

    saved = 0
    # Extract media images (these are the best source for slide content)
    media_imgs = extract_slide_images(pptx_path)

    # Try docProps thumbnail for slide 1 only if no good media images
    thumb = extract_thumbnail(pptx_path, min_size=200) if not media_imgs else None

    for i, preview in enumerate(slide_previews):
        out_path = BASE_DIR / preview['path']
        needs_update = force or (not out_path.exists()) or (out_path.stat().st_size < 5000)
        if not needs_update:
            print(f"  [SKIP] Already good: {out_path.name} ({out_path.stat().st_size} bytes)")
            continue

        if i == 0 and not media_imgs and thumb:
            # Use docProps thumbnail for slide 1 if no media
            t = make_thumb(thumb)
            t.save(out_path, 'JPEG', quality=88, optimize=True)
            print(f"  [OK] Slide 1 from docProps -> {out_path.name}")
            saved += 1
        elif media_imgs:
            # Use media image matching this slide index (wrap around if needed)
            img_index = i % len(media_imgs)
            t = make_thumb(media_imgs[img_index])
            t.save(out_path, 'JPEG', quality=88, optimize=True)
            print(f"  [OK] Slide {i+1} from media[{img_index}] -> {out_path.name}")
            saved += 1
        else:
            print(f"  [SKIP] No image source for slide {i+1}")

    return saved


def main():
    force = '--force' in sys.argv

    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        catalog = json.load(f)

    all_entries = catalog.get('brochure', []) + catalog.get('ppt', [])
    print(f"Processing {len(all_entries)} templates...\n")

    total_saved = 0
    for entry in all_entries:
        print(f"[{entry['id']}]")
        n = process_template(entry, BASE_DIR, force=force)
        total_saved += n
        if n == 0:
            print(f"  → 0 slides saved")

    print(f"\nDone! {total_saved} thumbnail files updated.")


if __name__ == '__main__':
    main()
