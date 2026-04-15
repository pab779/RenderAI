# RenderAI Studio - roles de IA, prompts y skills

Este documento define como debe pensar el producto antes de generar una imagen o un brochure. La meta es evitar resultados aleatorios: cada IA tiene una responsabilidad concreta, cada prompt tiene un contrato, y cada salida visible debe respetar lo que el usuario escogio.

## Objetivo del sistema

RenderAI Studio no debe funcionar como un generador libre. Debe funcionar como un sistema de produccion arquitectonica:

- El usuario carga referencias reales del proyecto.
- El sistema descompone esas referencias en objetos, materiales, textos, entorno, camara, composicion y riesgos.
- El usuario toma decisiones mediante opciones controladas, no escribiendo prompts largos.
- El prompt largo existe, pero queda interno.
- La salida visible es una imagen renderizada o un brochure/PDF.

## Reparto de trabajo entre IAs

### OpenAI: capa analitica y editorial

OpenAI no debe producir renders finales dentro del flujo principal si Gemini esta disponible. Su rol es pensar, leer y escribir con precision.

Responsabilidades:

- Analizar imagenes de referencia con vision.
- Detectar objetos visibles, textos, rotulos, materiales, fondo, vegetacion, luz, camara y riesgos.
- Convertir decisiones del usuario en instrucciones tecnicas para el motor visual.
- Redactar copy del brochure en espanol o ingles sin typos, sin placeholder y sin texto roto.
- Crear el outline narrativo del PDF respetando el orden de secciones elegido por el usuario.
- Preparar prompts especificos para cada imagen que Gemini debe renderizar.
- Preparar prompts especificos para mood boards, material boards y visuales conceptuales.

Regla de OpenAI:

- No inventar informacion si la referencia no la muestra.
- No crear texto falso.
- No ampliar programa, amenidades o paisaje si el usuario no lo pidio.
- Devolver JSON estructurado cuando el backend lo pide.

Funciones relacionadas:

- `Invoke-OpenAiReferenceAnalysis` en `start-server.ps1`.
- `Invoke-OpenAiPresentationOutline` en `start-server.ps1`.
- `buildRenderPrompt` en `app.js`.
- `buildPdfProjectRenderPrompt` en `app.js`.
- `buildRenderDecisionManifest` en `app.js`.

### Gemini: capa visual y creativa controlada

Gemini es el motor visual preferente del repo. Debe ejecutar, no reinterpretar.

Responsabilidades:

- Generar renders finales de una referencia seleccionada.
- Generar variantes visuales cuando una slide pide un tratamiento individual.
- Generar mood boards tipo Pinterest sin texto.
- Generar material boards sin texto.
- Generar visuales creativos derivados de la paleta, materiales y referencias.

Regla de Gemini:

- Mantener geometria, camara, composicion, objetos, textos visibles, fondo y personas segun la seleccion del usuario.
- Si el usuario escoge `sin personas`, el resultado debe tener cero personas.
- Si el usuario escoge `con personas`, debe mostrar 1 a 3 personas naturales.
- Si el usuario escoge `muchas personas`, debe mostrar ocupacion claramente visible.
- No renderizar todas las imagenes cargadas; solo las imagenes que el usuario asigno a la salida o a una slide.
- Las demas imagenes sirven como contexto, no como gasto visual.

Funciones relacionadas:

- `Invoke-GeminiImageGenerate` en `start-server.ps1`.
- `requestAiRender` en `app.js`.
- `buildPdfProjectVisuals` en `app.js`.
- `buildAiDeckVisualKit` en `app.js`.

### Cliente local: capa de UX, memoria y composicion

El navegador y el codigo local coordinan el flujo humano.

Responsabilidades:

- Login demo y permisos de admin/usuario.
- Drag and drop de imagenes y documentos.
- Seleccion de flujo: render o PDF.
- Seleccion de imagen principal.
- Correcciones manuales a objetos, materiales y textos detectados.
- Seleccion de estilo, luz, personas, lente, acabado y nivel de fidelidad.
- Seleccion de secciones del brochure.
- Configuracion individual de cada slide.
- Composicion final del PDF si el backend no delega todo a un proveedor externo.
- Memoria de feedback para mejorar decisiones futuras.

Funciones relacionadas:

- Estado global `state` en `app.js`.
- UI renderizada desde `renderAll` en `app.js`.
- Exportacion visible de PDF en `/api/export-pdf`.

## Skills internas que deben guiar el producto

### `archviz-render-precision`

Se usa para todo lo relacionado con renderizacion arquitectonica fiel.

Reglas que aporta:

- La imagen de entrada es geometria aprobada, no inspiracion.
- La camara, crop, composicion, textos, rotulos, fondo y objetos visibles quedan bloqueados.
- La ocupacion humana se respeta literalmente.
- La fidelidad es mas importante que la belleza.
- Si el entregable es PDF, el resultado visible debe ser brochure/PDF, no prompt.

Uso dentro del repo:

- Sus reglas se transforman en `buildAiRoleAndSkillContract`.
- Sus restricciones se refuerzan en `buildStrictStyleDirective`.
- Sus decisiones se reflejan en `buildRenderDecisionManifest`.

