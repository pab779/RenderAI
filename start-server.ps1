param(
  [int]$Port = 8080
)

try {
  Add-Type -AssemblyName System.Security -ErrorAction Stop
} catch {
  # Linux/container deployments use environment variables and do not require DPAPI.
}

$root = (Get-Location).Path
$resolvedRoot = [System.IO.Path]::GetFullPath($root)
$script:BoundPort = $Port
$script:PdfEncoding = [System.Text.Encoding]::GetEncoding(1252)
$secureStoreBase = if (-not [string]::IsNullOrWhiteSpace($env:APPDATA)) {
  $env:APPDATA
} elseif (-not [string]::IsNullOrWhiteSpace($env:USERPROFILE)) {
  $env:USERPROFILE
} elseif (-not [string]::IsNullOrWhiteSpace($env:HOME)) {
  $env:HOME
} else {
  $root
}
$script:SecureStoreRoot = Join-Path $secureStoreBase "RenderAIStudio"
$script:SecureOpenAiApiKeyPath = Join-Path $script:SecureStoreRoot "openai_api_key.secure.txt"
$script:SecureGeminiApiKeyPath = Join-Path $script:SecureStoreRoot "gemini_api_key.secure.txt"
$script:CachedOpenAiApiKey = $null
$script:CachedGeminiApiKey = $null
$script:OpenAiSecureEntropy = [System.Text.Encoding]::UTF8.GetBytes("RenderAIStudio.OpenAIKey")
$script:GeminiSecureEntropy = [System.Text.Encoding]::UTF8.GetBytes("RenderAIStudio.GeminiKey")

function New-RenderAiListener {
  param(
    [Parameter(Mandatory = $true)][int]$TargetPort
  )

  $localListener = [System.Net.HttpListener]::new()
  $publicBind = ($env:RENDERAI_PUBLIC_BIND -eq "1" -or -not [string]::IsNullOrWhiteSpace($env:RENDER))
  if ($publicBind) {
    $localListener.Prefixes.Add("http://+:$TargetPort/")
  } else {
    $localListener.Prefixes.Add("http://127.0.0.1:$TargetPort/")
    $localListener.Prefixes.Add("http://localhost:$TargetPort/")
  }
  return $localListener
}

function Test-RenderAiPublicDeployment {
  return ($env:RENDERAI_PUBLIC_BIND -eq "1" -or -not [string]::IsNullOrWhiteSpace($env:RENDER))
}

