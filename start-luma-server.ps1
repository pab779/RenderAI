param(
  [int]$Port = 8125,
  [switch]$KeepExistingServer
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$localBase = if (-not [string]::IsNullOrWhiteSpace($env:LOCALAPPDATA)) {
  $env:LOCALAPPDATA
} elseif (-not [string]::IsNullOrWhiteSpace($env:APPDATA)) {
  $env:APPDATA
} elseif (-not [string]::IsNullOrWhiteSpace($env:USERPROFILE)) {
  $env:USERPROFILE
} else {
  $root
}

$runtimeRoot = Join-Path $localBase "RenderAIStudio"
$binRoot = Join-Path $runtimeRoot "bin"
$logRoot = Join-Path $runtimeRoot "logs"
New-Item -ItemType Directory -Path $binRoot -Force | Out-Null
New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

$cloudflaredPath = Join-Path $binRoot "cloudflared.exe"
$cloudflaredUrl = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe"

if (-not (Test-Path -LiteralPath $cloudflaredPath -PathType Leaf)) {
  $tmpPath = Join-Path $binRoot "cloudflared.download.exe"
  Write-Host "Downloading cloudflared tunnel client..."
  Invoke-WebRequest -Uri $cloudflaredUrl -OutFile $tmpPath
  Move-Item -LiteralPath $tmpPath -Destination $cloudflaredPath -Force
}

if (-not $KeepExistingServer) {
  Get-CimInstance Win32_Process -Filter "name='powershell.exe' OR name='pwsh.exe'" |
    Where-Object { $_.CommandLine -match 'start-server\.ps1' -and $_.CommandLine -match "\b$Port\b" } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
}

Get-CimInstance Win32_Process -Filter "name='cloudflared.exe'" |
  Where-Object { $_.CommandLine -match "127\.0\.0\.1:$Port|localhost:$Port" } |
  ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$tunnelOut = Join-Path $logRoot "cloudflared-$Port-$stamp.out.log"
$tunnelErr = Join-Path $logRoot "cloudflared-$Port-$stamp.err.log"
$serverOut = Join-Path $logRoot "renderai-$Port-$stamp.out.log"
$serverErr = Join-Path $logRoot "renderai-$Port-$stamp.err.log"

$tunnelArgs = @("tunnel", "--no-autoupdate", "--url", "http://127.0.0.1:$Port")
$tunnel = Start-Process -FilePath $cloudflaredPath -ArgumentList $tunnelArgs -PassThru -WindowStyle Hidden -RedirectStandardOutput $tunnelOut -RedirectStandardError $tunnelErr

$publicUrl = ""
$deadline = (Get-Date).AddSeconds(45)
while ((Get-Date) -lt $deadline -and [string]::IsNullOrWhiteSpace($publicUrl)) {
  Start-Sleep -Milliseconds 650
  $text = ""
  if (Test-Path -LiteralPath $tunnelOut) { $text += "`n" + (Get-Content -LiteralPath $tunnelOut -Raw -ErrorAction SilentlyContinue) }
  if (Test-Path -LiteralPath $tunnelErr) { $text += "`n" + (Get-Content -LiteralPath $tunnelErr -Raw -ErrorAction SilentlyContinue) }
  $match = [regex]::Match($text, 'https://[a-zA-Z0-9-]+\.trycloudflare\.com')
  if ($match.Success) { $publicUrl = $match.Value.TrimEnd("/") }
  if ($tunnel.HasExited) {
    throw "cloudflared stopped before creating a public HTTPS URL. See $tunnelErr"
  }
}

if ([string]::IsNullOrWhiteSpace($publicUrl)) {
  Stop-Process -Id $tunnel.Id -Force -ErrorAction SilentlyContinue
  throw "No public HTTPS URL was created by cloudflared within 45 seconds. See $tunnelErr"
}

$env:PUBLIC_ASSET_BASE_URL = $publicUrl
$env:DEFAULT_VIDEO_PROVIDER = "luma"
$env:USE_MOCK_AI = "false"
Set-Content -LiteralPath (Join-Path $runtimeRoot "public_asset_base_url.txt") -Value $publicUrl -Encoding UTF8

$serverArgs = @(
  "-NoProfile",
  "-ExecutionPolicy", "Bypass",
  "-File", (Join-Path $root "start-server.ps1"),
  "-Port", [string]$Port
)
$server = Start-Process powershell -ArgumentList $serverArgs -PassThru -WindowStyle Hidden -RedirectStandardOutput $serverOut -RedirectStandardError $serverErr

Start-Sleep -Seconds 3
$health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health" -Method Get
$providers = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/providers/status" -Method Get

[pscustomobject]@{
  LocalUrl = "http://127.0.0.1:$Port/"
  PublicAssetBaseUrl = $publicUrl
  ServerPid = $server.Id
  TunnelPid = $tunnel.Id
  Health = $health.status
  LumaConfigured = $providers.providers.luma.configured
  LumaReady = $providers.providers.luma.ready
  CloudflaredLog = $tunnelErr
  ServerLog = $serverErr
} | Format-List
