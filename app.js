const DEMO_USERS = [
  { username: "admin", password: "123", role: "admin", name: "Administrador" },
  { username: "arquitecto", password: "123", role: "user", name: "Arquitecto" },
];

const OPTIONS = {
  fidelitySelect: [
    ["absolute", "Absoluta / misma geometria"],
    ["high", "Alta / muy fiel"],
    ["balanced", "Balanceada / ligera mejora"],
  ],
  realismSelect: [
    ["hyperreal", "Hiperrealista"],
    ["premium-photo", "Fotografia premium"],
    ["soft-editorial", "Editorial suave"],
  ],
  imageStyleSelect: [
    ["clear-daylight", "Clara y limpia"],
    ["warm-editorial", "Calida editorial"],
    ["moody-dark", "Oscura y sofisticada"],
    ["controlled-hdr", "HDR controlado"],
    ["soft-atmospheric", "Atmosferica suave"],
  ],
  renderStyleSelect: [
    ["photographic", "Fotografico realista"],
    ["hospitality", "Hospitality premium"],
    ["minimal", "Minimalista refinado"],
    ["linear", "Lineal arquitectonico"],
    ["competition", "Competition board"],
  ],
  timeOfDaySelect: [
    ["morning", "Manana"],
    ["midday", "Mediodia"],
    ["golden-hour", "Golden hour"],
    ["blue-hour", "Blue hour"],
    ["night", "Noche"],
  ],
  lightTypeSelect: [
    ["natural", "Natural"],
    ["soft-diffuse", "Difusa"],
    ["warm-ambient", "Ambiental calida"],
    ["dramatic-directional", "Direccional dramatica"],
    ["mixed", "Mixta interior exterior"],
  ],
  cameraAngleSelect: [
    ["frontal-eye", "Frontal a nivel de ojo"],
    ["three-quarter", "Tres cuartos"],
    ["wide-interior", "Angular interior"],
    ["hero-axis", "Hero shot en eje"],
  ],
  peopleSelect: [
    ["no-people", "Sin personas"],
    ["subtle-occupancy", "Pocas personas sutiles"],
    ["active-scene", "Escena activa natural"],
  ],
  renderOutputSelect: [
    ["image", "Imagen render"],
    ["pdf", "PDF de direccion visual"],
  ],
  languageSelect: [
    ["english", "Ingles interno"],
    ["spanish", "Espanol interno"],
  ],
  pdfPagesSelect: Array.from({ length: 10 }, (_, index) => {
    const value = String(index + 6);
    return [value, `${value} paginas`];
  }),
  pdfAudienceSelect: [
    ["client", "Cliente final"],
    ["investor", "Inversionista"],
    ["internal", "Equipo interno"],
    ["municipality", "Institucional / permisos"],
  ],
  pdfToneSelect: [
    ["commercial-premium", "Comercial premium"],
    ["executive", "Ejecutivo sobrio"],
    ["technical", "Tecnico claro"],
    ["investor-ready", "Investor ready"],
  ],
  plansSelect: [
    ["required", "Si, incluir planos"],
    ["optional", "Opcional"],
    ["omit", "No incluir planos"],
  ],
};

const STORAGE_KEYS = {
  session: "renderai-session",
  feedback: "renderai-feedback",
  settings: "renderai-settings-v2",
};

const state = {
  mode: "render",
  session: null,
  images: [],
  documents: [],
  mainId: null,
  slides: [],
  renderOutputs: [],
  feedback: loadJson(STORAGE_KEYS.feedback, []),
  settings: loadJson(STORAGE_KEYS.settings, {
    projectName: "",
    projectLocation: "",
    projectTypology: "",
    projectProgram: "",
    projectGuide: "",
    fidelitySelect: "absolute",
    realismSelect: "hyperreal",
    imageStyleSelect: "warm-editorial",
    renderStyleSelect: "photographic",
    timeOfDaySelect: "golden-hour",
    lightTypeSelect: "mixed",
    cameraAngleSelect: "hero-axis",
    peopleSelect: "subtle-occupancy",
    renderOutputSelect: "image",
    languageSelect: "english",
    pdfPagesSelect: "10",
    pdfAudienceSelect: "client",
    pdfToneSelect: "commercial-premium",
    plansSelect: "required",
    pdfBrief: "",
  }),
  debugPrompt: "",
  server: { healthy: false, aiReady: false },
  ai: { cocoModel: null, cocoLoading: null, tesseractLoading: null },
};

const elements = {};

const ID_LIST = [
  "authScreen", "appShell", "loginForm", "loginUsername", "loginPassword", "loginError", "navWorkspaceBtn", "navFeedbackBtn",
  "navAdminBtn", "workspaceView", "feedbackView", "adminView", "logoutBtn", "apiHealthChip", "sessionChip", "modeRenderBtn",
  "modePresentationBtn", "assetCounter", "imageInput", "documentInput", "uploadDropzone", "dropzoneTitle", "dropzoneHint",
  "imageGallery", "documentGallery", "analysisState", "previewEmpty", "mainPreview", "previewOverlay", "metaResolution",
  "metaAspect", "metaLight", "metaEnvironment", "objectsList", "textList", "materialsList", "environmentList", "paletteList",
  "projectName", "projectLocation", "projectTypology", "projectProgram", "projectGuide", "fidelitySelect", "realismSelect",
  "imageStyleSelect", "renderStyleSelect", "timeOfDaySelect", "lightTypeSelect", "cameraAngleSelect", "peopleSelect",
  "renderOutputSelect", "languageSelect", "pdfPagesSelect", "pdfAudienceSelect", "pdfToneSelect", "plansSelect", "pdfBrief",
  "outputHeading", "outputState", "generatePrimaryBtn", "exportPdfBtn", "downloadImageBtn", "toggleDebugBtn", "renderOutputs",
  "pdfOutputs", "renderHero", "renderGallery", "slidesBoard", "debugPanel", "internalPrompt", "feedbackForm",
  "feedbackCategory", "feedbackRating", "feedbackMessage", "feedbackHistory", "adminFeedbackCount", "adminPendingCount",
  "adminRenderCount", "adminPdfCount", "adminFeedbackQueue"
];

