param(
  [int]$Port = 8080
)

$root = (Get-Location).Path
$resolvedRoot = [System.IO.Path]::GetFullPath($root)
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Prefixes.Add("http://localhost:$Port/")
$script:PdfEncoding = [System.Text.Encoding]::GetEncoding(1252)

function Write-JsonResponse {
  param(
    [Parameter(Mandatory = $true)]$Response,
    [Parameter(Mandatory = $true)]$Payload,
    [int]$StatusCode = 200
  )

  $json = $Payload | ConvertTo-Json -Depth 8
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $Response.StatusCode = $StatusCode
  $Response.ContentType = "application/json; charset=utf-8"
  $Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Get-RequestJson {
  param(
    [Parameter(Mandatory = $true)]$Request
  )

  $reader = [System.IO.StreamReader]::new($Request.InputStream, $Request.ContentEncoding)
  try {
    $body = $reader.ReadToEnd()
  } finally {
    $reader.Dispose()
  }

  if ([string]::IsNullOrWhiteSpace($body)) {
    return @{}
  }

  return $body | ConvertFrom-Json
}

function Get-PropValue {
  param(
    [Parameter(Mandatory = $true)]$Object,
    [Parameter(Mandatory = $true)][string]$Name,
    $Default = ""
  )

  if ($null -eq $Object) { return $Default }
  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) { return $Default }
  $value = $property.Value
  if ($null -eq $value) { return $Default }
  return $value
}

function Get-DocumentsSummary {
  param(
    [Parameter(Mandatory = $false)]$Documents
  )

  if ($null -eq $Documents) {
    return "No base documents were uploaded."
  }

  $names = @()
  foreach ($doc in @($Documents)) {
    $name = Get-PropValue -Object $doc -Name "fileName" -Default (Get-PropValue -Object $doc -Name "name" -Default "")
    if (-not [string]::IsNullOrWhiteSpace($name)) {
      $names += $name
    }
  }

  if (-not $names.Count) {
    return "No base documents were uploaded."
  }

  return ($names -join ", ")
}