function Apply-CorsHeaders {
  param(
    [Parameter(Mandatory = $true)]$Response
  )

  $Response.Headers["Access-Control-Allow-Origin"] = "*"
  $Response.Headers["Access-Control-Allow-Headers"] = "Content-Type"
  $Response.Headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
}

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
  Apply-CorsHeaders -Response $Response
  $Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Get-RequestJson {
  param(
    [Parameter(Mandatory = $true)]$Request
  )

  # HttpListener may report a legacy Windows code page when the browser sends
  # application/json without an explicit charset. Force UTF-8 so Spanish accents
  # and project names survive analysis, PDF and PPTX export.
  $reader = [System.IO.StreamReader]::new($Request.InputStream, [System.Text.Encoding]::UTF8)
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

function Convert-SecureStringToPlainText {
  param(
    [Parameter(Mandatory = $true)]
    [System.Security.SecureString]$SecureValue
  )

  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureValue)
  try {
    return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  } finally {
    if ($bstr -ne [IntPtr]::Zero) {
      [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
  }
}

function Unprotect-RenderAiSecret {
  param(
    [Parameter(Mandatory = $true)]
    [string]$ProtectedValue,
    [Parameter(Mandatory = $true)]
    [byte[]]$Entropy
  )

  $cipherBytes = [Convert]::FromBase64String($ProtectedValue)
  $plainBytes = [System.Security.Cryptography.ProtectedData]::Unprotect($cipherBytes, $Entropy, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
  return [System.Text.Encoding]::UTF8.GetString($plainBytes)
}

function Get-ErrorStatusCode {
  param(
    [Parameter(Mandatory = $true)]$ErrorRecord,
    [int]$Default = 500
  )

  try {
    if ($ErrorRecord.Exception -and $ErrorRecord.Exception.Message -match '^(OPENAI_IMAGE_API_ERROR|GEMINI_IMAGE_API_ERROR)::(?<status>\d+)::') {
      return [int]$Matches.status
    }

    $response = $ErrorRecord.Exception.Response
    if ($null -eq $response) { return $Default }
    if ($response.StatusCode) {
      return [int]$response.StatusCode.value__
    }
  } catch {
    return $Default
  }

  return $Default
}

function Get-RenderAiUsers {
  $publicDeployment = Test-RenderAiPublicDeployment
  $adminUser = if ([string]::IsNullOrWhiteSpace($env:RENDERAI_ADMIN_USER)) { "admin" } else { $env:RENDERAI_ADMIN_USER }
  $adminPassword = if ([string]::IsNullOrWhiteSpace($env:RENDERAI_ADMIN_PASSWORD)) { if ($publicDeployment) { "" } else { "123" } } else { $env:RENDERAI_ADMIN_PASSWORD }
  $architectUser = if ([string]::IsNullOrWhiteSpace($env:RENDERAI_ARCHITECT_USER)) { "arquitecto" } else { $env:RENDERAI_ARCHITECT_USER }
  $architectPassword = if ([string]::IsNullOrWhiteSpace($env:RENDERAI_ARCHITECT_PASSWORD)) { if ($publicDeployment) { "" } else { "123" } } else { $env:RENDERAI_ARCHITECT_PASSWORD }

  $users = @()
  if (-not [string]::IsNullOrWhiteSpace($adminUser) -and -not [string]::IsNullOrWhiteSpace($adminPassword)) {
    $users += @{
      username = $adminUser
      password = $adminPassword
      role = "admin"
      name = "Administrador"
    }
  }
  if (-not [string]::IsNullOrWhiteSpace($architectUser) -and -not [string]::IsNullOrWhiteSpace($architectPassword)) {
    $users += @{
      username = $architectUser
      password = $architectPassword
      role = "user"
      name = "Arquitecto"
    }
  }

  return $users
}

function Get-ErrorDetailText {
  param(
    [Parameter(Mandatory = $true)]$ErrorRecord
  )

  if ($ErrorRecord.Exception -and $ErrorRecord.Exception.Message -match '^(OPENAI_IMAGE_API_ERROR|GEMINI_IMAGE_API_ERROR)::(?<status>\d+)::(?<body>[\s\S]+)$') {
    return [string]$Matches.body
  }

  if ($ErrorRecord.ErrorDetails -and -not [string]::IsNullOrWhiteSpace($ErrorRecord.ErrorDetails.Message)) {
    return [string]$ErrorRecord.ErrorDetails.Message
  }

  try {
    $response = $ErrorRecord.Exception.Response
    if ($null -ne $response) {
      $stream = $response.GetResponseStream()
      if ($null -ne $stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        try {
          $text = $reader.ReadToEnd()
          if (-not [string]::IsNullOrWhiteSpace($text)) {
            return $text
          }
        } finally {
          $reader.Dispose()
        }
      }
    }
  } catch {
    # Ignore and fall back to the exception message.
  }

  return [string]$ErrorRecord.Exception.Message
}

function Get-StoredOpenAiApiKey {
  if (-not [string]::IsNullOrWhiteSpace($script:CachedOpenAiApiKey)) {
    return $script:CachedOpenAiApiKey
  }

  if (-not [string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)) {
    $script:CachedOpenAiApiKey = $env:OPENAI_API_KEY
    return $script:CachedOpenAiApiKey
  }

  if (-not (Test-Path -LiteralPath $script:SecureOpenAiApiKeyPath -PathType Leaf)) {
    return $null
  }

  try {
    $protectedValue = Get-Content -LiteralPath $script:SecureOpenAiApiKeyPath -Raw -ErrorAction Stop
    if ([string]::IsNullOrWhiteSpace($protectedValue)) {
      return $null
    }

    $plainText = Unprotect-RenderAiSecret -ProtectedValue $protectedValue.Trim() -Entropy $script:OpenAiSecureEntropy
    if ([string]::IsNullOrWhiteSpace($plainText)) {
      return $null
    }

    $script:CachedOpenAiApiKey = $plainText
    return $script:CachedOpenAiApiKey
  } catch {
    return $null
  }
}

function Get-StoredGeminiApiKey {
  if (-not [string]::IsNullOrWhiteSpace($script:CachedGeminiApiKey)) {
    return $script:CachedGeminiApiKey
  }

  if (-not [string]::IsNullOrWhiteSpace($env:GEMINI_API_KEY)) {
    $script:CachedGeminiApiKey = $env:GEMINI_API_KEY
    return $script:CachedGeminiApiKey
  }

  if (-not (Test-Path -LiteralPath $script:SecureGeminiApiKeyPath -PathType Leaf)) {
    return $null
  }

  try {
    $protectedValue = Get-Content -LiteralPath $script:SecureGeminiApiKeyPath -Raw -ErrorAction Stop
    if ([string]::IsNullOrWhiteSpace($protectedValue)) {
      return $null
    }

    $plainText = Unprotect-RenderAiSecret -ProtectedValue $protectedValue.Trim() -Entropy $script:GeminiSecureEntropy
    if ([string]::IsNullOrWhiteSpace($plainText)) {
      return $null
    }

    $script:CachedGeminiApiKey = $plainText
    return $script:CachedGeminiApiKey
  } catch {
    return $null
  }
}

function Get-ProviderSecretSource {
  param(
    [Parameter(Mandatory = $true)][ValidateSet("openai", "gemini")]$Provider,
    [string]$ApiKey = ""
  )

  if ([string]::IsNullOrWhiteSpace($ApiKey)) {
    return "none"
  }

  if ($Provider -eq "openai" -and -not [string]::IsNullOrWhiteSpace($env:OPENAI_API_KEY)) {
    return "env"
  }

  if ($Provider -eq "gemini" -and -not [string]::IsNullOrWhiteSpace($env:GEMINI_API_KEY)) {
    return "env"
  }

  return "dpapi-file"
}

function Join-NonEmptyStrings {
  param(
    $Values,
    [string]$Separator = " "
  )

  if ($null -eq $Values) {
    return ""
  }

  $items = @(
    $Values |
      ForEach-Object {
        if ($null -eq $_) { return "" }
        return [string]$_
      } |
      Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
  )

  if (-not $items.Count) {
    return ""
  }

  return ($items -join $Separator)
}

function Get-OpenAiHeaders {
  $apiKey = Get-StoredOpenAiApiKey
  if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "OPENAI_API_KEY is not configured."
  }

  return @{
    Authorization = "Bearer $apiKey"
  }
}

function Convert-DataUrlToImagePart {
  param(
    [Parameter(Mandatory = $true)][string]$DataUrl,
    [int]$Index = 0
  )

  $commaIndex = $DataUrl.IndexOf(',')
  if ($commaIndex -lt 0) {
    throw "Image input $Index is not a valid base64 data URL."
  }

  $header = $DataUrl.Substring(5, $commaIndex - 5)
  if ($header -notmatch '^(?<mime>[^;]+);base64$') {
    throw "Image input $Index is not a valid base64 data URL."
  }

  $mimeType = $Matches.mime
  $base64Payload = $DataUrl.Substring($commaIndex + 1)
  $bytes = [Convert]::FromBase64String($base64Payload)
  $extension = switch -Regex ($mimeType) {
    'png' { 'png'; break }
    'jpeg|jpg' { 'jpg'; break }
    'webp' { 'webp'; break }
    default { 'png' }
  }

  return [pscustomobject]@{
    Bytes = $bytes
    MimeType = $mimeType
    FileName = "input-$Index.$extension"
  }
}

function Get-GeminiImageAspectRatio {
  param(
    [string]$Size = "1536x1024"
  )

  if ($Size -match '^(?<width>\d+)x(?<height>\d+)$') {
    $width = [double]$Matches.width
    $height = [double]$Matches.height
    if ($width -le 0 -or $height -le 0) { return "3:2" }
    $ratio = $width / $height
    $targets = @(
      @{ Value = "1:1"; Ratio = 1.0 }
      @{ Value = "3:4"; Ratio = 0.75 }
      @{ Value = "4:3"; Ratio = 1.3333333333 }
      @{ Value = "3:2"; Ratio = 1.5 }
      @{ Value = "16:9"; Ratio = 1.7777777778 }
      @{ Value = "9:16"; Ratio = 0.5625 }
    )
    return ($targets | Sort-Object { [Math]::Abs($_.Ratio - $ratio) } | Select-Object -First 1).Value
  }
  return "3:2"
}

function Get-GeminiImageSizeTier {
  param(
    [string]$Size = "1536x1024",
    [string]$Quality = "medium"
  )

  $maxDimension = 1536
  if ($Size -match '^(?<width>\d+)x(?<height>\d+)$') {
    $maxDimension = [Math]::Max([int]$Matches.width, [int]$Matches.height)
  }

  if ($Quality -eq "high" -or $maxDimension -ge 1500) { return "2K" }
  if ($Quality -eq "medium") { return "1K" }
  return "1K"
}

function Invoke-GeminiImageGenerate {
  param(
    [Parameter(Mandatory = $true)][string]$Prompt,
    [Parameter(Mandatory = $true)]$Images,
    [string]$Model = "gemini-3.1-flash-image-preview",
    [string]$Size = "1536x1024",
    [string]$Quality = "medium"
  )

  $apiKey = Get-StoredGeminiApiKey
  if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "GEMINI_API_KEY is not configured."
  }

  $usableImages = @($Images | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 3)
  if (-not $usableImages.Count) {
    throw "No images were provided for Gemini image generation."
  }

  $parts = @(@{ text = $Prompt })
  for ($index = 0; $index -lt $usableImages.Count; $index += 1) {
    $imagePart = Convert-DataUrlToImagePart -DataUrl ([string]$usableImages[$index]) -Index $index
    $parts += @{
      inlineData = @{
        mimeType = $imagePart.MimeType
        data = [Convert]::ToBase64String($imagePart.Bytes)
      }
    }
  }

  $bodyObject = @{
    contents = @(
      @{
        role = "user"
        parts = $parts
      }
    )
    generationConfig = @{
      responseModalities = @("IMAGE")
      imageConfig = @{
        aspectRatio = Get-GeminiImageAspectRatio -Size $Size
        imageSize = Get-GeminiImageSizeTier -Size $Size -Quality $Quality
      }
    }
  }

  $body = $bodyObject | ConvertTo-Json -Depth 30
  $uri = "https://generativelanguage.googleapis.com/v1beta/models/$Model`:generateContent?key=$apiKey"
  $timeoutSec = 420
  if ($env:RENDERAI_GEMINI_TIMEOUT_SEC -match '^\d+$') {
    $timeoutSec = [Math]::Max(60, [Math]::Min(900, [int]$env:RENDERAI_GEMINI_TIMEOUT_SEC))
  }
  $response = Invoke-RestMethod -Method Post -Uri $uri -ContentType "application/json" -Body $body -TimeoutSec $timeoutSec
  $candidates = @($response.candidates)
  if (-not $candidates.Count) {
    throw "Gemini did not return candidates."
  }

  foreach ($candidate in $candidates) {
    $candidateContent = Get-PropValue -Object $candidate -Name "content" -Default $null
    $parts = @(Get-PropValue -Object $candidateContent -Name "parts" -Default @())
    $imagePart = $parts | Where-Object {
      $inlineData = Get-PropValue -Object $_ -Name "inlineData" -Default $null
      -not [string]::IsNullOrWhiteSpace([string](Get-PropValue -Object $inlineData -Name "data" -Default ""))
    } | Select-Object -First 1
    if ($null -eq $imagePart) { continue }

    $inlineData = Get-PropValue -Object $imagePart -Name "inlineData" -Default $null
    $data = [string](Get-PropValue -Object $inlineData -Name "data" -Default "")
    if ([string]::IsNullOrWhiteSpace($data)) { continue }

    $mimeType = [string](Get-PropValue -Object $inlineData -Name "mimeType" -Default "image/png")
    $textParts = @(
      $parts |
        ForEach-Object { [string](Get-PropValue -Object $_ -Name "text" -Default "") } |
        Where-Object { -not [string]::IsNullOrWhiteSpace($_) }
    )
    return @{
      imageBase64 = $data
      mimeType = $mimeType
      revisedPrompt = Join-NonEmptyStrings -Values $textParts -Separator " "
    }
  }

  throw "Gemini did not return an image payload."
}

function Invoke-OpenAiImageEditApi {
  param(
    [Parameter(Mandatory = $true)][string]$Prompt,
    [Parameter(Mandatory = $true)]$Images,
    [string]$Model = "gpt-image-1.5",
    [string]$Size = "1536x1024",
    [string]$Quality = "medium",
    [string]$InputFidelity = "low",
    [string]$OutputFormat = "jpeg",
    [int]$OutputCompression = 92
  )

  $usableImages = @($Images | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -First 1)
  if (-not $usableImages.Count) {
    throw "No images were provided for render generation."
  }

  $apiKey = Get-StoredOpenAiApiKey
  if ([string]::IsNullOrWhiteSpace($apiKey)) {
    throw "OPENAI_API_KEY is not configured."
  }

  try {
    $boundary = "----RenderAIBoundary" + ([Guid]::NewGuid().ToString("N"))
    $lineBreakBytes = [System.Text.Encoding]::ASCII.GetBytes("`r`n")
    $stream = New-Object System.IO.MemoryStream

    function Write-MultipartString {
      param(
        [Parameter(Mandatory = $true)][System.IO.MemoryStream]$TargetStream,
        [Parameter(Mandatory = $true)][string]$Value
      )

      $bytes = [System.Text.Encoding]::UTF8.GetBytes($Value)
      $TargetStream.Write($bytes, 0, $bytes.Length)
    }

    function Add-MultipartTextField {
      param(
        [Parameter(Mandatory = $true)][System.IO.MemoryStream]$TargetStream,
        [Parameter(Mandatory = $true)][string]$Boundary,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Value
      )

      Write-MultipartString -TargetStream $TargetStream -Value ("--{0}`r`n" -f $Boundary)
      Write-MultipartString -TargetStream $TargetStream -Value ("Content-Disposition: form-data; name=""{0}""`r`n`r`n" -f $Name)
      Write-MultipartString -TargetStream $TargetStream -Value $Value
      $TargetStream.Write($lineBreakBytes, 0, $lineBreakBytes.Length)
    }

    function Add-MultipartFileField {
      param(
        [Parameter(Mandatory = $true)][System.IO.MemoryStream]$TargetStream,
        [Parameter(Mandatory = $true)][string]$Boundary,
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$FileName,
        [Parameter(Mandatory = $true)][string]$MimeType,
        [Parameter(Mandatory = $true)][byte[]]$Bytes
      )

      Write-MultipartString -TargetStream $TargetStream -Value ("--{0}`r`n" -f $Boundary)
      Write-MultipartString -TargetStream $TargetStream -Value ("Content-Disposition: form-data; name=""{0}""; filename=""{1}""`r`n" -f $Name, $FileName)
      Write-MultipartString -TargetStream $TargetStream -Value ("Content-Type: {0}`r`n`r`n" -f $MimeType)
      $TargetStream.Write($Bytes, 0, $Bytes.Length)
      $TargetStream.Write($lineBreakBytes, 0, $lineBreakBytes.Length)
    }

    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "model" -Value $Model
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "prompt" -Value $Prompt
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "size" -Value $Size
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "quality" -Value $Quality
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "input_fidelity" -Value $InputFidelity
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "output_format" -Value $OutputFormat
    Add-MultipartTextField -TargetStream $stream -Boundary $boundary -Name "output_compression" -Value ([string]$OutputCompression)

    $imageIndex = 0
    foreach ($image in $usableImages) {
      $part = Convert-DataUrlToImagePart -DataUrl ([string]$image) -Index $imageIndex
      Add-MultipartFileField -TargetStream $stream -Boundary $boundary -Name "image[]" -FileName $part.FileName -MimeType $part.MimeType -Bytes $part.Bytes
      $imageIndex += 1
    }

    Write-MultipartString -TargetStream $stream -Value ("--{0}--`r`n" -f $boundary)
    $bodyBytes = $stream.ToArray()
    $timeoutSec = 420
    if ($env:RENDERAI_OPENAI_IMAGE_TIMEOUT_SEC -match '^\d+$') {
      $timeoutSec = [Math]::Max(60, [Math]::Min(900, [int]$env:RENDERAI_OPENAI_IMAGE_TIMEOUT_SEC))
    }
    $response = Invoke-WebRequest -Method Post -Uri "https://api.openai.com/v1/images/edits" -Headers @{ Authorization = "Bearer $apiKey" } -ContentType ("multipart/form-data; boundary={0}" -f $boundary) -Body $bodyBytes -TimeoutSec $timeoutSec -UseBasicParsing
    return $response.Content | ConvertFrom-Json
  } finally {
    if ($null -ne $stream) {
      $stream.Dispose()
    }
  }
}

function Invoke-OpenAiRenderEdit {
  param(
    [Parameter(Mandatory = $true)][string]$Prompt,
    [Parameter(Mandatory = $true)]$Images,
    [string]$Size = "1536x1024",
    [string]$Quality = "medium",
    [string]$InputFidelity = "low",
    [string]$OutputFormat = "jpeg",
    [int]$OutputCompression = 92
  )

  $response = Invoke-OpenAiImageEditApi -Prompt $Prompt -Images $Images -Size $Size -Quality $Quality -InputFidelity $InputFidelity -OutputFormat $OutputFormat -OutputCompression $OutputCompression
  $result = Get-PropValue -Object (@($response.data)[0]) -Name "b64_json" -Default ""
  if ([string]::IsNullOrWhiteSpace($result)) {
    throw "OpenAI did not return an image payload."
  }

  return @{
    imageBase64 = $result
    revisedPrompt = ""
  }
}

function Resolve-RenderRuntimeInfo {
  $geminiKey = Get-StoredGeminiApiKey
  $openAiKey = Get-StoredOpenAiApiKey
  $renderProvider = if (-not [string]::IsNullOrWhiteSpace($geminiKey)) { "gemini" } elseif (-not [string]::IsNullOrWhiteSpace($openAiKey)) { "openai" } else { "local" }
  return @{
    renderProvider = $renderProvider
    renderReady = $renderProvider -ne "local"
    analysisProvider = if (-not [string]::IsNullOrWhiteSpace($openAiKey)) { "openai" } else { "none" }
    analysisReady = -not [string]::IsNullOrWhiteSpace($openAiKey)
    openAiReady = -not [string]::IsNullOrWhiteSpace($openAiKey)
    geminiReady = -not [string]::IsNullOrWhiteSpace($geminiKey)
    renderSecretSource = if ($renderProvider -eq "gemini") { Get-ProviderSecretSource -Provider "gemini" -ApiKey $geminiKey } elseif ($renderProvider -eq "openai") { Get-ProviderSecretSource -Provider "openai" -ApiKey $openAiKey } else { "none" }
    analysisSecretSource = Get-ProviderSecretSource -Provider "openai" -ApiKey $openAiKey
  }
}

function Escape-PdfString {
  param([AllowEmptyString()][string]$Text = "")
  return $Text.Replace('\', '\\').Replace('(', '\(').Replace(')', '\)')
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

function Invoke-OpenAiJsonChatCompletion {
  param(
    [Parameter(Mandatory = $true)]$Messages,
    [string]$Model = "gpt-4.1-mini",
    [int]$MaxTokens = 900
  )

  $headers = Get-OpenAiHeaders
  $body = @{
    model = $Model
    temperature = 0.2
    max_tokens = $MaxTokens
    response_format = @{ type = "json_object" }
    messages = $Messages
  } | ConvertTo-Json -Depth 30

  try {
    Set-Content -Path (Join-Path $resolvedRoot "last-openai-body.json") -Value $body -Encoding UTF8
  } catch {
    # Ignore debug file errors.
  }

  $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  return Invoke-RestMethod -Method Post -Uri "https://api.openai.com/v1/chat/completions" -Headers $headers -ContentType "application/json; charset=utf-8" -Body $bodyBytes -TimeoutSec 240
}

function Invoke-OpenAiReferenceAnalysis {
  param(
    [Parameter(Mandatory = $true)][string]$ImageDataUrl,
    [string]$Flow = "render",
    [string]$Context = ""
  )

  $analysisSystemPrompt = @"
You are the OpenAI analysis layer inside RenderAI Studio.
Your job is NOT to generate images. Your job is to read architectural references with production-grade precision so Gemini can render faithfully later.

Return JSON only with this exact shape:
{
  "summary": "one precise sentence",
  "sceneType": "architectural scene type",
  "cameraNotes": "camera, crop, perspective, horizon and framing notes",
  "lightMood": "visible lighting condition",
  "materials": ["material + location + visual behavior"],
  "objects": ["object + location + count/scale when visible"],
  "texts": ["verbatim visible text/signage + location"],
  "environment": ["background/site/exterior/vegetation/sky notes"],
  "composition": ["geometry, axes, planes, foreground/midground/background"],
  "realismRisks": ["specific risk Gemini must avoid"]
}

Rules:
- Only describe what is visible or strongly inferable from the image.
- Text/signage must be verbatim. If uncertain, prefix with "uncertain:".
- Use architectural terms, locations and material behavior, not generic labels.
- Mention preservation risks: typography, glass, reflections, geometry drift, people, background invention, weak materials.
- Keep arrays concise but specific. Prefer "stone column left foreground" over "stone".
- Output must be valid JSON, no markdown.
"@

  $analysisUserPrompt = @"
Analyze this image for the $Flow workflow.
Context from user: $Context

Focus areas:
1. Geometry and camera lock.
2. Objects, furniture, micro-objects and signage.
3. Materials and PBR behavior.
4. Background/site/exterior and what must NOT be invented.
5. Visible text/signage verbatim.
6. Risks that would make a render look fake or off-brief.
"@

  $messages = @(
    @{
      role = "system"
      content = $analysisSystemPrompt
    },
    @{
      role = "user"
      content = @(
        @{
          type = "text"
          text = $analysisUserPrompt
        },
        @{
          type = "image_url"
          image_url = @{
            url = $ImageDataUrl
            detail = "high"
          }
        }
      )
    }
  )

  $response = Invoke-OpenAiJsonChatCompletion -Messages $messages -MaxTokens 1400
  $content = [string](Get-PropValue -Object (@($response.choices)[0].message) -Name "content" -Default "{}")
  return Normalize-ReferenceAnalysisResult -Analysis ($content | ConvertFrom-Json)
}

function Invoke-OpenAiPresentationOutline {
  param(
    [string]$Context = "",
    $Analysis,
    $Settings
  )

  $analysisObjects = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "objects" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisTexts = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "texts" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisEnvironment = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "environment" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisComposition = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "composition" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisRisks = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $Analysis -Name "realismRisks" -Default @()) | ForEach-Object { [string]$_ })))
  $analysisSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Analysis -Name "summary" -Default ""))
  $pageCount = [int](Get-PropValue -Object $Settings -Name "pageCount" -Default 8)
  $audience = [string](Get-PropValue -Object $Settings -Name "audience" -Default "client")
  $pdfTone = [string](Get-PropValue -Object $Settings -Name "pdfTone" -Default "commercial-premium")
  $narrative = [string](Get-PropValue -Object $Settings -Name "narrative" -Default "concept-first")
  $plans = [string](Get-PropValue -Object $Settings -Name "plans" -Default "selected")
  $visualDensity = [string](Get-PropValue -Object $Settings -Name "visualDensity" -Default "balanced")
  $coverStyle = [string](Get-PropValue -Object $Settings -Name "coverStyle" -Default "visual")
  $deckMode = [string](Get-PropValue -Object $Settings -Name "deckMode" -Default "client")
  $projectType = [string](Get-PropValue -Object $Settings -Name "projectType" -Default "business")
  $brochureLanguage = [string](Get-PropValue -Object $Settings -Name "brochureLanguage" -Default "es")
  $selectedPalette = @((Get-PropValue -Object $Settings -Name "selectedPalette" -Default @()) | ForEach-Object { [string]$_ })
  $selectedAmenities = @((Get-PropValue -Object $Settings -Name "selectedAmenities" -Default @()) | ForEach-Object { [string]$_ })
  $slideBlueprints = @((Get-PropValue -Object $Settings -Name "slideBlueprints" -Default @()))
  $renderedImageRefs = @((Get-PropValue -Object $Settings -Name "renderedImageRefs" -Default @()))
  $contextImageRefs = @((Get-PropValue -Object $Settings -Name "contextImageRefs" -Default @()))
  $brochureTemplateLabel = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "brochureTemplateLabel" -Default ""))
  $brochureTemplateCollection = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "brochureTemplateCollection" -Default ""))
  $brochureTemplateDescription = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "brochureTemplateDescription" -Default ""))
  $brochureTemplateSource = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "brochureTemplateSource" -Default ""))
  $brochureTemplateCanvaId = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "brochureTemplateCanvaId" -Default ""))
  $canvaGenerationBrief = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Settings -Name "canvaGenerationBrief" -Default ""))

  $renderedRefLines = @()
  foreach ($ref in $renderedImageRefs) {
    if ($null -eq $ref) { continue }
    $refIndex = [string](Get-PropValue -Object $ref -Name "index" -Default "?")
    $refName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "name" -Default ""))
    $refScene = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "sceneType" -Default ""))
    $refSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "summary" -Default ""))
    $refMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
    $refObjects = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "objects" -Default @()) | ForEach-Object { [string]$_ })))
    $refTexts = Sanitize-OpenAiText -Text ([string]::Join(" | ", @((Get-PropValue -Object $ref -Name "texts" -Default @()) | ForEach-Object { [string]$_ })))
    $parts = @("[RENDER #$refIndex] $refName")
    if ($refScene) { $parts += "scene=$refScene" }
    if ($refSummary) { $parts += "summary=$refSummary" }
    if ($refObjects) { $parts += "objects=$refObjects" }
    if ($refMaterials) { $parts += "materials=$refMaterials" }
    if ($refTexts) { $parts += "texts=$refTexts" }
    $renderedRefLines += ($parts -join " | ")
  }

  $contextRefLines = @()
  foreach ($ref in $contextImageRefs) {
    if ($null -eq $ref) { continue }
    $refIndex = [string](Get-PropValue -Object $ref -Name "index" -Default "?")
    $refName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "name" -Default ""))
    $refScene = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "sceneType" -Default ""))
    $refSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "summary" -Default ""))
    $refMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
    $refObjects = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "objects" -Default @()) | ForEach-Object { [string]$_ })))
    $refTexts = Sanitize-OpenAiText -Text ([string]::Join(" | ", @((Get-PropValue -Object $ref -Name "texts" -Default @()) | ForEach-Object { [string]$_ })))
    $parts = @("[CONTEXT #$refIndex] $refName")
    if ($refScene) { $parts += "scene=$refScene" }
    if ($refSummary) { $parts += "summary=$refSummary" }
    if ($refObjects) { $parts += "objects=$refObjects" }
    if ($refMaterials) { $parts += "materials=$refMaterials" }
    if ($refTexts) { $parts += "texts=$refTexts" }
    $contextRefLines += ($parts -join " | ")
  }
  $blueprintLines = @()
  foreach ($blueprint in $slideBlueprints) {
    $blueprintTitle = [string](Get-PropValue -Object $blueprint -Name "title" -Default "Slide")
    $blueprintSubtitle = [string](Get-PropValue -Object $blueprint -Name "subtitle" -Default "")
    $blueprintSection = [string](Get-PropValue -Object $blueprint -Name "sectionId" -Default "custom")
    $blueprintRole = [string](Get-PropValue -Object $blueprint -Name "visualRole" -Default "detail")
    $blueprintLayout = [string](Get-PropValue -Object $blueprint -Name "layout" -Default "split")
    $blueprintTextMode = [string](Get-PropValue -Object $blueprint -Name "textMode" -Default "suggested")
    $blueprintImageMode = [string](Get-PropValue -Object $blueprint -Name "imageSourceMode" -Default "inherit")
    $blueprintArrangement = [string](Get-PropValue -Object $blueprint -Name "imageArrangement" -Default "single")
    $blueprintMoodBoardLayout = [string](Get-PropValue -Object $blueprint -Name "moodBoardLayout" -Default "")
    $blueprintUseProjectImages = [string](Get-PropValue -Object $blueprint -Name "useProjectImages" -Default "false")
    $blueprintMaterials = [string]::Join(", ", @((Get-PropValue -Object $blueprint -Name "materialHighlights" -Default @()) | ForEach-Object { [string]$_ }))
    $blueprintObjects = [string]::Join(", ", @((Get-PropValue -Object $blueprint -Name "objectHighlights" -Default @()) | ForEach-Object { [string]$_ }))
    $blueprintMoodSources = [string]::Join(", ", @((Get-PropValue -Object $blueprint -Name "moodSources" -Default @()) | ForEach-Object { [string]$_ }))
    $blueprintLines += ("- {0}: {1} | {2} | role={3} | layout={4} | textMode={5} | imageSource={6} | arrangement={7} | moodBoardLayout={8} | useProjectImages={9} | materials={10} | objects={11} | moodSources={12}" -f $blueprintSection, (Sanitize-OpenAiText -Text $blueprintTitle), (Sanitize-OpenAiText -Text $blueprintSubtitle), $blueprintRole, $blueprintLayout, $blueprintTextMode, $blueprintImageMode, $blueprintArrangement, $blueprintMoodBoardLayout, $blueprintUseProjectImages, (Sanitize-OpenAiText -Text $blueprintMaterials), (Sanitize-OpenAiText -Text $blueprintObjects), (Sanitize-OpenAiText -Text $blueprintMoodSources))
  }
  $userBriefParts = @(
    "Project: $(Sanitize-OpenAiText -Text $Context)"
    "Scene: $analysisSummary"
  )
  if ($analysisObjects) { $userBriefParts += "Objects: $analysisObjects" }
  if ($analysisTexts) { $userBriefParts += "Text: $analysisTexts" }
  if ($analysisMaterials) { $userBriefParts += "Materials: $analysisMaterials" }
  if ($analysisEnvironment) { $userBriefParts += "Environment: $analysisEnvironment" }
  if ($analysisComposition) { $userBriefParts += "Composition: $analysisComposition" }
  if ($analysisRisks) { $userBriefParts += "Risks to avoid: $analysisRisks" }
  $userBriefParts += @(
    "Language: $brochureLanguage"
    "Pages: $pageCount | Audience: $audience | Tone: $pdfTone | Narrative: $narrative"
    "Plans: $plans | Density: $visualDensity | Cover: $coverStyle | Type: $projectType"
  )
  if ($brochureTemplateLabel) {
    $templateLine = "Selected visual template: $brochureTemplateLabel"
    if ($brochureTemplateCollection) { $templateLine += " | collection=$brochureTemplateCollection" }
    if ($brochureTemplateDescription) { $templateLine += " | intent=$brochureTemplateDescription" }
    if ($brochureTemplateSource) { $templateLine += " | source=$brochureTemplateSource" }
    if ($brochureTemplateCanvaId) { $templateLine += " | canvaId=$brochureTemplateCanvaId" }
    $userBriefParts += $templateLine
  }
  if ($canvaGenerationBrief) {
    $userBriefParts += "Template design brief to respect: $canvaGenerationBrief"
  }
  if ($selectedPalette.Count -gt 0) { $userBriefParts += "Palette: $([string]::Join(', ', $selectedPalette))" }
  if ($selectedAmenities.Count -gt 0) { $userBriefParts += "Amenities: $([string]::Join(', ', $selectedAmenities))" }
  if ($renderedRefLines.Count -gt 0) {
    $userBriefParts += ""
    $userBriefParts += "Photos the user CHOSE to render (these WILL appear as hero imagery in the deck; write text that directly describes and enhances them):"
    $userBriefParts += ($renderedRefLines -join "`n")
  }
  if ($contextRefLines.Count -gt 0) {
    $userBriefParts += ""
    $userBriefParts += "Photos used ONLY as project context (DO NOT describe them as if they appear in the deck; use them to understand the overall project, program, materiality and story):"
    $userBriefParts += ($contextRefLines -join "`n")
  }
  $userBriefParts += @(
    ""
    "Slide blueprints (respect EXACT order, never reorder):"
    ($blueprintLines -join "`n")
    ""
    "Deliverable: premium architectural brochure comparable to Canva luxury decks (Sky Garden, Babylon, Silentia, Kommo, Tour Deck). Every slide must feel art-directed, with editorial typography, concrete brand promise, and tangible proof points from the analyzed reference. The selected template is binding: adapt copy and slide hierarchy to its visual personality, never to a generic fallback."
    "Rules:"
    "- Use ONLY the requested language. brochureLanguage='es' means all copy in polished Spanish. brochureLanguage='en' means all copy in polished English."
    "- All copy must be human-readable, typo-free, and presentation-ready. Never output pseudo-words, OCR-like fragments, broken compounds, or malformed typography."
    "- tag = short all-caps section label (2-4 words) in the requested language, e.g. 'CONCEPTO' / 'CONCEPT', 'MATERIALIDAD' / 'MATERIALS'."
    "- title = 2-6 words in the requested language, evocative and editorial, never generic, never 'Slide N'."
    "- subtitle = 1 line of 8-16 words continuing the title without repeating it, premium editorial tone, in the requested language."
    "- bullets = EXACTLY 3 or 4 short phrases (10-18 words each) explaining benefits, experience, and concrete details (materials, surfaces, program, routes, services, activities), always in the requested language. Never generic filler. Never empty bullets. Never 3 identical bullets."
    "- Usa datos reales del Scene/Objects/Materials/Texts y de las fotos marcadas [RENDER]. Cita verbatim los textos detectados cuando aporten valor."
    "- Las fotos marcadas [CONTEXT] enriquecen tu comprension del proyecto completo (programa, alrededores, materialidad), pero NO las describas como si aparecieran en la slide. Solo las fotos [RENDER] estan en el deck."
    "- Varia la estructura pagina a pagina: no repitas el mismo adjetivo de portada. Cada slide debe ofrecer un angulo narrativo distinto (concepto, programa, materialidad, experiencia, contexto, propuesta de valor, cierre)."
    "- La portada (primera slide) debe tener titulo masivo y subtitulo de claim comercial; el cierre debe tener llamado a la accion concreto."
    "- Nada de texto tipo placeholder, nada de 'Lorem', nada de 'Ejemplo'."
    "Output: JSON puro, sin comentarios, sin markdown."
  )
  $userBrief = $userBriefParts -join "`n"

  $messages = @(
    @{
      role = "system"
      content = "Eres un director editorial de brochures arquitectonicos premium. Devuelves SOLO JSON con el esquema {title, summary, slides[{tag, title, subtitle, bullets[], visualRole, layout}]}. Mantienes el numero y orden de slides entregados. Cada slide es corto, visual y cinematografico, con textura editorial de revista (Wallpaper, Cereal, Architectural Digest). Jamas devuelves texto generico tipo 'Slide N'."
    },
    @{
      role = "user"
      content = @(
        @{
          type = "text"
          text = $userBrief
        }
      )
    }
  )
  $response = Invoke-OpenAiJsonChatCompletion -Messages $messages -MaxTokens ([Math]::Max(900, $pageCount * 130))
  $content = [string](Get-PropValue -Object (@($response.choices)[0].message) -Name "content" -Default "{}")
  return $content | ConvertFrom-Json
}