const controlIds = [
  "projectName", "projectLocation", "projectTypology", "projectProgram", "projectGuide", "fidelitySelect", "realismSelect",
  "imageStyleSelect", "renderStyleSelect", "timeOfDaySelect", "lightTypeSelect", "cameraAngleSelect", "peopleSelect",
  "renderOutputSelect", "languageSelect", "pdfPagesSelect", "pdfAudienceSelect", "pdfToneSelect", "plansSelect", "pdfBrief"
];

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("error", (event) => toast(`Error de arranque: ${event.message}`, "error"));
window.addEventListener("unhandledrejection", (event) => toast(`Promesa rechazada: ${String(event.reason || "error")}`, "error"));

function init() {
  ID_LIST.forEach((id) => {
    elements[id] = document.getElementById(id);
  });
  populateSelects();
  bindEvents();
  hydrateControls();

  const savedSession = loadJson(STORAGE_KEYS.session, null);
  if (savedSession) {
    const user = DEMO_USERS.find((entry) => entry.username === savedSession.username && entry.role === savedSession.role);
    if (user) state.session = user;
  }

  applySession();
  renderAssets();
  renderOutputs();
  renderFeedback();
  renderAdmin();
  setMode(state.mode, true);
  checkApiHealth();
}

function populateSelects() {
  Object.entries(OPTIONS).forEach(([id, options]) => {
    const select = elements[id] || document.getElementById(id);
    if (!select) return;
    select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
  });
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.logoutBtn.addEventListener("click", logout);
  elements.navWorkspaceBtn.addEventListener("click", () => switchView("workspace"));
  elements.navFeedbackBtn.addEventListener("click", () => switchView("feedback"));
  elements.navAdminBtn.addEventListener("click", () => switchView("admin"));
  elements.modeRenderBtn.addEventListener("click", () => setMode("render"));
  elements.modePresentationBtn.addEventListener("click", () => setMode("presentation"));
  elements.uploadDropzone.addEventListener("click", triggerUpload);
  elements.imageInput.addEventListener("change", (event) => handleImageFiles(event.target.files));
  elements.documentInput.addEventListener("change", (event) => handleDocumentFiles(event.target.files));
  elements.generatePrimaryBtn.addEventListener("click", handleGenerate);
  elements.exportPdfBtn.addEventListener("click", exportPdf);
  elements.downloadImageBtn.addEventListener("click", downloadCurrentImage);
  elements.toggleDebugBtn.addEventListener("click", toggleDebug);
  elements.feedbackForm.addEventListener("submit", submitFeedback);
  elements.adminFeedbackQueue.addEventListener("click", handleAdminFeedbackAction);

  controlIds.forEach((id) => {
    const node = elements[id];
    node.addEventListener("input", onControlChange);
    node.addEventListener("change", onControlChange);
  });
}

function hydrateControls() {
  controlIds.forEach((id) => {
    if (Object.prototype.hasOwnProperty.call(state.settings, id)) {
      elements[id].value = state.settings[id];
    }
  });
}

function onControlChange() {
  controlIds.forEach((id) => {
    state.settings[id] = elements[id].value;
  });
  saveJson(STORAGE_KEYS.settings, state.settings);
  syncOutputPanels();
  if (state.mode === "presentation") {
    generateSlides(false);
  }
  updateOutputLabels();
  updateInternalPrompt();
}

function handleLogin(event) {
  event.preventDefault();
  const username = elements.loginUsername.value.trim();
  const password = elements.loginPassword.value;
  const user = DEMO_USERS.find((entry) => entry.username === username && entry.password === password);
  if (!user) {
    elements.loginError.classList.remove("hidden");
    return;
  }
  elements.loginError.classList.add("hidden");
  state.session = user;
  saveJson(STORAGE_KEYS.session, { username: user.username, role: user.role });
  applySession();
  toast(`Sesion iniciada como ${user.name}.`, "ok");
}

function logout() {
  state.session = null;
  localStorage.removeItem(STORAGE_KEYS.session);
  applySession();
}

function applySession() {
  const loggedIn = Boolean(state.session);
  elements.authScreen.classList.toggle("hidden", loggedIn);
  elements.appShell.classList.toggle("hidden", !loggedIn);
  elements.sessionChip.textContent = loggedIn ? `${state.session.name} · ${state.session.role}` : "Sin sesion";
  elements.navAdminBtn.classList.toggle("hidden", !(loggedIn && state.session.role === "admin"));
  elements.toggleDebugBtn.classList.toggle("hidden", !(loggedIn && state.session.role === "admin"));
  elements.debugPanel.classList.toggle("hidden", !(loggedIn && state.session.role === "admin"));
  renderFeedback();
  renderAdmin();
  if (loggedIn) switchView("workspace");
}

function switchView(view) {
  const isAdmin = state.session?.role === "admin";
  elements.workspaceView.classList.toggle("hidden", view !== "workspace");
  elements.feedbackView.classList.toggle("hidden", view !== "feedback");
  elements.adminView.classList.toggle("hidden", view !== "admin" || !isAdmin);
  elements.navWorkspaceBtn.classList.toggle("active", view === "workspace");
  elements.navFeedbackBtn.classList.toggle("active", view === "feedback");
  elements.navAdminBtn.classList.toggle("active", view === "admin");
}

function setMode(mode, silent = false) {
  state.mode = mode === "presentation" ? "presentation" : "render";
  const presentation = state.mode === "presentation";
  elements.modeRenderBtn.classList.toggle("active", !presentation);
  elements.modePresentationBtn.classList.toggle("active", presentation);
  document.querySelectorAll(".render-only").forEach((node) => node.classList.toggle("hidden", presentation));
  document.querySelectorAll(".presentation-only").forEach((node) => node.classList.toggle("hidden", !presentation));
  elements.imageGallery.classList.toggle("hidden", presentation);
  elements.documentGallery.classList.toggle("hidden", !presentation);
  elements.dropzoneTitle.textContent = presentation ? "Arrastra PDFs, planos o imagenes base" : "Arrastra o selecciona imagenes de referencia";
  elements.dropzoneHint.textContent = presentation
    ? "Sube soporte base para el deck. Puedes combinar planos, PDFs, renders o fotos de sitio."
    : "Sube una o varias imagenes. Luego marcas una como principal y la app vincula la lectura directamente con la escena.";
  updateOutputLabels();
  syncOutputPanels();
  if (presentation && !silent) generateSlides(false);
}

