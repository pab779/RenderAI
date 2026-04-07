const state = {
  mode: "render",
  items: [],
  documents: [],
  mainId: null,
  prompt: "",
  promptSource: "local",
  server: { healthy: false, syncTimeout: null, requestId: 0 },
  settings: loadSettings(),
};

const elements = {};

window.addEventListener("error", (event) => showBootError(event.error?.message || event.message || "Unexpected error."));
window.addEventListener("unhandledrejection", (event) => showBootError(event.reason?.message || String(event.reason || "Unhandled promise rejection.")));

document.addEventListener("DOMContentLoaded", () => {
  try {
    init();
  } catch (error) {
    showBootError(error?.message || "Failed to initialize app.");
    throw error;
  }
});

function init() {
  [
    "imageInput", "documentInput", "dropzone", "heroUploadBtn", "copyPresetBtn", "copyPromptBtn", "downloadJsonBtn",
    "generateOutputBtn", "exportPdfBtn", "modeRenderBtn", "modePresentationBtn", "apiStatus", "uploadTitle", "uploadHint",
    "imageCountPill", "analysisStatus", "mainPreview", "previewEmpty", "previewOverlay", "metaResolution", "metaAspect",
    "metaLight", "metaEdges", "thumbGrid", "documentList", "sceneProfile", "sceneSummary", "paletteSwatches", "riskList",
    "qaChecklist", "renderStage", "renderInsights", "presentationStage", "presentationSummary", "presentationTypology",
    "presentationLocation", "presentationSlides", "presentationDocsInfo", "renderControls", "presentationControls",
    "controlsHeading", "outputHeading", "projectContext", "fidelity", "realism", "fidelityLabel", "realismLabel",
    "imageStyle", "renderStyle", "timeOfDay", "lightType", "photoAngle", "peopleMode", "promptLanguage",
    "presentationContext", "projectTypology", "projectLocation", "projectProgram", "commercialTone", "needsPlans",
    "slideCount", "presentationGoal", "promptOutput", "promptLength", "promptMode", "promptConfidence"
  ].forEach((id) => {
    elements[id] = document.getElementById(id);
  });

  hydrateSettings();
  bindEvents();
  renderLists();
  setMode(state.settings.workflowMode || "render", true);
  updatePrompt();
  checkApiHealth();
  queueOutputSync();
}

function bindEvents() {
  elements.heroUploadBtn.addEventListener("click", triggerPrimaryUpload);
  elements.dropzone.addEventListener("click", triggerPrimaryUpload);
  elements.imageInput.addEventListener("change", (event) => handleImageFiles(event.target.files));
  elements.documentInput.addEventListener("change", (event) => handleDocumentFiles(event.target.files));
  elements.modeRenderBtn.addEventListener("click", () => setMode("render"));
  elements.modePresentationBtn.addEventListener("click", () => setMode("presentation"));
  elements.copyPresetBtn.addEventListener("click", async () => {
    await copyText(state.mode === "render" ? buildRenderPrompt() : buildPresentationOutline());
    flashButton(elements.copyPresetBtn, "Copiado");
  });
  elements.copyPromptBtn.addEventListener("click", async () => {
    await copyText(state.prompt);
    flashButton(elements.copyPromptBtn, "Copiado");
  });
  elements.generateOutputBtn.addEventListener("click", async () => syncOutputWithBackend(true));
  elements.exportPdfBtn.addEventListener("click", exportCurrentOutputPdf);
  elements.downloadJsonBtn.addEventListener("click", downloadPayload);

  const controls = [
    "projectContext", "fidelity", "realism", "imageStyle", "renderStyle", "timeOfDay", "lightType", "photoAngle",
    "peopleMode", "promptLanguage", "presentationContext", "projectTypology", "projectLocation", "projectProgram",
    "commercialTone", "needsPlans", "slideCount", "presentationGoal"
  ];

  controls.forEach((id) => {
    elements[id].addEventListener("input", onSettingsChange);
  });
}

function hydrateSettings() {
  Object.entries(state.settings).forEach(([key, value]) => {
    if (elements[key]) elements[key].value = value;
  });
  updateRangeLabels();
}

