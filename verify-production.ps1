param(
  [string]$BaseUrl = "https://renderai-j6g0.onrender.com"
)

$ErrorActionPreference = "Stop"

function Invoke-Json($Url) {
  Write-Host "GET $Url"
  return Invoke-RestMethod -Uri $Url -Method Get
}

$health = Invoke-Json "$BaseUrl/api/health"
$providers = Invoke-Json "$BaseUrl/api/providers/status"
$luma = Invoke-Json "$BaseUrl/api/luma/diagnostics"

Write-Host ""
Write-Host "=== HEALTH ==="
$health | ConvertTo-Json -Depth 20

Write-Host ""
Write-Host "=== PROVIDERS ==="
$providers | ConvertTo-Json -Depth 20

Write-Host ""
Write-Host "=== LUMA ==="
$luma | ConvertTo-Json -Depth 20

$errors = @()

if (-not $luma.luma.configured) {
  $errors += "Luma no esta configurado."
}

if (-not $luma.luma.ready) {
  $errors += "Luma no esta ready. blockedReason=$($luma.luma.blockedReason)"
}

if (-not $luma.luma.publicAssetBaseUrlConfigured) {
  $errors += "PUBLIC_ASSET_BASE_URL no esta configurado."
}

if (-not $luma.luma.publicAssetBaseUrlIsHttps) {
  $errors += "PUBLIC_ASSET_BASE_URL no es HTTPS."
}

if ($health.videoProvider -ne "luma") {
  $errors += "videoProvider no es luma. Actual=$($health.videoProvider)"
}

if (-not $health.videoReady) {
  $errors += "videoReady=false."
}

if (-not (Get-Content -LiteralPath (Join-Path $PSScriptRoot "app.js") -Raw).Contains("function exportPresentationToPptx")) {
  $errors += "No se encontro exportPresentationToPptx en app.js."
}

if (-not (Get-Content -LiteralPath (Join-Path $PSScriptRoot "index.html") -Raw).Contains("pptxgen.bundle.js")) {
  $errors += "PptxGenJS no esta cargado en index.html."
}

try {
  $assetProbe = Invoke-WebRequest -Uri "$BaseUrl/outputs/project-assets/__verify__/missing.png" -Method Get -SkipHttpErrorCheck
  if ($assetProbe.StatusCode -notin @(200, 404)) {
    $errors += "Handler /outputs/project-assets respondio HTTP $($assetProbe.StatusCode)."
  }
} catch {
  $errors += "No se pudo comprobar handler /outputs/project-assets: $($_.Exception.Message)"
}

if ($errors.Count -gt 0) {
  Write-Host ""
  Write-Host "PRODUCCION NO LISTA:" -ForegroundColor Red
  $errors | ForEach-Object { Write-Host "- $_" -ForegroundColor Red }
  exit 1
}

Write-Host ""
Write-Host "PRODUCCION LISTA: Luma y video estan activos." -ForegroundColor Green