function syncOutputPanels() {
  const shouldShowPdf = state.mode === "presentation" || (state.mode === "render" && state.settings.renderOutputSelect === "pdf");
  elements.renderOutputs.classList.toggle("hidden", shouldShowPdf);
  elements.pdfOutputs.classList.toggle("hidden", !shouldShowPdf);
  elements.downloadImageBtn.classList.toggle("hidden", shouldShowPdf);
  elements.outputHeading.textContent = shouldShowPdf ? "Salida PDF visible" : "Salida visual render";
}

function updateOutputLabels() {
  if (state.mode === "presentation") {
    elements.outputState.textContent = state.slides.length ? `${state.slides.length} slides preparadas` : "Lista para estructurar";
    return;
  }
  const output = state.settings.renderOutputSelect;
  elements.outputState.textContent = output === "pdf"
    ? (state.slides.length ? `${state.slides.length} paginas listas` : "Preparar PDF visual")
    : (state.renderOutputs.length ? `${state.renderOutputs.length} imagenes generadas` : "Lista para generar imagen");
}

function triggerUpload() {
  if (state.mode === "presentation") elements.documentInput.click();
  else elements.imageInput.click();
}

async function handleImageFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  for (const file of files) {
    const url = await fileToDataUrl(file);
    const item = { id: cryptoRandom(), name: file.name, size: file.size, type: file.type, url, analysis: null };
    state.images.unshift(item);
    if (!state.mainId) state.mainId = item.id;
    renderAssets();
    analyzeReference(item);
  }
}

function handleDocumentFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  files.forEach((file) => {
    state.documents.unshift({ id: cryptoRandom(), name: file.name, size: file.size, type: file.type || "application/octet-stream" });
  });
  renderAssets();
  if (state.mode === "presentation") generateSlides(false);
}

function renderAssets() {
  renderImageGallery();
  renderDocumentGallery();
  updateAssetCounter();
  updateMainPreview();
}

function renderImageGallery() {
  if (!state.images.length) {
    elements.imageGallery.innerHTML = `<div class="empty-state"><strong>No hay imagenes cargadas</strong><span>Sube varias referencias y marca una como principal.</span></div>`;
    return;
  }
  elements.imageGallery.innerHTML = state.images.map((item) => {
    const active = item.id === state.mainId;
    const analysisLabel = item.analysis ? `${item.analysis.objects.length} objetos · ${item.analysis.texts.length} textos` : "Leyendo imagen...";
    return `
      <article class="asset-card">
        <img src="${item.url}" alt="${escapeHtml(item.name)}" />
        <div class="asset-meta">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(analysisLabel)}</p>
          </div>
          <span class="status-chip ${active ? "status-ok" : "status-soft"}">${active ? "Principal" : "Referencia"}</span>
        </div>
        <div class="asset-actions">
          <button type="button" class="button button-secondary" data-action="main" data-id="${item.id}">Usar principal</button>
          <button type="button" class="button button-ghost" data-action="delete" data-id="${item.id}">Eliminar</button>
        </div>
      </article>
    `;
  }).join("");
  elements.imageGallery.querySelectorAll("button[data-action]").forEach((button) => button.addEventListener("click", handleImageAction));
}

function renderDocumentGallery() {
  if (!state.documents.length) {
    elements.documentGallery.innerHTML = `<div class="empty-state"><strong>No hay archivos base</strong><span>Sube PDFs, planos o imagenes de apoyo para construir el deck.</span></div>`;
    return;
  }
  elements.documentGallery.innerHTML = state.documents.map((item) => `
    <article class="asset-card">
      <div class="asset-meta">
        <div>
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(formatFileSize(item.size))} · ${escapeHtml(item.type)}</p>
        </div>
        <span class="status-chip status-soft">Base</span>
      </div>
      <div class="asset-actions">
        <button type="button" class="button button-ghost" data-doc-delete="${item.id}">Eliminar</button>
      </div>
    </article>
  `).join("");
  elements.documentGallery.querySelectorAll("button[data-doc-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      state.documents = state.documents.filter((doc) => doc.id !== button.dataset.docDelete);
      renderAssets();
      if (state.mode === "presentation") generateSlides(false);
    });
  });
}

function handleImageAction(event) {
  const { action, id } = event.currentTarget.dataset;
  if (action === "main") {
    state.mainId = id;
    updateMainPreview();
    return;
  }
  if (action === "delete") {
    state.images = state.images.filter((item) => item.id !== id);
    if (state.mainId === id) state.mainId = state.images[0]?.id || null;
    renderAssets();
  }
}

function updateAssetCounter() {
  elements.assetCounter.textContent = state.mode === "presentation" ? `${state.documents.length} archivos base` : `${state.images.length} imagenes cargadas`;
}

function getMainImage() {
  return state.images.find((item) => item.id === state.mainId) || null;
}

async function analyzeReference(item) {
  elements.analysisState.textContent = `Analizando ${item.name}`;
  try {
    const image = await loadImage(item.url);
    const pixel = sampleImage(image);
    const [objects, texts] = await Promise.all([
      detectObjects(image).catch(() => []),
      detectText(item.url).catch(() => []),
    ]);
    item.analysis = {
      resolution: `${image.naturalWidth} x ${image.naturalHeight}`,
      aspect: image.naturalWidth / Math.max(image.naturalHeight, 1) > 1.45 ? "Panoramica" : image.naturalWidth > image.naturalHeight ? "Horizontal" : "Vertical",
      light: pixel.lightMood,
      environment: deriveEnvironment(pixel, objects, texts),
      objects,
      texts,
      materials: deriveMaterials(pixel, objects, texts),
      palette: pixel.palette,
      overlay: [...objects, ...texts].slice(0, 16),
      pixel,
    };
    renderImageGallery();
    if (item.id === state.mainId) updateMainPreview();
    updateInternalPrompt();
    toast(`Analisis listo para ${item.name}.`, "ok");
  } catch {
    item.analysis = {
      resolution: "No disponible",
      aspect: "Horizontal",
      light: "Balanceada",
      environment: ["interior arquitectonico"],
      objects: [],
      texts: [],
      materials: ["madera", "piedra", "concreto"],
      palette: [],
      overlay: [],
      pixel: null,
    };
    renderImageGallery();
    if (item.id === state.mainId) updateMainPreview();
    updateInternalPrompt();
    toast(`No se pudo completar toda la lectura de ${item.name}.`, "warn");
  }
}

