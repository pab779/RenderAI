# RenderAI QA Checklist

Use this checklist after every atomic phase and before trusting autosave with older projects.

## 1. Navigation
- Open RenderAI and confirm Home Studio loads when no project is active.
- Open an existing project, switch to Assets, Gallery, Picture Studio, Video Studio and Brochure Studio.
- Reload the browser and confirm the same project and section are restored.
- Click Proyectos and confirm the project data is not deleted or reset.

## 2. Schema v3, Assets and Gallery
- Open a legacy project that contains uploaded inputs and generated outputs.
- Confirm `schemaVersion` is `3` after save.
- Confirm Assets only lists user inputs: uploads, references, plans, PDFs, PPTX, DXF/DWG and documents.
- Confirm Gallery lists generated renders, base images, clips, final videos, PDFs and PPTX outputs.
- Delete a Gallery item and confirm it becomes deleted/outdated without touching Assets.

## 3. Mini-projects and Versioning
- Create a Picture mini-project and confirm it appears in the project sidebar.
- Create a Video mini-project and confirm it stores source asset/gallery ids, not cloned files.
- Duplicate a mini-project and confirm results are referenced by id.
- Archive a mini-project and confirm Gallery items remain visible.

## 4. Picture Studio
- Select at least one Asset and optionally one approved Gallery reference.
- Generate a picture result.
- Confirm the new result is in Gallery, not Assets.
- Request changes and confirm a new Gallery version is created with the prior item as parent.
- Confirm dependent clips/final videos are marked outdated when a source Gallery item changes.

## 5. Brochure Studio
- Select sources from Assets and/or Gallery.
- Export PDF and confirm a Gallery item of type `pdf` is created.
- Export editable PPTX and confirm a Gallery item of type `pptx` is created.
- Try a non-editable template and confirm this message appears:
  `Esta plantilla no conserva capas editables. Sube una plantilla PPTX editable o usa otra.`
- Confirm PDF/PPTX downloads still work.

## 6. Video Templates
- Confirm `window.VIDEO_TEMPLATES.length === 12`.
- Confirm the original seven ids still exist.
- Confirm the five new ids exist: `before-after`, `day-to-night`, `progressive-materiality`, `commercial-walkthrough`, `basic-render-to-photoreal`.
- Validate readiness:
  - Drone tour blocks interiors.
  - Simple 360 warns with one image.
  - CAD to realistic warns when no style/material reference is selected.

## 7. Video Analysis and Prompts
- Select video inputs and run analysis.
- Confirm asset analyses are saved to `asset.analysis`.
- Confirm the video mini-project stores `metadata.visualAnalysis` and `metadata.visualInventory`.
- Open the inspector and confirm it shows template, readiness, inventory, prompts, negative prompts, motion prompts, fidelity rules and warnings.
- Confirm generated stage prompts are meaningfully different.

## 8. Video Studio Pipeline
- Confirm stages are Inputs, Analisis IA, Plan de video, Imagenes base, Clips and Video final.
- Confirm locked stages cannot be skipped.
- Generate base images and confirm each is a Gallery `base_image`.
- Approve at least one base image and confirm clips can be generated only from approved base images.
- Return to a prior stage and confirm versions are preserved.

## 9. Luma, Mock and Final Video
- Run clip generation with no Luma key and confirm the clip fails with a clear error.
- Confirm mock is not used automatically.
- Accept mock explicitly and confirm mock clips carry `provider: "mock"`.
- Confirm polling has a finite timeout and failed clips do not stay processing forever.
- Compose final video without a compositor and confirm it fails with:
  `No hay compositor de video configurado. Puedes descargar clips individuales o configurar FFmpeg.`

## 10. Guide Assistant
- Open the Guide widget.
- Ask a RenderAI workflow question and confirm it answers using current context.
- Ask an unrelated question and confirm it answers:
  `Solo puedo ayudarte a usar RenderAI: proyectos, assets, gallery, picture studio, video studio, brochure studio y configuración.`

## 11. Settings Modal
- Open settings from the sidebar/top controls.
- Confirm Appearance, Providers, Storage and Debug admin sections show real values.
- Confirm no API keys are displayed.
- Confirm storage counts match projects, assets, Gallery items and mini-projects.

## 12. Visual QA
- Check desktop and mobile widths.
- Confirm the sidebar is stable and project navigation does not overlap content.
- Confirm Gallery cards keep media inside their container.
- Confirm workflow nodes do not overlap or overflow.
- Confirm Brochure editor/canvas remains usable.

## 13. Smoke Tests
- Run:
  ```powershell
  .\smoke-test.ps1
  ```
- Confirm index, health, provider status, PDF export and video compose fallback pass.
