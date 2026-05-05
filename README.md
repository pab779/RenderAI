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
- `LUMA_API_KEY`
  - activa generacion real de video image-to-video desde el backend
  - nunca se expone al frontend ni se guarda en localStorage
- `DEFAULT_IMAGE_PROVIDER=gemini`
  - proveedor visual preferente para nuevas generaciones
- `DEFAULT_VIDEO_PROVIDER=luma`
  - proveedor de video preferente cuando Luma esta disponible
- `USE_MOCK_AI=false`
  - si se define en `true`, habilita mock providers locales para probar imagen/video sin gastar creditos
- `PUBLIC_ASSET_BASE_URL`
  - URL publica desde donde Luma puede leer imagenes del proyecto, por ejemplo un despliegue publico o tunel local
  - en localhost sin URL publica, Luma real queda desactivado y la app muestra un mensaje seguro

Consulta `.env.example` para el formato completo.

## Proyectos conversacionales

La pantalla principal autenticada ahora es `Proyectos`. Desde ahi puedes crear un proyecto, abrirlo y trabajar en una experiencia tipo ChatGPT:

- conversacion central con mensajes, adjuntos y resultados
- composer inferior con acciones rapidas: conversar, generar imagen, generar video, generar presentacion, generar PDF, analizar archivos y mejorar prompt
- panel de assets del proyecto con imagenes, videos, PDFs, PPTX, DXF/DWG y referencias
- Video Studio dentro del proyecto
- Presentaciones que conservan el editor PPT/PDF local por capas
- Configuracion con Visual Studio y cola de variaciones

Los proyectos viejos guardados en la memoria local se migran a un esquema v2 con `messages`, `assets`, `generationJobs`, `videoJobs`, `settings` y `coverAssetId`, manteniendo compatibilidad con `images`, `documents` y resultados previos.

## Video production pipeline

El flujo de video ahora vive dentro de cada proyecto como una produccion por etapas:

Usuario -> Proyecto -> Assets fuente -> Plantilla -> ChatGPT prompts -> Gemini/OpenAI imagenes base por lote -> aprobacion del usuario -> Luma clips individuales -> aprobacion de clips -> composicion final -> Asset final -> Conversation message

Video Studio se muestra como un workflow visual, no como formulario ni wizard:

- Seleccionar inputs desde Assets: el usuario elige fotos, renders o referencias ya guardadas en el proyecto; Video Studio no pide subir archivos ahi.
- WorkflowProgressRail: las etapas `Inputs`, `Imagenes base`, `Clips` y `Video final` cambian entre `locked`, `active`, `completed` y `failed`.
- ActiveStagePanel: solo la etapa activa expone controles principales; las etapas siguientes quedan bloqueadas hasta cumplir aprobaciones.
- Workflow board horizontal: `createVideoWorkflowGraph(videoProduction)` deriva nodos y conectores desde `sourceAssetIds`, `baseImages`, `clips` y `finalVideoAssetId`.
- Inputs -> imagenes base: solo los assets dados por el usuario (`uploaded`, `imported` o `manual`) pueden ser fuentes iniciales.
- Outputs IA transitorios: imagenes base y clips generados se guardan como assets con `metadata.transient`, pero no aparecen como inputs iniciales de Video Studio.
- Imagenes base -> clips: solo imagenes aprobadas pueden convertirse en clip.
- Clips -> video final: los clips aprobados convergen en el nodo final.
- Video final: si FFmpeg no esta disponible, la app usa un fallback claro de secuencia y conserva los clips individuales como assets.

Cada imagen base y cada clip permite:

- aprobar
- pedir cambios
- regenerar solo ese elemento
- ver prompt
- comparar con la referencia

Las 7 plantillas iniciales viven en `videoTemplates.js`:

1. Tour de dron.
2. Construccion desde obra gris.
3. Decoracion progresiva.
4. Vista frontal a vista aerea.
5. Vista 360 sencilla.
6. Recorrido arquitectonico.
7. De planos AutoCAD a realista.

Cada `baseImageOutput` define `basePrompt`, `editInstructions`, `mustShow`, `mustNotShow` y `negativePrompt`. La plantilla `Decoracion progresiva` fuerza una narrativa distinta: espacio vacio, mobiliario inicial, materiales e iluminacion, decoracion avanzada y resultado final. El helper `buildStagePrompt` combina esas instrucciones con `STRICT_ARCHITECTURAL_FIDELITY_PROMPT` para evitar cinco variantes de la misma escena final.

Luma requiere imagenes con URL publica HTTPS. RENDEAI materializa data URLs del proyecto en `outputs/project-assets/` y construye URLs usando `PUBLIC_ASSET_BASE_URL`. Si `LUMA_API_KEY` no existe, o si `PUBLIC_ASSET_BASE_URL` apunta a localhost/red privada/no HTTPS, la app no se rompe: muestra un bloqueo seguro y puede usar `mockVideoProvider` si `USE_MOCK_AI=true`. El backend llama `POST https://api.lumalabs.ai/dream-machine/v1/generations` con `keyframes.frame0`; el frontend nunca llama a Luma directamente.

La fidelidad arquitectonica es la regla base del pipeline: no se modifica geometria, distribucion, composicion, fachadas, ventanas, puertas, mobiliario, objetos, materiales principales ni rotulacion salvo que el usuario lo pida explicitamente.

## Visual Profile

La seccion `Configuracion > Visual Studio` acepta un prompt visual y genera un perfil validado. El backend puede pedir JSON estructurado a OpenAI, pero el frontend solo aplica tokens permitidos:

- paleta hex controlada
- tipografias permitidas
- radios, sombras, densidad y decoracion limitada

No se inyecta CSS crudo generado por IA.

## Seguridad de claves

- No pongas API keys en React, HTML, CSS, `app.js`, screenshots, README ni consola.
- Las claves reales deben vivir solo en variables de entorno del backend.
- Rota cualquier key que haya sido pegada por error en una conversacion, issue o archivo.
- Los endpoints de health solo devuelven estados booleanos como `lumaConfigured`, `lumaReady` o `mockAi`; nunca devuelven valores de claves.

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
