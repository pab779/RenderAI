# RenderAI

Workspace local para dos flujos de trabajo arquitectonicos:

- `Render de imagen`: transforma una referencia visual en un prompt largo para archviz.
- `Presentacion PDF`: construye un outline slide por slide para una presentacion comercial y tecnica.

## Estado actual

Esta version incluye frontend y backend local listos para prueba. Incluye:

- `index.html` restaurado
- `app.js` con selector de modo `Render / Presentacion`
- `styles.css` con identidad glassmorphism y layout responsive
- `start-server.ps1` con API local para generacion y exportacion PDF
- `smoke-test.ps1` para validar el flujo principal

La generacion funciona localmente por reglas y plantillas. No depende de OpenAI para operar.

## Uso local

1. Abre PowerShell en esta carpeta.
2. Ejecuta:

```powershell
.\start-server.ps1
```

3. Abre [http://127.0.0.1:8080/](http://127.0.0.1:8080/).

## Smoke test

```powershell
.\smoke-test.ps1
```
