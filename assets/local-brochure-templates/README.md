# RenderAI local brochure templates

Esta carpeta registra la biblioteca local de templates de brochure usada por RenderAI Studio.

## Que contiene

- 38 templates locales activos.
- 10 templates importados desde el PowerPoint local `Plantillas.pptx`, con previews exportados slide por slide.
- 28 templates basados en referencias visuales aportadas por el usuario desde Canva, con preview local descargado y `canvaId` preservado como referencia.

## Importante sobre Canva

El conector de Canva disponible en esta cuenta no permite convertir templates publicos de `canva.com/templates/...` en brand templates editables dentro del repo. La busqueda de brand templates respondio que esa funcionalidad requiere Canva Enterprise.

Por eso el repo no guarda plantillas editables copiadas de Canva. Guarda:

- previews locales para seleccion visual;
- el PowerPoint local reconstruido desde `D:\Plantillas.rar` como `ppt/plantillas/Plantillas.pptx`;
- metadata de referencia;
- tokens de layout y estilo propios de RenderAI;
- prompts de handoff para crear una presentacion nueva en Canva si se usa el conector de generacion.

Los slides de mood board y materialidad se componen como tableros de materiales: muestras simuladas
de madera, piedra, concreto, metal, vidrio, vegetacion y textil, mas una referencia pequena del
proyecto para mantener contexto visual.

## Uso dentro de la app

La fuente operativa esta en `app.js`, funcion `buildBrochureTemplateLibrary()`. El archivo `renderai-local-template-library.json` existe como manifest descargable/documental para revisar la coleccion sin abrir el codigo.