function sampleImage(image) {
  const canvas = document.createElement("canvas");
  const max = 180;
  const scale = Math.min(1, max / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  let brightnessSum = 0;
  let greenPixels = 0;
  let blueTop = 0;
  let warmPixels = 0;
  let coolPixels = 0;
  let varianceAcc = 0;
  const paletteMap = new Map();
  const luminances = [];
  for (let index = 0; index < data.length; index += 4) {
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const pixelIndex = index / 4;
    const y = Math.floor(pixelIndex / canvas.width);
    const luma = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    brightnessSum += luma;
    luminances.push(luma);
    if (g > r + 12 && g > b + 12) greenPixels += 1;
    if (y < canvas.height * 0.35 && b > r && b > g) blueTop += 1;
    if (r > b + 15) warmPixels += 1;
    if (b > r + 15) coolPixels += 1;
    const key = [r, g, b].map((value) => Math.round(value / 48) * 48).join(",");
    paletteMap.set(key, (paletteMap.get(key) || 0) + 1);
  }
  const total = Math.max(1, data.length / 4);
  const avg = brightnessSum / total;
  luminances.forEach((value) => { varianceAcc += Math.pow(value - avg, 2); });
  const contrast = Math.sqrt(varianceAcc / Math.max(1, luminances.length));
  const palette = [...paletteMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key]) => key.split(",").map(Number))
    .map(([r, g, b]) => ({ rgb: `rgb(${r}, ${g}, ${b})`, hex: rgbToHex(r, g, b) }));
  const lightMood = avg > 0.72 ? "Alta claridad" : avg < 0.3 ? "Oscura controlada" : warmPixels > coolPixels ? "Calida equilibrada" : "Neutra / difusa";
  return {
    averageBrightness: avg,
    contrast,
    greenRatio: greenPixels / total,
    skyRatio: blueTop / Math.max(1, Math.round(total * 0.35)),
    warmRatio: warmPixels / total,
    coolRatio: coolPixels / total,
    lightMood,
    palette,
  };
}

async function detectObjects(image) {
  const model = await ensureCocoModel();
  if (!model) return [];
  const predictions = await model.detect(image);
  return predictions
    .filter((entry) => entry.score >= 0.42)
    .slice(0, 12)
    .map((entry, index) => {
      const [x, y, width, height] = entry.bbox;
      return {
        type: "box",
        label: normalizeLabel(entry.class),
        confidence: entry.score,
        x: (x / image.naturalWidth) * 100,
        y: (y / image.naturalHeight) * 100,
        width: (width / image.naturalWidth) * 100,
        height: (height / image.naturalHeight) * 100,
        order: index,
      };
    });
}

async function detectText(dataUrl) {
  const Tesseract = await ensureTesseract();
  if (!Tesseract) return [];
  const result = await Tesseract.recognize(dataUrl, "eng+spa");
  const words = safeArray(result?.data?.words)
    .filter((word) => word.text && word.text.trim().length > 1 && (word.confidence || 0) >= 55)
    .slice(0, 12)
    .map((word, index) => {
      const bbox = word.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 };
      const width = Math.max(0, bbox.x1 - bbox.x0);
      const height = Math.max(0, bbox.y1 - bbox.y0);
      const imageWidth = result.data.imageSize?.width || 1;
      const imageHeight = result.data.imageSize?.height || 1;
      return {
        type: "box",
        label: `texto: ${word.text.trim()}`,
        confidence: (word.confidence || 0) / 100,
        x: (bbox.x0 / imageWidth) * 100,
        y: (bbox.y0 / imageHeight) * 100,
        width: (width / imageWidth) * 100,
        height: (height / imageHeight) * 100,
        order: index + 50,
        textValue: word.text.trim(),
      };
    });
  return words;
}

function deriveMaterials(pixel, objects, texts) {
  const materials = [];
  if (pixel.warmRatio > 0.34) materials.push("madera calida");
  if (pixel.averageBrightness < 0.62 && pixel.contrast > 0.18) materials.push("piedra / masa mineral");
  if (pixel.coolRatio > 0.22) materials.push("metal grafito");
  if (pixel.skyRatio > 0.18 || objects.some((entry) => ["window", "door"].includes(entry.label))) materials.push("vidrio y aperturas");
  if (pixel.greenRatio > 0.12 || objects.some((entry) => entry.label.includes("plant"))) materials.push("vegetacion tropical");
  if (texts.length) materials.push("senaletica / rotulos");
  if (!materials.length) materials.push("concreto y acabados neutros");
  return unique(materials).slice(0, 6);
}

function deriveEnvironment(pixel, objects, texts) {
  const tags = [];
  if (pixel.skyRatio > 0.2) tags.push("apertura al exterior");
  if (pixel.greenRatio > 0.12) tags.push("vegetacion visible");
  if (objects.some((entry) => entry.label.includes("person"))) tags.push("ocupacion humana");
  if (objects.some((entry) => entry.label.includes("chair") || entry.label.includes("couch"))) tags.push("hospitality / estancia");
  if (texts.length) tags.push("rotulos presentes");
  if (!tags.length) tags.push("interior arquitectonico");
  return unique(tags).slice(0, 5);
}