function setMode(mode, silent = false) {
  state.mode = mode === "presentation" ? "presentation" : "render";
  state.settings.workflowMode = state.mode;

  const presentation = state.mode === "presentation";
  elements.modeRenderBtn.classList.toggle("active", !presentation);
  elements.modePresentationBtn.classList.toggle("active", presentation);
  elements.modeRenderBtn.setAttribute("aria-pressed", String(!presentation));
  elements.modePresentationBtn.setAttribute("aria-pressed", String(presentation));
  elements.thumbGrid.classList.toggle("hidden", presentation);
  elements.documentList.classList.toggle("hidden", !presentation);
  elements.renderStage.classList.toggle("hidden", presentation);
  elements.renderInsights.classList.toggle("hidden", presentation);
  elements.presentationStage.classList.toggle("hidden", !presentation);
  elements.renderControls.classList.toggle("hidden", presentation);
  elements.presentationControls.classList.toggle("hidden", !presentation);
  elements.controlsHeading.textContent = presentation ? "Brief de presentacion" : "Parametros de render";
  elements.outputHeading.textContent = presentation ? "Outline de presentacion" : "Prompt final de render";
  elements.heroUploadBtn.textContent = presentation ? "Cargar archivos base" : "Cargar referencias";
  elements.copyPresetBtn.textContent = presentation ? "Copiar outline base" : "Copiar prompt base";
  elements.uploadTitle.textContent = presentation ? "Arrastra PDFs, planos o imagenes base" : "Arrastra imagenes de referencia";
  elements.uploadHint.textContent = presentation
    ? "Sube PDFs, planos o capturas para enriquecer la estructura del deck."
    : "Sube imagenes o renders base para fijar composicion, materiales y atmosfera.";

  updateImageCount();
  updatePresentationPanel();
  updatePrompt();
  if (!silent) {
    persistSettings();
    queueOutputSync();
  }
}

function triggerPrimaryUpload() {
  if (state.mode === "presentation") {
    elements.documentInput.click();
  } else {
    elements.imageInput.click();
  }
}

function onSettingsChange() {
  state.settings = {
    ...state.settings,
    workflowMode: state.mode,
    projectContext: elements.projectContext.value,
    fidelity: elements.fidelity.value,
    realism: elements.realism.value,
    imageStyle: elements.imageStyle.value,
    renderStyle: elements.renderStyle.value,
    timeOfDay: elements.timeOfDay.value,
    lightType: elements.lightType.value,
    photoAngle: elements.photoAngle.value,
    peopleMode: elements.peopleMode.value,
    promptLanguage: elements.promptLanguage.value,
    presentationContext: elements.presentationContext.value,
    projectTypology: elements.projectTypology.value,
    projectLocation: elements.projectLocation.value,
    projectProgram: elements.projectProgram.value,
    commercialTone: elements.commercialTone.value,
    needsPlans: elements.needsPlans.value,
    slideCount: elements.slideCount.value,
    presentationGoal: elements.presentationGoal.value,
  };
  updateRangeLabels();
  updatePresentationPanel();
  updatePrompt();
  persistSettings();
  queueOutputSync();
}

function updateRangeLabels() {
  elements.fidelityLabel.textContent = `${elements.fidelity.value} / ${describeLevel(elements.fidelity.value, ["ligero", "medio", "alto", "absoluto"])}`;
  elements.realismLabel.textContent = `${elements.realism.value} / ${describeLevel(elements.realism.value, ["basico", "alto", "muy alto", "fotografico"])}`;
}

function describeLevel(value, labels) {
  const numeric = Number(value);
  if (numeric >= 9) return labels[3];
  if (numeric >= 7) return labels[2];
  if (numeric >= 5) return labels[1];
  return labels[0];
}

function handleImageFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;

  files.forEach((file) => {
    const item = { id: makeId(), file, name: file.name, url: URL.createObjectURL(file), analysis: null };
    state.items.unshift(item);
    if (!state.mainId) state.mainId = item.id;
    analyzeItem(item).finally(() => {
      renderLists();
      updateRenderPanel();
      updatePrompt();
      queueOutputSync();
    });
  });

  renderLists();
  updateImageCount();
  updateRenderPanel();
  updatePrompt();
}

function handleDocumentFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  files.forEach((file) => {
    state.documents.unshift({ id: makeId(), name: file.name, size: file.size, type: file.type || "application/octet-stream" });
  });
  renderLists();
  updateImageCount();
  updatePresentationPanel();
  updatePrompt();
  queueOutputSync();
}