function New-RenderPromptFromPayload {
  param(
    [Parameter(Mandatory = $true)]$Payload
  )

  $settings = Get-PropValue -Object $Payload -Name "settings" -Default $null
  $mainImage = Get-PropValue -Object $Payload -Name "mainImage" -Default $null
  $analysis = Get-PropValue -Object $mainImage -Name "analysis" -Default $null

  $lang = [string](Get-PropValue -Object $settings -Name "promptLanguage" -Default "english")
  $context = [string](Get-PropValue -Object $Payload -Name "projectContext" -Default "")
  $fidelity = [int](Get-PropValue -Object $settings -Name "fidelity" -Default 10)
  $realism = [int](Get-PropValue -Object $settings -Name "realism" -Default 10)
  $style = [string](Get-PropValue -Object $settings -Name "imageStyle" -Default "ultra-photorealistic architectural photography")
  $renderStyle = [string](Get-PropValue -Object $settings -Name "renderStyle" -Default "V-Ray / Corona / physically based")
  $timeOfDay = [string](Get-PropValue -Object $settings -Name "timeOfDay" -Default "morning")
  $lightType = [string](Get-PropValue -Object $settings -Name "lightType" -Default "natural daylight")
  $angle = [string](Get-PropValue -Object $settings -Name "photoAngle" -Default "eye-level frontal")
  $peopleMode = [string](Get-PropValue -Object $settings -Name "peopleMode" -Default "subtle ambient people")
  $projectName = if ([string]::IsNullOrWhiteSpace($context)) { "A high-end architectural project with no written context yet." } else { $context.Trim() }
  $sceneName = [string](Get-PropValue -Object $mainImage -Name "fileName" -Default "the uploaded image")

  if ($null -ne $analysis) {
    $imageFacts = @(
      "Image intelligence: $(Get-PropValue -Object $analysis -Name 'sceneType' -Default 'architectural scene'), $(Get-PropValue -Object $analysis -Name 'aspectLabel' -Default 'balanced proportion'), $(Get-PropValue -Object $analysis -Name 'brightnessLabel' -Default 'balanced'), $(Get-PropValue -Object $analysis -Name 'lightMood' -Default 'balanced light'), $(Get-PropValue -Object $analysis -Name 'edgeLabel' -Default '0%') edge complexity."
      "Dominant palette cues: $(Get-PropValue -Object $analysis -Name 'paletteMood' -Default 'neutral')."
      "Auto angle hint: $(Get-PropValue -Object $analysis -Name 'angleHint' -Default 'stable architectural perspective')."
    ) -join " "
  } else {
    $imageFacts = "Image intelligence will be inferred once a main image is selected."
  }

  $peopleSentence = switch ($peopleMode) {
    "no people" { "Do not add people or animate the scene with human figures." }
    "subtle ambient people" { "Add only a few subtle, natural people to support scale and atmosphere without stealing focus." }
    default { "Add natural staff and visitors in a believable way, always preserving architectural clarity." }
  }

  if ($lang -eq "spanish") {
    $intro = "Usa la imagen proporcionada estrictamente como geometria arquitectonica bloqueada y como referencia de composicion fija."
    $projectLabel = "Contexto del proyecto"
    $objective = "OBJETIVO GLOBAL"
    $geometry = "BLOQUEO ABSOLUTO DE GEOMETRIA"
    $objects = "BLOQUEO DE IDENTIDAD DE OBJETOS"
    $styleLabel = "ELIMINACION DE ESTILO"
    $materials = "RECONSTRUCCION DE MATERIALES PBR"
    $lighting = "SIMULACION FISICA DE LUZ"
    $realismLabel = "MICRO REALISMO"
    $photo = "SIMULACION DE FOTOGRAFIA ARQUITECTONICA"
    $output = "SALIDA FINAL"
    $negatives = "RESTRICCIONES NEGATIVAS"
    $closing = "Devuelve una sola imagen final."
  } else {
    $intro = "Use the provided image strictly as locked architectural geometry and as a fixed composition reference."
    $projectLabel = "Project context"
    $objective = "GLOBAL OBJECTIVE"
    $geometry = "ABSOLUTE GEOMETRY LOCK"
    $objects = "OBJECT IDENTITY LOCK"
    $styleLabel = "STYLE REMOVAL"
    $materials = "PHYSICALLY BASED MATERIAL RECONSTRUCTION"
    $lighting = "PHYSICAL LIGHTING SIMULATION"
    $realismLabel = "MICRO REALISM"
    $photo = "ARCHITECTURAL PHOTOGRAPHY SIMULATION"
    $output = "FINAL OUTPUT"
    $negatives = "NEGATIVE CONSTRAINTS"
    $closing = "Return a single final image."
  }

  $lines = @(
    $intro,
    "",
    ("{0}: {1}" -f $projectLabel, $projectName),
    ("Primary reference: {0}" -f $sceneName),
    ("Fidelity level: {0} / 10." -f $fidelity),
    ("Realism level: {0} / 10." -f $realism),
    ("Image style: {0}." -f $style),
    ("Render style: {0}." -f $renderStyle),
    ("Time of day: {0}." -f $timeOfDay),
    ("Light type: {0}." -f $lightType),
    ("Photo angle: {0}." -f $angle),
    ("People policy: {0}." -f $peopleMode),
    "",
    $objective,
    "Preserve the exact architectural design while replacing only the rendering quality.",
    "The final result must feel like a real architectural photograph captured by a professional full-frame camera.",
    "Keep layout, objects, furniture, camera, framing, perspective, and spatial relationships identical.",
    "",
    $imageFacts,
    "",
    $geometry,
    "Treat the image as immutable architectural geometry.",
    "Do not redesign, move, replace, add, or remove any architectural or furniture element.",
    "Camera position, perspective, framing, proportions, silhouettes, and spatial relationships are locked.",
    "",
    $objects,
    "Lighting fixtures, tables, chairs, sofas, shelving, mirrors, cabinets, and decorative objects remain identical in design and placement.",
    "Only lighting intensity and rendering realism may change.",
    "",
    $styleLabel,
    "Ignore the current visual style of the image completely.",
    "Do not replicate SketchUp shading, viewport look, clay render appearance, or any low-quality CGI behavior.",
    "Rebuild the scene as a real physical interior.",
    "",
    $materials,
    "Convert all surfaces into realistic PBR materials with physically accurate roughness, reflectance, texture, and micro-variation.",
    "Use realistic wood grain, woven fabric, plaster microtexture, dense carpet fibers, and believable metals or glass.",
    "",
    $lighting,
    ("Recreate lighting according to {0}, {1}, and {2}." -f $lightType, $timeOfDay, $renderStyle),
    "Use global illumination, ray-traced shadows, indirect bounce light, ambient occlusion, and natural falloff.",
    "Keep highlights controlled and exposure balanced so the space reads like premium architectural photography.",
    "",
    $realismLabel,
    "Add subtle contact shadows, micro surface detail, natural reflection behavior, and fine tonal transitions.",
    "Maintain a clean, premium interior aesthetic without overdoing imperfections.",
    "",
    $photo,
    "Simulate a professional interior photo with realistic lens perspective, balanced dynamic range, and editorial-grade realism.",
    "Avoid stylized cinematic effects, exaggerated depth of field, and any appearance of a rendered demo.",
    "",
    $peopleSentence,
    "",
    $negatives,
    "Absolutely avoid redesigning furniture, altering camera position, changing composition, inventing objects, or introducing CGI artifacts.",
    "Avoid plastic-looking materials, cartoon shading, overexposed highlights, and generic render aesthetics.",
    "",
    $output,
    "Generate a single final image.",
    "The geometry, furniture, layout, composition, and camera must remain identical.",
    "Only the rendering realism should improve.",
    $closing
  )

  return ($lines -join "`n")
}