### `ui-ux-pro-max`

Se usa para evolucionar la interfaz y la galeria de estilos.

Reglas que aporta:

- La UI debe sentirse de producto profesional, no formulario basico.
- Los estilos deben diferenciarse por layout, ritmo, tipografia, composicion y densidad, no solo por color.
- El selector de templates debe sentirse como una biblioteca visual tipo Canva, pero orientada a arquitectura.
- Las opciones deben ser visuales y humanas: previews, cards, estados claros, pasos lineales y decisiones progresivas.

Uso recomendado:

- Paso 1: insumos.
- Paso 2: descomposicion editable.
- Paso 3: estilo de brochure, secciones, orden, fuente y paleta.
- Paso 4: parametrizacion slide por slide.
- Paso 5: generar resultado final una sola vez.

### `canva-branded-presentation`

Se usa solo si el conector de Canva y los permisos disponibles permiten generar o trabajar con designs/templates reales en Canva.

Regla importante:

- No depender del scraping de URLs publicas de Canva como flujo principal. Esas paginas pueden estar protegidas y no garantizan assets descargables.
- En el repo se puede guardar una biblioteca propia de estilos inspirados en patrones editoriales, sin copiar assets protegidos.

## Contrato de prompt para renders

Todo prompt de render debe contener estas capas, en este orden:

1. Objetivo visible: convertir una referencia arquitectonica en imagen final.
2. Bloqueo: misma geometria, camara, crop, composicion, objetos, texto, fondo y escala.
3. Contrato de roles: OpenAI analiza, Gemini ejecuta, ArchViz precision bloquea.
4. Manifiesto de decisiones del usuario.
5. Directiva tecnica de estilo: fotografia, 3D premium, lineal o mixto.
6. Detalles de la escena: objetos, textos, materiales, entorno.
7. Riesgos a evitar.
8. Personas exactas.
9. Tratamiento visual: luz, hora, lente, clima, grano, contraste.
10. Negative constraints.

Ejemplo de intencion interna:

```text
Treat the input as approved final geometry, not inspiration.
OpenAI/analysis layer reads objects, materials, visible text, composition, environment and risks.
Gemini/image layer must produce the visual result only.
User decisions override model taste.
Existing signage/text must remain verbatim.
PEOPLE: Zero people. No figures, silhouettes, reflections, or background extras. Absolute rule.
```

## Contrato de prompt para PDF/brochure

El PDF debe generarse como un sistema de varias llamadas, no como un solo prompt improvisado.

Pipeline correcto:

1. OpenAI analiza todas las referencias cargadas.
2. El usuario escoge tipo de brochure, idioma, secciones, orden, paleta, fuentes y tono.
3. El usuario configura cada slide: layout, imagen, posicion, tamano, render o cruda, tratamiento, texto sugerido o texto libre.
4. OpenAI genera texto final por slide y prompts visuales por asset.
5. Gemini renderiza solo las imagenes que se van a usar.
6. Gemini genera mood boards/material boards si esas secciones existen.
7. El frontend/backend compone el PDF con los assets ya listos.
8. El resultado se muestra una sola vez en paso final con opciones de descarga, feedback, rehacer o empezar nuevo.

Reglas para texto:

- Todo texto debe estar en el idioma escogido.
- No se aceptan typos, pseudo-palabras, OCR roto ni placeholders.
- El texto debe ser breve, editorial y util.
- Las imagenes generadas no deben incluir tipografia nueva; el texto editable lo coloca el sistema de brochure.

## Estrategia para ahorrar tokens y costo

La app debe evitar dobles generaciones.

Reglas:

- El paso 4/5 debe decir `Generar resultado`, no `Siguiente`.
- Al presionar generar, se congela el formulario y se ejecuta una sola generacion completa.
- No se renderizan imagenes no seleccionadas.
- Las imagenes no seleccionadas se usan solo como analisis/contexto.
- Si una slide pide imagen cruda, no se manda a Gemini.
- Mood board y material board se generan solo si esas secciones fueron seleccionadas.
- Feedback se pide despues del resultado, nunca antes.

## Criterios de calidad

Antes de dar por buena una salida:

- La seleccion de personas se cumplio literalmente.
- La escena no fue redisenada.
- Los textos visibles de la referencia no fueron cambiados.
- El resultado visual respeta el estilo escogido.
- El PDF no parece reporte plano: debe sentirse brochure editorial.
- Las slides tienen layouts variados.
- Mood board y material board son visuales, sin palabras falsas.
- El copy del brochure es legible y profesional.
- La salida se puede descargar.

## Decision de arquitectura actual

La arquitectura actual del repo queda asi:

- OpenAI = analisis, descomposicion, prompts internos, texto y narrativa.
- Gemini = renders, imagenes finales, mood boards, material boards y visuales creativos.
- Frontend local = UX, decisiones humanas, preview, memoria, feedback y composicion.
- PowerShell backend = servidor local, seguridad de claves DPAPI, endpoints API y puente hacia proveedores.

Esta separacion es deliberada: reduce tokens, mejora control humano y evita que el motor visual improvise el proyecto.