async function analyzeItem(item) {
  try {
    const image = await loadImage(item.url);
    const ratio = image.naturalWidth / Math.max(1, image.naturalHeight);
    const canvas = document.createElement("canvas");
    const max = 140;
    const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let light = 0;
    let warm = 0;
    let cool = 0;
    const palette = new Map();
    for (let index = 0; index < data.length; index += 4) {
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const l = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      light += l;
      if (r > b + 16) warm += 1;
      if (b > r + 16) cool += 1;
      const key = `${Math.round(r / 40) * 40},${Math.round(g / 40) * 40},${Math.round(b / 40) * 40}`;
      palette.set(key, (palette.get(key) || 0) + 1);
    }

    const total = Math.max(1, data.length / 4);
    const brightness = light / total;
    const paletteList = [...palette.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([key]) => key.split(",").map(Number));
    item.analysis = {
      originalWidth: image.naturalWidth,
      originalHeight: image.naturalHeight,
      aspectLabel: ratio > 1.55 ? "16:9" : ratio > 1.1 ? "4:3" : "vertical",
      sceneType: ratio > 1.45 ? "wide interior archviz" : "architectural reference",
      brightnessLabel: brightness > 0.68 ? "high-key" : brightness < 0.26 ? "low-key" : "balanced",
      lightMood: warm > cool ? "warm daylight" : cool > warm ? "cool daylight" : "soft balanced light",
      edgeLabel: `${Math.max(8, Math.round(Math.abs(0.5 - brightness) * 50 + 12))}%`,
      paletteMood: warm > cool ? "warm" : cool > warm ? "cool" : "balanced",
      angleHint: ratio > 1.45 ? "wide interior perspective" : "slight three-quarter angle",
      palette: paletteList,
      riskFlags: brightness < 0.2 ? ["exposure muy baja"] : brightness > 0.82 ? ["imagen muy clara"] : ["sin riesgos mayores"],
    };
  } catch {
    item.analysis = {
      originalWidth: 0,
      originalHeight: 0,
      aspectLabel: "16:9",
      sceneType: "architectural reference",
      brightnessLabel: "balanced",
      lightMood: "soft balanced light",
      edgeLabel: "18%",
      paletteMood: "balanced",
      angleHint: "wide interior perspective",
      palette: [[32, 48, 64], [96, 118, 136], [180, 195, 208]],
      riskFlags: ["fallback analysis"],
    };
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function renderLists() {
  renderImageList();
  renderDocumentList();
  updateImageCount();
  updateRenderPanel();
  updatePresentationPanel();
  updateChecklist();
}

function renderImageList() {
  elements.thumbGrid.innerHTML = "";
  if (!state.items.length) {
    elements.thumbGrid.innerHTML = `<div class="card"><p>No hay imagenes cargadas todavia.</p></div>`;
    return;
  }

  state.items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "item";
    const active = item.id === state.mainId;
    article.innerHTML = `
      <img src="${item.url}" alt="${escapeHtml(item.name)}" />
      <div class="item-head">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.analysis ? `${item.analysis.aspectLabel} · ${item.analysis.sceneType}` : "Analizando referencia...")}</p>
        </div>
        <span class="chip">${active ? "Principal" : "Referencia"}</span>
      </div>
      <div class="item-actions">
        <button type="button" class="button secondary use-btn">Usar principal</button>
        <button type="button" class="button secondary delete-btn">Eliminar</button>
      </div>
    `;
    article.querySelector(".use-btn").addEventListener("click", () => {
      state.mainId = item.id;
      renderLists();
      updatePrompt();
      queueOutputSync();
    });
    article.querySelector(".delete-btn").addEventListener("click", () => removeImage(item.id));
    elements.thumbGrid.appendChild(article);
  });
}