function New-PresentationOutlineFromPayload {
  param(
    [Parameter(Mandatory = $true)]$Payload
  )

  $settings = Get-PropValue -Object $Payload -Name "settings" -Default $null
  $presentation = Get-PropValue -Object $Payload -Name "presentation" -Default $null

  $lang = [string](Get-PropValue -Object $settings -Name "promptLanguage" -Default "english")
  $projectContext = [string](Get-PropValue -Object $presentation -Name "context" -Default "Premium architectural project awaiting a sharper presentation brief.")
  $typology = [string](Get-PropValue -Object $presentation -Name "typology" -Default "Hospitality / mixed-use project")
  $location = [string](Get-PropValue -Object $presentation -Name "location" -Default "Location to be defined")
  $program = [string](Get-PropValue -Object $presentation -Name "program" -Default "Reception, public areas, key amenities, and spatial experience")
  $tone = [string](Get-PropValue -Object $presentation -Name "tone" -Default "premium persuasive")
  $needsPlans = [string](Get-PropValue -Object $presentation -Name "needsPlans" -Default "yes")
  $slideCount = [int](Get-PropValue -Object $presentation -Name "slideCount" -Default 10)
  $goal = [string](Get-PropValue -Object $presentation -Name "goal" -Default "Build a persuasive PDF presentation that sells the project clearly.")
  $documents = Get-DocumentsSummary -Documents (Get-PropValue -Object $presentation -Name "documents" -Default @())

  if ($lang -eq "spanish") {
    $lines = @(
      "Construye una presentacion PDF arquitectonica de alto nivel, clara, comercial y visualmente sobria.",
      "",
      ("Contexto del proyecto: {0}" -f $projectContext),
      ("Tipologia: {0}" -f $typology),
      ("Ubicacion: {0}" -f $location),
      ("Programa arquitectonico: {0}" -f $program),
      ("Tono comercial: {0}" -f $tone),
      ("Planos requeridos: {0}" -f $needsPlans),
      ("Cantidad objetivo de slides: {0}" -f $slideCount),
      ("Objetivo principal: {0}" -f $goal),
      ("Archivos base disponibles: {0}" -f $documents),
      "",
      "Estructura sugerida:",
      "1. Portada con concepto y promesa del proyecto.",
      "2. Contexto, oportunidad y narrativa de valor.",
      "3. Ubicacion y lectura del sitio.",
      "4. Tipologia y programa arquitectonico.",
      "5. Concepto rector y atmosfera espacial.",
      $(if ($needsPlans -eq "yes") { "6. Slide dedicada a planos clave y lectura tecnica." } else { "6. Slide de estrategia espacial sin entrar en detalle tecnico excesivo." }),
      "7. Experiencia del usuario y recorrido.",
      "8. Materialidad, luz y caracter.",
      "9. Diferenciadores comerciales.",
      "10. Cierre con resumen ejecutivo y llamado a decision.",
      "",
      "Instrucciones de desarrollo:",
      "Redacta titulos cortos, subtitulos ejecutivos y bullets de alto valor.",
      "Mantiene una voz premium, arquitectonica y convincente.",
      "Sugiere donde conviene usar renders, diagramas, planos y datos clave.",
      "Devuelve un outline slide por slide con objetivo, contenido, visual sugerida y mensaje clave."
    )
  } else {
    $lines = @(
      "Build a premium architectural PDF presentation with a clear, commercial, and elegant narrative.",
      "",
      ("Project context: {0}" -f $projectContext),
      ("Typology: {0}" -f $typology),
      ("Location: {0}" -f $location),
      ("Architectural program: {0}" -f $program),
      ("Commercial tone: {0}" -f $tone),
      ("Plans required: {0}" -f $needsPlans),
      ("Target number of slides: {0}" -f $slideCount),
      ("Primary objective: {0}" -f $goal),
      ("Available base files: {0}" -f $documents),
      "",
      "Suggested structure:",
      "1. Cover with concept and project promise.",
      "2. Opportunity, context, and value narrative.",
      "3. Site reading and location advantages.",
      "4. Typology and architectural program.",
      "5. Core design concept and atmosphere.",
      $(if ($needsPlans -eq "yes") { "6. Dedicated slide for key plans and technical reading." } else { "6. Spatial strategy slide without excessive technical depth." }),
      "7. User journey and experience sequence.",
      "8. Materiality, light, and sensory character.",
      "9. Commercial differentiators and selling points.",
      "10. Closing summary with a decision-oriented takeaway.",
      "",
      "Development instructions:",
      "Write concise titles, executive subtitles, and high-signal bullet points.",
      "Keep the tone premium, architectural, and persuasive.",
      "Suggest where renders, diagrams, plans, and supporting data should appear.",
      "Return a slide-by-slide outline with objective, content, recommended visual, and key message."
    )
  }

  return ($lines -join "`n")
}