function Invoke-OpenAiRenderPrompts {
  param(
    [string]$Context = "",
    $Settings
  )

  $renderedImageRefs = @((Get-PropValue -Object $Settings -Name "renderedImageRefs" -Default @()))
  $contextImageRefs = @((Get-PropValue -Object $Settings -Name "contextImageRefs" -Default @()))
  $renderTargets = @((Get-PropValue -Object $Settings -Name "renderTargets" -Default @()))
  $brochureLanguage = [string](Get-PropValue -Object $Settings -Name "brochureLanguage" -Default "es")
  $projectType = [string](Get-PropValue -Object $Settings -Name "projectType" -Default "business")
  $imageMood = [string](Get-PropValue -Object $Settings -Name "imageMood" -Default "")
  $timeOfDay = [string](Get-PropValue -Object $Settings -Name "timeOfDay" -Default "")
  $lightScenario = [string](Get-PropValue -Object $Settings -Name "lightScenario" -Default "")
  $weatherAtmosphere = [string](Get-PropValue -Object $Settings -Name "weatherAtmosphere" -Default "")
  $occupancyGlobal = [string](Get-PropValue -Object $Settings -Name "occupancy" -Default "")
  $representationStyle = [string](Get-PropValue -Object $Settings -Name "representationStyle" -Default "")
  $imageFinish = [string](Get-PropValue -Object $Settings -Name "imageFinish" -Default "")
  $lensProfile = [string](Get-PropValue -Object $Settings -Name "lensProfile" -Default "")

  $renderedRefLines = @()
  foreach ($ref in $renderedImageRefs) {
    if ($null -eq $ref) { continue }
    $refIndex = [string](Get-PropValue -Object $ref -Name "index" -Default "?")
    $refId = [string](Get-PropValue -Object $ref -Name "id" -Default "")
    $refName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "name" -Default ""))
    $refScene = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "sceneType" -Default ""))
    $refSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "summary" -Default ""))
    $refMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
    $refObjects = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "objects" -Default @()) | ForEach-Object { [string]$_ })))
    $refTexts = Sanitize-OpenAiText -Text ([string]::Join(" | ", @((Get-PropValue -Object $ref -Name "texts" -Default @()) | ForEach-Object { [string]$_ })))
    $parts = @("[RENDER #$refIndex id=$refId] $refName")
    if ($refScene) { $parts += "scene=$refScene" }
    if ($refSummary) { $parts += "summary=$refSummary" }
    if ($refObjects) { $parts += "objects=$refObjects" }
    if ($refMaterials) { $parts += "materials=$refMaterials" }
    if ($refTexts) { $parts += "texts=$refTexts" }
    $renderedRefLines += ($parts -join " | ")
  }

  $contextRefLines = @()
  foreach ($ref in $contextImageRefs) {
    if ($null -eq $ref) { continue }
    $refIndex = [string](Get-PropValue -Object $ref -Name "index" -Default "?")
    $refName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "name" -Default ""))
    $refScene = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "sceneType" -Default ""))
    $refSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "summary" -Default ""))
    $refMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
    $parts = @("[CONTEXT #$refIndex] $refName")
    if ($refScene) { $parts += "scene=$refScene" }
    if ($refSummary) { $parts += "summary=$refSummary" }
    if ($refMaterials) { $parts += "materials=$refMaterials" }
    $contextRefLines += ($parts -join " | ")
  }

  $targetLines = @()
  foreach ($target in $renderTargets) {
    if ($null -eq $target) { continue }
    $targetKey = [string](Get-PropValue -Object $target -Name "targetKey" -Default "")
    $slideKey = [string](Get-PropValue -Object $target -Name "slideKey" -Default "")
    $slideTitle = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $target -Name "slideTitle" -Default ""))
    $sectionId = [string](Get-PropValue -Object $target -Name "sectionId" -Default "")
    $layout = [string](Get-PropValue -Object $target -Name "layout" -Default "")
    $imageId = [string](Get-PropValue -Object $target -Name "imageId" -Default "")
    $imageName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $target -Name "imageName" -Default ""))
    $imageRefIndex = [string](Get-PropValue -Object $target -Name "imageRefIndex" -Default "?")
    $framing = [string](Get-PropValue -Object $target -Name "framing" -Default "")
    $treatment = [string](Get-PropValue -Object $target -Name "treatment" -Default "")
    $representation = [string](Get-PropValue -Object $target -Name "representation" -Default "inherit")
    $finish = [string](Get-PropValue -Object $target -Name "finish" -Default "inherit")
    $occupancy = [string](Get-PropValue -Object $target -Name "occupancy" -Default "inherit")
    $aspect = [string](Get-PropValue -Object $target -Name "aspect" -Default "")
    $targetLines += ("- targetKey=$targetKey | slide=$slideKey ($slideTitle) | section=$sectionId | layout=$layout | imageRef=#$imageRefIndex ($imageName id=$imageId) | framing=$framing | treatment=$treatment | representation=$representation | finish=$finish | people=$occupancy | aspect=$aspect")
  }

  $briefParts = @(
    "Project: $(Sanitize-OpenAiText -Text $Context)"
    "Type: $projectType | Language: $brochureLanguage"
  )
  if ($imageMood) { $briefParts += "Mood: $imageMood" }
  if ($timeOfDay) { $briefParts += "TimeOfDay: $timeOfDay" }
  if ($lightScenario) { $briefParts += "LightScenario: $lightScenario" }
  if ($weatherAtmosphere) { $briefParts += "Weather: $weatherAtmosphere" }
  if ($occupancyGlobal) { $briefParts += "GlobalPeopleRule: $occupancyGlobal" }
  if ($representationStyle) { $briefParts += "Representation: $representationStyle" }
  if ($imageFinish) { $briefParts += "Finish: $imageFinish" }
  if ($lensProfile) { $briefParts += "Lens: $lensProfile" }

  if ($renderedRefLines.Count -gt 0) {
    $briefParts += ""
    $briefParts += "Source photos that the user CHOSE to render (one Gemini prompt required per render target referencing these):"
    $briefParts += ($renderedRefLines -join "`n")
  }
  if ($contextRefLines.Count -gt 0) {
    $briefParts += ""
    $briefParts += "Photos only for CONTEXT (do NOT render these; use to inform materiality and story consistency):"
    $briefParts += ($contextRefLines -join "`n")
  }
  $briefParts += ""
  $briefParts += "Render targets (YOU MUST return one prompt per targetKey, same order):"
  $briefParts += ($targetLines -join "`n")
  $briefParts += ""
  $briefParts += "Rules:"
  $briefParts += "- Return JSON: { prompts: [ { targetKey, imageId, geminiPrompt, negativePrompt, cameraNotes, materialsToPreserve[], textsToPreserve[] } ] }."
  $briefParts += "- One entry per targetKey in EXACT input order."
  $briefParts += "- geminiPrompt: one concise paragraph (90-150 words) in English, photography/architecture terms, explicitly preserving the referenced photo geometry, camera, crop, facade, roofline, openings, object positions, materials, signage and background."
  $briefParts += "- The referenced image is a LOCKED IMAGE-TO-IMAGE UNDERLAY, not inspiration. The prompt must say: preserve exact composition and silhouette map; improve only realism, lighting, texture depth, glass/reflections, contact shadows and color grading."
  $briefParts += "- Respect the slide's framing/treatment (hero, masterplan, mood, texture, detail). A 'mood' target can be atmospheric; a 'texture' target must lock on materials; a 'master' hero must keep full scene lock."
  $briefParts += "- Never invent architecture that is not visible. Never replace signage text. Never add a new facade, roof, plaza, landscape, volcano, furniture set, people distribution, storefront or branding system unless the user explicitly requested that exact change."
  $briefParts += "- PEOPLE RULE IS ABSOLUTE per target: people=none means zero people, silhouettes or reflections; people=few means exactly 1-3 discreet natural secondary people; people=many means multiple natural people and an active scene. If people=inherit, use the global/default project rule."
  $briefParts += "- The representation and finish values are binding. If representation=linear-drawing, do not make a photoreal render; if representation=photographic, do not make CGI, sketches or collage."
  $briefParts += "- negativePrompt: short list of things Gemini must avoid for this particular shot."
  $briefParts += "- materialsToPreserve and textsToPreserve come verbatim from the analysis."
  $briefParts += "Output: JSON puro, sin comentarios, sin markdown."

  $userBrief = $briefParts -join "`n"

  $messages = @(
    @{
      role = "system"
      content = "You are the prompt engineer inside RenderAI Studio. You prepare per-shot Gemini render prompts for an architectural brochure. Return JSON only."
    },
    @{
      role = "user"
      content = @(
        @{
          type = "text"
          text = $userBrief
        }
      )
    }
  )

  $targetCount = [Math]::Max(1, $targetLines.Count)
  $response = Invoke-OpenAiJsonChatCompletion -Messages $messages -MaxTokens ([Math]::Max(900, $targetCount * 220))
  $content = [string](Get-PropValue -Object (@($response.choices)[0].message) -Name "content" -Default "{}")
  return $content | ConvertFrom-Json
}