function updateMainPreview() {
  const item = getMainImage();
  if (!item) {
    elements.previewEmpty.classList.remove("hidden");
    elements.mainPreview.classList.add("hidden");
    elements.previewOverlay.classList.add("hidden");
    elements.analysisState.textContent = "Esperando imagen principal";
    elements.metaResolution.textContent = "-";
    elements.metaAspect.textContent = "-";
    elements.metaLight.textContent = "-";
    elements.metaEnvironment.textContent = "-";
    renderTokens(elements.objectsList, []);
    renderTokens(elements.textList, []);
    renderTokens(elements.materialsList, []);
    renderTokens(elements.environmentList, []);
    renderPalette([]);
    updateInternalPrompt();
    return;
  }

  elements.previewEmpty.classList.add("hidden");
  elements.mainPreview.classList.remove("hidden");
  elements.mainPreview.src = item.url;
  const analysis = item.analysis;
  if (!analysis) {
    elements.previewOverlay.classList.add("hidden");
    elements.analysisState.textContent = `Leyendo ${item.name}`;
    elements.metaResolution.textContent = "Analizando";
    elements.metaAspect.textContent = "Analizando";
    elements.metaLight.textContent = "Analizando";
    elements.metaEnvironment.textContent = "Analizando";
    renderTokens(elements.objectsList, ["leyendo objetos..."]);
    renderTokens(elements.textList, ["leyendo rotulos..."]);
    renderTokens(elements.materialsList, ["leyendo materiales..."]);
    renderTokens(elements.environmentList, ["leyendo entorno..."]);
    renderPalette([]);
    updateInternalPrompt();
    return;
  }

  elements.previewOverlay.classList.remove("hidden");
  elements.analysisState.textContent = `Imagen principal: ${item.name}`;
  elements.metaResolution.textContent = analysis.resolution;
  elements.metaAspect.textContent = analysis.aspect;
  elements.metaLight.textContent = analysis.light;
  elements.metaEnvironment.textContent = analysis.environment.join(" · ");
  renderTokens(elements.objectsList, analysis.objects.map((entry) => entry.label));
  renderTokens(elements.textList, analysis.texts.map((entry) => entry.textValue || entry.label.replace(/^texto: /, "")));
  renderTokens(elements.materialsList, analysis.materials);
  renderTokens(elements.environmentList, analysis.environment);
  renderPalette(analysis.palette);
  renderOverlay(analysis.overlay);
  updateInternalPrompt();
}

function renderTokens(container, values) {
  const list = values.length ? unique(values).slice(0, 12) : ["Sin datos todavia"];
  container.innerHTML = list.map((value) => `<span class="token">${escapeHtml(value)}</span>`).join("");
}

function renderPalette(palette) {
  if (!palette.length) {
    elements.paletteList.innerHTML = `<span class="token">Sin paleta disponible</span>`;
    return;
  }
  elements.paletteList.innerHTML = palette.map((color) => `
    <div class="palette-chip">
      <span style="background:${color.rgb}"></span>
      <small>${color.hex}</small>
    </div>
  `).join("");
}

function renderOverlay(entries) {
  if (!entries.length) {
    elements.previewOverlay.innerHTML = "";
    return;
  }
  elements.previewOverlay.innerHTML = entries
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((entry) => {
      const textY = Math.max(3, entry.y + 3);
      return `
        <g>
          <rect class="box" x="${clamp(entry.x, 0, 98)}" y="${clamp(entry.y, 0, 98)}" width="${clamp(entry.width, 1.5, 100)}" height="${clamp(entry.height, 1.5, 100)}" rx="1.4"></rect>
          <text class="box-label" x="${clamp(entry.x + 0.8, 0, 96)}" y="${clamp(textY, 0, 99)}">${escapeHtml(entry.label)}</text>
        </g>
      `;
    }).join("");
}

function updateInternalPrompt() {
  const main = getMainImage();
  const objects = main?.analysis?.objects?.map((entry) => entry.label).join(", ") || "no objects detected yet";
  const texts = main?.analysis?.texts?.map((entry) => entry.textValue || entry.label).join(", ") || "no signage detected yet";
  const materials = main?.analysis?.materials?.join(", ") || "materials pending";
  const environment = main?.analysis?.environment?.join(", ") || "environment pending";
  state.debugPrompt = [
    "You are an expert system for converting locked architectural imagery into premium architectural photography or final communication assets.",
    "Never redesign the project. Never move the camera. Never change text or signage. Never invent objects that do not exist.",
    "",
    `Project: ${state.settings.projectName || "Unnamed architectural project"}`,
    `Location: ${state.settings.projectLocation || "Location pending"}`,
    `Typology: ${state.settings.projectTypology || "Architectural typology pending"}`,
    `Program: ${state.settings.projectProgram || "Program pending"}`,
    `Guide: ${state.settings.projectGuide || "No written guide yet."}`,
    `Fidelity: ${state.settings.fidelitySelect}`,
    `Realism: ${state.settings.realismSelect}`,
    `Image style: ${state.settings.imageStyleSelect}`,
    `Render style: ${state.settings.renderStyleSelect}`,
    `Time of day: ${state.settings.timeOfDaySelect}`,
    `Light type: ${state.settings.lightTypeSelect}`,
    `Camera angle: ${state.settings.cameraAngleSelect}`,
    `People: ${state.settings.peopleSelect}`,
    `Objects detected: ${objects}`,
    `Texts detected: ${texts}`,
    `Materials inferred: ${materials}`,
    `Environment inferred: ${environment}`,
    state.mode === "presentation"
      ? `Build a ${state.settings.pdfPagesSelect}-page PDF for ${state.settings.pdfAudienceSelect} with tone ${state.settings.pdfToneSelect} and plans ${state.settings.plansSelect}.`
      : "Edit the uploaded main image with high input fidelity and produce a premium architectural final image.",
  ].join("\n");
  elements.internalPrompt.value = state.debugPrompt;
}

async function handleGenerate() {
  if (state.mode === "presentation") {
    generateSlides(true);
    return;
  }
  if (state.settings.renderOutputSelect === "pdf") {
    generateSlides(true, { fromRender: true });
    syncOutputPanels();
    updateOutputLabels();
    return;
  }
  await generateRenderImage();
}

