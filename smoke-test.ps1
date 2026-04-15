param(
  [int]$Port = 8097
)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$server = Start-Process powershell -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-File', (Join-Path $root 'start-server.ps1'),
  '-Port', $Port
) -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 2

try {
  $index = Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/"
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health"
  $pdfOutputPath = Join-Path $root 'smoke-test-output.pdf'

  if ($index.StatusCode -ne 200) { throw 'Index did not respond with 200.' }
  if ($index.Content -notmatch 'RenderAI Studio') { throw 'Index does not contain the expected title.' }
  if ($index.Content -notmatch 'loginForm') { throw 'Login form was not found in the HTML.' }
  if ($index.Content -notmatch 'flowRenderCard') { throw 'Flow selection controls were not found in the HTML.' }
  if ($health.status -ne 'ok') { throw 'Health endpoint did not return ok.' }
  if ($null -eq $health.aiReady) { throw 'Health endpoint did not report aiReady.' }

  $pdfPayload = @{
    title = 'Smoke Test Export'
    summary = 'Smoke test summary.'
    slides = @(
      @{ title = 'Slide 1'; subtitle = 'Intro'; bullets = @('A', 'B') },
      @{ title = 'Slide 2'; subtitle = 'Body'; bullets = @('C', 'D') }
    )
    fileName = 'smoke-test.pdf'
  } | ConvertTo-Json -Depth 8

  Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/export-pdf" -Method Post -ContentType 'application/json' -Body $pdfPayload -OutFile $pdfOutputPath | Out-Null
  $pdfBytes = [System.IO.File]::ReadAllBytes($pdfOutputPath)
  if ($pdfBytes.Length -lt 8) { throw 'PDF export response was empty.' }
  $pdfHeader = [System.Text.Encoding]::ASCII.GetString($pdfBytes[0..7])
  if (-not $pdfHeader.StartsWith('%PDF-1.')) { throw 'PDF export response did not look like a PDF.' }

  Write-Host 'Smoke test passed.'
  Write-Host '- Index served correctly'
  Write-Host '- Login screen is present'
  Write-Host '- Workflow controls are present'
  Write-Host '- Health endpoint responds'
  Write-Host '- Health endpoint reports aiReady'
  Write-Host '- PDF export endpoint generates a PDF'
} finally {
  if (Test-Path -LiteralPath $pdfOutputPath) {
    Remove-Item -LiteralPath $pdfOutputPath -Force
  }
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