function Invoke-OpenAiBoardPrompts {
  param(
    [string]$Context = "",
    $Settings
  )

  $renderedImageRefs = @((Get-PropValue -Object $Settings -Name "renderedImageRefs" -Default @()))
  $contextImageRefs = @((Get-PropValue -Object $Settings -Name "contextImageRefs" -Default @()))
  $boardTargets = @((Get-PropValue -Object $Settings -Name "boardTargets" -Default @()))
  $brochureLanguage = [string](Get-PropValue -Object $Settings -Name "brochureLanguage" -Default "es")
  $projectType = [string](Get-PropValue -Object $Settings -Name "projectType" -Default "business")
  $selectedPalette = @((Get-PropValue -Object $Settings -Name "selectedPalette" -Default @()) | ForEach-Object { [string]$_ })

  $refLines = @()
  foreach ($ref in $renderedImageRefs + $contextImageRefs) {
    if ($null -eq $ref) { continue }
    $refIndex = [string](Get-PropValue -Object $ref -Name "index" -Default "?")
    $refName = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "name" -Default ""))
    $refScene = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "sceneType" -Default ""))
    $refSummary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $ref -Name "summary" -Default ""))
    $refMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $ref -Name "materials" -Default @()) | ForEach-Object { [string]$_ })))
    $parts = @("#$refIndex $refName")
    if ($refScene) { $parts += "scene=$refScene" }
    if ($refSummary) { $parts += "summary=$refSummary" }
    if ($refMaterials) { $parts += "materials=$refMaterials" }
    $refLines += ($parts -join " | ")
  }

  $targetLines = @()
  foreach ($target in $boardTargets) {
    if ($null -eq $target) { continue }
    $targetKey = [string](Get-PropValue -Object $target -Name "targetKey" -Default "")
    $slideKey = [string](Get-PropValue -Object $target -Name "slideKey" -Default "")
    $slideTitle = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $target -Name "slideTitle" -Default ""))
    $kind = [string](Get-PropValue -Object $target -Name "kind" -Default "board")
    $layout = [string](Get-PropValue -Object $target -Name "layout" -Default "")
    $moodBoardLayout = [string](Get-PropValue -Object $target -Name "moodBoardLayout" -Default "")
    $targetMaterials = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $target -Name "materialHighlights" -Default @()) | ForEach-Object { [string]$_ })))
    $targetObjects = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $target -Name "objectHighlights" -Default @()) | ForEach-Object { [string]$_ })))
    $targetMoodSources = Sanitize-OpenAiText -Text ([string]::Join(", ", @((Get-PropValue -Object $target -Name "moodSources" -Default @()) | ForEach-Object { [string]$_ })))
    $targetParts = @("targetKey=$targetKey", "slide=$slideKey ($slideTitle)", "kind=$kind", "layout=$layout")
    if ($moodBoardLayout) { $targetParts += "moodBoardLayout=$moodBoardLayout" }
    if ($targetMaterials) { $targetParts += "selectedMaterials=$targetMaterials" }
    if ($targetObjects) { $targetParts += "selectedObjects=$targetObjects" }
    if ($targetMoodSources) { $targetParts += "moodSources=$targetMoodSources" }
    $targetLines += ("- " + ($targetParts -join " | "))
  }

  $briefParts = @(
    "Project: $(Sanitize-OpenAiText -Text $Context)"
    "Type: $projectType | Language: $brochureLanguage"
  )
  if ($selectedPalette.Count -gt 0) { $briefParts += "Palette: $([string]::Join(', ', $selectedPalette))" }
  if ($refLines.Count -gt 0) {
    $briefParts += ""
    $briefParts += "Photos available for context:"
    $briefParts += ($refLines -join "`n")
  }
  $briefParts += ""
  $briefParts += "Board targets:"
  $briefParts += ($targetLines -join "`n")
  $briefParts += ""
  $briefParts += "Rules:"
  $briefParts += "- Return JSON: { prompts: [ { targetKey, kind, geminiPrompt, keywords[], materials[] } ] }."
  $briefParts += "- One entry per targetKey in EXACT input order."
  $briefParts += "- For kind='mood-board': geminiPrompt describes a Pinterest-grade interior architecture VISION BOARD, not a building render collage: one photographed square flatlay/collage with 8-12 layered material samples, furniture/detail objects, plants when relevant, fabric/stone/wood/metal/glass swatches, real shadows, premium editorial composition."
    $briefParts += "- For kind='materials': geminiPrompt describes a high-end photographed flatlay of real architectural samples: wood veneer, stone slab, concrete, metal, fabric, glass, vegetation accents when present, tactile close-up photography, realistic sample thickness and contact shadows."
    $briefParts += "- For kind='palette': geminiPrompt describes a refined photographed material palette board with painted color chips and physical samples matching the project palette, similar to a designer specification board."
    $briefParts += "- Respect moodBoardLayout literally. grid-separated = isolated square samples with gaps; object-flatlay = conceptual object flatlay; venetian-strips = parallel material slats; open-gallery = sparse negative space; sample-stack = overlapping slabs; material-rail = horizontal sample line; pinboard = pinned clippings without readable text; circular-palette = round chips/discs; architect-desk = plans plus samples on a table; museum-plinths = samples displayed on minimal plinth blocks."
    $briefParts += "- Use selectedMaterials and selectedObjects literally when present. They are user-selected ingredients for the board, not optional suggestions."
  $briefParts += "- The board must feel like a Canva/Pinterest design reference: elegant, composed, tactile, layered, commercial, with generous negative space and realistic materials. Do NOT generate a slide, poster, UI screen, brochure layout, labels, captions or infographic."
  $briefParts += "- CRITICAL: Every geminiPrompt must explicitly forbid text, letters, numbers, labels, logos, captions, watermarks and typographic marks inside the generated image."
  $briefParts += "- Prompts in English, photography terms, 50-100 words."
  $briefParts += "- Provide 5-8 keywords and 4-6 materials grounded in the photo analyses."
  $briefParts += "Output: JSON puro, sin comentarios, sin markdown."

  $userBrief = $briefParts -join "`n"

  $messages = @(
    @{
      role = "system"
      content = "You prepare flatlay/mood-board Gemini prompts for an architectural brochure. Return JSON only."
    },
    @{
      role = "user"
      content = @(
        @{
          type = "text"
          text = $userBrief
        }
      )
    }
  )

  $targetCount = [Math]::Max(1, $targetLines.Count)
  $response = Invoke-OpenAiJsonChatCompletion -Messages $messages -MaxTokens ([Math]::Max(700, $targetCount * 220))
  $content = [string](Get-PropValue -Object (@($response.choices)[0].message) -Name "content" -Default "{}")
  return $content | ConvertFrom-Json
}