async function generateRenderImage() {
  const main = getMainImage();
  if (!main) {
    toast("Primero selecciona una imagen principal.", "warn");
    return;
  }
  updateInternalPrompt();
  elements.outputState.textContent = "Generando imagen...";
  let output = null;
  if (state.server.aiReady) {
    output = await requestAiRender(main).catch(() => null);
  }
  if (!output) output = await buildLocalRenderFallback(main);
  state.renderOutputs.unshift({
    id: cryptoRandom(),
    url: output.url,
    source: output.source,
    title: `${state.settings.projectName || "Proyecto"} · ${output.source === "openai" ? "IA" : "Local"}`,
    createdAt: new Date().toISOString(),
  });
  renderOutputs();
  renderAdmin();
  toast(output.source === "openai" ? "Imagen generada con IA." : "Se genero una salida visual local de fallback.", "ok");
}

async function requestAiRender(main) {
  const response = await fetch("/api/generate-render-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: state.debugPrompt,
      size: pickImageSize(main),
      images: [main.url, ...state.images.filter((item) => item.id !== main.id).slice(0, 3).map((item) => item.url)],
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok || !payload.imageBase64) throw new Error(payload.message || `Status ${response.status}`);
  return { url: `data:image/png;base64,${payload.imageBase64}`, source: "openai" };
}

async function buildLocalRenderFallback(main) {
  const image = await loadImage(main.url);
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext("2d");
  context.filter = buildCanvasFilter();
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const overlay = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (state.settings.timeOfDaySelect === "golden-hour") {
    overlay.addColorStop(0, "rgba(255, 184, 120, 0.08)");
    overlay.addColorStop(1, "rgba(71, 52, 35, 0.16)");
  } else if (state.settings.timeOfDaySelect === "blue-hour") {
    overlay.addColorStop(0, "rgba(106, 138, 196, 0.14)");
    overlay.addColorStop(1, "rgba(23, 34, 57, 0.18)");
  } else if (state.settings.timeOfDaySelect === "night") {
    overlay.addColorStop(0, "rgba(41, 56, 92, 0.18)");
    overlay.addColorStop(1, "rgba(23, 20, 33, 0.22)");
  } else {
    overlay.addColorStop(0, "rgba(255, 255, 255, 0.02)");
    overlay.addColorStop(1, "rgba(99, 77, 52, 0.06)");
  }
  context.fillStyle = overlay;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.save();
  context.globalAlpha = 0.08;
  for (let index = 0; index < 2400; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.1;
    context.fillStyle = index % 2 === 0 ? "#ffffff" : "#1e1714";
    context.fillRect(x, y, size, size);
  }
  context.restore();
  return { url: canvas.toDataURL("image/png"), source: "local" };
}

function buildCanvasFilter() {
  const styleMap = {
    "clear-daylight": "contrast(1.06) brightness(1.06) saturate(1.02)",
    "warm-editorial": "contrast(1.08) brightness(1.03) saturate(1.06) sepia(0.08)",
    "moody-dark": "contrast(1.12) brightness(0.9) saturate(0.94)",
    "controlled-hdr": "contrast(1.14) brightness(1.04) saturate(1.08)",
    "soft-atmospheric": "contrast(1.01) brightness(1.02) saturate(0.96)",
  };
  return styleMap[state.settings.imageStyleSelect] || styleMap["warm-editorial"];
}

function pickImageSize(main) {
  return main.analysis?.aspect === "Vertical" ? "1024x1536" : "1536x1024";
}

function renderOutputs() {
  renderHeroOutput();
  renderOutputGallery();
  renderSlidesBoard();
  syncOutputPanels();
  updateOutputLabels();
}

function renderHeroOutput() {
  const first = state.renderOutputs[0];
  if (!first) {
    elements.renderHero.className = "render-hero empty-state";
    elements.renderHero.innerHTML = `<strong>Aun no hay salida generada</strong><span>La imagen final o la simulacion local aparecera aqui cuando ejecutes el flujo.</span>`;
    return;
  }
  elements.renderHero.className = "render-hero";
  elements.renderHero.innerHTML = `<img src="${first.url}" alt="${escapeHtml(first.title)}" />`;
}

function renderOutputGallery() {
  if (!state.renderOutputs.length) {
    elements.renderGallery.innerHTML = "";
    return;
  }
  elements.renderGallery.innerHTML = state.renderOutputs.slice(0, 6).map((item) => `
    <article class="render-thumb">
      <img src="${item.url}" alt="${escapeHtml(item.title)}" />
      <p>${escapeHtml(item.title)}</p>
      <button type="button" class="button button-secondary" data-output-open="${item.id}">Usar como principal</button>
    </article>
  `).join("");
  elements.renderGallery.querySelectorAll("button[data-output-open]").forEach((button) => {
    button.addEventListener("click", () => {
      const output = state.renderOutputs.find((entry) => entry.id === button.dataset.outputOpen);
      if (!output) return;
      state.renderOutputs = [output, ...state.renderOutputs.filter((entry) => entry.id !== output.id)];
      renderOutputs();
    });
  });
}

function generateSlides(showToast = false, options = {}) {
  const fromRender = Boolean(options.fromRender);
  const guide = fromRender ? buildRenderPdfGuide() : (state.settings.pdfBrief || state.settings.projectGuide || "Deck arquitectonico premium");
  const pageCount = fromRender ? 6 : Number(state.settings.pdfPagesSelect || 10);
  state.slides = (fromRender ? buildRenderSlides(guide) : buildPresentationSlides(pageCount, guide)).slice(0, pageCount);
  renderOutputs();
  renderAdmin();
  if (showToast) toast("PDF estructurado y listo para exportacion.", "ok");
}

