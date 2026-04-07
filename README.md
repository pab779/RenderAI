# RenderAI Studio

RenderAI Studio es una experiencia web orientada a arquitectura para dos entregables:

- `Imagen render`: cargas una o varias referencias, el sistema las descompone, eliges la imagen principal, ajustas fidelidad/realismo/estilo/luz/camara/personas y generas una salida visual.
- `Presentacion PDF`: defines paginas, audiencia, tono, guia, programa y soporte base para producir un deck exportable.

## Lo que incluye esta version

- interfaz rediseñada con lenguaje visual arquitectonico mas claro y menos oscuro
- login demo con dos perfiles:
  - `admin / 123`
  - `arquitecto / 123`
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
  - `POST /api/export-pdf`
- soporte para OpenAI en servidor via `OPENAI_API_KEY`
- fallback local si no hay clave de OpenAI para que el flujo no se rompa

## Uso local

```powershell
.\start-server.ps1
```

Luego abre:

- [http://127.0.0.1:8080/](http://127.0.0.1:8080/)

## Credenciales demo

- usuario: `admin`
  - password: `123`
- usuario: `arquitecto`
  - password: `123`

## Variables de entorno opcionales

- `OPENAI_API_KEY`
  - si existe, el backend intenta producir imagen render con OpenAI usando edicion de imagen con alta fidelidad
  - si no existe, la app sigue funcionando con una salida visual local de fallback y exportacion PDF

## Smoke test

```powershell
.\smoke-test.ps1
```

## Notas de despliegue

- el frontend es estatico
- el backend actual esta escrito en PowerShell para entorno Windows
- para un hosting web productivo puedes desplegarlo en un servicio Windows o portar `start-server.ps1` a Node / .NET manteniendo la misma API