function renderDocumentList() {
  elements.documentList.innerHTML = "";
  if (!state.documents.length) {
    elements.documentList.innerHTML = `<div class="card"><p>No hay archivos base cargados todavia.</p></div>`;
    return;
  }

  state.documents.forEach((doc) => {
    const article = document.createElement("article");
    article.className = "item";
    article.innerHTML = `
      <div class="item-head">
        <div>
          <strong>${escapeHtml(doc.name)}</strong>
          <p>${escapeHtml(formatFileSize(doc.size))} · ${escapeHtml(doc.type)}</p>
        </div>
        <span class="chip">Base</span>
      </div>
      <div class="item-actions">
        <button type="button" class="button secondary delete-btn">Eliminar</button>
      </div>
    `;
    article.querySelector(".delete-btn").addEventListener("click", () => {
      state.documents = state.documents.filter((item) => item.id !== doc.id);
      renderLists();
      updatePrompt();
      queueOutputSync();
    });
    elements.documentList.appendChild(article);
  });
}

function removeImage(id) {
  const index = state.items.findIndex((item) => item.id === id);
  if (index === -1) return;
  const [removed] = state.items.splice(index, 1);
  URL.revokeObjectURL(removed.url);
  if (state.mainId === id) state.mainId = state.items[0]?.id || null;
  renderLists();
  updatePrompt();
  queueOutputSync();
}

function updateImageCount() {
  if (state.mode === "presentation") {
    elements.imageCountPill.textContent = `${state.documents.length} archivos base`;
  } else {
    elements.imageCountPill.textContent = `${state.items.length} referencias`;
  }
}

function updateRenderPanel() {
  const main = getMainItem();
  if (!main) {
    elements.analysisStatus.textContent = "Esperando imagen";
    elements.mainPreview.classList.add("hidden");
    elements.previewOverlay.classList.add("hidden");
    elements.previewEmpty.classList.remove("hidden");
    elements.sceneProfile.textContent = "Sin datos";
    elements.sceneSummary.textContent = "Carga una imagen para obtener una lectura automatica de escena.";
    elements.metaResolution.textContent = "-";
    elements.metaAspect.textContent = "-";
    elements.metaLight.textContent = "-";
    elements.metaEdges.textContent = "-";
    elements.paletteSwatches.innerHTML = "";
    elements.riskList.innerHTML = "";
    return;
  }

  const analysis = main.analysis || {};
  elements.analysisStatus.textContent = "Imagen principal activa";
  elements.mainPreview.src = main.url;
  elements.mainPreview.alt = main.name;
  elements.mainPreview.classList.remove("hidden");
  elements.previewOverlay.classList.remove("hidden");
  elements.previewEmpty.classList.add("hidden");
  elements.metaResolution.textContent = analysis.originalWidth ? `${analysis.originalWidth} x ${analysis.originalHeight}` : "No disponible";
  elements.metaAspect.textContent = analysis.aspectLabel || "-";
  elements.metaLight.textContent = analysis.lightMood || "-";
  elements.metaEdges.textContent = analysis.edgeLabel || "-";
  elements.sceneProfile.textContent = analysis.sceneType || "Escena arquitectonica";
  elements.sceneSummary.textContent = `La referencia ${main.name} sugiere una atmosfera ${analysis.lightMood || "balanceada"}, una composicion ${analysis.aspectLabel || "estable"} y prioridad alta en fidelidad geometrica.`;
  elements.paletteSwatches.innerHTML = (analysis.palette || []).map(([r, g, b]) => `<span style="background: rgb(${r}, ${g}, ${b})"></span>`).join("");
  elements.riskList.innerHTML = (analysis.riskFlags || []).map((risk) => `<div class="risk"><span>${escapeHtml(risk)}</span><strong>Rev.</strong></div>`).join("");
}

function updatePresentationPanel() {
  elements.presentationSummary.textContent = `${elements.presentationContext.value || "Todavia no hay contexto escrito."} ${elements.presentationGoal.value || ""}`.trim();
  elements.presentationTypology.textContent = elements.projectTypology.value || "Pendiente";
  elements.presentationLocation.textContent = elements.projectLocation.value || "Pendiente";
  elements.presentationSlides.textContent = elements.slideCount.value ? `${elements.slideCount.value} slides sugeridas` : "Pendiente";
  elements.presentationDocsInfo.textContent = state.documents.length ? `${state.documents.length} archivos cargados` : "Sin adjuntos";
}