function buildRenderSlides(guide) {
  const main = getMainImage();
  const analysis = main?.analysis;
  return [
    {
      title: "Portada",
      subtitle: state.settings.projectName || "RenderAI Visual Direction",
      bullets: [state.settings.projectLocation || "Ubicacion pendiente", state.settings.projectTypology || "Tipologia pendiente", "Salida derivada de imagen bloqueada"],
    },
    {
      title: "Escena base",
      subtitle: "Lo que la imagen contiene y bloquea",
      bullets: [
        `Objetos: ${(analysis?.objects || []).map((entry) => entry.label).slice(0, 6).join(", ") || "sin lectura"}`,
        `Textos: ${(analysis?.texts || []).map((entry) => entry.textValue || entry.label).slice(0, 5).join(", ") || "sin rotulos"}`,
        `Materiales: ${(analysis?.materials || []).join(", ") || "sin materiales"}`,
      ],
    },
    {
      title: "Decisiones de salida",
      subtitle: "Parametros escogidos por el usuario",
      bullets: [
        `Fidelidad: ${labelForValue("fidelitySelect", state.settings.fidelitySelect)}`,
        `Realismo: ${labelForValue("realismSelect", state.settings.realismSelect)}`,
        `Imagen: ${labelForValue("imageStyleSelect", state.settings.imageStyleSelect)}`,
        `Render: ${labelForValue("renderStyleSelect", state.settings.renderStyleSelect)}`,
      ],
    },
    {
      title: "Luz y camara",
      subtitle: "Como debe sentirse la toma final",
      bullets: [
        `Hora: ${labelForValue("timeOfDaySelect", state.settings.timeOfDaySelect)}`,
        `Luz: ${labelForValue("lightTypeSelect", state.settings.lightTypeSelect)}`,
        `Camara: ${labelForValue("cameraAngleSelect", state.settings.cameraAngleSelect)}`,
        `Personas: ${labelForValue("peopleSelect", state.settings.peopleSelect)}`,
      ],
    },
    {
      title: "Riesgos y protecciones",
      subtitle: "Lo que no debe cambiar",
      bullets: [
        "No mover camara",
        "No redisenar objetos ni rotulos",
        "No inventar paisaje, mobiliario ni geometria",
        "Mantener toda la imagen al mismo nivel de calidad",
      ],
    },
    {
      title: "Cierre",
      subtitle: "Direccion visual final",
      bullets: [guide, "Exportable para cliente, equipo o pipeline de IA."],
    },
  ];
}

function buildPresentationSlides(pageCount, guide) {
  const skeleton = [
    { title: "Portada", subtitle: state.settings.projectName || "Proyecto arquitectonico", bullets: [state.settings.projectLocation || "Ubicacion pendiente", state.settings.projectTypology || "Tipologia pendiente", labelForValue("pdfToneSelect", state.settings.pdfToneSelect)] },
    { title: "Oportunidad", subtitle: "Por que este proyecto importa", bullets: [guide, `Audiencia: ${labelForValue("pdfAudienceSelect", state.settings.pdfAudienceSelect)}`] },
    { title: "Sitio", subtitle: "Ubicacion y lectura del contexto", bullets: [state.settings.projectLocation || "Ubicacion pendiente", "Ventajas competitivas del emplazamiento"] },
    { title: "Programa", subtitle: "Componentes y experiencia", bullets: [state.settings.projectProgram || "Programa pendiente", "Jerarquia de usos y recorridos"] },
    { title: "Concepto", subtitle: "Narrativa del proyecto", bullets: [guide, labelForValue("pdfToneSelect", state.settings.pdfToneSelect)] },
    { title: "Materialidad", subtitle: "Caracter y atmosfera", bullets: ["Materiales principales", "Luz, tono, sensacion", "Como se percibe el espacio"] },
    { title: "Planos y soporte", subtitle: "Informacion tecnica", bullets: [labelForValue("plansSelect", state.settings.plansSelect), state.documents.length ? state.documents.map((item) => item.name).join(", ") : "Sin soporte base cargado"] },
    { title: "Experiencia", subtitle: "Usuario y secuencia espacial", bullets: ["Llegada", "Estancia", "Momentos clave"] },
    { title: "Diferenciadores", subtitle: "Lo que hace fuerte al proyecto", bullets: ["Comercial", "Arquitectonico", "Operativo"] },
    { title: "Cierre", subtitle: "Mensaje final", bullets: ["Resumen ejecutivo", "Siguiente decision recomendada"] },
  ];
  while (skeleton.length < pageCount) {
    skeleton.splice(skeleton.length - 1, 0, {
      title: `Apoyo ${skeleton.length}`,
      subtitle: "Slide complementaria",
      bullets: ["Datos, renders, diagramas o comparativas segun necesidad del proyecto"],
    });
  }
  return skeleton.slice(0, pageCount);
}

function buildRenderPdfGuide() {
  const main = getMainImage();
  const objects = main?.analysis?.objects?.map((entry) => entry.label).slice(0, 8).join(", ") || "sin lectura de objetos";
  const materials = main?.analysis?.materials?.join(", ") || "sin lectura de materiales";
  return `Escena base: ${objects}. Materialidad detectada: ${materials}. Objetivo: convertir la imagen bloqueada en una salida premium sin cambiar geometria ni rotulos.`;
}

function renderSlidesBoard() {
  if (!state.slides.length) {
    elements.slidesBoard.className = "slides-board empty-state";
    elements.slidesBoard.innerHTML = `<strong>No hay deck preparado</strong><span>Completa la guia del PDF y genera la estructura.</span>`;
    return;
  }
  elements.slidesBoard.className = "slides-board";
  elements.slidesBoard.innerHTML = state.slides.map((slide, index) => `
    <article class="slide-card">
      <span class="eyebrow">Slide ${index + 1}</span>
      <strong>${escapeHtml(slide.title)}</strong>
      <p>${escapeHtml(slide.subtitle)}</p>
      <ul>${slide.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
    </article>
  `).join("");
}

