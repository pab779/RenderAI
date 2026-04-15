const KNOWN_USERS = [
  { username: "admin", role: "admin", name: "Administrador" },
  { username: "arquitecto", role: "user", name: "Arquitecto" },
];

const STORAGE_KEYS = {
  session: "renderai-session-v3",
  settings: "renderai-settings-v3",
  feedback: "renderai-feedback-v3",
};

const RENDER_STEPS = [
  { id: 1, title: "Insumos", copy: "Carga y organiza la escena base." },
  { id: 2, title: "Descomposicion", copy: "Lee y corrige la imagen con IA." },
  { id: 3, title: "Direccion", copy: "Define tono, brochure y configuracion final." },
  { id: 4, title: "Resultado", copy: "Espera una sola corrida, revisa y descarga." },
];

const PDF_STEPS = [
  { id: 1, title: "Insumos", copy: "Carga referencias, planos o material base." },
  { id: 2, title: "Descomposicion", copy: "Lee la escena y corrige materiales, objetos y textos." },
  { id: 3, title: "Diseno", copy: "Escoge template, tono editorial, idioma, tipografias y paleta." },
  { id: 4, title: "Diapositivas", copy: "Define cantidad, tipo, orden y amenidades del brochure." },
  { id: 5, title: "Editor", copy: "Selecciona cada diapositiva y ajusta imagen, layout y tratamiento." },
  { id: 6, title: "Resultado", copy: "Ejecuta una sola corrida y descarga el brochure final." },
];

const FEEDBACK_CATEGORIES = [
  { value: "render", label: "Render" },
  { value: "pdf", label: "PDF" },
  { value: "analysis", label: "Lectura" },
  { value: "ux", label: "UX" },
  { value: "bug", label: "Bug" },
];

const RATING_OPTIONS = [1, 2, 3, 4, 5];

const TOKEN_LIBRARIES = {
  materials: [
    "madera calida", "piedra natural", "metal grafito", "concreto aparente", "vidrio claro",
    "vegetacion tropical", "fibras naturales", "tapizado textil", "ceramica mate", "senaletica metalica",
  ],
  environment: [
    "interior arquitectonico", "apertura al exterior", "vegetacion visible", "cielo abierto",
    "hospitality premium", "zona comercial", "relacion interior exterior", "fondo controlado",
    "entorno tropical", "ocupacion humana",
  ],
  composition: [
    "camara bloqueada", "eje frontal", "simetria parcial", "profundidad central", "interior-exterior alineado",
    "fugas dominantes", "crop horizontal", "ritmo estructural claro", "primer plano activo", "fondo visible",
  ],
  realismRisks: [
    "texto poco legible", "vidrios debiles", "fondo plano", "sombras genericas", "mobiliario simplificado",
    "materiales plasticos", "microdetalle pobre", "desbalance interior exterior", "piso demasiado digital", "vegetacion artificial",
  ],
};

const DECISION_GROUPS = {
  render: [
    {
      key: "fidelity",
      label: "Fidelidad",
      description: "Cuanto debe respetarse la geometria y composicion original.",
      options: [
        { value: "absolute", label: "Bloqueo absoluto", description: "Misma escena, misma camara, cero reinterpretacion." },
        { value: "high", label: "Alta fidelidad", description: "Respeta todo, con mejora fotografica controlada." },
        { value: "balanced", label: "Fiel editorial", description: "Mantiene la escena con licencia minima en acabado." },
      ],
    },
    {
      key: "realism",
      label: "Realismo",
      description: "Tipo de fotografia final que se busca.",
      options: [
        { value: "hyperreal", label: "Ultra fotografico", description: "Premium y casi imposible de leer como render." },
        { value: "editorial", label: "Editorial premium", description: "Mas suave, elegante y de gran proyecto." },
        { value: "hospitality", label: "Hospitality real", description: "Calido, comercial y creible para cliente." },
      ],
    },
    {
      key: "imageMood",
      label: "Estilo de imagen",
      description: "Rango tonal, contraste y atmosfera.",
      options: [
        { value: "bright", label: "Clara refinada", description: "Luz limpia y contenida." },
        { value: "warm", label: "Calida editorial", description: "Color grading sofisticado y hospitalario." },
        { value: "moody", label: "Oscura elegante", description: "Mas densa, premium y seria." },
        { value: "atmospheric", label: "Atmosferica", description: "Profunda y sensorial." },
      ],
    },
    {
      key: "renderLanguage",
      label: "Lenguaje de render",
      description: "Que tono visual debe dominar la salida.",
      options: [
        { value: "photographic", label: "Fotografia arquitectonica", description: "Debe sentirse fotografiada, no generada." },
        { value: "minimal", label: "Minimal refinado", description: "Mas sobrio y preciso." },
        { value: "commercial", label: "Comercial premium", description: "Mas atractivo y market ready." },
        { value: "luxury", label: "Lujo calido", description: "Materialidad profunda y hospitality high-end." },
      ],
    },
    {
      key: "timeOfDay",
      label: "Hora del dia",
      description: "Contexto temporal general de la escena.",
      options: [
        { value: "morning", label: "Manana", description: "Luz fresca y optimista." },
        { value: "midday", label: "Mediodia", description: "Lectura neutra y definida." },
        { value: "golden-hour", label: "Golden hour", description: "Capa calida y comercial." },
        { value: "blue-hour", label: "Blue hour", description: "Contraste sofisticado interior-exterior." },
        { value: "night", label: "Noche", description: "Interior protagonista." },
      ],
    },
    {
      key: "lightScenario",
      label: "Tipo de luz",
      description: "Comportamiento principal de la iluminacion.",
      options: [
        { value: "natural", label: "Natural difusa", description: "Luz amplia y suave." },
        { value: "mixed", label: "Mixta interior exterior", description: "Balance interior-exterior." },
        { value: "warm-ambient", label: "Ambiental calida", description: "Mas acogedora y hospitality." },
        { value: "directional", label: "Direccional controlada", description: "Sombras con caracter." },
      ],
    },
    {
      key: "cameraIntent",
      label: "Angulo de foto",
      description: "Como se debe sentir la camara final.",
      options: [
        { value: "front", label: "Frontal bloqueado", description: "Respeta el eje principal." },
        { value: "three-quarter", label: "Tres cuartos", description: "Con profundidad ligera." },
        { value: "wide", label: "Angular interior", description: "Prioriza espacio y continuidad." },
        { value: "hero", label: "Hero shot", description: "Mas editorial." },
      ],
    },
    {
      key: "occupancy",
      label: "Personas",
      description: "Nivel de ocupacion humana visible.",
      options: [
        { value: "none", label: "Sin personas", description: "Cero personas visibles, sin excepciones." },
        { value: "few", label: "Con pocas personas", description: "Solo 1 a 3 personas naturales y secundarias." },
        { value: "many", label: "Con muchas personas", description: "Escena activa con ocupacion claramente visible." },
      ],
    },
    {
      key: "detailPriority",
      label: "Prioridad tecnica",
      description: "En que debe apretar mas el resultado.",
      options: [
        { value: "glass-text", label: "Vidrios y rotulos", description: "Maxima precision en OCR y capas." },
        { value: "materials", label: "Materialidad", description: "Mas tactilidad y profundidad." },
        { value: "uniformity", label: "Uniformidad total", description: "Mismo nivel de calidad en toda la escena." },
      ],
    },
    {
      key: "representationStyle",
      label: "Representacion",
      description: "Lenguaje final de la imagen o render.",
      options: [
        { value: "photographic", label: "Fotografia real", description: "La escena debe parecer una foto construida." },
        { value: "three-dimensional", label: "Imagen 3D premium", description: "Render arquitectonico pulido de alta gama." },
        { value: "linear-drawing", label: "Render lineal", description: "Lectura lineal tipo dibujo arquitectonico." },
        { value: "mixed-media", label: "Mixto editorial", description: "Base render con sensibilidad de lamina editorial." },
      ],
    },
    {
      key: "imageFinish",
      label: "Acabado visual",
      description: "Caracter tecnico de la imagen final.",
      options: [
        { value: "crisp", label: "Nitida", description: "Alta claridad y borde preciso." },
        { value: "filmic-grain", label: "Granulada editorial", description: "Leve grano fotografico premium." },
        { value: "soft-film", label: "Suave filmica", description: "Mas suave y controlada." },
        { value: "contrast-rich", label: "Contraste rico", description: "Mas densa y profunda." },
      ],
    },
    {
      key: "lensProfile",
      label: "Lente y perspectiva",
      description: "Como debe sentirse la optica final sin romper la camara bloqueada.",
      options: [
        { value: "corrected-wide", label: "Angular corregido", description: "Interior amplio con verticales limpias." },
        { value: "editorial-35", label: "Editorial 35 mm", description: "Mas humano, natural y fotografico." },
        { value: "detail-50", label: "Detalle 50 mm", description: "Mas peso material y profundidad." },
        { value: "orthographic-feel", label: "Ortogonal controlada", description: "Lectura precisa y tecnica." },
      ],
    },
    {
      key: "weatherAtmosphere",
      label: "Clima y atmosfera",
      description: "Condicion ambiental que debe sentirse en la toma final.",
      options: [
        { value: "clear", label: "Cielo limpio", description: "Mas neutro, nítido y comercial." },
        { value: "overcast", label: "Nublado suave", description: "Difusion elegante y controlada." },
        { value: "humid-tropical", label: "Humedo tropical", description: "Atmósfera viva, calida y creible." },
        { value: "mist-soft", label: "Bruma suave", description: "Profundidad atmosferica sutil." },
      ],
    },
  ],
  pdf: [
    {
      key: "pageCount",
      label: "Cantidad de paginas",
      description: "Profundidad del deck a exportar.",
      options: [
        { value: "6", label: "6 paginas", description: "Deck corto y ejecutivo." },
        { value: "8", label: "8 paginas", description: "Narrativa comercial balanceada." },
        { value: "10", label: "10 paginas", description: "Mas desarrollo de valor y materialidad." },
        { value: "12", label: "12 paginas", description: "Deck amplio para cliente o inversionista." },
      ],
    },
    {
      key: "audience",
      label: "Audiencia",
      description: "A quien se le habla principalmente.",
      options: [
        { value: "client", label: "Cliente final", description: "Lenguaje claro y aspiracional." },
        { value: "investor", label: "Inversionista", description: "Narrativa de oportunidad y confianza." },
        { value: "executive", label: "Directivo", description: "Resumen mas sobrio y rapido." },
        { value: "technical", label: "Equipo tecnico", description: "Mas foco en criterio y soporte." },
      ],
    },
    {
      key: "pdfTone",
      label: "Tono",
      description: "Personalidad general del documento.",
      options: [
        { value: "commercial-premium", label: "Comercial premium", description: "Elegante, vendible y high-end." },
        { value: "executive", label: "Ejecutivo sobrio", description: "Mas limpio y directo." },
        { value: "story-led", label: "Narrativo sensorial", description: "Mas emocional y de experiencia." },
        { value: "technical-clear", label: "Tecnico claro", description: "Mas racional y orientado a explicacion." },
      ],
    },
    {
      key: "narrative",
      label: "Narrativa",
      description: "Desde donde se construye el deck.",
      options: [
        { value: "concept-first", label: "Concepto primero", description: "Abre con idea y posicionamiento." },
        { value: "market-first", label: "Oportunidad primero", description: "Arranca desde valor comercial." },
        { value: "experience-first", label: "Experiencia primero", description: "Inicia desde la vivencia espacial." },
        { value: "site-first", label: "Sitio primero", description: "Empieza con contexto y llegada." },
      ],
    },
    {
      key: "plans",
      label: "Planos",
      description: "Nivel de inclusion de soporte tecnico.",
      options: [
        { value: "hero-only", label: "Solo pieza hero", description: "Planos puntuales." },
        { value: "selected", label: "Seleccion curada", description: "Solo lo que ayuda a vender." },
        { value: "full", label: "Bloque tecnico", description: "Reservar seccion tecnica clara." },
        { value: "omit", label: "Sin planos", description: "Deck 100% narrativo y visual." },
      ],
    },
    {
      key: "visualDensity",
      label: "Densidad visual",
      description: "Cantidad de informacion por pagina.",
      options: [
        { value: "airy", label: "Aire editorial", description: "Mas espacio y menos texto." },
        { value: "balanced", label: "Balanceada", description: "Texto y titulares bien distribuidos." },
        { value: "rich", label: "Rica en contenido", description: "Mas soporte por pagina." },
      ],
    },
    {
      key: "coverStyle",
      label: "Estilo de portada",
      description: "Como se abre visualmente el documento.",
      options: [
        { value: "minimal", label: "Minimal", description: "Tipografia dominante y portada limpia." },
        { value: "visual", label: "Visual hero", description: "Imagen fuerte como ancla." },
        { value: "material", label: "Materialidad", description: "Abre desde texturas y atmosfera." },
      ],
    },
    {
      key: "deckMode",
      label: "Modo de entrega",
      description: "Que tipo de deck se debe priorizar.",
      options: [
        { value: "client", label: "Deck cliente", description: "Mas comercial y facil de leer." },
        { value: "executive", label: "Resumen ejecutivo", description: "Mas directo y corto." },
        { value: "presentation", label: "Presentacion completa", description: "Deck amplio para reunion." },
      ],
    },
    {
      key: "renderLanguage",
      label: "Lenguaje visual",
      description: "Que tono deben tener los renders y tableros del deck.",
      options: [
        { value: "photographic", label: "Fotografia arquitectonica", description: "La imagen debe sentirse fotografiada." },
        { value: "commercial", label: "Comercial premium", description: "Mas vendible, pulido y market ready." },
        { value: "luxury", label: "Lujo calido", description: "Hospitality high-end con materialidad fuerte." },
      ],
    },
    {
      key: "imageMood",
      label: "Atmósfera",
      description: "Tono general de las piezas visuales del deck.",
      options: [
        { value: "bright", label: "Clara refinada", description: "Limpia y precisa." },
        { value: "warm", label: "Calida editorial", description: "Hospitalaria y sofisticada." },
        { value: "moody", label: "Oscura elegante", description: "Mas densa y premium." },
        { value: "atmospheric", label: "Atmosferica", description: "Sensorial y profunda." },
      ],
    },
    {
      key: "timeOfDay",
      label: "Momento del dia",
      description: "Contexto temporal de los renders del PDF.",
      options: [
        { value: "morning", label: "Manana", description: "Luz fresca y clara." },
        { value: "midday", label: "Mediodia", description: "Lectura neutra y tecnica." },
        { value: "golden-hour", label: "Golden hour", description: "Capa calida y comercial." },
        { value: "blue-hour", label: "Blue hour", description: "Contraste interior-exterior sofisticado." },
        { value: "night", label: "Noche", description: "Interior protagonista." },
      ],
    },
    {
      key: "lightScenario",
      label: "Luz",
      description: "Comportamiento principal de las visuales del deck.",
      options: [
        { value: "natural", label: "Natural difusa", description: "Suave y amplia." },
        { value: "mixed", label: "Mixta interior exterior", description: "Balanceada y comercial." },
        { value: "warm-ambient", label: "Ambiental calida", description: "Mas acogedora y hospitality." },
        { value: "directional", label: "Direccional", description: "Mas dramatica y editorial." },
      ],
    },
    {
      key: "occupancy",
      label: "Personas",
      description: "Ocupacion humana en las visuales del deck.",
      options: [
        { value: "none", label: "Sin personas", description: "Ninguna figura humana visible." },
        { value: "few", label: "Con pocas personas", description: "Solo 1 a 3 personas naturales." },
        { value: "many", label: "Con muchas personas", description: "Escena viva con mas actividad." },
      ],
    },
    {
      key: "representationStyle",
      label: "Representacion",
      description: "Lenguaje visual dominante para las imagenes del brochure.",
      options: [
        { value: "photographic", label: "Fotografia real", description: "Imagen editorial casi fotografica." },
        { value: "three-dimensional", label: "Imagen 3D premium", description: "Render de alta gama para brochure." },
        { value: "linear-drawing", label: "Render lineal", description: "Lamina lineal o dibujo controlado." },
        { value: "mixed-media", label: "Mixto editorial", description: "Collage editorial con base arquitectonica fiel." },
      ],
    },
    {
      key: "imageFinish",
      label: "Acabado visual",
      description: "Textura final de la imagen en el brochure.",
      options: [
        { value: "crisp", label: "Nitida", description: "Precisa, limpia y comercial." },
        { value: "filmic-grain", label: "Granulada editorial", description: "Grano fino y look revista." },
        { value: "soft-film", label: "Suave filmica", description: "Mas delicada y atmosferica." },
        { value: "contrast-rich", label: "Contraste rico", description: "Mas densa y material." },
      ],
    },
    {
      key: "lensProfile",
      label: "Lente",
      description: "Sensacion optica de las visuales del PDF.",
      options: [
        { value: "corrected-wide", label: "Angular corregido", description: "Amplio y preciso para interiores." },
        { value: "editorial-35", label: "Editorial 35 mm", description: "Mas humano y fotografico." },
        { value: "detail-50", label: "Detalle 50 mm", description: "Mas peso material y profundidad." },
        { value: "orthographic-feel", label: "Ortogonal controlada", description: "Mas tecnica y precisa." },
      ],
    },
    {
      key: "weatherAtmosphere",
      label: "Clima",
      description: "Condicion ambiental de las visuales del brochure.",
      options: [
        { value: "clear", label: "Cielo limpio", description: "Limpio, nitido y comercial." },
        { value: "overcast", label: "Nublado suave", description: "Difusion elegante y sobria." },
        { value: "humid-tropical", label: "Humedo tropical", description: "Atmosfera viva y creible." },
        { value: "mist-soft", label: "Bruma suave", description: "Profundidad atmosferica sutil." },
      ],
    },
  ],
};

const PDF_SECTION_LIBRARY = [
  { id: "cover", label: "Portada hero", description: "Apertura con la pieza principal del proyecto.", visualRole: "hero", layout: "feature", allowProjectImages: true },
  { id: "moodboard", label: "Mood board", description: "Lamina tipo Pinterest con atmosfera, materiales y referencias.", visualRole: "moodboard", layout: "board", allowProjectImages: false },
  { id: "pantone", label: "Color pantone", description: "Pagina de cromatica, tonos y familia visual.", visualRole: "palette", layout: "palette", allowProjectImages: false },
  { id: "idea", label: "Idea", description: "La idea principal y la oportunidad del proyecto.", visualRole: "detail", layout: "split", allowProjectImages: true },
  { id: "concept", label: "Concepto", description: "Principios conceptuales, narrativa y caracter.", visualRole: "moodboard", layout: "split", allowProjectImages: true },
  { id: "who-we-are", label: "Quienes somos", description: "Slide corporativo del estudio o equipo.", visualRole: "identity", layout: "split", allowProjectImages: false },
  { id: "what-we-do", label: "Que hacemos", description: "Servicios o capacidades principales.", visualRole: "identity", layout: "split", allowProjectImages: false },
  { id: "amenities", label: "Amenidades", description: "Slides individuales para amenidades especificas.", visualRole: "detail", layout: "feature", allowProjectImages: true, expandable: true },
  { id: "materials", label: "Materiales", description: "Familia material, textura y tactilidad.", visualRole: "materials", layout: "board", allowProjectImages: false },
  { id: "plan-2d", label: "Plano 2D", description: "Pagina tecnica o laminas de planos.", visualRole: "reference", layout: "split", allowProjectImages: true },
  { id: "renders", label: "Renders del proyecto", description: "Variantes hero o escenas complementarias.", visualRole: "hero", layout: "feature", allowProjectImages: true },
  { id: "site", label: "Sitio y entorno", description: "Contexto, ubicacion y lectura de implantacion.", visualRole: "reference", layout: "split", allowProjectImages: true },
  { id: "closing", label: "Cierre", description: "Slide final con accion o mensaje de cierre.", visualRole: "closing", layout: "feature", allowProjectImages: true },
];

const PROJECT_TYPE_OPTIONS = [
  { value: "business", label: "Proyecto empresarial", description: "Mas comercial, cliente y venta." },
  { value: "tower", label: "Torre", description: "Mas vertical, premium e inversion." },
  { value: "university", label: "Tarea de universidad", description: "Mas didactica y explicativa." },
];

const AMENITY_LIBRARY = [
  "Lobby", "Cowork", "Rooftop", "Piscina", "Gimnasio", "Spa", "Restaurante", "Cafe", "Sala de reuniones", "Terraza",
  "Lounge", "Playground", "Recepcion", "Mirador", "Biblioteca", "Tiendas", "Galeria", "Auditorio",
  "Bar", "Cafeteria", "Jardin tropical", "Deck exterior", "Senderos", "Area de eventos", "Kids club", "Pet zone",
  "Yoga deck", "Wellness room", "Mirador volcan", "Tienda de souvenirs", "Recepcion de tours", "Zona de espera",
];
const MAX_AMENITY_COUNT = 8;

function getSectionBaseId(sectionInstanceId) {
  const raw = String(sectionInstanceId || "");
  const idx = raw.indexOf("__");
  return idx >= 0 ? raw.slice(0, idx) : raw;
}

function findPdfSectionDefinition(sectionInstanceId) {
  const baseId = getSectionBaseId(sectionInstanceId);
  return PDF_SECTION_LIBRARY.find((item) => item.id === baseId) || null;
}

function hasPdfSectionBase(baseId, list) {
  return safeArray(list).some((id) => getSectionBaseId(id) === baseId);
}

const PDF_MOODBOARD_SOURCES = [
  { value: "project", label: "Imagenes del proyecto" },
  { value: "materials", label: "Materiales" },
  { value: "palette", label: "Paleta" },
  { value: "reference", label: "Referencia principal" },
  { value: "environment", label: "Entorno" },
];

const PDF_IMAGE_MODE_OPTIONS = [
  { value: "rendered", label: "Renderizar proyecto", description: "Por defecto el brochure usa versiones renderizadas de las fotos del proyecto." },
  { value: "raw", label: "Usar fotos crudas", description: "Mantiene las imagenes originales sin reinterpretarlas para el brochure." },
];

const BROCHURE_STYLE_FAMILIES = [
  { value: "monolith", label: "Monolith", description: "Grandes masas, jerarquia clara y presencia sobria.", preview: "feature", template: "monolith" },
  { value: "folio", label: "Folio", description: "Catalogo premium con aire editorial y margenes generosos.", preview: "split", template: "folio" },
  { value: "magazine", label: "Magazine", description: "Ritmo de revista, capas, titulares y lectura viva.", preview: "board", template: "magazine" },
  { value: "poster", label: "Poster", description: "Portadas fuertes, titulos grandes y gesto grafico.", preview: "feature", template: "poster" },
  { value: "mosaic", label: "Mosaic", description: "Composicion modular, recortes y collage visual.", preview: "gallery", template: "mosaic" },
  { value: "gallery-wall", label: "Gallery wall", description: "Imagenes curadas como una exposicion arquitectonica.", preview: "gallery", template: "gallery-wall" },
  { value: "storyboard", label: "Storyboard", description: "Secuencia visual dinamica y explicativa.", preview: "gallery", template: "storyboard" },
  { value: "atelier", label: "Atelier", description: "Refinado, creativo y con tactilidad visual.", preview: "board", template: "atelier" },
  { value: "urban-grid", label: "Urban grid", description: "Mas grafico, contemporaneo y arquitectonico.", preview: "technical", template: "urban-grid" },
  { value: "technical-sheet", label: "Technical sheet", description: "Tecnico, limpio y con precision de lamina.", preview: "technical", template: "technical-sheet" },
  { value: "resort", label: "Resort", description: "Hospitality, atmosfera y visuales amplias.", preview: "feature", template: "resort" },
  { value: "manifest", label: "Manifest", description: "Mas vanguardista, asimetrico y con bloques fuertes.", preview: "split", template: "manifest" },
  { value: "obsidian", label: "Obsidian", description: "Fondo oscuro premium, tipografia dorada y elegancia nocturna.", preview: "feature", template: "obsidian" },
  { value: "ivory", label: "Ivory", description: "Blanco puro, margenes amplios, minimalismo radical y silencio visual.", preview: "split", template: "ivory" },
  { value: "aurora", label: "Aurora", description: "Degradados suaves tipo cielo, tonos pastel HD y fluidez cromática.", preview: "feature", template: "aurora" },
  { value: "onyx", label: "Onyx", description: "Negro absoluto, acento neon y estetica high-tech futurista.", preview: "technical", template: "onyx" },
  { value: "velvet", label: "Velvet", description: "Tonos borgoña y durazno, textura tactil y calidez premium.", preview: "board", template: "velvet" },
  { value: "prism", label: "Prism", description: "Prismatico, multi-cromatico, efecto cristal y luz difractada.", preview: "gallery", template: "prism" },
  { value: "dune", label: "Dune", description: "Arena, terracota y piedra calida, hospitalidad y resort de lujo.", preview: "feature", template: "dune" },
  { value: "slate", label: "Slate", description: "Gris antracita, acero y concreto, brutalismo refinado.", preview: "technical", template: "slate" },
];

const BROCHURE_STYLE_VARIANTS = [
  { value: "airy", label: "Airy", description: "Mas respiracion y silencios visuales.", density: "airy", frame: "framed", ornament: "soft" },
  { value: "graphic", label: "Graphic", description: "Bandas, bloques y contraste mas marcado.", density: "balanced", frame: "banded", ornament: "graphic" },
  { value: "spread", label: "Spread", description: "Mas efecto de doble pagina y visual dominante.", density: "balanced", frame: "bleed", ornament: "spread" },
  { value: "stacked", label: "Stacked", description: "Capas, tarjetas y superposiciones editoriales.", density: "rich", frame: "stacked", ornament: "stacked" },
];

const BROCHURE_STYLE_ALIASES = {
  dynamic: "canva-EAGHvxr_154",
  colorful: "canva-EAGnoGixvFY",
  minimal: "canva-EAGV4SKvtkI",
  luxury: "canva-EAFPf0Mf_YI",
  "luxury-sand": "canva-EAFJITWQWWk",
  "minimal-ivory": "canva-EAGdcTUYU1s",
  "editorial-terracotta": "canva-EAGTkH8WXi4",
  dark: "canva-EAGrLDwPJo0",
  "dark-gold": "canva-EAFPf0Mf_YI",
  neon: "canva-EAGHvxr_154",
  futuristic: "canva-EAGHvxr_154",
  pastel: "canva-EAGr_RR-y1A",
  gradient: "canva-EAGHvxr_154",
  warm: "canva-EAGtNZBHprc",
  "warm-luxury": "canva-EAGsAh-OVLo",
  brutalist: "canva-EAGTP-02p34",
  crystal: "canva-EAGTP-02p34",
  "pure-white": "canva-EAGdcTUYU1s",
};

const BROCHURE_STYLE_MARKET_GROUPS = [
  { value: "all", label: "Todo" },
  { value: "portfolio", label: "Portfolio" },
  { value: "pitch", label: "Pitch deck" },
  { value: "editorial", label: "Editorial" },
  { value: "minimal", label: "Minimal" },
  { value: "dark", label: "Dark" },
  { value: "brand", label: "Marca / guia" },
  { value: "hospitality", label: "Hospitality" },
  { value: "experimental", label: "Experimental" },
];

const BROCHURE_STYLE_MARKET_META = {
  monolith: { collection: "Portfolio base", groups: ["portfolio", "minimal"], tags: ["clean", "architectural"] },
  folio: { collection: "Luxury folio", groups: ["portfolio", "editorial"], tags: ["serif", "premium"] },
  magazine: { collection: "Creative portfolio", groups: ["editorial", "portfolio"], tags: ["magazine", "story"] },
  poster: { collection: "Pitch impact", groups: ["pitch", "editorial"], tags: ["bold", "graphic"] },
  mosaic: { collection: "Mood board", groups: ["editorial", "experimental"], tags: ["collage", "materials"] },
  "gallery-wall": { collection: "Image wall", groups: ["portfolio", "editorial"], tags: ["curated", "grid"] },
  storyboard: { collection: "Narrative deck", groups: ["editorial", "pitch"], tags: ["sequence", "story"] },
  atelier: { collection: "Studio book", groups: ["portfolio", "editorial"], tags: ["art", "tactile"] },
  "urban-grid": { collection: "Urban proposal", groups: ["pitch", "portfolio"], tags: ["grid", "city"] },
  "technical-sheet": { collection: "Design manual", groups: ["brand", "minimal"], tags: ["manual", "system"] },
  resort: { collection: "Resort brochure", groups: ["hospitality", "portfolio"], tags: ["warm", "immersive"] },
  manifest: { collection: "Creative brief", groups: ["experimental", "pitch"], tags: ["vanguard", "statement"] },
  obsidian: { collection: "Dark luxury", groups: ["dark", "pitch"], tags: ["premium", "night"] },
  ivory: { collection: "Quiet minimal", groups: ["minimal", "portfolio"], tags: ["white", "elegant"] },
  aurora: { collection: "Gradient deck", groups: ["experimental", "editorial"], tags: ["soft", "glow"] },
  onyx: { collection: "Tech pitch", groups: ["dark", "pitch"], tags: ["neon", "future"] },
  velvet: { collection: "Warm luxury", groups: ["editorial", "hospitality"], tags: ["fashion", "soft"] },
  prism: { collection: "Creative color", groups: ["experimental", "editorial"], tags: ["colorful", "energy"] },
  dune: { collection: "Hospitality warm", groups: ["hospitality", "minimal"], tags: ["sand", "resort"] },
  slate: { collection: "Project proposal", groups: ["pitch", "minimal"], tags: ["urban", "refined"] },
};

function buildBrochureStyleOptions() {
  const neutrals = {
    monolith: { paper: "#f8f4ef", ink: "#1d1917", accent: "#8d6d52" },
    folio: { paper: "#fcfaf6", ink: "#201b17", accent: "#9a7657" },
    magazine: { paper: "#f7f2eb", ink: "#191512", accent: "#7b4b39" },
    poster: { paper: "#f5f1ea", ink: "#141414", accent: "#b54e37" },
    mosaic: { paper: "#f7f4ef", ink: "#191717", accent: "#79645a" },
    "gallery-wall": { paper: "#f7f6f2", ink: "#181714", accent: "#6a5548" },
    storyboard: { paper: "#f5f5f3", ink: "#151515", accent: "#8b6a4a" },
    atelier: { paper: "#fbf6ef", ink: "#221b16", accent: "#90725c" },
    "urban-grid": { paper: "#f1f2f4", ink: "#16181d", accent: "#5a6370" },
    "technical-sheet": { paper: "#f8f8f8", ink: "#16181c", accent: "#6f7c8d" },
    resort: { paper: "#f8f5ef", ink: "#1d1a17", accent: "#8a7659" },
    manifest: { paper: "#f4f1eb", ink: "#161310", accent: "#8f5d45" },
    obsidian: { paper: "#1a1720", ink: "#f0eae0", accent: "#c9a96e" },
    ivory: { paper: "#fdfcfa", ink: "#1a1a1a", accent: "#b8a08a" },
    aurora: { paper: "#f0f0fa", ink: "#1a1824", accent: "#8b7ec8" },
    onyx: { paper: "#0e0e14", ink: "#e8e8f0", accent: "#00d4aa" },
    velvet: { paper: "#f8f0f0", ink: "#2a1820", accent: "#9e5a6e" },
    prism: { paper: "#f5f2fa", ink: "#18161e", accent: "#7c6bb8" },
    dune: { paper: "#f8f2ea", ink: "#2a2018", accent: "#c49a6c" },
    slate: { paper: "#f0f0f2", ink: "#1a1c20", accent: "#6a7080" },
  };

  return BROCHURE_STYLE_FAMILIES.flatMap((family) => BROCHURE_STYLE_VARIANTS.map((variant) => ({
    ...(BROCHURE_STYLE_MARKET_META[family.value] || {}),
    value: `${family.value}-${variant.value}`,
    label: `${family.label} · ${variant.label}`,
    description: `${family.description} ${variant.description}`,
    preview: family.preview,
    paper: neutrals[family.value]?.paper || "#faf7f2",
    ink: neutrals[family.value]?.ink || "#1b1816",
    accent: neutrals[family.value]?.accent || "#8b6a4a",
    family: family.label,
    variant: variant.label,
    template: family.template,
    density: variant.density,
    frame: variant.frame,
    ornament: variant.ornament,
    searchIndex: [
      family.label,
      variant.label,
      family.description,
      variant.description,
      BROCHURE_STYLE_MARKET_META[family.value]?.collection,
      ...(BROCHURE_STYLE_MARKET_META[family.value]?.groups || []),
      ...(BROCHURE_STYLE_MARKET_META[family.value]?.tags || []),
    ].filter(Boolean).join(" ").toLowerCase(),
  })));
}

const BROCHURE_STYLE_OPTIONS = buildBrochureStyleOptions();
const LOCAL_TEMPLATE_TARGET_COUNT = 28;
const CANVA_TEMPLATE_DEFAULT = "canva-EAGrLDwPJo0";

function getBaseBrochureStyleProfile(value) {
  return BROCHURE_STYLE_OPTIONS.find((option) => option.value === value) || BROCHURE_STYLE_OPTIONS[0];
}

function buildBrochureTemplateLibrary() {
  const entries = [
    // --- Local Canva reference library (28 production templates) ---------------
    { value: "ivory-airy",       label: "Canva · Minimal Portfolio",      collection: "Canva reference", description: "Portafolio creativo negro y gris, composicion minima estilo Canva.",                groups: ["portfolio", "dark", "minimal"],     tags: ["canva", "portfolio", "minimal"],              thumbnail: "assets/template-previews/canva/EAGrLDwPJo0.webp", canvaId: "EAGrLDwPJo0", canvaUrl: "https://www.canva.com/templates/EAGrLDwPJo0/" },
    { value: "folio-airy",       label: "Canva · Brown Interior",         collection: "Canva reference", description: "Interior design marron y minimalista moderno estilo Canva.",                         groups: ["editorial", "hospitality", "minimal"], tags: ["canva", "interior", "brown"],              thumbnail: "assets/template-previews/canva/EAGr_RR-y1A.webp", canvaId: "EAGr_RR-y1A", canvaUrl: "https://www.canva.com/templates/EAGr_RR-y1A/" },
    { value: "folio-spread",     label: "Canva · Propuesta Interiorismo", collection: "Canva reference", description: "Propuesta de interiorismo minimalista, limpia y editorial.",                          groups: ["editorial", "hospitality"],            tags: ["canva", "interior", "propuesta"],         thumbnail: "assets/template-previews/canva/EAFw_orjpUY.jpg",  canvaId: "EAFw_orjpUY",  canvaUrl: "https://www.canva.com/templates/EAFw_orjpUY/"  },
    { value: "mosaic-airy",      label: "Canva · Furniture Design",       collection: "Canva reference", description: "Presentacion moderna de diseno de muebles en tonos grises.",                          groups: ["portfolio", "minimal"],                tags: ["canva", "furniture", "gray"],             thumbnail: "assets/template-previews/canva/EAFikiuuzhg.jpg",  canvaId: "EAFikiuuzhg",  canvaUrl: "https://www.canva.com/templates/EAFikiuuzhg/"  },
    { value: "dune-airy",        label: "Canva · Organic Green",          collection: "Canva reference", description: "Negocio organico, paleta gris verde, calido y sereno.",                               groups: ["hospitality", "editorial", "brand"],   tags: ["canva", "organic", "green"],              thumbnail: "assets/template-previews/canva/EAFNfbb5KQs.jpg",  canvaId: "EAFNfbb5KQs",  canvaUrl: "https://www.canva.com/templates/EAFNfbb5KQs/"  },
    { value: "monolith-airy",    label: "Canva · Grayscale Architecture", collection: "Canva reference", description: "Arquitectura en blanco, gris y escala de grises.",                                    groups: ["portfolio", "minimal"],                tags: ["canva", "architecture", "grayscale"],     thumbnail: "assets/template-previews/canva/EAGn3Fr3fd4.webp", canvaId: "EAGn3Fr3fd4", canvaUrl: "https://www.canva.com/templates/EAGn3Fr3fd4/" },
    { value: "folio-airy",       label: "Canva · Beige Portfolio",        collection: "Canva reference", description: "Guia de estilo y portafolio de arquitectura minimalista beige.",                      groups: ["portfolio", "editorial", "minimal"],   tags: ["canva", "beige", "architecture"],         thumbnail: "assets/template-previews/canva/EAF2x8BSmSs.webp", canvaId: "EAF2x8BSmSs", canvaUrl: "https://www.canva.com/templates/EAF2x8BSmSs/" },
    { value: "obsidian-spread",  label: "Canva · Black Gold Luxe",        collection: "Canva reference", description: "Negocio de lujo en negro y dorado, estilo alta gama.",                                groups: ["dark", "brand", "editorial"],          tags: ["canva", "luxury", "gold"],                thumbnail: "assets/template-previews/canva/EAFPf0Mf_YI.jpg",  canvaId: "EAFPf0Mf_YI",  canvaUrl: "https://www.canva.com/templates/EAFPf0Mf_YI/"  },
    { value: "ivory-airy",       label: "Canva · White Architecture",     collection: "Canva reference", description: "Presentacion arquitectura blanca y limpia estilo Canva.",                              groups: ["portfolio", "minimal"],                tags: ["canva", "white", "architecture"],         thumbnail: "assets/template-previews/canva/EAGdcTUYU1s.webp", canvaId: "EAGdcTUYU1s", canvaUrl: "https://www.canva.com/templates/EAGdcTUYU1s/" },
    { value: "velvet-spread",    label: "Canva · Brown Blue Modern",      collection: "Canva reference", description: "Arquitectura moderna marron y azul, paleta calida.",                                  groups: ["portfolio", "editorial"],              tags: ["canva", "brown", "blue"],                 thumbnail: "assets/template-previews/canva/EAGtNZBHprc.jpg",  canvaId: "EAGtNZBHprc",  canvaUrl: "https://www.canva.com/templates/EAGtNZBHprc/"  },
    { value: "poster-airy",      label: "Canva · Orange Modern",          collection: "Canva reference", description: "Portafolio arquitectura blanco y naranja, energia grafica.",                           groups: ["portfolio", "editorial"],              tags: ["canva", "orange", "bold"],                thumbnail: "assets/template-previews/canva/EAGTkH8WXi4.jpg",  canvaId: "EAGTkH8WXi4",  canvaUrl: "https://www.canva.com/templates/EAGTkH8WXi4/"  },
    { value: "dune-spread",      label: "Canva · Brown Portfolio",        collection: "Canva reference", description: "Portafolio arquitectura marron moderno y calido.",                                    groups: ["portfolio", "hospitality"],            tags: ["canva", "brown", "portfolio"],            thumbnail: "assets/template-previews/canva/EAGsAh-OVLo.webp", canvaId: "EAGsAh-OVLo", canvaUrl: "https://www.canva.com/templates/EAGsAh-OVLo/" },
    { value: "atelier-spread",   label: "Canva · Brown Black Minimal",    collection: "Canva reference", description: "Arquitectura minimalista en tonos marron y negro.",                                    groups: ["portfolio", "editorial", "minimal"],   tags: ["canva", "brown", "minimal"],              thumbnail: "assets/template-previews/canva/EAGhhyrjjkg.webp", canvaId: "EAGhhyrjjkg", canvaUrl: "https://www.canva.com/templates/EAGhhyrjjkg/" },
    { value: "monolith-graphic", label: "Canva · BW Simple Modern",       collection: "Canva reference", description: "Arquitectura simple moderna en blanco y negro.",                                       groups: ["portfolio", "minimal"],                tags: ["canva", "bw", "simple"],                  thumbnail: "assets/template-previews/canva/EAHFf3kj4iA.jpg",  canvaId: "EAHFf3kj4iA",  canvaUrl: "https://www.canva.com/templates/EAHFf3kj4iA/"  },
    { value: "ivory-stacked",    label: "Canva · BW Modern II",           collection: "Canva reference", description: "Segunda variacion BW arquitectura moderna simple.",                                    groups: ["portfolio", "minimal"],                tags: ["canva", "bw", "modern"],                  thumbnail: "assets/template-previews/canva/EAGRNMmnuaA.jpg",  canvaId: "EAGRNMmnuaA",  canvaUrl: "https://www.canva.com/templates/EAGRNMmnuaA/"  },
    { value: "slate-airy",       label: "Canva · White Black Modern",     collection: "Canva reference", description: "Arquitectura moderna blanco y negro, tono sobrio.",                                    groups: ["portfolio", "minimal"],                tags: ["canva", "white", "black"],                thumbnail: "assets/template-previews/canva/EAGhDLLD7O4.jpg",  canvaId: "EAGhDLLD7O4",  canvaUrl: "https://www.canva.com/templates/EAGhDLLD7O4/"  },
    { value: "poster-graphic",   label: "Canva · Portafolio Naranja",     collection: "Canva reference", description: "Portafolio creativo minimalista en tonos naranjas.",                                   groups: ["editorial", "portfolio"],              tags: ["canva", "orange", "creative"],            thumbnail: "assets/template-previews/canva/EAFLv0V_9Ho.jpg",  canvaId: "EAFLv0V_9Ho",  canvaUrl: "https://www.canva.com/templates/EAFLv0V_9Ho/"  },
    { value: "poster-spread",    label: "Canva · Red Creative Brief",     collection: "Canva reference", description: "Creative brief moderno en rojo y blanco, impactante.",                                 groups: ["pitch", "editorial"],                  tags: ["canva", "red", "brief"],                  thumbnail: "assets/template-previews/canva/EAGsW4hEJkw.jpg",  canvaId: "EAGsW4hEJkw",  canvaUrl: "https://www.canva.com/templates/EAGsW4hEJkw/"  },
    { value: "magazine-graphic", label: "Canva · Marble Geometric",       collection: "Canva reference", description: "Arquitectura BW con textura marmol y geometria abstracta.",                            groups: ["editorial", "experimental"],           tags: ["canva", "marble", "abstract"],            thumbnail: "assets/template-previews/canva/EAGTP-02p34.jpg",  canvaId: "EAGTP-02p34",  canvaUrl: "https://www.canva.com/templates/EAGTP-02p34/"  },
    { value: "folio-spread",     label: "Canva · Beige Interior Guide",   collection: "Canva reference", description: "Guia y recomendaciones de interiorismo beige minimalista.",                            groups: ["editorial", "hospitality", "minimal"], tags: ["canva", "beige", "interior"],             thumbnail: "assets/template-previews/canva/EAFJITWQWWk.jpg",  canvaId: "EAFJITWQWWk",  canvaUrl: "https://www.canva.com/templates/EAFJITWQWWk/"  },
    { value: "onyx-graphic",     label: "Canva · Blue Gradient",          collection: "Canva reference", description: "Portafolio graphic design en negro y gradiente azul.",                                 groups: ["pitch", "dark", "experimental"],       tags: ["canva", "gradient", "blue"],              thumbnail: "assets/template-previews/canva/EAGHvxr_154.jpg",  canvaId: "EAGHvxr_154",  canvaUrl: "https://www.canva.com/templates/EAGHvxr_154/"  },
    { value: "monolith-airy",    label: "Canva · BW Portfolio",           collection: "Canva reference", description: "Portafolio arquitectura minimalista blanco y negro.",                                  groups: ["portfolio", "minimal"],                tags: ["canva", "bw", "portfolio"],               thumbnail: "assets/template-previews/canva/EAGubEOQn8Y.jpg",  canvaId: "EAGubEOQn8Y",  canvaUrl: "https://www.canva.com/templates/EAGubEOQn8Y/"  },
    { value: "slate-graphic",    label: "Canva · BW Clean Minimal",       collection: "Canva reference", description: "Arquitectura minimal y limpia, BW clasico.",                                           groups: ["portfolio", "minimal"],                tags: ["canva", "clean", "minimal"],              thumbnail: "assets/template-previews/canva/EAGV4SKvtkI.jpg",  canvaId: "EAGV4SKvtkI",  canvaUrl: "https://www.canva.com/templates/EAGV4SKvtkI/"  },
    { value: "obsidian-airy",    label: "Canva · Black Elegant",          collection: "Canva reference", description: "Diseno interior elegante en negro estilo luxury.",                                     groups: ["dark", "editorial", "hospitality"],    tags: ["canva", "black", "elegant"],              thumbnail: "assets/template-previews/canva/EAFy6z9zO0k.jpg",  canvaId: "EAFy6z9zO0k",  canvaUrl: "https://www.canva.com/templates/EAFy6z9zO0k/"  },
    { value: "velvet-stacked",   label: "Canva · Corporate Green",        collection: "Canva reference", description: "Catalogo corporativo en verde, lectura institucional.",                                groups: ["brand", "pitch"],                      tags: ["canva", "green", "catalog"],              thumbnail: "assets/template-previews/canva/EAFZccmrE1U.jpg",  canvaId: "EAFZccmrE1U",  canvaUrl: "https://www.canva.com/templates/EAFZccmrE1U/"  },
    { value: "magazine-spread",  label: "Canva · Black White Orange",     collection: "Canva reference", description: "Arquitectura moderna tricolor BW + naranja, alto contraste.",                          groups: ["editorial", "portfolio"],              tags: ["canva", "orange", "modern"],              thumbnail: "assets/template-previews/canva/EAG1o5cfZP0.jpg",  canvaId: "EAG1o5cfZP0",  canvaUrl: "https://www.canva.com/templates/EAG1o5cfZP0/"  },
    { value: "prism-stacked",    label: "Canva · Yellow Grey Creative",   collection: "Canva reference", description: "Portafolio creativo amarillo y gris, energetico.",                                     groups: ["experimental", "portfolio"],           tags: ["canva", "yellow", "grey"],                thumbnail: "assets/template-previews/canva/EAGnoGixvFY.webp", canvaId: "EAGnoGixvFY", canvaUrl: "https://www.canva.com/templates/EAGnoGixvFY/" },
    { value: "velvet-airy",      label: "Canva · Black Pink Clean",       collection: "Canva reference", description: "Portafolio moderno y limpio en negro y rosa.",                                         groups: ["editorial", "portfolio"],              tags: ["canva", "pink", "portfolio"],             thumbnail: "assets/template-previews/canva/EAGnaH1PQ5c.webp", canvaId: "EAGnaH1PQ5c", canvaUrl: "https://www.canva.com/templates/EAGnaH1PQ5c/" },
  ];

  const canvaReferenceEntries = entries.filter((entry) => entry.canvaId);
  const curatedEntries = canvaReferenceEntries.slice(0, LOCAL_TEMPLATE_TARGET_COUNT);
  const valueCounts = new Map();

  return curatedEntries.map((entry) => {
    const baseStyle = entry.baseStyle || entry.value;
    const preferredValue = `canva-${entry.canvaId}`;
    const seenCount = valueCounts.get(preferredValue) || 0;
    valueCounts.set(preferredValue, seenCount + 1);
    const normalizedEntry = {
      ...entry,
      baseStyle,
      value: seenCount ? `${preferredValue}-${seenCount + 1}` : preferredValue,
    };
    const styleProfile = getBaseBrochureStyleProfile(normalizedEntry.baseStyle || normalizedEntry.value);
    return {
      ...styleProfile,
      ...normalizedEntry,
      isLocalTemplate: true,
      canvaBridge: "local-preview-from-canva-reference",
      editableTargets: ["renderai-pdf", "canva-generation-brief"],
      searchIndex: [
        normalizedEntry.label,
        normalizedEntry.collection,
        normalizedEntry.description,
        styleProfile.family,
        styleProfile.variant,
        normalizedEntry.canvaId,
        normalizedEntry.canvaUrl,
        normalizedEntry.baseStyle,
        ...(normalizedEntry.groups || []),
        ...(normalizedEntry.tags || []),
      ].join(" ").toLowerCase(),
    };
  });
}

const BROCHURE_TEMPLATE_LIBRARY = buildBrochureTemplateLibrary();

const BROCHURE_LANGUAGE_OPTIONS = [
  { value: "es", label: "Espanol", description: "Todo el brochure en espanol legible y controlado." },
  { value: "en", label: "English", description: "All brochure copy in controlled, legible English." },
];

const TITLE_FONT_OPTIONS = [
  { value: "Cormorant Garamond", label: "Cormorant Garamond", sample: "Arquitectura Editorial" },
  { value: "Playfair Display", label: "Playfair Display", sample: "Luxury Presentation" },
  { value: "Libre Baskerville", label: "Libre Baskerville", sample: "Concept & Materiality" },
  { value: "Space Grotesk", label: "Space Grotesk", sample: "Modern Project Deck" },
  { value: "Bodoni Moda", label: "Bodoni Moda", sample: "Heritage Brochure" },
  { value: "Prata", label: "Prata", sample: "Architectural Atmosphere" },
  { value: "Abril Fatface", label: "Abril Fatface", sample: "Bold Statement Cover" },
  { value: "Syne", label: "Syne", sample: "Graphic Urban Portfolio" },
  { value: "Outfit", label: "Outfit", sample: "Clean Modern Showcase" },
  { value: "Inter Tight", label: "Inter Tight", sample: "Sharp Professional Deck" },
  { value: "Cinzel", label: "Cinzel", sample: "Monumental Luxury Tower" },
  { value: "DM Serif Display", label: "DM Serif Display", sample: "Premium Resort Identity" },
  { value: "Fraunces", label: "Fraunces", sample: "Artisan Heritage Collection" },
  { value: "EB Garamond", label: "EB Garamond", sample: "Classical Architecture Folio" },
  { value: "Lora", label: "Lora", sample: "Timeless Residential Project" },
  { value: "Gloock", label: "Gloock", sample: "Bold Sculptural Statement" },
  { value: "Italiana", label: "Italiana", sample: "Refined Atelier Aesthetic" },
  { value: "Young Serif", label: "Young Serif", sample: "Contemporary Heritage Feel" },
  { value: "Noto Serif Display", label: "Noto Serif Display", sample: "International Luxury Deck" },
  { value: "Crimson Pro", label: "Crimson Pro", sample: "Elegant Editorial Narrative" },
  { value: "Tenor Sans", label: "Tenor Sans", sample: "Minimalist Sophistication" },
  { value: "Spectral", label: "Spectral", sample: "Immersive Reading Experience" },
  { value: "Josefin Sans", label: "Josefin Sans", sample: "Art Deco Modern Tower" },
];

const BODY_FONT_OPTIONS = [
  { value: "Manrope", label: "Manrope", sample: "Texto claro, comercial y contemporaneo." },
  { value: "DM Sans", label: "DM Sans", sample: "Readable, clean and presentation-ready." },
  { value: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sample: "Balance entre sobriedad y claridad." },
  { value: "Space Grotesk", label: "Space Grotesk", sample: "More graphic, modern and technical." },
  { value: "Archivo", label: "Archivo", sample: "Mas tecnico, urbano y preciso." },
  { value: "Urbanist", label: "Urbanist", sample: "Mas amable, premium y ligera." },
  { value: "Inter Tight", label: "Inter Tight", sample: "Compacta, limpia y ejecutiva." },
  { value: "Outfit", label: "Outfit", sample: "Neutral, flexible y visual." },
  { value: "Syne", label: "Syne", sample: "Experimental, grafica y creativa." },
  { value: "Albert Sans", label: "Albert Sans", sample: "Moderno, limpio y geometrico." },
  { value: "Figtree", label: "Figtree", sample: "Friendly, open and approachable." },
  { value: "Lexend", label: "Lexend", sample: "Optimizada para lectura fluida." },
  { value: "Karla", label: "Karla", sample: "Grotesque with personality and rhythm." },
  { value: "Work Sans", label: "Work Sans", sample: "Corporativo, preciso y neutro." },
  { value: "Rubik", label: "Rubik", sample: "Rounded, warm and versatile." },
  { value: "Nunito Sans", label: "Nunito Sans", sample: "Suave, amigable y profesional." },
  { value: "Josefin Sans", label: "Josefin Sans", sample: "Geometrica elegante con caracter." },
  { value: "Tenor Sans", label: "Tenor Sans", sample: "Sans-serif with serif elegance." },
];

const SLIDE_LAYOUT_OPTIONS = [
  { value: "feature", label: "Hero", description: "Imagen protagonista y texto minimo." },
  { value: "split", label: "Split", description: "Imagen y narrativa equilibradas." },
  { value: "board", label: "Board", description: "Mood board o collage editorial." },
  { value: "gallery", label: "Galeria", description: "Varias imagenes curadas en una misma lamina." },
  { value: "technical", label: "Tecnica", description: "Plano o lectura mas informativa." },
];

const SLIDE_IMAGE_SOURCE_OPTIONS = [
  { value: "inherit", label: "Segun brochure", description: "Respeta el modo global del paso 3." },
  { value: "rendered", label: "Renderizada", description: "Usa la version render maestra de esa imagen." },
  { value: "raw", label: "Cruda", description: "Mantiene la foto original sin reinterpretarla." },
];

const SLIDE_IMAGE_PLACEMENT_OPTIONS = [
  { value: "full", label: "Completa", description: "Imagen dominante a pagina completa." },
  { value: "left", label: "Izquierda", description: "Visual principal anclado a la izquierda." },
  { value: "right", label: "Derecha", description: "Visual principal anclado a la derecha." },
  { value: "top", label: "Superior", description: "La imagen vive arriba y el texto abajo." },
  { value: "bottom", label: "Inferior", description: "La imagen baja y el contenido se apoya arriba." },
  { value: "center", label: "Centro", description: "Visual central con aire alrededor." },
];

const SLIDE_IMAGE_ASPECT_OPTIONS = [
  { value: "landscape", label: "Rectangular", description: "Formato horizontal editorial." },
  { value: "square", label: "Cuadrada", description: "Mas modular y tipo editorial board." },
  { value: "portrait", label: "Vertical", description: "Mas afiche, poster o portada." },
  { value: "panoramic", label: "Panoramica", description: "Mas cinematica y arquitectonica." },
];

const SLIDE_IMAGE_SIZE_OPTIONS = [
  { value: "small", label: "Pequena", description: "La imagen ocupa una porcion contenida de la pagina." },
  { value: "medium", label: "Mediana", description: "Balance entre aire, texto e imagen." },
  { value: "large", label: "Grande", description: "La imagen domina buena parte del layout." },
  { value: "giant", label: "Gigante", description: "Presencia casi total con margenes minimos." },
  { value: "full-page", label: "Total", description: "Maximo impacto visual dentro de la pagina." },
];

const SLIDE_IMAGE_ZONE_OPTIONS = [
  { value: "top-left", label: "Superior izquierda", description: "Ancla la visual arriba a la izquierda." },
  { value: "top-center", label: "Superior centro", description: "Visual arriba y centrada." },
  { value: "top-right", label: "Superior derecha", description: "Ancla la visual arriba a la derecha." },
  { value: "middle-left", label: "Centro izquierda", description: "Visual a media altura y a la izquierda." },
  { value: "center", label: "Centro", description: "Imagen totalmente centrada." },
  { value: "middle-right", label: "Centro derecha", description: "Visual a media altura y a la derecha." },
  { value: "bottom-left", label: "Inferior izquierda", description: "Ancla la visual abajo a la izquierda." },
  { value: "bottom-center", label: "Inferior centro", description: "Visual abajo y centrada." },
  { value: "bottom-right", label: "Inferior derecha", description: "Ancla la visual abajo a la derecha." },
];

const SLIDE_IMAGE_FRAMING_OPTIONS = [
  { value: "clean", label: "Limpia", description: "Sin recorte agresivo ni efecto extra." },
  { value: "zoom", label: "Zoom", description: "Recorte con enfoque en una zona." },
  { value: "cropped", label: "Cortada", description: "Recorte editorial mas agresivo." },
  { value: "blurred", label: "Difuminada", description: "Base suave para texto o atmosfera." },
];

const SLIDE_IMAGE_ARRANGEMENT_OPTIONS = [
  { value: "single", label: "Una foto", description: "Una sola imagen protagonista." },
  { value: "pair", label: "Pareja", description: "Dos visuales en dialogo dentro de la pagina." },
  { value: "duplicate", label: "Duplicada", description: "La misma imagen en dos planos editoriales." },
  { value: "mirror", label: "Espejo", description: "Version reflejada para una composicion dramatica." },
  { value: "triptych", label: "Triptico", description: "Tres cortes o lecturas del mismo material." },
  { value: "collage", label: "Collage", description: "Composicion curada tipo board creativo." },
  { value: "divisions", label: "Divisiones", description: "Modulo dividido con multiples fragmentos." },
];

const MOOD_BOARD_LAYOUT_OPTIONS = [
  {
    value: "grid-separated",
    label: "Cuadricula separada",
    description: "Muestras de materiales en cuadros limpios con aire entre piezas.",
    prompt: "Separated grid of physical material tiles with generous gaps, each sample isolated like a high-end specification board.",
  },
  {
    value: "object-flatlay",
    label: "Objetos conceptuales",
    description: "Flatlay editorial con objetos, muestras y atmosfera del proyecto.",
    prompt: "Conceptual object flatlay with layered samples, furniture cues, plants and real material objects styled like a photographed interior design board.",
  },
  {
    value: "venetian-strips",
    label: "Persiana material",
    description: "Franjas verticales o lineales, cada linea es un material.",
    prompt: "Venetian blind inspired composition: parallel material strips, each strip a different tactile material, unified by shadows and architectural rhythm.",
  },
  {
    value: "open-gallery",
    label: "Galeria abierta",
    description: "Mucho espacio blanco, pocas piezas grandes y lectura premium.",
    prompt: "Open gallery board with large negative space, a few oversized material samples and refined editorial spacing.",
  },
  {
    value: "sample-stack",
    label: "Capas apiladas",
    description: "Muestras superpuestas con profundidad, sombras y tactilidad.",
    prompt: "Stacked sample composition with overlapping slabs, veneer cards, fabric pieces, metal and glass accents with visible thickness.",
  },
  {
    value: "material-rail",
    label: "Riel horizontal",
    description: "Una linea curada de materiales como una mesa de especificacion.",
    prompt: "Horizontal material rail: a precise row of swatches and object cues on an architect desk, clean and highly ordered.",
  },
  {
    value: "pinboard",
    label: "Pinboard creativo",
    description: "Recortes, muestras y referencias fijadas como tablero de estudio.",
    prompt: "Creative pinboard collage with pinned samples, cropped material photos and object fragments, no readable labels.",
  },
  {
    value: "circular-palette",
    label: "Paleta circular",
    description: "Discos, chips y muestras curvas para una lectura mas organica.",
    prompt: "Circular palette board using round color chips, material discs and curved object accents arranged as a premium physical mood board.",
  },
  {
    value: "architect-desk",
    label: "Mesa de arquitecto",
    description: "Planos, muestras y objetos sobre una mesa de trabajo elegante.",
    prompt: "Architect desk scene with clean plans, material samples, scale cues and objects arranged as a real studio tabletop photograph.",
  },
  {
    value: "museum-plinths",
    label: "Pedestales",
    description: "Materiales como piezas de exhibicion, sobrio y escultural.",
    prompt: "Museum plinth composition where materials and objects sit on minimal blocks, sculptural, premium, quiet and architectural.",
  },
];

const SLIDE_RENDER_TREATMENT_OPTIONS = [
  { value: "master", label: "Master", description: "Usa la version render principal del proyecto." },
  { value: "editorial", label: "Editorial", description: "Mas premium, comercial y fotografica." },
  { value: "warm", label: "Calida", description: "Mas hospitalaria y con grading calido." },
  { value: "moody", label: "Oscura", description: "Mas densa y sofisticada." },
  { value: "linear", label: "Lineal", description: "Visual tipo dibujo arquitectonico." },
  { value: "technical", label: "Tecnica", description: "Mas sobria y precisa." },
];

const SLIDE_TEXT_MODE_OPTIONS = [
  { value: "suggested", label: "Texto sugerido", description: "Usa copy sugerido editable y controlado." },
  { value: "custom", label: "Texto editado", description: "El usuario corrige o reemplaza el texto sugerido." },
  { value: "free", label: "Texto libre", description: "La diapositiva queda totalmente escrita por el usuario." },
];

const SLIDE_BACKGROUND_OPTIONS = [
  { value: "inherit", label: "Segun estilo", description: "Hereda el degradado del estilo de brochure seleccionado." },
  { value: "dark-luxury", label: "Oscuro premium", description: "Fondo negro mate con acento dorado sutil." },
  { value: "warm-sand", label: "Arena calida", description: "Degradado arena a beige con luz natural." },
  { value: "cool-mist", label: "Niebla fria", description: "Azul gris suave con transicion a blanco." },
  { value: "deep-forest", label: "Bosque profundo", description: "Verde oscuro a esmeralda con atmosfera." },
  { value: "rose-dusk", label: "Atardecer rosa", description: "Rosa palido a durazno con calidez suave." },
  { value: "midnight", label: "Medianoche", description: "Azul noche profundo con sutil brillo." },
  { value: "pure-white", label: "Blanco puro", description: "Fondo limpio sin degradado." },
  { value: "charcoal", label: "Carbon", description: "Gris oscuro elegante y sobrio." },
  { value: "aurora-pastel", label: "Aurora pastel", description: "Degradado multicolor suave tipo cielo nordico." },
  { value: "terracotta", label: "Terracota", description: "Naranja tierra a crema calido." },
  { value: "ocean", label: "Oceano", description: "Azul profundo a turquesa con movimiento." },
];

const SLIDE_IMAGE_REPRESENTATION_OPTIONS = DECISION_GROUPS.pdf.find((group) => group.key === "representationStyle")?.options || [];
const SLIDE_IMAGE_FINISH_OPTIONS = DECISION_GROUPS.pdf.find((group) => group.key === "imageFinish")?.options || [];
const SLIDE_IMAGE_OCCUPANCY_OPTIONS = DECISION_GROUPS.pdf.find((group) => group.key === "occupancy")?.options || [];

const DEFAULT_SETTINGS = {
  contextBrief: "",
  changeRequest: "",
  fidelity: "absolute",
  realism: "hyperreal",
  imageMood: "warm",
  renderLanguage: "photographic",
  timeOfDay: "golden-hour",
  lightScenario: "mixed",
  cameraIntent: "hero",
  occupancy: "none",
  detailPriority: "uniformity",
  representationStyle: "photographic",
  imageFinish: "crisp",
  lensProfile: "corrected-wide",
  weatherAtmosphere: "clear",
  pageCount: "8",
  audience: "client",
  pdfTone: "commercial-premium",
  narrative: "concept-first",
  plans: "selected",
  visualDensity: "balanced",
  coverStyle: "visual",
  deckMode: "client",
  projectType: "business",
  pdfImageMode: "rendered",
  brochureStyle: CANVA_TEMPLATE_DEFAULT,
  brochureLanguage: "es",
  titleFont: "Cormorant Garamond",
  bodyFont: "Manrope",
  colorMode: "suggested",
  selectedPalette: [],
  selectedAmenities: [],
  customAmenities: [],
  amenityCount: "2",
  pdfSections: ["cover", "concept", "moodboard", "materials", "amenities", "plan-2d", "closing"],
  pdfSlideConfigs: {},
};

const state = {
  session: null,
  flow: null,
  currentStep: 1,
  images: [],
  documents: [],
  mainId: null,
  settings: { ...DEFAULT_SETTINGS, ...loadJson(STORAGE_KEYS.settings, {}) },
  feedback: loadJson(STORAGE_KEYS.feedback, []),
  feedbackDraft: { category: "render", rating: 4, message: "" },
  server: { healthy: false, aiReady: false, analysisReady: false, renderProvider: "local", analysisProvider: "none", secretSource: "none", baseUrl: "", port: "" },
  adminDrawerOpen: false,
  analysisBusy: false,
  analysisRerunRequested: false,
  promptText: "",
  result: {
    render: null,
    renderHistory: [],
    deck: null,
  },
  generation: {
    busy: false,
    kind: null,
    stage: "",
  },
  annotation: {
    mode: false,
    key: "objects",
    label: "",
    dragging: false,
    draft: null,
  },
  pdfBuilder: {
    availableSelection: [],
    chosenSelection: [],
    currentSlideKey: null,
    styleFilter: "all",
    styleSearch: "",
  },
  ai: {
    cocoModel: null,
    cocoLoading: null,
    tesseractLoading: null,
  },
};

const elements = {};
let assetDropzoneDragDepth = 0;
let apiHealthTimer = null;

const ELEMENT_IDS = [
  "authScreen", "loginForm", "loginUsername", "loginPassword", "loginError",
  "appShell", "apiHealthChip", "sessionChip", "adminToggleBtn", "logoutBtn",
  "flowScreen", "flowRenderCard", "flowPdfCard", "wizardShell", "backToFlowsBtn",
  "wizardFlowLabel", "wizardFlowTitle", "wizardFlowSummary", "stepper", "step1Panel",
  "step2Panel", "step3Panel", "step4Panel", "assetSummary", "assetDropzone", "assetDropzoneTitle",
  "assetDropzoneHint", "imageInput", "documentInput", "primaryGallery", "supportGallery",
  "analysisStatus", "refreshAnalysisBtn", "analysisPreviewEmpty", "analysisPreview", "analysisOverlay",
  "analysisCanvas", "analysisInteractionLayer", "annotationDraft", "annotationCategory", "annotationLabel",
  "annotationToggleBtn", "annotationResetBtn", "annotationHelp",
  "analysisSummary", "analysisMeta", "analysisEditors", "step3Eyebrow", "step3Title", "contextBrief", "changeRequest", "decisionGroups", "pdfDeckBuilder",
  "pdfSectionStudio", "step4Eyebrow", "step4Title", "resultView",
  "resultStatus", "downloadResultBtn", "downloadAltBtn", "regenerateResultBtn", "restartFlowBtn", "resultPrimary",
  "resultSecondary", "resultMeta", "feedbackForm", "feedbackCategoryChips", "feedbackRatingChips",
  "feedbackMessage", "feedbackSubmitBtn", "feedbackHistory", "prevStepBtn", "nextStepBtn", "stepHint",
  "adminDrawer", "adminCloseBtn", "adminStats", "adminQueue", "promptDebugBlock", "internalPrompt",
];

document.addEventListener("DOMContentLoaded", init);
window.addEventListener("error", (event) => toast(`Error de arranque: ${event.message}`, "error"));
window.addEventListener("unhandledrejection", (event) => toast(`Promesa rechazada: ${String(event.reason || "error")}`, "error"));

function init() {
  ELEMENT_IDS.forEach((id) => { elements[id] = document.getElementById(id); });
  bindEvents();
  hydrateSession();
  elements.contextBrief.value = state.settings.contextBrief || "";
  elements.changeRequest.value = state.settings.changeRequest || "";
  elements.feedbackMessage.value = state.feedbackDraft.message || "";
  applySession();
  renderAll();
  checkApiHealth();
  if (apiHealthTimer) clearInterval(apiHealthTimer);
  apiHealthTimer = window.setInterval(() => { checkApiHealth(); }, 10000);
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", handleLogin);
  elements.logoutBtn.addEventListener("click", logout);
  elements.flowRenderCard.addEventListener("click", () => selectFlow("render"));
  elements.flowPdfCard.addEventListener("click", () => selectFlow("pdf"));
  elements.backToFlowsBtn.addEventListener("click", goBackToFlows);
  elements.prevStepBtn.addEventListener("click", async () => { await moveStep(-1); });
  elements.nextStepBtn.addEventListener("click", async () => { await moveStep(1); });
  elements.assetDropzone.addEventListener("click", triggerAssetPicker);
  ["dragenter", "dragover"].forEach((eventName) => {
    elements.assetDropzone.addEventListener(eventName, handleAssetDragEnter);
  });
  ["dragleave", "dragend"].forEach((eventName) => {
    elements.assetDropzone.addEventListener(eventName, handleAssetDragLeave);
  });
  elements.assetDropzone.addEventListener("drop", handleAssetDrop);
  elements.imageInput.addEventListener("change", (event) => handleImageFiles(event.target.files));
  elements.documentInput.addEventListener("change", (event) => handleMixedFiles(event.target.files));
  elements.refreshAnalysisBtn.addEventListener("click", () => runProjectAnalyses(true));
  elements.contextBrief.addEventListener("input", handleContextChange);
  elements.changeRequest.addEventListener("input", handleChangeRequest);
  elements.downloadResultBtn.addEventListener("click", () => downloadCurrentResult("primary"));
  elements.downloadAltBtn.addEventListener("click", () => downloadCurrentResult("alternate"));
  elements.regenerateResultBtn.addEventListener("click", async () => { await handleGenerateResult(true); });
  elements.restartFlowBtn.addEventListener("click", restartCurrentFlow);
  elements.feedbackForm.addEventListener("submit", submitFeedback);
  elements.adminToggleBtn.addEventListener("click", () => toggleAdminDrawer(true));
  elements.adminCloseBtn.addEventListener("click", () => toggleAdminDrawer(false));
  elements.annotationCategory.addEventListener("change", (event) => {
    state.annotation.key = event.target.value;
    syncAnnotationUi();
  });
  elements.annotationLabel.addEventListener("input", (event) => {
    state.annotation.label = event.target.value;
  });
  elements.annotationToggleBtn.addEventListener("click", toggleAnnotationMode);
  elements.annotationResetBtn.addEventListener("click", cancelAnnotationMode);
  elements.analysisInteractionLayer.addEventListener("pointerdown", startAnnotationDrag);
  elements.analysisInteractionLayer.addEventListener("pointermove", updateAnnotationDrag);
  window.addEventListener("pointerup", finishAnnotationDrag);
  document.addEventListener("click", handleDelegatedClick);
  document.addEventListener("change", handleDelegatedChange);
  document.addEventListener("input", handleDelegatedInput);
}

function hydrateSession() {
  const saved = loadJson(STORAGE_KEYS.session, null);
  if (!saved) return;
  const user = KNOWN_USERS.find((entry) => entry.username === saved.username && entry.role === saved.role);
  if (user) state.session = { ...user, name: saved.name || user.name };
}

function getFlowSteps() {
  return state.flow === "pdf" ? PDF_STEPS : RENDER_STEPS;
}

async function handleLogin(event) {
  event.preventDefault();
  const username = elements.loginUsername.value.trim();
  const password = elements.loginPassword.value;
  const submitButton = elements.loginForm.querySelector('button[type="submit"]');
  elements.loginError.classList.add("hidden");
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Validando...";
  }

  try {
    const response = await apiRequest("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok || !data.user) {
      throw new Error(data.message || "Usuario o password invalido.");
    }

    const user = {
      username: String(data.user.username || username),
      role: String(data.user.role || "user"),
      name: String(data.user.name || username),
    };

    state.session = user;
    saveJson(STORAGE_KEYS.session, { username: user.username, role: user.role, name: user.name });
    toast(`Sesion iniciada como ${user.name}.`, "ok");
    applySession();
    renderAll();
  } catch (error) {
    elements.loginError.classList.remove("hidden");
    elements.loginError.textContent = error.message || "No se pudo iniciar sesion.";
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Ingresar";
    }
  }
}

function logout() {
  state.session = null;
  state.adminDrawerOpen = false;
  localStorage.removeItem(STORAGE_KEYS.session);
  resetFlowRuntime({ preserveAssets: false, clearFlow: true });
  applySession();
  renderAll();
}

function applySession() {
  const loggedIn = Boolean(state.session);
  elements.authScreen.classList.toggle("hidden", loggedIn);
  elements.appShell.classList.toggle("hidden", !loggedIn);
  elements.sessionChip.textContent = loggedIn ? `${state.session.name} · ${state.session.username}` : "Sin sesion";
  elements.adminToggleBtn.classList.toggle("hidden", !(loggedIn && state.session.role === "admin"));
  elements.promptDebugBlock.classList.toggle("hidden", !(loggedIn && state.session.role === "admin"));
  if (!loggedIn) toggleAdminDrawer(false);
}

function selectFlow(flow) {
  state.flow = flow === "pdf" ? "pdf" : "render";
  state.currentStep = 1;
  state.generation.busy = false;
  state.generation.kind = null;
  state.generation.stage = "";
  state.result.deck = null;
  state.result.render = null;
  state.pdfBuilder.currentSlideKey = null;
  state.annotation.mode = false;
  state.annotation.dragging = false;
  state.annotation.draft = null;
  renderAll();
  if (state.images.some((image) => !image.analysis)) runProjectAnalyses(false);
}

function goBackToFlows() {
  resetFlowRuntime({ preserveAssets: true, clearFlow: true });
  renderAll();
}

async function moveStep(direction) {
  if (!state.flow || state.generation.busy) return;
  const steps = getFlowSteps();
  const generationStep = state.flow === "pdf" ? 5 : 3;
  if (direction > 0 && state.currentStep === generationStep) {
    await handleGenerateResult(false);
    return;
  }
  const targetStep = clamp(state.currentStep + direction, 1, steps.length);
  if (direction > 0 && !validateStep(state.currentStep)) return;
  state.currentStep = targetStep;
  if (direction < 0 && state.currentStep < steps.length) {
    state.generation.stage = "";
  }
  renderAll();
  if (state.currentStep === 2 && state.images.some((image) => !image.analysis)) {
    runProjectAnalyses(false);
  }
}

function validateStep(step) {
  if (step === 1) {
    if (!state.images.length) {
      toast("Carga al menos una imagen para continuar.", "warn");
      return false;
    }
    return true;
  }

  if (step === 2) {
    const main = getMainImage();
    if (!main) {
      toast("Selecciona una referencia principal para continuar.", "warn");
      return false;
    }
    const pendingAnalyses = state.images.filter((image) => !image.analysis).length;
    if (!main.analysis || pendingAnalyses) {
      if (!state.analysisBusy) runProjectAnalyses(false);
      toast("Espera a que la descomposicion completa del proyecto termine antes de avanzar.", "warn");
      return false;
    }
  }

  if (step === 4 && state.flow === "pdf") {
    const blueprints = computePdfSlideBlueprints();
    if (!blueprints.length) {
      toast("Selecciona al menos una seccion para el brochure.", "warn");
      return false;
    }
    if (
      hasPdfSectionBase("amenities", state.settings.pdfSections)
      && Number(state.settings.amenityCount || 0) > 0
      && safeArray(state.settings.selectedAmenities).length < Number(state.settings.amenityCount || 0)
    ) {
      toast("Si activas amenidades con cantidad mayor a cero, completa la seleccion visual.", "warn");
      return false;
    }
  }

  return true;
}

function renderAll() {
  renderWorkspaceVisibility();
  renderHeader();
  renderStepper();
  renderStepPanels();
  renderAssets();
  renderAnalysis();
  renderDecisions();
  renderPdfSectionStudio();
  renderResult();
  renderFeedback();
  renderAdmin();
}

function renderWorkspaceVisibility() {
  const showWizard = Boolean(state.session && state.flow);
  const showFlowScreen = Boolean(state.session && !state.flow);
  elements.flowScreen.classList.toggle("hidden", !showFlowScreen);
  elements.wizardShell.classList.toggle("hidden", !showWizard);
}

function renderHeader() {
  if (!state.flow) return;
  if (state.flow === "render") {
    elements.wizardFlowLabel.textContent = "Render";
    elements.wizardFlowTitle.textContent = "Render fotorrealista";
    elements.wizardFlowSummary.textContent = "Sube una referencia, corrige la lectura IA y genera una imagen arquitectonica premium.";
  } else {
    elements.wizardFlowLabel.textContent = "Brochure";
    elements.wizardFlowTitle.textContent = "Brochure PDF";
    elements.wizardFlowSummary.textContent = "Sube fotos, configura tono y secciones, personaliza cada diapositiva y exporta un deck profesional.";
  }
}

function renderStepper() {
  if (!state.flow) {
    elements.stepper.innerHTML = "";
    return;
  }

  const steps = getFlowSteps();
  elements.stepper.style.setProperty("--step-count", String(steps.length));
  elements.stepper.innerHTML = steps.map((step) => {
    const classes = ["step-item", step.id === state.currentStep ? "active" : "", step.id < state.currentStep ? "complete" : ""].filter(Boolean).join(" ");
    return `
      <li class="${classes}">
        <div class="step-badge"><span>${step.id}</span></div>
        <div class="step-copy">
          <strong>${escapeHtml(step.title)}</strong>
          <span>${escapeHtml(step.copy)}</span>
        </div>
      </li>
    `;
  }).join("");

  const current = steps.find((step) => step.id === state.currentStep);
  elements.stepHint.textContent = current ? current.copy : "";
  elements.prevStepBtn.classList.toggle("hidden", state.currentStep === 1);
  elements.nextStepBtn.classList.toggle("hidden", state.currentStep === steps.length);
  elements.prevStepBtn.disabled = state.generation.busy;
  elements.nextStepBtn.disabled = state.generation.busy;
  if ((state.flow === "render" && state.currentStep === 3) || (state.flow === "pdf" && state.currentStep === 5)) {
    elements.nextStepBtn.textContent = state.flow === "pdf" ? "Generar brochure" : "Generar render";
  } else {
    elements.nextStepBtn.textContent = "Siguiente";
  }
  elements.prevStepBtn.textContent = state.flow === "pdf" && state.currentStep === 6
    ? "Volver al editor"
    : state.flow === "pdf" && state.currentStep === 5
      ? "Volver a diapositivas"
      : state.flow === "render" && state.currentStep === 4
        ? "Volver a decisiones"
        : "Atras";
}

function renderStepPanels() {
  elements.step1Panel.classList.toggle("hidden", state.currentStep !== 1);
  elements.step2Panel.classList.toggle("hidden", state.currentStep !== 2);
  if (state.flow === "pdf") {
    elements.step3Panel.classList.toggle("hidden", !(state.currentStep === 3 || state.currentStep === 4));
    elements.step3Eyebrow.textContent = state.currentStep === 4 ? "Paso 4" : "Paso 3";
    elements.step3Title.textContent = state.currentStep === 4 ? "Cantidad y tipo de diapositivas" : "Diseno editorial y contexto";
    elements.step4Panel.classList.toggle("hidden", !(state.currentStep === 5 || state.currentStep === 6));
    elements.step4Eyebrow.textContent = state.currentStep === 5 ? "Paso 5" : "Paso 6";
    elements.step4Title.textContent = state.currentStep === 5 ? "Editor de diapositiva" : "Resultado final";
    elements.pdfSectionStudio.classList.toggle("hidden", state.currentStep !== 5);
    elements.resultView.classList.toggle("hidden", state.currentStep !== 6);
  } else {
    elements.step3Panel.classList.toggle("hidden", state.currentStep !== 3);
    elements.step3Eyebrow.textContent = "Paso 3";
    elements.step3Title.textContent = "Decisiones y contexto";
    elements.step4Panel.classList.toggle("hidden", state.currentStep !== 4);
    elements.step4Eyebrow.textContent = "Paso 4";
    elements.step4Title.textContent = "Resultado final";
    elements.pdfSectionStudio.classList.add("hidden");
    elements.resultView.classList.remove("hidden");
  }
}

function triggerAssetPicker() {
  if (state.flow === "pdf") elements.documentInput.click();
  else elements.imageInput.click();
}

function handleAssetDragEnter(event) {
  event.preventDefault();
  assetDropzoneDragDepth += 1;
  elements.assetDropzone.classList.add("is-dragging");
}

function handleAssetDragLeave(event) {
  event.preventDefault();
  assetDropzoneDragDepth = Math.max(0, assetDropzoneDragDepth - 1);
  if (assetDropzoneDragDepth === 0) {
    elements.assetDropzone.classList.remove("is-dragging");
  }
}

async function handleAssetDrop(event) {
  event.preventDefault();
  assetDropzoneDragDepth = 0;
  elements.assetDropzone.classList.remove("is-dragging");
  const files = Array.from(event.dataTransfer?.files || []);
  if (!files.length) {
    toast("No se detectaron archivos en el arrastre.", "warn");
    return;
  }

  if (state.flow === "pdf") {
    await handleMixedFiles(files);
    return;
  }

  const imageFiles = files.filter((file) => file.type.startsWith("image/"));
  if (!imageFiles.length) {
    toast("En flujo render solo puedes soltar imagenes.", "warn");
    return;
  }
  await handleImageFiles(imageFiles);
}

async function handleImageFiles(fileList) {
  const files = Array.from(fileList || []).filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;
  for (const file of files) {
    await addImageFile(file);
  }
  elements.imageInput.value = "";
  renderAll();
  if (state.images.some((image) => !image.analysis)) runProjectAnalyses(false);
}

async function handleMixedFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  for (const file of files) {
    if (file.type.startsWith("image/")) await addImageFile(file);
    else addDocumentFile(file);
  }
  elements.documentInput.value = "";
  renderAll();
  if (state.images.some((image) => !image.analysis)) runProjectAnalyses(false);
}

async function addImageFile(file) {
  const url = await fileToDataUrl(file);
  const item = { id: cryptoRandom(), name: file.name, size: file.size, type: file.type, url, analysis: null };
  state.images.unshift(item);
  if (!state.mainId) state.mainId = item.id;
}

function addDocumentFile(file) {
  state.documents.unshift({ id: cryptoRandom(), name: file.name, size: file.size, type: file.type || "application/octet-stream" });
}

function renderAssets() {
  const imageCount = state.images.length;
  const documentCount = state.documents.length;
  elements.assetSummary.textContent = imageCount || documentCount
    ? state.flow === "pdf" ? `${imageCount} imagenes · ${documentCount} documentos` : `${imageCount} imagenes`
    : "Sin archivos";

  if (state.flow === "pdf") {
    elements.assetDropzoneTitle.textContent = "Sube imagenes, PDFs o planos base";
    elements.assetDropzoneHint.textContent = "Puedes combinar imagenes de referencia, boards, PDFs y soporte tecnico para construir el deck.";
  } else {
    elements.assetDropzoneTitle.textContent = "Sube una o varias referencias visuales";
    elements.assetDropzoneHint.textContent = "Define luego una imagen principal. Toda la lectura y la generacion quedan vinculadas a esa escena.";
  }

  renderPrimaryGallery();
  renderSupportGallery();
}

function renderPrimaryGallery() {
  if (!state.images.length) {
    elements.primaryGallery.innerHTML = `<div class="empty-state"><strong>No hay referencias cargadas</strong><span>Sube una escena base para comenzar el flujo.</span></div>`;
    return;
  }

  elements.primaryGallery.innerHTML = state.images.map((item) => {
    const isMain = item.id === state.mainId;
    const analysisLabel = item.analysis ? `${item.analysis.objects.length} objetos · ${item.analysis.texts.length} textos` : "Lectura pendiente";
    return `
      <article class="asset-card">
        <img src="${item.url}" alt="${escapeHtml(item.name)}" />
        <div class="asset-head">
          <div class="asset-copy">
            <strong>${escapeHtml(item.name)}</strong>
            <p>${escapeHtml(analysisLabel)}</p>
          </div>
          <span class="status-chip ${isMain ? "status-ok" : "status-soft"}">${isMain ? "Principal" : "Secundaria"}</span>
        </div>
        <div class="asset-actions">
          <button type="button" class="button button-secondary" data-action="set-main" data-id="${item.id}">Usar principal</button>
          <button type="button" class="button button-ghost" data-action="delete-image" data-id="${item.id}">Eliminar</button>
        </div>
      </article>
    `;
  }).join("");
}

function renderSupportGallery() {
  if (!state.documents.length) {
    elements.supportGallery.innerHTML = `<div class="empty-state"><strong>No hay soporte adicional</strong><span>En flujo PDF puedes sumar PDFs, planos o apoyo documental cuando lo necesites.</span></div>`;
    return;
  }

  elements.supportGallery.innerHTML = state.documents.map((item) => `
    <article class="support-card">
      <strong>${escapeHtml(item.name)}</strong>
      <p>${escapeHtml(item.type)} · ${escapeHtml(formatFileSize(item.size))}</p>
      <div class="asset-actions">
        <button type="button" class="button button-ghost" data-action="delete-doc" data-id="${item.id}">Eliminar</button>
      </div>
    </article>
  `).join("");
}

async function runMainAnalysis(forceRemote) {
  const main = getMainImage();
  if (!main) {
    toast("Primero selecciona una imagen principal.", "warn");
    return;
  }

  state.analysisBusy = true;
  elements.analysisStatus.textContent = `Analizando ${main.name}`;
  renderAnalysis();

  try {
    await analyzeImageReference(main, forceRemote);
    updatePromptText();
    toast("Descomposicion actualizada.", "ok");
  } catch {
    main.analysis = buildAnalysisFallback();
    updatePromptText();
    toast("La lectura completa no pudo terminar; se uso una base editable.", "warn");
  } finally {
    state.analysisBusy = false;
    renderAll();
  }
}

async function runProjectAnalyses(forceRemote = false) {
  const items = safeArray(state.images);
  if (!items.length) return;
  if (state.analysisBusy) {
    state.analysisRerunRequested = true;
    return;
  }

  state.analysisBusy = true;
  state.analysisRerunRequested = false;
  renderAnalysis();

  let completed = 0;
  try {
    for (let index = 0; index < items.length; index += 1) {
      const image = items[index];
      if (image.analysis && !forceRemote) {
        completed += 1;
        continue;
      }
      elements.analysisStatus.textContent = `Descomponiendo referencia ${index + 1} de ${items.length}: ${image.name}`;
      renderAssets();
      renderAnalysis();
      await analyzeImageReference(image, forceRemote).catch(() => {
        image.analysis = image.analysis || buildAnalysisFallback();
      });
      completed += 1;
      renderAssets();
      renderAnalysis();
      updatePromptText();
    }
    toast(`Descomposicion de proyecto lista: ${completed}/${items.length} referencias.`, "ok");
  } finally {
    state.analysisBusy = false;
    renderAll();
    updatePromptText();
    if (state.analysisRerunRequested || state.images.some((image) => !image.analysis)) {
      state.analysisRerunRequested = false;
      runProjectAnalyses(forceRemote);
    }
  }
}

async function analyzeImageReference(image, forceRemote = false) {
  if (!image) return buildAnalysisFallback();
  const localAnalysis = await buildLocalAnalysis(image);
  let remoteAnalysis = null;
  if (state.server.analysisReady) {
    remoteAnalysis = await requestAiAnalysis(image).catch(() => null);
    if (forceRemote && !remoteAnalysis) {
      toast("La lectura IA no respondio; se mantiene la lectura local y editable.", "warn");
    }
  }
  image.analysis = mergeAnalyses(localAnalysis, remoteAnalysis);
  return image.analysis;
}

async function buildLocalAnalysis(item) {
  const image = await loadImage(item.url);
  const pixel = sampleImage(image);
  const [objectDetails, textDetails] = await Promise.all([
    detectObjects(image).catch(() => []),
    detectText(item.url).catch(() => []),
  ]);

  const objects = unique(objectDetails.map((entry) => entry.label)).slice(0, 16);
  const texts = unique(textDetails.map((entry) => entry.textValue || entry.label.replace(/^texto: /, ""))).slice(0, 12);
  const materials = deriveMaterials(pixel, objectDetails, textDetails);
  const environment = deriveEnvironment(pixel, objectDetails, textDetails);
  const composition = deriveComposition(pixel, objectDetails, image);
  const realismRisks = deriveRealismRisks(pixel, objectDetails, textDetails);

  return {
    resolution: `${image.naturalWidth} x ${image.naturalHeight}`,
    aspect: image.naturalWidth / Math.max(image.naturalHeight, 1) > 1.42 ? "Panoramica" : image.naturalWidth >= image.naturalHeight ? "Horizontal" : "Vertical",
    lightMood: pixel.lightMood,
    sceneType: deriveSceneType(objectDetails, environment),
    cameraNotes: deriveCameraNotes(pixel, image),
    summary: buildAnalysisSummary({
      objects,
      texts,
      materials,
      environment,
      composition,
      realismRisks,
      lightMood: pixel.lightMood,
    }),
    objects,
    texts,
    materials,
    environment,
    composition,
    realismRisks,
    palette: pixel.palette,
    overlay: [...textDetails].slice(0, 18),
  };
}

function buildAnalysisFallback() {
  return {
    resolution: "No disponible",
    aspect: "Horizontal",
    lightMood: "Balanceada",
    sceneType: "escena arquitectonica",
    cameraNotes: "camara bloqueada",
    summary: "La escena queda lista para correccion manual y decisiones humanas, aunque la lectura automatica no haya sido completa.",
    objects: [],
    texts: [],
    materials: ["madera calida", "piedra natural", "concreto aparente"],
    environment: ["interior arquitectonico"],
    composition: ["camara bloqueada"],
    realismRisks: ["microdetalle pendiente"],
    palette: [],
    overlay: [],
  };
}

function mergeAnalyses(localAnalysis, remoteAnalysis) {
  if (!remoteAnalysis) return localAnalysis;
  return {
    resolution: localAnalysis.resolution,
    aspect: localAnalysis.aspect,
    lightMood: remoteAnalysis.lightMood || localAnalysis.lightMood,
    sceneType: remoteAnalysis.sceneType || localAnalysis.sceneType,
    cameraNotes: remoteAnalysis.cameraNotes || localAnalysis.cameraNotes,
    summary: remoteAnalysis.summary || localAnalysis.summary,
    objects: (remoteAnalysis.objects || []).length ? unique([...(remoteAnalysis.objects || [])]).slice(0, 18) : unique([...(localAnalysis.objects || [])]).slice(0, 18),
    texts: unique([...(remoteAnalysis.texts || []), ...(localAnalysis.texts || [])]).slice(0, 14),
    materials: (remoteAnalysis.materials || []).length ? unique([...(remoteAnalysis.materials || []), ...(localAnalysis.materials || []).slice(0, 4)]).slice(0, 12) : unique([...(localAnalysis.materials || [])]).slice(0, 12),
    environment: (remoteAnalysis.environment || []).length ? unique([...(remoteAnalysis.environment || []), ...(localAnalysis.environment || []).slice(0, 3)]).slice(0, 12) : unique([...(localAnalysis.environment || [])]).slice(0, 12),
    composition: (remoteAnalysis.composition || []).length ? unique([...(remoteAnalysis.composition || []), ...(localAnalysis.composition || []).slice(0, 3)]).slice(0, 10) : unique([...(localAnalysis.composition || [])]).slice(0, 10),
    realismRisks: (remoteAnalysis.realismRisks || []).length ? unique([...(remoteAnalysis.realismRisks || []), ...(localAnalysis.realismRisks || []).slice(0, 2)]).slice(0, 10) : unique([...(localAnalysis.realismRisks || [])]).slice(0, 10),
    palette: localAnalysis.palette,
    overlay: mergeOverlayEntries(localAnalysis.overlay, remoteAnalysis.overlay),
  };
}

function renderAnalysis() {
  const main = getMainImage();
  if (!main) {
    elements.analysisPreviewEmpty.classList.remove("hidden");
    elements.analysisPreview.classList.add("hidden");
    elements.analysisOverlay.classList.add("hidden");
    elements.analysisInteractionLayer.classList.add("hidden");
    elements.annotationDraft.classList.add("hidden");
    elements.analysisStatus.textContent = "Esperando referencia principal";
    elements.analysisSummary.textContent = "Cuando haya una referencia principal, aqui veras una lectura consolidada de escena, materiales, fondo, OCR y riesgos de realismo.";
    elements.analysisMeta.innerHTML = "";
    elements.analysisEditors.innerHTML = buildEmptyAnalysisEditors();
    syncAnnotationUi();
    updatePromptText();
    return;
  }

  elements.analysisPreviewEmpty.classList.add("hidden");
  elements.analysisPreview.classList.remove("hidden");
  elements.analysisPreview.src = main.url;

  if (!main.analysis) {
    elements.analysisStatus.textContent = state.analysisBusy ? `Analizando ${main.name}` : `Listo para analizar ${main.name}`;
    elements.analysisOverlay.classList.add("hidden");
    elements.analysisInteractionLayer.classList.add("hidden");
    elements.annotationDraft.classList.add("hidden");
    elements.analysisSummary.textContent = "La referencia principal ya esta definida. Ejecuta o espera la lectura para ver la descomposicion completa.";
    elements.analysisMeta.innerHTML = "";
    elements.analysisEditors.innerHTML = buildPendingAnalysisEditors();
    syncAnnotationUi();
    updatePromptText();
    return;
  }

  const analysis = main.analysis;
  elements.analysisStatus.textContent = state.analysisBusy ? `Actualizando ${main.name}` : `Lectura lista para ${main.name}`;
  elements.analysisOverlay.classList.toggle("hidden", !(analysis.overlay || []).length);
  elements.analysisOverlay.innerHTML = renderOverlay(analysis.overlay || []);
  elements.analysisInteractionLayer.classList.toggle("hidden", !state.annotation.mode);
  elements.analysisSummary.textContent = analysis.summary;
  elements.analysisMeta.innerHTML = buildAnalysisMeta(analysis);
  elements.analysisEditors.innerHTML = buildAnalysisEditors(analysis);
  syncAnnotationUi();
  updatePromptText();
}

function buildEmptyAnalysisEditors() {
  return ["Objetos", "Rotulos", "Materiales", "Entorno", "Composicion", "Riesgos"].map((label) => `
    <article class="analysis-card">
      <div class="mini-head"><span class="eyebrow">Pendiente</span><strong>${label}</strong></div>
      <div class="token-cloud"><span class="token-pill">Sin datos todavia</span></div>
    </article>
  `).join("");
}

function buildPendingAnalysisEditors() {
  return ["Objetos", "Rotulos", "Materiales", "Entorno", "Composicion", "Riesgos"].map((label) => `
    <article class="analysis-card">
      <div class="mini-head"><span class="eyebrow">Lectura</span><strong>${label}</strong></div>
      <div class="token-cloud"><span class="token-pill">Analizando...</span></div>
    </article>
  `).join("");
}

function buildAnalysisMeta(analysis) {
  const items = [
    { label: "Resolucion", value: analysis.resolution },
    { label: "Aspecto", value: analysis.aspect },
    { label: "Luz", value: analysis.lightMood },
    { label: "Escena", value: analysis.sceneType },
    { label: "Camara", value: analysis.cameraNotes },
    { label: "Marcaciones", value: String((analysis.overlay || []).filter((entry) => entry.manual).length) },
    { label: "Paleta", value: analysis.palette.length ? analysis.palette.map((entry) => entry.hex).join(" · ") : "Sin paleta" },
  ];
  return items.map((item) => `
    <article class="meta-card">
      <span>${escapeHtml(item.label)}</span>
      <strong>${escapeHtml(item.value || "-")}</strong>
    </article>
  `).join("");
}

function buildAnalysisEditors(analysis) {
  const cards = [
    { key: "objects", label: "Objetos", eyebrow: "Escena", type: "input", placeholder: "Agregar objeto o microobjeto" },
    { key: "texts", label: "Rotulos y texto", eyebrow: "OCR", type: "input", placeholder: "Corregir o agregar texto exacto" },
    { key: "materials", label: "Materiales", eyebrow: "PBR", type: "select" },
    { key: "environment", label: "Entorno", eyebrow: "Fondo", type: "select" },
    { key: "composition", label: "Composicion", eyebrow: "Camara", type: "select" },
    { key: "realismRisks", label: "Riesgos", eyebrow: "Control", type: "select" },
  ];

  return cards.map((card) => {
    const values = analysis[card.key] || [];
    const tokenMarkup = (values.length ? values : ["Sin datos"]).map((value) => `
      <span class="token-pill">
        ${escapeHtml(value)}
        <button type="button" aria-label="Eliminar" data-token-remove="${card.key}" data-token-value="${escapeHtml(value)}">×</button>
      </span>
    `).join("");

    const actionMarkup = card.type === "select"
      ? `
          <select class="token-select" data-analysis-select="${card.key}">
            <option value="">Agregar opcion</option>
            ${TOKEN_LIBRARIES[card.key].map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}
          </select>
          <button type="button" class="button button-secondary" data-analysis-add="${card.key}">Agregar</button>
        `
      : `
          <input class="token-input" data-analysis-input="${card.key}" type="text" placeholder="${card.placeholder}" />
          <button type="button" class="button button-secondary" data-analysis-add="${card.key}">Agregar</button>
        `;

    return `
      <article class="analysis-card">
        <div class="mini-head">
          <span class="eyebrow">${escapeHtml(card.eyebrow)}</span>
          <strong>${escapeHtml(card.label)}</strong>
        </div>
        <div class="token-cloud">${tokenMarkup}</div>
        <div class="token-editor-actions">${actionMarkup}</div>
      </article>
    `;
  }).join("");
}

function renderOverlay(entries) {
  return entries
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((entry) => {
      const textY = clamp(entry.y + 3, 3, 97);
      const rectClass = entry.manual ? "box manual" : "box";
      const textClass = entry.manual ? "box-label manual" : "box-label";
      return `
        <g>
          <rect class="${rectClass}" x="${clamp(entry.x, 0, 98)}" y="${clamp(entry.y, 0, 98)}" width="${clamp(entry.width, 1.2, 100)}" height="${clamp(entry.height, 1.2, 100)}" rx="1.4"></rect>
          <text class="${textClass}" x="${clamp(entry.x + 0.8, 0, 97)}" y="${textY}">${escapeHtml(entry.label)}</text>
        </g>
      `;
    }).join("");
}

function renderDecisions() {
  elements.contextBrief.value = state.settings.contextBrief || "";
  elements.changeRequest.value = state.settings.changeRequest || "";
  elements.step3Panel.classList.toggle("step3-market-mode", state.flow === "pdf");
  elements.step3Panel.classList.toggle("step3-structure-mode", state.flow === "pdf" && state.currentStep === 4);
  if (!state.flow) {
    elements.decisionGroups.innerHTML = "";
    elements.decisionGroups.classList.add("hidden");
    elements.pdfDeckBuilder.classList.add("hidden");
    elements.pdfDeckBuilder.innerHTML = "";
    return;
  }

  const groups = state.flow === "pdf"
    ? []
    : DECISION_GROUPS.render;

  elements.decisionGroups.classList.toggle("hidden", state.flow === "pdf");
  elements.decisionGroups.innerHTML = groups.map((group) => {
    const selectedOption = group.options.find((o) => o.value === state.settings[group.key]);
    return `
      <section class="decision-group">
        <div class="decision-group-head">
          <strong>${escapeHtml(group.label)}</strong>
          <p>${escapeHtml(group.description)}${selectedOption ? ` — <em>${escapeHtml(selectedOption.label)}</em>` : ""}</p>
        </div>
        <div class="choice-grid">
          ${group.options.map((option) => `
            <button type="button" class="choice-card ${state.settings[group.key] === option.value ? "active" : ""}" data-choice-key="${group.key}" data-choice-value="${option.value}">
              <strong>${escapeHtml(option.label)}</strong>
              <p>${escapeHtml(option.description)}</p>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }).join("");

  if (state.flow === "pdf") {
    elements.pdfDeckBuilder.classList.remove("hidden");
    elements.pdfDeckBuilder.innerHTML = renderPdfDeckBuilder();
  } else {
    elements.pdfDeckBuilder.classList.add("hidden");
    elements.pdfDeckBuilder.innerHTML = "";
  }
}

function handleContextChange(event) {
  state.settings.contextBrief = event.target.value;
  persistSettings();
  updatePromptText();
}

function handleChangeRequest(event) {
  state.settings.changeRequest = event.target.value;
  persistSettings();
  updatePromptText();
}

function renderPdfSectionStudio() {
  if (state.flow !== "pdf" || state.currentStep !== 5) {
    elements.pdfSectionStudio.innerHTML = "";
    return;
  }

  renderPdfSectionStudioEditor();
  return;

  ensurePdfBuilderDefaults();
  const analysis = getPdfDeckAnalysis();
  const blueprints = computePdfSlideBlueprints();
  const currentBlueprint = resolveCurrentPdfBlueprint(blueprints);
  if (!currentBlueprint) {
    elements.pdfSectionStudio.innerHTML = `<div class="empty-state compact-empty"><strong>Primero define las diapositivas del brochure</strong><span>En el paso 4 escoges cantidad, tipo, orden y amenidades.</span></div>`;
    return;
  }

  const currentConfig = state.settings.pdfSlideConfigs[currentBlueprint.key] || {};
  const selectedImages = safeArray(currentConfig.imageIds);
  const selectedMaterials = safeArray(currentConfig.materialHighlights);
  const selectedObjects = safeArray(currentConfig.objectHighlights);
  const selectedMoodSources = safeArray(currentConfig.moodSources);
  const slideText = getSlideTextDraft(currentBlueprint, analysis);
  const currentIndex = blueprints.findIndex((entry) => entry.key === currentBlueprint.key);
  const imageSourceMode = String(currentConfig.imageSourceMode || "inherit");
  const imageAspect = String(currentConfig.imageAspect || inferImageAspect(currentConfig.layout || currentBlueprint.layout));
  const imageSize = String(currentConfig.imageSize || inferImageSize(currentConfig.layout || currentBlueprint.layout));
  const imageZone = String(currentConfig.imageZone || inferImageZone(currentConfig.layout || currentBlueprint.layout, currentConfig.imagePlacement || inferImagePlacement(currentConfig.layout || currentBlueprint.layout)));
  const imagePlacement = String(currentConfig.imagePlacement || inferImagePlacement(currentConfig.layout || currentBlueprint.layout));
  const imageFraming = String(currentConfig.imageFraming || inferImageFraming(currentConfig.layout || currentBlueprint.layout));
  const imageArrangement = String(currentConfig.imageArrangement || inferImageArrangement(currentConfig.layout || currentBlueprint.layout));
  const imageRepresentation = String(currentConfig.imageRepresentation || "inherit");
  const imageFinish = String(currentConfig.imageFinish || "inherit");
  const imageOccupancy = String(currentConfig.imageOccupancy || "inherit");
  const isBoardSlide = isMoodBoardBlueprint(currentBlueprint, currentConfig);
  const moodBoardLayout = String(currentConfig.moodBoardLayout || inferMoodBoardLayout(currentBlueprint));
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  const activeTemplateEntry = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const templateThumb = activeTemplateEntry?.thumbnail || "";
  const slideLayoutOptions = getSlideLayoutVariantsForTemplate(activeTemplateEntry, currentBlueprint);
  const activeSlideLayout = (state.settings.pdfSlideLayouts && state.settings.pdfSlideLayouts[currentBlueprint.key]) || slideLayoutOptions[0]?.value;
  const perImagePrompts = (state.settings.pdfPerImagePrompts && state.settings.pdfPerImagePrompts[currentBlueprint.key]) || {};

  elements.pdfSectionStudio.innerHTML = `
    <article class="pdf-section-shell">
      <div class="mini-head">
        <span class="eyebrow">Paso 5 · Editor por diapositiva</span>
        <strong>Configura una pagina a la vez antes de generar el brochure final</strong>
      </div>

      <div class="section-tabbar">
        ${blueprints.map((blueprint, index) => `
          <button type="button" class="section-tab ${blueprint.key === currentBlueprint.key ? "active" : ""}" data-slide-nav="${blueprint.key}">
            <span class="section-tab-index">${index + 1}</span>
            <div class="section-tab-copy">
              <strong>${escapeHtml(blueprint.title)}</strong>
              <span>${escapeHtml(buildSectionConfigSummary(blueprint, state.settings.pdfSlideConfigs[blueprint.key] || {}))}</span>
            </div>
          </button>
        `).join("")}
      </div>

      <div class="slide-layout-picker" role="tablist" aria-label="Variantes de layout">
        ${slideLayoutOptions.map((option) => `
          <button type="button" class="slide-layout-chip ${activeSlideLayout === option.value ? "active" : ""}" data-slide-variant="${currentBlueprint.key}" data-slide-variant-value="${option.value}" title="${escapeHtml(option.label)}">
            <span class="slide-layout-thumb slide-layout-thumb-${option.value}" aria-hidden="true"></span>
            <span>${escapeHtml(option.label)}</span>
          </button>
        `).join("")}
      </div>

      <div class="pdf-section-grid">
        <section class="pdf-section-card section-preview-card">
          <div class="mini-head">
            <span class="eyebrow">${escapeHtml(currentBlueprint.sectionLabel)}</span>
            <strong>${escapeHtml(currentBlueprint.title)}</strong>
          </div>
          <p class="builder-note">${escapeHtml(currentBlueprint.subtitle)}</p>

          <div class="slide-template-canvas" ${templateThumb ? `style="--slide-template-thumb:url('${templateThumb}')"` : ""} data-slide-layout-variant="${activeSlideLayout || ""}">
            <div class="slide-template-canvas-overlay">
              <span class="slide-template-canvas-tag">Preview sin render · ${escapeHtml(activeTemplateEntry?.label || "Template")}</span>
              <div class="slide-template-canvas-blocks">
                <strong>${escapeHtml(currentConfig.customTitle || slideText.title || currentBlueprint.title)}</strong>
                <span>${escapeHtml(currentConfig.customSubtitle || slideText.subtitle || currentBlueprint.subtitle)}</span>
              </div>
            </div>
          </div>

          ${buildSlideLivePreview(currentBlueprint, currentConfig, slideText, isBoardSlide)}

          <div class="choice-inline wrap">
            <span class="status-chip status-soft">${escapeHtml(styleProfile.label || optionLabel(BROCHURE_STYLE_OPTIONS, state.settings.brochureStyle))}</span>
            <span class="status-chip status-soft">${escapeHtml(optionLabel(SLIDE_LAYOUT_OPTIONS, currentConfig.layout || currentBlueprint.layout))}</span>
            <span class="status-chip status-soft">${escapeHtml(optionLabel(SLIDE_IMAGE_ASPECT_OPTIONS, imageAspect))}</span>
            <span class="status-chip status-soft">${escapeHtml(optionLabel(SLIDE_IMAGE_SIZE_OPTIONS, imageSize))}</span>
            <span class="status-chip status-soft">${escapeHtml(optionLabel(SLIDE_IMAGE_SOURCE_OPTIONS, imageSourceMode))}</span>
            ${isBoardSlide ? `<span class="status-chip status-soft">${escapeHtml(optionLabel(MOOD_BOARD_LAYOUT_OPTIONS, moodBoardLayout))}</span>` : ""}
          </div>

          ${renderSlideQuickEditor(currentBlueprint, {
            imageSourceMode,
            imagePlacement,
            imageSize,
            imageAspect,
            imageArrangement,
            imageFraming,
            renderTreatment: currentConfig.renderTreatment || "master",
            slideBackground: currentConfig.slideBackground || "inherit",
            imageRepresentation,
            imageFinish,
          })}

          <div class="style-summary-card" style="--style-paper:${styleProfile.paper};--style-ink:${styleProfile.ink};--style-accent:${styleProfile.accent};">
            <strong>${escapeHtml(styleProfile.label)}</strong>
            <span>${escapeHtml(styleProfile.description)}</span>
          </div>

          <details class="advanced-slide-settings">
            <summary>
              <span>Ajustes finos</span>
              <small>Layout, proporciones, fondo, render y composicion completa</small>
            </summary>
          <div class="decision-group">
            <div class="decision-group-head">
              <strong>Diseno de la diapositiva</strong>
              <p>Define estructura general, sector y proporcion de la imagen antes de generar el brochure.</p>
            </div>
            <div class="choice-grid slide-layout-grid">
              ${SLIDE_LAYOUT_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${String(currentConfig.layout || currentBlueprint.layout) === option.value ? "active" : ""}" data-slide-layout="${currentBlueprint.key}" data-slide-layout-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_SOURCE_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageSourceMode === option.value ? "active" : ""}" data-slide-image-source="${currentBlueprint.key}" data-slide-image-source-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_PLACEMENT_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imagePlacement === option.value ? "active" : ""}" data-slide-image-placement="${currentBlueprint.key}" data-slide-image-placement-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_ASPECT_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageAspect === option.value ? "active" : ""}" data-slide-image-aspect="${currentBlueprint.key}" data-slide-image-aspect-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_SIZE_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageSize === option.value ? "active" : ""}" data-slide-image-size="${currentBlueprint.key}" data-slide-image-size-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_ZONE_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageZone === option.value ? "active" : ""}" data-slide-image-zone="${currentBlueprint.key}" data-slide-image-zone-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_FRAMING_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageFraming === option.value ? "active" : ""}" data-slide-image-framing="${currentBlueprint.key}" data-slide-image-framing-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              ${SLIDE_IMAGE_ARRANGEMENT_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageArrangement === option.value ? "active" : ""}" data-slide-image-arrangement="${currentBlueprint.key}" data-slide-image-arrangement-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
                `).join("")}
            </div>
            ${isBoardSlide ? `
              <div class="decision-group mood-layout-block">
                <div class="decision-group-head">
                  <strong>Tipo de mood board</strong>
                  <p>Escoge la referencia conceptual que debe seguir la IA con los materiales y objetos seleccionados.</p>
                </div>
                <div class="choice-grid mood-layout-grid">
                  ${MOOD_BOARD_LAYOUT_OPTIONS.map((option) => `
                    <button type="button" class="choice-card mood-layout-card ${moodBoardLayout === option.value ? "active" : ""}" data-slide-mood-layout="${currentBlueprint.key}" data-slide-mood-layout-value="${option.value}">
                      <span class="mood-layout-preview mood-layout-${option.value}" aria-hidden="true"></span>
                      <strong>${escapeHtml(option.label)}</strong>
                      <p>${escapeHtml(option.description)}</p>
                    </button>
                  `).join("")}
                </div>
              </div>
            ` : ""}
            <div class="choice-grid">
              ${SLIDE_RENDER_TREATMENT_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${String(currentConfig.renderTreatment || "master") === option.value ? "active" : ""}" data-slide-render-treatment="${currentBlueprint.key}" data-slide-render-treatment-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="decision-group">
              <div class="decision-group-head">
                <strong>Fondo de la diapositiva</strong>
                <p>Escoge un degradado o ambiente de fondo diferente al estilo global.</p>
              </div>
              <div class="choice-grid">
                ${SLIDE_BACKGROUND_OPTIONS.map((option) => `
                  <button type="button" class="choice-card ${String(currentConfig.slideBackground || "inherit") === option.value ? "active" : ""}" data-slide-background="${currentBlueprint.key}" data-slide-background-value="${option.value}">
                    <strong>${escapeHtml(option.label)}</strong>
                    <p>${escapeHtml(option.description)}</p>
                  </button>
                `).join("")}
              </div>
            </div>
          </div>
          </details>
        </section>

        <section class="pdf-section-card">
          <div class="mini-head">
            <span class="eyebrow">Imagen por seccion</span>
            <strong>Decide si se usa cruda, renderizada y como debe verse</strong>
          </div>
          <label class="toggle-card">
            <input type="checkbox" data-slide-use-project="${currentBlueprint.key}" ${Boolean(currentConfig.useProjectImages) ? "checked" : ""} ${currentBlueprint.allowProjectImages ? "" : "disabled"} />
            <span>${currentBlueprint.allowProjectImages ? "Incluir imagenes del proyecto en esta pagina" : "Esta seccion se arma con boards, materiales y recursos derivados"}</span>
          </label>

          <div class="decision-group">
            <div class="decision-group-head">
              <strong>Estilo de render para esta pagina</strong>
              <p>Aqui eliges como se debe leer esa imagen dentro del brochure, sin regenerar el deck completo cada vez.</p>
            </div>
            <div class="choice-grid">
              <button type="button" class="choice-card ${imageRepresentation === "inherit" ? "active" : ""}" data-slide-image-representation="${currentBlueprint.key}" data-slide-image-representation-value="inherit">
                <strong>Segun render global</strong>
                <p>Usa el mismo lenguaje visual elegido en el flujo general.</p>
              </button>
              ${SLIDE_IMAGE_REPRESENTATION_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageRepresentation === option.value ? "active" : ""}" data-slide-image-representation="${currentBlueprint.key}" data-slide-image-representation-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              <button type="button" class="choice-card ${imageFinish === "inherit" ? "active" : ""}" data-slide-image-finish="${currentBlueprint.key}" data-slide-image-finish-value="inherit">
                <strong>Acabado global</strong>
                <p>Respeta el acabado principal del proyecto.</p>
              </button>
              ${SLIDE_IMAGE_FINISH_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageFinish === option.value ? "active" : ""}" data-slide-image-finish="${currentBlueprint.key}" data-slide-image-finish-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
            <div class="choice-grid">
              <button type="button" class="choice-card ${imageOccupancy === "inherit" ? "active" : ""}" data-slide-image-occupancy="${currentBlueprint.key}" data-slide-image-occupancy-value="inherit">
                <strong>Personas global</strong>
                <p>Hereda la regla de ocupacion humana del render principal.</p>
              </button>
              ${SLIDE_IMAGE_OCCUPANCY_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${imageOccupancy === option.value ? "active" : ""}" data-slide-image-occupancy="${currentBlueprint.key}" data-slide-image-occupancy-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
          </div>

          <div class="field">
            <span>Imagenes asignadas ${selectedImages.length ? `· ${selectedImages.length}` : ""}</span>
            <div class="slide-image-grid ${currentConfig.useProjectImages ? "" : "is-disabled"}">
              ${state.images.length ? state.images.map((image) => `
                <button type="button" class="slide-image-card ${selectedImages.includes(image.id) ? "active" : ""}" data-slide-image-toggle="${currentBlueprint.key}" data-slide-image-id="${image.id}" ${currentConfig.useProjectImages ? "" : "disabled"}>
                  <img src="${image.url}" alt="${escapeHtml(image.name)}" loading="lazy" />
                  <div class="slide-image-copy">
                    <strong>${escapeHtml(image.name)}</strong>
                    <span>${image.id === state.mainId ? "Principal" : "Apoyo"}</span>
                  </div>
                </button>
              `).join("") : `<div class="empty-state compact-empty"><strong>Sin fotos cargadas</strong><span>Sube referencias en el paso 1.</span></div>`}
            </div>
          </div>

          ${currentConfig.useProjectImages && state.images.length ? `
            <div class="choice-inline wrap">
              <button type="button" class="button button-ghost" data-slide-select-all="${currentBlueprint.key}">Seleccionar todas las fotos</button>
            </div>
          ` : ""}

          ${currentConfig.useProjectImages && selectedImages.length ? `
            <div class="per-image-stylers">
              <div class="mini-head compact">
                <span class="eyebrow">Estilo por foto</span>
                <strong>Dale a cada imagen su propia dirección creativa</strong>
              </div>
              ${selectedImages.map((imageId) => {
                const image = state.images.find((img) => img.id === imageId);
                if (!image) return "";
                const perPrompt = perImagePrompts[imageId] || {};
                return `
                  <div class="per-image-card">
                    <img src="${image.url}" alt="${escapeHtml(image.name)}" loading="lazy" />
                    <div class="per-image-copy">
                      <strong>${escapeHtml(image.name)}</strong>
                      <div class="choice-inline wrap per-image-chips">
                        ${["minimal-bw","warm-editorial","high-contrast","soft-film","vibrant"].map((chipVal) => `
                          <button type="button" class="select-chip ${perPrompt.style === chipVal ? "active" : ""}" data-per-image-style="${currentBlueprint.key}" data-per-image-id="${imageId}" data-per-image-style-value="${chipVal}">${chipVal.replace("-", " ")}</button>
                        `).join("")}
                      </div>
                      <textarea class="per-image-prompt" placeholder="Prompt específico para esta foto (ej: 'blanco y negro minimalista')" data-per-image-prompt="${currentBlueprint.key}" data-per-image-id="${imageId}">${escapeHtml(perPrompt.prompt || "")}</textarea>
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : ""}
        </section>

        <section class="pdf-section-card">
          <div class="mini-head">
            <span class="eyebrow">Curaduria y copy</span>
            <strong>Controla exactamente que sale en esta pagina</strong>
          </div>

          <div class="field">
            <span>Modo de texto</span>
            <div class="choice-grid">
              ${SLIDE_TEXT_MODE_OPTIONS.map((option) => `
                <button type="button" class="choice-card ${String(currentConfig.textMode || "suggested") === option.value ? "active" : ""}" data-slide-text-mode="${currentBlueprint.key}" data-slide-text-mode-value="${option.value}">
                  <strong>${escapeHtml(option.label)}</strong>
                  <p>${escapeHtml(option.description)}</p>
                </button>
              `).join("")}
            </div>
          </div>

          ${isBoardSlide ? `
            <div class="field">
              <span>Materiales a destacar</span>
              <div class="curation-chip-grid">
                ${safeArray(analysis.materials).map((material) => `
                  <button type="button" class="amenity-chip ${selectedMaterials.includes(material) ? "active" : ""}" data-slide-material-toggle="${currentBlueprint.key}" data-slide-material-value="${escapeHtml(material)}">
                    ${escapeHtml(material)}
                  </button>
                `).join("") || `<span class="builder-note">No hay materiales leidos aun.</span>`}
              </div>
            </div>
            <div class="field">
              <span>Objetos a destacar</span>
              <div class="curation-chip-grid">
                ${safeArray(analysis.objects).map((object) => `
                  <button type="button" class="amenity-chip ${selectedObjects.includes(object) ? "active" : ""}" data-slide-object-toggle="${currentBlueprint.key}" data-slide-object-value="${escapeHtml(object)}">
                    ${escapeHtml(object)}
                  </button>
                `).join("") || `<span class="builder-note">No hay objetos leidos aun.</span>`}
              </div>
            </div>
          ` : ""}

          <div class="field">
            <span>Fuentes visuales del board</span>
            <div class="choice-inline wrap">
              ${PDF_MOODBOARD_SOURCES.map((source) => `
                <button type="button" class="select-chip ${selectedMoodSources.includes(source.value) ? "active" : ""}" data-slide-mood-source="${currentBlueprint.key}" data-slide-mood-value="${source.value}">
                  ${escapeHtml(source.label)}
                </button>
              `).join("")}
            </div>
          </div>

          <div class="field">
            <span>Titulo editable</span>
            <input type="text" value="${escapeHtml(currentConfig.customTitle || slideText.title)}" data-slide-text-key="${currentBlueprint.key}" data-slide-text-field="customTitle" />
          </div>
          <div class="field">
            <span>Subtitulo o bajada</span>
            <textarea data-slide-text-key="${currentBlueprint.key}" data-slide-text-field="customSubtitle">${escapeHtml(currentConfig.customSubtitle || slideText.subtitle)}</textarea>
          </div>
          <div class="field">
            <span>Bullets o texto de apoyo</span>
            <textarea class="slide-bullets-area" data-slide-text-key="${currentBlueprint.key}" data-slide-text-field="customBullets">${escapeHtml(currentConfig.customBullets || slideText.bullets.join("\n"))}</textarea>
          </div>

          <div class="slide-studio-footer">
            <div class="choice-inline wrap">
              <button type="button" class="button button-ghost" data-slide-reset-copy="${currentBlueprint.key}">Restaurar sugerencia</button>
              <button type="button" class="button button-ghost" data-slide-nav-shift="-1" ${currentIndex === 0 ? "disabled" : ""}>‹ Anterior</button>
              <button type="button" class="button button-ghost" data-slide-nav-shift="1" ${currentIndex >= blueprints.length - 1 ? "disabled" : ""}>Siguiente ›</button>
            </div>
            <span class="status-chip status-soft">${escapeHtml(buildSectionConfigSummary(currentBlueprint, currentConfig))}</span>
          </div>
        </section>
      </div>
    </article>
  `;
}

function renderPdfSectionStudioEditor() {
  ensurePdfBuilderDefaults();
  const analysis = getPdfDeckAnalysis();
  const blueprints = computePdfSlideBlueprints();
  const currentBlueprint = resolveCurrentPdfBlueprint(blueprints);
  if (!currentBlueprint) {
    elements.pdfSectionStudio.innerHTML = `<div class="empty-state compact-empty"><strong>Primero define las diapositivas del brochure</strong><span>En el paso 4 escoges cantidad, tipo, orden y amenidades.</span></div>`;
    return;
  }

  const currentConfig = state.settings.pdfSlideConfigs[currentBlueprint.key] || {};
  hydrateSlideConfigDefaults(currentBlueprint, currentConfig);
  const slideText = getSlideTextDraft(currentBlueprint, analysis);
  const currentIndex = blueprints.findIndex((entry) => entry.key === currentBlueprint.key);
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  const activeTemplateEntry = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const slideLayoutOptions = getSlideLayoutVariantsForTemplate(activeTemplateEntry, currentBlueprint);
  const activeSlideLayout = (state.settings.pdfSlideLayouts && state.settings.pdfSlideLayouts[currentBlueprint.key]) || slideLayoutOptions[0]?.value || currentConfig.layout || currentBlueprint.layout;
  const selectedImages = safeArray(currentConfig.imageIds);
  const imageCount = resolveSlideImageCount(currentConfig);
  const activeImageId = resolveSlideActiveImageId(currentConfig);
  const activeImage = state.images.find((image) => image.id === activeImageId) || null;
  const palette = resolveEditorPalette(analysis);
  const selectedMaterials = safeArray(currentConfig.materialHighlights);
  const selectedObjects = safeArray(currentConfig.objectHighlights);
  const isBoardSlide = isMoodBoardBlueprint(currentBlueprint, currentConfig);

  elements.pdfSectionStudio.innerHTML = `
    <article class="pdf-section-shell slide-studio-v2">
      <div class="slide-studio-head">
        <div>
          <span class="eyebrow">Paso 5 · Canva + imagenes</span>
          <strong>Editor visual del brochure</strong>
        </div>
        <div class="choice-inline wrap">
          <button type="button" class="button button-ghost" data-slide-nav-shift="-1" ${currentIndex === 0 ? "disabled" : ""}>Anterior</button>
          <span class="status-chip status-soft">${currentIndex + 1}/${blueprints.length}</span>
          <button type="button" class="button button-ghost" data-slide-nav-shift="1" ${currentIndex >= blueprints.length - 1 ? "disabled" : ""}>Siguiente</button>
        </div>
      </div>

      ${renderSlideFilmstrip(blueprints, currentBlueprint)}

      <section class="slide-studio-stage">
        <div class="slide-studio-main">
          <div class="mini-head compact">
            <span class="eyebrow">${escapeHtml(currentBlueprint.sectionLabel)}</span>
            <strong>${escapeHtml(currentBlueprint.title)}</strong>
          </div>
          ${renderSlideLayoutStrip(slideLayoutOptions, activeSlideLayout, currentBlueprint.key)}
          ${buildEditableSlideCanvas(currentBlueprint, currentConfig, slideText, activeSlideLayout, styleProfile, palette)}
        </div>
        ${renderSlidePaletteEditor(palette)}
      </section>

      <section class="slide-studio-split slide-image-workbench">
        <div class="slide-studio-panel">
          <div class="mini-head compact">
            <span class="eyebrow">Imagenes</span>
            <strong>Escoge cuantas fotos usa esta pagina</strong>
          </div>
          <label class="toggle-card compact-toggle">
            <input type="checkbox" data-slide-use-project="${currentBlueprint.key}" ${Boolean(currentConfig.useProjectImages) ? "checked" : ""} ${currentBlueprint.allowProjectImages ? "" : "disabled"} />
            <span>${currentBlueprint.allowProjectImages ? "Usar fotos del proyecto en esta diapositiva" : "Esta diapositiva usa recursos derivados / mood board"}</span>
          </label>
          ${renderSlideImageCountControls(currentBlueprint.key, imageCount)}
          ${renderSlidePhotoSelector(currentBlueprint, currentConfig, activeImageId)}
          ${isBoardSlide ? renderBoardCurationPanel(analysis, currentBlueprint, selectedMaterials, selectedObjects) : ""}
        </div>

        <div class="slide-studio-panel">
          <div class="mini-head compact">
            <span class="eyebrow">Editor de foto</span>
            <strong>${activeImage ? escapeHtml(activeImage.name) : "Selecciona una foto"}</strong>
          </div>
          ${renderActivePhotoInspector(currentBlueprint, currentConfig, activeImage, activeImageId)}
        </div>
      </section>

      <div class="slide-studio-footer">
        <span class="status-chip status-soft">${escapeHtml(buildSectionConfigSummary(currentBlueprint, currentConfig))}</span>
        <div class="choice-inline wrap">
          <button type="button" class="button button-ghost" data-slide-reset-copy="${currentBlueprint.key}">Restaurar texto sugerido</button>
          <button type="button" class="button button-primary" data-generate-result>Generar brochure</button>
        </div>
      </div>
    </article>
  `;
}

function hydrateSlideConfigDefaults(blueprint, config) {
  if (!config.layout) config.layout = blueprint.layout;
  if (!config.imagePlacement) config.imagePlacement = inferImagePlacement(config.layout || blueprint.layout);
  if (!config.imageAspect) config.imageAspect = inferImageAspect(config.layout || blueprint.layout);
  if (!config.imageSourceMode) config.imageSourceMode = "inherit";
  if (!config.imageSize) config.imageSize = inferImageSize(config.layout || blueprint.layout);
  if (!config.imageZone) config.imageZone = inferImageZone(config.layout || blueprint.layout, config.imagePlacement);
  if (!config.imageFraming) config.imageFraming = inferImageFraming(config.layout || blueprint.layout);
  if (!config.imageArrangement) config.imageArrangement = inferImageArrangement(config.layout || blueprint.layout);
  if (!config.renderTreatment) config.renderTreatment = "master";
  if (!config.imageRepresentation) config.imageRepresentation = "inherit";
  if (!config.imageFinish) config.imageFinish = "inherit";
  if (!config.imageOccupancy) config.imageOccupancy = "inherit";
  if (!config.slideBackground) config.slideBackground = "inherit";
  if (!config.moodBoardLayout) config.moodBoardLayout = inferMoodBoardLayout(blueprint);
  if (!Array.isArray(config.imageIds)) config.imageIds = [];
  if (!config.imageCount) config.imageCount = String(Math.max(1, config.imageIds.length || 1));
  if (!config.activeImageId || !state.images.some((image) => image.id === config.activeImageId)) {
    config.activeImageId = config.imageIds.find((id) => state.images.some((image) => image.id === id)) || config.imageIds[0] || state.mainId || state.images[0]?.id || "";
  }
}

function renderSlideFilmstrip(blueprints, currentBlueprint) {
  return `
    <nav class="canva-slide-nav studio-filmstrip" aria-label="Diapositivas del brochure">
      ${blueprints.map((blueprint, index) => {
        const config = state.settings.pdfSlideConfigs[blueprint.key] || {};
        const previewImage = resolveSlidePreviewImages(config)[0];
        const layoutVariant = (state.settings.pdfSlideLayouts && state.settings.pdfSlideLayouts[blueprint.key]) || config.layout || blueprint.layout;
        return `
          <button type="button" class="canva-slide-nav-chip ${blueprint.key === currentBlueprint.key ? "active" : ""}" data-slide-nav="${blueprint.key}">
            <span>${index + 1} · ${escapeHtml(blueprint.sectionLabel)}</span>
            <span class="canva-slide-nav-thumb canva-slide-nav-thumb-${escapeHtml(layoutVariant)}" ${previewImage?.url ? `style="--thumb-url:url('${escapeHtml(previewImage.url)}')"` : ""}></span>
            <strong>${escapeHtml(blueprint.title)}</strong>
          </button>
        `;
      }).join("")}
    </nav>
  `;
}

function renderSlideLayoutStrip(layoutOptions, activeLayout, slideKey) {
  return `
    <div class="slide-layout-picker studio-layout-strip" role="tablist" aria-label="Layouts disponibles para esta diapositiva">
      ${safeArray(layoutOptions).map((option) => `
        <button type="button" class="slide-layout-chip ${String(activeLayout) === option.value ? "active" : ""}" data-slide-variant="${slideKey}" data-slide-variant-value="${option.value}" title="${escapeHtml(option.label)}">
          <span class="slide-layout-thumb slide-layout-thumb-${option.value}" aria-hidden="true"></span>
          <span>${escapeHtml(option.label)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function buildEditableSlideCanvas(blueprint, config, slideText, activeLayout, styleProfile, palette) {
  const title = sanitizeVisibleDeckText(config.customTitle || slideText.title || blueprint.title, blueprint.title);
  const subtitle = sanitizeVisibleDeckText(config.customSubtitle || slideText.subtitle || blueprint.subtitle, blueprint.subtitle || "");
  const bullets = normalizeDeckBullets((config.customBullets || "").split("\n")).length
    ? normalizeDeckBullets((config.customBullets || "").split("\n"))
    : normalizeDeckBullets(slideText.bullets);
  const images = resolveSlidePreviewImages(config).slice(0, resolveSlideImageCount(config));
  const background = String(config.slideBackground || "inherit");
  const sourceMode = resolveSlideImageSourceMode(config);
  const treatment = optionLabel(SLIDE_RENDER_TREATMENT_OPTIONS, config.renderTreatment || "master");
  const paletteColors = safeArray(palette).slice(0, 5);
  const paper = paletteColors[2] || styleProfile.paper || "#f6efe5";
  const ink = styleProfile.ink || "#211812";
  const accent = paletteColors[0] || styleProfile.accent || "#8b6547";
  const accent2 = paletteColors[1] || colorMixHex(accent, "#ffffff", 0.38);
  const mediaStyle = buildEditorMediaStyle(config, activeLayout);
  const textStyle = buildEditorTextStyle(config, activeLayout);
  const canvasStyle = [
    `--slide-edit-paper:${paper}`,
    `--slide-edit-ink:${ink}`,
    `--slide-edit-accent:${accent}`,
    `--slide-edit-accent-2:${accent2}`,
  ].join(";");
  const imageSlots = images.length ? images : [{ id: "empty", name: "Sin foto seleccionada", url: "" }];

  return `
    <div class="slide-edit-canvas studio-live-canvas live-bg-${background}" data-layout-variant="${escapeHtml(activeLayout)}" style="${canvasStyle}">
      <div class="slide-edit-canvas-media" data-count="${Math.min(Math.max(imageSlots.length, 1), 6)}" data-arrangement="${escapeHtml(config.imageArrangement || "single")}" data-framing="${escapeHtml(config.imageFraming || "clean")}" style="${mediaStyle}">
        ${imageSlots.map((image) => image.url
          ? `<img src="${image.url}" alt="${escapeHtml(image.name)}" loading="lazy" />`
          : `<span class="slide-edit-media-empty">Selecciona una imagen del proyecto</span>`).join("")}
      </div>
      <div class="slide-edit-canvas-overlay" style="${textStyle}">
        <small contenteditable="false">${escapeHtml(blueprint.sectionLabel)}</small>
        <strong class="ce-title" contenteditable="true" spellcheck="true" data-slide-inline-text-key="${blueprint.key}" data-slide-inline-text-field="customTitle">${escapeHtml(title)}</strong>
        <em class="ce-subtitle" contenteditable="true" spellcheck="true" data-slide-inline-text-key="${blueprint.key}" data-slide-inline-text-field="customSubtitle">${escapeHtml(subtitle)}</em>
        <div class="ce-bullets" contenteditable="true" spellcheck="true" data-slide-inline-text-key="${blueprint.key}" data-slide-inline-text-field="customBullets">${bullets.slice(0, 4).map((bullet) => escapeHtml(bullet)).join("<br>")}</div>
      </div>
      <span class="slide-edit-canvas-badge">${sourceMode === "raw" ? "foto cruda" : "render"} · ${escapeHtml(treatment)}</span>
    </div>
  `;
}

function buildEditorMediaStyle(config, activeLayout) {
  const placement = String(config.imagePlacement || inferImagePlacement(config.layout || activeLayout));
  const size = String(config.imageSize || "large");
  const full = placement === "full" || size === "full-page" || activeLayout === "cover";
  if (full) return "inset:0;";
  const width = size === "small" ? 32 : size === "medium" ? 44 : size === "giant" ? 78 : 58;
  const height = size === "small" ? 42 : size === "medium" ? 58 : size === "giant" ? 74 : 66;
  const left = placement === "left" ? 4 : placement === "center" ? (100 - width) / 2 : placement === "top" || placement === "bottom" ? 8 : 38;
  const top = placement === "top" ? 6 : placement === "bottom" ? 48 : 15;
  return `right:auto;bottom:auto;left:${left}%;top:${top}%;width:${placement === "top" || placement === "bottom" ? 84 : width}%;height:${placement === "top" || placement === "bottom" ? 38 : height}%;`;
}

function buildEditorTextStyle(config, activeLayout) {
  const placement = String(config.imagePlacement || inferImagePlacement(config.layout || activeLayout));
  if (placement === "left") return "left:auto;right:5%;top:14%;bottom:auto;width:34%;align-content:start;background:linear-gradient(90deg, rgba(255,255,255,0.82), rgba(255,255,255,0.54));color:var(--slide-edit-ink);";
  if (placement === "right") return "left:5%;top:14%;bottom:auto;width:34%;align-content:start;background:linear-gradient(90deg, rgba(255,255,255,0.82), rgba(255,255,255,0.54));color:var(--slide-edit-ink);";
  if (placement === "top") return "top:auto;bottom:0;width:56%;background:linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.62));";
  return "";
}

function resolveEditorPalette(analysis) {
  const selected = safeArray(state.settings.selectedPalette).filter(Boolean);
  if (selected.length) return selected;
  return getSuggestedPalette(analysis).slice(0, 6);
}

function renderSlidePaletteEditor(palette) {
  const suggested = getSuggestedPalette(getPdfDeckAnalysis()).slice(0, 6);
  const selected = resolveEditorPalette(getPdfDeckAnalysis()).slice(0, 6);
  return `
    <aside class="slide-studio-palette">
      <div class="mini-head compact">
        <span class="eyebrow">Color en vivo</span>
        <strong>Prueba la paleta sobre esta presentacion</strong>
      </div>
      <div class="palette-toolbar compact-palette-toolbar">
        <button type="button" class="button ${state.settings.colorMode === "suggested" ? "button-primary" : "button-secondary"}" data-color-mode="suggested">Sugerida</button>
        <button type="button" class="button ${state.settings.colorMode === "manual" ? "button-primary" : "button-secondary"}" data-color-mode="manual">Manual</button>
      </div>
      <div class="slide-palette-strip">
        <span class="palette-strip-label">Sugeridos</span>
        ${suggested.map((color) => `
          <button type="button" class="slide-palette-chip ${selected.includes(color) ? "active" : ""}" data-palette-color="${color}">
            <span class="slide-palette-swatches"><span style="background:${color}"></span></span>
            <strong>${escapeHtml(color.toUpperCase())}</strong>
          </button>
        `).join("")}
      </div>
      <div class="custom-color-grid">
        ${[0, 1, 2, 3].map((index) => {
          const color = selected[index] || palette[index] || suggested[index] || "#d7c2a5";
          return `
            <label class="custom-color-card">
              <span>${["Primario", "Secundario", "Fondo", "Acento"][index]}</span>
              <input type="color" value="${escapeHtml(color)}" data-palette-custom="${index}" />
              <strong>${escapeHtml(color.toUpperCase())}</strong>
            </label>
          `;
        }).join("")}
      </div>
    </aside>
  `;
}

function resolveSlideImageCount(config) {
  const count = Number(config.imageCount || safeArray(config.imageIds).length || 1);
  return clamp(Number.isFinite(count) ? count : 1, 1, 6);
}

function resolveSlideActiveImageId(config) {
  const ids = safeArray(config.imageIds);
  if (config.activeImageId && state.images.some((image) => image.id === config.activeImageId)) return config.activeImageId;
  return ids.find((id) => state.images.some((image) => image.id === id)) || state.mainId || state.images[0]?.id || "";
}

function renderSlideImageCountControls(slideKey, imageCount) {
  return `
    <div class="slide-image-count-row">
      <span class="field-label">Cantidad</span>
      ${[1, 2, 3, 4, 5, 6].map((count) => `
        <button type="button" class="quick-editor-chip ${Number(imageCount) === count ? "active" : ""}" data-slide-image-count="${slideKey}" data-slide-image-count-value="${count}">${count}</button>
      `).join("")}
    </div>
  `;
}

function renderSlidePhotoSelector(blueprint, config, activeImageId) {
  const selected = safeArray(config.imageIds);
  if (!state.images.length) {
    return `<div class="empty-state compact-empty"><strong>Sin fotos cargadas</strong><span>Sube imagenes en el paso 1 para escogerlas aqui.</span></div>`;
  }
  return `
    <div class="slide-image-grid studio-photo-grid ${config.useProjectImages ? "" : "is-disabled"}">
      ${state.images.map((image) => `
        <button type="button" class="slide-image-card ${selected.includes(image.id) ? "active" : ""} ${activeImageId === image.id ? "is-current" : ""}" data-slide-active-image="${blueprint.key}" data-slide-image-id="${image.id}" ${config.useProjectImages ? "" : "disabled"}>
          <img src="${image.url}" alt="${escapeHtml(image.name)}" loading="lazy" />
          <div class="slide-image-copy">
            <strong>${escapeHtml(image.name)}</strong>
            <span>${image.id === state.mainId ? "Principal" : "Referencia"}</span>
          </div>
        </button>
      `).join("")}
    </div>
  `;
}

function renderActivePhotoInspector(blueprint, config, activeImage, activeImageId) {
  const key = blueprint.key;
  const perImagePrompts = (state.settings.pdfPerImagePrompts && state.settings.pdfPerImagePrompts[key]) || {};
  const perPrompt = perImagePrompts[activeImageId] || {};
  const selected = safeArray(config.imageIds);
  return `
    <div class="active-image-preview">
      <div class="active-image-frame">
        ${activeImage ? `<img src="${activeImage.url}" alt="${escapeHtml(activeImage.name)}" loading="lazy" />` : `<span class="empty-active-image">Selecciona una imagen para editarla</span>`}
      </div>
      ${activeImage ? `
        <div class="choice-inline wrap">
          <button type="button" class="button button-ghost" data-slide-image-toggle="${key}" data-slide-image-id="${activeImage.id}">${selected.includes(activeImage.id) ? "Quitar de esta slide" : "Usar en esta slide"}</button>
          <span class="status-chip status-soft">${activeImage.id === state.mainId ? "Imagen principal" : "Foto de apoyo"}</span>
        </div>
      ` : ""}
    </div>
    ${renderSlideQuickEditor(blueprint, {
      imageSourceMode: config.imageSourceMode || "inherit",
      imagePlacement: config.imagePlacement || inferImagePlacement(config.layout || blueprint.layout),
      imageSize: config.imageSize || inferImageSize(config.layout || blueprint.layout),
      imageAspect: config.imageAspect || inferImageAspect(config.layout || blueprint.layout),
      imageArrangement: config.imageArrangement || inferImageArrangement(config.layout || blueprint.layout),
      imageFraming: config.imageFraming || inferImageFraming(config.layout || blueprint.layout),
      renderTreatment: config.renderTreatment || "master",
      slideBackground: config.slideBackground || "inherit",
      imageRepresentation: config.imageRepresentation || "inherit",
      imageFinish: config.imageFinish || "inherit",
    })}
    <div class="decision-group compact-decision">
      <div class="decision-group-head">
        <strong>Tratamiento creativo de esta foto</strong>
        <p>Se aplica solo si esta imagen se renderiza para esta diapositiva.</p>
      </div>
      <div class="choice-inline wrap per-image-chips">
        ${["minimal-bw","warm-editorial","high-contrast","soft-film","vibrant"].map((chipVal) => `
          <button type="button" class="select-chip ${perPrompt.style === chipVal ? "active" : ""}" data-per-image-style="${key}" data-per-image-id="${activeImageId}" data-per-image-style-value="${chipVal}" ${activeImage ? "" : "disabled"}>${chipVal.replace("-", " ")}</button>
        `).join("")}
      </div>
      <textarea class="per-image-prompt" placeholder="Cambio especifico para esta foto. Ej: mantener geometria, hacerla nocturna calida, sin personas." data-per-image-prompt="${key}" data-per-image-id="${activeImageId}" ${activeImage ? "" : "disabled"}>${escapeHtml(perPrompt.prompt || "")}</textarea>
    </div>
  `;
}

function renderBoardCurationPanel(analysis, blueprint, selectedMaterials, selectedObjects) {
  return `
    <details class="board-curation compact-details">
      <summary>Materiales y objetos para mood board</summary>
      <div class="field">
        <span>Materiales</span>
        <div class="curation-chip-grid">
          ${safeArray(analysis.materials).map((material) => `
            <button type="button" class="amenity-chip ${selectedMaterials.includes(material) ? "active" : ""}" data-slide-material-toggle="${blueprint.key}" data-slide-material-value="${escapeHtml(material)}">${escapeHtml(material)}</button>
          `).join("") || `<span class="builder-note">No hay materiales leidos aun.</span>`}
        </div>
      </div>
      <div class="field">
        <span>Objetos</span>
        <div class="curation-chip-grid">
          ${safeArray(analysis.objects).map((object) => `
            <button type="button" class="amenity-chip ${selectedObjects.includes(object) ? "active" : ""}" data-slide-object-toggle="${blueprint.key}" data-slide-object-value="${escapeHtml(object)}">${escapeHtml(object)}</button>
          `).join("") || `<span class="builder-note">No hay objetos leidos aun.</span>`}
        </div>
      </div>
      <div class="choice-grid mood-layout-grid">
        ${MOOD_BOARD_LAYOUT_OPTIONS.map((option) => `
          <button type="button" class="choice-card mood-layout-card ${String((state.settings.pdfSlideConfigs[blueprint.key] || {}).moodBoardLayout || inferMoodBoardLayout(blueprint)) === option.value ? "active" : ""}" data-slide-mood-layout="${blueprint.key}" data-slide-mood-layout-value="${option.value}">
            <span class="mood-layout-preview mood-layout-${option.value}" aria-hidden="true"></span>
            <strong>${escapeHtml(option.label)}</strong>
            <p>${escapeHtml(option.description)}</p>
          </button>
        `).join("")}
      </div>
    </details>
  `;
}

function normalizeInlineEditableText(value) {
  return String(value || "")
    .replace(/\u00a0/g, " ")
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n")
    .slice(0, 1200);
}

function renderPdfDeckBuilder() {
  ensurePdfBuilderDefaults();
  const analysis = getMainImage()?.analysis || buildAnalysisFallback();
  const availableSections = PDF_SECTION_LIBRARY;
  const selectedSections = state.settings.pdfSections
    .map((instanceId) => {
      const def = findPdfSectionDefinition(instanceId);
      return def ? { ...def, instanceId } : null;
    })
    .filter(Boolean);
  const palette = getSuggestedPalette(analysis);
  const amenityCount = Number(state.settings.amenityCount || 0);
  const amenityOptions = unique([...AMENITY_LIBRARY, ...safeArray(state.settings.customAmenities), ...safeArray(state.settings.selectedAmenities)]).filter(Boolean);
  const selectedAmenities = safeArray(state.settings.selectedAmenities).slice(0, amenityCount);
  const amenitiesSectionActive = selectedSections.some((item) => item.id === "amenities");
  const amenitiesInstance = selectedSections.find((item) => item.id === "amenities");
  const amenityShortfall = Math.max(0, amenityCount - selectedAmenities.length);
  const amenitySummaryLabel = amenityCount === 0
    ? "Cantidad actual: ninguna."
    : `${selectedAmenities.length}/${amenityCount} seleccionada${amenityCount > 1 ? "s" : ""}${selectedAmenities.length ? ` · ${selectedAmenities.join(", ")}` : " · falta escoger cuales"}${amenityShortfall ? ` · faltan ${amenityShortfall}` : ""}`;
  const blueprints = computePdfSlideBlueprints();
  const styleFilter = String(state.pdfBuilder.styleFilter || "all");
  const styleSearch = String(state.pdfBuilder.styleSearch || "");
  const visibleStyles = getFilteredBrochureStyleOptions();
  const activeStyle = getBrochureStyleProfile(state.settings.brochureStyle);
  const activeTemplate = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const activeTitleFont = TITLE_FONT_OPTIONS.find((option) => option.value === state.settings.titleFont) || TITLE_FONT_OPTIONS[0];
  const activeBodyFont = BODY_FONT_OPTIONS.find((option) => option.value === state.settings.bodyFont) || BODY_FONT_OPTIONS[0];
  const templateCounts = {
    all: BROCHURE_TEMPLATE_LIBRARY.length,
    canva: BROCHURE_TEMPLATE_LIBRARY.filter((option) => option.canvaId).length,
  };
  const audienceGroup = DECISION_GROUPS.pdf.find((group) => group.key === "audience");
  const pdfToneGroup = DECISION_GROUPS.pdf.find((group) => group.key === "pdfTone");
  const narrativeGroup = DECISION_GROUPS.pdf.find((group) => group.key === "narrative");
  const densityGroup = DECISION_GROUPS.pdf.find((group) => group.key === "visualDensity");
  const coverGroup = DECISION_GROUPS.pdf.find((group) => group.key === "coverStyle");

  const templateFilterMarkup = BROCHURE_STYLE_MARKET_GROUPS.map((group) => `
    <button type="button" class="template-filter-chip ${styleFilter === group.value ? "active" : ""}" data-style-filter="${group.value}">
      <span>${escapeHtml(group.label)}</span>
      <strong>${countBrochureStylesForGroup(group.value)}</strong>
    </button>
  `).join("");

  const templateCardMarkup = visibleStyles.length
    ? visibleStyles.map((option) => `
        <button type="button" class="style-card style-card-market ${state.settings.brochureStyle === option.value ? "active" : ""}" data-choice-key="brochureStyle" data-choice-value="${option.value}">
          ${buildBrochureStylePreview(option)}
          <div class="style-card-copy">
              <span class="style-card-kicker">${escapeHtml(option.collection || option.family)}</span>
              <strong>${escapeHtml(option.label)}</strong>
              <p>${escapeHtml(option.description)}</p>
              <div class="style-card-tags">
              <span>canva local</span>
              ${safeArray(option.tags).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
            </div>
          </div>
        </button>
      `).join("")
    : `<div class="empty-state compact-empty"><strong>No hay templates con ese filtro</strong><span>Prueba otra categoria o limpia la busqueda.</span></div>`;

  const selectedSectionCounts = selectedSections.reduce((acc, item) => {
    acc[item.id] = (acc[item.id] || 0) + 1;
    return acc;
  }, {});

  const availableSectionMarkup = availableSections.length
    ? availableSections.map((item) => {
        const count = selectedSectionCounts[item.id] || 0;
        return `
        <button type="button" class="section-option-card ${count ? "has-added" : ""}" data-section-add="${item.id}">
          <div class="section-option-copy">
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.description)}</span>
            ${count ? `<span class="section-option-count">Ya agregada · ${count}</span>` : ""}
          </div>
          <span class="section-option-action">+ Agregar</span>
        </button>
      `;
      }).join("")
    : `<div class="empty-state compact-empty"><strong>No quedan secciones disponibles</strong><span>Ya agregaste todas las secciones base al deck.</span></div>`;

  const sectionDuplicateIndex = {};
  const selectedSectionMarkup = selectedSections.length
    ? selectedSections.map((item, index) => {
        sectionDuplicateIndex[item.id] = (sectionDuplicateIndex[item.id] || 0) + 1;
        const totalOfKind = selectedSectionCounts[item.id] || 1;
        const dupSuffix = totalOfKind > 1 ? ` · ${sectionDuplicateIndex[item.id]}` : "";
        const instanceId = item.instanceId;
        const isAmenities = item.id === "amenities";
        const amenityInlineMarkup = isAmenities ? `
          <div class="section-amenity-inline">
            <div class="section-amenity-inline-head">
              <span class="field-label">Cantidad de amenidades</span>
              <span class="section-amenity-status">${escapeHtml(amenitySummaryLabel)}</span>
            </div>
            <div class="choice-inline wrap">
              ${Array.from({ length: MAX_AMENITY_COUNT + 1 }, (_, count) => count).map((count) => `
                <button type="button" class="select-chip ${amenityCount === count ? "active" : ""}" data-amenity-count="${count}">
                  ${count === 0 ? "Ninguna" : `${count}`}
                </button>
              `).join("")}
            </div>
            ${amenityCount > 0 ? `
              <div class="amenity-chip-grid">
                ${amenityOptions.map((amenity) => `
                  <button type="button" class="amenity-chip ${state.settings.selectedAmenities.includes(amenity) ? "active" : ""}" data-amenity-value="${escapeHtml(amenity)}">
                    ${escapeHtml(amenity)}
                  </button>
                `).join("")}
              </div>
              <div class="amenity-custom-row">
                <input type="text" data-amenity-custom-input placeholder="Agregar amenidad especifica..." />
                <button type="button" class="button button-secondary" data-amenity-custom-add>Agregar</button>
              </div>
            ` : ""}
          </div>
        ` : "";
        return `
        <article class="selected-section-card">
          <div class="selected-section-order">${index + 1}</div>
          <div class="selected-section-copy">
            <strong>${escapeHtml(item.label)}${dupSuffix}</strong>
            <span>${escapeHtml(isAmenities ? "Slides individuales por cada amenidad seleccionada." : item.description)}</span>
            ${amenityInlineMarkup}
          </div>
          <div class="selected-section-actions">
            <button type="button" class="button button-ghost" data-section-move="${instanceId}" data-section-direction="-1" ${index === 0 ? "disabled" : ""}>↑</button>
            <button type="button" class="button button-ghost" data-section-move="${instanceId}" data-section-direction="1" ${index === selectedSections.length - 1 ? "disabled" : ""}>↓</button>
            <button type="button" class="button button-secondary" data-section-remove="${instanceId}">Quitar</button>
          </div>
        </article>
      `;
      }).join("")
    : `<div class="empty-state compact-empty"><strong>Aun no escoges secciones</strong><span>Agrega una o varias paginas base para construir la narrativa del brochure.</span></div>`;

  const strategyBlocks = [
    renderCompactChoiceSet("projectType", "Proyecto", "Tipo de brochure", PROJECT_TYPE_OPTIONS, state.settings.projectType),
    renderCompactChoiceSet("audience", "Audiencia", "Para quien esta pensado", audienceGroup?.options || [], state.settings.audience),
    renderCompactChoiceSet("pdfTone", "Tono", "Carácter editorial", pdfToneGroup?.options || [], state.settings.pdfTone),
    renderCompactChoiceSet("narrative", "Narrativa", "Como se cuenta el proyecto", narrativeGroup?.options || [], state.settings.narrative),
    renderCompactChoiceSet("visualDensity", "Densidad", "Cuanto aire vs. cantidad visual", densityGroup?.options || [], state.settings.visualDensity),
    renderCompactChoiceSet("coverStyle", "Portada", "Gestualidad de la cubierta", coverGroup?.options || [], state.settings.coverStyle),
    renderCompactChoiceSet("brochureLanguage", "Idioma", "Lenguaje final del deck", BROCHURE_LANGUAGE_OPTIONS, state.settings.brochureLanguage),
    renderCompactChoiceSet("pdfImageMode", "Imagen global", "Modo por defecto para las paginas", PDF_IMAGE_MODE_OPTIONS, state.settings.pdfImageMode),
  ].join("");

  const paletteCardMarkup = `
    <section class="pdf-builder-card">
      <div class="mini-head">
        <span class="eyebrow">Paleta</span>
        <strong>Escoge si el brochure usa colores sugeridos por renders o una seleccion propia</strong>
      </div>
      <div class="palette-toolbar">
        <button type="button" class="button ${state.settings.colorMode === "suggested" ? "button-primary" : "button-secondary"}" data-color-mode="suggested">Sugerida por renders</button>
        <button type="button" class="button ${state.settings.colorMode === "manual" ? "button-primary" : "button-secondary"}" data-color-mode="manual">Seleccion manual</button>
      </div>
      <div class="palette-chip-grid">
        ${palette.map((color) => `
          <button type="button" class="palette-chip ${state.settings.selectedPalette.includes(color) ? "active" : ""}" data-palette-color="${color}">
            <span class="palette-swatch" style="background:${color}"></span>
            <strong>${escapeHtml(color.toUpperCase())}</strong>
          </button>
        `).join("")}
      </div>
    </section>
  `;

  const sectionsPlannerMarkup = `
    <section class="pdf-builder-card pdf-builder-card-wide">
      <div class="mini-head">
        <span class="eyebrow">Cantidad y tipo</span>
        <strong>Escoge las diapositivas que existiran antes de editar cualquiera de ellas</strong>
      </div>
      <div class="section-market-layout">
        <div class="section-market-bank">
          <div class="section-market-head">
            <span class="field-label">Tipos disponibles</span>
            <button type="button" class="button button-ghost" data-section-bulk="all">Agregar todo</button>
          </div>
          <div class="section-option-grid">
            ${availableSectionMarkup}
          </div>
        </div>
        <div class="section-market-selected">
          <div class="section-market-head">
            <span class="field-label">Elegidas (${selectedSections.length}) · ${blueprints.length} paginas</span>
            <button type="button" class="button button-ghost" data-section-bulk="clear">Limpiar</button>
          </div>
          <div class="selected-section-stack">
            ${selectedSectionMarkup}
          </div>
        </div>
      </div>
      <div class="builder-note">Aqui solo decides cuantas paginas habra y de que tipo. La seleccion de la diapositiva y sus imagenes queda para el paso 5.</div>
    </section>
  `;

  if (state.currentStep === 4) {
    return `
      <article class="pdf-builder-shell template-market-shell slide-plan-shell">
        <div class="mini-head">
          <span class="eyebrow">Paso 4 · Mapa del brochure</span>
          <strong>Arma la secuencia de diapositivas</strong>
        </div>
        <div class="slide-plan-summary">
          <span class="status-chip status-soft">Template · ${escapeHtml(activeTemplate.label)}</span>
          <span class="status-chip status-soft">${blueprints.length} pagina${blueprints.length === 1 ? "" : "s"}</span>
        </div>
        <div class="slide-plan-grid-simple">
          ${sectionsPlannerMarkup}
        </div>
      </article>
    `;
  }

  return `
    <article class="pdf-builder-shell template-market-shell pdf-step3-shell">
      <div class="mini-head">
        <span class="eyebrow">Paso 3 · Diseño base</span>
        <strong>Escoge el template visual que definirá el brochure</strong>
      </div>

      <div class="template-browser-card pdf-builder-card">
          <div class="template-browser-head">
            <div class="mini-head compact">
              <span class="eyebrow">Template</span>
              <strong>${escapeHtml(activeTemplate.label)}</strong>
              <small class="template-browser-meta">${escapeHtml(activeTemplate.collection || activeStyle.family)}</small>
            </div>
          </div>

        <div class="template-browser-toolbar">
          <div class="template-filter-row">
            ${templateFilterMarkup}
          </div>
          <label class="template-search-field">
            <span>Buscar template</span>
            <input type="text" value="${escapeHtml(styleSearch)}" data-style-search placeholder="Portfolio, dark, editorial, minimal, hospitality..." />
          </label>
        </div>

        <div class="style-library-grid template-browser-gallery">
          ${templateCardMarkup}
        </div>
      </div>

      <div class="pdf-builder-grid pdf-builder-grid-market">
        <section class="pdf-builder-card">
          <div class="mini-head">
            <span class="eyebrow">Base editorial</span>
            <strong>Define el tono del brochure sin parametrizar aun las imagenes</strong>
          </div>
          <div class="template-strategy-grid">
            ${strategyBlocks}
          </div>
        </section>

        <section class="pdf-builder-card">
          <div class="mini-head">
            <span class="eyebrow">Tipografia</span>
            <strong>Escoge una dupla tipografica mas cercana a un deck premium</strong>
          </div>
          <div class="font-preview-stack">
            <div class="font-selected-pair">
              <button type="button" class="font-selected-card active" data-choice-key="titleFont" data-choice-value="${activeTitleFont.value}">
                <span>Titulos</span>
                <strong style="font-family:'${escapeHtml(activeTitleFont.value)}', serif">${escapeHtml(activeTitleFont.label)}</strong>
                <small style="font-family:'${escapeHtml(activeTitleFont.value)}', serif">${escapeHtml(activeTitleFont.sample)}</small>
              </button>
              <button type="button" class="font-selected-card active" data-choice-key="bodyFont" data-choice-value="${activeBodyFont.value}">
                <span>Texto</span>
                <strong style="font-family:'${escapeHtml(activeBodyFont.value)}', sans-serif">${escapeHtml(activeBodyFont.label)}</strong>
                <small style="font-family:'${escapeHtml(activeBodyFont.value)}', sans-serif">${escapeHtml(activeBodyFont.sample)}</small>
              </button>
            </div>
            <details class="font-library-drawer">
              <summary>
                <strong>Cambiar dupla tipografica</strong>
                <small>Abre la biblioteca solo si quieres ajustar fuentes.</small>
              </summary>
              <div class="font-preview-group">
              <span class="field-label">Titulos</span>
              <div class="font-preview-grid">
                ${TITLE_FONT_OPTIONS.map((option) => `
                  <button type="button" class="font-preview-card ${state.settings.titleFont === option.value ? "active" : ""}" data-choice-key="titleFont" data-choice-value="${option.value}">
                    <strong style="font-family:'${escapeHtml(option.value)}', serif">${escapeHtml(option.label)}</strong>
                    <span style="font-family:'${escapeHtml(option.value)}', serif">${escapeHtml(option.sample)}</span>
                  </button>
                `).join("")}
              </div>
              </div>
              <div class="font-preview-group">
              <span class="field-label">Texto corrido</span>
              <div class="font-preview-grid">
                ${BODY_FONT_OPTIONS.map((option) => `
                  <button type="button" class="font-preview-card ${state.settings.bodyFont === option.value ? "active" : ""}" data-choice-key="bodyFont" data-choice-value="${option.value}">
                    <strong style="font-family:'${escapeHtml(option.value)}', sans-serif">${escapeHtml(option.label)}</strong>
                    <span style="font-family:'${escapeHtml(option.value)}', sans-serif">${escapeHtml(option.sample)}</span>
                  </button>
                `).join("")}
              </div>
              </div>
            </details>
          </div>
        </section>

        ${paletteCardMarkup}
      </div>
    </article>
  `;
}

function ensurePdfBuilderDefaults() {
  if (!Array.isArray(state.settings.pdfSections) || !state.settings.pdfSections.length) {
    state.settings.pdfSections = [...DEFAULT_SETTINGS.pdfSections];
  }
  if (!Array.isArray(state.settings.selectedPalette)) state.settings.selectedPalette = [];
  if (!Array.isArray(state.settings.selectedAmenities)) state.settings.selectedAmenities = [];
  if (!Array.isArray(state.settings.customAmenities)) state.settings.customAmenities = [];
  if (!Array.from({ length: MAX_AMENITY_COUNT + 1 }, (_, count) => count).includes(Number(state.settings.amenityCount))) {
    state.settings.amenityCount = "0";
  }
  state.settings.selectedAmenities = safeArray(state.settings.selectedAmenities).slice(0, Number(state.settings.amenityCount || 0));
  if (!state.settings.pdfSlideConfigs || typeof state.settings.pdfSlideConfigs !== "object") {
    state.settings.pdfSlideConfigs = {};
  }
  if (!state.settings.pdfSlideLayouts || typeof state.settings.pdfSlideLayouts !== "object") {
    state.settings.pdfSlideLayouts = {};
  }
  if (!state.settings.pdfPerImagePrompts || typeof state.settings.pdfPerImagePrompts !== "object") {
    state.settings.pdfPerImagePrompts = {};
  }
  if (!PDF_IMAGE_MODE_OPTIONS.some((option) => option.value === state.settings.pdfImageMode)) {
    state.settings.pdfImageMode = DEFAULT_SETTINGS.pdfImageMode;
  }
  state.settings.brochureStyle = normalizeBrochureStyleValue(state.settings.brochureStyle);
  if (!BROCHURE_LANGUAGE_OPTIONS.some((option) => option.value === state.settings.brochureLanguage)) {
    state.settings.brochureLanguage = DEFAULT_SETTINGS.brochureLanguage;
  }
  if (!TITLE_FONT_OPTIONS.some((option) => option.value === state.settings.titleFont)) {
    state.settings.titleFont = DEFAULT_SETTINGS.titleFont;
  }
  if (!BODY_FONT_OPTIONS.some((option) => option.value === state.settings.bodyFont)) {
    state.settings.bodyFont = DEFAULT_SETTINGS.bodyFont;
  }
  const suggested = getSuggestedPalette(getMainImage()?.analysis || buildAnalysisFallback());
  if (!state.settings.selectedPalette.length && suggested.length) {
    state.settings.selectedPalette = suggested.slice(0, 4);
  }
}

function getSuggestedPalette(analysis) {
  const palette = safeArray(analysis.palette).map((entry) => entry.hex);
  const fallback = ["#d7c2a5", "#7c5c43", "#53656f", "#9ba78c", "#efe7da"];
  return unique([...(palette || []), ...fallback]).slice(0, 6);
}

function getSlideLayoutVariantsForTemplate(templateEntry, blueprint) {
  // Derive PPT-like layout variants from the template token / blueprint
  const baseVariants = [
    { value: "cover", label: "Portada" },
    { value: "spread", label: "Doble página" },
    { value: "mosaic", label: "Mosaico" },
    { value: "feature", label: "Feature" },
    { value: "gallery", label: "Galería" },
    { value: "split", label: "Split" },
  ];
  const tokenHint = String(templateEntry?.template || templateEntry?.value || "").toLowerCase();
  if (tokenHint.includes("mosaic") || tokenHint.includes("gallery")) {
    return [baseVariants[0], baseVariants[2], baseVariants[4], baseVariants[3]];
  }
  if (tokenHint.includes("folio") || tokenHint.includes("ivory") || tokenHint.includes("monolith")) {
    return [baseVariants[0], baseVariants[5], baseVariants[3], baseVariants[1]];
  }
  if (blueprint?.visualRole === "moodboard" || blueprint?.layout === "board") {
    return [baseVariants[2], baseVariants[4], baseVariants[1], baseVariants[3]];
  }
  return baseVariants;
}

function computePdfSlideBlueprints() {
  ensurePdfBuilderDefaults();
  const blueprints = [];
  const sections = state.settings.pdfSections;
  const amenities = safeArray(state.settings.selectedAmenities).slice(0, Number(state.settings.amenityCount || 0));

  const baseCounts = {};
  sections.forEach((instanceId) => {
    const section = findPdfSectionDefinition(instanceId);
    if (!section) return;
    const baseId = section.id;
    baseCounts[baseId] = (baseCounts[baseId] || 0) + 1;
    const indexSuffix = baseCounts[baseId];
    const duplicateOffset = instanceId !== baseId ? ` · ${indexSuffix}` : (indexSuffix > 1 ? ` · ${indexSuffix}` : "");

    if (section.expandable) {
      const amenityItems = amenities.length ? amenities : [];
      amenityItems.forEach((amenity) => {
        blueprints.push({
          key: `amenity-${slugify(amenity)}-${baseCounts[baseId]}`,
          sectionId: baseId,
          sectionInstanceId: instanceId,
          sectionLabel: section.label,
          title: `Amenidad · ${amenity}`,
          subtitle: `Slide dedicada para ${amenity}.`,
          visualRole: "detail",
          layout: "feature",
          allowProjectImages: true,
        });
      });
      return;
    }

    blueprints.push({
      key: instanceId,
      sectionId: baseId,
      sectionInstanceId: instanceId,
      sectionLabel: section.label,
      title: `${section.label}${duplicateOffset}`,
      subtitle: section.description,
      visualRole: section.visualRole,
      layout: section.layout,
      allowProjectImages: section.allowProjectImages,
    });
  });

  blueprints.forEach((blueprint) => ensurePdfSlideConfigExists(blueprint));
  const validKeys = new Set(blueprints.map((blueprint) => blueprint.key));
  Object.keys(state.settings.pdfSlideConfigs).forEach((key) => {
    if (!validKeys.has(key)) delete state.settings.pdfSlideConfigs[key];
  });
  if (!blueprints.length) {
    state.pdfBuilder.currentSlideKey = null;
  } else if (!state.pdfBuilder.currentSlideKey || !validKeys.has(state.pdfBuilder.currentSlideKey)) {
    state.pdfBuilder.currentSlideKey = blueprints[0].key;
  }
  return blueprints;
}

function ensurePdfSlideConfigExists(blueprint) {
  if (!state.settings.pdfSlideConfigs[blueprint.key]) {
    // Only renders/gallery sections get multiple images by default and capped at 2.
    // Everything else uses the main image only. Other photos stay as context.
    const isRenderHeavy = ["renders", "gallery"].includes(blueprint.sectionId);
    const defaultImageIds = isRenderHeavy
      ? state.images.slice(0, Math.min(2, state.images.length)).map((image) => image.id)
      : state.mainId ? [state.mainId] : [];
    state.settings.pdfSlideConfigs[blueprint.key] = {
      useProjectImages: Boolean(blueprint.allowProjectImages),
      imageIds: defaultImageIds,
      layout: blueprint.layout,
      moodSources: blueprint.sectionId === "moodboard"
        ? ["materials", "palette", "reference"]
        : blueprint.sectionId === "materials"
          ? ["materials", "project"]
          : ["project"],
      imagePlacement: inferImagePlacement(blueprint.layout),
      imageAspect: inferImageAspect(blueprint.layout),
      imageSourceMode: "inherit",
      imageCount: String(Math.max(1, defaultImageIds.length || 1)),
      activeImageId: defaultImageIds[0] || state.mainId || state.images[0]?.id || "",
      imageSize: inferImageSize(blueprint.layout),
      imageZone: inferImageZone(blueprint.layout, inferImagePlacement(blueprint.layout)),
      imageFraming: inferImageFraming(blueprint.layout),
      imageArrangement: inferImageArrangement(blueprint.layout),
      moodBoardLayout: inferMoodBoardLayout(blueprint),
      renderTreatment: "master",
      imageRepresentation: "inherit",
      imageFinish: "inherit",
      imageOccupancy: "inherit",
      textMode: "suggested",
      slideBackground: "inherit",
      customTitle: "",
      customSubtitle: "",
      customBullets: "",
      materialHighlights: [],
      objectHighlights: [],
    };
  } else if (!state.settings.pdfSlideConfigs[blueprint.key].layout) {
    state.settings.pdfSlideConfigs[blueprint.key].layout = blueprint.layout;
  }
  const config = state.settings.pdfSlideConfigs[blueprint.key];
  if (!config.imagePlacement) config.imagePlacement = inferImagePlacement(config.layout || blueprint.layout);
  if (!config.imageAspect) config.imageAspect = inferImageAspect(config.layout || blueprint.layout);
  if (!config.imageSourceMode) config.imageSourceMode = "inherit";
  if (!config.imageCount) config.imageCount = String(Math.max(1, safeArray(config.imageIds).length || 1));
  if (!config.activeImageId || !state.images.some((image) => image.id === config.activeImageId)) {
    config.activeImageId = safeArray(config.imageIds).find((id) => state.images.some((image) => image.id === id)) || state.mainId || state.images[0]?.id || "";
  }
  if (!config.imageSize) config.imageSize = inferImageSize(config.layout || blueprint.layout);
  if (!config.imageZone) config.imageZone = inferImageZone(config.layout || blueprint.layout, config.imagePlacement);
  if (!config.imageFraming) config.imageFraming = inferImageFraming(config.layout || blueprint.layout);
  if (!config.imageArrangement) config.imageArrangement = inferImageArrangement(config.layout || blueprint.layout);
  if (!config.moodBoardLayout) config.moodBoardLayout = inferMoodBoardLayout(blueprint);
  if (!config.renderTreatment) config.renderTreatment = "master";
  if (!config.imageRepresentation) config.imageRepresentation = "inherit";
  if (!config.imageFinish) config.imageFinish = "inherit";
  if (!config.imageOccupancy) config.imageOccupancy = "inherit";
  if (!config.textMode) config.textMode = "suggested";
  if (!Array.isArray(config.materialHighlights)) config.materialHighlights = [];
  if (!Array.isArray(config.objectHighlights)) config.objectHighlights = [];
}

function resolveCurrentPdfBlueprint(blueprints) {
  const list = safeArray(blueprints);
  if (!list.length) return null;
  const found = list.find((blueprint) => blueprint.key === state.pdfBuilder.currentSlideKey);
  return found || list[0];
}

function inferImagePlacement(layout) {
  if (layout === "feature") return "full";
  if (layout === "board" || layout === "gallery") return "center";
  if (layout === "technical") return "left";
  return "right";
}

function inferImageAspect(layout) {
  if (layout === "board" || layout === "gallery") return "square";
  if (layout === "technical") return "panoramic";
  return "landscape";
}

function inferImageSize(layout) {
  if (layout === "feature") return "giant";
  if (layout === "board" || layout === "gallery") return "medium";
  if (layout === "technical") return "large";
  return "large";
}

function inferImageZone(layout, placement) {
  if (placement === "full") return "center";
  if (placement === "left") return "middle-left";
  if (placement === "right") return "middle-right";
  if (placement === "top") return "top-center";
  if (placement === "bottom") return "bottom-center";
  if (layout === "board" || layout === "gallery") return "center";
  return "center";
}

function inferImageFraming(layout) {
  if (layout === "board" || layout === "gallery") return "cropped";
  return "clean";
}

function inferImageArrangement(layout) {
  if (layout === "gallery") return "collage";
  if (layout === "board") return "collage";
  return "single";
}

function isMoodBoardBlueprint(blueprint = {}, config = {}) {
  const layout = config.layout || blueprint.layout;
  const role = blueprint.visualRole || "";
  return layout === "board"
    || role === "moodboard"
    || role === "materials"
    || role === "palette"
    || ["moodboard", "materials", "pantone", "concept"].includes(blueprint.sectionId);
}

function inferMoodBoardLayout(blueprint = {}) {
  const role = blueprint.visualRole || "";
  if (blueprint.sectionId === "materials" || role === "materials") return "grid-separated";
  if (blueprint.sectionId === "pantone" || role === "palette") return "circular-palette";
  if (blueprint.sectionId === "concept") return "pinboard";
  if (blueprint.sectionId === "site") return "architect-desk";
  return "object-flatlay";
}

function getMoodBoardLayoutPrompt(value) {
  const option = MOOD_BOARD_LAYOUT_OPTIONS.find((entry) => entry.value === value);
  if (!option) return "";
  return `Mood-board layout reference: ${option.label}. ${option.prompt}`;
}

function isTemplatePreviewAssetUrl(value) {
  const text = String(value || "").toLowerCase();
  return text.includes("assets/template-previews/")
    || text.includes("assets/local-brochure-templates/")
    || text.includes("/previews/slide");
}

function buildSectionConfigSummary(blueprint, config) {
  const parts = [config.layout || blueprint.layout];
  const mode = resolveSlideImageSourceMode(config);
  if (config.useProjectImages) {
    const count = safeArray(config.imageIds).length;
    parts.push(count ? `${count} foto${count === 1 ? "" : "s"}` : "sin foto elegida");
    parts.push(mode === "raw" ? "cruda" : "render");
  } else {
    parts.push("sin imagen directa");
  }
  parts.push(optionLabel(SLIDE_IMAGE_ASPECT_OPTIONS, config.imageAspect || inferImageAspect(config.layout || blueprint.layout)));
  parts.push(optionLabel(SLIDE_IMAGE_SIZE_OPTIONS, config.imageSize || inferImageSize(config.layout || blueprint.layout)));
  parts.push(optionLabel(SLIDE_IMAGE_ARRANGEMENT_OPTIONS, config.imageArrangement || inferImageArrangement(config.layout || blueprint.layout)));
  if (isMoodBoardBlueprint(blueprint, config)) {
    parts.push(optionLabel(MOOD_BOARD_LAYOUT_OPTIONS, config.moodBoardLayout || inferMoodBoardLayout(blueprint)));
  }
  if (config.textMode === "free") parts.push("texto libre");
  else if (config.textMode === "custom") parts.push("texto editado");
  return parts.join(" · ");
}

function optionLabel(options, value) {
  return options.find((option) => option.value === value)?.label || value || "";
}

function optionDescription(options, value) {
  return options.find((option) => option.value === value)?.description || "";
}

function getDecisionOption(key, value = state.settings[key]) {
  const groups = [...DECISION_GROUPS.render, ...DECISION_GROUPS.pdf];
  const group = groups.find((entry) => entry.key === key);
  return group?.options.find((option) => option.value === value) || null;
}

function getDecisionLabel(key, value = state.settings[key]) {
  const option = getDecisionOption(key, value);
  return option?.label || value || "";
}

function getDecisionDescription(key, value = state.settings[key]) {
  return getDecisionOption(key, value)?.description || "";
}

function normalizeBrochureStyleValue(value) {
  const rawValue = String(value || "").trim();
  const normalized = BROCHURE_STYLE_ALIASES[rawValue] || rawValue || DEFAULT_SETTINGS.brochureStyle;
  if (typeof BROCHURE_TEMPLATE_LIBRARY !== "undefined" && BROCHURE_TEMPLATE_LIBRARY.some((option) => option.value === normalized)) return normalized;
  const remapped = BROCHURE_STYLE_ALIASES[normalized];
  if (remapped && typeof BROCHURE_TEMPLATE_LIBRARY !== "undefined" && BROCHURE_TEMPLATE_LIBRARY.some((option) => option.value === remapped)) return remapped;
  return DEFAULT_SETTINGS.brochureStyle;
}

function getBrochureStyleProfile(value) {
  const normalized = normalizeBrochureStyleValue(value);
  return (typeof BROCHURE_TEMPLATE_LIBRARY !== "undefined" ? BROCHURE_TEMPLATE_LIBRARY.find((option) => option.value === normalized) : null)
    || BROCHURE_STYLE_OPTIONS.find((option) => option.value === normalized)
    || BROCHURE_STYLE_OPTIONS[0];
}

function getBrochureTemplateGalleryEntry(value) {
  const normalized = normalizeBrochureStyleValue(value);
  return BROCHURE_TEMPLATE_LIBRARY.find((entry) => entry.value === normalized) || BROCHURE_TEMPLATE_LIBRARY[0];
}

function getFilteredBrochureStyleOptions() {
  const filter = String(state.pdfBuilder.styleFilter || "all");
  const query = String(state.pdfBuilder.styleSearch || "").trim().toLowerCase();
  return BROCHURE_TEMPLATE_LIBRARY.filter((option) => {
    const matchesFilter = filter === "all" || safeArray(option.groups).includes(filter);
    const matchesQuery = !query || String(option.searchIndex || "").includes(query);
    return matchesFilter && matchesQuery;
  });
}

function countBrochureStylesForGroup(groupValue) {
  if (groupValue === "all") return BROCHURE_TEMPLATE_LIBRARY.length;
  return BROCHURE_TEMPLATE_LIBRARY.filter((option) => safeArray(option.groups).includes(groupValue)).length;
}

function renderCompactChoiceSet(key, title, description, options, currentValue) {
  return `
    <div class="compact-choice-block">
      <div class="mini-head">
        <span class="eyebrow">${escapeHtml(title)}</span>
        <strong>${escapeHtml(description)}</strong>
      </div>
      <div class="compact-choice-row">
        ${safeArray(options).map((option) => `
          <button type="button" class="compact-choice-chip ${String(currentValue) === option.value ? "active" : ""}" data-choice-key="${key}" data-choice-value="${option.value}">
            <span>${escapeHtml(option.label)}</span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function getBrochureStylePreviewCopy(option) {
  const library = {
    monolith: { kicker: "architectural monograph", title: ["ARCHITECTURE", "PORTFOLIO"], subtitle: "Large image, restrained text, premium silence.", metaLeft: "Studio deck", metaRight: "Vol. 01" },
    folio: { kicker: "curated portfolio", title: ["PORTFOLIO"], subtitle: "Elegant margins and editorial sequencing.", metaLeft: "Architecture", metaRight: "Edition" },
    magazine: { kicker: "creative portfolio", title: ["Creative", "Portfolio"], subtitle: "Magazine rhythm with layered storytelling.", metaLeft: "Visual issue", metaRight: "Preview" },
    poster: { kicker: "brand impact", title: ["PITCH", "DECK"], subtitle: "Bold headlines and graphic hierarchy.", metaLeft: "Concept", metaRight: "Cover" },
    mosaic: { kicker: "material board", title: ["MOOD", "BOARD"], subtitle: "Collage, crops and multiple visual readings.", metaLeft: "Palette", metaRight: "Objects" },
    "gallery-wall": { kicker: "curated imagery", title: ["GALLERY", "SERIES"], subtitle: "Exhibition-like layout with strong curation.", metaLeft: "Sequence", metaRight: "Wall" },
    storyboard: { kicker: "project narrative", title: ["PROJECT", "STORY"], subtitle: "Frames, beats and visual storytelling.", metaLeft: "Narrative", metaRight: "Flow" },
    atelier: { kicker: "studio collection", title: ["ATELIER", "BOOK"], subtitle: "Tactile, refined and art-directed.", metaLeft: "Studio", metaRight: "Curated" },
    "urban-grid": { kicker: "urban proposal", title: ["URBAN", "PORTFOLIO"], subtitle: "Graphic city energy and modular structure.", metaLeft: "Grid", metaRight: "Issue" },
    "technical-sheet": { kicker: "design manual", title: ["DESIGN", "MANUAL"], subtitle: "Technical precision with blueprint logic.", metaLeft: "System", metaRight: "Sheet" },
    resort: { kicker: "hospitality brochure", title: ["RESORT", "DECK"], subtitle: "Warm, immersive and experience-driven.", metaLeft: "Hospitality", metaRight: "Edition" },
    manifest: { kicker: "creative brief", title: ["CREATIVE", "BRIEF"], subtitle: "Asymmetric, expressive and vanguard.", metaLeft: "Manifesto", metaRight: "Draft" },
    obsidian: { kicker: "night editorial", title: ["PORTFOLIO."], subtitle: "Dark premium cover with restrained gold accents.", metaLeft: "Nocturne", metaRight: "Lux" },
    ivory: { kicker: "minimal profile", title: ["PROJECT", "PROFILE"], subtitle: "White space, restraint and quiet authority.", metaLeft: "Minimal", metaRight: "Profile" },
    aurora: { kicker: "gradient collection", title: ["BRAND", "DECK"], subtitle: "Soft atmospheres with luminous color flow.", metaLeft: "Gradient", metaRight: "Aura" },
    onyx: { kicker: "high-tech pitch", title: ["PITCH", "DECK"], subtitle: "Futuristic dark deck with sharp glow.", metaLeft: "Signal", metaRight: "Beta" },
    velvet: { kicker: "mood collection", title: ["MOOD", "BOOK"], subtitle: "Textural warmth, luxury and softness.", metaLeft: "Texture", metaRight: "Warmth" },
    prism: { kicker: "multi-color deck", title: ["PRISM", "PORTFOLIO"], subtitle: "Color-drenched, bright and expressive.", metaLeft: "Spectrum", metaRight: "Mix" },
    dune: { kicker: "hospitality identity", title: ["INTERIOR", "DESIGN"], subtitle: "Sand, terracotta and resort warmth.", metaLeft: "Warm stone", metaRight: "Resort" },
    slate: { kicker: "architecture proposal", title: ["PROJECT", "PROPOSAL"], subtitle: "Brutalist clarity with concrete restraint.", metaLeft: "Proposal", metaRight: "Urban" },
  };
  return library[option.template] || library.monolith;
}

function buildBrochureStylePreview(option) {
  const copy = getBrochureStylePreviewCopy(option);
  const swatches = [option.paper, option.accent, option.ink, colorMixHex(option.accent, "#ffffff", 0.42)]
    .filter(Boolean)
    .slice(0, 4)
    .map((color) => `<span class="style-card-swatch" style="background:${color}"></span>`)
    .join("");
  const artUrl = option.thumbnail || "";

  return `
    <div class="style-card-preview style-card-preview-art" style="--style-paper:${option.paper};--style-ink:${option.ink};--style-accent:${option.accent};">
      <div class="style-card-thumb-frame">
        ${artUrl ? `<img class="style-card-thumb" src="${escapeHtml(artUrl)}" alt="${escapeHtml(option.label)}" loading="lazy" />` : ""}
        <div class="style-card-thumb-overlay">
          <span class="style-card-thumb-kicker">${escapeHtml(copy.kicker)}</span>
          <span class="style-card-thumb-pages">${escapeHtml(option.collection || copy.metaRight || "Template")}</span>
        </div>
      </div>
      <div class="style-card-swatches">${swatches}</div>
    </div>
  `;
}

function resolveSlideImageSourceMode(config) {
  const explicit = String(config?.imageSourceMode || "inherit");
  return explicit === "inherit" ? state.settings.pdfImageMode : explicit;
}

function getDecisionOptions(key) {
  return [...DECISION_GROUPS.render, ...DECISION_GROUPS.pdf].find((entry) => entry.key === key)?.options || [];
}

function getAspectRatio(aspect) {
  if (aspect === "square") return 1;
  if (aspect === "portrait") return 0.76;
  if (aspect === "panoramic") return 2.25;
  return 1.55;
}

function scaleFrameByPreset(rect, size) {
  const multipliers = {
    small: 0.42,
    medium: 0.6,
    large: 0.78,
    giant: 0.92,
    "full-page": 1,
  };
  const factor = multipliers[size] || multipliers.large;
  const width = rect.width * factor;
  const height = rect.height * factor;
  return {
    x: rect.x + ((rect.width - width) / 2),
    y: rect.y + ((rect.height - height) / 2),
    width,
    height,
  };
}

function colorMixHex(colorA, colorB, weight = 0.5) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  if (!a || !b) return colorA || colorB || "#d8d0c6";
  const mix = {
    r: Math.round((a.r * (1 - weight)) + (b.r * weight)),
    g: Math.round((a.g * (1 - weight)) + (b.g * weight)),
    b: Math.round((a.b * (1 - weight)) + (b.b * weight)),
  };
  return rgbToHex(mix.r, mix.g, mix.b);
}

function hexToRgb(hex) {
  const clean = String(hex || "").replace("#", "").trim();
  if (![3, 6].includes(clean.length)) return null;
  const normalized = clean.length === 3
    ? clean.split("").map((chunk) => chunk + chunk).join("")
    : clean;
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value)) return null;
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

function isDarkBackground(color) {
  const rgb = hexToRgb(color);
  if (!rgb) return false;
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.45;
}

function fitRectToAspect(rect, aspect, anchor = "center") {
  const ratio = getAspectRatio(aspect);
  let width = rect.width;
  let height = width / ratio;
  if (height > rect.height) {
    height = rect.height;
    width = height * ratio;
  }

  let x = rect.x + ((rect.width - width) / 2);
  let y = rect.y + ((rect.height - height) / 2);

  const zones = {
    left: { x: "start", y: "center" },
    right: { x: "end", y: "center" },
    top: { x: "center", y: "start" },
    bottom: { x: "center", y: "end" },
    "top-left": { x: "start", y: "start" },
    "top-center": { x: "center", y: "start" },
    "top-right": { x: "end", y: "start" },
    "middle-left": { x: "start", y: "center" },
    center: { x: "center", y: "center" },
    "middle-right": { x: "end", y: "center" },
    "bottom-left": { x: "start", y: "end" },
    "bottom-center": { x: "center", y: "end" },
    "bottom-right": { x: "end", y: "end" },
  };
  const zone = zones[anchor] || zones.center;
  if (zone.x === "start") x = rect.x;
  if (zone.x === "end") x = rect.x + rect.width - width;
  if (zone.y === "start") y = rect.y;
  if (zone.y === "end") y = rect.y + rect.height - height;

  return { x, y, width, height };
}

function renderSlideQuickEditor(blueprint, values) {
  const key = blueprint.key;
  return `
    <div class="slide-quick-editor" aria-label="Editor rapido de diapositiva">
      ${renderSlideQuickOptionGroup("Foto", "Cruda o render", SLIDE_IMAGE_SOURCE_OPTIONS, values.imageSourceMode, key, "slide-image-source", ["rendered", "raw", "inherit"])}
      ${renderSlideQuickOptionGroup("Posicion", "Mover visual", SLIDE_IMAGE_PLACEMENT_OPTIONS, values.imagePlacement, key, "slide-image-placement", ["full", "left", "right", "top", "bottom", "center"])}
      ${renderSlideQuickOptionGroup("Tamano", "Peso en pagina", SLIDE_IMAGE_SIZE_OPTIONS, values.imageSize, key, "slide-image-size", ["small", "medium", "large", "giant", "full-page"])}
      ${renderSlideQuickOptionGroup("Formato", "Proporcion", SLIDE_IMAGE_ASPECT_OPTIONS, values.imageAspect, key, "slide-image-aspect", ["landscape", "square", "portrait", "panoramic"])}
      ${renderSlideQuickOptionGroup("Composicion", "Una, collage, cortes", SLIDE_IMAGE_ARRANGEMENT_OPTIONS, values.imageArrangement, key, "slide-image-arrangement", ["single", "pair", "triptych", "collage", "divisions"])}
      ${renderSlideQuickOptionGroup("Recorte", "Como entra", SLIDE_IMAGE_FRAMING_OPTIONS, values.imageFraming, key, "slide-image-framing", ["clean", "zoom", "cropped", "blurred"])}
      ${renderSlideQuickOptionGroup("Fondo", "Degradado", SLIDE_BACKGROUND_OPTIONS, values.slideBackground, key, "slide-background", ["inherit", "pure-white", "warm-sand", "dark-luxury", "deep-forest", "aurora-pastel"])}
      ${renderSlideQuickOptionGroup("Tratamiento", "Estilo IA", SLIDE_RENDER_TREATMENT_OPTIONS, values.renderTreatment, key, "slide-render-treatment", ["master", "editorial", "warm", "moody", "linear", "technical"])}
    </div>
  `;
}

function renderSlideQuickOptionGroup(title, hint, options, currentValue, slideKey, dataName, allowedValues = null) {
  const allowed = allowedValues ? new Set(allowedValues) : null;
  const filtered = safeArray(options).filter((option) => !allowed || allowed.has(option.value));
  return `
    <div class="quick-editor-group">
      <div class="quick-editor-label">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(hint)}</span>
      </div>
      <div class="quick-editor-row">
        ${filtered.map((option) => `
          <button type="button" class="quick-editor-chip ${String(currentValue) === option.value ? "active" : ""}" data-${dataName}="${slideKey}" data-${dataName}-value="${option.value}" title="${escapeHtml(option.description || option.label)}">
            ${escapeHtml(option.label)}
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function buildSlideLivePreview(blueprint, config, slideText, isBoardSlide = false) {
  const layout = String(config.layout || blueprint.layout);
  const placement = String(config.imagePlacement || inferImagePlacement(layout));
  const aspect = String(config.imageAspect || inferImageAspect(layout));
  const size = String(config.imageSize || inferImageSize(layout));
  const zone = String(config.imageZone || inferImageZone(layout, placement));
  const arrangement = String(config.imageArrangement || inferImageArrangement(layout));
  const framing = String(config.imageFraming || inferImageFraming(layout));
  const background = String(config.slideBackground || "inherit");
  const visualMode = resolveSlideImageSourceMode(config);
  const previewImages = resolveSlidePreviewImages(config);
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  const recipe = resolveCanvaReferenceRecipe(styleProfile);
  const templateMode = slugify(recipe.mode || "canva-reference");
  const templateThumb = styleProfile.thumbnail || "";
  const themeStyle = [
    `--preview-paper:${recipe.paper || styleProfile.paper || "#f7f2ea"}`,
    `--preview-ink:${recipe.ink || styleProfile.ink || "#181512"}`,
    `--preview-accent:${recipe.accent || styleProfile.accent || "#8f6046"}`,
    `--preview-accent-2:${recipe.accent2 || colorMixHex(recipe.accent || styleProfile.accent || "#8f6046", "#ffffff", 0.38)}`,
  ].join(";");
  const title = sanitizeVisibleDeckText(config.customTitle || slideText.title || blueprint.title, blueprint.title);
  const subtitle = sanitizeVisibleDeckText(config.customSubtitle || slideText.subtitle || blueprint.subtitle, blueprint.subtitle || "");
  const bullets = normalizeDeckBullets((config.customBullets || "").split("\n")).length
    ? normalizeDeckBullets((config.customBullets || "").split("\n"))
    : normalizeDeckBullets(slideText.bullets);
  const mediaBlocks = buildLivePreviewMediaBlocks({
    layout,
    placement,
    aspect,
    size,
    zone,
    arrangement,
    framing,
    images: previewImages,
    hasProjectImage: Boolean(config.useProjectImages && previewImages.length),
    isBoardSlide,
    visualMode,
  });
  const textBlocks = buildLivePreviewTextBlocks(layout, placement, title, subtitle, bullets);

  return `
    <div class="live-slide-preview live-template-preview" data-template-mode="${escapeHtml(templateMode)}" style="${themeStyle}">
      <div class="live-preview-topbar">
        <span>Preview sin renderizar · ${escapeHtml(styleProfile.label || "Canva local")}</span>
        <strong>${escapeHtml(recipe.mode || "canva")} · ${escapeHtml(optionLabel(SLIDE_IMAGE_SIZE_OPTIONS, size))}</strong>
      </div>
      <div class="live-slide-canvas live-bg-${background} live-layout-${layout} live-template-${templateMode}">
        ${templateThumb ? `<img class="live-template-ghost" src="${escapeHtml(templateThumb)}" alt="" loading="lazy" aria-hidden="true" />` : ""}
        <span class="live-template-accent live-template-accent-a" aria-hidden="true"></span>
        <span class="live-template-accent live-template-accent-b" aria-hidden="true"></span>
        ${mediaBlocks}
        ${textBlocks}
        <span class="live-slide-safe-frame" aria-hidden="true"></span>
      </div>
      <div class="live-preview-footer">
        <span>${config.useProjectImages ? `${previewImages.length || 0} foto${previewImages.length === 1 ? "" : "s"} asignada${previewImages.length === 1 ? "" : "s"}` : "Board / recurso derivado"}</span>
        <span>${visualMode === "raw" ? "Usa foto cruda" : "Se renderizara al generar"} · ${escapeHtml(optionLabel(SLIDE_RENDER_TREATMENT_OPTIONS, config.renderTreatment || "master"))}</span>
      </div>
    </div>
  `;
}

function resolveSlidePreviewImages(config = {}) {
  let ids = safeArray(config.imageIds);
  if (!ids.length && state.mainId) ids = [state.mainId];
  return ids
    .map((id) => state.images.find((image) => image.id === id))
    .filter(Boolean)
    .map((image) => ({ id: image.id, name: image.name, url: image.url }));
}

function buildLivePreviewMediaBlocks(options) {
  const { layout, placement, aspect, size, zone, arrangement, framing, images, hasProjectImage, isBoardSlide, visualMode } = options;
  const featureLayout = resolveSlideLayoutForPlacement(layout, placement);
  const block = (rect, image, label = "") => buildLivePreviewMediaBlock(rect, image, {
    framing,
    label,
    hasProjectImage,
    isBoardSlide,
    visualMode,
  });

  if (featureLayout === "feature") {
    const frame = placement === "full"
      ? { x: 5, y: 8, width: 90, height: 84 }
      : { x: 51, y: 12, width: 42, height: 76 };
    return block(frame, images[0], hasProjectImage ? "Visual principal" : "Board");
  }

  if (featureLayout === "technical") {
    return block({ x: 7, y: 18, width: 48, height: 62 }, images[0], hasProjectImage ? "Plano / visual" : "Soporte");
  }

  if (featureLayout === "board" || featureLayout === "gallery" || arrangement === "collage") {
    const frames = [
      { x: 43, y: 13, width: 31, height: 34 },
      { x: 76, y: 14, width: 16, height: 24 },
      { x: 44, y: 53, width: 22, height: 28 },
      { x: 68, y: 48, width: 24, height: 38 },
    ];
    return frames.map((frame, index) => block(frame, images[index % Math.max(images.length, 1)], index === 0 ? "Collage" : "")).join("");
  }

  const imageRect = placement === "left"
    ? { x: 7, y: 18, width: 44, height: 64 }
    : placement === "right"
      ? { x: 49, y: 18, width: 44, height: 64 }
      : placement === "top"
        ? { x: 8, y: 13, width: 84, height: 34 }
        : placement === "bottom"
          ? { x: 8, y: 52, width: 84, height: 34 }
          : { x: 24, y: 18, width: 52, height: 62 };
  const scaled = scaleFrameByPreset(imageRect, size);
  const fitted = fitRectToAspect(scaled, aspect, zone || placement);
  return buildLivePreviewArrangementBlocks(arrangement, fitted, images, block);
}

function buildLivePreviewArrangementBlocks(arrangement, frame, images, block) {
  if (arrangement === "pair") {
    const left = { x: frame.x, y: frame.y, width: frame.width * 0.48, height: frame.height };
    const right = { x: frame.x + frame.width * 0.52, y: frame.y, width: frame.width * 0.48, height: frame.height };
    return `${block(left, images[0], "Foto A")}${block(right, images[1] || images[0], "Foto B")}`;
  }
  if (arrangement === "triptych") {
    const w = frame.width / 3.2;
    return [0, 1, 2].map((index) => block({
      x: frame.x + index * (w * 1.1),
      y: frame.y,
      width: w,
      height: frame.height,
    }, images[index] || images[0], `Corte ${index + 1}`)).join("");
  }
  if (arrangement === "divisions") {
    return [
      block({ x: frame.x, y: frame.y, width: frame.width * 0.6, height: frame.height * 0.58 }, images[0], "A"),
      block({ x: frame.x + frame.width * 0.64, y: frame.y, width: frame.width * 0.36, height: frame.height * 0.28 }, images[1] || images[0], "B"),
      block({ x: frame.x + frame.width * 0.64, y: frame.y + frame.height * 0.34, width: frame.width * 0.36, height: frame.height * 0.24 }, images[2] || images[0], "C"),
      block({ x: frame.x, y: frame.y + frame.height * 0.64, width: frame.width, height: frame.height * 0.36 }, images[3] || images[0], "D"),
    ].join("");
  }
  return block(frame, images[0], "Visual");
}

function buildLivePreviewMediaBlock(rect, image, options = {}) {
  const label = options.label || (options.hasProjectImage ? "Imagen" : "Board");
  const hasImage = Boolean(image?.url && options.hasProjectImage);
  const modeLabel = options.visualMode === "raw" ? "cruda" : "render";
  return `
    <span class="live-media-frame ${hasImage ? "has-image" : "is-placeholder"}" data-framing="${escapeHtml(options.framing || "clean")}" style="left:${rect.x}%;top:${rect.y}%;width:${rect.width}%;height:${rect.height}%;">
      ${hasImage ? `<img src="${image.url}" alt="${escapeHtml(image.name || label)}" loading="lazy" />` : `<span class="live-board-pattern"></span>`}
      <small>${escapeHtml(label)} · ${escapeHtml(modeLabel)}</small>
    </span>
  `;
}

function buildLivePreviewTextBlocks(layout, placement, title, subtitle, bullets) {
  const left = placement === "left";
  const full = placement === "full";
  const top = placement === "top";
  const bottom = placement === "bottom";
  const x = full ? 8 : left ? 58 : 8;
  const y = full ? 12 : bottom ? 14 : top ? 56 : 18;
  const width = full ? 36 : left ? 32 : top || bottom ? 46 : 34;
  return `
    <span class="live-text-stack" style="left:${x}%;top:${y}%;width:${width}%;">
      <small>${escapeHtml(layout.toUpperCase())}</small>
      <strong>${escapeHtml(title)}</strong>
      ${subtitle ? `<em>${escapeHtml(subtitle)}</em>` : ""}
      ${safeArray(bullets).slice(0, 3).map((bullet) => `<span>${escapeHtml(bullet)}</span>`).join("")}
    </span>
  `;
}

function buildSlideStructurePreview(blueprint, config) {
  const layout = String(config.layout || blueprint.layout);
  const placement = String(config.imagePlacement || inferImagePlacement(layout));
  const aspect = String(config.imageAspect || inferImageAspect(layout));
  const size = String(config.imageSize || inferImageSize(layout));
  const zone = String(config.imageZone || inferImageZone(layout, placement));
  const arrangement = String(config.imageArrangement || inferImageArrangement(layout));
  const visualMode = resolveSlideImageSourceMode(config);
  const blocks = buildSlideStructureBlocks(layout, placement, aspect, size, zone, arrangement, Boolean(config.useProjectImages));
  return `
    <div class="structure-preview-shell">
      <div class="structure-preview-topbar">
        <span>${escapeHtml(optionLabel(SLIDE_LAYOUT_OPTIONS, layout))}</span>
        <span>${escapeHtml(optionLabel(SLIDE_IMAGE_ASPECT_OPTIONS, aspect))} · ${escapeHtml(optionLabel(SLIDE_IMAGE_SIZE_OPTIONS, size))}</span>
      </div>
      <div class="structure-preview-canvas">
        ${blocks}
      </div>
      <div class="structure-preview-footer">
        <span>${config.useProjectImages ? "Con imagen del proyecto" : "Board / texto / recursos derivados"}</span>
        <span>${visualMode === "raw" ? "Foto cruda" : "Render base"} · ${escapeHtml(optionLabel(SLIDE_IMAGE_ARRANGEMENT_OPTIONS, arrangement))}</span>
      </div>
    </div>
  `;
}

function buildSlideStructureBlocks(layout, placement, aspect, size, zone, arrangement, hasProjectImage) {
  const imageLabel = hasProjectImage ? "Imagen" : "Board";
  const imageKind = hasProjectImage ? "image" : "board";
  const landscape = getAspectRatio(aspect) >= 1;
  const featureLayout = resolveSlideLayoutForPlacement(layout, placement);

  if (featureLayout === "feature") {
    return `
      <span class="structure-block structure-pill" style="left:8%;top:10%;width:24%;height:10%;"></span>
      <span class="structure-block structure-title" style="left:8%;top:24%;width:38%;height:9%;"></span>
      <span class="structure-block structure-copy" style="left:8%;top:38%;width:28%;height:6%;"></span>
      <span class="structure-block structure-copy" style="left:8%;top:47%;width:26%;height:6%;"></span>
      <span class="structure-block structure-${imageKind}" style="left:52%;top:12%;width:40%;height:74%;">${imageLabel}</span>
    `;
  }

  if (featureLayout === "technical") {
    return `
      <span class="structure-block structure-pill" style="left:8%;top:10%;width:20%;height:9%;"></span>
      <span class="structure-block structure-${imageKind}" style="left:8%;top:24%;width:48%;height:56%;">${imageLabel}</span>
      <span class="structure-block structure-grid" style="left:10%;top:28%;width:44%;height:48%;"></span>
      <span class="structure-block structure-title" style="left:62%;top:24%;width:24%;height:8%;"></span>
      <span class="structure-block structure-copy" style="left:62%;top:38%;width:24%;height:5%;"></span>
      <span class="structure-block structure-copy" style="left:62%;top:47%;width:20%;height:5%;"></span>
      <span class="structure-block structure-copy" style="left:62%;top:56%;width:22%;height:5%;"></span>
    `;
  }

  if (featureLayout === "board" || featureLayout === "gallery") {
    return `
      <span class="structure-block structure-pill" style="left:8%;top:10%;width:20%;height:9%;"></span>
      <span class="structure-block structure-title" style="left:8%;top:24%;width:28%;height:8%;"></span>
      <span class="structure-block structure-${imageKind}" style="left:46%;top:18%;width:28%;height:${landscape ? "24%" : "36%"};">${imageLabel}</span>
      <span class="structure-block structure-${imageKind}" style="left:76%;top:18%;width:16%;height:${landscape ? "18%" : "28%"};"></span>
      <span class="structure-block structure-${imageKind}" style="left:46%;top:48%;width:22%;height:${landscape ? "20%" : "30%"};"></span>
      <span class="structure-block structure-${imageKind}" style="left:70%;top:44%;width:22%;height:${landscape ? "28%" : "40%"};"></span>
      <span class="structure-block structure-copy" style="left:8%;top:40%;width:24%;height:5%;"></span>
      <span class="structure-block structure-copy" style="left:8%;top:49%;width:22%;height:5%;"></span>
      <span class="structure-block structure-copy" style="left:8%;top:58%;width:20%;height:5%;"></span>
    `;
  }

  const imageRect = placement === "left"
    ? { x: 8, y: 20, width: 44, height: 58 }
    : placement === "right"
      ? { x: 48, y: 20, width: 44, height: 58 }
      : placement === "top"
        ? { x: 8, y: 20, width: 84, height: 32 }
        : placement === "bottom"
          ? { x: 8, y: 48, width: 84, height: 32 }
          : { x: 24, y: 18, width: 52, height: 56 };
  const scaled = scaleFrameByPreset(imageRect, size);
  const fitted = fitRectToAspect(scaled, aspect, zone || placement);
  const arrangementBlocks = buildArrangementPreviewBlocks(arrangement, fitted, imageKind, imageLabel);

  return `
    <span class="structure-block structure-pill" style="left:8%;top:10%;width:20%;height:9%;"></span>
    <span class="structure-block structure-title" style="left:${placement === "left" ? "58%" : "8%"};top:24%;width:${placement === "left" ? "24%" : "30%"};height:8%;"></span>
    <span class="structure-block structure-copy" style="left:${placement === "left" ? "58%" : "8%"};top:38%;width:${placement === "left" ? "24%" : "26%"};height:5%;"></span>
    <span class="structure-block structure-copy" style="left:${placement === "left" ? "58%" : "8%"};top:47%;width:${placement === "left" ? "20%" : "22%"};height:5%;"></span>
    ${arrangementBlocks}
  `;
}

function buildArrangementPreviewBlocks(arrangement, frame, imageKind, imageLabel) {
  const block = (rect, label = "") => `<span class="structure-block structure-${imageKind}" style="left:${rect.x}%;top:${rect.y}%;width:${rect.width}%;height:${rect.height}%;">${escapeHtml(label)}</span>`;
  if (arrangement === "pair") {
    const left = { x: frame.x, y: frame.y, width: frame.width * 0.47, height: frame.height };
    const right = { x: frame.x + frame.width * 0.53, y: frame.y, width: frame.width * 0.47, height: frame.height };
    return `${block(left, "Foto A")}${block(right, "Foto B")}`;
  }
  if (arrangement === "triptych") {
    const w = frame.width / 3.25;
    return [
      { x: frame.x, y: frame.y, width: w, height: frame.height },
      { x: frame.x + w + 2, y: frame.y, width: w, height: frame.height },
      { x: frame.x + (w * 2) + 4, y: frame.y, width: w, height: frame.height },
    ].map((rect, index) => block(rect, `Panel ${index + 1}`)).join("");
  }
  if (arrangement === "duplicate" || arrangement === "mirror") {
    return `
      ${block({ x: frame.x + 2, y: frame.y + 3, width: frame.width, height: frame.height }, arrangement === "mirror" ? "Espejo" : "Base")}
      ${block({ x: frame.x - 2, y: frame.y - 3, width: frame.width, height: frame.height }, arrangement === "mirror" ? "Reflejo" : imageLabel)}
    `;
  }
  if (arrangement === "collage" || arrangement === "divisions") {
    return [
      { x: frame.x, y: frame.y, width: frame.width * 0.58, height: frame.height * 0.56 },
      { x: frame.x + frame.width * 0.62, y: frame.y, width: frame.width * 0.38, height: frame.height * 0.28 },
      { x: frame.x + frame.width * 0.62, y: frame.y + frame.height * 0.34, width: frame.width * 0.38, height: frame.height * 0.34 },
      { x: frame.x, y: frame.y + frame.height * 0.62, width: frame.width * 0.56, height: frame.height * 0.26 },
    ].map((rect, index) => block(rect, index === 0 ? imageLabel : "")).join("");
  }
  return block(frame, imageLabel);
}

function parseBulletText(value) {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\-\u2022]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 6);
}

function getSlideTextDraft(blueprint, analysis) {
  const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
  const suggested = buildSuggestedSlideCopy(blueprint, analysis);
  const title = (config.customTitle || "").trim() || suggested.title;
  const subtitle = (config.customSubtitle || "").trim() || suggested.subtitle;
  const manualBullets = parseBulletText(config.customBullets);
  const bullets = manualBullets.length ? manualBullets : suggested.bullets;
  return { ...suggested, title, subtitle, bullets: bullets.slice(0, 6) };
}

function buildSuggestedSlideCopy(blueprint, analysis) {
  const lang = state.settings.brochureLanguage || "es";
  const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
  const chosenMaterials = safeArray(config.materialHighlights).length ? safeArray(config.materialHighlights) : safeArray(analysis.materials).slice(0, 4);
  const chosenObjects = safeArray(config.objectHighlights).length ? safeArray(config.objectHighlights) : safeArray(analysis.objects).slice(0, 4);
  const palette = safeArray(state.settings.selectedPalette).length ? safeArray(state.settings.selectedPalette) : getSuggestedPalette(analysis);
  const context = (state.settings.contextBrief || "").trim();
  const projectName = deriveDeckTitle();
  const amenityName = blueprint.key.startsWith("amenity-") ? blueprint.title.replace(/^Amenidad · /, "") : blueprint.title;
  const tone = labelForDecision("pdfTone");
  const styleLabel = getBrochureTemplateGalleryEntry(state.settings.brochureStyle)?.label
    || optionLabel(BROCHURE_STYLE_OPTIONS, state.settings.brochureStyle);

  const library = {
    es: {
      cover: { tag: "Apertura", title: projectName, subtitle: "Brochure arquitectonico listo para presentar.", bullets: [labelForProjectType(), tone, styleLabel] },
      moodboard: { tag: "Mood board", title: "Direccion visual y atmosfera", subtitle: "Curaduria estetica a partir de materiales, objetos y tono del proyecto.", bullets: [...chosenMaterials.slice(0, 3), ...chosenObjects.slice(0, 3)] },
      pantone: { tag: "Paleta", title: "Sistema cromatico del brochure", subtitle: "Colores dominantes sugeridos desde los renders y la referencia.", bullets: palette.slice(0, 5) },
      idea: { tag: "Idea", title: "Idea rectora", subtitle: context || "Sintesis de la oportunidad y el mensaje principal del proyecto.", bullets: [labelForDecision("audience"), labelForDecision("narrative"), tone] },
      concept: { tag: "Concepto", title: "Concepto arquitectonico", subtitle: analysis.summary || "Los principios de composicion, caracter y experiencia del proyecto.", bullets: [...safeArray(analysis.composition).slice(0, 3), ...chosenMaterials.slice(0, 2)] },
      "who-we-are": { tag: "Estudio", title: "Quienes somos", subtitle: "Presentacion breve del equipo o estudio responsable.", bullets: ["Experiencia en arquitectura y visualizacion", "Criterio comercial y editorial", "Entrega clara para cliente"] },
      "what-we-do": { tag: "Servicios", title: "Que hacemos", subtitle: "Capacidades y tipo de acompanamiento que ofrece el equipo.", bullets: ["Renders y brochures arquitectonicos", "Curaduria visual y narrativa", "Presentaciones listas para uso humano"] },
      amenities: { tag: "Amenidad", title: blueprint.title, subtitle: `Lectura visual dedicada para ${amenityName}.`, bullets: [...chosenObjects.slice(0, 3), ...chosenMaterials.slice(0, 2)] },
      materials: { tag: "Materiales", title: "Materiales y tactilidad", subtitle: "Seleccion material que define el peso, tono y autenticidad del proyecto.", bullets: chosenMaterials.slice(0, 5) },
      "plan-2d": { tag: "Plano 2D", title: "Plano y lectura espacial", subtitle: "Slide tecnica para soportar la explicacion del proyecto.", bullets: [labelForDecision("plans"), ...safeArray(analysis.composition).slice(0, 3), ...safeArray(analysis.environment).slice(0, 2)] },
      renders: { tag: "Renders", title: "Visuales del proyecto", subtitle: "Escenas seleccionadas con distintos encuadres y tratamientos del mismo proyecto.", bullets: [labelForDecision("representationStyle"), labelForDecision("imageFinish"), labelForDecision("occupancy")] },
      site: { tag: "Sitio", title: "Sitio y entorno", subtitle: "Contexto inmediato, atmosfera y relacion interior-exterior.", bullets: safeArray(analysis.environment).slice(0, 5) },
      closing: { tag: "Cierre", title: "Cierre", subtitle: "Resumen listo para compartir y continuar la conversacion del proyecto.", bullets: ["Brochure descargable", "Narrativa editorial clara", "Siguiente paso sugerido para cliente"] },
    },
    en: {
      cover: { tag: "Opening", title: projectName, subtitle: "Architectural brochure prepared for presentation.", bullets: [labelForProjectType(), tone, styleLabel] },
      moodboard: { tag: "Mood board", title: "Visual direction and atmosphere", subtitle: "A curated board built from materials, objects, and the project's visual tone.", bullets: [...chosenMaterials.slice(0, 3), ...chosenObjects.slice(0, 3)] },
      pantone: { tag: "Palette", title: "Brochure color system", subtitle: "Dominant tones suggested from the renders and the base reference.", bullets: palette.slice(0, 5) },
      idea: { tag: "Idea", title: "Guiding idea", subtitle: context || "A concise statement of the opportunity and core message of the project.", bullets: [labelForDecision("audience"), labelForDecision("narrative"), tone] },
      concept: { tag: "Concept", title: "Architectural concept", subtitle: analysis.summary || "The principles of composition, character, and spatial experience behind the project.", bullets: [...safeArray(analysis.composition).slice(0, 3), ...chosenMaterials.slice(0, 2)] },
      "who-we-are": { tag: "Studio", title: "Who we are", subtitle: "A short introduction to the studio or team behind the project.", bullets: ["Architecture and visualization experience", "Commercial and editorial judgment", "Clear client-ready delivery"] },
      "what-we-do": { tag: "Services", title: "What we do", subtitle: "A clear overview of the team's core capabilities.", bullets: ["Architectural renders and brochures", "Visual curation and narrative", "Presentation-ready deliverables"] },
      amenities: { tag: "Amenity", title: blueprint.title, subtitle: `Dedicated visual reading for ${amenityName}.`, bullets: [...chosenObjects.slice(0, 3), ...chosenMaterials.slice(0, 2)] },
      materials: { tag: "Materials", title: "Material palette and tactility", subtitle: "The material family that defines weight, warmth, and authenticity.", bullets: chosenMaterials.slice(0, 5) },
      "plan-2d": { tag: "2D plan", title: "Plan and spatial reading", subtitle: "A technical page supporting the explanation of the project.", bullets: [labelForDecision("plans"), ...safeArray(analysis.composition).slice(0, 3), ...safeArray(analysis.environment).slice(0, 2)] },
      renders: { tag: "Renders", title: "Project visuals", subtitle: "Selected scenes with controlled framing and multiple visual treatments.", bullets: [labelForDecision("representationStyle"), labelForDecision("imageFinish"), labelForDecision("occupancy")] },
      site: { tag: "Site", title: "Site and context", subtitle: "Immediate context, atmosphere, and the interior-exterior relationship.", bullets: safeArray(analysis.environment).slice(0, 5) },
      closing: { tag: "Closing", title: "Closing", subtitle: "A concise ending page ready to share and continue the conversation.", bullets: ["Download-ready brochure", "Clear editorial narrative", "Suggested next step for the client"] },
    },
  };

  const set = library[lang] || library.es;
  return set[blueprint.sectionId] || {
    tag: lang === "en" ? `Section ${blueprint.title}` : `Seccion ${blueprint.title}`,
    title: blueprint.title,
    subtitle: blueprint.subtitle,
    bullets: chosenMaterials.slice(0, 3),
  };
}

function normalizeDeckSentence(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .trim();
}

function sanitizeVisibleDeckText(value, fallback = "") {
  const text = normalizeDeckSentence(value)
    .replace(/Ã¡/g, "á")
    .replace(/Ã©/g, "é")
    .replace(/Ã­/g, "í")
    .replace(/Ã³/g, "ó")
    .replace(/Ãº/g, "ú")
    .replace(/Ã±/g, "ñ")
    .replace(/Â/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  if (!text || isWeakDeckText(text)) return normalizeDeckSentence(fallback);
  return text;
}

function isWeakDeckText(value) {
  const text = normalizeDeckSentence(value).toLowerCase();
  if (!text) return true;
  if (/^(slide|pagina|p[aá]gina|page|section|seccion)\s*\d+/i.test(text)) return true;
  if (/[�□]/.test(text)) return true;
  if (/[^\w\s.,;:¿?¡!áéíóúñüÁÉÍÓÚÑÜ#&%/()+\-·'""]/i.test(text)) return true;
  if ((text.match(/[a-záéíóúñü]/gi) || []).length < Math.max(3, Math.min(10, text.length * 0.35))) return true;
  const letters = text.match(/[a-záéíóúñü]/gi) || [];
  const vowels = text.match(/[aeiouáéíóúü]/gi) || [];
  if (letters.length >= 18 && vowels.length / letters.length < 0.18) return true;
  const words = text.split(/\s+/).filter(Boolean);
  if (words.some((word) => word.length >= 18 && !/[aeiouáéíóúü]/i.test(word))) return true;
  if (/(?:\b[a-záéíóúñü]{1,2}\b\s*){6,}/i.test(text)) return true;
  if (/(.)\1{5,}/.test(text)) return true;
  return [
    "lorem ipsum",
    "placeholder",
    "texto aqui",
    "text here",
    "coming soon",
    "tbd",
    "n/a",
  ].some((entry) => text.includes(entry));
}

function normalizeDeckBullets(value) {
  const items = safeArray(value)
    .map((item) => sanitizeVisibleDeckText(normalizeDeckSentence(item).replace(/^[\-\u2022\d\.\)\(]+\s*/, ""), ""))
    .filter((item) => item && !isWeakDeckText(item));
  return unique(items).slice(0, 4);
}

function mergeAiDeckSlide(aiSlide, fallbackSlide, blueprint, index) {
  const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
  const fallback = normalizeSlide({
    ...(fallbackSlide || createSlideFromBlueprint(blueprint, getPdfDeckAnalysis(), index)),
    key: blueprint.key,
    sectionId: blueprint.sectionId,
    visualRole: blueprint.visualRole,
    layout: config.layout || blueprint.layout,
  }, index);
  const manualTextLocked = ["custom", "free"].includes(String(config.textMode || "suggested"));
  if (manualTextLocked) {
    return normalizeSlide({
      ...fallback,
      key: blueprint.key,
      sectionId: blueprint.sectionId,
      visualRole: blueprint.visualRole,
      layout: config.layout || blueprint.layout,
    }, index);
  }

  const aiTag = normalizeDeckSentence(aiSlide?.tag);
  const aiTitle = normalizeDeckSentence(aiSlide?.title);
  const aiSubtitle = normalizeDeckSentence(aiSlide?.subtitle);
  const aiBullets = normalizeDeckBullets(aiSlide?.bullets);

  const title = !isWeakDeckText(aiTitle) && aiTitle.length >= 3 && aiTitle.length <= 90
    ? aiTitle
    : fallback.title;
  const subtitle = !isWeakDeckText(aiSubtitle)
    && aiSubtitle.length >= 10
    && aiSubtitle.length <= 180
    && aiSubtitle.toLowerCase() !== title.toLowerCase()
      ? aiSubtitle
      : fallback.subtitle;
  const bullets = aiBullets.length >= 3 ? aiBullets : safeArray(fallback.bullets).slice(0, 4);

  return normalizeSlide({
    ...fallback,
    ...aiSlide,
    key: blueprint.key,
    sectionId: blueprint.sectionId,
    tag: !isWeakDeckText(aiTag) ? aiTag : fallback.tag,
    title,
    subtitle,
    bullets,
    visualRole: blueprint.visualRole,
    layout: state.settings.pdfSlideConfigs?.[blueprint.key]?.layout || blueprint.layout,
  }, index);
}

async function ensurePdfSourceAnalyses() {
  const items = safeArray(state.images);
  if (!items.length) return;
  if (items.some((image) => !image.analysis)) {
    state.generation.stage = "Cerrando descomposicion completa del proyecto...";
    renderAll();
    await runProjectAnalyses(false);
  }
}

function getPdfDeckAnalysis() {
  const analyses = safeArray(state.images)
    .map((image) => image.analysis)
    .filter(Boolean);
  const fallback = getMainImage()?.analysis || buildAnalysisFallback();
  if (!analyses.length) return fallback;

  return {
    ...fallback,
    summary: unique(analyses.map((entry) => String(entry?.summary || "").trim()).filter(Boolean)).slice(0, 3).join(" | ") || fallback.summary,
    objects: unique(analyses.flatMap((entry) => safeArray(entry?.objects))).slice(0, 18),
    texts: unique(analyses.flatMap((entry) => safeArray(entry?.texts))).slice(0, 14),
    materials: unique(analyses.flatMap((entry) => safeArray(entry?.materials))).slice(0, 14),
    environment: unique(analyses.flatMap((entry) => safeArray(entry?.environment))).slice(0, 14),
    composition: unique(analyses.flatMap((entry) => safeArray(entry?.composition))).slice(0, 10),
    realismRisks: unique(analyses.flatMap((entry) => safeArray(entry?.realismRisks))).slice(0, 10),
    palette: unique(analyses.flatMap((entry) => safeArray(entry?.palette))).slice(0, 6),
  };
}

function updatePromptText() {
  state.promptText = state.flow === "pdf" ? buildPdfBrief() : buildRenderPrompt();
  if (elements.internalPrompt) elements.internalPrompt.value = state.promptText;
}

function buildRenderPrompt() {
  const main = getMainImage();
  const analysis = main?.analysis || buildAnalysisFallback();
  const context = (state.settings.contextBrief || "").trim();
  const changeRequest = (state.settings.changeRequest || "").trim();
  const manualRegions = buildManualOverlaySummary(analysis);

  const lines = [
    `IMAGE-TO-IMAGE LOCKED TRANSFORMATION. Convert the attached architectural reference into the requested output style: ${buildStyleDescriptor()}.`,
    "Treat the input as approved final geometry, not inspiration. The image is a locked camera and a locked composition.",
    "NON-NEGOTIABLE: preserve camera, crop, perspective, geometry, object count, furniture placement, material identity, visible background, and all signage/text exactly. Do not redesign.",
  ];

  if (context) lines.push(`Project: ${context}`);
  if (changeRequest) lines.push(`Requested change: ${changeRequest}. Everything else stays locked.`);

  lines.push(`Lock: same geometry, composition, framing, camera angle, objects, signage, background.`);
  lines.push(buildGeometryLockDirective(analysis, Boolean(changeRequest)));
  lines.push("Resolve the whole image at the same quality level: foreground, midground, background, glass, signage, micro-objects, materials, and visible exterior.");
  lines.push(buildAiRoleAndSkillContract("render"));
  lines.push(buildRenderDecisionManifest());
  lines.push(buildStrictStyleDirective());

  const sceneDetails = [];
  if ((analysis.objects || []).length) sceneDetails.push(`Objects: ${analysis.objects.slice(0, 10).join(", ")}`);
  if ((analysis.texts || []).length) sceneDetails.push(`Text/signage (preserve verbatim): ${analysis.texts.slice(0, 8).join(", ")}`);
  if ((analysis.materials || []).length) sceneDetails.push(`Materials: ${analysis.materials.slice(0, 8).join(", ")}`);
  if ((analysis.environment || []).length) sceneDetails.push(`Environment: ${analysis.environment.slice(0, 6).join(", ")}`);
  if (sceneDetails.length) lines.push(`Scene: ${sceneDetails.join(". ")}.`);

  if ((analysis.realismRisks || []).length) lines.push(`Fix: ${analysis.realismRisks.slice(0, 5).join(", ")}.`);
  if (manualRegions) lines.push(`Manual annotations: ${manualRegions}.`);

  lines.push(buildOccupancyDirective());
  lines.push(buildRepresentationDirective());

  lines.push(buildVisualTreatmentLine());
  lines.push("Goal: premium real architectural photography, not a pretty CGI render. Real material weight, real glass behavior, realistic tonal separation, controlled highlights, physically credible depth.");

  return lines.filter(Boolean).join("\n");
}

function buildGeometryLockDirective(analysis = {}, hasChangeRequest = false) {
  const objects = safeArray(analysis.objects).slice(0, 14);
  const texts = safeArray(analysis.texts).slice(0, 10);
  const materials = safeArray(analysis.materials).slice(0, 10);
  const environment = safeArray(analysis.environment).slice(0, 8);
  return [
    "SOURCE IMAGE LOCK - READ THIS AS A HARD EDITING CONTRACT:",
    "- The FIRST attached image is canonical. Use it as a structural underlay, not as loose inspiration.",
    "- Keep the same silhouette map: rooflines, facade planes, wall openings, columns, beams, floor edges, furniture, fixtures, vegetation, horizon, mountain/volcano/background and all visible object positions.",
    "- Do not replace the architecture with a cleaner design. Do not create a new facade, new roof, new signs, new windows, new furniture, new landscape, new plaza, new people distribution, or a different commercial program.",
    "- Do not zoom, crop, pan, straighten beyond source, move camera, change focal feel, widen the scene, center it differently, or alter proportions.",
    "- Allowed edits are only visual-quality edits: photoreal materials, texture depth, lighting realism, glass/reflection behavior, tonal grading, contact shadows and micro-realism.",
    hasChangeRequest ? "- There is a user change request. Apply only that requested change and freeze every unrelated element." : "- There is no design change request. Therefore every architectural and object decision must remain unchanged.",
    objects.length ? `Locked object inventory includes: ${objects.join(", ")}.` : null,
    texts.length ? `Locked visible text/signage includes: ${texts.join(", ")}. Preserve exact wording and position, or keep that area visually unchanged if uncertain.` : null,
    materials.length ? `Locked material families include: ${materials.join(", ")}.` : null,
    environment.length ? `Locked environment/background includes: ${environment.join(", ")}.` : null,
    "FIDELITY BEATS BEAUTY. If a prettier result requires changing the scene, reject that change and keep the source structure.",
  ].filter(Boolean).join("\n");
}

function buildStyleDescriptor() {
  const parts = [
    getDecisionLabel("realism"),
    getDecisionLabel("imageMood"),
    getDecisionLabel("renderLanguage"),
    getDecisionLabel("representationStyle"),
    getDecisionLabel("imageFinish"),
  ].filter(Boolean);
  return parts.join(", ").toLowerCase() || "ultra-photorealistic, editorial";
}

function buildAiRoleAndSkillContract(mode = "render") {
  const modeRule = mode === "pdf-slide"
    ? "PDF SLIDE VISUAL ROLE: render only the image asset required for this configured brochure slide. Do not render unused project references, do not create a full deck, and do not add captions or graphic layout into the image."
    : "RENDER ROLE: return one final visual transformation of the selected reference, not a prompt, not options, not explanation, not a collage.";

  return [
    "RENDERAI INTERNAL ROLE + SKILL CONTRACT:",
    "- OpenAI/analysis layer reads objects, materials, visible text, composition, environment and risks. Treat that analysis as constraints for faithful generation, not as creative brainstorming.",
    "- Gemini/image layer must produce the visual result only. Its job is execution: render, image variant, mood board or material board depending on the target.",
    "- ArchViz precision skill is active: the source image is approved geometry, not inspiration. Fidelity beats beauty; precision beats creativity.",
    "- For render targets, the first attached image is a locked underlay. Never synthesize an alternate project that merely resembles it.",
    "- Rendering means improving realism on top of the same scene, not redesigning, restaging, extending, simplifying or replacing the scene.",
    "- User decisions override model taste: representation style, finish, light, lens, people count, palette and slide treatment must be obeyed exactly.",
    "- Existing signage/text must remain verbatim. Add no new words, fake letters, labels, logos, watermarks or decorative typography unless the selected deliverable explicitly asks for brochure text outside the image.",
    modeRule,
  ].join("\n");
}

function buildStrictStyleDirective(overrides = {}) {
  const representation = overrides.representationStyle || state.settings.representationStyle;
  const mood = overrides.imageMood || state.settings.imageMood;
  const language = overrides.renderLanguage || state.settings.renderLanguage;
  const finish = overrides.imageFinish || state.settings.imageFinish;
  const time = overrides.timeOfDay || state.settings.timeOfDay;
  const light = overrides.lightScenario || state.settings.lightScenario;
  const lens = overrides.lensProfile || state.settings.lensProfile;
  const weather = overrides.weatherAtmosphere || state.settings.weatherAtmosphere;

  const representationRules = {
    photographic: "OUTPUT STYLE MUST BE REAL ARCHITECTURAL PHOTOGRAPHY: natural optics, believable exposure, real material response, no CGI sheen.",
    "three-dimensional": "OUTPUT STYLE MUST BE PREMIUM 3D ARCHVIZ: polished physically based rendering, crisp edges, refined shadows, but still faithful to the source.",
    "linear-drawing": "OUTPUT STYLE MUST BE ARCHITECTURAL LINEAR DRAWING: clean contour hierarchy, precise black/graphite linework, controlled material hints, no photoreal textures.",
    "mixed-media": "OUTPUT STYLE MUST BE EDITORIAL MIXED MEDIA: faithful architectural base with tasteful collage/print sensibility, never changing the design.",
  };
  const moodRules = {
    bright: "TONALITY: bright refined image, clean whites, controlled highlights, open shadows, no washed-out flatness.",
    warm: "TONALITY: warm editorial hospitality grade, rich wood, natural stone warmth, premium commercial atmosphere.",
    moody: "TONALITY: dark elegant premium mood, deep blacks with detail, serious contrast, high-end hospitality atmosphere.",
    atmospheric: "TONALITY: atmospheric depth, subtle haze, layered light, tactile spatial depth, no fantasy effects.",
  };
  const languageRules = {
    photographic: "VISUAL LANGUAGE: must read as camera-captured architecture, not AI art, not concept art.",
    minimal: "VISUAL LANGUAGE: minimal refined, quiet composition, reduced noise, precise material clarity.",
    commercial: "VISUAL LANGUAGE: commercial premium, attractive for clients, polished but not fake.",
    luxury: "VISUAL LANGUAGE: warm luxury, hospitality high-end, rich material depth and sophisticated color grading.",
  };
  const finishRules = {
    crisp: "FINISH: sharp, clean, high-definition, natural microcontrast, no over-sharpening.",
    "filmic-grain": "FINISH: subtle editorial film grain and photographic texture, not noisy or dirty.",
    "soft-film": "FINISH: soft cinematic rolloff, gentle highlights, premium magazine atmosphere.",
    "contrast-rich": "FINISH: rich contrast, dense tonal separation, material weight and controlled highlights.",
  };
  const timeRules = {
    morning: "TIME/LIGHT: morning freshness, soft optimistic daylight, natural direction.",
    midday: "TIME/LIGHT: balanced midday clarity, neutral exposure, accurate colors.",
    "golden-hour": "TIME/LIGHT: golden hour warmth, long soft highlights, commercial hospitality glow.",
    "blue-hour": "TIME/LIGHT: blue hour balance, interior warmth against cool exterior, elegant contrast.",
    night: "TIME/LIGHT: night/interior protagonist, warm artificial light, controlled dark exterior.",
  };
  const lightRules = {
    natural: "LIGHTING: diffuse natural light, soft shadows, realistic global illumination.",
    mixed: "LIGHTING: mixed interior/exterior exposure, windows and interiors balanced, no blown highlights.",
    "warm-ambient": "LIGHTING: warm ambient hospitality light, believable fixtures and contact shadows.",
    directional: "LIGHTING: controlled directional light with clear shadow design, still physically credible.",
  };
  const lensRules = {
    "corrected-wide": "CAMERA FEEL: corrected wide architectural lens, verticals clean, no extra distortion.",
    "editorial-35": "CAMERA FEEL: 35mm editorial human perspective while preserving original camera/crop.",
    "detail-50": "CAMERA FEEL: 50mm material/detail sensibility without changing source framing.",
    "orthographic-feel": "CAMERA FEEL: controlled orthographic architectural precision without flattening the scene.",
  };
  const weatherRules = {
    clear: "ATMOSPHERE: clear clean air, crisp visibility, natural sky/exterior exactly as source.",
    overcast: "ATMOSPHERE: soft overcast diffusion, calm shadows, realistic exterior.",
    "humid-tropical": "ATMOSPHERE: subtle humid tropical air, natural vegetation richness, no invented jungle.",
    "mist-soft": "ATMOSPHERE: gentle soft mist only if compatible with the source, no invented background.",
  };

  return [
    representationRules[representation],
    moodRules[mood],
    languageRules[language],
    finishRules[finish],
    timeRules[time],
    lightRules[light],
    lensRules[lens],
    weatherRules[weather],
    "TEXT/SIGNAGE RULE: preserve visible words exactly as source. If text cannot be rendered reliably, keep the source text area visually unchanged rather than inventing letters.",
    "GEOMETRY DRIFT RULE: no new roof, facade, window rhythm, column spacing, landscape, mountain, furniture set, signage system, paving layout or object placement. Improve only realism and surface quality.",
  ].filter(Boolean).join("\n");
}

function buildRenderDecisionManifest(overrides = {}) {
  const keys = [
    "fidelity",
    "realism",
    "imageMood",
    "renderLanguage",
    "representationStyle",
    "imageFinish",
    "timeOfDay",
    "lightScenario",
    "cameraIntent",
    "lensProfile",
    "weatherAtmosphere",
    "occupancy",
    "detailPriority",
  ];
  const lines = keys.map((key) => {
    const value = overrides[key] || state.settings[key];
    const label = getDecisionLabel(key, value);
    const description = getDecisionDescription(key, value);
    if (!label && !description) return null;
    return `${key}: ${label}${description ? ` — ${description}` : ""}`;
  }).filter(Boolean);
  return [
    "USER DECISION MANIFEST - obey these selections exactly, do not override them creatively:",
    ...lines,
  ].join("\n");
}

function buildVisualTreatmentLine() {
  const treatments = [];
  const mood = state.settings.imageMood;
  const finish = state.settings.imageFinish;
  const lens = state.settings.lensProfile;
  const weather = state.settings.weatherAtmosphere;
  const time = state.settings.timeOfDay;
  const light = state.settings.lightScenario;
  const priority = state.settings.detailPriority;

  if (time !== "midday") treatments.push(`${labelForDecision("timeOfDay")} lighting`);
  if (light !== "natural") treatments.push(`${labelForDecision("lightScenario")}`);
  if (mood === "moody") treatments.push("deep shadows, rich tones");
  else if (mood === "warm") treatments.push("warm color grading");
  else if (mood === "atmospheric") treatments.push("atmospheric depth");
  if (finish === "filmic-grain") treatments.push("subtle film grain");
  else if (finish === "soft-film") treatments.push("soft cinematic focus");
  else if (finish === "contrast-rich") treatments.push("rich contrast");
  if (lens === "editorial-35") treatments.push("35mm editorial perspective");
  else if (lens === "detail-50") treatments.push("50mm material detail");
  if (weather === "humid-tropical") treatments.push("humid tropical atmosphere");
  else if (weather === "overcast") treatments.push("soft overcast diffusion");
  else if (weather === "mist-soft") treatments.push("gentle atmospheric haze");
  if (priority === "glass-text") treatments.push("maximize glass clarity and text legibility");
  else if (priority === "materials") treatments.push("maximize material tactility and depth");

  if (!treatments.length) return "Deliver physically credible materials, real glass reflections, controlled contrast, zero CGI look.";
  return `Treatment: ${treatments.join(", ")}. Zero CGI look, real material weight, credible glass, controlled contrast.`;
}

function buildTemplateReferenceBlock() {
  const brochureTemplate = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  if (!brochureTemplate) return null;
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  const palette = [styleProfile.paper, styleProfile.ink, styleProfile.accent].filter(Boolean);
  const absThumb = brochureTemplate.thumbnail
    ? (typeof window !== "undefined" && window.location
        ? new URL(brochureTemplate.thumbnail, window.location.href).href
        : brochureTemplate.thumbnail)
    : "";
  return {
    label: brochureTemplate.label || "",
    description: brochureTemplate.description || "",
    collection: brochureTemplate.collection || "",
    thumbnailPath: brochureTemplate.thumbnail || "",
    thumbnailUrl: absThumb,
    canvaId: brochureTemplate.canvaId || "",
    canvaUrl: brochureTemplate.canvaUrl || "",
    paletteHints: palette,
    family: styleProfile.family || "",
    variant: styleProfile.variant || "",
    density: styleProfile.density || "",
    frame: styleProfile.frame || "",
    ornament: styleProfile.ornament || "",
  };
}

function buildPdfBrief() {
  const main = getMainImage();
  const analysis = getPdfDeckAnalysis();
  const context = (state.settings.contextBrief || "").trim();
  const changeRequest = (state.settings.changeRequest || "").trim();
  const blueprints = computePdfSlideBlueprints();
  const sections = blueprints.map((b) => b.title).join(", ");
  const palette = (state.settings.selectedPalette || []).join(", ");
  const language = state.settings.brochureLanguage === "en" ? "English" : "Spanish";
  const brochureTemplate = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const templateRef = buildTemplateReferenceBlock();

  const lines = [
    `Create an architectural brochure in ${language}. Type: ${labelForProjectType()}. Audience: ${labelForDecision("audience")}. ${blueprints.length} pages.`,
    context ? `Project: ${context}` : null,
    `Tone: ${labelForDecision("pdfTone")}. Narrative: ${labelForDecision("narrative")}. Cover: ${labelForDecision("coverStyle")}. Density: ${labelForDecision("visualDensity")}. Brochure style: ${brochureTemplate?.label || optionLabel(BROCHURE_STYLE_OPTIONS, state.settings.brochureStyle)}.`,
    templateRef ? `VISUAL TEMPLATE REFERENCE (must be respected as the aesthetic base of the brochure):` : null,
    templateRef ? `  • Template: ${templateRef.label} — ${templateRef.description}` : null,
    templateRef ? `  • Collection: ${templateRef.collection} · Family: ${templateRef.family} · Variant: ${templateRef.variant}` : null,
    templateRef?.thumbnailUrl ? `  • Thumbnail reference image (visual base): ${templateRef.thumbnailUrl}` : null,
    templateRef?.canvaUrl ? `  • Canva source: ${templateRef.canvaUrl}` : null,
    templateRef?.paletteHints?.length ? `  • Template palette hints (paper/ink/accent): ${templateRef.paletteHints.join(", ")}` : null,
    templateRef ? `  • Slides must inherit this template's palette, layout direction, typographic vibe, whitespace, and grid rhythm.` : null,
    `Visual: ${labelForDecision("renderLanguage")}, ${labelForDecision("imageMood")}, ${labelForDecision("timeOfDay")}, ${labelForDecision("lightScenario")}.`,
    palette ? `Palette: ${palette}` : null,
    `Images: ${state.settings.pdfImageMode === "rendered" ? "render project photos before layout" : "use raw project photos"}.`,
    (analysis.materials || []).length ? `Materials: ${analysis.materials.slice(0, 6).join(", ")}` : null,
    sections ? `Sections: ${sections}` : null,
    (() => {
      const layouts = state.settings.pdfSlideLayouts || {};
      const entries = Object.entries(layouts).filter(([, v]) => v);
      return entries.length ? `Per-slide layout picks: ${entries.map(([k, v]) => `${k}=${v}`).join(", ")}` : null;
    })(),
    (() => {
      const prompts = state.settings.pdfPerImagePrompts || {};
      const rows = [];
      Object.entries(prompts).forEach(([slideKey, byImage]) => {
        Object.entries(byImage || {}).forEach(([imgId, entry]) => {
          if (!entry) return;
          const parts = [];
          if (entry.style) parts.push(`style=${entry.style}`);
          if (entry.prompt) parts.push(`prompt="${entry.prompt}"`);
          if (parts.length) rows.push(`${slideKey}/${imgId}: ${parts.join(" ")}`);
        });
      });
      return rows.length ? `Per-image overrides: ${rows.join(" | ")}` : null;
    })(),
    changeRequest ? `Change: ${changeRequest}` : null,
    `Output: editorial, commercial architecture deck. Mood boards, hero renders, curated Pinterest-style layouts, minimal high-value text. Title font: ${state.settings.titleFont}. Body font: ${state.settings.bodyFont}.`,
  ];
  return lines.filter(Boolean).join("\n");
}

function buildOccupancyDirective() {
  return buildOccupancyDirectiveForValue(state.settings.occupancy);
}

function buildRepresentationDirective() {
  const representation = state.settings.representationStyle;
  if (representation === "linear-drawing") return "STYLE: Architectural line drawing, precise contours, suggested materials, geometry locked. Not a photograph.";
  if (representation === "three-dimensional") return "STYLE: Premium 3D architectural render, physically credible, refined materials, controlled lighting.";
  if (representation === "mixed-media") return "STYLE: Editorial mixed-media, architectural fidelity with brochure sensibility.";
  return "STYLE: Real architectural photograph, premium editorial, must not read as CGI.";
}

function buildManualOverlaySummary(analysis) {
  const manualEntries = safeArray(analysis?.overlay).filter((entry) => entry.manual);
  if (!manualEntries.length) return "";
  return manualEntries
    .slice(0, 12)
    .map((entry) => `${entry.label} en ${describeRegion(entry)}`)
    .join("; ");
}

function labelForDecision(key) {
  return getDecisionLabel(key);
}

function labelForProjectType() {
  return PROJECT_TYPE_OPTIONS.find((option) => option.value === state.settings.projectType)?.label || state.settings.projectType;
}

async function handleGenerateResult(forceRegenerate = false) {
  if (state.generation.busy) return;
  if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;
  if (state.flow === "pdf" && (!validateStep(4) || !validateStep(5))) return;

  state.currentStep = state.flow === "pdf" ? 6 : 4;
  state.generation.busy = true;
  state.generation.kind = state.flow;
  state.generation.stage = state.flow === "pdf" ? "Generando visuales y armando deck..." : "Generando render final...";
  renderAll();

  try {
    if (state.flow === "pdf") await generatePdfDeck(forceRegenerate);
    else await generateRenderResult(forceRegenerate);
  } catch (error) {
    toast(`No se pudo completar la salida: ${error.message || "error desconocido"}`, "error");
  } finally {
    state.generation.busy = false;
    state.generation.kind = null;
    state.generation.stage = "";
    renderAll();
  }
}

async function generateRenderResult() {
  const main = getMainImage();
  if (!main) {
    toast("Necesitas una imagen principal antes de generar.", "warn");
    return;
  }
  if (!main.analysis) {
    await runMainAnalysis(false);
  }

  state.generation.stage = "Procesando render con la escena bloqueada...";
  renderAll();

  let output = null;
  let aiRenderError = null;
  if (state.server.aiReady) {
    try {
      output = await requestAiRender(main, {
        prompt: buildRenderPrompt(),
        size: pickImageSize(main),
        profile: getRenderRequestProfile(),
      });
    } catch (error) {
      aiRenderError = error;
    }
  }
  if (state.server.aiReady && !output) {
    throw new Error(`Render IA no respondio: ${aiRenderError?.message || "sin detalle del proveedor"}`);
  }
  if (output?.source && output.source !== "local") {
    const occupancyCheck = await validateRenderOccupancy(output.url);
    if (!occupancyCheck.valid) {
      state.generation.stage = occupancyCheck.message;
      renderAll();
      output = await requestAiRender(main, {
        prompt: `${buildRenderPrompt()}\nCORRECCION OBLIGATORIA DE PERSONAS: ${occupancyCheck.retryInstruction}`,
        size: pickImageSize(main),
        profile: getRenderRequestProfile(),
      }).catch(() => output);
    }
  }
  if (!output) output = await buildLocalRenderFallback(main);

  const result = {
    id: cryptoRandom(),
    url: output.url,
    source: output.source,
    createdAt: new Date().toISOString(),
    title: output.source === "gemini" ? "Render Gemini" : output.source === "openai" ? "Render OpenAI" : "Render local",
  };
  state.result.render = result;
  state.result.renderHistory = [result, ...state.result.renderHistory.filter((entry) => entry.id !== result.id)].slice(0, 6);
  toast(output.source !== "local" ? `Imagen generada con ${output.source === "gemini" ? "Gemini" : "OpenAI"}.` : "La IA no respondio; se genero una salida local de respaldo.", output.source !== "local" ? "ok" : "warn");
}

async function generatePdfDeck() {
  const main = getMainImage();
  if (main && !main.analysis) {
    await runMainAnalysis(false);
  }

  state.generation.stage = "Leyendo referencias del proyecto...";
  renderAll();
  await ensurePdfSourceAnalyses();

  state.generation.stage = "Construyendo narrativa del deck...";
  const deck = state.server.analysisReady
    ? await requestAiDeck().catch(() => buildLocalDeck())
    : buildLocalDeck();

  state.generation.stage = "Preparando visuales base del brochure...";
  const projectVisuals = await buildPdfProjectVisuals(main);

  state.generation.stage = "Generando kit visual del PDF...";
  const visualKit = state.server.aiReady
    ? await buildAiDeckVisualKit(main, projectVisuals).catch(() => buildLocalDeckVisualKit(main, projectVisuals))
    : await buildLocalDeckVisualKit(main, projectVisuals);

  const slides = await assignDeckVisuals(deck.slides, visualKit, main, projectVisuals);
  state.generation.stage = "Componiendo laminas editoriales del brochure...";
  renderAll();
  const composedSlides = await composeDeckSlides(slides, deck.title || deriveDeckTitle());
  state.result.deck = {
    ...deck,
    slides: composedSlides,
    visuals: visualKit,
    projectVisuals,
    createdAt: new Date().toISOString(),
  };
  toast("Deck preparado para exportacion.", "ok");
}

async function requestAiRender(main, options = {}) {
  const profile = options.profile || getRenderRequestProfile();
  const sourceImages = safeArray(options.images).length ? safeArray(options.images) : [main.url];
  const response = await apiRequest("/api/generate-render-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: options.prompt || buildRenderPrompt(),
      size: options.size || pickImageSize(main),
      images: sourceImages,
      quality: profile.quality,
      inputFidelity: profile.inputFidelity,
      providerPreference: profile.providerPreference || "auto",
      strictFidelity: profile.strictFidelity === true,
      outputFormat: "jpeg",
      outputCompression: profile.outputCompression,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok || !payload.imageBase64) throw new Error(payload.message || `Status ${response.status}`);
  const mimeType = payload.mimeType || "image/jpeg";
  return { url: `data:${mimeType};base64,${payload.imageBase64}`, source: payload.provider || "openai" };
}

async function requestAiAnalysis(main) {
  const response = await apiRequest("/api/analyze-reference", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      flow: state.flow,
      image: main.url,
      context: state.settings.contextBrief,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok || !payload.analysis) throw new Error(payload.message || `Status ${response.status}`);
  return normalizeAnalysisFromApi(payload.analysis);
}

async function requestAiDeck() {
  const blueprints = computePdfSlideBlueprints();
  const projectAnalysis = getPdfDeckAnalysis();
  const response = await apiRequest("/api/generate-presentation-outline", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: state.settings.contextBrief,
      analysis: projectAnalysis,
      settings: pickDeckSettings(),
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok || !payload.outline) throw new Error(payload.message || `Status ${response.status}`);
  const outlineSlides = safeArray(payload.outline.slides);
  const localSlides = buildLocalDeck().slides;
  const slides = blueprints.map((blueprint, index) => {
    const aiSlide = outlineSlides[index] || localSlides[index] || createSlideFromBlueprint(blueprint, getMainImage()?.analysis || buildAnalysisFallback(), index);
    return mergeAiDeckSlide(aiSlide, localSlides[index], blueprint, index);
  });
  return {
    title: payload.outline.title || deriveDeckTitle(),
    summary: payload.outline.summary || buildPdfBrief(),
    slides,
    source: "openai",
  };
}

function buildRenderTargetDescriptors(renderTargets) {
  const imagesById = Object.fromEntries(safeArray(state.images).map((image) => [image.id, image]));
  const idToRefIndex = {};
  const renderedIds = Array.from(collectPdfRenderedImageIds(safeArray(state.images)));
  renderedIds.forEach((id, index) => { idToRefIndex[id] = index + 1; });

  return safeArray(renderTargets).map((target) => {
    const blueprint = target.blueprint || {};
    const config = target.config || {};
    const image = imagesById[target.imageId] || null;
    return {
      targetKey: target.key,
      slideKey: target.slideKey,
      slideTitle: blueprint.title || "",
      sectionId: blueprint.sectionId || "",
      layout: config.layout || blueprint.layout || "",
      imageId: target.imageId,
      imageName: image?.name || `Foto ${idToRefIndex[target.imageId] || "?"}`,
      imageRefIndex: idToRefIndex[target.imageId] || null,
      framing: config.imageFraming || "",
      treatment: config.renderTreatment || "master",
      representation: config.imageRepresentation || "inherit",
      finish: config.imageFinish || "inherit",
      occupancy: config.imageOccupancy || "inherit",
      aspect: config.imageAspect || "",
    };
  });
}

async function requestAiRenderPromptsForTargets(renderTargets) {
  const descriptors = buildRenderTargetDescriptors(renderTargets);
  if (!descriptors.length) return {};
  const deckSettings = pickDeckSettings();
  const settingsPayload = {
    brochureLanguage: deckSettings.brochureLanguage,
    projectType: deckSettings.projectType,
    imageMood: deckSettings.imageMood,
    timeOfDay: deckSettings.timeOfDay,
    lightScenario: deckSettings.lightScenario,
    weatherAtmosphere: deckSettings.weatherAtmosphere,
    occupancy: deckSettings.occupancy,
    representationStyle: deckSettings.representationStyle,
    imageFinish: deckSettings.imageFinish,
    lensProfile: deckSettings.lensProfile,
    renderedImageRefs: deckSettings.renderedImageRefs,
    contextImageRefs: deckSettings.contextImageRefs,
    renderTargets: descriptors,
  };
  const response = await apiRequest("/api/generate-render-prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: state.settings.contextBrief,
      settings: settingsPayload,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || `Status ${response.status}`);
  const rawPrompts = safeArray(payload.prompts?.prompts);
  const byKey = {};
  rawPrompts.forEach((entry) => {
    if (!entry || !entry.targetKey) return;
    byKey[entry.targetKey] = {
      geminiPrompt: String(entry.geminiPrompt || "").trim(),
      negativePrompt: String(entry.negativePrompt || "").trim(),
      cameraNotes: String(entry.cameraNotes || "").trim(),
      materialsToPreserve: safeArray(entry.materialsToPreserve),
      textsToPreserve: safeArray(entry.textsToPreserve),
    };
  });
  return byKey;
}

async function requestAiBoardPromptsForTargets(boardTargets) {
  if (!safeArray(boardTargets).length) return {};
  const deckSettings = pickDeckSettings();
  const settingsPayload = {
    brochureLanguage: deckSettings.brochureLanguage,
    projectType: deckSettings.projectType,
    selectedPalette: deckSettings.selectedPalette,
    renderedImageRefs: deckSettings.renderedImageRefs,
    contextImageRefs: deckSettings.contextImageRefs,
    boardTargets,
  };
  const response = await apiRequest("/api/generate-board-prompts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      context: state.settings.contextBrief,
      settings: settingsPayload,
    }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.ok) throw new Error(payload.message || `Status ${response.status}`);
  const rawPrompts = safeArray(payload.prompts?.prompts);
  const byKey = {};
  rawPrompts.forEach((entry) => {
    if (!entry || !entry.targetKey) return;
    byKey[entry.targetKey] = {
      kind: String(entry.kind || "").trim(),
      geminiPrompt: String(entry.geminiPrompt || "").trim(),
      keywords: safeArray(entry.keywords),
      materials: safeArray(entry.materials),
    };
  });
  return byKey;
}

function collectPdfBoardTargets() {
  const blueprints = computePdfSlideBlueprints();
  return blueprints
    .map((blueprint) => {
      const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
      const layout = config.layout || blueprint.layout;
      const role = blueprint.visualRole || "";
      const isBoard = layout === "board"
        || role === "moodboard"
        || role === "materials"
        || role === "palette"
        || ["moodboard", "materials", "pantone"].includes(blueprint.sectionId);
      if (!isBoard) return null;
      const kind = role === "materials" || blueprint.sectionId === "materials"
        ? "materials"
        : role === "palette" || blueprint.sectionId === "pantone"
          ? "palette"
          : "mood-board";
      return {
        targetKey: `board::${blueprint.key}`,
        slideKey: blueprint.key,
        sectionId: blueprint.sectionId,
        slideTitle: blueprint.title || blueprint.sectionLabel || blueprint.sectionId,
        kind,
        layout,
        moodBoardLayout: config.moodBoardLayout || inferMoodBoardLayout(blueprint),
        materialHighlights: safeArray(config.materialHighlights),
        objectHighlights: safeArray(config.objectHighlights),
        moodSources: safeArray(config.moodSources),
      };
    })
    .filter(Boolean)
    .slice(0, 4);
}

function collectPdfRenderedImageIds(items) {
  return new Set(collectPdfRenderTargets(items).map((target) => target.imageId));
}

function collectPdfRenderTargets(items) {
  const targets = [];
  const seen = new Set();
  const images = safeArray(items);
  const byId = new Set(images.map((image) => image.id));
  const blueprints = computePdfSlideBlueprints();

  blueprints.forEach((blueprint) => {
    const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
    if (!blueprint.allowProjectImages || !config.useProjectImages) return;
    const sourceMode = resolveSlideImageSourceMode(config);
    if (sourceMode !== "rendered") return;
    const selected = safeArray(config.imageIds).filter((id) => byId.has(id));
    if (selected.length) {
      selected.forEach((id) => {
        const key = `${blueprint.key}::${id}`;
        if (seen.has(key)) return;
        seen.add(key);
        targets.push({ key, slideKey: blueprint.key, imageId: id, blueprint, config });
      });
      return;
    }
    if (state.mainId && byId.has(state.mainId)) {
      const key = `${blueprint.key}::${state.mainId}`;
      if (!seen.has(key)) {
        seen.add(key);
        targets.push({ key, slideKey: blueprint.key, imageId: state.mainId, blueprint, config });
      }
    }
  });

  return targets;
}

function resolveProjectImageUrl(imageId, projectVisuals, mode, slideKey = "") {
  if (!imageId) return "";
  if (mode !== "raw" && slideKey) {
    const useKey = `${slideKey}::${imageId}`;
    if (projectVisuals?.renderedByUse?.[useKey]) return projectVisuals.renderedByUse[useKey];
  }
  if (mode === "raw") {
    return projectVisuals?.rawById?.[imageId]
      || projectVisuals?.renderedById?.[imageId]
      || projectVisuals?.byId?.[imageId]
      || "";
  }
  return projectVisuals?.renderedById?.[imageId]
    || projectVisuals?.rawById?.[imageId]
    || projectVisuals?.byId?.[imageId]
    || "";
}

function resolveProjectImageList(projectVisuals, mode) {
  const preferred = mode === "raw"
    ? safeArray(projectVisuals?.orderedRawUrls)
    : safeArray(projectVisuals?.orderedRenderedUrls).length
      ? safeArray(projectVisuals?.orderedRenderedUrls)
      : safeArray(projectVisuals?.orderedRawUrls);
  return preferred.filter(Boolean);
}

async function buildPdfProjectVisuals(main) {
  const items = safeArray(state.images);
  const rawMap = Object.fromEntries(items.map((image) => [image.id, image.url]));
  if (!items.length) {
      return {
        mode: "raw",
        renderedProvider: "local",
        rawById: rawMap,
        renderedById: {},
      renderedByUse: {},
      byId: rawMap,
      orderedUrls: main?.url ? [main.url] : [],
      orderedRawUrls: main?.url ? [main.url] : [],
      orderedRenderedUrls: [],
    };
  }

  const renderIds = collectPdfRenderedImageIds(items);
  const renderTargets = collectPdfRenderTargets(items);
  if (!renderIds.size) {
    return {
      mode: "raw",
      renderedProvider: "local",
      rawById: rawMap,
      renderedById: {},
      renderedByUse: {},
      byId: rawMap,
      orderedUrls: items.map((image) => image.url),
      orderedRawUrls: items.map((image) => image.url),
      orderedRenderedUrls: [],
    };
  }

  if (!state.server.aiReady) {
    const fallbackMap = {};
    const fallbackByUse = {};
    for (let index = 0; index < renderTargets.length; index += 1) {
      const target = renderTargets[index];
      const image = items.find((entry) => entry.id === target.imageId);
      if (!image) continue;
      state.generation.stage = `Preparando visual ${index + 1} de ${renderTargets.length} para el brochure...`;
      renderAll();
      const fallback = await buildLocalRenderFallback(image);
      fallbackByUse[target.key] = fallback.url;
      if (!fallbackMap[image.id]) fallbackMap[image.id] = fallback.url;
    }
    const mergedMap = { ...rawMap, ...fallbackMap };
    return {
      mode: "local-rendered",
      renderedProvider: "local",
      rawById: rawMap,
      renderedById: fallbackMap,
      renderedByUse: fallbackByUse,
      byId: mergedMap,
      orderedUrls: items.map((image) => mergedMap[image.id] || image.url),
      orderedRawUrls: items.map((image) => image.url),
      orderedRenderedUrls: items.map((image) => fallbackMap[image.id]).filter(Boolean),
    };
  }

  state.generation.stage = `Pidiendo prompts por imagen a ChatGPT...`;
  renderAll();
  const aiPromptByTarget = await requestAiRenderPromptsForTargets(renderTargets).catch((error) => {
    console.warn("generate-render-prompts fallo, se usara prompt local", error);
    return {};
  });

  const renderedMap = {};
  const renderedByUse = {};
  let renderedProvider = state.server.renderProvider || "openai";
  for (let index = 0; index < renderTargets.length; index += 1) {
    const target = renderTargets[index];
    const image = items.find((entry) => entry.id === target.imageId);
    if (!image) continue;
    state.generation.stage = `Renderizando visual ${index + 1} de ${renderTargets.length} para el brochure...`;
    renderAll();
    const aiPromptEntry = aiPromptByTarget[target.key];
    const basePrompt = aiPromptEntry?.geminiPrompt || buildPdfProjectRenderPrompt(image, target.blueprint, target.config);
    const promptParts = [basePrompt, buildGeometryLockDirective(image.analysis || getPdfDeckAnalysis(), false)];
    if (aiPromptEntry?.cameraNotes) promptParts.push(`Camera: ${aiPromptEntry.cameraNotes}`);
    if (aiPromptEntry?.materialsToPreserve?.length) {
      promptParts.push(`Materials to preserve verbatim: ${aiPromptEntry.materialsToPreserve.join("; ")}`);
    }
    if (aiPromptEntry?.textsToPreserve?.length) {
      promptParts.push(`Signage/text to preserve verbatim: ${aiPromptEntry.textsToPreserve.join("; ")}`);
    }
    if (aiPromptEntry?.negativePrompt) promptParts.push(`Avoid: ${aiPromptEntry.negativePrompt}`);
    const finalPrompt = promptParts.filter(Boolean).join("\n");
    const rendered = await requestAiRender(image, {
      prompt: finalPrompt,
      size: pickImageSize(image),
      images: [image.url],
      profile: { quality: "high", inputFidelity: "high", outputCompression: 95, providerPreference: "auto-strict", strictFidelity: true },
    }).catch(() => null);
    if (rendered?.source) renderedProvider = rendered.source;
    const outputUrl = rendered?.url || image.url;
    renderedByUse[target.key] = outputUrl;
    if (!renderedMap[image.id]) renderedMap[image.id] = outputUrl;
  }

  const mergedMap = { ...rawMap, ...renderedMap };
  return {
    mode: "rendered",
    renderedProvider,
    rawById: rawMap,
    renderedById: renderedMap,
    renderedByUse,
    byId: mergedMap,
    orderedUrls: items.map((image) => mergedMap[image.id] || image.url),
    orderedRawUrls: items.map((image) => image.url),
    orderedRenderedUrls: items.map((image) => renderedMap[image.id]).filter(Boolean),
  };
}

function buildPdfProjectRenderPrompt(image, blueprint = null, config = {}) {
  const analysis = image?.analysis || getPdfDeckAnalysis();
  const context = (state.settings.contextBrief || "").trim();
  const representation = config.imageRepresentation && config.imageRepresentation !== "inherit" ? config.imageRepresentation : state.settings.representationStyle;
  const finish = config.imageFinish && config.imageFinish !== "inherit" ? config.imageFinish : state.settings.imageFinish;
  const occupancy = config.imageOccupancy && config.imageOccupancy !== "inherit" ? config.imageOccupancy : state.settings.occupancy;
  const renderTreatment = config.renderTreatment || "master";
  const slideLabel = blueprint?.title || blueprint?.sectionId || "brochure slide";
  const lines = [
    `Render target: ${slideLabel}. IMAGE-TO-IMAGE LOCKED TRANSFORMATION. Convert this exact reference into a premium brochure visual using the requested style.`,
    "The first attached image is canonical. Keep same geometry, crop, camera, facade, openings, rooflines, objects, signage, landscape/background and composition.",
  ];
  if (context) lines.push(`Project: ${context}`);
  const details = [];
  if ((analysis.materials || []).length) details.push(`Materials: ${analysis.materials.slice(0, 6).join(", ")}`);
  if ((analysis.texts || []).length) details.push(`Text: ${analysis.texts.slice(0, 5).join(", ")}`);
  if (details.length) lines.push(details.join(". ") + ".");
  lines.push(buildGeometryLockDirective(analysis, false));
  lines.push(buildAiRoleAndSkillContract("pdf-slide"));
  lines.push(buildRenderDecisionManifest({
    representationStyle: representation,
    imageFinish: finish,
  }));
  lines.push(buildStrictStyleDirective({ representationStyle: representation, imageFinish: finish }));
  lines.push(buildOccupancyDirectiveForValue(occupancy));
  lines.push(buildSlideRenderTreatmentDirective(renderTreatment, config));
  lines.push(buildVisualTreatmentLine());
  lines.push("Fidelity priority: do not add furniture, do not remove objects, do not invent architecture, do not distort signs, do not replace the project with an alternate design. If a sign/text is visible, preserve it exactly or keep that source area visually unchanged.");
  return lines.filter(Boolean).join("\n");
}

function buildOccupancyDirectiveForValue(value) {
  if (value === "none") return "PEOPLE: Zero people. No figures, silhouettes, reflections, or background extras. Absolute rule.";
  if (value === "many") return "PEOPLE: Multiple visible, natural people distributed credibly. Do not block architecture or signage.";
  return "PEOPLE: Exactly 1-3 people maximum, secondary, natural, discrete. Do not exceed.";
}

function buildSlideRenderTreatmentDirective(treatment, config = {}) {
  const directives = {
    master: "SLIDE TREATMENT: master render, balanced full-scene quality for brochure use.",
    editorial: "SLIDE TREATMENT: editorial magazine-grade architectural photography, refined color grading, premium but faithful.",
    warm: "SLIDE TREATMENT: warm hospitality atmosphere, richer woods and natural stone warmth, no added objects.",
    moody: "SLIDE TREATMENT: darker sophisticated premium mood, deeper blacks with preserved detail, no geometry changes.",
    linear: "SLIDE TREATMENT: architectural line-drawing / precise graphic representation, preserve proportions and object positions.",
    alternate: "SLIDE TREATMENT: alternate editorial interpretation of the same scene, only lighting/finish changes, no geometry changes.",
    closeup: "SLIDE TREATMENT: material-detail emphasis while preserving source framing; enhance texture, joints, reflections and tactile surfaces.",
    atmosphere: "SLIDE TREATMENT: atmospheric commercial mood, stronger depth and controlled grading, no invented objects.",
    technical: "SLIDE TREATMENT: cleaner technical clarity, sharper edges and readable architecture, no decorative fantasy.",
  };
  const arrangement = optionLabel(SLIDE_IMAGE_ARRANGEMENT_OPTIONS, config.imageArrangement);
  const framing = optionLabel(SLIDE_IMAGE_FRAMING_OPTIONS, config.imageFraming);
  return [
    directives[treatment] || directives.master,
    arrangement ? `Slide composition after rendering will use arrangement: ${arrangement}.` : null,
    framing ? `Framing intent after rendering: ${framing}.` : null,
  ].filter(Boolean).join(" ");
}

async function buildAiDeckVisualKit(main, projectVisuals) {
  const preparedHeroUrl = projectVisuals?.renderedById?.[main?.id]
    || projectVisuals?.rawById?.[main?.id]
    || projectVisuals?.byId?.[main?.id]
    || "";
  const hero = preparedHeroUrl
    ? { url: preparedHeroUrl, source: projectVisuals?.renderedProvider || (projectVisuals?.mode === "rendered" ? "openai" : "project") }
    : await requestAiRender(main, {
      prompt: buildRenderPrompt(),
      size: pickImageSize(main),
      profile: { quality: "medium", inputFidelity: "high", outputCompression: 92, providerPreference: "auto-strict", strictFidelity: true },
    });
  const projectUrls = safeArray(projectVisuals?.orderedRenderedUrls).length
    ? safeArray(projectVisuals?.orderedRenderedUrls)
    : safeArray(projectVisuals?.orderedRawUrls);
  const moodboardSources = unique([preparedHeroUrl, main?.url, ...projectUrls]).filter(Boolean).slice(0, 4);
  const materialsSources = unique([hero?.url, preparedHeroUrl, main?.url, ...projectUrls]).filter(Boolean).slice(0, 4);
  state.generation.stage = "Generando vision board y materiales hiperrealistas...";
  renderAll();

  const boardTargets = collectPdfBoardTargets();
  const boardPromptByTarget = boardTargets.length && state.server.analysisReady
    ? await requestAiBoardPromptsForTargets(boardTargets).catch((error) => {
      console.warn("generate-board-prompts fallo, se usara prompt local", error);
      return {};
    })
    : {};

  const boardsBySlideKey = {};
  let moodboard = null;
  let materials = null;
  for (let index = 0; index < boardTargets.length; index += 1) {
    const target = boardTargets[index];
    const promptEntry = boardPromptByTarget[target.targetKey];
    const fallbackKind = target.kind === "materials" || target.kind === "palette" ? "materials" : "moodboard";
    const layoutPrompt = getMoodBoardLayoutPrompt(target.moodBoardLayout);
    const prompt = [
      promptEntry?.geminiPrompt || buildPdfVisualPrompt(fallbackKind, target.moodBoardLayout),
      layoutPrompt,
      target.materialHighlights?.length ? `Prioritize these selected materials: ${target.materialHighlights.join(", ")}.` : null,
      target.objectHighlights?.length ? `Include these selected object cues as physical mood-board objects, without labels: ${target.objectHighlights.join(", ")}.` : null,
      "Output must be one finished hyperrealistic collage/flatlay image for this brochure slide only.",
    ].filter(Boolean).join("\n");
    const sourceImages = target.kind === "materials" || target.kind === "palette" ? materialsSources : moodboardSources;
    state.generation.stage = `Generando board IA ${index + 1} de ${boardTargets.length}...`;
    renderAll();
    const renderedBoard = await requestAiRender(main, {
      prompt,
      size: "1024x1024",
      images: sourceImages,
      profile: { quality: "high", inputFidelity: "high", outputCompression: 95, providerPreference: "gemini" },
    }).catch(() => null);
    if (renderedBoard?.url) {
      boardsBySlideKey[target.slideKey] = renderedBoard.url;
      if ((target.kind === "materials" || target.kind === "palette") && !materials) materials = renderedBoard;
      if (target.kind === "mood-board" && !moodboard) moodboard = renderedBoard;
    }
  }

  if (!moodboard) {
    moodboard = await requestAiRender(main, {
      prompt: buildPdfVisualPrompt("moodboard", "object-flatlay"),
      size: "1024x1024",
      images: moodboardSources,
      profile: { quality: "high", inputFidelity: "high", outputCompression: 95, providerPreference: "gemini" },
    }).catch(() => null);
  }

  if (!materials) {
    materials = await requestAiRender(main, {
      prompt: buildPdfVisualPrompt("materials", "grid-separated"),
      size: "1024x1024",
      images: materialsSources,
      profile: { quality: "high", inputFidelity: "high", outputCompression: 95, providerPreference: "gemini" },
    }).catch(() => null);
  }

  return finalizeDeckVisualKit(main, { hero, moodboard, materials, boardsBySlideKey }, projectVisuals);
}

async function buildLocalDeckVisualKit(main, projectVisuals) {
  const heroUrl = projectVisuals?.renderedById?.[main?.id]
    || projectVisuals?.rawById?.[main?.id]
    || projectVisuals?.byId?.[main?.id]
    || "";
  const hero = heroUrl ? { url: heroUrl, source: "project" } : await buildLocalRenderFallback(main);
  return finalizeDeckVisualKit(main, { hero, moodboard: null, materials: null }, projectVisuals);
}

async function finalizeDeckVisualKit(main, sources, projectVisuals) {
  const sourceUrl = main?.url || "";
  const projectUrls = safeArray(projectVisuals?.orderedRenderedUrls).length
    ? safeArray(projectVisuals?.orderedRenderedUrls)
    : safeArray(projectVisuals?.orderedRawUrls);
  const heroUrl = sources.hero?.url || projectUrls[0] || sourceUrl;
  const moodboardSources = unique([...projectUrls, sourceUrl, heroUrl]).filter(Boolean);
  const moodboardUrl = sources.moodboard?.url || await buildEditorialBoard(moodboardSources.slice(0, 4), "concepto");
  const materialsUrl = sources.materials?.url || await buildEditorialBoard(unique([heroUrl, sourceUrl, ...projectUrls]).slice(0, 4), "materialidad");
  const detailA = await cropDataUrl(heroUrl, { x: 0.06, y: 0.08, width: 0.56, height: 0.48 }, 1600);
  const detailB = await cropDataUrl(heroUrl, { x: 0.34, y: 0.24, width: 0.52, height: 0.58 }, 1600);
  const referenceBoard = await buildEditorialBoard(unique([sourceUrl, heroUrl, materialsUrl, ...projectUrls]).slice(0, 4), "referencia");

  return {
    hero: { url: heroUrl, kind: sources.hero?.source || "local" },
    moodboard: { url: moodboardUrl, kind: sources.moodboard?.source || "derived" },
    materials: { url: materialsUrl, kind: sources.materials?.source || "derived" },
    detailA: { url: detailA, kind: "derived" },
    detailB: { url: detailB, kind: "derived" },
    reference: { url: referenceBoard, kind: "derived" },
    boardsBySlideKey: sources.boardsBySlideKey || {},
  };
}

function buildPdfVisualPrompt(kind, moodBoardLayout = "") {
  const analysis = getPdfDeckAnalysis();
  const context = (state.settings.contextBrief || "").trim();
  const materials = (analysis.materials || []).slice(0, 5).join(", ");
  const texts = (analysis.texts || []).slice(0, 5).join(", ");
  const palette = safeArray(state.settings.selectedPalette).length
    ? safeArray(state.settings.selectedPalette).join(", ")
    : safeArray(analysis.palette).slice(0, 5).join(", ");
  const brochureTemplate = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const templateRefBlock = buildTemplateReferenceBlock();
  const templateHint = brochureTemplate
    ? `Template reference: ${brochureTemplate.label}. ${brochureTemplate.description}. Collection: ${brochureTemplate.collection}.${templateRefBlock?.thumbnailUrl ? ` Visual reference image: ${templateRefBlock.thumbnailUrl}.` : ""}${templateRefBlock?.paletteHints?.length ? ` Palette hints: ${templateRefBlock.paletteHints.join(", ")}.` : ""} Respect its layout direction and typographic vibe.`
    : null;
  const antiTextClause = "ABSOLUTELY NO TEXT, NO LETTERS, NO WORDS, NO NUMBERS, NO LOGOS, NO LABELS, NO WATERMARKS, NO TYPOGRAPHY ANYWHERE.";
  const layoutPrompt = getMoodBoardLayoutPrompt(moodBoardLayout);

  if (kind === "moodboard") {
    return [
      "Create a HYPERREALISTIC architectural vision board / mood board for a premium brochure. It must look like a photographed Pinterest/Canva material collage, not a diagram, not a UI mockup, not a flat graphic.",
      "Composition: one square finished collage/flatlay with 8-12 layered physical samples and project-inspired fragments: overlapping cards, material swatches, close-up crops, furniture/object cues, plants when relevant, soft shadows and premium editorial white space.",
      "Include visible physical cues: wood veneer, stone slab, concrete sample, dark metal, glass reflection, tropical greenery, fabric/fiber or furniture-detail objects when relevant. Make every object tangible and photographed.",
      "The board must feel like a real photographed styling board assembled by an interior architect, with realistic depth, contact shadows, grain, reflections, material scale, thickness and studio lighting.",
      "Do not generate a slide, brochure page, poster, label sheet, UI screen or presentation thumbnail. Generate only the photographed mood-board image.",
      context ? `Project: ${context}` : null,
      materials ? `Materials: ${materials}` : null,
      texts ? `Visible texts/signage to preserve only in project renders, not in this board: ${texts}` : null,
      palette ? `Palette: ${palette}` : null,
      templateHint,
      layoutPrompt,
      `Style: ${labelForDecision("imageMood")}, ${labelForDecision("renderLanguage")}`,
      buildOccupancyDirective(),
      antiTextClause,
    ].filter(Boolean).join("\n");
  }

  return [
    "Create a HYPERREALISTIC architectural material board for a premium brochure. It must look like a photographed physical flatlay/collage, not a graphic diagram.",
    "Show tactile samples: wood veneer, stone/marble/concrete slab, dark metal piece, glass/reflection sample, textile/fiber, plant/leaf detail, hardware or furniture material cue. Use layered blocks with realistic thickness and contact shadows.",
    "Use layered shadows, realistic sample thickness, natural light, premium editorial styling and clean composition.",
    "Do not generate a slide, brochure page, poster, label sheet, UI screen or presentation thumbnail. Generate only the photographed material-board image.",
    context ? `Project: ${context}` : null,
    materials ? `Materials: ${materials}` : null,
    palette ? `Palette: ${palette}` : null,
    templateHint,
    layoutPrompt,
    buildOccupancyDirective(),
    antiTextClause,
  ].filter(Boolean).join("\n");
}

async function assignDeckVisuals(slides, visualKit, main, projectVisuals) {
  const safeSlides = safeArray(slides).length ? safeArray(slides) : buildLocalDeck().slides;
  return Promise.all(safeSlides.map(async (slide, index) => {
    const normalized = normalizeSlide(slide, index);
    const imageDataUrl = await pickSlideVisual(normalized, visualKit, main, index, projectVisuals);
    return {
      ...normalized,
      imageDataUrl,
    };
  }));
}

async function pickSlideVisual(slide, visualKit, main, index, projectVisuals) {
  const role = slide.visualRole || inferVisualRole(slide, index);
  const sourceUrl = main?.url || visualKit.hero.url;
  const config = state.settings.pdfSlideConfigs?.[slide.key || slide.sectionId || slide.title] || null;
  const sourceMode = resolveSlideImageSourceMode(config);
  const projectUrls = resolveProjectImageList(projectVisuals, sourceMode);
  const customBoard = visualKit?.boardsBySlideKey?.[slide.key];
  if (customBoard && (role === "moodboard" || role === "materials" || role === "palette" || slide.layout === "board")) {
    return customBoard;
  }

  if (config?.useProjectImages && safeArray(config.imageIds).length) {
    const selectedImages = state.images
      .filter((image) => config.imageIds.includes(image.id))
      .map((image) => resolveProjectImageUrl(image.id, projectVisuals, sourceMode, slide.key) || image.url)
      .filter(Boolean);
    if (selectedImages.length > 1) {
      return buildEditorialBoard(selectedImages, slide.title || slide.tag || "slide");
    }
    if (selectedImages.length === 1) {
      return selectedImages[0];
    }
  }

  if (config?.useProjectImages && !safeArray(config.imageIds).length && projectUrls.length) {
    return config.layout === "gallery"
      ? buildEditorialBoard(projectUrls.slice(0, 4), slide.title || slide.tag || "slide")
      : (resolveProjectImageUrl(state.mainId, projectVisuals, sourceMode, slide.key) || projectUrls[0]);
  }

  if (role === "moodboard" && config?.moodSources?.length) {
    const moodAssets = config.moodSources.flatMap((source) => {
      switch (source) {
        case "project":
          return projectUrls.length ? projectUrls : state.images.map((image) => image.url);
        case "materials":
          return [visualKit.materials.url];
        case "palette":
          return [visualKit.moodboard.url];
        case "reference":
          return [visualKit.reference.url];
        case "environment":
          return [visualKit.detailA.url, visualKit.detailB.url];
        default:
          return [];
      }
    });
    if (moodAssets.length) return buildEditorialBoard(moodAssets, slide.title || "mood");
  }

  switch (role) {
    case "hero":
      return visualKit.hero.url;
    case "moodboard":
      return visualKit.moodboard.url;
    case "materials":
      return visualKit.materials.url;
    case "palette":
      return buildPaletteBoard(state.settings.selectedPalette || getSuggestedPalette(getMainImage()?.analysis || buildAnalysisFallback()));
    case "identity":
      return visualKit.reference.url || sourceUrl;
    case "reference":
      return visualKit.reference.url || sourceUrl;
    case "detail":
      return index % 2 === 0 ? visualKit.detailA.url : visualKit.detailB.url;
    case "closing":
      return visualKit.hero.url;
    default:
      return index % 3 === 0 ? visualKit.hero.url : index % 3 === 1 ? visualKit.moodboard.url : visualKit.materials.url;
  }
}

function buildLocalDeck() {
  const analysis = getPdfDeckAnalysis();
  const blueprints = computePdfSlideBlueprints();
  const title = deriveDeckTitle();
  const summary = buildPdfBrief();
  const slides = blueprints.map((blueprint, index) => {
    const config = state.settings.pdfSlideConfigs?.[blueprint.key] || {};
    const copy = getSlideTextDraft(blueprint, analysis);
    return normalizeSlide({
      ...createSlideFromBlueprint(blueprint, analysis, index),
      ...copy,
      layout: config.layout || blueprint.layout,
      imagePlacement: config.imagePlacement || inferImagePlacement(config.layout || blueprint.layout),
      imageAspect: config.imageAspect || inferImageAspect(config.layout || blueprint.layout),
      imageSourceMode: config.imageSourceMode || "inherit",
      imageSize: config.imageSize || inferImageSize(config.layout || blueprint.layout),
      imageZone: config.imageZone || inferImageZone(config.layout || blueprint.layout, config.imagePlacement || inferImagePlacement(config.layout || blueprint.layout)),
      imageFraming: config.imageFraming || inferImageFraming(config.layout || blueprint.layout),
      imageArrangement: config.imageArrangement || inferImageArrangement(config.layout || blueprint.layout),
      moodBoardLayout: config.moodBoardLayout || inferMoodBoardLayout(blueprint),
      renderTreatment: config.renderTreatment || "master",
      imageRepresentation: config.imageRepresentation || "inherit",
      imageFinish: config.imageFinish || "inherit",
      imageOccupancy: config.imageOccupancy || "inherit",
      textMode: config.textMode || "suggested",
      slideBackground: config.slideBackground || "inherit",
      key: blueprint.key,
      useProjectImages: Boolean(config.useProjectImages),
      imageIds: safeArray(config.imageIds),
      moodSources: safeArray(config.moodSources),
      materialHighlights: safeArray(config.materialHighlights),
      objectHighlights: safeArray(config.objectHighlights),
      titleFont: state.settings.titleFont,
      bodyFont: state.settings.bodyFont,
      brochureLanguage: state.settings.brochureLanguage,
      brochureStyle: state.settings.brochureStyle,
    }, index);
  });

  return { title, summary, slides, source: "local" };
}

async function composeDeckSlides(slides, deckTitle = "RenderAI Studio") {
  const safeSlides = safeArray(slides);
  const palette = state.settings.selectedPalette?.length
    ? state.settings.selectedPalette
    : getSuggestedPalette(getMainImage()?.analysis || buildAnalysisFallback());
  return Promise.all(safeSlides.map(async (slide, index) => {
    const composed = await composeBrochureSlide(slide, index, safeSlides.length, deckTitle, palette);
    return {
      ...slide,
      composedPageDataUrl: composed.url,
      composedPageWidth: composed.width,
      composedPageHeight: composed.height,
    };
  }));
}

function resolveSlideBackgroundStops(slideBg, styleProfile) {
  const presets = {
    "dark-luxury": ["#1a1714", "#201c18", "#2a2420"],
    "warm-sand": ["#f8f0e0", "#efe4d0", "#e8d8c0"],
    "cool-mist": ["#e8eef4", "#dce6f0", "#f2f4f6"],
    "deep-forest": ["#1a2e24", "#162820", "#24382c"],
    "rose-dusk": ["#f8ece8", "#f4e0dc", "#f0d4d0"],
    "midnight": ["#0e1220", "#121828", "#1a2038"],
    "pure-white": ["#ffffff", "#fefefe", "#fcfcfc"],
    "charcoal": ["#2a2a30", "#242428", "#1e1e24"],
    "aurora-pastel": ["#e8e0f8", "#f0e4ec", "#e0ecf4"],
    "terracotta": ["#f0dcc8", "#e8ceb4", "#f4e6d8"],
    "ocean": ["#142838", "#1a3040", "#0e2030"],
  };
  if (slideBg !== "inherit" && presets[slideBg]) return presets[slideBg];
  const familyPresets = {
    obsidian: ["#121015", "#17131b", "#241e26"],
    ivory: ["#ffffff", "#fcfbf8", "#f5efe6"],
    aurora: ["#ede3fb", "#f7e5ef", "#daeaf8"],
    onyx: ["#090d13", "#0d1119", "#12192a"],
    velvet: ["#2c1620", "#6d394d", "#f2d6ca"],
    prism: ["#f7eefc", "#f3ebff", "#dbf0ff"],
    dune: ["#f5ecdf", "#ead7c2", "#d3b391"],
    slate: ["#eef0f4", "#dde3ea", "#c9d0da"],
    resort: ["#faf5ec", "#eee4d6", "#dcc7ae"],
    poster: ["#f8f1ea", "#f0e0d4", "#ddac8b"],
    manifest: ["#f5efe8", "#ead9cd", "#d0a58b"],
  };
  if (familyPresets[styleProfile.template]) return familyPresets[styleProfile.template];
  return [styleProfile.paper, styleProfile.palette?.[0] || styleProfile.paper, styleProfile.palette?.[1] || styleProfile.accent];
}

async function composeBrochureSlide(slide, index, pageCount, deckTitle, palette) {
  const width = 1600;
  const height = 1131;
  const styleProfile = getBrochureStyleProfile(slide.brochureStyle || state.settings.brochureStyle);
  if (styleProfile.canvaId) {
    return composeCanvaReferenceSlide(slide, index, pageCount, deckTitle, palette, styleProfile, width, height);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  const slideBg = slide.slideBackground || state.settings.pdfSlideConfigs?.[slide.key]?.slideBackground || "inherit";
  const bgStops = resolveSlideBackgroundStops(slideBg, styleProfile);
  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, bgStops[0]);
  background.addColorStop(0.45, bgStops[1]);
  background.addColorStop(1, bgStops[2]);
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  const isDarkBg = isDarkBackground(bgStops[0]);
  const decoAlpha = isDarkBg ? 0.06 : 0.05;
  const decoColor = isDarkBg ? "rgba(255, 220, 160, " : "rgba(103, 77, 55, ";
  context.fillStyle = decoColor + decoAlpha + ")";
  context.beginPath();
  context.ellipse(width - 180, 140, 320, 180, -0.4, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(190, height - 140, 260, 120, 0.15, 0, Math.PI * 2);
  context.fill();
  if (isDarkBg) {
    context.fillStyle = "rgba(167, 139, 250, 0.03)";
    context.beginPath();
    context.ellipse(width * 0.5, height * 0.5, 400, 300, 0, 0, Math.PI * 2);
    context.fill();
  }

  context.strokeStyle = isDarkBg ? "rgba(255, 220, 160, 0.08)" : "rgba(99, 74, 52, 0.12)";
  context.lineWidth = isDarkBg ? 1 : 2;
  context.strokeRect(28, 28, width - 56, height - 56);

  const resolvedPalette = safeArray(palette).length ? safeArray(palette) : safeArray(styleProfile.palette);
  drawStyleIdentity(context, styleProfile, resolvedPalette, width, height);
  const primary = resolvedPalette[0] || styleProfile.ink || "#6d5038";
  const accent = resolvedPalette[1] || styleProfile.accent || "#a88a68";
  const soft = resolvedPalette[2] || resolvedPalette[1] || "#88907f";
  const titleFont = slide.titleFont || state.settings.titleFont || "Cormorant Garamond";
  const bodyFont = slide.bodyFont || state.settings.bodyFont || "Manrope";
  const placement = slide.imagePlacement || inferImagePlacement(slide.layout || inferSlideLayout(slide, index));
  const aspect = slide.imageAspect || inferImageAspect(slide.layout || inferSlideLayout(slide, index));
  const size = slide.imageSize || inferImageSize(slide.layout || inferSlideLayout(slide, index));
  const zone = slide.imageZone || inferImageZone(slide.layout || inferSlideLayout(slide, index), placement);
  const arrangement = slide.imageArrangement || inferImageArrangement(slide.layout || inferSlideLayout(slide, index));
  const visualLayout = resolveSlideLayoutForPlacement(slide.layout || inferSlideLayout(slide, index), placement);
  const styleMode = resolveBrochureCanvasMode(styleProfile, visualLayout);
  const tag = (slide.tag || `Slide ${index + 1}`).toUpperCase();
  const title = slide.title || `Slide ${index + 1}`;
  const subtitle = slide.subtitle || "";
  const bullets = safeArray(slide.bullets).slice(0, 5);
  const imageUrl = await prepareSlideVisualVariant(slide.imageDataUrl || getMainImage()?.url || "", {
    placement,
    framing: slide.imageFraming || inferImageFraming(slide.layout || inferSlideLayout(slide, index)),
    treatment: slide.renderTreatment || "master",
    representation: slide.imageRepresentation || "inherit",
    finish: slide.imageFinish || "inherit",
  });

  const headerColor = isDarkBg ? "rgba(240, 234, 224, 0.9)" : primary;
  const headerSoft = isDarkBg ? "rgba(240, 234, 224, 0.5)" : "rgba(72, 57, 42, 0.78)";
  const defaultTitleColor = isDarkBg ? "#f0eae0" : "#1f1712";
  const defaultBodyColor = isDarkBg ? "rgba(240, 234, 224, 0.76)" : "rgba(61, 49, 38, 0.86)";

  // Editorial header: brand mark + deck title + page marker + thin rule
  context.fillStyle = headerColor;
  context.font = `700 22px "${bodyFont}", sans-serif`;
  const brandMark = "RENDERAI · STUDIO";
  context.fillText(brandMark, 72, 76);
  // Accent dot
  context.beginPath();
  context.arc(72 + context.measureText(brandMark).width + 16, 68, 5, 0, Math.PI * 2);
  context.fillStyle = accent;
  context.fill();

  context.font = `500 18px "${bodyFont}", sans-serif`;
  context.fillStyle = headerSoft;
  const deckLabel = deckTitle.slice(0, 60).toUpperCase();
  context.fillText(deckLabel, 72, 102);

  // Page number block with larger, serif-first typography like a magazine folio
  const folio = `${String(index + 1).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`;
  context.font = `600 14px "${bodyFont}", sans-serif`;
  context.fillStyle = headerSoft;
  context.fillText(isDarkBg ? "PAGINA" : "PAGINA", width - 210, 70);
  context.font = `600 34px "${titleFont}", serif`;
  context.fillStyle = headerColor;
  context.fillText(folio, width - 210, 104);

  // Thin editorial rule under header
  context.strokeStyle = isDarkBg ? "rgba(240,234,224,0.18)" : "rgba(72,57,42,0.22)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(72, 126);
  context.lineTo(width - 72, 126);
  context.stroke();

  const drawText = (settings) => drawCanvasTextBlock(context, title, subtitle, bullets, {
    titleColor: defaultTitleColor,
    bodyColor: defaultBodyColor,
    accentColor: isDarkBg ? accent : primary,
    titleFont,
    bodyFont,
    ...settings,
  });

  if (styleMode === "poster") {
    const posterFrame = fitRectToAspect(scaleFrameByPreset({ x: 110, y: 160, width: 1380, height: 760 }, size === "full-page" ? "giant" : size), aspect, zone);
    await drawVisualArrangement(context, imageUrl, posterFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 34 });
    context.fillStyle = isDarkBg ? "rgba(0,0,0,0.5)" : "rgba(255,248,241,0.84)";
    roundRectPath(context, 102, 828, 1396, 190, 30);
    context.fill();
    drawEditorialPill(context, tag, 128, 892, accent, bodyFont);
    drawText({ x: 128, y: 956, width: 1240, titleSize: 78, subtitleSize: 23, bulletSize: 20 });
  } else if (styleMode === "folio") {
    const folioFrame = fitRectToAspect(scaleFrameByPreset({ x: 96, y: 180, width: 720, height: 720 }, size), aspect, zone);
    await drawVisualArrangement(context, imageUrl, folioFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 30 });
    drawEditorialPill(context, tag, 920, 220, accent, bodyFont);
    drawText({ x: 920, y: 310, width: 480, titleSize: 66, subtitleSize: 24, bulletSize: 21 });
    context.fillStyle = colorMixHex(accent, "#ffffff", 0.58);
    context.fillRect(920, 860, 320, 8);
  } else if (styleMode === "magazine") {
    context.fillStyle = isDarkBg ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.5)";
    roundRectPath(context, 70, 188, 520, 820, 34);
    context.fill();
    const magFrame = fitRectToAspect(scaleFrameByPreset({ x: 628, y: 158, width: 860, height: 844 }, size), aspect, zone);
    await drawVisualArrangement(context, imageUrl, magFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 38 });
    drawEditorialPill(context, tag, 108, 250, accent, bodyFont);
    drawText({ x: 108, y: 340, width: 420, titleSize: 68, subtitleSize: 23, bulletSize: 20 });
    context.fillStyle = accent;
    context.fillRect(560, 158, 20, 844);
  } else if (styleMode === "mosaic") {
    drawEditorialPill(context, tag, 82, 188, accent, bodyFont);
    drawText({ x: 82, y: 260, width: 380, titleSize: 62, subtitleSize: 23, bulletSize: 20 });
    const mosaicFrame = { x: 520, y: 138, width: 990, height: 860 };
    await drawVisualArrangement(context, imageUrl, mosaicFrame, { arrangement: arrangement === "single" ? "collage" : arrangement, palette: resolvedPalette, accent: primary, radius: 28 });
  } else if (styleMode === "urban") {
    context.fillStyle = isDarkBg ? "rgba(255,255,255,0.06)" : "rgba(24,28,35,0.88)";
    roundRectPath(context, 72, 138, 364, 880, 34);
    context.fill();
    const urbanTextLight = isDarkBg ? "#f0eae0" : "#f7f7f4";
    drawEditorialPill(context, tag, 108, 210, urbanTextLight, bodyFont);
    drawText({ x: 108, y: 300, width: 284, titleSize: 60, subtitleSize: 23, bulletSize: 19, titleColor: urbanTextLight, bodyColor: "rgba(255,255,255,0.78)", accentColor: accent });
    const urbanFrame = fitRectToAspect(scaleFrameByPreset({ x: 492, y: 176, width: 980, height: 804 }, size), aspect, zone);
    await drawVisualArrangement(context, imageUrl, urbanFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 18 });
  } else if (styleMode === "technical") {
    drawEditorialPill(context, tag, 82, 182, soft, bodyFont);
    const technicalFrame = fitRectToAspect(scaleFrameByPreset({ x: 80, y: 236, width: 860, height: 620 }, size), aspect, zone);
    await drawVisualArrangement(context, imageUrl, technicalFrame, { arrangement: arrangement === "single" ? "divisions" : arrangement, palette: resolvedPalette, accent: primary, radius: 20 });
    await drawTechnicalComposition(context, imageUrl, {
      x: technicalFrame.x,
      y: technicalFrame.y,
      width: technicalFrame.width,
      height: technicalFrame.height,
      accent: primary,
    });
    drawText({ x: 1010, y: 260, width: 450, titleSize: 58, subtitleSize: 23, bulletSize: 20, titleColor: "#201813", bodyColor: "rgba(66, 52, 42, 0.86)" });
  } else {
    if (visualLayout === "feature") {
      const featureFrame = fitRectToAspect(scaleFrameByPreset({ x: 720, y: 96, width: 780, height: 925 }, size), aspect, zone || placement);
      await drawVisualArrangement(context, imageUrl, featureFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 42 });
      drawFeatureComposition(context, imageUrl, featureFrame, primary);
      drawEditorialPill(context, tag, 82, 190, accent, bodyFont);
      drawText({ x: 82, y: 270, width: 540, titleSize: 88, subtitleSize: 28, bulletSize: 24 });
    } else if (visualLayout === "board" || visualLayout === "gallery") {
      drawEditorialPill(context, tag, 82, 184, accent, bodyFont);
      drawText({ x: 82, y: 258, width: 420, titleSize: 66, subtitleSize: 24, bulletSize: 22 });
      await drawVisualArrangement(context, imageUrl, { x: 560, y: 120, width: 940, height: 850 }, { arrangement: arrangement === "single" ? visualLayout === "gallery" ? "collage" : "divisions" : arrangement, palette: resolvedPalette, accent: primary, radius: 28 });
    } else if (visualLayout === "technical") {
      drawEditorialPill(context, tag, 82, 182, soft, bodyFont);
      const technicalFrame = fitRectToAspect(scaleFrameByPreset({ x: 80, y: 236, width: 860, height: 620 }, size), aspect, zone || placement);
      await drawVisualArrangement(context, imageUrl, technicalFrame, { arrangement: arrangement === "single" ? "divisions" : arrangement, palette: resolvedPalette, accent: primary, radius: 20 });
      await drawTechnicalComposition(context, imageUrl, {
        x: technicalFrame.x,
        y: technicalFrame.y,
        width: technicalFrame.width,
        height: technicalFrame.height,
        accent: primary,
      });
      drawText({ x: 1010, y: 260, width: 450, titleSize: 58, subtitleSize: 23, bulletSize: 20, titleColor: "#201813", bodyColor: "rgba(66, 52, 42, 0.86)" });
    } else {
      drawEditorialPill(context, tag, 82, 190, accent, bodyFont);
      const imageLeft = placement !== "right";
      const baseFrame = imageLeft
        ? { x: 72, y: 236, width: 840, height: 760 }
        : { x: 688, y: 236, width: 840, height: 760 };
      const imageFrame = fitRectToAspect(scaleFrameByPreset(baseFrame, size), aspect, zone || placement);
      await drawVisualArrangement(context, imageUrl, imageFrame, { arrangement, palette: resolvedPalette, accent: primary, radius: 36 });
      drawSplitComposition(context, imageUrl, imageFrame, primary);
      drawText({ x: imageLeft ? 970 : 96, y: 258, width: 470, titleSize: 62, subtitleSize: 24, bulletSize: 22, titleColor: "#201813", bodyColor: "rgba(66, 52, 42, 0.86)" });
    }
  }

  // Bottom editorial footer: palette + rule + brand line
  context.strokeStyle = isDarkBg ? "rgba(240,234,224,0.18)" : "rgba(72,57,42,0.22)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(72, height - 120);
  context.lineTo(width - 72, height - 120);
  context.stroke();

  drawPaletteRail(context, resolvedPalette, { x: 72, y: height - 102, swatchWidth: 82, gap: 10, bodyFont });

  context.fillStyle = isDarkBg ? "rgba(240, 234, 224, 0.55)" : "rgba(80, 62, 48, 0.78)";
  context.font = `600 14px "${bodyFont}", sans-serif`;
  const footerLabel = `${(styleProfile.family || "Editorial").toUpperCase()} · ${(styleProfile.variant || "Deck").toUpperCase()}`;
  context.fillText(footerLabel, width - 72 - context.measureText(footerLabel).width, height - 72);
  context.font = `500 12px "${bodyFont}", sans-serif`;
  context.fillStyle = isDarkBg ? "rgba(240, 234, 224, 0.4)" : "rgba(80, 62, 48, 0.6)";
  const subFooter = "RENDERAI STUDIO · EDITORIAL DECK";
  context.fillText(subFooter, width - 72 - context.measureText(subFooter).width, height - 52);

  return { url: canvas.toDataURL("image/jpeg", 0.92), width, height };
}

async function composeCanvaReferenceSlide(slide, index, pageCount, deckTitle, palette, styleProfile, width = 1600, height = 1131) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  const recipe = resolveCanvaReferenceRecipe(styleProfile);
  const userPalette = safeArray(palette).filter(Boolean);
  const manualPalette = state.settings.colorMode === "manual";
  const resolvedPalette = unique(manualPalette
    ? [...userPalette, recipe.accent, recipe.accent2, ...safeArray(styleProfile.palette)]
    : [recipe.accent, recipe.accent2, ...safeArray(styleProfile.palette), ...userPalette]).slice(0, 6);
  const accent = resolvedPalette[0] || styleProfile.accent || "#8b6a4a";
  const accent2 = resolvedPalette[1] || colorMixHex(accent, "#ffffff", 0.42);
  const paper = recipe.paper || styleProfile.paper || "#f7f2ea";
  const ink = recipe.ink || styleProfile.ink || "#1c1714";
  const titleFont = slide.titleFont || state.settings.titleFont || recipe.titleFont || "Cormorant Garamond";
  const bodyFont = slide.bodyFont || state.settings.bodyFont || recipe.bodyFont || "Manrope";
  const isBoard = ["moodboard", "materials", "pantone"].includes(slide.sectionId) || ["moodboard", "materials", "board"].includes(slide.visualRole);

  drawCanvaRecipeBackground(context, recipe, { width, height, paper, ink, accent, accent2 });
  // Use the selected Canva reference only as abstract visual DNA. It stays
  // blurred/low-opacity so final project imagery and generated text remain in
  // RenderAI's controlled, editable composition layer.
  await drawTemplateReferenceGhost(context, styleProfile.thumbnail, {
    width,
    height,
    opacity: Math.min(Number(recipe.referenceOpacity || 0.04), 0.055),
    mode: recipe.mode,
  });

  const rawSlideVisual = slide.imageDataUrl || "";
  const projectFallbackVisual = state.result.render?.url || getMainImage()?.url || "";
  const imageUrl = await prepareSlideVisualVariant(
    isTemplatePreviewAssetUrl(rawSlideVisual) ? projectFallbackVisual : (rawSlideVisual || projectFallbackVisual),
    {
    placement: slide.imagePlacement || "right",
    framing: slide.imageFraming || "clean",
    treatment: slide.renderTreatment || "master",
    representation: slide.imageRepresentation || "inherit",
    finish: slide.imageFinish || "inherit",
    }
  );

  const tag = sanitizeVisibleDeckText(slide.tag || `Pagina ${index + 1}`, `Pagina ${index + 1}`).toUpperCase();
  const title = sanitizeVisibleDeckText(slide.title, deckTitle || "Proyecto arquitectonico");
  const subtitle = sanitizeVisibleDeckText(slide.subtitle, "");
  const bullets = safeArray(slide.bullets)
    .map((item) => sanitizeVisibleDeckText(item, ""))
    .filter(Boolean)
    .slice(0, isBoard ? 3 : 4);

  if (isBoard) {
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 82, y: 210, width: 410, ink, accent, titleFont, bodyFont, scale: 0.9 });
    await drawVisualArrangement(context, imageUrl, {
      x: 545,
      y: 122,
      width: 965,
      height: 860,
    }, { arrangement: "single", palette: resolvedPalette, accent, radius: recipe.radius || 28, noText: true });
  } else if (recipe.mode === "dark-poster") {
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#f6efe5", accent, bodyFont, minimal: false });
    context.font = `900 116px "${recipe.titleFont || "Inter Tight"}", sans-serif`;
    context.fillStyle = "#f8f2ea";
    wrapCanvasText(context, title.toUpperCase(), 560).slice(0, 4).forEach((line, lineIndex) => {
      context.fillText(line, 78, 250 + lineIndex * 100);
    });
    context.fillStyle = accent;
    context.fillRect(80, 690, 260, 12);
    context.font = `500 26px "${bodyFont}", sans-serif`;
    context.fillStyle = "rgba(248,242,234,0.74)";
    wrapCanvasText(context, subtitle, 500).slice(0, 3).forEach((line, lineIndex) => context.fillText(line, 82, 755 + lineIndex * 36));
    await drawVisualArrangement(context, imageUrl, { x: 710, y: 130, width: 770, height: 820 }, { arrangement: "divisions", palette: resolvedPalette, accent, radius: 8, noText: true });
  } else if (recipe.mode === "warm-interior") {
    await drawVisualArrangement(context, imageUrl, { x: 70, y: 110, width: 930, height: 900 }, { arrangement: "single", palette: resolvedPalette, accent, radius: 36, noText: true });
    context.fillStyle = "rgba(255,252,246,0.92)";
    roundRectPath(context, 930, 166, 520, 760, 46);
    context.fill();
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 985, y: 260, width: 380, ink, accent, titleFont, bodyFont, scale: 1 });
  } else if (recipe.mode === "clean-grid") {
    drawArchitecturalGrid(context, { width, height, color: "rgba(20,20,20,0.08)" });
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 86, y: 214, width: 470, ink, accent, titleFont, bodyFont, scale: 0.94 });
    await drawVisualArrangement(context, imageUrl, { x: 640, y: 150, width: 820, height: 800 }, { arrangement: "triptych", palette: resolvedPalette, accent, radius: 4, noText: true });
  } else if (recipe.mode === "gradient-pop") {
    drawGradientNoise(context, { width, height, accent, accent2, ink });
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#ffffff", accent: "#ffffff", bodyFont, minimal: false });
    await drawVisualArrangement(context, imageUrl, { x: 770, y: 150, width: 650, height: 810 }, { arrangement: "duplicate", palette: resolvedPalette, accent: "#ffffff", radius: 34, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 86, y: 238, width: 560, ink: "#ffffff", accent: "#ffffff", titleFont: recipe.titleFont || "Syne", bodyFont, scale: 1.05, uppercase: true });
  } else if (recipe.mode === "red-pitch") {
    context.fillStyle = "#fbfaf7";
    context.fillRect(0, 0, width, height);
    context.fillStyle = recipe.accent || "#d71920";
    context.fillRect(0, 0, width * 0.34, height);
    context.fillStyle = "#111111";
    context.fillRect(width * 0.34, 0, 28, height);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#111111", accent: recipe.accent || "#d71920", bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 650, y: 150, width: 800, height: 760 }, { arrangement: "pair", palette: resolvedPalette, accent: recipe.accent || "#d71920", radius: 2, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 88, y: 240, width: 390, ink: "#ffffff", accent: "#111111", titleFont: "Inter Tight", bodyFont, scale: 0.92, uppercase: true });
  } else if (recipe.mode === "brand-manual") {
    drawArchitecturalGrid(context, { width, height, color: "rgba(40,40,40,0.055)" });
    context.strokeStyle = accent;
    context.lineWidth = 3;
    context.strokeRect(84, 150, width - 168, height - 275);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 880, y: 210, width: 490, height: 540 }, { arrangement: "single", palette: resolvedPalette, accent, radius: 0, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 148, y: 242, width: 560, ink, accent, titleFont, bodyFont, scale: 0.9 });
    drawPaletteRail(context, resolvedPalette, { x: 148, y: 840, swatchWidth: 92, gap: 14, showHex: false, bodyFont });
  } else if (recipe.mode === "mono-index") {
    context.fillStyle = "#111111";
    context.fillRect(0, 0, width, 340);
    context.fillStyle = "#f6f3ee";
    context.font = `900 126px "${recipe.titleFont || "Inter Tight"}", sans-serif`;
    wrapCanvasText(context, title.toUpperCase(), 1180).slice(0, 2).forEach((line, lineIndex) => {
      context.fillText(line, 72, 170 + lineIndex * 118);
    });
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#f6f3ee", accent, bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 72, y: 405, width: 960, height: 520 }, { arrangement: "triptych", palette: resolvedPalette, accent, radius: 0, noText: true });
    drawCanvaTextPanel(context, { title: subtitle || title, subtitle: "", bullets, x: 1080, y: 432, width: 360, ink: "#141414", accent, titleFont, bodyFont, scale: 0.62 });
  } else if (recipe.mode === "proposal-columns") {
    drawArchitecturalGrid(context, { width, height, color: "rgba(20,20,20,0.055)" });
    context.fillStyle = "#111111";
    context.fillRect(72, 128, 12, 850);
    context.fillStyle = colorMixHex(accent, "#ffffff", 0.64);
    context.fillRect(108, 128, 410, 190);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 118, y: 392, width: 410, ink, accent, titleFont, bodyFont, scale: 0.82 });
    await drawVisualArrangement(context, imageUrl, { x: 610, y: 128, width: 830, height: 850 }, { arrangement: "divisions", palette: resolvedPalette, accent, radius: 0, noText: true });
  } else if (recipe.mode === "luxury-gold") {
    context.fillStyle = "#0f0c09";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = colorWithAlpha(accent, 0.82);
    context.lineWidth = 4;
    context.strokeRect(64, 74, width - 128, height - 148);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#f7eee1", accent, bodyFont, minimal: false });
    await drawVisualArrangement(context, imageUrl, { x: 640, y: 160, width: 780, height: 730 }, { arrangement: "single", palette: resolvedPalette, accent, radius: 3, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 104, y: 268, width: 460, ink: "#f7eee1", accent, titleFont: recipe.titleFont || titleFont, bodyFont, scale: 0.96 });
  } else if (recipe.mode === "orange-motion") {
    context.fillStyle = "#fbfaf7";
    context.fillRect(0, 0, width, height);
    context.fillStyle = recipe.accent || accent;
    context.fillRect(0, 0, width, 235);
    context.fillStyle = "#111111";
    context.fillRect(122, 170, 520, 18);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#111111", accent: recipe.accent || accent, bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 610, y: 188, width: 860, height: 770 }, { arrangement: "collage", palette: resolvedPalette, accent: recipe.accent || accent, radius: 20, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 104, y: 352, width: 420, ink: "#111111", accent: recipe.accent || accent, titleFont: "Inter Tight", bodyFont, scale: 0.88, uppercase: true });
  } else if (recipe.mode === "earth-editorial") {
    await drawVisualArrangement(context, imageUrl, { x: 0, y: 0, width, height }, { arrangement: "single", palette: resolvedPalette, accent, radius: 0, noText: true });
    context.fillStyle = "rgba(20,15,11,0.46)";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "rgba(255,249,239,0.92)";
    roundRectPath(context, 88, 132, 530, 790, 40);
    context.fill();
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#211a15", accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 138, y: 292, width: 420, ink: "#211a15", accent, titleFont, bodyFont, scale: 0.9 });
  } else if (recipe.mode === "blue-gradient") {
    drawGradientNoise(context, { width, height, accent: recipe.accent || accent, accent2: recipe.accent2 || accent2, ink: "#07121f" });
    context.fillStyle = "rgba(0,0,0,0.34)";
    context.fillRect(0, 0, width, height);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#ffffff", accent: "#ffffff", bodyFont, minimal: false });
    await drawVisualArrangement(context, imageUrl, { x: 790, y: 138, width: 650, height: 820 }, { arrangement: "mirror", palette: resolvedPalette, accent: "#ffffff", radius: 26, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 90, y: 260, width: 580, ink: "#ffffff", accent: "#ffffff", titleFont: "Syne", bodyFont, scale: 1.02, uppercase: true });
  } else if (recipe.mode === "green-catalog") {
    context.fillStyle = "#0f3b2d";
    context.fillRect(0, 0, width * 0.42, height);
    context.fillStyle = "#f8f5ee";
    context.fillRect(width * 0.42, 0, width * 0.58, height);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#f8f5ee", accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 84, y: 245, width: 500, ink: "#f8f5ee", accent: colorMixHex(accent, "#ffffff", 0.26), titleFont, bodyFont, scale: 0.9 });
    await drawVisualArrangement(context, imageUrl, { x: 760, y: 150, width: 620, height: 760 }, { arrangement: "pair", palette: resolvedPalette, accent, radius: 18, noText: true });
  } else if (recipe.mode === "yellow-portfolio") {
    context.fillStyle = "#f7df31";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#111111";
    context.fillRect(74, 112, 410, 760);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#111111", accent: "#111111", bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 116, y: 274, width: 330, ink: "#ffffff", accent: "#f7df31", titleFont: "Inter Tight", bodyFont, scale: 0.82, uppercase: true });
    await drawVisualArrangement(context, imageUrl, { x: 560, y: 150, width: 870, height: 740 }, { arrangement: "divisions", palette: resolvedPalette, accent: "#111111", radius: 0, noText: true });
  } else if (recipe.mode === "pink-portfolio") {
    context.fillStyle = "#0d0d0f";
    context.fillRect(0, 0, width, height);
    context.fillStyle = recipe.accent || "#ff5aaa";
    context.fillRect(width - 460, 0, 460, height);
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink: "#ffffff", accent: recipe.accent || "#ff5aaa", bodyFont, minimal: false });
    await drawVisualArrangement(context, imageUrl, { x: 660, y: 170, width: 720, height: 730 }, { arrangement: "duplicate", palette: resolvedPalette, accent: recipe.accent || "#ff5aaa", radius: 30, noText: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 86, y: 255, width: 510, ink: "#ffffff", accent: recipe.accent || "#ff5aaa", titleFont: "Syne", bodyFont, scale: 0.98, uppercase: true });
  } else if (recipe.mode === "minimal-index") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    drawArchitecturalGrid(context, { width, height, color: "rgba(0,0,0,0.045)" });
    context.fillStyle = "#111111";
    context.fillRect(80, 130, 300, 760);
    context.save();
    context.translate(138, 842);
    context.rotate(-Math.PI / 2);
    context.font = `900 72px "${recipe.titleFont || "Space Grotesk"}", sans-serif`;
    context.fillStyle = "#ffffff";
    context.fillText(title.toUpperCase().slice(0, 44), 0, 0);
    context.restore();
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 460, y: 138, width: 930, height: 660 }, { arrangement: "pair", palette: resolvedPalette, accent, radius: 0, noText: true });
    drawCanvaTextPanel(context, { title: subtitle || title, subtitle: "", bullets, x: 460, y: 850, width: 780, ink, accent, titleFont, bodyFont, scale: 0.58 });
  } else if (recipe.mode === "geometric-marble") {
    context.fillStyle = "#f8f7f4";
    context.fillRect(0, 0, width, height);
    drawArchitecturalGrid(context, { width, height, color: "rgba(40,40,40,0.04)" });
    context.fillStyle = colorMixHex(accent, "#ffffff", 0.66);
    context.fillRect(70, 132, 460, 320);
    context.fillStyle = "rgba(20,20,20,0.08)";
    context.beginPath();
    context.arc(1280, 222, 150, 0, Math.PI * 2);
    context.fill();
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 100, y: 525, width: 430, ink, accent, titleFont: "Space Grotesk", bodyFont, scale: 0.8 });
    await drawVisualArrangement(context, imageUrl, { x: 620, y: 132, width: 820, height: 800 }, { arrangement: "divisions", palette: resolvedPalette, accent, radius: 8, noText: true });
  } else {
    drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal: true });
    await drawVisualArrangement(context, imageUrl, { x: 690, y: 126, width: 800, height: 850 }, { arrangement: recipe.mode === "orange-editorial" ? "collage" : "single", palette: resolvedPalette, accent, radius: recipe.radius || 26, noText: true });
    if (recipe.mode === "orange-editorial") {
      context.fillStyle = recipe.accent || "#ef6c2f";
      context.fillRect(74, 176, 520, 22);
      context.fillRect(74, 212, 360, 10);
    }
    drawCanvaTextPanel(context, { title, subtitle, bullets, x: 84, y: 280, width: 510, ink, accent, titleFont, bodyFont, scale: 1 });
  }

  return { url: canvas.toDataURL("image/jpeg", 0.94), width, height };
}

function resolveCanvaReferenceRecipe(styleProfile) {
  const id = styleProfile.canvaId || "";
  const modes = {
    "EAGrLDwPJo0": "mono-index",
    "EAGr_RR-y1A": "warm-interior",
    "EAFw_orjpUY": "proposal-columns",
    "EAFikiuuzhg": "gradient-pop",
    "EAFNfbb5KQs": "warm-interior",
    "EAGn3Fr3fd4": "clean-grid",
    "EAF2x8BSmSs": "brand-manual",
    "EAFPf0Mf_YI": "luxury-gold",
    "EAGdcTUYU1s": "clean-grid",
    "EAGtNZBHprc": "earth-editorial",
    "EAGTkH8WXi4": "orange-motion",
    "EAGsAh-OVLo": "earth-editorial",
    "EAGhhyrjjkg": "minimal-index",
    "EAHFf3kj4iA": "clean-grid",
    "EAGRNMmnuaA": "proposal-columns",
    "EAGhDLLD7O4": "minimal-index",
    "EAFLv0V_9Ho": "gradient-pop",
    "EAGsW4hEJkw": "red-pitch",
    "EAGTP-02p34": "geometric-marble",
    "EAFJITWQWWk": "warm-interior",
    "EAGHvxr_154": "blue-gradient",
    "EAGubEOQn8Y": "mono-index",
    "EAGV4SKvtkI": "brand-manual",
    "EAFy6z9zO0k": "dark-poster",
    "EAFZccmrE1U": "green-catalog",
    "EAG1o5cfZP0": "orange-motion",
    "EAGnoGixvFY": "yellow-portfolio",
    "EAGnaH1PQ5c": "pink-portfolio",
  };
  const mode = modes[id] || "portfolio-editorial";
  const presets = {
    "dark-poster": { mode, paper: "#0f0f10", ink: "#f8f4ee", accent: "#c7a46c", titleFont: "Inter Tight", bodyFont: "Manrope", radius: 10, referenceOpacity: 0.04 },
    "warm-interior": { mode, paper: "#f3eadf", ink: "#211a15", accent: "#9a7657", titleFont: "Cormorant Garamond", bodyFont: "Nunito Sans", radius: 36, referenceOpacity: 0.045 },
    "clean-grid": { mode, paper: "#fbfbfa", ink: "#121212", accent: "#808080", titleFont: "Space Grotesk", bodyFont: "Manrope", radius: 3, referenceOpacity: 0.035 },
    "gradient-pop": { mode, paper: "#1a1028", ink: "#ffffff", accent: "#ff4e50", accent2: "#6be3ff", titleFont: "Syne", bodyFont: "Outfit", radius: 28, referenceOpacity: 0.075 },
    "orange-editorial": { mode, paper: "#faf7f2", ink: "#161616", accent: "#ef6c2f", titleFont: "Inter Tight", bodyFont: "Outfit", radius: 18, referenceOpacity: 0.04 },
    "red-pitch": { mode, paper: "#fbfaf7", ink: "#111111", accent: "#d71920", titleFont: "Inter Tight", bodyFont: "Manrope", radius: 0, referenceOpacity: 0.035 },
    "brand-manual": { mode, paper: "#ffffff", ink: "#161616", accent: "#2f6f8f", titleFont: "Space Grotesk", bodyFont: "Manrope", radius: 0, referenceOpacity: 0.03 },
    "portfolio-editorial": { mode, paper: "#f7f2ea", ink: "#181512", accent: "#8f6046", titleFont: "Playfair Display", bodyFont: "Nunito Sans", radius: 24, referenceOpacity: 0.045 },
    "mono-index": { mode, paper: "#f6f3ee", ink: "#111111", accent: "#a63632", titleFont: "Inter Tight", bodyFont: "Manrope", radius: 0, referenceOpacity: 0.035 },
    "proposal-columns": { mode, paper: "#fbfbfa", ink: "#161616", accent: "#9b1c1f", titleFont: "Space Grotesk", bodyFont: "Manrope", radius: 0, referenceOpacity: 0.03 },
    "luxury-gold": { mode, paper: "#0f0c09", ink: "#f7eee1", accent: "#c9a25d", titleFont: "Playfair Display", bodyFont: "Nunito Sans", radius: 3, referenceOpacity: 0.04 },
    "orange-motion": { mode, paper: "#fbfaf7", ink: "#111111", accent: "#ef5b22", titleFont: "Inter Tight", bodyFont: "Outfit", radius: 18, referenceOpacity: 0.045 },
    "earth-editorial": { mode, paper: "#efe1d1", ink: "#1f1712", accent: "#95613f", titleFont: "Cormorant Garamond", bodyFont: "Nunito Sans", radius: 36, referenceOpacity: 0.04 },
    "minimal-index": { mode, paper: "#ffffff", ink: "#111111", accent: "#595959", titleFont: "Space Grotesk", bodyFont: "Manrope", radius: 0, referenceOpacity: 0.028 },
    "geometric-marble": { mode, paper: "#f8f7f4", ink: "#181818", accent: "#7c7f87", titleFont: "Space Grotesk", bodyFont: "Manrope", radius: 6, referenceOpacity: 0.035 },
    "blue-gradient": { mode, paper: "#07121f", ink: "#ffffff", accent: "#1677ff", accent2: "#66e5ff", titleFont: "Syne", bodyFont: "Outfit", radius: 28, referenceOpacity: 0.07 },
    "green-catalog": { mode, paper: "#f8f5ee", ink: "#132d24", accent: "#0f6b45", titleFont: "Libre Baskerville", bodyFont: "Manrope", radius: 16, referenceOpacity: 0.035 },
    "yellow-portfolio": { mode, paper: "#f7df31", ink: "#111111", accent: "#111111", titleFont: "Inter Tight", bodyFont: "Outfit", radius: 0, referenceOpacity: 0.03 },
    "pink-portfolio": { mode, paper: "#0d0d0f", ink: "#ffffff", accent: "#ff5aaa", titleFont: "Syne", bodyFont: "Outfit", radius: 30, referenceOpacity: 0.055 },
  };
  return presets[mode] || presets["portfolio-editorial"];
}

async function drawTemplateReferenceGhost(context, thumbnail, options = {}) {
  if (!thumbnail) return;
  const { width, height, opacity = 0.05, mode = "" } = options;
  try {
    const image = await loadImage(thumbnail);
    context.save();
    context.globalAlpha = opacity;
    context.filter = mode.includes("gradient") || mode.includes("blue") ? "blur(22px) saturate(1.2)" : "blur(18px) saturate(0.92)";
    drawCoverImage(context, image, { x: 0, y: 0, width, height });
    context.restore();
  } catch {
    // Template ghosts are decorative only; never block PDF generation.
  }
}

function drawCanvaRecipeBackground(context, recipe, { width, height, paper, ink, accent, accent2 }) {
  if (recipe.mode === "gradient-pop") {
    drawGradientNoise(context, { width, height, accent, accent2, ink });
    return;
  }
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, paper);
  gradient.addColorStop(0.55, colorMixHex(paper, accent, recipe.mode === "dark-poster" ? 0.16 : 0.08));
  gradient.addColorStop(1, colorMixHex(paper, accent2 || accent, recipe.mode === "dark-poster" ? 0.1 : 0.05));
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  if (recipe.mode === "dark-poster") {
    context.fillStyle = "rgba(255,255,255,0.035)";
    context.fillRect(78, 116, 520, 6);
    context.fillRect(78, 140, 360, 6);
  }
}

function drawGradientNoise(context, { width, height, accent, accent2, ink }) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colorMixHex(accent, "#ff2b72", 0.35));
  gradient.addColorStop(0.45, colorMixHex(accent2 || "#47d6ff", "#111111", 0.18));
  gradient.addColorStop(1, colorMixHex(ink || "#111111", "#ff8a00", 0.18));
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);
  for (let i = 0; i < 18; i += 1) {
    context.fillStyle = `rgba(255,255,255,${0.025 + (i % 3) * 0.012})`;
    context.beginPath();
    context.ellipse(160 + i * 86, 120 + (i % 5) * 170, 260, 90, i * 0.18, 0, Math.PI * 2);
    context.fill();
  }
}

function drawArchitecturalGrid(context, { width, height, color }) {
  context.save();
  context.strokeStyle = color;
  context.lineWidth = 1;
  for (let x = 80; x < width - 80; x += 120) {
    context.beginPath();
    context.moveTo(x, 118);
    context.lineTo(x, height - 112);
    context.stroke();
  }
  for (let y = 150; y < height - 120; y += 120) {
    context.beginPath();
    context.moveTo(70, y);
    context.lineTo(width - 70, y);
    context.stroke();
  }
  context.restore();
}

function drawCanvaDeckChrome(context, { tag, deckTitle, index, pageCount, width, height, ink, accent, bodyFont, minimal = false }) {
  context.save();
  context.fillStyle = ink;
  context.font = `800 15px "${bodyFont}", sans-serif`;
  context.fillText("RENDERAI", 76, 72);
  context.fillStyle = accent;
  context.fillRect(76, 84, minimal ? 46 : 92, 4);
  context.font = `600 13px "${bodyFont}", sans-serif`;
  context.fillStyle = colorWithAlpha(ink, 0.62);
  context.fillText(sanitizeVisibleDeckText(tag, "SECCION"), 76, 112);
  const folio = `${String(index + 1).padStart(2, "0")} / ${String(pageCount).padStart(2, "0")}`;
  context.font = `700 16px "${bodyFont}", sans-serif`;
  context.fillStyle = colorWithAlpha(ink, 0.72);
  context.fillText(folio, width - 178, 74);
  if (!minimal) {
    context.font = `500 13px "${bodyFont}", sans-serif`;
    context.fillText(sanitizeVisibleDeckText(deckTitle, "Proyecto").slice(0, 72).toUpperCase(), 76, height - 68);
  }
  context.restore();
}

function drawCanvaTextPanel(context, { title, subtitle, bullets, x, y, width, ink, accent, titleFont, bodyFont, scale = 1, uppercase = false }) {
  const safeTitle = uppercase ? sanitizeVisibleDeckText(title, "Proyecto").toUpperCase() : sanitizeVisibleDeckText(title, "Proyecto");
  const safeSubtitle = sanitizeVisibleDeckText(subtitle, "");
  const safeBullets = safeArray(bullets).map((item) => sanitizeVisibleDeckText(item, "")).filter(Boolean).slice(0, 4);
  drawCanvasTextBlock(context, safeTitle, safeSubtitle, safeBullets, {
    x,
    y,
    width,
    titleSize: Math.round(74 * scale),
    subtitleSize: Math.round(24 * scale),
    bulletSize: Math.round(20 * scale),
    titleColor: ink,
    bodyColor: colorWithAlpha(ink, 0.78),
    accentColor: accent,
    titleFont,
    bodyFont,
  });
}

function colorWithAlpha(color, alpha) {
  if (!String(color).startsWith("#")) return color;
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function resolveBrochureCanvasMode(styleProfile, visualLayout) {
  const template = styleProfile.template;
  if (template === "poster" || template === "aurora" || template === "dune") return "poster";
  if (template === "folio" || template === "resort" || template === "ivory") return "folio";
  if (template === "magazine" || template === "atelier" || template === "manifest" || template === "velvet") return "magazine";
  if (template === "mosaic" || template === "gallery-wall" || template === "storyboard" || template === "prism") return "mosaic";
  if (template === "urban-grid" || template === "onyx" || template === "slate") return "urban";
  if (template === "technical-sheet") return "technical";
  if (template === "obsidian") return "poster";
  return visualLayout === "board" || visualLayout === "gallery" ? "mosaic" : visualLayout === "technical" ? "technical" : "monolith";
}

function drawEditorialPill(context, text, x, y, color, bodyFont = "Manrope") {
  const label = String(text || "").slice(0, 28).toUpperCase();
  context.save();
  context.font = `700 15px "${bodyFont}", sans-serif`;
  const textWidth = context.measureText(label).width;
  const padX = 18;
  const padY = 12;
  const pillW = textWidth + padX * 2 + 24;
  const pillH = 34;
  // Square accent dot at left
  context.fillStyle = color;
  context.fillRect(x, y - pillH + 8, 6, 6);
  // Thin baseline
  context.strokeStyle = color;
  context.lineWidth = 1.5;
  context.beginPath();
  context.moveTo(x + 14, y - pillH / 2 + 5);
  context.lineTo(x + 30, y - pillH / 2 + 5);
  context.stroke();
  // Label text
  context.fillStyle = color;
  context.font = `700 15px "${bodyFont}", sans-serif`;
  context.fillText(label, x + 42, y - pillH / 2 + 11);
  context.restore();
  return pillW + 10;
}

async function drawFeatureComposition(context, imageUrl, frame, accent) {
  // Soft drop shadow as a second card behind (editorial stacked feel)
  context.save();
  context.fillStyle = "rgba(20, 15, 11, 0.16)";
  roundRectPath(context, frame.x - 18, frame.y + 18, frame.width, frame.height, 42);
  context.fill();
  context.restore();
  // Gradient overlay on top of the image for readability
  context.save();
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, 42);
  context.clip();
  const overlay = context.createLinearGradient(frame.x, frame.y, frame.x, frame.y + frame.height);
  overlay.addColorStop(0, "rgba(10, 6, 2, 0)");
  overlay.addColorStop(0.55, "rgba(10, 6, 2, 0)");
  overlay.addColorStop(1, "rgba(8, 4, 0, 0.55)");
  context.fillStyle = overlay;
  context.fillRect(frame.x, frame.y, frame.width, frame.height);
  context.restore();
  // Accent marker bottom-left
  context.fillStyle = accent;
  context.fillRect(frame.x + 28, frame.y + frame.height - 110, 160, 4);
  context.fillStyle = "rgba(255,255,255,0.86)";
  context.fillRect(frame.x + 28, frame.y + frame.height - 96, 60, 2);
}

async function drawSplitComposition(context, imageUrl, frame) {
  context.fillStyle = "rgba(255,255,255,0.28)";
  roundRectPath(context, frame.x + 22, frame.y + 22, frame.width - 44, frame.height - 44, 28);
  context.strokeStyle = "rgba(255,255,255,0.34)";
  context.stroke();
}

async function drawVisualArrangement(context, imageUrl, frame, options = {}) {
  const arrangement = String(options.arrangement || "single");
  const palette = unique(safeArray(options.palette)).slice(0, 5);
  const accent = options.accent || palette[0] || "#8b6a4a";
  const radius = Number(options.radius || 28);
  const language = options.language || state.settings.brochureLanguage || "es";
  const gutter = Math.max(12, Math.round(Math.min(frame.width, frame.height) * 0.028));

  if (arrangement === "collage") {
    const boardOptions = {
      x: frame.x,
      y: frame.y,
      width: frame.width,
      height: frame.height,
      palette,
      mode: "board",
      language,
    };
    if (options.noText) await drawCleanMoodBoard(context, imageUrl, boardOptions);
    else await drawBoardComposition(context, imageUrl, boardOptions);
    return;
  }

  if (arrangement === "single") {
    await drawRoundedImageFrame(context, imageUrl, frame, radius);
    return;
  }

  const variants = await buildBoardImageVariants(imageUrl);
  const colorSet = palette.length ? palette : [accent, colorMixHex(accent, "#ffffff", 0.5), colorMixHex(accent, "#111111", 0.16)];

  if (arrangement === "pair") {
    const horizontal = frame.width >= frame.height;
    const first = horizontal
      ? { x: frame.x, y: frame.y, width: (frame.width - gutter) * 0.58, height: frame.height }
      : { x: frame.x, y: frame.y, width: frame.width, height: (frame.height - gutter) * 0.56 };
    const second = horizontal
      ? { x: frame.x + frame.width - ((frame.width - gutter) * 0.42), y: frame.y, width: (frame.width - gutter) * 0.42, height: frame.height }
      : { x: frame.x, y: frame.y + frame.height - ((frame.height - gutter) * 0.44), width: frame.width, height: (frame.height - gutter) * 0.44 };
    await drawRoundedImageFrame(context, variants[0] || imageUrl, first, radius);
    await drawRoundedImageFrame(context, variants[1] || variants[0] || imageUrl, second, Math.max(18, radius - 6));
    drawArrangementAccent(context, second, colorSet[1] || accent, horizontal ? "vertical" : "horizontal");
    return;
  }

  if (arrangement === "duplicate") {
    const backFrame = {
      x: frame.x + Math.round(frame.width * 0.06),
      y: frame.y + Math.round(frame.height * 0.05),
      width: frame.width * 0.78,
      height: frame.height * 0.78,
    };
    const frontFrame = {
      x: frame.x + Math.round(frame.width * 0.28),
      y: frame.y + Math.round(frame.height * 0.2),
      width: frame.width * 0.62,
      height: frame.height * 0.62,
    };
    context.save();
    context.globalAlpha = 0.7;
    await drawRoundedImageFrame(context, variants[1] || variants[0] || imageUrl, backFrame, Math.max(18, radius - 10));
    context.restore();
    await drawRoundedImageFrame(context, variants[0] || imageUrl, frontFrame, radius);
    drawArrangementAccent(context, frontFrame, accent, "corner");
    return;
  }

  if (arrangement === "mirror") {
    const leadFrame = {
      x: frame.x,
      y: frame.y + Math.round(frame.height * 0.04),
      width: frame.width * 0.54,
      height: frame.height * 0.9,
    };
    const mirrorFrame = {
      x: frame.x + frame.width * 0.46,
      y: frame.y + Math.round(frame.height * 0.12),
      width: frame.width * 0.42,
      height: frame.height * 0.72,
    };
    await drawRoundedImageFrame(context, variants[0] || imageUrl, leadFrame, radius);
    context.save();
    context.globalAlpha = 0.92;
    await drawMirroredRoundedImageFrame(context, variants[2] || variants[0] || imageUrl, mirrorFrame, Math.max(18, radius - 8));
    context.restore();
    drawArrangementAccent(context, mirrorFrame, colorSet[1] || accent, "vertical");
    return;
  }

  if (arrangement === "triptych") {
    const segmentWidth = (frame.width - (gutter * 2)) / 3;
    for (let index = 0; index < 3; index += 1) {
      await drawRoundedImageFrame(context, variants[index % variants.length] || imageUrl, {
        x: frame.x + (index * (segmentWidth + gutter)),
        y: frame.y,
        width: segmentWidth,
        height: frame.height,
      }, Math.max(16, radius - 10));
    }
    return;
  }

  if (arrangement === "divisions") {
    const topFrame = {
      x: frame.x,
      y: frame.y,
      width: frame.width * 0.6,
      height: frame.height * 0.58,
    };
    const rightTop = {
      x: frame.x + (frame.width * 0.64),
      y: frame.y,
      width: frame.width * 0.36,
      height: frame.height * 0.28,
    };
    const rightBottom = {
      x: frame.x + (frame.width * 0.64),
      y: frame.y + (frame.height * 0.34),
      width: frame.width * 0.36,
      height: frame.height * 0.24,
    };
    const bottomFrame = {
      x: frame.x,
      y: frame.y + frame.height * 0.64,
      width: frame.width,
      height: frame.height * 0.36,
    };
    await drawRoundedImageFrame(context, variants[0] || imageUrl, topFrame, radius);
    await drawRoundedImageFrame(context, variants[1] || variants[0] || imageUrl, rightTop, Math.max(16, radius - 8));
    await drawRoundedImageFrame(context, variants[2] || variants[0] || imageUrl, rightBottom, Math.max(16, radius - 10));
    await drawRoundedImageFrame(context, variants[3] || variants[0] || imageUrl, bottomFrame, Math.max(18, radius - 8));
    drawArrangementAccent(context, bottomFrame, colorSet[2] || accent, "horizontal");
    return;
  }

  await drawRoundedImageFrame(context, imageUrl, frame, radius);
}

async function drawCleanMoodBoard(context, imageUrl, options) {
  const { x, y, width, height, palette, accent = safeArray(palette)[0] || "#8b6a4a", radius = 28 } = options;
  const variants = await buildBoardImageVariants(imageUrl);
  const showLabels = Boolean(options.showLabels);
  const materialLabels = unique([
    ...safeArray(options.materials),
    ...safeArray(getPdfDeckAnalysis()?.materials),
    "madera calida",
    "piedra natural",
    "concreto pulido",
    "metal grafito",
    "vidrio claro",
    "vegetacion tropical",
  ]).map((item) => toMoodBoardLabel(item)).filter(Boolean).slice(0, 7);
  const boardPalette = unique(safeArray(palette).length ? safeArray(palette) : getSuggestedPalette(getPdfDeckAnalysis())).slice(0, 6);
  context.save();
  roundRectPath(context, x, y, width, height, radius);
  context.clip();
  const bg = context.createLinearGradient(x, y, x + width, y + height);
  bg.addColorStop(0, "#f8f6f0");
  bg.addColorStop(0.48, colorMixHex(accent, "#ffffff", 0.86));
  bg.addColorStop(1, "#ebe7dc");
  context.fillStyle = bg;
  context.fillRect(x, y, width, height);

  drawMoodBoardPaperTexture(context, { x, y, width, height, accent });

  const projectFrame = {
    x: x + width * 0.52,
    y: y + height * 0.08,
    width: width * 0.38,
    height: height * 0.42,
  };
  await drawRoundedImageFrame(context, variants[0] || imageUrl, projectFrame, Math.min(projectFrame.width, projectFrame.height) * 0.24);
  context.save();
  const photoGlow = context.createRadialGradient(
    projectFrame.x + projectFrame.width * 0.55,
    projectFrame.y + projectFrame.height * 0.45,
    projectFrame.width * 0.1,
    projectFrame.x + projectFrame.width * 0.55,
    projectFrame.y + projectFrame.height * 0.45,
    projectFrame.width * 0.72
  );
  photoGlow.addColorStop(0, "rgba(255,255,255,0)");
  photoGlow.addColorStop(1, "rgba(255,255,255,0.28)");
  context.fillStyle = photoGlow;
  roundRectPath(context, projectFrame.x, projectFrame.y, projectFrame.width, projectFrame.height, Math.min(projectFrame.width, projectFrame.height) * 0.24);
  context.fill();
  context.restore();
  if (showLabels) {
    context.fillStyle = "rgba(255,255,255,0.86)";
    roundRectPath(context, projectFrame.x + projectFrame.width * 0.08, projectFrame.y + projectFrame.height - 44, projectFrame.width * 0.60, 30, 999);
    context.fill();
    context.fillStyle = "rgba(24,20,17,0.76)";
    context.font = `800 ${Math.max(10, Math.round(width * 0.012))}px "${options.bodyFont || state.settings.bodyFont || "Manrope"}", sans-serif`;
    context.fillText("REFERENCIA", projectFrame.x + projectFrame.width * 0.13, projectFrame.y + projectFrame.height - 24);
  }

  const sampleFrames = [
    { x: x + width * 0.07, y: y + height * 0.09, width: width * 0.20, height: height * 0.46, r: 7, label: materialLabels[0] || "MADERA", tint: boardPalette[2], material: "wood" },
    { x: x + width * 0.29, y: y + height * 0.12, width: width * 0.24, height: height * 0.26, r: 6, label: materialLabels[1] || "PIEDRA", tint: boardPalette[3], material: "stone" },
    { x: x + width * 0.46, y: y + height * 0.34, width: width * 0.18, height: height * 0.24, r: 6, label: materialLabels[2] || "CONCRETO", tint: boardPalette[4], material: "concrete" },
    { x: x + width * 0.34, y: y + height * 0.46, width: width * 0.21, height: height * 0.18, r: 6, label: materialLabels[3] || "METAL", tint: boardPalette[0], material: "metal", rotate: -0.02 },
    { x: x + width * 0.10, y: y + height * 0.66, width: width * 0.23, height: height * 0.20, r: 6, label: materialLabels[4] || "VIDRIO", tint: boardPalette[3], material: "glass" },
    { x: x + width * 0.60, y: y + height * 0.58, width: width * 0.18, height: height * 0.22, r: 999, label: materialLabels[5] || "VEGETACION", tint: boardPalette[4], material: "vegetation" },
    { x: x + width * 0.75, y: y + height * 0.58, width: width * 0.14, height: height * 0.28, r: 6, label: materialLabels[6] || "TEXTIL", tint: boardPalette[1], material: "fabric" },
  ];

  for (let i = 0; i < sampleFrames.length; i += 1) {
    const frame = sampleFrames[i];
    await drawMoodBoardMaterialTile(context, "", frame, {
      label: showLabels ? frame.label : "",
      tint: frame.tint,
      material: frame.material,
      bodyFont: options.bodyFont || state.settings.bodyFont || "Manrope",
      accent,
      rotate: frame.rotate || 0,
    });
  }

  const swatchX = x + width * 0.07;
  const swatchY = y + height * 0.58;
  boardPalette.slice(0, 5).forEach((color, index) => {
    context.save();
    context.fillStyle = "rgba(16,12,8,0.14)";
    context.beginPath();
    context.arc(swatchX + index * 58 + 3, swatchY + 3, 23, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = color;
    context.beginPath();
    context.arc(swatchX + index * 58, swatchY, 23, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(255,255,255,0.72)";
    context.lineWidth = 2;
    context.stroke();
    context.restore();
  });

  if (showLabels) {
    context.fillStyle = colorMixHex(accent, "#111111", 0.16);
    roundRectPath(context, x + width * 0.48, y + height * 0.40, width * 0.17, height * 0.055, 999);
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.82)";
    context.font = `700 ${Math.max(12, Math.round(width * 0.016))}px "${state.settings.bodyFont || "Manrope"}", sans-serif`;
    context.fillText("PALETA MATERIAL", x + width * 0.50, y + height * 0.435);
  }

  context.fillStyle = colorWithAlpha(accent, 0.7);
  context.fillRect(x + width * 0.08, y + height * 0.93, width * 0.36, 7);
  context.fillStyle = "rgba(255,255,255,0.5)";
  context.beginPath();
  context.ellipse(x + width * 0.82, y + height * 0.16, width * 0.22, height * 0.085, -0.25, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.strokeStyle = "rgba(0,0,0,0.12)";
  context.lineWidth = 1;
  roundRectPath(context, x, y, width, height, radius);
  context.stroke();
}

function toMoodBoardLabel(value) {
  const text = sanitizeVisibleDeckText(String(value || ""), "")
    .replace(/\b(calida|natural|aparente|claro|oscuro|tropical|premium|mate|grafito)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  return text.split(" ").slice(0, 2).join(" ").toUpperCase();
}

function drawMoodBoardPaperTexture(context, { x, y, width, height, accent }) {
  context.save();
  context.globalAlpha = 0.14;
  context.strokeStyle = colorMixHex(accent, "#ffffff", 0.64);
  context.lineWidth = 1;
  for (let i = 0; i < 16; i += 1) {
    const yy = y + (height * (i + 1)) / 18;
    context.beginPath();
    context.moveTo(x + width * 0.04, yy);
    context.bezierCurveTo(x + width * 0.26, yy - 16, x + width * 0.58, yy + 18, x + width * 0.96, yy - 8);
    context.stroke();
  }
  context.restore();
}

async function drawMoodBoardMaterialTile(context, imageUrl, frame, options = {}) {
  const { label = "", tint = "", accent = "#8b6a4a", bodyFont = "Manrope", rotate = 0, material = "" } = options;
  const cx = frame.x + frame.width / 2;
  const cy = frame.y + frame.height / 2;
  context.save();
  context.translate(cx, cy);
  context.rotate(rotate);
  context.translate(-cx, -cy);
  context.fillStyle = "rgba(20, 14, 8, 0.18)";
  roundRectPath(context, frame.x + 8, frame.y + 12, frame.width, frame.height, frame.r);
  context.fill();
  context.save();
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, frame.r);
  context.clip();
  if (imageUrl) {
    await drawRoundedImageFrame(context, imageUrl, frame, frame.r);
  } else {
    drawMoodBoardMaterialPattern(context, frame, {
      material: material || inferMoodBoardMaterialFamily(label),
      tint,
      accent,
    });
  }
  context.restore();
  if (tint && imageUrl) {
    context.save();
    roundRectPath(context, frame.x, frame.y, frame.width, frame.height, frame.r);
    context.clip();
    context.globalAlpha = 0.16;
    context.fillStyle = tint;
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    context.restore();
  }
  context.strokeStyle = colorWithAlpha(accent, 0.42);
  context.lineWidth = 2;
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, frame.r);
  context.stroke();
  if (label) {
    context.fillStyle = "rgba(255,255,255,0.88)";
    roundRectPath(context, frame.x + 16, frame.y + frame.height - 44, Math.min(frame.width - 32, 178), 30, 999);
    context.fill();
    context.fillStyle = "rgba(24,20,17,0.78)";
    context.font = `800 12px "${bodyFont}", sans-serif`;
    context.fillText(label.slice(0, 18), frame.x + 30, frame.y + frame.height - 24);
  }
  context.restore();
}

function inferMoodBoardMaterialFamily(label) {
  const text = String(label || "").toLowerCase();
  if (/madera|wood|walnut|oak/.test(text)) return "wood";
  if (/piedra|stone|marble|granito|mineral/.test(text)) return "stone";
  if (/concreto|cement|hormigon/.test(text)) return "concrete";
  if (/metal|grafito|bronce|steel|acero/.test(text)) return "metal";
  if (/vidrio|glass/.test(text)) return "glass";
  if (/veget|plant|verde|green/.test(text)) return "vegetation";
  if (/textil|tela|fabric|fibra/.test(text)) return "fabric";
  return "stone";
}

function drawMoodBoardMaterialPattern(context, frame, options = {}) {
  const material = options.material || "stone";
  const accent = options.accent || "#8b6a4a";
  const tint = options.tint || accent;
  const base = colorMixHex(tint, "#f4efe6", 0.58);
  const dark = colorMixHex(tint, "#1f1812", 0.28);
  const light = colorMixHex(tint, "#ffffff", 0.72);

  if (material === "wood") {
    const grad = context.createLinearGradient(frame.x, frame.y, frame.x + frame.width, frame.y);
    grad.addColorStop(0, colorMixHex("#c99c63", tint, 0.25));
    grad.addColorStop(0.55, colorMixHex("#8b5f35", tint, 0.2));
    grad.addColorStop(1, colorMixHex("#d8b37c", tint, 0.25));
    context.fillStyle = grad;
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    context.strokeStyle = "rgba(73, 42, 20, 0.24)";
    context.lineWidth = 1.2;
    for (let i = 0; i < 26; i += 1) {
      const xx = frame.x + (frame.width * i) / 25;
      context.beginPath();
      context.moveTo(xx, frame.y);
      context.bezierCurveTo(xx + Math.sin(i) * 18, frame.y + frame.height * 0.28, xx - Math.cos(i * 1.3) * 14, frame.y + frame.height * 0.68, xx + Math.sin(i * 2) * 8, frame.y + frame.height);
      context.stroke();
    }
    return;
  }

  if (material === "stone") {
    context.fillStyle = colorMixHex("#e8e2d7", tint, 0.14);
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    context.strokeStyle = "rgba(113, 98, 78, 0.28)";
    for (let i = 0; i < 12; i += 1) {
      context.lineWidth = i % 3 === 0 ? 2.2 : 1;
      context.beginPath();
      const yy = frame.y + (frame.height * (i + 1)) / 13;
      context.moveTo(frame.x - 20, yy);
      context.bezierCurveTo(frame.x + frame.width * 0.25, yy - 40, frame.x + frame.width * 0.54, yy + 54, frame.x + frame.width + 20, yy - 24);
      context.stroke();
    }
    context.fillStyle = "rgba(255,255,255,0.28)";
    context.fillRect(frame.x, frame.y, frame.width, frame.height * 0.24);
    return;
  }

  if (material === "concrete") {
    context.fillStyle = colorMixHex("#a8a49a", tint, 0.24);
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    for (let i = 0; i < 180; i += 1) {
      const px = frame.x + ((i * 37) % Math.max(1, frame.width));
      const py = frame.y + ((i * 53) % Math.max(1, frame.height));
      context.fillStyle = i % 2 ? "rgba(255,255,255,0.20)" : "rgba(35,30,24,0.14)";
      context.fillRect(px, py, (i % 5) + 1, (i % 4) + 1);
    }
    return;
  }

  if (material === "metal") {
    const grad = context.createLinearGradient(frame.x, frame.y, frame.x + frame.width, frame.y + frame.height);
    grad.addColorStop(0, colorMixHex(dark, "#000000", 0.18));
    grad.addColorStop(0.45, colorMixHex("#d7b16f", tint, 0.28));
    grad.addColorStop(0.52, light);
    grad.addColorStop(1, colorMixHex(dark, "#000000", 0.35));
    context.fillStyle = grad;
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    context.fillStyle = "rgba(255,255,255,0.18)";
    context.fillRect(frame.x + frame.width * 0.08, frame.y, frame.width * 0.08, frame.height);
    return;
  }

  if (material === "glass") {
    const grad = context.createLinearGradient(frame.x, frame.y, frame.x + frame.width, frame.y + frame.height);
    grad.addColorStop(0, "rgba(232,242,239,0.85)");
    grad.addColorStop(0.48, colorWithAlpha(light, 0.82));
    grad.addColorStop(1, "rgba(172,192,184,0.62)");
    context.fillStyle = grad;
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    context.strokeStyle = "rgba(255,255,255,0.72)";
    context.lineWidth = 7;
    context.beginPath();
    context.moveTo(frame.x + frame.width * 0.12, frame.y + frame.height * 0.1);
    context.lineTo(frame.x + frame.width * 0.92, frame.y + frame.height * 0.78);
    context.stroke();
    return;
  }

  if (material === "vegetation") {
    context.fillStyle = colorMixHex("#2f442f", tint, 0.28);
    context.fillRect(frame.x, frame.y, frame.width, frame.height);
    for (let i = 0; i < 15; i += 1) {
      const px = frame.x + frame.width * (0.16 + ((i * 0.23) % 0.74));
      const py = frame.y + frame.height * (0.14 + ((i * 0.31) % 0.72));
      context.save();
      context.translate(px, py);
      context.rotate((i % 6) * 0.48);
      context.fillStyle = i % 2 ? "rgba(145, 170, 126, 0.70)" : "rgba(58, 88, 57, 0.82)";
      context.beginPath();
      context.ellipse(0, 0, frame.width * 0.08, frame.height * 0.025, 0, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }
    return;
  }

  context.fillStyle = base;
  context.fillRect(frame.x, frame.y, frame.width, frame.height);
  context.strokeStyle = colorWithAlpha(dark, 0.24);
  context.lineWidth = 2;
  for (let i = 0; i < 10; i += 1) {
    const yy = frame.y + (frame.height * i) / 9;
    context.beginPath();
    context.moveTo(frame.x, yy);
    context.lineTo(frame.x + frame.width, yy + Math.sin(i) * 8);
    context.stroke();
  }
}

function drawArrangementAccent(context, frame, color, mode = "vertical") {
  context.save();
  context.fillStyle = colorMixHex(color, "#ffffff", 0.24);
  if (mode === "horizontal") {
    context.fillRect(frame.x + 18, frame.y + frame.height - 14, Math.max(120, frame.width * 0.32), 6);
  } else if (mode === "corner") {
    context.fillRect(frame.x + 20, frame.y + 20, Math.max(90, frame.width * 0.22), 5);
    context.fillRect(frame.x + frame.width - 26, frame.y + 18, 6, Math.max(70, frame.height * 0.16));
  } else {
    context.fillRect(frame.x + frame.width - 14, frame.y + 18, 6, Math.max(80, frame.height * 0.26));
  }
  context.restore();
}

async function drawMirroredRoundedImageFrame(context, imageUrl, frame, radius = 28) {
  if (!imageUrl) {
    await drawRoundedImageFrame(context, imageUrl, frame, radius);
    return;
  }
  const image = await loadImage(imageUrl).catch(() => null);
  if (!image) return;
  context.save();
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, radius);
  context.clip();
  context.translate(frame.x + frame.width, frame.y);
  context.scale(-1, 1);
  drawCoverImage(context, image, { x: 0, y: 0, width: frame.width, height: frame.height });
  context.restore();
  context.strokeStyle = "rgba(255,255,255,0.4)";
  context.lineWidth = 2;
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, radius);
  context.stroke();
}

function drawStyleIdentity(context, styleProfile, palette, width, height) {
  const accent = palette[0] || styleProfile.accent || "#8b6a4a";
  const ink = styleProfile.ink || "#1d1712";
  const soft = colorMixHex(accent, "#ffffff", 0.76);
  const wash = colorMixHex(accent, "#ffffff", 0.9);
  context.save();
  context.lineWidth = 2;

  switch (styleProfile.template) {
    case "monolith":
      context.fillStyle = "rgba(28, 23, 19, 0.06)";
      context.fillRect(52, 140, 86, height - 260);
      break;
    case "folio":
      context.fillStyle = colorMixHex(accent, "#ffffff", 0.62);
      context.fillRect(72, height - 146, 320, 10);
      break;
    case "magazine":
      context.fillStyle = "rgba(255,255,255,0.36)";
      context.fillRect(width - 184, 140, 44, height - 280);
      break;
    case "poster":
      context.strokeStyle = colorMixHex(accent, "#ffffff", 0.48);
      roundRectPath(context, 64, 142, width - 128, height - 248, 34);
      context.stroke();
      break;
    case "mosaic":
      context.fillStyle = "rgba(255,255,255,0.3)";
      roundRectPath(context, width - 302, 116, 210, 128, 30);
      context.fill();
      roundRectPath(context, width - 240, 256, 150, 100, 28);
      context.fill();
      break;
    case "gallery-wall":
      context.strokeStyle = "rgba(0,0,0,0.08)";
      for (let offset = 0; offset < 3; offset += 1) {
        const vx = 460 + (offset * 170);
        context.beginPath();
        context.moveTo(vx, 168);
        context.lineTo(vx, height - 160);
        context.stroke();
      }
      break;
    case "storyboard":
      context.fillStyle = wash;
      for (let offset = 0; offset < 4; offset += 1) {
        roundRectPath(context, 92 + (offset * 92), 148, 72, 16, 8);
        context.fill();
      }
      break;
    case "atelier":
      context.strokeStyle = colorMixHex(accent, "#ffffff", 0.36);
      context.beginPath();
      context.ellipse(width - 230, 230, 120, 88, 0.2, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.ellipse(width - 230, 230, 156, 116, 0.2, 0, Math.PI * 2);
      context.stroke();
      break;
    case "urban-grid":
      context.strokeStyle = "rgba(24, 28, 35, 0.12)";
      for (let offset = 0; offset < 6; offset += 1) {
        const lineX = 120 + (offset * 220);
        context.beginPath();
        context.moveTo(lineX, 144);
        context.lineTo(lineX, height - 130);
        context.stroke();
      }
      break;
    case "technical-sheet":
      context.strokeStyle = "rgba(103, 77, 55, 0.12)";
      for (let offset = 0; offset < 5; offset += 1) {
        const lineY = 174 + (offset * 144);
        context.beginPath();
        context.moveTo(80, lineY);
        context.lineTo(width - 80, lineY);
        context.stroke();
      }
      break;
    case "resort":
      context.fillStyle = colorMixHex(accent, "#ffffff", 0.86);
      roundRectPath(context, width - 360, 116, 240, 118, 50);
      context.fill();
      break;
    case "manifest":
      context.fillStyle = colorMixHex(accent, "#ffffff", 0.5);
      context.translate(width - 260, 110);
      context.rotate(-0.34);
      context.fillRect(0, 0, 240, 18);
      context.setTransform(1, 0, 0, 1, 0, 0);
      break;
    case "obsidian":
      context.fillStyle = "rgba(201, 169, 110, 0.08)";
      context.fillRect(52, 140, width - 104, height - 260);
      context.strokeStyle = "rgba(201, 169, 110, 0.18)";
      roundRectPath(context, 72, 152, width - 144, height - 282, 38);
      context.stroke();
      break;
    case "ivory":
      context.strokeStyle = "rgba(0,0,0,0.04)";
      context.lineWidth = 1;
      context.strokeRect(60, 148, width - 120, height - 276);
      break;
    case "aurora": {
      const auroraGradient = context.createLinearGradient(0, 0, width, height);
      auroraGradient.addColorStop(0, "rgba(139, 126, 200, 0.06)");
      auroraGradient.addColorStop(0.5, "rgba(200, 160, 220, 0.04)");
      auroraGradient.addColorStop(1, "rgba(120, 180, 220, 0.06)");
      context.fillStyle = auroraGradient;
      context.fillRect(0, 0, width, height);
      context.beginPath();
      context.ellipse(width * 0.7, height * 0.3, 300, 200, 0.3, 0, Math.PI * 2);
      context.fillStyle = "rgba(167, 139, 250, 0.04)";
      context.fill();
      break;
    }
    case "onyx":
      context.strokeStyle = "rgba(0, 212, 170, 0.14)";
      context.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const lineX = 140 + (i * 180);
        context.beginPath();
        context.moveTo(lineX, 140);
        context.lineTo(lineX, height - 130);
        context.stroke();
      }
      for (let i = 0; i < 5; i++) {
        const lineY = 160 + (i * 160);
        context.beginPath();
        context.moveTo(80, lineY);
        context.lineTo(width - 80, lineY);
        context.stroke();
      }
      break;
    case "velvet":
      context.fillStyle = "rgba(158, 90, 110, 0.06)";
      context.beginPath();
      context.ellipse(width * 0.75, height * 0.25, 280, 200, -0.2, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.ellipse(width * 0.25, height * 0.75, 220, 160, 0.3, 0, Math.PI * 2);
      context.fill();
      break;
    case "prism":
      context.strokeStyle = "rgba(124, 107, 184, 0.1)";
      context.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        context.beginPath();
        context.moveTo(width * 0.5, height * 0.1);
        context.lineTo(width * (i / 5), height * 0.95);
        context.stroke();
      }
      break;
    case "dune":
      context.fillStyle = colorMixHex(accent, "#ffffff", 0.82);
      roundRectPath(context, 72, height - 188, 380, 68, 34);
      context.fill();
      context.fillStyle = "rgba(196, 154, 108, 0.05)";
      context.beginPath();
      context.ellipse(width * 0.6, height * 0.4, 400, 250, -0.15, 0, Math.PI * 2);
      context.fill();
      break;
    case "slate":
      context.fillStyle = "rgba(106, 112, 128, 0.06)";
      context.fillRect(64, 140, 120, height - 268);
      context.fillRect(width - 184, 140, 120, height - 268);
      context.strokeStyle = "rgba(106, 112, 128, 0.12)";
      context.lineWidth = 2;
      context.strokeRect(64, 140, width - 128, height - 268);
      break;
    default:
      break;
  }

  if (styleProfile.ornament === "graphic") {
    context.fillStyle = colorMixHex(ink, "#ffffff", 0.82);
    context.fillRect(width - 124, height - 142, 28, 28);
    context.fillRect(width - 88, height - 106, 20, 20);
  } else if (styleProfile.ornament === "spread") {
    context.strokeStyle = "rgba(255,255,255,0.42)";
    roundRectPath(context, 92, 116, width - 184, height - 232, 42);
    context.stroke();
  } else if (styleProfile.ornament === "stacked") {
    context.fillStyle = "rgba(255,255,255,0.24)";
    roundRectPath(context, 110, 164, 180, 94, 22);
    context.fill();
    roundRectPath(context, 134, 188, 180, 94, 22);
    context.fill();
  }

  context.restore();
}

function resolveSlideLayoutForPlacement(layout, placement) {
  if (placement === "full") return "feature";
  if (placement === "center") return layout === "technical" ? "technical" : "feature";
  if (placement === "top" || placement === "bottom") return layout === "technical" ? "technical" : "board";
  if ((placement === "left" || placement === "right") && layout === "feature") return "split";
  return layout;
}

async function prepareSlideVisualVariant(imageUrl, placementOrOptions, legacyTreatment) {
  if (!imageUrl) return imageUrl;
  const options = typeof placementOrOptions === "object"
    ? placementOrOptions
    : { placement: placementOrOptions, treatment: legacyTreatment };
  let current = imageUrl;
  const framing = options.framing || "clean";
  if (framing === "zoom") {
    current = await cropDataUrl(current, { x: 18, y: 18, width: 56, height: 56 }, 1800).catch(() => current);
  } else if (framing === "cropped") {
    current = await cropDataUrl(current, { x: 8, y: 6, width: 72, height: 82 }, 1800).catch(() => current);
  } else if (framing === "blurred") {
    current = await transformDataUrl(current, "blur(10px) saturate(0.86) brightness(1.02)", 1800).catch(() => current);
  }

  const filters = {
    editorial: "contrast(1.08) saturate(1.02) brightness(1.01)",
    warm: "contrast(1.05) saturate(1.08) sepia(0.08)",
    moody: "contrast(1.12) brightness(0.9) saturate(0.92)",
    linear: "grayscale(1) contrast(1.18) brightness(1.03)",
    technical: "grayscale(0.92) contrast(1.1) brightness(1.01)",
  };
  const representationFilters = {
    photographic: "",
    "three-dimensional": "saturate(1.05) contrast(1.04)",
    "linear-drawing": "grayscale(1) contrast(1.28) brightness(1.04)",
    "mixed-media": "contrast(1.1) saturate(0.92) brightness(1.02)",
  };
  const finishFilters = {
    crisp: "contrast(1.05) saturate(1.02)",
    "filmic-grain": "contrast(1.02) saturate(0.98)",
    "soft-film": "contrast(0.96) brightness(1.03) saturate(0.95)",
    "contrast-rich": "contrast(1.14) brightness(0.98)",
  };
  const treatment = options.treatment || "master";
  const filter = [filters[treatment], representationFilters[options.representation], finishFilters[options.finish]]
    .filter(Boolean)
    .join(" ");
  if (filter) {
    current = await transformDataUrl(current, filter, 1800).catch(() => current);
  }
  return current;
}

async function transformDataUrl(sourceUrl, filter, maxSide = 1800) {
  const image = await loadImage(sourceUrl);
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight, 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  context.filter = filter;
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.92);
}

async function drawBoardComposition(context, imageUrl, options) {
  const { x, y, width, height, palette, mode, language = "es" } = options;
  const images = await buildBoardImageVariants(imageUrl);
  const accent = safeArray(palette)[0] || "#8b6a4a";
  const soft = colorMixHex(accent, "#ffffff", 0.78);
  const deep = colorMixHex(accent, "#120b07", 0.32);

  // Textured paper background for the board area
  context.save();
  roundRectPath(context, x, y, width, height, 18);
  context.clip();
  const paperGrad = context.createLinearGradient(x, y, x + width, y + height);
  paperGrad.addColorStop(0, "#f6efe4");
  paperGrad.addColorStop(0.5, "#efe7d9");
  paperGrad.addColorStop(1, "#e8dccc");
  context.fillStyle = paperGrad;
  context.fillRect(x, y, width, height);
  // Soft paper grain using noise circles
  for (let i = 0; i < 80; i += 1) {
    const gx = x + Math.random() * width;
    const gy = y + Math.random() * height;
    const gr = 2 + Math.random() * 6;
    context.fillStyle = `rgba(${130 + Math.random() * 40}, ${108 + Math.random() * 40}, ${82 + Math.random() * 30}, 0.04)`;
    context.beginPath();
    context.arc(gx, gy, gr, 0, Math.PI * 2);
    context.fill();
  }
  // Faint graph lines
  context.strokeStyle = "rgba(120, 90, 62, 0.06)";
  context.lineWidth = 1;
  for (let gy = y + 40; gy < y + height; gy += 44) {
    context.beginPath();
    context.moveTo(x + 8, gy);
    context.lineTo(x + width - 8, gy);
    context.stroke();
  }
  context.restore();

  // Layered photo frames with subtle rotations (mood-board feel)
  const cellW = width;
  const cellH = height;
  const photoFrames = [
    { x: x + cellW * 0.04, y: y + cellH * 0.05, w: cellW * 0.44, h: cellH * 0.48, rot: -0.035, radius: 8, variant: 0 },
    { x: x + cellW * 0.50, y: y + cellH * 0.02, w: cellW * 0.44, h: cellH * 0.34, rot: 0.028, radius: 6, variant: 1 },
    { x: x + cellW * 0.52, y: y + cellH * 0.38, w: cellW * 0.30, h: cellH * 0.34, rot: -0.022, radius: 8, variant: 2 },
    { x: x + cellW * 0.82, y: y + cellH * 0.40, w: cellW * 0.16, h: cellH * 0.30, rot: 0.045, radius: 6, variant: 3 },
    { x: x + cellW * 0.08, y: y + cellH * 0.55, w: cellW * 0.34, h: cellH * 0.40, rot: 0.02, radius: 8, variant: 0 },
  ];

  for (const frame of photoFrames) {
    await drawPolaroidFrame(context, images[frame.variant % images.length], frame);
  }

  // Material swatches strip (real mood-board: fabrics, stones, materials)
  const swatchY = y + cellH * 0.74;
  const swatchH = cellH * 0.14;
  const swatchStartX = x + cellW * 0.46;
  const swatchCount = 5;
  const swatchW = (cellW * 0.52) / swatchCount - 8;
  const swatchColors = safeArray(palette).length >= swatchCount
    ? safeArray(palette).slice(0, swatchCount)
    : [accent, colorMixHex(accent, "#ffffff", 0.35), colorMixHex(accent, "#ffffff", 0.6), colorMixHex(accent, "#321911", 0.25), colorMixHex(accent, "#120b07", 0.42)];

  for (let i = 0; i < swatchCount; i += 1) {
    const sx = swatchStartX + i * (swatchW + 8);
    const tilt = ((i % 2 === 0) ? -1 : 1) * 0.018;
    context.save();
    context.translate(sx + swatchW / 2, swatchY + swatchH / 2);
    context.rotate(tilt);
    context.translate(-(sx + swatchW / 2), -(swatchY + swatchH / 2));
    // Shadow
    context.fillStyle = "rgba(20, 12, 8, 0.18)";
    roundRectPath(context, sx + 4, swatchY + 6, swatchW, swatchH, 6);
    context.fill();
    // Swatch
    context.fillStyle = swatchColors[i] || accent;
    roundRectPath(context, sx, swatchY, swatchW, swatchH, 6);
    context.fill();
    // Subtle highlight
    const hi = context.createLinearGradient(sx, swatchY, sx, swatchY + swatchH);
    hi.addColorStop(0, "rgba(255,255,255,0.22)");
    hi.addColorStop(0.5, "rgba(255,255,255,0)");
    hi.addColorStop(1, "rgba(0,0,0,0.14)");
    context.fillStyle = hi;
    roundRectPath(context, sx, swatchY, swatchW, swatchH, 6);
    context.fill();
    // Material code label
    context.fillStyle = "rgba(255,255,255,0.85)";
    context.font = '600 11px "Manrope", sans-serif';
    context.fillText(`#${String(i + 1).padStart(2, "0")}`, sx + 8, swatchY + swatchH - 10);
    context.restore();
  }

  // Masking tape accents on corners
  drawMaskingTape(context, x + cellW * 0.11, y + cellH * 0.02, 90, 26, -0.04, "rgba(210, 190, 140, 0.68)");
  drawMaskingTape(context, x + cellW * 0.62, y + cellH * 0.02, 110, 24, 0.05, "rgba(240, 215, 165, 0.62)");
  drawMaskingTape(context, x + cellW * 0.18, y + cellH * 0.55, 84, 22, 0.06, "rgba(200, 175, 130, 0.58)");

  // Notes card with palette label and keywords
  const noteX = x + cellW * 0.04;
  const noteY = y + cellH * 0.78;
  const noteW = cellW * 0.38;
  const noteH = cellH * 0.18;
  context.save();
  context.translate(noteX + noteW / 2, noteY + noteH / 2);
  context.rotate(-0.008);
  context.translate(-(noteX + noteW / 2), -(noteY + noteH / 2));
  context.fillStyle = "rgba(18, 14, 10, 0.22)";
  roundRectPath(context, noteX + 4, noteY + 6, noteW, noteH, 10);
  context.fill();
  context.fillStyle = "#fbf7ee";
  roundRectPath(context, noteX, noteY, noteW, noteH, 10);
  context.fill();
  context.strokeStyle = "rgba(120, 90, 62, 0.16)";
  context.lineWidth = 1;
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.32)";
  for (let i = 0; i < 5; i += 1) {
    context.beginPath();
    context.arc(noteX + 24 + i * 24, noteY + 28, 5 + (i % 2) * 2, 0, Math.PI * 2);
    context.fill();
  }
  const chipColors = safeArray(palette).length ? safeArray(palette) : [accent, deep, "#d5c7b8", "#f3ecdf"];
  chipColors.slice(0, 4).forEach((color, index) => {
    context.fillStyle = color;
    roundRectPath(context, noteX + 18 + index * 42, noteY + 48, 30, 30, 8);
    context.fill();
  });
  context.strokeStyle = accent;
  context.lineWidth = 3;
  context.beginPath();
  context.moveTo(noteX + 18, noteY + noteH - 18);
  context.lineTo(noteX + 96, noteY + noteH - 18);
  context.stroke();
  context.restore();
}

async function drawPolaroidFrame(context, imageUrl, frame) {
  const { x, y, w, h, rot = 0, radius = 8 } = frame;
  context.save();
  context.translate(x + w / 2, y + h / 2);
  context.rotate(rot);
  context.translate(-(x + w / 2), -(y + h / 2));

  // Soft shadow
  context.fillStyle = "rgba(12, 8, 4, 0.28)";
  roundRectPath(context, x + 6, y + 10, w, h, radius + 2);
  context.fill();

  // White matte/card
  context.fillStyle = "#fafafa";
  roundRectPath(context, x, y, w, h, radius);
  context.fill();

  // Image area inside matte (polaroid style: more bottom padding)
  const pad = Math.max(8, Math.min(w, h) * 0.035);
  const bottomPad = Math.max(pad * 2.4, Math.min(w, h) * 0.08);
  const imgFrame = {
    x: x + pad,
    y: y + pad,
    width: w - pad * 2,
    height: h - pad - bottomPad,
  };

  if (imageUrl) {
    const image = await loadImage(imageUrl).catch(() => null);
    if (image) {
      context.save();
      roundRectPath(context, imgFrame.x, imgFrame.y, imgFrame.width, imgFrame.height, Math.max(2, radius - 4));
      context.clip();
      drawCoverImage(context, image, imgFrame);
      context.restore();
    }
  } else {
    context.fillStyle = "#d9cfbf";
    roundRectPath(context, imgFrame.x, imgFrame.y, imgFrame.width, imgFrame.height, Math.max(2, radius - 4));
    context.fill();
  }

  // Subtle top highlight line on image area
  context.strokeStyle = "rgba(0,0,0,0.06)";
  context.lineWidth = 1;
  roundRectPath(context, imgFrame.x, imgFrame.y, imgFrame.width, imgFrame.height, Math.max(2, radius - 4));
  context.stroke();

  context.restore();
}

function drawMaskingTape(context, x, y, w, h, rot, color) {
  context.save();
  context.translate(x + w / 2, y + h / 2);
  context.rotate(rot);
  context.translate(-(x + w / 2), -(y + h / 2));
  const grad = context.createLinearGradient(x, y, x, y + h);
  grad.addColorStop(0, color);
  grad.addColorStop(0.5, colorMixHex(color.replace(/rgba?\([^)]+\)/, "#e6ca92"), "#ffffff", 0.2));
  grad.addColorStop(1, color);
  context.fillStyle = grad;
  context.fillRect(x, y, w, h);
  // Torn edges
  context.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 8; i += 1) {
    context.fillRect(x + (i * w) / 8, y - 2, w / 16, 4);
    context.fillRect(x + (i * w) / 8, y + h - 2, w / 16, 4);
  }
  context.restore();
}

async function drawTechnicalComposition(context, imageUrl, options) {
  const { x, y, width, height, accent } = options;
  context.strokeStyle = "rgba(103, 77, 55, 0.18)";
  context.lineWidth = 2;
  for (let offset = 0; offset <= 4; offset += 1) {
    const lineY = y + 80 + (offset * 110);
    context.beginPath();
    context.moveTo(x + 36, lineY);
    context.lineTo(x + width - 36, lineY);
    context.stroke();
  }
  for (let offset = 0; offset <= 5; offset += 1) {
    const lineX = x + 110 + (offset * 120);
    context.beginPath();
    context.moveTo(lineX, y + 36);
    context.lineTo(lineX, y + height - 36);
    context.stroke();
  }
  context.fillStyle = accent;
  context.fillRect(x + 24, y + height - 16, 220, 8);
}

async function buildBoardImageVariants(imageUrl) {
  const base = imageUrl || getMainImage()?.url || "";
  if (!base) return [""];
  const crops = [
    await cropDataUrl(base, { x: 0, y: 0, width: 100, height: 100 }, 1600).catch(() => base),
    await cropDataUrl(base, { x: 2, y: 4, width: 50, height: 40 }, 1600).catch(() => base),
    await cropDataUrl(base, { x: 42, y: 10, width: 46, height: 52 }, 1600).catch(() => base),
    await cropDataUrl(base, { x: 18, y: 42, width: 46, height: 42 }, 1600).catch(() => base),
    await cropDataUrl(base, { x: 6, y: 32, width: 38, height: 54 }, 1600).catch(() => base),
    await cropDataUrl(base, { x: 52, y: 50, width: 44, height: 44 }, 1600).catch(() => base),
  ];
  return crops.filter(Boolean);
}

async function drawRoundedImageFrame(context, imageUrl, frame, radius = 28) {
  if (!imageUrl) {
    context.fillStyle = "rgba(255,255,255,0.6)";
    roundRectPath(context, frame.x, frame.y, frame.width, frame.height, radius);
    context.fill();
    return;
  }
  const image = await loadImage(imageUrl).catch(() => null);
  if (!image) return;

  // Soft cast shadow beneath the image card for depth
  context.save();
  context.fillStyle = "rgba(14, 9, 4, 0.22)";
  roundRectPath(context, frame.x + 4, frame.y + 10, frame.width, frame.height, radius);
  context.fill();
  context.restore();

  context.save();
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, radius);
  context.clip();
  drawCoverImage(context, image, frame);
  // Subtle vignette for depth
  const vignette = context.createRadialGradient(
    frame.x + frame.width / 2,
    frame.y + frame.height / 2,
    Math.min(frame.width, frame.height) * 0.3,
    frame.x + frame.width / 2,
    frame.y + frame.height / 2,
    Math.max(frame.width, frame.height) * 0.75
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.18)");
  context.fillStyle = vignette;
  context.fillRect(frame.x, frame.y, frame.width, frame.height);
  context.restore();

  // Thin crisp edge instead of milky white stroke
  context.strokeStyle = "rgba(0,0,0,0.14)";
  context.lineWidth = 1;
  roundRectPath(context, frame.x, frame.y, frame.width, frame.height, radius);
  context.stroke();
}

function drawCanvasTextBlock(context, title, subtitle, bullets, options) {
  const { x, y, width, titleSize, subtitleSize, bulletSize, titleColor, bodyColor, accentColor, titleFont = "Cormorant Garamond", bodyFont = "Manrope" } = options;
  const safeTitle = sanitizeVisibleDeckText(title, "Proyecto arquitectonico");
  const safeSubtitle = sanitizeVisibleDeckText(subtitle, "");
  const safeBullets = safeArray(bullets).map((item) => sanitizeVisibleDeckText(item, "")).filter(Boolean).slice(0, 5);
  let cursorY = y;

  // Auto-fit large editorial titles so Canva-style covers never overlap or clip.
  context.fillStyle = titleColor;
  let fittedTitleSize = Math.max(34, Number(titleSize || 64));
  let titleLines = [];
  for (let attempt = 0; attempt < 12; attempt += 1) {
    context.font = `700 ${fittedTitleSize}px "${titleFont}", serif`;
    titleLines = wrapCanvasText(context, safeTitle, width).map((line) => fitCanvasLine(context, line, width));
    const hasOverflowLine = titleLines.some((line) => context.measureText(line).width > width + 1);
    if ((!hasOverflowLine && titleLines.length <= 4) || fittedTitleSize <= 40) break;
    fittedTitleSize -= 4;
  }
  titleLines = titleLines.slice(0, 4);
  if (titleLines.length === 4 && wrapCanvasText(context, safeTitle, width).length > 4) {
    titleLines[3] = fitCanvasLine(context, `${titleLines[3]}...`, width);
  }
  const titleLead = fittedTitleSize * 1.12;
  const firstBaseline = cursorY + fittedTitleSize * 0.9;
  titleLines.forEach((line, idx) => {
    context.fillText(line, x, firstBaseline + idx * titleLead);
  });

  cursorY = firstBaseline + Math.max(0, titleLines.length - 1) * titleLead + fittedTitleSize * 0.56 + 18;

  // Accent underline — short editorial rule + dot
  context.fillStyle = accentColor;
  context.fillRect(x, cursorY, 72, 4);
  context.beginPath();
  context.arc(x + 90, cursorY + 2, 3.5, 0, Math.PI * 2);
  context.fill();
  cursorY += 32;

  if (safeSubtitle) {
    context.fillStyle = bodyColor;
    context.font = `500 italic ${subtitleSize}px "${titleFont}", serif`;
    wrapCanvasText(context, safeSubtitle, width).forEach((line) => {
      context.fillText(line, x, cursorY);
      cursorY += subtitleSize * 1.42;
    });
    cursorY += 22;
  }

  context.font = `500 ${bulletSize}px "${bodyFont}", sans-serif`;
  safeBullets.forEach((bullet, bulletIndex) => {
    const bulletY = cursorY;
    // Custom numbered marker: 01 · bullet
    const marker = String(bulletIndex + 1).padStart(2, "0");
    context.fillStyle = accentColor;
    context.font = `700 ${Math.round(bulletSize * 0.82)}px "${bodyFont}", sans-serif`;
    context.fillText(marker, x, bulletY);

    const indent = Math.max(46, bulletSize * 2.2);
    context.fillStyle = bodyColor;
    context.font = `500 ${bulletSize}px "${bodyFont}", sans-serif`;
    const lines = wrapCanvasText(context, String(bullet || ""), width - indent);
    lines.forEach((line, lineIndex) => {
      context.fillText(line, x + indent, bulletY + lineIndex * bulletSize * 1.38);
    });
    cursorY = bulletY + Math.max(1, lines.length) * bulletSize * 1.38 + 14;
  });
}

function drawPaletteRail(context, palette, options) {
  const { x, y, swatchWidth, gap, showHex = true, bodyFont = "Manrope" } = options;
  const colors = unique(safeArray(palette)).slice(0, 5);
  const swatchHeight = 44;
  colors.forEach((color, index) => {
    const px = x + (index * (swatchWidth + gap));
    // Swatch
    context.fillStyle = color;
    roundRectPath(context, px, y, swatchWidth, swatchHeight, 6);
    context.fill();
    // Subtle edge
    context.strokeStyle = "rgba(0,0,0,0.12)";
    context.lineWidth = 1;
    roundRectPath(context, px, y, swatchWidth, swatchHeight, 6);
    context.stroke();
    // Hex label below
    if (showHex && color) {
      context.fillStyle = "rgba(40, 30, 22, 0.82)";
      context.font = `600 10px "${bodyFont}", sans-serif`;
      const hex = String(color).toUpperCase();
      context.fillText(hex.slice(0, 7), px, y + swatchHeight + 14);
    }
  });
}

function wrapCanvasText(context, text, maxWidth) {
  const words = String(text || "").split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [];
  let current = "";
  words.forEach((word) => {
    const test = current ? `${current} ${word}` : word;
    if (context.measureText(test).width <= maxWidth || !current) {
      current = test;
    } else {
      lines.push(current);
      current = word;
    }
  });
  if (current) lines.push(current);
  return lines;
}

function fitCanvasLine(context, line, maxWidth) {
  const text = String(line || "");
  if (context.measureText(text).width <= maxWidth) return text;
  let trimmed = text;
  while (trimmed.length > 4 && context.measureText(`${trimmed}...`).width > maxWidth) {
    trimmed = trimmed.slice(0, -1).trimEnd();
  }
  return trimmed.length > 4 ? `${trimmed}...` : trimmed;
}

function roundRectPath(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function createSlideFromBlueprint(blueprint, analysis, index) {
  const template = buildSuggestedSlideCopy(blueprint, analysis);

  return {
    ...template,
    key: blueprint.key,
    sectionId: blueprint.sectionId,
    sectionLabel: blueprint.sectionLabel,
    visualRole: blueprint.visualRole,
    layout: blueprint.layout,
  };
}

function deriveDeckTitle() {
  const context = (state.settings.contextBrief || "").trim();
  const firstLine = context.split("\n").find((line) => line.trim().length > 0);
  return firstLine ? firstLine.slice(0, 68) : "Deck arquitectonico RenderAI";
}

function normalizeSlide(slide, index = 0) {
  return {
    key: String(slide.key || slide.sectionId || `slide-${index + 1}`),
    sectionId: String(slide.sectionId || slide.key || `slide-${index + 1}`),
    tag: String(slide.tag || `Slide ${index + 1}`),
    title: String(slide.title || `Slide ${index + 1}`),
    subtitle: String(slide.subtitle || ""),
    bullets: safeArray(slide.bullets).map((item) => String(item)).slice(0, 6),
    visualRole: String(slide.visualRole || inferVisualRole(slide, index)),
    layout: String(slide.layout || inferSlideLayout(slide, index)),
    imageDataUrl: slide.imageDataUrl || "",
    imagePlacement: String(slide.imagePlacement || inferImagePlacement(slide.layout || inferSlideLayout(slide, index))),
    imageAspect: String(slide.imageAspect || inferImageAspect(slide.layout || inferSlideLayout(slide, index))),
    imageSourceMode: String(slide.imageSourceMode || "inherit"),
    imageSize: String(slide.imageSize || inferImageSize(slide.layout || inferSlideLayout(slide, index))),
    imageZone: String(slide.imageZone || inferImageZone(slide.layout || inferSlideLayout(slide, index), slide.imagePlacement || inferImagePlacement(slide.layout || inferSlideLayout(slide, index)))),
    imageFraming: String(slide.imageFraming || inferImageFraming(slide.layout || inferSlideLayout(slide, index))),
    imageArrangement: String(slide.imageArrangement || inferImageArrangement(slide.layout || inferSlideLayout(slide, index))),
    moodBoardLayout: String(slide.moodBoardLayout || inferMoodBoardLayout(slide)),
    renderTreatment: String(slide.renderTreatment || "master"),
    imageRepresentation: String(slide.imageRepresentation || "inherit"),
    imageFinish: String(slide.imageFinish || "inherit"),
    imageOccupancy: String(slide.imageOccupancy || "inherit"),
    textMode: String(slide.textMode || "suggested"),
    useProjectImages: Boolean(slide.useProjectImages),
    imageIds: safeArray(slide.imageIds),
    moodSources: safeArray(slide.moodSources),
    materialHighlights: safeArray(slide.materialHighlights),
    objectHighlights: safeArray(slide.objectHighlights),
    titleFont: String(slide.titleFont || state.settings.titleFont || "Cormorant Garamond"),
    bodyFont: String(slide.bodyFont || state.settings.bodyFont || "Manrope"),
    brochureLanguage: String(slide.brochureLanguage || state.settings.brochureLanguage || "es"),
    brochureStyle: normalizeBrochureStyleValue(slide.brochureStyle || state.settings.brochureStyle || DEFAULT_SETTINGS.brochureStyle),
  };
}

function pickDeckSettings() {
  const keys = ["pageCount", "audience", "pdfTone", "narrative", "plans", "visualDensity", "coverStyle", "deckMode", "renderLanguage", "imageMood", "timeOfDay", "lightScenario", "occupancy", "representationStyle", "imageFinish", "lensProfile", "weatherAtmosphere", "projectType", "pdfImageMode", "brochureStyle", "brochureLanguage", "titleFont", "bodyFont", "colorMode", "selectedPalette", "selectedAmenities", "customAmenities", "amenityCount", "pdfSections"];
  const payload = keys.reduce((acc, key) => ({ ...acc, [key]: state.settings[key] }), {});
  const brochureTemplate = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  payload.brochureTemplateLabel = brochureTemplate?.label || "";
  payload.brochureTemplateCollection = brochureTemplate?.collection || "";
  payload.brochureTemplateDescription = brochureTemplate?.description || "";
  payload.brochureTemplateTags = safeArray(brochureTemplate?.tags);
  payload.brochureTemplateValue = brochureTemplate?.value || "";
  payload.brochureTemplateThumbnail = brochureTemplate?.thumbnail || "";
  payload.brochureTemplateSource = "canva-reference-local";
  payload.brochureTemplateCanvaId = brochureTemplate?.canvaId || "";
  payload.brochureTemplateCanvaUrl = brochureTemplate?.canvaUrl || "";
  payload.brochureTemplateCanvaBridge = brochureTemplate?.canvaBridge || "local-preview-from-canva-reference";
  payload.templateReference = buildTemplateReferenceBlock();
  payload.pdfSlideLayouts = state.settings.pdfSlideLayouts || {};
  payload.pdfPerImagePrompts = state.settings.pdfPerImagePrompts || {};
  payload.canvaGenerationBrief = buildCanvaGenerationBrief(brochureTemplate);
  payload.slideBlueprints = computePdfSlideBlueprints().map((blueprint) => ({
    key: blueprint.key,
    sectionId: blueprint.sectionId,
    title: blueprint.title,
    subtitle: blueprint.subtitle,
    visualRole: blueprint.visualRole,
    layout: state.settings.pdfSlideConfigs?.[blueprint.key]?.layout || blueprint.layout,
    imagePlacement: state.settings.pdfSlideConfigs?.[blueprint.key]?.imagePlacement || inferImagePlacement(blueprint.layout),
    imageAspect: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageAspect || inferImageAspect(blueprint.layout),
    imageSourceMode: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageSourceMode || "inherit",
    imageSize: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageSize || inferImageSize(blueprint.layout),
    imageZone: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageZone || inferImageZone(blueprint.layout, state.settings.pdfSlideConfigs?.[blueprint.key]?.imagePlacement || inferImagePlacement(blueprint.layout)),
    imageFraming: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageFraming || inferImageFraming(blueprint.layout),
    imageArrangement: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageArrangement || inferImageArrangement(blueprint.layout),
    moodBoardLayout: state.settings.pdfSlideConfigs?.[blueprint.key]?.moodBoardLayout || inferMoodBoardLayout(blueprint),
    renderTreatment: state.settings.pdfSlideConfigs?.[blueprint.key]?.renderTreatment || "master",
    imageRepresentation: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageRepresentation || "inherit",
    imageFinish: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageFinish || "inherit",
    imageOccupancy: state.settings.pdfSlideConfigs?.[blueprint.key]?.imageOccupancy || "inherit",
    textMode: state.settings.pdfSlideConfigs?.[blueprint.key]?.textMode || "suggested",
    useProjectImages: Boolean(state.settings.pdfSlideConfigs?.[blueprint.key]?.useProjectImages),
    imageIds: safeArray(state.settings.pdfSlideConfigs?.[blueprint.key]?.imageIds),
    moodSources: safeArray(state.settings.pdfSlideConfigs?.[blueprint.key]?.moodSources),
    materialHighlights: safeArray(state.settings.pdfSlideConfigs?.[blueprint.key]?.materialHighlights),
    objectHighlights: safeArray(state.settings.pdfSlideConfigs?.[blueprint.key]?.objectHighlights),
  }));
  payload.pageCount = String(payload.slideBlueprints.length);

  // Build list of photos that WILL be rendered vs photos that stay as context-only
  const allImageIds = safeArray(state.images).map((image) => image.id);
  const renderedIdsSet = collectPdfRenderedImageIds(safeArray(state.images));
  const renderedIds = Array.from(renderedIdsSet);
  const contextOnlyIds = allImageIds.filter((id) => !renderedIdsSet.has(id));
  const byId = Object.fromEntries(safeArray(state.images).map((image) => [image.id, image]));

  payload.renderedImageRefs = renderedIds.map((id, index) => {
    const image = byId[id];
    const analysis = image?.analysis || {};
    return {
      index: index + 1,
      id,
      name: image?.name || `Foto ${index + 1}`,
      sceneType: analysis.sceneType || "",
      summary: analysis.summary || "",
      materials: safeArray(analysis.materials).slice(0, 5),
      objects: safeArray(analysis.objects).slice(0, 5),
      texts: safeArray(analysis.texts).slice(0, 5),
    };
  });

  payload.contextImageRefs = contextOnlyIds.map((id, index) => {
    const image = byId[id];
    const analysis = image?.analysis || {};
    return {
      index: index + 1,
      id,
      name: image?.name || `Contexto ${index + 1}`,
      sceneType: analysis.sceneType || "",
      summary: analysis.summary || "",
      materials: safeArray(analysis.materials).slice(0, 4),
      objects: safeArray(analysis.objects).slice(0, 4),
      texts: safeArray(analysis.texts).slice(0, 4),
    };
  });

  return payload;
}

function buildCanvaGenerationBrief(template) {
  const activeTemplate = template || getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const language = state.settings.brochureLanguage === "en" ? "English" : "Spanish";
  return [
    `Create an editable Canva presentation inspired by the local RenderAI template "${activeTemplate?.label || "RenderAI template"}".`,
    activeTemplate?.canvaUrl ? `Canva visual reference URL: ${activeTemplate.canvaUrl}` : null,
    "Template source: local Canva-reference preview.",
    `Use ${language} only for all visible text.`,
    `Deck type: ${labelForProjectType()}. Tone: ${labelForDecision("pdfTone")}. Narrative: ${labelForDecision("narrative")}.`,
    `Use project colors/palette when provided, otherwise derive a premium architectural palette from the uploaded renders.`,
    "Keep text editable and typo-free. Do not rasterize copy into images. Use image placeholders for project renders, mood boards and material boards.",
    "Make the result feel like a high-end architecture brochure, not a generic report.",
  ].filter(Boolean).join("\n");
}

function getRenderRequestProfile() {
  if (state.settings.representationStyle === "linear-drawing") {
    return { quality: "medium", inputFidelity: "high", outputCompression: 94, providerPreference: "auto-strict", strictFidelity: true };
  }
  if (state.settings.fidelity === "absolute" && state.settings.detailPriority !== "materials") {
    return { quality: "high", inputFidelity: "high", outputCompression: 95, providerPreference: "auto-strict", strictFidelity: true };
  }
  if (state.settings.fidelity === "high") {
    return { quality: "medium", inputFidelity: "high", outputCompression: 92, providerPreference: "auto-strict", strictFidelity: true };
  }
  return { quality: "medium", inputFidelity: "low", outputCompression: 90, providerPreference: "gemini" };
}

function renderResult() {
  const flow = state.flow;
  if (!flow) return;

  if (state.generation.busy) {
    elements.resultStatus.textContent = state.generation.stage || "Procesando resultado...";
  } else if (flow === "pdf" && !state.result.deck) {
    elements.resultStatus.textContent = "Listo para construir deck";
  } else if (flow === "render" && !state.result.render) {
    elements.resultStatus.textContent = "Listo para generar imagen";
  } else if (flow === "pdf") {
    elements.resultStatus.textContent = "Deck visual listo";
  } else {
    elements.resultStatus.textContent = "Render listo";
  }

  if (flow === "pdf") renderPdfResult();
  else renderRenderResult();

  elements.downloadResultBtn.textContent = flow === "pdf" ? "Descargar PDF final" : "Descargar master";
  elements.downloadAltBtn.textContent = flow === "pdf" ? "Descargar PPT editable" : "Descargar preview";
  elements.downloadResultBtn.disabled = state.generation.busy || (flow === "pdf" ? !state.result.deck : !state.result.render);
  elements.downloadAltBtn.disabled = state.generation.busy || (flow === "pdf" ? !state.result.deck : !state.result.render);
  elements.regenerateResultBtn.disabled = state.generation.busy;
  elements.restartFlowBtn.disabled = state.generation.busy;
}

function renderRenderResult() {
  const current = state.result.render;
  if (state.generation.busy) {
    elements.resultPrimary.className = "result-primary empty-state";
    elements.resultPrimary.innerHTML = `<div class="loader-orb"></div><strong>Generando render final</strong><span>Se esta ejecutando una sola corrida con la escena bloqueada para no gastar tokens extra.</span>`;
    elements.resultSecondary.innerHTML = "";
    elements.resultMeta.innerHTML = buildResultMeta([
      ["Flujo", "Render"],
      ["Estado", state.generation.stage || "Procesando"],
      ["Personas", labelForDecision("occupancy")],
    ]);
    return;
  }

  if (!current) {
    elements.resultPrimary.className = "result-primary empty-state";
    elements.resultPrimary.innerHTML = `<strong>Aun no hay render generado</strong><span>En este paso veras la imagen final y luego podras descargarla o dejar feedback del resultado.</span>`;
    elements.resultSecondary.innerHTML = "";
      elements.resultMeta.innerHTML = buildResultMeta([
        ["Flujo", "Render"],
        ["Motor visual", state.server.aiReady ? (state.server.renderProvider === "gemini" ? "Gemini activo" : "OpenAI activo") : "Fallback local"],
        ["Fidelidad", labelForDecision("fidelity")],
      ]);
    return;
  }

  elements.resultPrimary.className = "result-primary";
  elements.resultPrimary.innerHTML = `<img src="${current.url}" alt="${escapeHtml(current.title)}" />`;
  elements.resultSecondary.innerHTML = `
    <article class="slide-preview">
      <span class="slide-tag">Referencia</span>
      <strong>Escena base</strong>
      <img src="${getMainImage()?.url || current.url}" alt="Referencia usada" />
      <p>La generacion final queda congelada hasta que decidas regenerarla manualmente.</p>
    </article>
  `;
  elements.resultMeta.innerHTML = buildResultMeta([
    ["Flujo", "Render"],
    ["Origen", current.source === "gemini" ? "Generado con Gemini" : current.source === "openai" ? "Generado con OpenAI" : "Respaldo local"],
    ["Hora", formatDate(current.createdAt)],
    ["Estilo", `${labelForDecision("realism")} · ${labelForDecision("imageMood")}`],
    ["Personas", labelForDecision("occupancy")],
  ]);
}

function renderPdfResult() {
  const deck = state.result.deck;
  if (state.generation.busy) {
    elements.resultPrimary.className = "result-primary empty-state";
    elements.resultPrimary.innerHTML = `<div class="loader-orb"></div><strong>Construyendo deck visual</strong><span>${escapeHtml(state.generation.stage || "Generando paginas, mood boards y renders para el PDF.")}</span>`;
    elements.resultSecondary.innerHTML = "";
    elements.resultMeta.innerHTML = buildResultMeta([
      ["Flujo", "PDF"],
      ["Estado", state.generation.stage || "Procesando"],
      ["Paginas", String(computePdfSlideBlueprints().length || 0)],
      ["Imagenes", state.settings.pdfImageMode === "rendered" ? "Renderizadas" : "Crudas"],
    ]);
    return;
  }

  if (!deck) {
    elements.resultPrimary.className = "result-primary empty-state";
    elements.resultPrimary.innerHTML = `<strong>Aun no hay deck generado</strong><span>Cuando generes el PDF veras la portada y una vista previa de las paginas para validarlo antes de descargar.</span>`;
    elements.resultSecondary.innerHTML = "";
    elements.resultMeta.innerHTML = buildResultMeta([
      ["Flujo", "PDF"],
      ["Modo", labelForDecision("deckMode")],
      ["Paginas", String(computePdfSlideBlueprints().length || 0)],
      ["Imagenes", state.settings.pdfImageMode === "rendered" ? "Renderizadas" : "Crudas"],
    ]);
    return;
  }

  const [first, ...rest] = deck.slides;
  elements.resultPrimary.className = "result-primary";
  elements.resultPrimary.innerHTML = buildSlidePreview(first, true);
  elements.resultSecondary.innerHTML = rest.map((slide) => buildSlidePreview(slide, false)).join("");
  elements.resultMeta.innerHTML = buildResultMeta([
    ["Flujo", "PDF"],
    ["Origen", deck.source === "openai" ? "Outline IA" : "Outline local"],
    ["Paginas", String(deck.slides.length)],
    ["Tono", labelForDecision("pdfTone")],
    ["Imagenes", state.settings.pdfImageMode === "rendered" ? "Renderizadas" : "Crudas"],
  ]);
}

function buildSlidePreview(slide, featured) {
  const bullets = safeArray(slide.bullets).slice(0, featured ? 4 : 3);
  const previewImage = slide.composedPageDataUrl || slide.imageDataUrl;
  return `
    <article class="slide-preview ${featured ? "slide-preview-featured" : ""}">
      <span class="slide-tag">${escapeHtml(slide.tag || "Slide")}</span>
      <strong>${escapeHtml(slide.title || "Slide")}</strong>
      ${previewImage ? `<img src="${previewImage}" alt="${escapeHtml(slide.title || "Slide")}" />` : ""}
      <p>${escapeHtml(slide.subtitle || "")}</p>
      <ul>${bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
    </article>
  `;
}

function buildResultMeta(items) {
  return items.map(([label, value]) => `<span class="select-chip"><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</span>`).join("");
}

function renderFeedback() {
  renderFeedbackSelectors();
  const mine = state.session ? state.feedback.filter((item) => item.user === state.session.username).slice(0, 8) : [];
  if (!mine.length) {
    elements.feedbackHistory.innerHTML = `<div class="empty-state"><strong>No hay feedback guardado</strong><span>Despues de generar el resultado, tu evaluacion quedara guardada aqui para aprendizaje interno.</span></div>`;
    return;
  }
  elements.feedbackHistory.innerHTML = mine.map((item) => feedbackCardMarkup(item)).join("");
}

function renderFeedbackSelectors() {
  elements.feedbackCategoryChips.innerHTML = FEEDBACK_CATEGORIES.map((item) => `
    <button type="button" class="select-chip ${state.feedbackDraft.category === item.value ? "active" : ""}" data-feedback-category="${item.value}">${escapeHtml(item.label)}</button>
  `).join("");
  elements.feedbackRatingChips.innerHTML = RATING_OPTIONS.map((value) => `
    <button type="button" class="rating-chip ${state.feedbackDraft.rating === value ? "active" : ""}" data-feedback-rating="${value}">${value}/5</button>
  `).join("");
  elements.feedbackMessage.value = state.feedbackDraft.message || "";
}

function submitFeedback(event) {
  event.preventDefault();
  if (state.flow === "pdf" && !state.result.deck) {
    toast("Genera primero el PDF antes de dejar feedback.", "warn");
    return;
  }
  if (state.flow === "render" && !state.result.render) {
    toast("Genera primero el render antes de dejar feedback.", "warn");
    return;
  }
  const message = elements.feedbackMessage.value.trim();
  if (!message) {
    toast("Escribe un comentario antes de guardar feedback.", "warn");
    return;
  }
  const record = {
    id: cryptoRandom(),
    user: state.session?.username || "anon",
    role: state.session?.role || "user",
    flow: state.flow || "render",
    category: state.feedbackDraft.category,
    rating: state.feedbackDraft.rating,
    message,
    status: "pending",
    createdAt: new Date().toISOString(),
    resultType: state.flow === "pdf" ? "pdf" : "image",
  };
  state.feedback.unshift(record);
  saveJson(STORAGE_KEYS.feedback, state.feedback);
  state.feedbackDraft.message = "";
  elements.feedbackMessage.value = "";
  renderFeedback();
  renderAdmin();
  toast("Feedback guardado en memoria.", "ok");
}

function renderAdmin() {
  const isAdmin = state.session?.role === "admin";
  if (!isAdmin) {
    toggleAdminDrawer(false);
    return;
  }

  const pending = state.feedback.filter((item) => item.status !== "resolved").length;
  const stats = [
    ["Feedback", String(state.feedback.length)],
    ["Pendientes", String(pending)],
    ["Renders", String(state.result.renderHistory.length)],
    ["Decks", state.result.deck ? "1" : "0"],
  ];
  elements.adminStats.innerHTML = stats.map(([label, value]) => `
    <article class="admin-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </article>
  `).join("");

  if (!state.feedback.length) {
    elements.adminQueue.innerHTML = `<div class="empty-state"><strong>No hay feedback recibido</strong><span>La memoria administrativa se llenara cuando se guarden evaluaciones desde el resultado.</span></div>`;
  } else {
    elements.adminQueue.innerHTML = state.feedback.map((item) => `
      <article class="feedback-item">
        <div class="feedback-meta">
          <span>${escapeHtml(item.user)} · ${escapeHtml(item.flow)}</span>
          <span>${escapeHtml(formatDate(item.createdAt))}</span>
        </div>
        <strong>${escapeHtml(item.category)} · ${escapeHtml(String(item.rating))}/5</strong>
        <p>${escapeHtml(item.message)}</p>
        <div class="asset-actions">
          <button type="button" class="button button-ghost" data-feedback-resolve="${item.id}">${item.status === "resolved" ? "Resuelto" : "Marcar resuelto"}</button>
        </div>
      </article>
    `).join("");
  }

  updatePromptText();
}

function toggleAdminDrawer(force) {
  state.adminDrawerOpen = Boolean(force);
  elements.adminDrawer.classList.toggle("hidden", !state.adminDrawerOpen);
}

async function downloadCurrentResult(kind) {
  if (state.flow === "pdf") {
    await downloadPdfVariant(kind);
    return;
  }
  await downloadRenderVariant(kind);
}

async function downloadRenderVariant(kind) {
  const current = state.result.render;
  if (!current) {
    toast("Genera primero una imagen antes de descargar.", "warn");
    return;
  }

  if (kind === "alternate") {
    const previewUrl = await dataUrlToJpeg(current.url, 0.84, 1800);
    triggerDownload(previewUrl, `renderai-preview-${slugify(Date.now())}.jpg`);
    return;
  }

  const extension = current.source === "openai" ? "jpg" : "png";
  triggerDownload(current.url, `renderai-master-${slugify(Date.now())}.${extension}`);
}

async function downloadPdfVariant(kind) {
  const deck = state.result.deck;
  if (!deck) {
    toast("Genera primero el deck antes de descargar.", "warn");
    return;
  }

  if (kind === "alternate") {
    await downloadEditablePptx(deck);
    return;
  }

  const sourceSlides = deck.slides;
  const slides = await prepareSlidesForPdfExport(sourceSlides);
  const coverSource = slides[0]?.composedPageDataUrl || slides[0]?.imageDataUrl || state.result.render?.url || getMainImage()?.url || null;
  const coverImageDataUrl = coverSource ? await dataUrlToJpeg(coverSource, 0.9, 1800) : null;
  const coverDimensions = coverSource ? await getImageDimensions(coverSource) : { width: 0, height: 0 };

  const response = await apiRequest("/api/export-pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: deck.title,
      summary: deck.summary,
      slides,
      fileName: `${slugify(deck.title || "renderai-deck")}-${kind === "alternate" ? "resumen" : "deck"}.pdf`,
      theme: {
        flow: state.flow,
        tone: state.flow === "pdf" ? state.settings.pdfTone : state.settings.renderLanguage,
      },
      coverImageDataUrl,
      coverImageWidth: coverDimensions.width,
      coverImageHeight: coverDimensions.height,
    }),
  });

  if (!response.ok) {
    toast("No se pudo exportar el PDF.", "error");
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const name = `${slugify(deck.title || "renderai-deck")}-${kind === "alternate" ? "resumen" : "deck"}.pdf`;
  triggerDownload(url, name);
  setTimeout(() => URL.revokeObjectURL(url), 0);
  toast("PDF exportado.", "ok");
}

async function downloadEditablePptx(deck) {
  const slides = await prepareSlidesForPptExport(deck.slides);
  const template = getBrochureTemplateGalleryEntry(state.settings.brochureStyle);
  const response = await apiRequest("/api/export-pptx", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: deck.title,
      summary: deck.summary,
      fileName: `${slugify(deck.title || "renderai-deck")}-editable.pptx`,
      slides,
      template: {
        value: template?.value || state.settings.brochureStyle,
        label: template?.label || "",
        canvaId: template?.canvaId || "",
        canvaUrl: template?.canvaUrl || "",
      },
      theme: {
        palette: state.settings.selectedPalette?.length ? state.settings.selectedPalette : getSuggestedPalette(getMainImage()?.analysis || buildAnalysisFallback()),
        titleFont: state.settings.titleFont || "Cormorant Garamond",
        bodyFont: state.settings.bodyFont || "Manrope",
        brochureStyle: state.settings.brochureStyle,
        language: state.settings.brochureLanguage,
      },
    }),
  });

  if (!response.ok) {
    toast("No se pudo exportar el PPT editable.", "error");
    return;
  }
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `${slugify(deck.title || "renderai-deck")}-editable.pptx`);
  setTimeout(() => URL.revokeObjectURL(url), 0);
  toast("PPT editable exportado.", "ok");
}

async function prepareSlidesForPdfExport(slides) {
  return Promise.all(safeArray(slides).map(async (slide) => {
    const composed = slide.composedPageDataUrl || "";
    let imageDataUrl = composed || slide.imageDataUrl || "";
    let imageWidth = composed ? (slide.composedPageWidth || 0) : (slide.imageWidth || 0);
    let imageHeight = composed ? (slide.composedPageHeight || 0) : (slide.imageHeight || 0);
    if (imageDataUrl) {
      const dimensions = await getImageDimensions(imageDataUrl);
      imageWidth = dimensions.width;
      imageHeight = dimensions.height;
      imageDataUrl = await dataUrlToJpeg(imageDataUrl, 0.9, 2200);
    }
    return {
      ...slide,
      layout: composed ? "fullbleed" : slide.layout,
      imageDataUrl,
      imageWidth,
      imageHeight,
    };
  }));
}

async function prepareSlidesForPptExport(slides) {
  return Promise.all(safeArray(slides).map(async (slide, index) => {
    const candidateVisual = slide.imageDataUrl || slide.composedPageDataUrl || "";
    const fallbackVisual = state.result.render?.url || getMainImage()?.url || "";
    const visualSource = isTemplatePreviewAssetUrl(candidateVisual)
      ? fallbackVisual
      : (candidateVisual || fallbackVisual);
    const imageDataUrl = visualSource ? await dataUrlToJpeg(visualSource, 0.9, 1800) : "";
    const dimensions = visualSource ? await getImageDimensions(visualSource).catch(() => ({ width: 0, height: 0 })) : { width: 0, height: 0 };
    return {
      index: index + 1,
      key: slide.key || `slide-${index + 1}`,
      sectionId: slide.sectionId || slide.key || "",
      tag: sanitizeVisibleDeckText(slide.tag || `Slide ${index + 1}`, `Slide ${index + 1}`),
      title: sanitizeVisibleDeckText(slide.title, `Slide ${index + 1}`),
      subtitle: sanitizeVisibleDeckText(slide.subtitle, ""),
      bullets: safeArray(slide.bullets).map((item) => sanitizeVisibleDeckText(item, "")).filter(Boolean).slice(0, 4),
      visualRole: slide.visualRole || "",
      layout: slide.layout || "split",
      imageDataUrl,
      imageWidth: dimensions.width,
      imageHeight: dimensions.height,
    };
  }));
}

function handleDelegatedClick(event) {
  const target = event.target;

  const styleFilterButton = target.closest("[data-style-filter]");
  if (styleFilterButton) {
    state.pdfBuilder.styleFilter = styleFilterButton.dataset.styleFilter || "all";
    renderDecisions();
    return;
  }

  const choiceButton = target.closest("[data-choice-key][data-choice-value]");
  if (choiceButton) {
    state.settings[choiceButton.dataset.choiceKey] = choiceButton.dataset.choiceValue;
    persistSettings();
    renderDecisions();
    updatePromptText();
    return;
  }

  const projectTypeButton = target.closest("[data-project-type]");
  if (projectTypeButton) {
    state.settings.projectType = projectTypeButton.dataset.projectType;
    persistSettings();
    renderDecisions();
    updatePromptText();
    return;
  }

  const colorModeButton = target.closest("[data-color-mode]");
  if (colorModeButton) {
    state.settings.colorMode = colorModeButton.dataset.colorMode;
    if (state.settings.colorMode === "suggested") {
      state.settings.selectedPalette = getSuggestedPalette(getMainImage()?.analysis || buildAnalysisFallback()).slice(0, 4);
    }
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const paletteButton = target.closest("[data-palette-color]");
  if (paletteButton) {
    const color = paletteButton.dataset.paletteColor;
    const list = new Set(state.settings.selectedPalette || []);
    if (list.has(color)) list.delete(color);
    else list.add(color);
    state.settings.selectedPalette = [...list].slice(0, 6);
    state.settings.colorMode = "manual";
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const pdfImageModeButton = target.closest("[data-pdf-image-mode]");
  if (pdfImageModeButton) {
    state.settings.pdfImageMode = pdfImageModeButton.dataset.pdfImageMode;
    persistSettings();
    renderDecisions();
    updatePromptText();
    return;
  }

  const amenityCountButton = target.closest("[data-amenity-count]");
  if (amenityCountButton) {
    state.settings.amenityCount = amenityCountButton.dataset.amenityCount;
    state.settings.selectedAmenities = safeArray(state.settings.selectedAmenities).slice(0, Number(state.settings.amenityCount || 0));
    persistSettings();
    renderDecisions();
    updatePromptText();
    return;
  }

  const amenityCustomAddButton = target.closest("[data-amenity-custom-add]");
  if (amenityCustomAddButton) {
    addCustomAmenityFromInput();
    return;
  }

  const amenityRemoveButton = target.closest("[data-amenity-remove]");
  if (amenityRemoveButton) {
    removeAmenitySelection(amenityRemoveButton.dataset.amenityRemove);
    return;
  }

  const amenityButton = target.closest("[data-amenity-value]");
  if (amenityButton) {
    toggleAmenitySelection(amenityButton.dataset.amenityValue);
    return;
  }

  const sectionAddButton = target.closest("[data-section-add]");
  if (sectionAddButton) {
    addPdfSection(sectionAddButton.dataset.sectionAdd);
    return;
  }

  const sectionRemoveButton = target.closest("[data-section-remove]");
  if (sectionRemoveButton) {
    removePdfSection(sectionRemoveButton.dataset.sectionRemove);
    return;
  }

  const sectionMoveButton = target.closest("[data-section-move][data-section-direction]");
  if (sectionMoveButton) {
    movePdfSection(sectionMoveButton.dataset.sectionMove, Number(sectionMoveButton.dataset.sectionDirection || 0));
    return;
  }

  const sectionBulkButton = target.closest("[data-section-bulk]");
  if (sectionBulkButton) {
    bulkPdfSections(sectionBulkButton.dataset.sectionBulk);
    return;
  }

  const transferSectionsButton = target.closest("[data-transfer-sections]");
  if (transferSectionsButton) {
    transferPdfSections(transferSectionsButton.dataset.transferSections);
    return;
  }

  const slideNavButton = target.closest("[data-slide-nav]");
  if (slideNavButton) {
    state.pdfBuilder.currentSlideKey = slideNavButton.dataset.slideNav;
    renderAll();
    return;
  }

  const slideShiftButton = target.closest("[data-slide-nav-shift]");
  if (slideShiftButton) {
    shiftCurrentSlide(Number(slideShiftButton.dataset.slideNavShift || 0));
    return;
  }

  const slideLayoutButton = target.closest("[data-slide-layout][data-slide-layout-value]");
  if (slideLayoutButton) {
    const slideKey = slideLayoutButton.dataset.slideLayout;
    const config = state.settings.pdfSlideConfigs[slideKey];
    if (!config) return;
    config.layout = slideLayoutButton.dataset.slideLayoutValue;
    if (!config.imagePlacement) config.imagePlacement = inferImagePlacement(config.layout);
    if (!config.imageAspect) config.imageAspect = inferImageAspect(config.layout);
    if (!config.imageFraming) config.imageFraming = inferImageFraming(config.layout);
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const imageSourceButton = target.closest("[data-slide-image-source][data-slide-image-source-value]");
  if (imageSourceButton) {
    const config = state.settings.pdfSlideConfigs[imageSourceButton.dataset.slideImageSource];
    if (!config) return;
    config.imageSourceMode = imageSourceButton.dataset.slideImageSourceValue;
    persistSettings();
    renderAll();
    return;
  }

  const imagePlacementButton = target.closest("[data-slide-image-placement][data-slide-image-placement-value]");
  if (imagePlacementButton) {
    const config = state.settings.pdfSlideConfigs[imagePlacementButton.dataset.slideImagePlacement];
    if (!config) return;
    config.imagePlacement = imagePlacementButton.dataset.slideImagePlacementValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageAspectButton = target.closest("[data-slide-image-aspect][data-slide-image-aspect-value]");
  if (imageAspectButton) {
    const config = state.settings.pdfSlideConfigs[imageAspectButton.dataset.slideImageAspect];
    if (!config) return;
    config.imageAspect = imageAspectButton.dataset.slideImageAspectValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageSizeButton = target.closest("[data-slide-image-size][data-slide-image-size-value]");
  if (imageSizeButton) {
    const config = state.settings.pdfSlideConfigs[imageSizeButton.dataset.slideImageSize];
    if (!config) return;
    config.imageSize = imageSizeButton.dataset.slideImageSizeValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageZoneButton = target.closest("[data-slide-image-zone][data-slide-image-zone-value]");
  if (imageZoneButton) {
    const config = state.settings.pdfSlideConfigs[imageZoneButton.dataset.slideImageZone];
    if (!config) return;
    config.imageZone = imageZoneButton.dataset.slideImageZoneValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageFramingButton = target.closest("[data-slide-image-framing][data-slide-image-framing-value]");
  if (imageFramingButton) {
    const config = state.settings.pdfSlideConfigs[imageFramingButton.dataset.slideImageFraming];
    if (!config) return;
    config.imageFraming = imageFramingButton.dataset.slideImageFramingValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageArrangementButton = target.closest("[data-slide-image-arrangement][data-slide-image-arrangement-value]");
  if (imageArrangementButton) {
    const config = state.settings.pdfSlideConfigs[imageArrangementButton.dataset.slideImageArrangement];
    if (!config) return;
    config.imageArrangement = imageArrangementButton.dataset.slideImageArrangementValue;
    persistSettings();
    renderAll();
    return;
  }

  const moodLayoutButton = target.closest("[data-slide-mood-layout][data-slide-mood-layout-value]");
  if (moodLayoutButton) {
    const config = state.settings.pdfSlideConfigs[moodLayoutButton.dataset.slideMoodLayout];
    if (!config) return;
    config.moodBoardLayout = moodLayoutButton.dataset.slideMoodLayoutValue;
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const renderTreatmentButton = target.closest("[data-slide-render-treatment][data-slide-render-treatment-value]");
  if (renderTreatmentButton) {
    const config = state.settings.pdfSlideConfigs[renderTreatmentButton.dataset.slideRenderTreatment];
    if (!config) return;
    config.renderTreatment = renderTreatmentButton.dataset.slideRenderTreatmentValue;
    persistSettings();
    renderAll();
    return;
  }

  const slideBackgroundButton = target.closest("[data-slide-background][data-slide-background-value]");
  if (slideBackgroundButton) {
    const config = state.settings.pdfSlideConfigs[slideBackgroundButton.dataset.slideBackground];
    if (!config) return;
    config.slideBackground = slideBackgroundButton.dataset.slideBackgroundValue;
    persistSettings();
    renderAll();
    return;
  }

  const imageRepresentationButton = target.closest("[data-slide-image-representation][data-slide-image-representation-value]");
  if (imageRepresentationButton) {
    const config = state.settings.pdfSlideConfigs[imageRepresentationButton.dataset.slideImageRepresentation];
    if (!config) return;
    config.imageRepresentation = imageRepresentationButton.dataset.slideImageRepresentationValue;
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const imageFinishButton = target.closest("[data-slide-image-finish][data-slide-image-finish-value]");
  if (imageFinishButton) {
    const config = state.settings.pdfSlideConfigs[imageFinishButton.dataset.slideImageFinish];
    if (!config) return;
    config.imageFinish = imageFinishButton.dataset.slideImageFinishValue;
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const imageOccupancyButton = target.closest("[data-slide-image-occupancy][data-slide-image-occupancy-value]");
  if (imageOccupancyButton) {
    const config = state.settings.pdfSlideConfigs[imageOccupancyButton.dataset.slideImageOccupancy];
    if (!config) return;
    config.imageOccupancy = imageOccupancyButton.dataset.slideImageOccupancyValue;
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const textModeButton = target.closest("[data-slide-text-mode][data-slide-text-mode-value]");
  if (textModeButton) {
    const config = state.settings.pdfSlideConfigs[textModeButton.dataset.slideTextMode];
    if (!config) return;
    config.textMode = textModeButton.dataset.slideTextModeValue;
    persistSettings();
    renderAll();
    return;
  }

  const slideVariantButton = target.closest("[data-slide-variant][data-slide-variant-value]");
  if (slideVariantButton) {
    const slideKey = slideVariantButton.dataset.slideVariant;
    const value = slideVariantButton.dataset.slideVariantValue;
    if (!state.settings.pdfSlideLayouts || typeof state.settings.pdfSlideLayouts !== "object") state.settings.pdfSlideLayouts = {};
    state.settings.pdfSlideLayouts[slideKey] = value;
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const perImageStyleButton = target.closest("[data-per-image-style][data-per-image-id][data-per-image-style-value]");
  if (perImageStyleButton) {
    const slideKey = perImageStyleButton.dataset.perImageStyle;
    const imageId = perImageStyleButton.dataset.perImageId;
    const styleVal = perImageStyleButton.dataset.perImageStyleValue;
    if (!state.settings.pdfPerImagePrompts || typeof state.settings.pdfPerImagePrompts !== "object") state.settings.pdfPerImagePrompts = {};
    if (!state.settings.pdfPerImagePrompts[slideKey]) state.settings.pdfPerImagePrompts[slideKey] = {};
    const current = state.settings.pdfPerImagePrompts[slideKey][imageId] || {};
    state.settings.pdfPerImagePrompts[slideKey][imageId] = {
      ...current,
      style: current.style === styleVal ? "" : styleVal,
    };
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  const slideImageCountButton = target.closest("[data-slide-image-count][data-slide-image-count-value]");
  if (slideImageCountButton) {
    setSlideImageCount(slideImageCountButton.dataset.slideImageCount, Number(slideImageCountButton.dataset.slideImageCountValue || 1));
    return;
  }

  const slideActiveImageButton = target.closest("[data-slide-active-image][data-slide-image-id]");
  if (slideActiveImageButton) {
    setSlideActiveImage(slideActiveImageButton.dataset.slideActiveImage, slideActiveImageButton.dataset.slideImageId);
    return;
  }

  const slideImageToggleButton = target.closest("[data-slide-image-toggle][data-slide-image-id]");
  if (slideImageToggleButton) {
    toggleSlideImageSelection(slideImageToggleButton.dataset.slideImageToggle, slideImageToggleButton.dataset.slideImageId);
    return;
  }

  const slideSelectAllButton = target.closest("[data-slide-select-all]");
  if (slideSelectAllButton) {
    const slideKey = slideSelectAllButton.dataset.slideSelectAll;
    const config = state.settings.pdfSlideConfigs[slideKey];
    if (!config) return;
    config.imageIds = state.images.map((image) => image.id);
    persistSettings();
    renderDecisions();
    updatePromptText();
    return;
  }

  const slideMaterialButton = target.closest("[data-slide-material-toggle][data-slide-material-value]");
  if (slideMaterialButton) {
    toggleSlideTagSelection(slideMaterialButton.dataset.slideMaterialToggle, "materialHighlights", slideMaterialButton.dataset.slideMaterialValue, 8);
    return;
  }

  const slideObjectButton = target.closest("[data-slide-object-toggle][data-slide-object-value]");
  if (slideObjectButton) {
    toggleSlideTagSelection(slideObjectButton.dataset.slideObjectToggle, "objectHighlights", slideObjectButton.dataset.slideObjectValue, 8);
    return;
  }

  const moodSourceButton = target.closest("[data-slide-mood-source][data-slide-mood-value]");
  if (moodSourceButton) {
    const slideKey = moodSourceButton.dataset.slideMoodSource;
    const value = moodSourceButton.dataset.slideMoodValue;
    toggleSlideMoodSource(slideKey, value);
    return;
  }

  const slideResetCopyButton = target.closest("[data-slide-reset-copy]");
  if (slideResetCopyButton) {
    const config = state.settings.pdfSlideConfigs[slideResetCopyButton.dataset.slideResetCopy];
    if (!config) return;
    config.customTitle = "";
    config.customSubtitle = "";
    config.customBullets = "";
    config.textMode = "suggested";
    persistSettings();
    renderAll();
    return;
  }

  const feedbackCategory = target.closest("[data-feedback-category]")?.dataset.feedbackCategory;
  if (feedbackCategory) {
    state.feedbackDraft.category = feedbackCategory;
    renderFeedbackSelectors();
    return;
  }

  const feedbackRating = target.closest("[data-feedback-rating]")?.dataset.feedbackRating;
  if (feedbackRating) {
    state.feedbackDraft.rating = Number(feedbackRating);
    renderFeedbackSelectors();
    return;
  }

  const assetButton = target.closest("[data-action][data-id]");
  if (assetButton) {
    handleAssetAction(assetButton.dataset.action, assetButton.dataset.id);
    return;
  }

  const removeTokenButton = target.closest("[data-token-remove][data-token-value]");
  if (removeTokenButton) {
    removeAnalysisToken(removeTokenButton.dataset.tokenRemove, removeTokenButton.dataset.tokenValue);
    return;
  }

  const addButton = target.closest("[data-analysis-add]");
  if (addButton) {
    addAnalysisToken(addButton.dataset.analysisAdd);
    return;
  }

  const generateResultButton = target.closest("[data-generate-result]");
  if (generateResultButton) {
    handleGenerateResult(false);
    return;
  }

  const resolveButton = target.closest("[data-feedback-resolve]");
  if (resolveButton) {
    const item = state.feedback.find((entry) => entry.id === resolveButton.dataset.feedbackResolve);
    if (!item) return;
    item.status = "resolved";
    saveJson(STORAGE_KEYS.feedback, state.feedback);
    renderFeedback();
    renderAdmin();
  }
}

function handleDelegatedChange(event) {
  const target = event.target;

  if (target.matches("[data-slide-use-project]")) {
    const slideKey = target.dataset.slideUseProject;
    const config = state.settings.pdfSlideConfigs[slideKey];
    if (!config) return;
    config.useProjectImages = target.checked;
    if (config.useProjectImages && !safeArray(config.imageIds).length && state.images.length) {
      config.imageIds = [state.mainId || state.images[0].id];
    }
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }

  if (target.matches("[data-palette-custom]")) {
    const index = clamp(Number(target.dataset.paletteCustom || 0), 0, 5);
    const color = String(target.value || "").trim();
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    const next = safeArray(state.settings.selectedPalette).slice(0, 6);
    next[index] = color;
    state.settings.selectedPalette = next.filter(Boolean);
    state.settings.colorMode = "manual";
    persistSettings();
    renderAll();
    updatePromptText();
    return;
  }
}

function handleDelegatedInput(event) {
  const target = event.target;
  if (target.matches("[data-style-search]")) {
    state.pdfBuilder.styleSearch = target.value || "";
    renderDecisions();
    return;
  }
  if (target.matches("[data-slide-text-key][data-slide-text-field]")) {
    const config = state.settings.pdfSlideConfigs[target.dataset.slideTextKey];
    if (!config) return;
    config[target.dataset.slideTextField] = target.value;
    persistSettings();
    updatePromptText();
  }
  if (target.matches("[data-slide-inline-text-key][data-slide-inline-text-field]")) {
    const config = state.settings.pdfSlideConfigs[target.dataset.slideInlineTextKey];
    if (!config) return;
    const field = target.dataset.slideInlineTextField;
    config[field] = normalizeInlineEditableText(target.innerText || target.textContent || "");
    config.textMode = "custom";
    persistSettings();
    updatePromptText();
  }
  if (target.matches("[data-per-image-prompt][data-per-image-id]")) {
    const slideKey = target.dataset.perImagePrompt;
    const imageId = target.dataset.perImageId;
    if (!state.settings.pdfPerImagePrompts || typeof state.settings.pdfPerImagePrompts !== "object") state.settings.pdfPerImagePrompts = {};
    if (!state.settings.pdfPerImagePrompts[slideKey]) state.settings.pdfPerImagePrompts[slideKey] = {};
    const current = state.settings.pdfPerImagePrompts[slideKey][imageId] || {};
    state.settings.pdfPerImagePrompts[slideKey][imageId] = {
      ...current,
      prompt: target.value,
    };
    persistSettings();
    updatePromptText();
  }
}

function commitPdfSectionSelection(nextSections) {
  // Preserve order, keep only entries whose base id maps to a known section, allow duplicates via instance ids.
  state.settings.pdfSections = safeArray(nextSections).filter((value) => {
    const base = getSectionBaseId(value);
    return PDF_SECTION_LIBRARY.some((item) => item.id === base);
  });
  computePdfSlideBlueprints();
  persistSettings();
  renderAll();
  updatePromptText();
}

function createPdfSectionInstanceId(sectionId, existing) {
  const base = getSectionBaseId(sectionId);
  const already = safeArray(existing).some((value) => value === base);
  if (!already) return base;
  return `${base}__${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

function addPdfSection(sectionId) {
  if (!sectionId) return;
  const base = getSectionBaseId(sectionId);
  if (!PDF_SECTION_LIBRARY.some((item) => item.id === base)) return;
  const newInstance = createPdfSectionInstanceId(base, state.settings.pdfSections);
  commitPdfSectionSelection([...state.settings.pdfSections, newInstance]);
}

function removePdfSection(instanceId) {
  if (!instanceId) return;
  commitPdfSectionSelection(state.settings.pdfSections.filter((value) => value !== instanceId));
}

function movePdfSection(instanceId, direction) {
  const currentIndex = state.settings.pdfSections.indexOf(instanceId);
  if (currentIndex === -1) return;
  const targetIndex = clamp(currentIndex + direction, 0, state.settings.pdfSections.length - 1);
  if (targetIndex === currentIndex) return;
  const next = [...state.settings.pdfSections];
  [next[currentIndex], next[targetIndex]] = [next[targetIndex], next[currentIndex]];
  commitPdfSectionSelection(next);
}

function bulkPdfSections(mode) {
  if (mode === "all") {
    commitPdfSectionSelection(PDF_SECTION_LIBRARY.map((item) => item.id));
    return;
  }
  if (mode === "clear") {
    commitPdfSectionSelection([]);
  }
}

function transferPdfSections(mode) {
  if (mode === "all" || mode === "clear") {
    bulkPdfSections(mode);
  }
}

function normalizeAmenityValue(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function addCustomAmenityFromInput() {
  const input = document.querySelector("[data-amenity-custom-input]");
  const value = normalizeAmenityValue(input?.value || "");
  if (!value) {
    toast("Escribe el nombre de la amenidad que quieres agregar.", "warn");
    return;
  }
  if (!Array.isArray(state.settings.customAmenities)) state.settings.customAmenities = [];
  state.settings.customAmenities = unique([...state.settings.customAmenities, value]).slice(0, 24);
  if (!safeArray(state.settings.selectedAmenities).includes(value)) {
    toggleAmenitySelection(value);
  } else {
    persistSettings();
    renderDecisions();
    updatePromptText();
  }
  if (input) input.value = "";
}

function removeAmenitySelection(value) {
  const amenity = normalizeAmenityValue(value);
  state.settings.selectedAmenities = safeArray(state.settings.selectedAmenities).filter((item) => item !== amenity);
  persistSettings();
  renderAll();
  updatePromptText();
}

function toggleAmenitySelection(value) {
  const amenity = normalizeAmenityValue(value);
  if (!amenity) return;
  const currentTarget = Number(state.settings.amenityCount || 0);
  const next = new Set(safeArray(state.settings.selectedAmenities));
  if (next.has(amenity)) next.delete(amenity);
  else {
    if (next.size >= MAX_AMENITY_COUNT) {
      toast(`Puedes elegir hasta ${MAX_AMENITY_COUNT} amenidades por brochure.`, "warn");
      return;
    }
    next.add(amenity);
    if (currentTarget === 0 || next.size > currentTarget) {
      state.settings.amenityCount = String(Math.min(MAX_AMENITY_COUNT, next.size));
      toast(`Cantidad de amenidades ajustada a ${state.settings.amenityCount}.`, "ok");
    }
  }
  const max = Number(state.settings.amenityCount || 0);
  state.settings.selectedAmenities = [...next].slice(0, Math.max(max, 0));
  persistSettings();
  renderAll();
  updatePromptText();
}

function shiftCurrentSlide(direction) {
  const blueprints = computePdfSlideBlueprints();
  if (!blueprints.length) return;
  const index = Math.max(0, blueprints.findIndex((entry) => entry.key === state.pdfBuilder.currentSlideKey));
  const targetIndex = clamp(index + direction, 0, blueprints.length - 1);
  state.pdfBuilder.currentSlideKey = blueprints[targetIndex].key;
  renderAll();
}

function setSlideImageCount(slideKey, count) {
  const config = state.settings.pdfSlideConfigs[slideKey];
  if (!config) return;
  const nextCount = clamp(Number(count) || 1, 1, 6);
  config.imageCount = String(nextCount);
  const selected = safeArray(config.imageIds).filter((id) => state.images.some((image) => image.id === id));
  if (selected.length > nextCount) {
    config.imageIds = selected.slice(0, nextCount);
  } else if (selected.length < nextCount) {
    const additions = state.images
      .map((image) => image.id)
      .filter((id) => !selected.includes(id))
      .slice(0, nextCount - selected.length);
    config.imageIds = [...selected, ...additions];
  } else {
    config.imageIds = selected;
  }
  config.activeImageId = config.imageIds.find((id) => id === config.activeImageId) || config.imageIds[0] || state.mainId || state.images[0]?.id || "";
  persistSettings();
  renderAll();
  updatePromptText();
}

function setSlideActiveImage(slideKey, imageId) {
  const config = state.settings.pdfSlideConfigs[slideKey];
  if (!config || !imageId) return;
  if (!config.useProjectImages) {
    toast("Activa primero el uso de fotos del proyecto para esta diapositiva.", "warn");
    return;
  }
  const count = resolveSlideImageCount(config);
  const selected = safeArray(config.imageIds).filter((id) => state.images.some((image) => image.id === id));
  config.imageIds = [imageId, ...selected.filter((id) => id !== imageId)].slice(0, count);
  config.activeImageId = imageId;
  config.imageCount = String(count);
  persistSettings();
  renderAll();
  updatePromptText();
}

function toggleSlideImageSelection(slideKey, imageId) {
  const config = state.settings.pdfSlideConfigs[slideKey];
  if (!config) return;
  if (!config.useProjectImages) {
    toast("Activa primero el uso de fotos del proyecto para esta diapositiva.", "warn");
    return;
  }
  const next = new Set(safeArray(config.imageIds));
  if (next.has(imageId)) next.delete(imageId);
  else next.add(imageId);
  config.imageIds = [...next];
  config.imageCount = String(Math.max(1, Math.min(config.imageIds.length || 1, 6)));
  config.activeImageId = config.imageIds.includes(config.activeImageId) ? config.activeImageId : config.imageIds[0] || state.mainId || state.images[0]?.id || "";
  persistSettings();
  renderAll();
  updatePromptText();
}

function toggleSlideMoodSource(slideKey, value) {
  const config = state.settings.pdfSlideConfigs[slideKey];
  if (!config) return;
  const set = new Set(config.moodSources || []);
  if (set.has(value)) set.delete(value);
  else set.add(value);
  config.moodSources = [...set];
  persistSettings();
  renderAll();
  updatePromptText();
}

function toggleSlideTagSelection(slideKey, field, value, limit = 8) {
  const config = state.settings.pdfSlideConfigs[slideKey];
  if (!config) return;
  const set = new Set(safeArray(config[field]));
  if (set.has(value)) set.delete(value);
  else if (set.size < limit) set.add(value);
  config[field] = [...set];
  persistSettings();
  renderAll();
}

function getSelectedValues(selectElement) {
  return Array.from(selectElement?.selectedOptions || []).map((option) => option.value);
}

function handleAssetAction(action, itemId) {
  if (action === "set-main") {
    state.mainId = itemId;
    state.result.render = null;
    state.result.deck = null;
    renderAll();
    if (getMainImage() && !getMainImage().analysis) runMainAnalysis(false);
    return;
  }

  if (action === "delete-image") {
    const index = state.images.findIndex((item) => item.id === itemId);
    if (index === -1) return;
    state.images.splice(index, 1);
    Object.values(state.settings.pdfSlideConfigs || {}).forEach((config) => {
      config.imageIds = safeArray(config.imageIds).filter((id) => id !== itemId);
    });
    if (state.mainId === itemId) {
      state.mainId = state.images[0]?.id || null;
    }
    state.result.render = null;
    state.result.deck = null;
    renderAll();
    return;
  }

  if (action === "delete-doc") {
    state.documents = state.documents.filter((item) => item.id !== itemId);
    state.result.deck = null;
    renderAll();
  }
}

function restartCurrentFlow() {
  resetFlowRuntime({ preserveAssets: false, clearFlow: false });
  renderAll();
}

function resetFlowRuntime(options = {}) {
  const preserveAssets = Boolean(options.preserveAssets);
  const clearFlow = Boolean(options.clearFlow);

  state.currentStep = 1;
  state.generation.busy = false;
  state.generation.kind = null;
  state.generation.stage = "";
  state.annotation.mode = false;
  state.annotation.dragging = false;
  state.annotation.draft = null;
  state.annotation.label = "";
  state.result.render = null;
  state.result.deck = null;
  state.pdfBuilder.currentSlideKey = null;

  if (!preserveAssets) {
    state.images = [];
    state.documents = [];
    state.mainId = null;
  }

  if (clearFlow) {
    state.flow = null;
  }
}

async function validateRenderOccupancy(sourceUrl) {
  try {
    if (!sourceUrl) {
      return buildOccupancyValidationResult(true, 0);
    }
    const image = await loadImage(sourceUrl);
    const objects = await detectObjects(image);
    const peopleCount = objects.filter((entry) => entry.label === "persona").length;
    return buildOccupancyValidationResult(matchesOccupancyExpectation(peopleCount), peopleCount);
  } catch {
    return buildOccupancyValidationResult(true, 0);
  }
}

function matchesOccupancyExpectation(peopleCount) {
  if (state.settings.occupancy === "none") return peopleCount === 0;
  if (state.settings.occupancy === "many") return peopleCount >= 4;
  return peopleCount >= 1 && peopleCount <= 3;
}

function buildOccupancyValidationResult(valid, peopleCount) {
  if (valid) {
    return { valid: true, message: "", retryInstruction: "" };
  }
  if (state.settings.occupancy === "none") {
    return {
      valid: false,
      message: "Se detectaron personas en un render que debia salir sin personas. Corrigiendo una vez mas...",
      retryInstruction: `la lectura final detecto ${peopleCount} personas. El nuevo resultado debe salir sin ninguna persona, silueta ni extra.`,
    };
  }
  if (state.settings.occupancy === "few") {
    return {
      valid: false,
      message: "La densidad humana no coincide con el modo de pocas personas. Corrigiendo una vez mas...",
      retryInstruction: `la lectura final detecto ${peopleCount} personas. El nuevo resultado debe mostrar solo 1 a 3 personas secundarias, discretas y naturales.`,
    };
  }
  return {
    valid: false,
    message: "La densidad humana quedo por debajo de lo pedido. Corrigiendo una vez mas...",
    retryInstruction: `la lectura final detecto ${peopleCount} personas. El nuevo resultado debe mostrar varias personas visibles, naturales y creibles.`,
  };
}

function removeAnalysisToken(key, value) {
  const analysis = getMainImage()?.analysis;
  if (!analysis || !Array.isArray(analysis[key])) return;
  analysis[key] = analysis[key].filter((item) => item !== value);
  analysis.overlay = safeArray(analysis.overlay).filter((entry) => !(entry.manual && entry.category === key && entry.label === value));
  analysis.summary = rebuildAnalysisSummary(analysis);
  updatePromptText();
  renderAnalysis();
}

function addAnalysisToken(key) {
  const analysis = getMainImage()?.analysis;
  if (!analysis || !Array.isArray(analysis[key])) return;

  let value = "";
  const select = document.querySelector(`[data-analysis-select="${key}"]`);
  const input = document.querySelector(`[data-analysis-input="${key}"]`);
  if (select) value = select.value.trim();
  if (input) value = input.value.trim();
  if (!value) return;

  analysis[key] = unique([...(analysis[key] || []), value]);
  analysis.summary = rebuildAnalysisSummary(analysis);
  if (select) select.value = "";
  if (input) input.value = "";
  if (key === "texts" || key === "objects" || key === "materials" || key === "environment") {
    state.annotation.key = key;
    state.annotation.label = value;
    syncAnnotationUi();
  }
  updatePromptText();
  renderAnalysis();
}

function rebuildAnalysisSummary(analysis) {
  return buildAnalysisSummary({
    objects: analysis.objects || [],
    texts: analysis.texts || [],
    materials: analysis.materials || [],
    environment: analysis.environment || [],
    composition: analysis.composition || [],
    realismRisks: analysis.realismRisks || [],
    lightMood: analysis.lightMood || "Balanceada",
  });
}

function buildAnalysisSummary(parts) {
  return [
    `Escena ${parts.objects.length ? `con ${parts.objects.slice(0, 5).join(", ")}` : "sin objetos dominantes detectados"}.`,
    parts.texts.length ? `OCR visible: ${parts.texts.slice(0, 4).join(", ")}.` : "Sin OCR claro todavia.",
    parts.materials.length ? `Materialidad dominante: ${parts.materials.slice(0, 4).join(", ")}.` : "Materialidad pendiente.",
    parts.environment.length ? `Entorno: ${parts.environment.slice(0, 4).join(", ")}.` : "",
    parts.composition.length ? `Composicion: ${parts.composition.slice(0, 3).join(", ")}.` : "",
    `Luz: ${parts.lightMood}.`,
    parts.realismRisks.length ? `Riesgos de salida: ${parts.realismRisks.slice(0, 3).join(", ")}.` : "",
  ].filter(Boolean).join(" ");
}

function normalizeAnalysisFromApi(analysis) {
  return {
    summary: String(analysis.summary || ""),
    sceneType: String(analysis.sceneType || ""),
    cameraNotes: String(analysis.cameraNotes || ""),
    lightMood: String(analysis.lightMood || ""),
    objects: normalizeStringArray(analysis.objects, 16),
    texts: normalizeStringArray(analysis.texts, 12),
    materials: normalizeStringArray(analysis.materials, 12),
    environment: normalizeStringArray(analysis.environment, 12),
    composition: normalizeStringArray(analysis.composition, 10),
    realismRisks: normalizeStringArray(analysis.realismRisks, 10),
  };
}

function normalizeStringArray(value, limit) {
  return unique(safeArray(value).map((item) => String(item).trim()).filter(Boolean)).slice(0, limit);
}

function mergeOverlayEntries(baseEntries = [], extraEntries = []) {
  const merged = [...safeArray(baseEntries), ...safeArray(extraEntries)].filter(Boolean);
  const seen = new Set();
  return merged.filter((entry) => {
    const signature = [entry.category || "", entry.label || "", Math.round(entry.x || 0), Math.round(entry.y || 0), Math.round(entry.width || 0), Math.round(entry.height || 0)].join("|");
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

function syncAnnotationUi() {
  if (elements.annotationCategory) elements.annotationCategory.value = state.annotation.key;
  if (elements.annotationLabel && document.activeElement !== elements.annotationLabel) elements.annotationLabel.value = state.annotation.label || "";
  if (elements.annotationToggleBtn) {
    elements.annotationToggleBtn.textContent = state.annotation.mode ? "Marcacion activa" : "Activar marcacion";
  }
  if (elements.annotationHelp) {
    elements.annotationHelp.textContent = state.annotation.mode
      ? "Arrastra sobre la referencia para marcar exactamente donde esta el objeto, texto o material nuevo."
      : "Activa la marcacion para dibujar una region exacta sobre la referencia principal.";
  }
}

function toggleAnnotationMode() {
  if (!getMainImage()?.analysis) {
    toast("Necesitas una lectura activa antes de marcar manualmente.", "warn");
    return;
  }
  state.annotation.mode = !state.annotation.mode;
  state.annotation.dragging = false;
  state.annotation.draft = null;
  renderAnalysis();
}

function cancelAnnotationMode() {
  state.annotation.mode = false;
  state.annotation.dragging = false;
  state.annotation.draft = null;
  hideAnnotationDraft();
  syncAnnotationUi();
  renderAnalysis();
}

function startAnnotationDrag(event) {
  if (!state.annotation.mode || !getMainImage()?.analysis) return;
  if (!elements.analysisCanvas || !elements.analysisInteractionLayer) return;
  const label = elements.annotationLabel.value.trim();
  if (!label) {
    toast("Escribe primero la etiqueta que quieres ubicar en la imagen.", "warn");
    return;
  }

  const point = getPointerPercent(event, elements.analysisCanvas);
  state.annotation.label = label;
  state.annotation.dragging = true;
  state.annotation.draft = {
    x: point.x,
    y: point.y,
    width: 0,
    height: 0,
  };
  renderAnnotationDraft(state.annotation.draft);
}

function updateAnnotationDrag(event) {
  if (!state.annotation.dragging || !state.annotation.draft || !elements.analysisCanvas) return;
  const point = getPointerPercent(event, elements.analysisCanvas);
  const startX = state.annotation.draft.x;
  const startY = state.annotation.draft.y;
  state.annotation.draft = {
    x: Math.min(startX, point.x),
    y: Math.min(startY, point.y),
    width: Math.abs(point.x - startX),
    height: Math.abs(point.y - startY),
  };
  renderAnnotationDraft(state.annotation.draft);
}

function finishAnnotationDrag() {
  if (!state.annotation.dragging || !state.annotation.draft) return;
  const draft = { ...state.annotation.draft };
  state.annotation.dragging = false;
  state.annotation.draft = null;
  hideAnnotationDraft();

  if (draft.width < 3 || draft.height < 3) {
    toast("La region es demasiado pequena. Intenta arrastrar un area mas clara.", "warn");
    return;
  }

  const analysis = getMainImage()?.analysis;
  if (!analysis) return;
  const key = state.annotation.key;
  const value = elements.annotationLabel.value.trim();
  const entry = {
    id: cryptoRandom(),
    type: "box",
    manual: true,
    category: key,
    label: value,
    x: draft.x,
    y: draft.y,
    width: draft.width,
    height: draft.height,
    order: 90 + safeArray(analysis.overlay).length,
  };

  analysis.overlay = mergeOverlayEntries(analysis.overlay, [entry]);
  analysis[key] = unique([...(analysis[key] || []), value]);
  analysis.summary = rebuildAnalysisSummary(analysis);
  updatePromptText();
  renderAnalysis();
  toast("Marcacion manual agregada a la lectura.", "ok");
}

function renderAnnotationDraft(draft) {
  if (!elements.annotationDraft) return;
  elements.annotationDraft.classList.remove("hidden");
  elements.annotationDraft.style.left = `${draft.x}%`;
  elements.annotationDraft.style.top = `${draft.y}%`;
  elements.annotationDraft.style.width = `${draft.width}%`;
  elements.annotationDraft.style.height = `${draft.height}%`;
}

function hideAnnotationDraft() {
  if (!elements.annotationDraft) return;
  elements.annotationDraft.classList.add("hidden");
  elements.annotationDraft.style.removeProperty("left");
  elements.annotationDraft.style.removeProperty("top");
  elements.annotationDraft.style.removeProperty("width");
  elements.annotationDraft.style.removeProperty("height");
}

function getPointerPercent(event, container) {
  const bounds = container.getBoundingClientRect();
  const x = clamp(((event.clientX - bounds.left) / Math.max(bounds.width, 1)) * 100, 0, 100);
  const y = clamp(((event.clientY - bounds.top) / Math.max(bounds.height, 1)) * 100, 0, 100);
  return { x, y };
}

function describeRegion(entry) {
  const horizontal = entry.x < 33 ? "izquierda" : entry.x > 66 ? "derecha" : "centro";
  const vertical = entry.y < 33 ? "superior" : entry.y > 66 ? "inferior" : "media";
  return `zona ${vertical} ${horizontal}`;
}

function inferVisualRole(slide, index = 0) {
  const text = `${slide.tag || ""} ${slide.title || ""} ${slide.subtitle || ""}`.toLowerCase();
  if (index === 0) return "hero";
  if (text.includes("color") || text.includes("pantone") || text.includes("paleta")) return "palette";
  if (text.includes("quienes somos") || text.includes("que hacemos") || text.includes("estudio") || text.includes("servicios")) return "identity";
  if (text.includes("material")) return "materials";
  if (text.includes("referencia") || text.includes("escena")) return "reference";
  if (text.includes("mood") || text.includes("concept") || text.includes("valor") || text.includes("narrativa")) return "moodboard";
  if (text.includes("cierre") || index === Number(state.settings.pageCount || 8) - 1) return "closing";
  return "detail";
}

function inferSlideLayout(slide, index = 0) {
  const role = slide.visualRole || inferVisualRole(slide, index);
  if (role === "hero" || role === "closing") return "feature";
  if (role === "moodboard" || role === "materials") return "board";
  return "split";
}

async function buildEditorialBoard(sourceUrls, theme = "board") {
  const urls = unique(sourceUrls.filter(Boolean)).slice(0, 4);
  if (!urls.length) return "";

  const images = (await Promise.all(urls.map((url) => loadImage(url).catch(() => null)))).filter(Boolean);
  if (!images.length) return urls[0];

  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1800;
  const context = canvas.getContext("2d");
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, styleProfile.paper || "#fcf8f1");
  gradient.addColorStop(0.52, styleProfile.palette?.[0] || "#f1e6d7");
  gradient.addColorStop(1, styleProfile.palette?.[1] || "#eadbc8");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (["concepto", "materialidad", "mood", "referencia"].includes(String(theme))) {
    await drawCleanMoodBoard(context, urls[0], {
      x: 64,
      y: 72,
      width: canvas.width - 128,
      height: canvas.height - 144,
      palette: state.settings.selectedPalette?.length ? state.settings.selectedPalette : getSuggestedPalette(getPdfDeckAnalysis()),
      accent: styleProfile.accent || "#8b6a4a",
      radius: 46,
      materials: getPdfDeckAnalysis()?.materials || [],
      objects: getPdfDeckAnalysis()?.objects || [],
      bodyFont: state.settings.bodyFont || "Manrope",
    });
    return canvas.toDataURL("image/jpeg", 0.92);
  }

  const themes = {
    concepto: [
      { x: 72, y: 72, width: 620, height: 760 },
      { x: 760, y: 72, width: 566, height: 420 },
      { x: 760, y: 540, width: 566, height: 610 },
      { x: 160, y: 940, width: 470, height: 710 },
    ],
    materialidad: [
      { x: 92, y: 92, width: 520, height: 640 },
      { x: 672, y: 92, width: 636, height: 370 },
      { x: 672, y: 520, width: 300, height: 460 },
      { x: 1010, y: 520, width: 298, height: 460 },
    ],
    mood: [
      { x: 90, y: 90, width: 548, height: 708 },
      { x: 700, y: 90, width: 610, height: 340 },
      { x: 700, y: 472, width: 280, height: 628 },
      { x: 1024, y: 472, width: 286, height: 410 },
    ],
    board: [
      { x: 72, y: 72, width: 580, height: 720 },
      { x: 720, y: 72, width: 608, height: 420 },
      { x: 720, y: 540, width: 608, height: 700 },
      { x: 72, y: 860, width: 580, height: 860 },
    ],
  };
  const frames = themes[theme] || themes.board;

  context.fillStyle = "rgba(255,255,255,0.32)";
  context.beginPath();
  context.ellipse(1140, 210, 250, 130, -0.25, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.ellipse(240, 1530, 280, 150, 0.18, 0, Math.PI * 2);
  context.fill();

  images.forEach((image, index) => {
    const frame = frames[index] || frames[frames.length - 1];
    drawCoverImage(context, image, frame);
  });

  context.strokeStyle = "rgba(107, 72, 41, 0.12)";
  context.lineWidth = 2;
  context.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  const swatches = unique(getSuggestedPalette(getPdfDeckAnalysis())).slice(0, 5);
  swatches.forEach((color, index) => {
    context.fillStyle = color;
    roundRectPath(context, 72 + index * 96, canvas.height - 112, 74, 48, 10);
    context.fill();
  });
  context.fillStyle = colorMixHex(styleProfile.accent || "#8b6a4a", "#ffffff", 0.3);
  context.fillRect(72, canvas.height - 42, 280, 6);

  return canvas.toDataURL("image/jpeg", 0.9);
}

function buildPaletteBoard(colors) {
  const swatches = unique((colors || []).filter(Boolean)).slice(0, 6);
  if (!swatches.length) return "";
  const canvas = document.createElement("canvas");
  canvas.width = 1400;
  canvas.height = 1800;
  const context = canvas.getContext("2d");
  const styleProfile = getBrochureStyleProfile(state.settings.brochureStyle);
  context.fillStyle = styleProfile.paper || "#f7f1e7";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = styleProfile.ink || "#6c533f";
  context.font = `600 26px "${state.settings.bodyFont || "Manrope"}", sans-serif`;
  context.fillText("PALETA CURADA", 92, 110);
  context.font = `600 62px "${state.settings.titleFont || "Cormorant Garamond"}", serif`;
  context.fillText("Color system", 92, 182);

  swatches.forEach((color, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 92 + column * 620;
    const y = 180 + row * 360;
    context.fillStyle = color;
    context.beginPath();
    context.roundRect(x, y, 540, 260, 36);
    context.fill();
    context.fillStyle = "rgba(255,255,255,0.84)";
    context.beginPath();
    context.roundRect(x + 30, y + 178, 212, 48, 20);
    context.fill();
    context.fillStyle = styleProfile.ink || "#3a2e25";
    context.font = `600 24px "${state.settings.bodyFont || "Manrope"}", sans-serif`;
    context.fillText(String(color).toUpperCase(), x + 50, y + 210);
  });

  return canvas.toDataURL("image/jpeg", 0.92);
}

async function cropDataUrl(sourceUrl, crop, maxSide = 1600) {
  const image = await loadImage(sourceUrl);
  const sx = Math.round((crop.x || 0) / 100 * image.naturalWidth);
  const sy = Math.round((crop.y || 0) / 100 * image.naturalHeight);
  const sw = Math.round((crop.width || 100) / 100 * image.naturalWidth);
  const sh = Math.round((crop.height || 100) / 100 * image.naturalHeight);
  const scale = maxSide / Math.max(sw, sh, 1);
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(sw * scale));
  canvas.height = Math.max(1, Math.round(sh * scale));
  const context = canvas.getContext("2d");
  context.drawImage(image, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function drawCoverImage(context, image, frame) {
  const imageRatio = image.naturalWidth / Math.max(image.naturalHeight, 1);
  const frameRatio = frame.width / Math.max(frame.height, 1);
  let drawWidth = frame.width;
  let drawHeight = frame.height;
  let offsetX = frame.x;
  let offsetY = frame.y;

  if (imageRatio > frameRatio) {
    drawHeight = frame.height;
    drawWidth = frame.height * imageRatio;
    offsetX = frame.x - (drawWidth - frame.width) / 2;
  } else {
    drawWidth = frame.width;
    drawHeight = frame.width / Math.max(imageRatio, 0.001);
    offsetY = frame.y - (drawHeight - frame.height) / 2;
  }

  context.save();
  context.beginPath();
  context.roundRect(frame.x, frame.y, frame.width, frame.height, 34);
  context.clip();
  context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
  context.restore();

  context.strokeStyle = "rgba(107, 72, 41, 0.12)";
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(frame.x, frame.y, frame.width, frame.height, 34);
  context.stroke();
}

function pickImageSize(main) {
  return main.analysis?.aspect === "Vertical" ? "1024x1536" : "1536x1024";
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
  overlay.addColorStop(0, "rgba(255, 191, 128, 0.08)");
  overlay.addColorStop(1, "rgba(44, 31, 24, 0.14)");
  context.fillStyle = overlay;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return { url: canvas.toDataURL("image/png"), source: "local" };
}

function buildCanvasFilter() {
  const styleMap = {
    bright: "contrast(1.06) brightness(1.06) saturate(1.02)",
    warm: "contrast(1.08) brightness(1.03) saturate(1.05) sepia(0.08)",
    moody: "contrast(1.12) brightness(0.92) saturate(0.94)",
    atmospheric: "contrast(1.03) brightness(1.01) saturate(0.98)",
  };
  const finishMap = {
    crisp: " contrast(1.08)",
    "filmic-grain": " contrast(1.02) saturate(0.96)",
    "soft-film": " blur(0.2px) brightness(1.01)",
    "contrast-rich": " contrast(1.12)",
  };
  return `${styleMap[state.settings.imageMood] || styleMap.warm}${finishMap[state.settings.imageFinish] || ""}`;
}

function deriveMaterials(pixel, objects, texts) {
  const materials = [];
  if (pixel.warmRatio > 0.34) materials.push("madera calida");
  if (pixel.averageBrightness < 0.62 && pixel.contrast > 0.18) materials.push("piedra natural");
  if (pixel.coolRatio > 0.22) materials.push("metal grafito");
  if (pixel.skyRatio > 0.18 || objects.some((entry) => ["window", "door"].includes(entry.label))) materials.push("vidrio claro");
  if (pixel.greenRatio > 0.12 || objects.some((entry) => entry.label.includes("plant"))) materials.push("vegetacion tropical");
  if (texts.length) materials.push("senaletica");
  if (!materials.length) materials.push("concreto aparente");
  return unique(materials).slice(0, 6);
}

function deriveEnvironment(pixel, objects, texts) {
  const tags = [];
  if (pixel.skyRatio > 0.2) tags.push("apertura al exterior");
  if (pixel.greenRatio > 0.12) tags.push("vegetacion visible");
  if (objects.some((entry) => entry.label.includes("person"))) tags.push("ocupacion humana");
  if (objects.some((entry) => entry.label.includes("chair") || entry.label.includes("couch"))) tags.push("hospitality premium");
  if (texts.length) tags.push("rotulos presentes");
  if (!tags.length) tags.push("interior arquitectonico");
  return unique(tags).slice(0, 5);
}

function deriveComposition(pixel, objects, image) {
  const tags = ["camara bloqueada"];
  if (image.naturalWidth / Math.max(image.naturalHeight, 1) > 1.42) tags.push("crop horizontal");
  if (objects.some((entry) => entry.x < 18) && objects.some((entry) => entry.x > 55)) tags.push("framing bilateral");
  if (objects.length >= 4) tags.push("profundidad central");
  if (pixel.contrast > 0.18) tags.push("separacion de planos");
  if (!tags.includes("eje frontal")) tags.push("eje frontal");
  return unique(tags).slice(0, 5);
}

function deriveRealismRisks(pixel, objects, texts) {
  const risks = [];
  if (texts.length) risks.push("texto poco legible");
  if (pixel.skyRatio > 0.16) risks.push("fondo y cielo sensibles");
  if (objects.some((entry) => entry.label.includes("window") || entry.label.includes("door"))) risks.push("vidrios debiles");
  if (pixel.contrast < 0.11) risks.push("imagen plana");
  if (pixel.averageBrightness < 0.28) risks.push("sombras cerradas");
  if (!risks.length) risks.push("uniformidad total");
  return unique(risks).slice(0, 5);
}

function deriveSceneType(objects, environment) {
  if (environment.includes("hospitality premium")) return "hospitality / comercial";
  if (objects.some((entry) => entry.label.includes("chair"))) return "interior de estancia";
  return "escena arquitectonica";
}

function deriveCameraNotes(pixel, image) {
  if (image.naturalWidth / Math.max(image.naturalHeight, 1) > 1.42) return "camara horizontal abierta";
  if (pixel.contrast > 0.18) return "camara frontal con profundidad";
  return "camara arquitectonica bloqueada";
}

function feedbackCardMarkup(item) {
  return `
    <article class="feedback-item">
      <div class="feedback-meta">
        <span>${escapeHtml(item.user)} · ${escapeHtml(item.flow)}</span>
        <span>${escapeHtml(formatDate(item.createdAt))}</span>
      </div>
      <strong>${escapeHtml(item.category)} · ${escapeHtml(String(item.rating))}/5</strong>
      <p>${escapeHtml(item.message)}</p>
    </article>
  `;
}

async function checkApiHealth() {
  const candidates = getApiCandidates();
  let connected = false;
  for (const base of candidates) {
    try {
      const response = await fetch(`${base}/api/health`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `Status ${response.status}`);
      state.server.healthy = true;
      state.server.aiReady = Boolean(data.renderReady ?? data.aiReady);
      state.server.analysisReady = Boolean(data.analysisReady ?? data.openAiReady ?? false);
      state.server.renderProvider = data.renderProvider || (state.server.aiReady ? "openai" : "local");
      state.server.analysisProvider = data.analysisProvider || (state.server.analysisReady ? "openai" : "none");
      state.server.secretSource = data.renderSecretSource || data.secretSource || "none";
      state.server.baseUrl = base;
      state.server.port = data.port || "";
      if (state.server.aiReady) {
        const renderLabel = state.server.renderProvider === "gemini" ? "render Gemini" : "render OpenAI";
        const analysisLabel = state.server.analysisReady ? "analisis OpenAI" : "analisis local";
        elements.apiHealthChip.textContent = `Servidor listo · ${renderLabel} · ${analysisLabel}${data.port ? ` · ${data.port}` : ""}`;
      } else {
        elements.apiHealthChip.textContent = `Servidor listo · modo local${data.port ? ` · ${data.port}` : ""}`;
      }
      elements.apiHealthChip.className = `status-chip ${state.server.aiReady ? "status-ok" : "status-warn"}`;
      connected = true;
      break;
    } catch {
      connected = false;
    }
  }
  if (!connected) {
    state.server.healthy = false;
    state.server.aiReady = false;
    state.server.analysisReady = false;
    state.server.renderProvider = "local";
    state.server.analysisProvider = "none";
    state.server.secretSource = "none";
    state.server.baseUrl = "";
    state.server.port = "";
    elements.apiHealthChip.textContent = "Servidor no disponible";
    elements.apiHealthChip.className = "status-chip status-error";
  }
  renderAnalysis();
  renderDecisions();
  renderResult();
}

function getApiCandidates() {
  const candidates = [];
  if (state.server.baseUrl) candidates.push(state.server.baseUrl);
  if (window.location.protocol === "http:" || window.location.protocol === "https:") {
    candidates.push(window.location.origin);
  }
  [
    "8080", "8081", "8082", "8083", "8084", "8085",
    "8111", "8112", "8113", "8114", "8115", "8116", "8117", "8118", "8119", "8120",
  ].forEach((port) => {
    candidates.push(`http://127.0.0.1:${port}`, `http://localhost:${port}`);
  });
  return unique(candidates.filter(Boolean));
}

function buildApiUrl(base, path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${String(base).replace(/\/$/, "")}${normalizedPath}`;
}

async function apiRequest(path, init = {}) {
  if (!state.server.baseUrl || !state.server.healthy) {
    await checkApiHealth();
  }
  const candidates = state.server.baseUrl
    ? [state.server.baseUrl, ...getApiCandidates().filter((entry) => entry !== state.server.baseUrl)]
    : getApiCandidates();
  let lastError = new Error("API no disponible");
  for (const base of candidates) {
    try {
      const response = await fetch(buildApiUrl(base, path), init);
      const contentType = String(response.headers.get("content-type") || "");
      if (contentType.includes("text/html")) {
        throw new Error(`Respuesta no API desde ${base}`);
      }
      state.server.baseUrl = base;
      return response;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
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

async function detectObjects(image) {
  const model = await ensureCocoModel();
  if (!model) return [];
  const predictions = await model.detect(image);
  return predictions
    .filter((entry) => entry.score >= 0.48)
    .slice(0, 12)
    .map((entry, index) => {
      const label = mapObjectPredictionLabel(entry.class);
      if (!label) return null;
      const [x, y, width, height] = entry.bbox;
      return {
        type: "box",
        label,
        confidence: entry.score,
        x: (x / image.naturalWidth) * 100,
        y: (y / image.naturalHeight) * 100,
        width: (width / image.naturalWidth) * 100,
        height: (height / image.naturalHeight) * 100,
        order: index,
      };
    })
    .filter(Boolean);
}

async function detectText(dataUrl) {
  const Tesseract = await ensureTesseract();
  if (!Tesseract) return [];
  const result = await Tesseract.recognize(dataUrl, "eng+spa");
  return safeArray(result?.data?.words)
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

function getMainImage() {
  return state.images.find((item) => item.id === state.mainId) || state.images[0] || null;
}

function persistSettings() {
  saveJson(STORAGE_KEYS.settings, state.settings);
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

async function dataUrlToJpeg(sourceUrl, quality = 0.9, maxWidth = 2200) {
  const image = await loadImage(sourceUrl);
  const ratio = Math.min(1, maxWidth / Math.max(image.naturalWidth, 1));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", quality);
}

async function getImageDimensions(sourceUrl) {
  const image = await loadImage(sourceUrl);
  return { width: image.naturalWidth, height: image.naturalHeight };
}

function toast(message, tone = "soft") {
  const rack = document.getElementById("toastRack");
  const node = document.createElement("div");
  node.className = `toast ${tone === "error" ? "status-error" : tone === "warn" ? "status-warn" : tone === "ok" ? "status-ok" : "status-soft"}`;
  node.textContent = message;
  rack.appendChild(node);
  setTimeout(() => node.remove(), 3600);
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
    // Ignore storage quota issues.
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

function mapObjectPredictionLabel(value) {
  const normalized = normalizeLabel(value).toLowerCase();
  const allowed = {
    person: "persona",
    chair: "chair",
    couch: "sofa",
    bed: "bed",
    "dining table": "mesa",
    bench: "bench",
    "potted plant": "planta",
    plant: "planta",
    tv: "pantalla",
    laptop: "laptop",
    book: "book",
    vase: "vase",
    bottle: "botella",
    cup: "cup",
    sink: "lavatorio",
    toilet: "sanitario",
    refrigerator: "refrigerador",
    oven: "horno",
    microwave: "microondas",
    door: "door",
    window: "window",
    clock: "reloj",
    lamp: "lampara",
    mirror: "espejo",
  };
  return allowed[normalized] || null;
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
