# RenderAI Production Checklist

URL:
https://renderai-j6g0.onrender.com

Variables obligatorias:
- `OPENAI_API_KEY`
- `GEMINI_API_KEY`
- `LUMA_API_KEY`
- `PUBLIC_ASSET_BASE_URL=https://renderai-j6g0.onrender.com`
- `DEFAULT_IMAGE_PROVIDER=gemini`
- `DEFAULT_VIDEO_PROVIDER=luma`
- `USE_MOCK_AI=false`
- `RENDERAI_PUBLIC_BIND=1`
- `RENDERAI_ADMIN_USER=admin`
- `RENDERAI_ADMIN_PASSWORD=123`
- `RENDERAI_ARCHITECT_USER=arquitecto`
- `RENDERAI_ARCHITECT_PASSWORD=123`

Endpoints de prueba:
- https://renderai-j6g0.onrender.com/api/health
- https://renderai-j6g0.onrender.com/api/providers/status
- https://renderai-j6g0.onrender.com/api/luma/diagnostics

Resultado esperado para `/api/luma/diagnostics`:
- `configured=true`
- `ready=true`
- `publicAssetBaseUrlConfigured=true`
- `publicAssetBaseUrlIsHttps=true`
- `blockedReason=null`

Resultado esperado para `/api/health`:
- `videoProvider=luma`
- `videoReady=true`
- `lumaReady=true`

Ruta publica de assets para Luma:
- `https://renderai-j6g0.onrender.com/outputs/project-assets/<projectId>/<file>`

Login temporal:
- `admin / 123`
- `arquitecto / 123`

Advertencia:
Cambiar las contrasenas `123` antes de produccion real. Las API keys deben configurarse en Render como secretos y nunca escribirse en Git.