function Convert-AnalysisCollectionToStrings {
  param($Value)

  $items = @()
  foreach ($entry in @($Value)) {
    if ($null -eq $entry) { continue }
    if ($entry -is [string]) {
      if (-not [string]::IsNullOrWhiteSpace($entry)) { $items += (Sanitize-OpenAiText -Text $entry.Trim()) }
      continue
    }

    $content = Get-PropValue -Object $entry -Name "content" -Default $null
    $location = Get-PropValue -Object $entry -Name "location" -Default $null
    if ($null -ne $content) {
      $text = [string]$content
      if (-not [string]::IsNullOrWhiteSpace([string]$location)) {
        $text = "$text · $location"
      }
      if (-not [string]::IsNullOrWhiteSpace($text)) { $items += (Sanitize-OpenAiText -Text $text.Trim()) }
      continue
    }

    $label = Get-PropValue -Object $entry -Name "label" -Default $null
    if ($null -ne $label) {
      $text = [string]$label
      if (-not [string]::IsNullOrWhiteSpace($text)) { $items += (Sanitize-OpenAiText -Text $text.Trim()) }
      continue
    }

    $properties = @($entry.PSObject.Properties)
    if ($properties.Count) {
      foreach ($property in $properties) {
        $line = if ([string]::IsNullOrWhiteSpace([string]$property.Value)) {
          [string]$property.Name
        } else {
          "{0}: {1}" -f $property.Name, [string]$property.Value
        }
        if (-not [string]::IsNullOrWhiteSpace($line)) { $items += (Sanitize-OpenAiText -Text $line.Trim()) }
      }
      continue
    }

    $items += (Sanitize-OpenAiText -Text ([string]$entry))
  }

  return @($items | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Select-Object -Unique)
}

function Normalize-ReferenceAnalysisResult {
  param($Analysis)

  return @{
    summary = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Analysis -Name "summary" -Default ""))
    sceneType = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Analysis -Name "sceneType" -Default "escena arquitectonica"))
    cameraNotes = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Analysis -Name "cameraNotes" -Default "camara bloqueada"))
    lightMood = Sanitize-OpenAiText -Text ([string](Get-PropValue -Object $Analysis -Name "lightMood" -Default "Balanceada"))
    objects = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "objects" -Default @())
    texts = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "texts" -Default @())
    materials = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "materials" -Default @())
    environment = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "environment" -Default @())
    composition = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "composition" -Default @())
    realismRisks = Convert-AnalysisCollectionToStrings -Value (Get-PropValue -Object $Analysis -Name "realismRisks" -Default @())
  }
}

function Sanitize-OpenAiText {
  param([AllowEmptyString()][string]$Text = "")

  if ([string]::IsNullOrWhiteSpace($Text)) { return "" }

  $normalized = $Text.Normalize([Text.NormalizationForm]::FormC)
  $builder = New-Object System.Text.StringBuilder
  foreach ($character in $normalized.ToCharArray()) {
    $code = [int][char]$character
    $category = [Globalization.CharUnicodeInfo]::GetUnicodeCategory($character)
    if ($code -eq 9) {
      [void]$builder.Append(" ")
      continue
    }
    if ($code -eq 10 -or $code -eq 13) {
      [void]$builder.Append($character)
      continue
    }
    if ($category -in @(
      [Globalization.UnicodeCategory]::Control,
      [Globalization.UnicodeCategory]::Surrogate,
      [Globalization.UnicodeCategory]::OtherNotAssigned
    )) {
      continue
    }
    [void]$builder.Append($character)
  }

  $clean = $builder.ToString() -replace '\s{2,}', ' '
  return $clean.Trim()
}

function Convert-DataUrlToJpegMeta {
  param(
    [string]$DataUrl,
    [int]$Width = 0,
    [int]$Height = 0
  )

  if ([string]::IsNullOrWhiteSpace($DataUrl)) {
    return $null
  }

  $commaIndex = $DataUrl.IndexOf(',')
  if ($commaIndex -lt 0) {
    return $null
  }

  $header = $DataUrl.Substring(5, $commaIndex - 5)
  if ($header -notmatch '^(?<mime>[^;]+);base64$') {
    return $null
  }

  $mimeType = $Matches.mime
  if ($mimeType -notmatch 'jpeg|jpg') {
    return $null
  }
  $base64Payload = $DataUrl.Substring($commaIndex + 1)
  $decodedBytes = [Convert]::FromBase64String($base64Payload)

  return [pscustomobject]@{
    Data = $decodedBytes
    PixelWidth = [Math]::Max(1, $Width)
    PixelHeight = [Math]::Max(1, $Height)
  }
}

function Convert-BytesToHexStream {
  param($Bytes)
  $buffer = [byte[]]$Bytes
  if ($null -eq $buffer -or $buffer.Length -eq 0) { return "" }
  return (([System.BitConverter]::ToString($buffer)).Replace("-", "")) + ">"
}

function New-PdfTextBlock {
  param(
    [Parameter(Mandatory = $true)][string]$Font,
    [Parameter(Mandatory = $true)][int]$Size,
    [Parameter(Mandatory = $true)][double]$X,
    [Parameter(Mandatory = $true)][double]$Y,
    [Parameter(Mandatory = $true)]$Lines,
    [double]$Leading = 14,
    [string]$Color = "0 0 0 rg"
  )

  $safeLines = @($Lines | Where-Object { $_ -ne $null })
  if (-not $safeLines.Count) { return @() }

  $commands = @("BT", "/$Font $Size Tf", "$Leading TL", $Color, ("{0} {1} Td" -f [math]::Round($X, 2), [math]::Round($Y, 2)))
  foreach ($line in $safeLines) {
    $commands += ("({0}) Tj" -f (Escape-PdfString -Text ([string]$line)))
    $commands += "T*"
  }
  $commands += "ET"
  return $commands
}

