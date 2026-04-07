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

  $json = $Payload | ConvertTo-Json -Depth 20
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
    $Default = $null
  )

  if ($null -eq $Object) { return $Default }
  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) { return $Default }
  $value = $property.Value
  if ($null -eq $value) { return $Default }
  return $value
}

function Get-OpenAiHeaders {
  if ([string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)) {
    throw "OPENAI_API_KEY is not configured."
  }

  return @{
    Authorization = "Bearer $($env:OPENAI_API_KEY)"
    "Content-Type" = "application/json"
  }
}

function Invoke-OpenAiRenderEdit {
  param(
    [Parameter(Mandatory = $true)][string]$Prompt,
    [Parameter(Mandatory = $true)]$Images,
    [string]$Size = "1536x1024"
  )

  $usableImages = @($Images | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 5)
  if (-not $usableImages.Count) {
    throw "No images were provided for render generation."
  }

  $content = New-Object System.Collections.ArrayList
  [void]$content.Add(@{ type = "input_text"; text = $Prompt })
  foreach ($image in $usableImages) {
    [void]$content.Add(@{ type = "input_image"; image_url = [string]$image })
  }

  $bodyObject = @{
    model = "gpt-5"
    input = @(
      @{
        role = "user"
        content = @($content)
      }
    )
    tools = @(
      @{
        type = "image_generation"
        input_fidelity = "high"
        action = "edit"
        size = $Size
        quality = "high"
      }
    )
    tool_choice = @{ type = "image_generation" }
  }

  $body = $bodyObject | ConvertTo-Json -Depth 30
  $response = Invoke-RestMethod -Method Post -Uri "https://api.openai.com/v1/responses" -Headers (Get-OpenAiHeaders) -Body $body -TimeoutSec 240
  $imageCall = @($response.output) | Where-Object { $_.type -eq "image_generation_call" } | Select-Object -First 1
  $result = Get-PropValue -Object $imageCall -Name "result" -Default ""
  if ([string]::IsNullOrWhiteSpace($result)) {
    throw "OpenAI did not return an image payload."
  }

  return @{
    imageBase64 = $result
    revisedPrompt = [string](Get-PropValue -Object $imageCall -Name "revised_prompt" -Default "")
  }
}

function Escape-PdfString {
  param([AllowEmptyString()][string]$Text = "")
  return $Text.Replace('\\', '\\\\').Replace('(', '\(').Replace(')', '\)')
}

function Wrap-Text {
  param(
    [Parameter(Mandatory = $true)][string]$Text,
    [int]$Width = 84
  )

  if ([string]::IsNullOrWhiteSpace($Text)) { return @("") }

  $sourceLines = ($Text -replace "`r", "") -split "`n"
  $result = @()

  foreach ($line in $sourceLines) {
    $trimmed = $line.Trim()
    if ([string]::IsNullOrWhiteSpace($trimmed)) {
      $result += ""
      continue
    }

    $words = $trimmed -split "\s+"
    $current = ""
    foreach ($word in $words) {
      if ([string]::IsNullOrWhiteSpace($current)) {
        $current = $word
        continue
      }
      if (($current.Length + 1 + $word.Length) -le $Width) {
        $current = "$current $word"
      } else {
        $result += $current
        $current = $word
      }
    }
    if (-not [string]::IsNullOrWhiteSpace($current)) {
      $result += $current
    }
  }

  return $result
}

function Convert-SlidesToLines {
  param(
    [string]$Title,
    [string]$Summary,
    $Slides
  )

  $lines = @($Title, "")
  if (-not [string]::IsNullOrWhiteSpace($Summary)) {
    $lines += (Wrap-Text -Text $Summary)
    $lines += ""
  }

  $slideIndex = 1
  foreach ($slide in @($Slides)) {
    $slideTitle = [string](Get-PropValue -Object $slide -Name "title" -Default "Slide $slideIndex")
    $slideSubtitle = [string](Get-PropValue -Object $slide -Name "subtitle" -Default "")
    $lines += "Slide $slideIndex - $slideTitle"
    if (-not [string]::IsNullOrWhiteSpace($slideSubtitle)) {
      $lines += (Wrap-Text -Text $slideSubtitle)
    }
    foreach ($bullet in @((Get-PropValue -Object $slide -Name "bullets" -Default @()))) {
      $lines += (Wrap-Text -Text ("- " + [string]$bullet))
    }
    $lines += ""
    $slideIndex += 1
  }

  if (-not $Slides -or @($Slides).Count -eq 0) {
    $lines += "No slide data was provided."
  }

  return $lines
}

function New-PdfBytes {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [Parameter(Mandatory = $true)][string]$Summary,
    [Parameter(Mandatory = $true)]$Slides
  )

  $lines = Convert-SlidesToLines -Title $Title -Summary $Summary -Slides $Slides
  $linesPerPage = 40
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
      '48 748 Td'
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
    [Parameter(Mandatory = $true)][string]$Summary,
    [Parameter(Mandatory = $true)]$Slides,
    [Parameter(Mandatory = $true)][string]$FileName
  )

  $bytes = New-PdfBytes -Title $Title -Summary $Summary -Slides $Slides
  $Response.StatusCode = 200
  $Response.ContentType = "application/pdf"
  $Response.Headers["Content-Disposition"] = ('attachment; filename="{0}"' -f $FileName)
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
      app = "RenderAI Studio"
      aiReady = -not [string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)
      root = $resolvedRoot
      timestamp = (Get-Date).ToString("o")
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-render-image") {
    $payload = Get-RequestJson -Request $request
    if ([string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "OPENAI_API_KEY is not configured."
      }
      return $true
    }

    try {
      $result = Invoke-OpenAiRenderEdit -Prompt ([string](Get-PropValue -Object $payload -Name "prompt" -Default "Architectural image edit")) -Images (Get-PropValue -Object $payload -Name "images" -Default @()) -Size ([string](Get-PropValue -Object $payload -Name "size" -Default "1536x1024"))
      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        imageBase64 = $result.imageBase64
        revisedPrompt = $result.revisedPrompt
      }
    } catch {
      Write-JsonResponse -Response $response -StatusCode 500 -Payload @{
        ok = $false
        message = $_.Exception.Message
      }
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/export-pdf") {
    $payload = Get-RequestJson -Request $request
    $title = [string](Get-PropValue -Object $payload -Name "title" -Default "RenderAI Export")
    $summary = [string](Get-PropValue -Object $payload -Name "summary" -Default "")
    $fileName = [string](Get-PropValue -Object $payload -Name "fileName" -Default "renderai-export.pdf")
    $slides = Get-PropValue -Object $payload -Name "slides" -Default @()
    Write-PdfResponse -Response $response -Title $title -Summary $summary -Slides $slides -FileName $fileName
    return $true
  }

  return $false
}

try {
  $listener.Start()
  Write-Host "RenderAI Studio server running at http://127.0.0.1:$Port/"
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
        Write-JsonResponse -Response $context.Response -StatusCode 403 -Payload @{ status = "error"; message = "Path traversal is not allowed." }
        continue
      }

      $fullPath = if (Test-Path -LiteralPath $candidatePath -PathType Leaf) { $candidatePath } else { Join-Path $resolvedRoot "index.html" }
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
  if ($listener.IsListening) { $listener.Stop() }
  $listener.Close()
}
