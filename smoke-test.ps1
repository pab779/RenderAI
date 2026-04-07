param(
  [int]$Port = 8093
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverJob = $null

function Assert-True {
  param(
    [Parameter(Mandatory = $true)][bool]$Condition,
    [Parameter(Mandatory = $true)][string]$Message
  )

  if (-not $Condition) {
    throw $Message
  }
}

try {
  Write-Host "Starting local server on port $Port..."
  $serverJob = Start-Job -ScriptBlock {
    param($Path, $SelectedPort)
    Set-Location $Path
    powershell -ExecutionPolicy Bypass -File ".\start-server.ps1" -Port $SelectedPort
  } -ArgumentList $root, $Port

  Start-Sleep -Seconds 2

  $index = Invoke-WebRequest "http://127.0.0.1:$Port/" -UseBasicParsing
  Assert-True ($index.StatusCode -eq 200) "Index request did not return HTTP 200."
  Assert-True ($index.Content -match "modeRenderBtn") "Render mode control was not found in index.html."
  Assert-True ($index.Content -match "modePresentationBtn") "Presentation mode control was not found in index.html."

  $appJs = Invoke-WebRequest "http://127.0.0.1:$Port/app.js" -UseBasicParsing
  Assert-True ($appJs.StatusCode -eq 200) "app.js request did not return HTTP 200."
  Assert-True ($appJs.Content -match "buildPresentationOutline") "Presentation outline logic was not found in app.js."

  $styles = Invoke-WebRequest "http://127.0.0.1:$Port/styles.css" -UseBasicParsing
  Assert-True ($styles.StatusCode -eq 200) "styles.css request did not return HTTP 200."
  Assert-True ($styles.Content -match "mode-card") "Workflow switch styles were not found in styles.css."

  $health = Invoke-WebRequest "http://127.0.0.1:$Port/api/health" -UseBasicParsing
  $healthJson = $health.Content | ConvertFrom-Json
  Assert-True ($health.StatusCode -eq 200) "/api/health request did not return HTTP 200."
  Assert-True ($healthJson.status -eq "ok") "/api/health did not return an ok status."

  $renderPayload = @{
    projectContext = "Boutique hospitality lounge in Costa Rica"
    settings = @{
      fidelity = "9"
      realism = "9"
      imageStyle = "editorial interior photography"
      renderStyle = "high-end hospitality realism"
      timeOfDay = "golden hour"
      lightType = "warm ambient architectural lighting"
      photoAngle = "wide perspective"
      peopleMode = "subtle ambient people"
      promptLanguage = "english"
    }
    mainImage = @{
      fileName = "sample-reference.jpg"
      analysis = @{
        sceneType = "wide interior archviz"
        aspectLabel = "16:10 / 16:9"
        brightnessLabel = "balanced"
        lightMood = "warm daylight"
        edgeLabel = "18%"
        paletteMood = "warm"
        angleHint = "wide interior perspective"
      }
    }
  } | ConvertTo-Json -Depth 8

  $renderResponse = Invoke-WebRequest "http://127.0.0.1:$Port/api/generate-render-prompt" -Method POST -ContentType "application/json" -Body $renderPayload -UseBasicParsing
  $renderJson = $renderResponse.Content | ConvertFrom-Json
  Assert-True ($renderResponse.StatusCode -eq 200) "Render prompt endpoint did not return HTTP 200."
  Assert-True ($renderJson.prompt -match "GLOBAL OBJECTIVE") "Render prompt endpoint did not return the expected prompt body."

  $presentationPayload = @{
    settings = @{
      promptLanguage = "spanish"
    }
    presentation = @{
      context = "Proyecto hotelero frente al mar"
      typology = "Hotel"
      location = "Guanacaste, Costa Rica"
      program = "Lobby, restaurante, piscina, wellness y habitaciones"
      tone = "premium persuasive"
      needsPlans = "yes"
      slideCount = "10"
      goal = "Presentar el proyecto a inversionistas"
      documents = @(
        @{ fileName = "programa.pdf" }
      )
    }
  } | ConvertTo-Json -Depth 8

  $presentationResponse = Invoke-WebRequest "http://127.0.0.1:$Port/api/generate-presentation-outline" -Method POST -ContentType "application/json" -Body $presentationPayload -UseBasicParsing
  $presentationJson = $presentationResponse.Content | ConvertFrom-Json
  Assert-True ($presentationResponse.StatusCode -eq 200) "Presentation endpoint did not return HTTP 200."
  Assert-True ($presentationJson.outline -match "Estructura sugerida") "Presentation endpoint did not return the expected outline."

  $pdfPayload = @{
    mode = "presentation"
    title = "Smoke Test PDF"
    fileName = "smoke-test.pdf"
    content = "Linea 1`nLinea 2`nLinea 3"
  } | ConvertTo-Json -Depth 5

  $pdfResponse = Invoke-WebRequest "http://127.0.0.1:$Port/api/export-pdf" -Method POST -ContentType "application/json" -Body $pdfPayload -UseBasicParsing -OutFile (Join-Path $root "smoke-test-output.pdf")
  $pdfBytes = [System.IO.File]::ReadAllBytes((Join-Path $root "smoke-test-output.pdf"))
  Assert-True ($pdfBytes.Length -gt 20) "PDF export created an empty file."
  $pdfHeader = [System.Text.Encoding]::ASCII.GetString($pdfBytes[0..7])
  Assert-True ($pdfHeader.StartsWith("%PDF-1.")) "PDF export did not generate a valid PDF header."

  node --check (Join-Path $root "app.js")
  Assert-True ($LASTEXITCODE -eq 0) "JavaScript syntax check failed."

  Write-Host ""
  Write-Host "Smoke test passed."
  Write-Host "- Index served correctly"
  Write-Host "- Static assets are reachable"
  Write-Host "- Workflow controls are present"
  Write-Host "- Health endpoint responds"
  Write-Host "- Render prompt endpoint responds"
  Write-Host "- Presentation outline endpoint responds"
  Write-Host "- PDF export endpoint generates a PDF"
  Write-Host "- app.js syntax is valid"
} finally {
  $pdfPath = Join-Path $root "smoke-test-output.pdf"
  if (Test-Path $pdfPath) {
    Remove-Item $pdfPath -Force
  }
  if ($serverJob) {
    Stop-Job $serverJob -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $serverJob -ErrorAction SilentlyContinue | Out-Null
  }
}