function Build-PdfPageStream {
  param(
    [Parameter(Mandatory = $true)]$Slide,
    [Parameter(Mandatory = $true)][int]$PageIndex,
    [Parameter(Mandatory = $true)][int]$PageCount,
    [string]$ImageAlias = ""
  )

  $title = [string](Get-PropValue -Object $Slide -Name "title" -Default "Slide")
  $subtitle = [string](Get-PropValue -Object $Slide -Name "subtitle" -Default "")
  $tag = [string](Get-PropValue -Object $Slide -Name "tag" -Default ("SLIDE {0}" -f $PageIndex))
  $bullets = @((Get-PropValue -Object $Slide -Name "bullets" -Default @()) | ForEach-Object { [string]$_ })
  $layout = [string](Get-PropValue -Object $Slide -Name "layout" -Default "feature")

  $titleLines = Wrap-Text -Text $title -Width 24
  $subtitleLines = if ([string]::IsNullOrWhiteSpace($subtitle)) { @() } else { Wrap-Text -Text $subtitle -Width 36 }
  $stream = @(
    "q"
    "0.952 0.937 0.912 rg"
    "0 0 842 595 re f"
    "0.37 0.28 0.2 rg"
    "28 28 786 539 re S"
    "Q"
  )

  $stream += New-PdfTextBlock -Font "F2" -Size 10 -X 56 -Y 550 -Lines @("RENDERAI STUDIO") -Leading 12 -Color "0.56 0.41 0.27 rg"
  $stream += New-PdfTextBlock -Font "F2" -Size 10 -X 720 -Y 550 -Lines @(("Pagina {0}/{1}" -f $PageIndex, $PageCount)) -Leading 12 -Color "0.36 0.29 0.24 rg"

  if ($layout -eq "fullbleed") {
    if (-not [string]::IsNullOrWhiteSpace($ImageAlias)) {
      # Browser-composed brochure pages already contain the final art direction.
      # Export them edge-to-edge so the selected local/Canva template is not
      # wrapped again in the generic PDF shell.
      $stream = @("q", "842 0 0 595 0 0 cm", "/$ImageAlias Do", "Q")
      return $stream -join "`n"
    }
    return $stream -join "`n"
  } elseif ($layout -eq "feature") {
    $stream += @(
      "q"
      "0.965 0.952 0.936 rg"
      "454 72 320 432 re f"
      "Q"
    )
    if (-not [string]::IsNullOrWhiteSpace($ImageAlias)) {
      $stream += @("q", "308 0 0 420 460 78 cm", "/$ImageAlias Do", "Q")
    }
    $tagLines = Wrap-Text -Text $tag.ToUpperInvariant() -Width 18
    $stream += New-PdfTextBlock -Font "F2" -Size 11 -X 56 -Y 492 -Lines $tagLines -Leading 13 -Color "0.56 0.41 0.27 rg"
    $stream += New-PdfTextBlock -Font "F3" -Size 34 -X 56 -Y 450 -Lines $titleLines -Leading 36 -Color "0.15 0.11 0.09 rg"
    $subtitleStart = 450 - ($titleLines.Count * 36) - 8
    if ($subtitleLines.Count) {
      $stream += New-PdfTextBlock -Font "F1" -Size 13 -X 56 -Y $subtitleStart -Lines $subtitleLines -Leading 18 -Color "0.35 0.29 0.24 rg"
    }
    $bulletY = $subtitleStart - ($subtitleLines.Count * 18) - 22
  } elseif ($layout -eq "board") {
    if (-not [string]::IsNullOrWhiteSpace($ImageAlias)) {
      $stream += @("q", "738 0 0 246 52 250 cm", "/$ImageAlias Do", "Q")
    }
    $tagLines = Wrap-Text -Text $tag.ToUpperInvariant() -Width 18
    $stream += New-PdfTextBlock -Font "F2" -Size 11 -X 56 -Y 522 -Lines $tagLines -Leading 13 -Color "0.56 0.41 0.27 rg"
    $stream += New-PdfTextBlock -Font "F3" -Size 28 -X 56 -Y 484 -Lines $titleLines -Leading 32 -Color "0.15 0.11 0.09 rg"
    $subtitleStart = 484 - ($titleLines.Count * 32) - 8
    if ($subtitleLines.Count) {
      $stream += New-PdfTextBlock -Font "F1" -Size 13 -X 56 -Y $subtitleStart -Lines $subtitleLines -Leading 18 -Color "0.35 0.29 0.24 rg"
    }
    $bulletY = 196
  } else {
    if (-not [string]::IsNullOrWhiteSpace($ImageAlias)) {
      $stream += @("q", "360 0 0 360 54 116 cm", "/$ImageAlias Do", "Q")
    }
    $tagLines = Wrap-Text -Text $tag.ToUpperInvariant() -Width 18
    $stream += New-PdfTextBlock -Font "F2" -Size 11 -X 448 -Y 492 -Lines $tagLines -Leading 13 -Color "0.56 0.41 0.27 rg"
    $stream += New-PdfTextBlock -Font "F3" -Size 28 -X 448 -Y 454 -Lines $titleLines -Leading 32 -Color "0.15 0.11 0.09 rg"
    $subtitleStart = 454 - ($titleLines.Count * 32) - 8
    if ($subtitleLines.Count) {
      $stream += New-PdfTextBlock -Font "F1" -Size 13 -X 448 -Y $subtitleStart -Lines $subtitleLines -Leading 18 -Color "0.35 0.29 0.24 rg"
    }
    $bulletY = $subtitleStart - ($subtitleLines.Count * 18) - 22
  }

  foreach ($bullet in $bullets) {
    $bulletWidth = if ($layout -eq "board") { 84 } elseif ($layout -eq "split") { 30 } else { 34 }
    $bulletX = if ($layout -eq "board") { 72 } elseif ($layout -eq "split") { 462 } else { 72 }
    $indentX = if ($layout -eq "board") { 84 } elseif ($layout -eq "split") { 474 } else { 84 }
    $bulletLines = Wrap-Text -Text ([string]$bullet) -Width $bulletWidth
    $stream += New-PdfTextBlock -Font "F1" -Size 12 -X $bulletX -Y $bulletY -Lines @("- " + $bulletLines[0]) -Leading 16 -Color "0.18 0.14 0.11 rg"
    $bulletY -= 18
    if ($bulletLines.Count -gt 1) {
      foreach ($line in $bulletLines[1..($bulletLines.Count - 1)]) {
        $stream += New-PdfTextBlock -Font "F1" -Size 12 -X $indentX -Y $bulletY -Lines @($line) -Leading 16 -Color "0.34 0.28 0.23 rg"
        $bulletY -= 16
      }
    }
    $bulletY -= 10
  }

  $stream += New-PdfTextBlock -Font "F2" -Size 9 -X 56 -Y 68 -Lines @("Deck arquitectonico generado por RenderAI Studio") -Leading 12 -Color "0.56 0.41 0.27 rg"
  return $stream -join "`n"
}