function updateChecklist() {
  const rows = state.mode === "presentation"
    ? [
        ["Contexto", Boolean(elements.presentationContext.value.trim())],
        ["Tipologia", Boolean(elements.projectTypology.value.trim())],
        ["Ubicacion", Boolean(elements.projectLocation.value.trim())],
        ["Programa", Boolean(elements.projectProgram.value.trim())],
        ["Soporte base", state.documents.length > 0],
      ]
    : [
        ["Imagen principal", Boolean(getMainItem())],
        ["Contexto", Boolean(elements.projectContext.value.trim())],
        ["Fidelidad", Number(elements.fidelity.value) >= 7],
        ["Realismo", Number(elements.realism.value) >= 7],
        ["Salida lista", Boolean(state.prompt.trim())],
      ];

  elements.qaChecklist.innerHTML = rows
    .map(([label, status]) => `<div class="check"><span>${escapeHtml(label)}</span><strong>${status ? "OK" : "Rev."}</strong></div>`)
    .join("");
}

function updatePrompt() {
  const text = state.mode === "presentation" ? buildPresentationOutline() : buildRenderPrompt();
  applyPromptOutput(text, "local");
  elements.promptMode.textContent = state.mode === "presentation"
    ? (elements.promptLanguage.value === "spanish" ? "Outline en espanol" : "Outline en ingles")
    : (elements.promptLanguage.value === "spanish" ? "Prompt en espanol" : "Prompt en ingles");
  elements.promptConfidence.textContent = state.mode === "presentation"
    ? (state.documents.length ? "Brief enriquecido" : "Brief base")
    : (getMainItem() ? "Confianza alta" : "Plantilla lista");
  updateChecklist();
}

function buildRenderPrompt() {
  const main = getMainItem();
  const analysis = main?.analysis;
  const context = elements.projectContext.value.trim() || "A high-end architectural project with no written context yet.";
  const parts = [
    "Use the provided image strictly as locked architectural geometry and as a fixed composition reference.",
    "",
    `Project context: ${context}`,
    `Primary reference: ${main ? main.name : "none selected yet"}`,
    `Fidelity level: ${elements.fidelity.value} / 10.`,
    `Realism level: ${elements.realism.value} / 10.`,
    `Image style: ${elements.imageStyle.value}.`,
    `Render style: ${elements.renderStyle.value}.`,
    `Time of day: ${elements.timeOfDay.value}.`,
    `Light type: ${elements.lightType.value}.`,
    `Photo angle: ${elements.photoAngle.value}.`,
    `People policy: ${elements.peopleMode.value}.`,
    "",
    analysis ? `Image intelligence: ${analysis.sceneType}, ${analysis.aspectLabel}, ${analysis.brightnessLabel}, ${analysis.lightMood}, ${analysis.edgeLabel} edge complexity.` : "Image intelligence will be inferred once a main image is selected.",
    analysis ? `Dominant palette cues: ${analysis.paletteMood}.` : "Dominant palette cues pending.",
    analysis ? `Auto angle hint: ${analysis.angleHint}.` : "Auto angle hint pending.",
    "",
    "GLOBAL OBJECTIVE",
    "Preserve the exact architectural design while replacing only the rendering quality.",
    "Keep layout, objects, furniture, camera, framing, perspective, and spatial relationships identical.",
    "",
    "ABSOLUTE GEOMETRY LOCK",
    "Treat the image as immutable architectural geometry.",
    "Do not redesign, move, replace, add, or remove any architectural or furniture element.",
    "",
    "PHYSICALLY BASED MATERIAL RECONSTRUCTION",
    "Convert all surfaces into realistic PBR materials with accurate roughness, reflectance, texture, and micro variation.",
    "",
    "PHYSICAL LIGHTING SIMULATION",
    `Recreate lighting according to ${elements.lightType.value}, ${elements.timeOfDay.value}, and ${elements.renderStyle.value}.`,
    "Use global illumination, natural falloff, balanced exposure, and premium architectural photography behavior.",
    "",
    "NEGATIVE CONSTRAINTS",
    "Avoid redesigning furniture, changing camera position, inventing objects, plastic materials, CGI artifacts, and generic renders.",
    "",
    "FINAL OUTPUT",
    "Generate a single final image. Only the rendering realism should improve.",
  ];
  return parts.join("\n");
}