async function exportPdf() {
  if (!state.slides.length) {
    generateSlides(false, { fromRender: state.mode === "render" });
  }
  if (!state.slides.length) {
    toast("No hay contenido para exportar a PDF.", "warn");
    return;
  }
  const response = await fetch("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: state.mode,
      title: state.settings.projectName || "RenderAI Export",
      slides: state.slides,
      summary: state.settings.projectGuide || state.settings.pdfBrief || state.debugPrompt,
      fileName: `${slugify(state.settings.projectName || "renderai")}-${state.mode}.pdf`,
    }),
  });
  if (!response.ok) {
    toast("No se pudo exportar el PDF.", "error");
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(state.settings.projectName || "renderai")}-${state.mode}.pdf`);
  setTimeout(() => URL.revokeObjectURL(url), 0);
  toast("PDF exportado.", "ok");
}

function downloadCurrentImage() {
  const first = state.renderOutputs[0];
  if (!first) {
    toast("Todavia no hay imagen generada.", "warn");
    return;
  }
  triggerDownload(first.url, `${slugify(state.settings.projectName || "renderai")}-render.png`);
}

function toggleDebug() {
  elements.debugPanel.open = !elements.debugPanel.open;
}

function submitFeedback(event) {
  event.preventDefault();
  if (!state.session) return;
  const message = elements.feedbackMessage.value.trim();
  if (!message) {
    toast("Escribe un comentario antes de enviar feedback.", "warn");
    return;
  }
  state.feedback.unshift({
    id: cryptoRandom(),
    user: state.session.username,
    role: state.session.role,
    category: elements.feedbackCategory.value,
    rating: elements.feedbackRating.value,
    message,
    createdAt: new Date().toISOString(),
    status: "new",
  });
  saveJson(STORAGE_KEYS.feedback, state.feedback);
  elements.feedbackForm.reset();
  renderFeedback();
  renderAdmin();
  toast("Feedback enviado.", "ok");
}

function renderFeedback() {
  const mine = state.session ? state.feedback.filter((item) => item.user === state.session.username) : [];
  if (!mine.length) {
    elements.feedbackHistory.innerHTML = `<div class="empty-state"><strong>No has enviado feedback</strong><span>Cuando dejes comentarios, apareceran aqui.</span></div>`;
    return;
  }
  elements.feedbackHistory.innerHTML = mine.map((item) => feedbackCardMarkup(item)).join("");
}

function renderAdmin() {
  const total = state.feedback.length;
  const pending = state.feedback.filter((item) => item.status !== "resolved").length;
  elements.adminFeedbackCount.textContent = String(total);
  elements.adminPendingCount.textContent = String(pending);
  elements.adminRenderCount.textContent = String(state.renderOutputs.length);
  elements.adminPdfCount.textContent = String(state.slides.length ? 1 : 0);
  if (!state.feedback.length) {
    elements.adminFeedbackQueue.innerHTML = `<div class="empty-state"><strong>No hay feedback recibido</strong><span>La bandeja se llenara cuando los usuarios envien comentarios.</span></div>`;
    return;
  }
  elements.adminFeedbackQueue.innerHTML = state.feedback.map((item) => `
    <div>
      ${feedbackCardMarkup(item)}
      <div class="asset-actions">
        <button type="button" class="button button-secondary" data-feedback-status="${item.id}">Marcar resuelto</button>
      </div>
    </div>
  `).join("");
}

function feedbackCardMarkup(item) {
  return `
    <article class="feedback-item">
      <div class="feedback-meta">
        <span>${escapeHtml(item.user)} · ${escapeHtml(item.role)}</span>
        <span>${formatDate(item.createdAt)} · ${escapeHtml(item.category)} · ${escapeHtml(item.rating)}/5 · ${escapeHtml(item.status)}</span>
      </div>
      <strong>${escapeHtml(item.message)}</strong>
    </article>
  `;
}

function handleAdminFeedbackAction(event) {
  const id = event.target.dataset.feedbackStatus;
  if (!id) return;
  state.feedback = state.feedback.map((item) => item.id === id ? { ...item, status: "resolved" } : item);
  saveJson(STORAGE_KEYS.feedback, state.feedback);
  renderAdmin();
  renderFeedback();
  toast("Feedback marcado como resuelto.", "ok");
}

async function checkApiHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) throw new Error(`Status ${response.status}`);
    const data = await response.json();
    state.server.healthy = true;
    state.server.aiReady = Boolean(data.aiReady);
    elements.apiHealthChip.textContent = data.aiReady ? "Servidor listo · OpenAI activo" : "Servidor listo · fallback local";
    elements.apiHealthChip.className = `status-chip ${data.aiReady ? "status-ok" : "status-warn"}`;
  } catch {
    state.server.healthy = false;
    state.server.aiReady = false;
    elements.apiHealthChip.textContent = "Servidor no disponible";
    elements.apiHealthChip.className = "status-chip status-error";
  }
}

async function ensureCocoModel() {
  if (state.ai.cocoModel) return state.ai.cocoModel;
  if (state.ai.cocoLoading) return state.ai.cocoLoading;
  state.ai.cocoLoading = (async () => {
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
    await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd");
    if (!window.cocoSsd) return null;
    state.ai.cocoModel = await window.cocoSsd.load();
    return state.ai.cocoModel;
  })().catch(() => null);
  return state.ai.cocoLoading;
}

async function ensureTesseract() {
  if (window.Tesseract) return window.Tesseract;
  if (state.ai.tesseractLoading) return state.ai.tesseractLoading;
  state.ai.tesseractLoading = loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js")
    .then(() => window.Tesseract || null)
    .catch(() => null);
  return state.ai.tesseractLoading;
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.src = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });
    script.addEventListener("error", reject, { once: true });
    document.head.appendChild(script);
  });
}

function toast(message, tone = "soft") {
  const rack = document.getElementById("toastRack");
  const node = document.createElement("div");
  node.className = `toast ${tone === "error" ? "status-error" : tone === "warn" ? "status-warn" : tone === "ok" ? "status-ok" : "status-soft"}`;
  node.textContent = message;
  rack.appendChild(node);
  setTimeout(() => node.remove(), 3400);
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function triggerDownload(url, fileName) {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
}

function loadJson(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota problems.
  }
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function formatFileSize(size) {
  if (!size) return "0 KB";
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function labelForValue(id, value) {
  return (OPTIONS[id] || []).find((entry) => entry[0] === value)?.[1] || value;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("es-CR");
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

function cryptoRandom() {
  return window.crypto?.randomUUID ? window.crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeLabel(value) {
  return String(value).replaceAll("_", " ");
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "renderai";
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
