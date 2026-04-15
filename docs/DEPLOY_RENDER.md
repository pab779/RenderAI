# Deploy seguro en Render

RenderAI Studio esta listo para desplegarse como Web Service Docker. El repo no debe contener claves, outputs privados ni archivos temporales; las claves se configuran como variables secretas del servicio.

## Variables obligatorias

Configura estas variables en el panel del servicio:

- `OPENAI_API_KEY`: analisis, descomposicion, copy, outlines y prompts internos.
- `GEMINI_API_KEY`: renders, mood boards, material boards y visuales creativos.
- `RENDERAI_ADMIN_PASSWORD`: password real para el usuario administrador.
- `RENDERAI_ARCHITECT_PASSWORD`: password real para el usuario arquitecto.

RenderAI falla de forma segura en despliegue publico si no existen passwords de servidor. Localmente mantiene defaults de desarrollo para pruebas rapidas, pero en Render no.

## Variables incluidas por blueprint

El archivo `render.yaml` incluye:

- `RENDERAI_PUBLIC_BIND=1`
- `RENDERAI_ADMIN_USER=admin`
- `RENDERAI_ARCHITECT_USER=arquitecto`

El contenedor escucha la variable `PORT` del host. El Dockerfile usa `10000` como default compatible con Render.

## Pasos

1. Sube la rama a GitHub.
2. En Render, crea un Web Service desde el repo privado.
3. Usa Docker como entorno.
4. Agrega las variables secretas anteriores.
5. Despliega.

## Verificacion

Cuando el servicio este arriba:

- `GET /api/health` debe responder `status: ok`.
- `authConfigured` debe ser `true`.
- `renderReady` debe ser `true` si `GEMINI_API_KEY` u `OPENAI_API_KEY` estan configuradas.
- `analysisReady` debe ser `true` si `OPENAI_API_KEY` esta configurada.

## Seguridad

- No subas `.env`.
- No subas `outputs/`.
- No subas `*.secure.txt`.
- No copies claves en README, issues, commits, PRs ni capturas.
- Rota cualquier key que haya sido pegada por error en una conversacion o archivo.