function buildPresentationOutline() {
  const documents = state.documents.length ? state.documents.map((doc) => doc.name).join(", ") : "No base documents were uploaded.";
  const parts = elements.promptLanguage.value === "spanish"
    ? [
        "Construye una presentacion PDF arquitectonica de alto nivel, clara, comercial y visualmente sobria.",
        "",
        `Contexto del proyecto: ${elements.presentationContext.value || "Proyecto pendiente de contexto."}`,
        `Tipologia: ${elements.projectTypology.value || "Hospitality / mixed-use project"}`,
        `Ubicacion: ${elements.projectLocation.value || "Location to be defined"}`,
        `Programa arquitectonico: ${elements.projectProgram.value || "Reception, public areas, key amenities, and spatial experience"}`,
        `Tono comercial: ${elements.commercialTone.value}`,
        `Planos requeridos: ${elements.needsPlans.value}`,
        `Cantidad objetivo de slides: ${elements.slideCount.value || 10}`,
        `Objetivo principal: ${elements.presentationGoal.value || "Construir un deck claro y persuasivo."}`,
        `Archivos base disponibles: ${documents}`,
        "",
        "Estructura sugerida:",
        "1. Portada con concepto y promesa del proyecto.",
        "2. Contexto, oportunidad y narrativa de valor.",
        "3. Ubicacion y lectura del sitio.",
        "4. Tipologia y programa arquitectonico.",
        "5. Concepto rector y atmosfera espacial.",
        elements.needsPlans.value === "yes" ? "6. Slide dedicada a planos clave y lectura tecnica." : "6. Slide de estrategia espacial sin exceso tecnico.",
        "7. Experiencia del usuario y recorrido.",
        "8. Materialidad, luz y caracter.",
        "9. Diferenciadores comerciales.",
        "10. Cierre con resumen ejecutivo y llamado a decision.",
        "",
        "Devuelve un outline slide por slide con objetivo, contenido, visual sugerida y mensaje clave.",
      ]
    : [
        "Build a premium architectural PDF presentation with a clear, commercial, and elegant narrative.",
        "",
        `Project context: ${elements.presentationContext.value || "Premium architectural project awaiting a sharper presentation brief."}`,
        `Typology: ${elements.projectTypology.value || "Hospitality / mixed-use project"}`,
        `Location: ${elements.projectLocation.value || "Location to be defined"}`,
        `Architectural program: ${elements.projectProgram.value || "Reception, public areas, key amenities, and spatial experience"}`,
        `Commercial tone: ${elements.commercialTone.value}`,
        `Plans required: ${elements.needsPlans.value}`,
        `Target number of slides: ${elements.slideCount.value || 10}`,
        `Primary objective: ${elements.presentationGoal.value || "Build a persuasive PDF presentation that sells the project clearly."}`,
        `Available base files: ${documents}`,
        "",
        "Suggested structure:",
        "1. Cover with concept and project promise.",
        "2. Opportunity, context, and value narrative.",
        "3. Site reading and location advantages.",
        "4. Typology and architectural program.",
        "5. Core design concept and atmosphere.",
        elements.needsPlans.value === "yes" ? "6. Dedicated slide for key plans and technical reading." : "6. Spatial strategy slide without excessive technical depth.",
        "7. User journey and experience sequence.",
        "8. Materiality, light, and sensory character.",
        "9. Commercial differentiators and selling points.",
        "10. Closing summary with a decision-oriented takeaway.",
        "",
        "Return a slide-by-slide outline with objective, content, recommended visual, and key message.",
      ];
  return parts.join("\n");
}

function buildRenderPayload() {
  const main = getMainItem();
  return {
    projectContext: elements.projectContext.value,
    settings: state.settings,
    mainImage: main ? { fileName: main.name, analysis: main.analysis } : null,
  };
}

function buildPresentationPayload() {
  return {
    settings: state.settings,
    presentation: {
      context: elements.presentationContext.value,
      typology: elements.projectTypology.value,
      location: elements.projectLocation.value,
      program: elements.projectProgram.value,
      tone: elements.commercialTone.value,
      needsPlans: elements.needsPlans.value,
      slideCount: elements.slideCount.value,
      goal: elements.presentationGoal.value,
      documents: state.documents.map((doc) => ({ fileName: doc.name, size: doc.size, type: doc.type })),
    },
  };
}

async function checkApiHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error(`Status ${response.status}`);
    state.server.healthy = true;
    setApiStatus("API local lista", "ok");
  } catch {
    state.server.healthy = false;
    setApiStatus("API local no disponible", "warn");
  }
}