function Escape-PdfString {
  param(
    [AllowEmptyString()][string]$Text = ""
  )

  return $Text.Replace('\\', '\\\\').Replace('(', '\\(').Replace(')', '\\)')
}

function Wrap-Text {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [int]$Width = 88
  )

  if ([string]::IsNullOrWhiteSpace($Text)) {
    return @("")
  }

  $normalized = ($Text -replace "`r", "") -split "`n"
  $lines = @()

  foreach ($sourceLine in $normalized) {
    $trimmed = $sourceLine.Trim()
    if ([string]::IsNullOrEmpty($trimmed)) {
      $lines += ""
      continue
    }

    $words = $trimmed -split "\s+"
    $current = ""
    foreach ($word in $words) {
      if ($current.Length -eq 0) {
        $current = $word
        continue
      }

      if (($current.Length + 1 + $word.Length) -le $Width) {
        $current = "$current $word"
      } else {
        $lines += $current
        $current = $word
      }
    }

    if ($current.Length -gt 0) {
      $lines += $current
    }
  }

  return $lines
}

function New-PdfBytes {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$Body
  )

  $wrappedLines = Wrap-Text -Text $Body -Width 88
  $lines = @($Title, "") + @($wrappedLines)
  $linesPerPage = 42
  $chunks = @()

  for ($index = 0; $index -lt $lines.Count; $index += $linesPerPage) {
    $take = [Math]::Min($linesPerPage, $lines.Count - $index)
    $chunks += ,($lines[$index..($index + $take - 1)])
  }

  if (-not $chunks.Count) {
    $chunks = ,@($Title)
  }

  $kids = @()
  for ($i = 0; $i -lt $chunks.Count; $i++) {
    $kids += ("{0} 0 R" -f (4 + ($i * 2)))
  }

  $objects = New-Object System.Collections.Generic.List[string]
  $objects.Add('<< /Type /Catalog /Pages 2 0 R >>')
  $objects.Add(('<< /Type /Pages /Count {0} /Kids [{1}] >>' -f $chunks.Count, ($kids -join ' ')))
  $objects.Add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')

  for ($pageIndex = 0; $pageIndex -lt $chunks.Count; $pageIndex++) {
    $pageObjectId = 4 + ($pageIndex * 2)
    $contentObjectId = $pageObjectId + 1
    $objects.Add(('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents {0} 0 R >>' -f $contentObjectId))

    $contentLines = @(
      'BT'
      '/F1 11 Tf'
      '14 TL'
      '50 748 Td'
    )

    foreach ($line in $chunks[$pageIndex]) {
      $contentLines += ('({0}) Tj' -f (Escape-PdfString -Text $line))
      $contentLines += 'T*'
    }

    $contentLines += 'ET'
    $stream = $contentLines -join "`n"
    $streamBytes = $script:PdfEncoding.GetBytes($stream)
    $streamText = $script:PdfEncoding.GetString($streamBytes)
    $objects.Add(('<< /Length {0} >>`nstream`n{1}`nendstream' -f $streamBytes.Length, $streamText))
  }

  $builder = New-Object System.Text.StringBuilder
  [void]$builder.Append("%PDF-1.4`n")
  [void]$builder.Append("%PDFDATA`n")
  $offsets = New-Object System.Collections.Generic.List[int]

  for ($i = 0; $i -lt $objects.Count; $i++) {
    $offsets.Add($script:PdfEncoding.GetByteCount($builder.ToString()))
    [void]$builder.Append(("{0} 0 obj`n" -f ($i + 1)))
    [void]$builder.Append($objects[$i])
    [void]$builder.Append("`nendobj`n")
  }

  $xrefPosition = $script:PdfEncoding.GetByteCount($builder.ToString())
  [void]$builder.Append("xref`n")
  [void]$builder.Append(("0 {0}`n" -f ($objects.Count + 1)))
  [void]$builder.Append("0000000000 65535 f `n")

  foreach ($offset in $offsets) {
    [void]$builder.Append(("{0:0000000000} 00000 n `n" -f $offset))
  }

  [void]$builder.Append("trailer`n")
  [void]$builder.Append(("<< /Size {0} /Root 1 0 R >>`n" -f ($objects.Count + 1)))
  [void]$builder.Append("startxref`n")
  [void]$builder.Append(("{0}`n" -f $xrefPosition))
  [void]$builder.Append("%%EOF")

  return $script:PdfEncoding.GetBytes($builder.ToString())
}

