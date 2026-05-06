# RenderAI Security Audit

Fecha: 2026-05-05

## Alcance

- Revision de secretos en archivos del repo.
- Revision de endpoints locales relacionados con providers, Luma, export PDF/PPTX y proyectos.
- Revision de archivos temporales, logs y adjuntos pesados no funcionales.
- Validacion del flujo Brochure/PPTX con una imagen real del proyecto.

## Hallazgos Y Acciones

- La clave de Luma se guardo en el almacen seguro local de Windows DPAPI: `%APPDATA%/RenderAIStudio/luma_api_key.secure.txt`.
- `.env.example` quedo sin valores reales de claves y con `USE_MOCK_AI=false`.
- No se encontraron patrones de secretos en el repo despues de la limpieza.
- Se eliminaron temporales/debug ignorados: `test-assets`, `last-openai-body.json`, `tmp-render-body.json`, scripts temporales de descarga y logs `server-*`.
- Se conservo `assets/local-brochure-templates` porque el catalogo de plantillas lo usa para previews y objetos editables.
- Luma queda listo para uso local real cuando se levanta con `start-luma-server.ps1`, porque el launcher crea `PUBLIC_ASSET_BASE_URL` con un Quick Tunnel HTTPS.
- El endpoint de Luma responde con error finito y claro cuando falta `PUBLIC_ASSET_BASE_URL` o cuando una imagen no puede resolverse como URL publica HTTPS.
- El endpoint `/api/video/compose` responde `501` si no hay compositor configurado, sin estados infinitos.
- Se corrigio el store backend de proyectos para no envolver arrays como `value/Count`.

## Validaciones

- `node --check app.js`
- `node --check videoTemplates.js`
- Parse de `start-server.ps1`
- `smoke-test.ps1 -Port 8098`
- `GET /api/providers/status`
- `GET` de un asset local a traves de la URL publica HTTPS, validando respuesta `200`
- Export PDF y PPTX con imagen real adjunta

## Luma Con HTTPS Publico

RenderAI ahora incluye `start-luma-server.ps1`, que:

- descarga `cloudflared.exe` en `%LOCALAPPDATA%/RenderAIStudio/bin` si no existe;
- levanta un Quick Tunnel HTTPS hacia `http://127.0.0.1:8125`;
- inicia `start-server.ps1` con `PUBLIC_ASSET_BASE_URL` apuntando a la URL `https://*.trycloudflare.com`;
- mantiene `USE_MOCK_AI=false`;
- deja logs en `%LOCALAPPDATA%/RenderAIStudio/logs`.

Comando recomendado:

```powershell
.\start-luma-server.ps1 -Port 8125
```

Validacion realizada:

- `GET /api/providers/status` reporta `luma.ready = true`.
- La URL publica sirvio un asset local desde `/outputs/project-assets/...` con HTTP 200.

## Pendiente Operativo Para Produccion

Para uso local con video real, ejecutar:

```powershell
.\start-luma-server.ps1 -Port 8125
```

Para produccion estable, configurar:

```env
PUBLIC_ASSET_BASE_URL=https://tu-dominio-publico.example
```

La URL debe servir assets de proyecto por HTTPS publico. `localhost`, `127.0.0.1` y redes privadas no sirven para image-to-video real.

Quick Tunnel es suficiente para uso local y pruebas. Para produccion estable, usar un Cloudflare Tunnel nombrado o un dominio propio.