function queueOutputSync() {
  clearTimeout(state.server.syncTimeout);
  state.server.syncTimeout = setTimeout(() => syncOutputWithBackend(false), 250);
}

async function syncOutputWithBackend(manual) {
  const requestId = ++state.server.requestId;
  const endpoint = state.mode === "presentation" ? "/api/generate-presentation-outline" : "/api/generate-render-prompt";
  const payload = state.mode === "presentation" ? buildPresentationPayload() : buildRenderPayload();
  setApiStatus(manual ? "Generando con backend" : "Sincronizando backend", "warn");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    if (requestId !== state.server.requestId) return;
    applyPromptOutput(state.mode === "presentation" ? data.outline : data.prompt, "backend");
    setApiStatus("API local lista", "ok");
    state.server.healthy = true;
  } catch (error) {
    state.server.healthy = false;
    setApiStatus(manual ? "Backend no disponible" : "Usando fallback local", manual ? "error" : "warn");
    if (manual) showBootError(`No se pudo generar desde el backend: ${error.message}`);
  }
}

async function exportCurrentOutputPdf() {
  setApiStatus("Exportando PDF", "warn");
  try {
    const response = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: state.mode,
        title: state.mode === "presentation" ? "RenderAI Presentation Outline" : "RenderAI Render Prompt",
        fileName: state.mode === "presentation" ? "renderai-presentation.pdf" : "renderai-render-prompt.pdf",
        content: state.prompt,
      }),
    });
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = state.mode === "presentation" ? "renderai-presentation.pdf" : "renderai-render-prompt.pdf";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setApiStatus("PDF exportado", "ok");
    flashButton(elements.exportPdfBtn, "PDF listo");
  } catch (error) {
    setApiStatus("Error exportando PDF", "error");
    showBootError(`No se pudo exportar el PDF: ${error.message}`);
  }
}

function applyPromptOutput(text, source) {
  state.prompt = text;
  state.promptSource = source;
  elements.promptOutput.value = text;
  elements.promptLength.textContent = `${text.length.toLocaleString("es-CR")} caracteres`;
}

function setApiStatus(text, tone) {
  elements.apiStatus.textContent = text;
  elements.apiStatus.classList.remove("status-ok", "status-warn", "status-error");
  if (tone === "ok") elements.apiStatus.classList.add("status-ok");
  if (tone === "warn") elements.apiStatus.classList.add("status-warn");
  if (tone === "error") elements.apiStatus.classList.add("status-error");
}

function downloadPayload() {
  const payload = {
    mode: state.mode,
    promptSource: state.promptSource,
    settings: state.settings,
    render: buildRenderPayload(),
    presentation: buildPresentationPayload().presentation,
    prompt: state.prompt,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "renderai-payload.json";
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function getMainItem() {
  return state.items.find((item) => item.id === state.mainId) || null;
}

function showBootError(message) {
  if (!document.body) return;
  let node = document.querySelector("[data-boot-error]");
  if (!node) {
    node = document.createElement("div");
    node.className = "boot-error";
    node.dataset.bootError = "true";
    document.body.appendChild(node);
  }
  node.textContent = `RenderAI encontro un problema al arrancar: ${message}`;
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const helper = document.createElement("textarea");
  helper.value = text;
  document.body.appendChild(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function flashButton(button, label) {
  const original = button.textContent;
  button.textContent = label;
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function persistSettings() {
  try {
    localStorage.setItem("renderai-settings", JSON.stringify(state.settings));
  } catch {
    // Ignore local storage issues.
  }
}

function loadSettings() {
  const defaults = {
    workflowMode: "render",
    projectContext: "",
    fidelity: "9",
    realism: "9",
    imageStyle: "ultra-photorealistic architectural photography",
    renderStyle: "V-Ray / Corona / physically based",
    timeOfDay: "morning",
    lightType: "natural daylight",
    photoAngle: "eye-level frontal",
    peopleMode: "subtle ambient people",
    promptLanguage: "english",
    presentationContext: "",
    projectTypology: "",
    projectLocation: "",
    projectProgram: "",
    commercialTone: "premium persuasive",
    needsPlans: "yes",
    slideCount: "10",
    presentationGoal: "",
  };

  try {
    const saved = localStorage.getItem("renderai-settings");
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

function makeId() {
  return window.crypto?.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatFileSize(size) {
  if (!size) return "0 KB";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
