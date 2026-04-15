param(
  [Parameter(Mandatory = $false)]
  [ValidateSet("openai", "gemini", "all")]
  [string]$Provider = "all"
)

$ErrorActionPreference = "Stop"
$storeRoot = Join-Path $env:APPDATA "RenderAIStudio"
$targets = switch ($Provider) {
  "openai" { @("openai") }
  "gemini" { @("gemini") }
  default { @("openai", "gemini") }
}

foreach ($target in $targets) {
  $storePath = Join-Path $storeRoot ("{0}_api_key.secure.txt" -f $target)
  if (Test-Path -LiteralPath $storePath) {
    Remove-Item -LiteralPath $storePath -Force
  }

  if ($target -eq "openai") {
    Remove-Item Env:OPENAI_API_KEY -ErrorAction SilentlyContinue
  } elseif ($target -eq "gemini") {
    Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  }
}

Write-Host "Local development secret removed for provider: $Provider"
