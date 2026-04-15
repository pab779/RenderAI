# RenderAI Studio

RenderAI Studio es una experiencia web orientada a arquitectura para dos entregables:

- `Imagen render`: cargas una o varias referencias, el sistema las descompone, eliges la imagen principal, ajustas fidelidad/realismo/estilo/luz/camara/personas y generas una salida visual.
- `Presentacion PDF`: defines paginas, audiencia, tono, guia, programa y soporte base para producir un deck exportable.

## Lo que incluye esta version

- interfaz rediseñada con lenguaje visual arquitectonico mas claro y menos oscuro
- login con dos perfiles de desarrollo y passwords validados por el backend
- modulo de feedback para usuarios
- vista de administrador con bandeja de feedback y estadisticas basicas
- carga multiple de imagenes y seleccion de principal
- descomposicion visual local con:
  - analisis de color, contraste, entorno y materiales
  - deteccion de objetos mediante IA en navegador cuando el runtime puede cargar los modelos
  - OCR en navegador para rotulos y texto cuando el runtime puede cargar el motor
- salida enfocada en humano:
  - galeria de imagenes generadas
  - deck PDF exportable
  - prompt interno oculto salvo debug de administrador
- backend PowerShell con:
  - `GET /api/health`
  - `POST /api/generate-render-image`
  - `POST /api/analyze-reference`
  - `POST /api/generate-presentation-outline`
  - `POST /api/export-pdf`
- soporte hibrido por proveedor:
  - `GEMINI_API_KEY` para renders, imagenes y visuales creativos
  - `OPENAI_API_KEY` para analisis, descomposicion, prompts internos y outline del brochure
- soporte para secreto local cifrado con DPAPI en Windows
- fallback local si no hay clave de OpenAI para que el flujo no se rompa

## Arquitectura de IA y prompts

La separacion de responsabilidades esta documentada en:

- [docs/AI_ROLES_AND_PROMPTS.md](docs/AI_ROLES_AND_PROMPTS.md)

Resumen:

- OpenAI analiza referencias, detecta objetos/materiales/textos, redacta copy y construye prompts internos.
- Gemini genera renders, mood boards, material boards y visuales creativos.
- El frontend mantiene el flujo humano, la seleccion por pasos, feedback y composicion visible.
- La skill `archviz-render-precision` define el contrato de fidelidad: geometria, camara, textos, fondo, objetos y personas se respetan literalmente.

## Templates locales de brochure

La biblioteca de templates descargables/locales vive en:

- [assets/local-brochure-templates/renderai-local-template-library.json](assets/local-brochure-templates/renderai-local-template-library.json)
- [assets/template-previews](assets/template-previews)

La app expone una coleccion curada de `28` templates locales:

- `28` referencias visuales de Canva aportadas por el usuario, con preview local y `canvaId`.
- Los layouts antiguos/nativos no se exponen en la galeria final.

Nota sobre Canva: el repo trabaja con una biblioteca local de referencias visuales descargadas y metadatos de templates. El conector de Canva puede crear/editar disenos cuando hay templates de marca autorizados, pero las URLs publicas de `canva.com/templates/...` no se convierten automaticamente en templates editables del repo. Por eso RenderAI usa previews locales, recetas de composicion y un `canvaGenerationBrief` para mantener el estilo seleccionado dentro del PDF/PPTX.

## Uso local

```powershell
.\start-server.ps1
```

Luego abre:

- [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

## Credenciales de desarrollo

Usuarios disponibles:

- `admin`
- `arquitecto`

En local, si no defines variables, el backend usa passwords de desarrollo para poder probar rapido. En despliegue publico no hay fallback: debes definir `RENDERAI_ADMIN_PASSWORD` y `RENDERAI_ARCHITECT_PASSWORD` como secretos del servicio.

## Variables de entorno opcionales

- `OPENAI_API_KEY`
  - se usa para analisis de referencia, OCR visual asistido, prompts internos y outline del brochure
- `GEMINI_API_KEY`
  - se usa como proveedor preferente para renders, boards visuales e imagenes creativas
  - si no existe pero hay `OPENAI_API_KEY`, el backend puede caer a OpenAI para render
  - si no existe ninguna clave visual, la app sigue funcionando con salida local de fallback y exportacion PDF

## Secreto local seguro para desarrollo

Puedes guardar la clave fuera del repo y cifrada para tu usuario de Windows:

```powershell
.\setup-dev-secret.ps1 -Provider openai
```

O pasando la clave por parametro:

```powershell
.\setup-dev-secret.ps1 -Provider openai -ApiKey "sk-..."
.\setup-dev-secret.ps1 -Provider gemini -ApiKey "AIza..."
```

Esto guarda la clave en:

- `%APPDATA%\RenderAIStudio\openai_api_key.secure.txt`
- `%APPDATA%\RenderAIStudio\gemini_api_key.secure.txt`

El backend busca la clave en este orden:

1. variable de entorno del proveedor (`OPENAI_API_KEY` o `GEMINI_API_KEY`)
2. archivo seguro DPAPI del usuario actual

Para limpiar el secreto local:

```powershell
.\clear-dev-secret.ps1 -Provider all
```

## Smoke test

```powershell
.\smoke-test.ps1
```

## Generar outputs visibles

Para crear una imagen y un PDF visibles en `outputs/`:

```powershell
.\generate-live-assets.ps1
```

## Notas de despliegue

- el proyecto incluye `Dockerfile`, `.dockerignore` y `render.yaml`
- el backend escucha en el puerto que entregue la variable `PORT`
- en Render o cualquier hosting publico debes configurar secrets desde el panel, nunca en git
- la guia completa esta en [docs/DEPLOY_RENDER.md](docs/DEPLOY_RENDER.md)