function New-PdfBytes {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [string]$Summary = "",
    [Parameter(Mandatory = $true)]$Slides,
    [string]$CoverImageDataUrl = "",
    [int]$CoverImageWidth = 0,
    [int]$CoverImageHeight = 0
  )

  $slideList = @($Slides)
  if (-not $slideList.Count) {
    $slideList = @(@{
      tag = "Portada"
      title = $Title
      subtitle = $Summary
      bullets = @("No slide data was provided.")
    })
  }

  $objects = New-Object System.Collections.Generic.List[string]
  $objects.Add('<< /Type /Catalog /Pages 2 0 R >>')
  $objects.Add('<< /Type /Pages /Count 0 /Kids [] >>')
  $objects.Add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>')
  $objects.Add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>')
  $objects.Add('<< /Type /Font /Subtype /Type1 /BaseFont /Times-Bold /Encoding /WinAnsiEncoding >>')

  $preparedSlides = @()
  foreach ($slide in $slideList) {
    $slideImageDataUrl = [string](Get-PropValue -Object $slide -Name "imageDataUrl" -Default "")
    if ([string]::IsNullOrWhiteSpace($slideImageDataUrl)) {
      $slideImageDataUrl = $CoverImageDataUrl
    }
    $slideImageWidth = [int](Get-PropValue -Object $slide -Name "imageWidth" -Default $CoverImageWidth)
    $slideImageHeight = [int](Get-PropValue -Object $slide -Name "imageHeight" -Default $CoverImageHeight)
    $imageMeta = Convert-DataUrlToJpegMeta -DataUrl $slideImageDataUrl -Width $slideImageWidth -Height $slideImageHeight
    $preparedSlides += @{ Slide = $slide; ImageMeta = $imageMeta }
  }

  $nextObjectId = 6
  foreach ($prepared in $preparedSlides) {
    $imageMeta = $prepared.ImageMeta
    if ($null -ne $imageMeta) {
      $imageBytes = Get-PropValue -Object $imageMeta -Name "Data" -Default @()
      $imageWidth = [int](Get-PropValue -Object $imageMeta -Name "PixelWidth" -Default 1)
      $imageHeight = [int](Get-PropValue -Object $imageMeta -Name "PixelHeight" -Default 1)
      $imageHex = Convert-BytesToHexStream -Bytes $imageBytes
      $prepared.ImageObjectId = $nextObjectId
      $objects.Add(("<< /Type /XObject /Subtype /Image /Width {0} /Height {1} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter [/ASCIIHexDecode /DCTDecode] /Length {2} >>`nstream`n{3}`nendstream" -f $imageWidth, $imageHeight, $imageHex.Length, $imageHex))
      $nextObjectId += 1
    } else {
      $prepared.ImageObjectId = 0
    }
  }

  $pageStartObjectId = $nextObjectId
  $kids = @()
  for ($index = 0; $index -lt $preparedSlides.Count; $index++) {
    $kids += ("{0} 0 R" -f ($pageStartObjectId + ($index * 2)))
  }
  $objects[1] = ('<< /Type /Pages /Count {0} /Kids [{1}] >>' -f $preparedSlides.Count, ($kids -join ' '))

  for ($pageIndex = 0; $pageIndex -lt $preparedSlides.Count; $pageIndex++) {
    $pageObjectId = $pageStartObjectId + ($pageIndex * 2)
    $contentObjectId = $pageObjectId + 1
    $prepared = $preparedSlides[$pageIndex]
    $resourceDictionary = if ($prepared.ImageObjectId -gt 0) {
      ('<< /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> /XObject << /Im1 {0} 0 R >> >>' -f $prepared.ImageObjectId)
    } else {
      '<< /Font << /F1 3 0 R /F2 4 0 R /F3 5 0 R >> >>'
    }

    $objects.Add(('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources {0} /Contents {1} 0 R >>' -f $resourceDictionary, $contentObjectId))

    $imageAlias = if ($prepared.ImageObjectId -gt 0) { "Im1" } else { "" }
    $pageStream = Build-PdfPageStream -Slide $prepared.Slide -PageIndex ($pageIndex + 1) -PageCount $preparedSlides.Count -ImageAlias $imageAlias
    $streamBytes = $script:PdfEncoding.GetBytes($pageStream)
    $streamText = $script:PdfEncoding.GetString($streamBytes)
    $objects.Add(("<< /Length {0} >>`nstream`n{1}`nendstream" -f $streamBytes.Length, $streamText))
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
    [string]$Summary = "",
    [Parameter(Mandatory = $true)]$Slides,
    [Parameter(Mandatory = $true)][string]$FileName,
    [string]$CoverImageDataUrl = "",
    [int]$CoverImageWidth = 0,
    [int]$CoverImageHeight = 0
  )

  $bytes = New-PdfBytes -Title $Title -Summary $Summary -Slides $Slides -CoverImageDataUrl $CoverImageDataUrl -CoverImageWidth $CoverImageWidth -CoverImageHeight $CoverImageHeight
  $Response.StatusCode = 200
  $Response.ContentType = "application/pdf"
  Apply-CorsHeaders -Response $Response
  $Response.Headers["Content-Disposition"] = ('attachment; filename="{0}"' -f $FileName)
  $Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Convert-HexColorToOle {
  param(
    [string]$Hex = "#111111"
  )

  $value = $Hex.Trim()
  if ($value -notmatch '^#?[0-9a-fA-F]{6}$') { $value = "#111111" }
  $value = $value.TrimStart('#')
  $r = [Convert]::ToInt32($value.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($value.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($value.Substring(4, 2), 16)
  return $r + ($g * 256) + ($b * 65536)
}

function Save-DataUrlToTempImage {
  param(
    [Parameter(Mandatory = $true)][string]$DataUrl,
    [Parameter(Mandatory = $true)][string]$Folder,
    [int]$Index = 0
  )

  $part = Convert-DataUrlToImagePart -DataUrl $DataUrl -Index $Index
  $path = Join-Path $Folder $part.FileName
  [System.IO.File]::WriteAllBytes($path, $part.Bytes)
  return $path
}

function Add-PptTextBox {
  param(
    [Parameter(Mandatory = $true)]$Slide,
    [Parameter(Mandatory = $true)][string]$Text,
    [double]$X,
    [double]$Y,
    [double]$Width,
    [double]$Height,
    [string]$FontName = "Manrope",
    [double]$FontSize = 24,
    [string]$Color = "#f7f7ed",
    [switch]$Bold,
    [switch]$Italic
  )

  if ([string]::IsNullOrWhiteSpace($Text)) { return $null }
  $shape = $Slide.Shapes.AddTextbox(1, $X, $Y, $Width, $Height)
  $shape.TextFrame.WordWrap = -1
  $shape.TextFrame.AutoSize = 0
  $shape.TextFrame.MarginLeft = 0
  $shape.TextFrame.MarginRight = 0
  $shape.TextFrame.MarginTop = 0
  $shape.TextFrame.MarginBottom = 0
  $range = $shape.TextFrame.TextRange
  $range.Text = $Text
  $range.Font.Name = $FontName
  $range.Font.Size = $FontSize
  $range.Font.Color.RGB = Convert-HexColorToOle -Hex $Color
  $range.Font.Bold = if ($Bold) { -1 } else { 0 }
  $range.Font.Italic = if ($Italic) { -1 } else { 0 }
  $range.ParagraphFormat.Alignment = 1
  try { $range.Font.Spacing = 0 } catch {}
  try {
    $shape.TextFrame2.TextRange.Font.Spacing = 0
    $shape.TextFrame2.TextRange.ParagraphFormat.Alignment = 1
    $shape.TextFrame2.WordWrap = -1
    $shape.TextFrame2.AutoSize = 0
  } catch {}
  return $shape
}

function Add-PptRect {
  param(
    [Parameter(Mandatory = $true)]$Slide,
    [double]$X,
    [double]$Y,
    [double]$Width,
    [double]$Height,
    [string]$Color = "#111314",
    [double]$Transparency = 0
  )

  $shape = $Slide.Shapes.AddShape(1, $X, $Y, $Width, $Height)
  $shape.Fill.Visible = -1
  $shape.Fill.ForeColor.RGB = Convert-HexColorToOle -Hex $Color
  $shape.Fill.Transparency = $Transparency
  $shape.Line.Visible = 0
  return $shape
}

function Add-PptPictureCover {
  param(
    [Parameter(Mandatory = $true)]$Slide,
    [Parameter(Mandatory = $true)][string]$ImagePath,
    [double]$X,
    [double]$Y,
    [double]$Width,
    [double]$Height
  )

  $picture = $Slide.Shapes.AddPicture($ImagePath, 0, -1, $X, $Y, $Width, $Height)
  return $picture
}

function Resolve-PptFontName {
  param(
    [string]$Preferred = "",
    [string]$Fallback = "Aptos"
  )

  $officeSafeFonts = @(
    "Aptos", "Aptos Display", "Arial", "Calibri", "Cambria", "Georgia",
    "Segoe UI", "Trebuchet MS", "Verdana", "Times New Roman"
  )
  if ($officeSafeFonts -contains $Preferred) { return $Preferred }
  return $Fallback
}

function New-PptxBytes {
  param(
    [Parameter(Mandatory = $true)][string]$Title,
    [string]$Summary = "",
    [Parameter(Mandatory = $true)]$Slides,
    $Theme = @{},
    $Template = @{}
  )

  $slideList = @($Slides)
  if (-not $slideList.Count) {
    $slideList = @(@{ title = $Title; subtitle = $Summary; bullets = @(); imageDataUrl = "" })
  }

  $tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("renderai-pptx-" + [Guid]::NewGuid().ToString("N"))
  New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
  $pptxPath = Join-Path $tempRoot "renderai-editable.pptx"
  $powerPoint = $null
  $presentation = $null

  try {
    $powerPoint = New-Object -ComObject PowerPoint.Application
    $powerPoint.Visible = -1
    $presentation = $powerPoint.Presentations.Add()
    $presentation.PageSetup.SlideWidth = 1600
    $presentation.PageSetup.SlideHeight = 1131

    $palette = @((Get-PropValue -Object $Theme -Name "palette" -Default @("#111314", "#d5d319", "#f7f7ed")) | ForEach-Object { [string]$_ })
    if (-not $palette.Count) { $palette = @("#111314", "#d5d319", "#f7f7ed") }
    # Exported PPTX must be editable and typo-safe on a normal Windows/Office
    # install. If the web UI uses Google fonts that PowerPoint does not have,
    # fall back to Office-safe fonts instead of letting Office substitute them
    # unpredictably and create odd spacing around Spanish accents.
    $titleFont = Resolve-PptFontName -Preferred ([string](Get-PropValue -Object $Theme -Name "titleFont" -Default "")) -Fallback "Georgia"
    $bodyFont = Resolve-PptFontName -Preferred ([string](Get-PropValue -Object $Theme -Name "bodyFont" -Default "")) -Fallback "Arial"
    $accent = $palette[1]
    if ([string]::IsNullOrWhiteSpace($accent)) { $accent = "#d5d319" }
    $dark = "#111314"
    $paper = "#f7f7ed"

    for ($index = 0; $index -lt $slideList.Count; $index += 1) {
      $slidePayload = $slideList[$index]
      $slide = $presentation.Slides.Add($index + 1, 12)
      $sectionId = [string](Get-PropValue -Object $slidePayload -Name "sectionId" -Default "")
      $role = [string](Get-PropValue -Object $slidePayload -Name "visualRole" -Default "")
      $layout = [string](Get-PropValue -Object $slidePayload -Name "layout" -Default "split")
      $tag = [string](Get-PropValue -Object $slidePayload -Name "tag" -Default ("SLIDE " + ($index + 1)))
      $slideTitle = [string](Get-PropValue -Object $slidePayload -Name "title" -Default ("Slide " + ($index + 1)))
      $subtitle = [string](Get-PropValue -Object $slidePayload -Name "subtitle" -Default "")
      $bullets = @((Get-PropValue -Object $slidePayload -Name "bullets" -Default @()) | ForEach-Object { [string]$_ } | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
      $imageDataUrl = [string](Get-PropValue -Object $slidePayload -Name "imageDataUrl" -Default "")
      $imagePath = $null
      if (-not [string]::IsNullOrWhiteSpace($imageDataUrl)) {
        $imagePath = Save-DataUrlToTempImage -DataUrl $imageDataUrl -Folder $tempRoot -Index $index
      }

      $isBoard = $sectionId -in @("moodboard", "materials", "pantone") -or $role -in @("moodboard", "materials", "board")
      $isCover = $index -eq 0 -or $sectionId -eq "cover"
      $isGallery = $layout -in @("gallery", "board") -or $role -in @("reference", "detail")

      if ($isCover) {
        Add-PptRect -Slide $slide -X 0 -Y 0 -Width 1600 -Height 1131 -Color $dark | Out-Null
        if ($imagePath) { Add-PptPictureCover -Slide $slide -ImagePath $imagePath -X 0 -Y 0 -Width 1600 -Height 1131 | Out-Null }
        Add-PptRect -Slide $slide -X 0 -Y 0 -Width 1600 -Height 1131 -Color "#000000" -Transparency 0.28 | Out-Null
        Add-PptRect -Slide $slide -X 112 -Y 212 -Width 620 -Height 650 -Color "#000000" -Transparency 0.42 | Out-Null
        Add-PptTextBox -Slide $slide -Text $tag.ToUpperInvariant() -X 118 -Y 74 -Width 320 -Height 32 -FontName $bodyFont -FontSize 17 -Color $paper -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $slideTitle.ToUpperInvariant() -X 130 -Y 270 -Width 610 -Height 260 -FontName $titleFont -FontSize 62 -Color $paper -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $subtitle -X 132 -Y 598 -Width 640 -Height 64 -FontName $bodyFont -FontSize 22 -Color $paper | Out-Null
        if ($bullets.Count) {
          Add-PptTextBox -Slide $slide -Text (($bullets | Select-Object -First 3 | ForEach-Object { "• $_" }) -join "`r") -X 132 -Y 700 -Width 560 -Height 160 -FontName $bodyFont -FontSize 19 -Color $paper | Out-Null
        }
      } elseif ($isBoard) {
        Add-PptRect -Slide $slide -X 0 -Y 0 -Width 1600 -Height 1131 -Color $dark | Out-Null
        Add-PptTextBox -Slide $slide -Text $tag.ToUpperInvariant() -X 76 -Y 74 -Width 300 -Height 28 -FontName $bodyFont -FontSize 14 -Color $paper -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $slideTitle -X 78 -Y 220 -Width 420 -Height 175 -FontName $titleFont -FontSize 46 -Color $paper -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $subtitle -X 84 -Y 428 -Width 430 -Height 70 -FontName $bodyFont -FontSize 20 -Color $paper | Out-Null
        if ($bullets.Count) {
          Add-PptTextBox -Slide $slide -Text (($bullets | Select-Object -First 4 | ForEach-Object { "• $_" }) -join "`r") -X 84 -Y 538 -Width 420 -Height 210 -FontName $bodyFont -FontSize 18 -Color $paper | Out-Null
        }
        Add-PptRect -Slide $slide -X 540 -Y 112 -Width 984 -Height 884 -Color $paper | Out-Null
        if ($imagePath) { Add-PptPictureCover -Slide $slide -ImagePath $imagePath -X 575 -Y 150 -Width 914 -Height 810 | Out-Null }
      } elseif ($isGallery) {
        Add-PptRect -Slide $slide -X 0 -Y 0 -Width 1600 -Height 1131 -Color $dark | Out-Null
        Add-PptTextBox -Slide $slide -Text $tag.ToUpperInvariant() -X 76 -Y 74 -Width 300 -Height 28 -FontName $bodyFont -FontSize 14 -Color $paper -Bold | Out-Null
        if ($imagePath) { Add-PptPictureCover -Slide $slide -ImagePath $imagePath -X 560 -Y 134 -Width 900 -Height 810 | Out-Null }
        Add-PptTextBox -Slide $slide -Text $slideTitle -X 82 -Y 214 -Width 390 -Height 150 -FontName $titleFont -FontSize 42 -Color $paper -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $subtitle -X 84 -Y 396 -Width 420 -Height 80 -FontName $bodyFont -FontSize 19 -Color $paper | Out-Null
        if ($bullets.Count) {
          Add-PptTextBox -Slide $slide -Text (($bullets | Select-Object -First 4 | ForEach-Object { "• $_" }) -join "`r") -X 84 -Y 515 -Width 390 -Height 220 -FontName $bodyFont -FontSize 17 -Color $paper | Out-Null
        }
      } else {
        Add-PptRect -Slide $slide -X 0 -Y 0 -Width 1600 -Height 1131 -Color "#f7f5ef" | Out-Null
        Add-PptTextBox -Slide $slide -Text $tag.ToUpperInvariant() -X 78 -Y 74 -Width 300 -Height 28 -FontName $bodyFont -FontSize 14 -Color $dark -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $slideTitle -X 86 -Y 210 -Width 470 -Height 160 -FontName $titleFont -FontSize 44 -Color $dark -Bold | Out-Null
        Add-PptTextBox -Slide $slide -Text $subtitle -X 88 -Y 390 -Width 500 -Height 70 -FontName $bodyFont -FontSize 19 -Color $dark | Out-Null
        if ($bullets.Count) {
          Add-PptTextBox -Slide $slide -Text (($bullets | Select-Object -First 4 | ForEach-Object { "• $_" }) -join "`r") -X 88 -Y 500 -Width 470 -Height 240 -FontName $bodyFont -FontSize 17 -Color $dark | Out-Null
        }
        if ($imagePath) { Add-PptPictureCover -Slide $slide -ImagePath $imagePath -X 650 -Y 132 -Width 820 -Height 830 | Out-Null }
      }

      Add-PptRect -Slide $slide -X 76 -Y 92 -Width 92 -Height 5 -Color $accent | Out-Null
      Add-PptTextBox -Slide $slide -Text ("{0:00} / {1:00}" -f ($index + 1), $slideList.Count) -X 1415 -Y 70 -Width 130 -Height 30 -FontName $bodyFont -FontSize 15 -Color ($(if ($isCover -or $isBoard -or $isGallery) { $paper } else { $dark })) -Bold | Out-Null
    }

    $presentation.SaveAs($pptxPath, 24)
    $presentation.Close()
    $presentation = $null
    return [System.IO.File]::ReadAllBytes($pptxPath)
  } finally {
    if ($null -ne $presentation) {
      try { $presentation.Close() } catch {}
    }
    if ($null -ne $powerPoint) {
      try { $powerPoint.Quit() } catch {}
      [System.Runtime.InteropServices.Marshal]::ReleaseComObject($powerPoint) | Out-Null
    }
    if (Test-Path -LiteralPath $tempRoot) {
      Remove-Item -LiteralPath $tempRoot -Recurse -Force -ErrorAction SilentlyContinue
    }
  }
}

function Write-PptxResponse {
  param(
    [Parameter(Mandatory = $true)]$Response,
    [Parameter(Mandatory = $true)][string]$Title,
    [string]$Summary = "",
    [Parameter(Mandatory = $true)]$Slides,
    [Parameter(Mandatory = $true)][string]$FileName,
    $Theme = @{},
    $Template = @{}
  )

  $bytes = New-PptxBytes -Title $Title -Summary $Summary -Slides $Slides -Theme $Theme -Template $Template
  $Response.StatusCode = 200
  $Response.ContentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
  Apply-CorsHeaders -Response $Response
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

  if ($method -eq "OPTIONS") {
    Apply-CorsHeaders -Response $response
    $response.StatusCode = 204
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/login") {
    $payload = Get-RequestJson -Request $request
    $username = [string](Get-PropValue -Object $payload -Name "username" -Default "")
    $password = [string](Get-PropValue -Object $payload -Name "password" -Default "")
    $users = @(Get-RenderAiUsers)
    if ($users.Count -eq 0) {
      Write-JsonResponse -Response $response -StatusCode 503 -Payload @{
        ok = $false
        message = "Autenticacion no configurada. Define RENDERAI_ADMIN_PASSWORD y RENDERAI_ARCHITECT_PASSWORD en el servidor."
      }
      return $true
    }

    $user = $users | Where-Object { $_.username -eq $username -and $_.password -eq $password } | Select-Object -First 1

    if (-not $user) {
      Write-JsonResponse -Response $response -StatusCode 401 -Payload @{
        ok = $false
        message = "Usuario o password invalido."
      }
      return $true
    }

    Write-JsonResponse -Response $response -Payload @{
      ok = $true
      user = @{
        username = $user.username
        role = $user.role
        name = $user.name
      }
    }
    return $true
  }

  if ($method -eq "GET" -and $path -eq "/api/health") {
    $runtime = Resolve-RenderRuntimeInfo
    Write-JsonResponse -Response $response -Payload @{
      status = "ok"
      app = "RenderAI Studio"
      aiReady = $runtime.renderReady
      renderReady = $runtime.renderReady
      analysisReady = $runtime.analysisReady
      renderProvider = $runtime.renderProvider
      analysisProvider = $runtime.analysisProvider
      openAiReady = $runtime.openAiReady
      geminiReady = $runtime.geminiReady
      root = $resolvedRoot
      port = $script:BoundPort
      secretSource = $runtime.renderSecretSource
      renderSecretSource = $runtime.renderSecretSource
      analysisSecretSource = $runtime.analysisSecretSource
      authConfigured = (@(Get-RenderAiUsers).Count -gt 0)
      publicDeployment = (Test-RenderAiPublicDeployment)
      timestamp = (Get-Date).ToString("o")
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-render-image") {
    $payload = Get-RequestJson -Request $request
    $runtime = Resolve-RenderRuntimeInfo
    if (-not $runtime.renderReady) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "No image generation provider is configured. Add GEMINI_API_KEY or OPENAI_API_KEY."
      }
      return $true
    }

    try {
      $prompt = [string](Get-PropValue -Object $payload -Name "prompt" -Default "Architectural image edit")
      $images = Get-PropValue -Object $payload -Name "images" -Default @()
      $size = [string](Get-PropValue -Object $payload -Name "size" -Default "1536x1024")
      $quality = [string](Get-PropValue -Object $payload -Name "quality" -Default "medium")
      $inputFidelity = [string](Get-PropValue -Object $payload -Name "inputFidelity" -Default "low")
      $providerPreference = ([string](Get-PropValue -Object $payload -Name "providerPreference" -Default "auto")).ToLowerInvariant()
      $strictFidelity = [bool](Get-PropValue -Object $payload -Name "strictFidelity" -Default $false)
      $outputFormat = [string](Get-PropValue -Object $payload -Name "outputFormat" -Default "jpeg")
      $outputCompression = [int](Get-PropValue -Object $payload -Name "outputCompression" -Default 92)
      $provider = $runtime.renderProvider
      if (($providerPreference -eq "openai" -or $providerPreference -eq "openai-strict") -and $runtime.openAiReady) {
        $provider = "openai"
      } elseif ($providerPreference -eq "gemini" -and $runtime.geminiReady) {
        $provider = "gemini"
      } elseif (($providerPreference -eq "auto-strict" -or $strictFidelity -or $inputFidelity -eq "high") -and $runtime.openAiReady) {
        $provider = "openai"
      } elseif ($runtime.geminiReady) {
        $provider = "gemini"
      } elseif ($runtime.openAiReady) {
        $provider = "openai"
      }
      $usedProvider = $provider
      $fallbackReason = ""

      if ($provider -eq "gemini") {
        try {
          $result = Invoke-GeminiImageGenerate -Prompt $prompt -Images $images -Size $size -Quality $quality
        } catch {
          $geminiDetail = Get-ErrorDetailText -ErrorRecord $_
          if (-not $runtime.openAiReady) {
            throw
          }
          try {
            $usedProvider = "openai-fallback"
            $fallbackReason = "Gemini no respondio correctamente; se uso OpenAI como respaldo."
            $result = Invoke-OpenAiRenderEdit `
              -Prompt $prompt `
              -Images $images `
              -Size $size `
              -Quality $quality `
              -InputFidelity $inputFidelity `
              -OutputFormat $outputFormat `
              -OutputCompression $outputCompression
          } catch {
            $openAiDetail = Get-ErrorDetailText -ErrorRecord $_
            throw "Gemini fallo: $geminiDetail OpenAI fallback tambien fallo: $openAiDetail"
          }
        }
      } else {
        $result = Invoke-OpenAiRenderEdit `
          -Prompt $prompt `
          -Images $images `
          -Size $size `
          -Quality $quality `
          -InputFidelity $inputFidelity `
          -OutputFormat $outputFormat `
          -OutputCompression $outputCompression
      }

      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        imageBase64 = $result.imageBase64
        revisedPrompt = $result.revisedPrompt
        provider = $usedProvider
        fallbackReason = $fallbackReason
        mimeType = [string](Get-PropValue -Object $result -Name "mimeType" -Default "image/jpeg")
      }
    } catch {
      $statusCode = Get-ErrorStatusCode -ErrorRecord $_ -Default 500
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode $statusCode -Payload @{
        ok = $false
        message = $detailText
        upstreamStatus = $statusCode
      }
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/analyze-reference") {
    $payload = Get-RequestJson -Request $request
    if ([string]::IsNullOrWhiteSpace((Get-StoredOpenAiApiKey))) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "OPENAI_API_KEY is not configured."
      }
      return $true
    }

    try {
      $analysis = Invoke-OpenAiReferenceAnalysis `
        -ImageDataUrl ([string](Get-PropValue -Object $payload -Name "image" -Default "")) `
        -Flow ([string](Get-PropValue -Object $payload -Name "flow" -Default "render")) `
        -Context ([string](Get-PropValue -Object $payload -Name "context" -Default ""))
      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        analysis = $analysis
      }
    } catch {
      $statusCode = Get-ErrorStatusCode -ErrorRecord $_ -Default 500
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode $statusCode -Payload @{
        ok = $false
        message = $detailText
      }
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-presentation-outline") {
    $payload = Get-RequestJson -Request $request
    if ([string]::IsNullOrWhiteSpace((Get-StoredOpenAiApiKey))) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "OPENAI_API_KEY is not configured."
      }
      return $true
    }

    try {
      $outline = Invoke-OpenAiPresentationOutline `
        -Context ([string](Get-PropValue -Object $payload -Name "context" -Default "")) `
        -Analysis (Get-PropValue -Object $payload -Name "analysis" -Default @{}) `
        -Settings (Get-PropValue -Object $payload -Name "settings" -Default @{})
      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        outline = $outline
      }
    } catch {
      $statusCode = Get-ErrorStatusCode -ErrorRecord $_ -Default 500
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode $statusCode -Payload @{
        ok = $false
        message = $detailText
      }
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-render-prompts") {
    $payload = Get-RequestJson -Request $request
    if ([string]::IsNullOrWhiteSpace((Get-StoredOpenAiApiKey))) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "OPENAI_API_KEY is not configured."
      }
      return $true
    }

    try {
      $prompts = Invoke-OpenAiRenderPrompts `
        -Context ([string](Get-PropValue -Object $payload -Name "context" -Default "")) `
        -Settings (Get-PropValue -Object $payload -Name "settings" -Default @{})
      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        prompts = $prompts
      }
    } catch {
      $statusCode = Get-ErrorStatusCode -ErrorRecord $_ -Default 500
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode $statusCode -Payload @{
        ok = $false
        message = $detailText
      }
    }
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/generate-board-prompts") {
    $payload = Get-RequestJson -Request $request
    if ([string]::IsNullOrWhiteSpace((Get-StoredOpenAiApiKey))) {
      Write-JsonResponse -Response $response -StatusCode 412 -Payload @{
        ok = $false
        message = "OPENAI_API_KEY is not configured."
      }
      return $true
    }

    try {
      $prompts = Invoke-OpenAiBoardPrompts `
        -Context ([string](Get-PropValue -Object $payload -Name "context" -Default "")) `
        -Settings (Get-PropValue -Object $payload -Name "settings" -Default @{})
      Write-JsonResponse -Response $response -Payload @{
        ok = $true
        prompts = $prompts
      }
    } catch {
      $statusCode = Get-ErrorStatusCode -ErrorRecord $_ -Default 500
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode $statusCode -Payload @{
        ok = $false
        message = $detailText
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
    $coverImageDataUrl = [string](Get-PropValue -Object $payload -Name "coverImageDataUrl" -Default "")
    $coverImageWidth = [int](Get-PropValue -Object $payload -Name "coverImageWidth" -Default 0)
    $coverImageHeight = [int](Get-PropValue -Object $payload -Name "coverImageHeight" -Default 0)
    Write-PdfResponse -Response $response -Title $title -Summary $summary -Slides $slides -FileName $fileName -CoverImageDataUrl $coverImageDataUrl -CoverImageWidth $coverImageWidth -CoverImageHeight $coverImageHeight
    return $true
  }

  if ($method -eq "POST" -and $path -eq "/api/export-pptx") {
    $payload = Get-RequestJson -Request $request
    $title = [string](Get-PropValue -Object $payload -Name "title" -Default "RenderAI Export")
    $summary = [string](Get-PropValue -Object $payload -Name "summary" -Default "")
    $fileName = [string](Get-PropValue -Object $payload -Name "fileName" -Default "renderai-editable.pptx")
    $slides = Get-PropValue -Object $payload -Name "slides" -Default @()
    $theme = Get-PropValue -Object $payload -Name "theme" -Default @{}
    $template = Get-PropValue -Object $payload -Name "template" -Default @{}
    try {
      Write-PptxResponse -Response $response -Title $title -Summary $summary -Slides $slides -FileName $fileName -Theme $theme -Template $template
    } catch {
      $detailText = Get-ErrorDetailText -ErrorRecord $_
      Write-JsonResponse -Response $response -StatusCode 500 -Payload @{
        ok = $false
        message = "No se pudo crear el PPTX editable. PowerPoint local debe estar disponible en este equipo. $detailText"
      }
    }
    return $true
  }

  return $false
}

try {
  $listener = $null
  $portCandidates = @(
    $Port,
    ($Port + 1),
    8082, 8083, 8084, 8085,
    8111, 8112, 8113, 8114, 8115, 8116, 8117, 8118, 8119, 8120
  ) | Select-Object -Unique
  foreach ($candidatePort in $portCandidates) {
    $candidateListener = New-RenderAiListener -TargetPort $candidatePort
    try {
      $candidateListener.Start()
      $listener = $candidateListener
      $script:BoundPort = $candidatePort
      break
    } catch {
      $candidateListener.Close()
    }
  }

  if ($null -eq $listener -or -not $listener.IsListening) {
    throw "No se pudo abrir un listener HTTP en los puertos $($portCandidates -join ', ')."
  }

  Write-Host "RenderAI Studio server running at http://127.0.0.1:$script:BoundPort/"
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
      Apply-CorsHeaders -Response $context.Response
      $context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
      $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } catch {
      $message = [System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
      $context.Response.StatusCode = 500
      $context.Response.ContentType = "text/plain; charset=utf-8"
      Apply-CorsHeaders -Response $context.Response
      $context.Response.OutputStream.Write($message, 0, $message.Length)
    } finally {
      $context.Response.OutputStream.Close()
    }
  }
} finally {
  if ($null -ne $listener) {
    if ($listener.IsListening) { $listener.Stop() }
    $listener.Close()
  }
}