function Write-PdfResponse {
  param(
    [Parameter(Mandatory = $true)]$Response,
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$Content,
    [Parameter(Mandatory = $true)][string]$FileName
  )

  $bytes = New-PdfBytes -Title $Title -Body $Content
  $safeName = if ([string]::IsNullOrWhiteSpace($FileName)) { "renderaizando-output.pdf" } else { $FileName }
  $Response.StatusCode = 200
  $Response.ContentType = "application/pdf"
  $Response.Headers["Content-Disposition"] = ('attachment; filename="{0}"' -f $safeName)
  $Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Handle-ApiRequest {
  param(
    [Parameter(Mandatory = $true)]$Context
  )

  $request = $Context.Request
  $response = $Context.Response
  $path = $request.Url.AbsolutePath
  $method = $request.HttpMethod.ToUpperInvariant()

  if ($method -eq "GET" -and $path -eq "/api/health") {
    Write-JsonResponse -Response $response -Payload @{
      status = "ok"
      app = "RenderAIzando"
      mode = "local-backend"
      root = $resolvedRoot
      timestamp = (Get-Date).ToString("o")
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-render-prompt") {
    $payload = Get-RequestJson -Request $request
    $prompt = New-RenderPromptFromPayload -Payload $payload
    Write-JsonResponse -Response $response -Payload @{
      ok = $true
      mode = "render"
      prompt = $prompt
      generatedAt = (Get-Date).ToString("o")
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-presentation-outline") {
    $payload = Get-RequestJson -Request $request
    $outline = New-PresentationOutlineFromPayload -Payload $payload
    Write-JsonResponse -Response $response -Payload @{
      ok = $true
      mode = "presentation"
      outline = $outline
      generatedAt = (Get-Date).ToString("o")
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/export-pdf") {
    $payload = Get-RequestJson -Request $request
    $mode = [string](Get-PropValue -Object $payload -Name "mode" -Default "render")
    $titleDefault = if ($mode -eq "presentation") { "RenderAIzando Presentation Outline" } else { "RenderAIzando Render Prompt" }
    $fileDefault = if ($mode -eq "presentation") { "renderaizando-presentation.pdf" } else { "renderaizando-render-prompt.pdf" }
    $title = [string](Get-PropValue -Object $payload -Name "title" -Default $titleDefault)
    $content = [string](Get-PropValue -Object $payload -Name "content" -Default "")
    $fileName = [string](Get-PropValue -Object $payload -Name "fileName" -Default $fileDefault)
    Write-PdfResponse -Response $response -Title $title -Content $content -FileName $fileName
    return $true
  }

  return $false
}

try {
  $listener.Start()
  Write-Host "RenderAIzando server running at http://127.0.0.1:$Port/"
  Write-Host "Serving from $resolvedRoot"

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    try {
      if (Handle-ApiRequest -Context $context) {
        continue
      }

      $requestPath = $context.Request.Url.AbsolutePath
      $relativePath = $requestPath.TrimStart("/")
      if ([string]::IsNullOrWhiteSpace($relativePath)) {
        $relativePath = "index.html"
      }

      $candidatePath = [System.IO.Path]::GetFullPath((Join-Path $resolvedRoot $relativePath))
      if (-not $candidatePath.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        Write-JsonResponse -Response $context.Response -Payload @{
          status = "error"
          message = "Path traversal is not allowed."
        } -StatusCode 403
        continue
      }

      $fullPath = $candidatePath
      if (-not (Test-Path -LiteralPath $fullPath -PathType Leaf)) {
        $fullPath = Join-Path $resolvedRoot "index.html"
      }

      $bytes = [System.IO.File]::ReadAllBytes($fullPath)
      $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
      $contentType = switch ($extension) {
        ".html" { "text/html; charset=utf-8" }
        ".css" { "text/css; charset=utf-8" }
        ".js" { "application/javascript; charset=utf-8" }
        ".json" { "application/json; charset=utf-8" }
        ".png" { "image/png" }
        ".jpg" { "image/jpeg" }
        ".jpeg" { "image/jpeg" }
        ".svg" { "image/svg+xml" }
        ".webp" { "image/webp" }
        ".ico" { "image/x-icon" }
        ".txt" { "text/plain; charset=utf-8" }
        default { "application/octet-stream" }
      }

      $context.Response.StatusCode = 200
      $context.Response.ContentType = $contentType
      $context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
      $message = [System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
      $context.Response.StatusCode = 500
      $context.Response.ContentType = "text/plain; charset=utf-8"
      $context.Response.OutputStream.Write($message, 0, $message.Length)
    } finally {
      $context.Response.OutputStream.Close()
    }
  }
} finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
