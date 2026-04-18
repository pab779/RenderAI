---
name: archviz-render-precision
description: "Use when building prompts, UX, validations, or automation for architectural image-to-render conversion where geometry, camera, objects, texts, materials, occupancy, and brochure outputs must stay locked and fidelity-first."
---

# ArchViz Render Precision

Use this skill when the task is to convert architectural references into high-fidelity renders or brochure visuals without redesigning the project.

## Core rules

- Treat the input image as approved geometry, not inspiration.
- Keep camera, crop, composition, text, signage, background, and all visible objects locked unless the user explicitly requests a change.
- Respect occupancy exactly:
  - `sin personas` means zero visible people.
  - `pocas personas` means 1 to 3 natural secondary people.
  - `muchas personas` means clearly occupied and visibly active.
- Prefer fidelity over beauty and precision over creativity.
- If output is a brochure, the visible deliverable is the brochure or PDF, never the internal prompt.

## Render workflow

1. Read the scene: objects, texts, materials, environment, composition, risks.
2. Merge automatic reading with manual corrections from the user.
3. Convert decisions into prompt clauses:
   - fidelity
   - realism
   - image mood
   - render language
   - time of day
   - light scenario
   - angle
   - occupancy
   - representation style
   - image finish
   - climate
   - lens profile
4. Add hard negative constraints:
   - no redesign
   - no camera move
   - no text change
   - no invented landscape
   - no geometry drift
5. If the user writes a targeted change request, modify only that and keep everything else frozen.

## Brochure workflow

1. Build slide sections from explicit user selection.
2. Keep slides visual-first and brochure-ready.
3. Use project images only where requested per slide.
4. For mood boards and material boards, derive editorial boards from project visuals, palette, crops, and material cues.
5. Keep text minimal, commercial, and presentation-grade.

## Validation checklist

- Are visible texts preserved verbatim?
- Are materials aligned with what the reference actually shows?
- Does occupancy match the selected mode?
- Did the output preserve the same space and not redesign it?
- Does the PDF feel like a brochure instead of a text report?
