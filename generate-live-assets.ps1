param(
  [string]$OutputDir = (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) "outputs"),
  [int]$Port = 8107
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$referencePath = Join-Path $OutputDir "reference-input.png"
$renderPath = Join-Path $OutputDir "render-output-live.png"
$pdfPath = Join-Path $OutputDir "presentation-live.pdf"
$statusPath = Join-Path $OutputDir "generation-status.json"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
Add-Type -AssemblyName System.Drawing

function Get-ObjectPropertyValue {
  param(
    [Parameter(Mandatory = $true)]$Object,
    [Parameter(Mandatory = $true)][string]$Name,
    $Default = $null
  )

  if ($null -eq $Object) { return $Default }
  $property = $Object.PSObject.Properties[$Name]
  if ($null -eq $property) { return $Default }
  if ($null -eq $property.Value) { return $Default }
  return $property.Value
}

function New-ReferenceImage {
  param([Parameter(Mandatory = $true)][string]$Path)

  $width = 1280
  $height = 800
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = 'AntiAlias'
  $graphics.Clear([System.Drawing.Color]::FromArgb(236, 228, 214))

  $backgroundBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(0, 0, $width, $height), [System.Drawing.Color]::FromArgb(232, 224, 210), [System.Drawing.Color]::FromArgb(198, 184, 165), 90)
  $graphics.FillRectangle($backgroundBrush, 0, 0, $width, $height)
  $backgroundBrush.Dispose()

  $skyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(360, 120, 560, 220), [System.Drawing.Color]::FromArgb(235, 240, 244), [System.Drawing.Color]::FromArgb(201, 215, 220), 90)
  $graphics.FillRectangle($skyBrush, 360, 120, 560, 220)
  $skyBrush.Dispose()

  $floorBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush([System.Drawing.Rectangle]::new(0, 500, $width, 300), [System.Drawing.Color]::FromArgb(120, 112, 102), [System.Drawing.Color]::FromArgb(93, 88, 81), 90)
  $graphics.FillRectangle($floorBrush, 0, 500, $width, 300)
  $floorBrush.Dispose()

  $wallBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(130, 97, 78))
  $graphics.FillRectangle($wallBrush, 0, 120, 220, 430)
  $graphics.FillRectangle($wallBrush, 1060, 120, 220, 430)
  $wallBrush.Dispose()

  function Draw-Column([System.Drawing.Graphics]$TargetGraphics, [int]$X, [int]$Y, [int]$Width, [int]$Height) {
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(173, 164, 150))
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(118, 110, 98), 2)
    $TargetGraphics.FillRectangle($brush, $X, $Y, $Width, $Height)
    for ($index = 0; $index -lt 24; $index += 1) {
      $randomX = $X + (Get-Random -Minimum 0 -Maximum ($Width - 16))
      $randomY = $Y + (Get-Random -Minimum 0 -Maximum ($Height - 16))
      $randomWidth = Get-Random -Minimum 12 -Maximum 28
      $randomHeight = Get-Random -Minimum 12 -Maximum 28
      $color = [System.Drawing.Color]::FromArgb((Get-Random -Minimum 150 -Maximum 195), (Get-Random -Minimum 145 -Maximum 185), (Get-Random -Minimum 132 -Maximum 168))
      $stoneBrush = New-Object System.Drawing.SolidBrush($color)
      $TargetGraphics.FillEllipse($stoneBrush, $randomX, $randomY, $randomWidth, $randomHeight)
      $stoneBrush.Dispose()
    }
    $TargetGraphics.DrawRectangle($pen, $X, $Y, $Width, $Height)
    $brush.Dispose()
    $pen.Dispose()
  }

  Draw-Column $graphics 150 95 55 480
  Draw-Column $graphics 360 95 52 420
  Draw-Column $graphics 868 95 52 420
  Draw-Column $graphics 1075 95 55 480

  $beamBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(113, 72, 42))
  $graphics.FillRectangle($beamBrush, 0, 20, $width, 48)
  $graphics.FillRectangle($beamBrush, 0, 95, $width, 35)
  $graphics.FillRectangle($beamBrush, 230, 165, 820, 28)
  for ($index = 0; $index -lt 11; $index += 1) {
    $graphics.FillRectangle($beamBrush, 80 + ($index * 110), 0, 76, 190)
  }
  $beamBrush.Dispose()

  $counterBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(142, 104, 67))
  $graphics.FillRectangle($counterBrush, 470, 310, 350, 110)
  $counterTopBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(58, 55, 52))
  $graphics.FillRectangle($counterTopBrush, 455, 285, 380, 25)
  $counterTopBrush.Dispose()
  $counterBrush.Dispose()

  for ($index = 0; $index -lt 18; $index += 1) {
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(176, 140, 95), 2)
    $x = 485 + ($index * 18)
    $graphics.DrawLine($pen, $x, 310, $x, 420)
    $pen.Dispose()
  }

  $signBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(238, 230, 206))
  $graphics.FillRectangle($signBrush, 640, 180, 170, 72)
  $font = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold)
  $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(55, 48, 42))
  $graphics.DrawString('COFFEE', $font, $textBrush, 665, 198)
  $font.Dispose()

  function Draw-Chair([System.Drawing.Graphics]$TargetGraphics, [int]$X, [int]$Y, [float]$Scale, [System.Drawing.Color]$Color) {
    $pen = New-Object System.Drawing.Pen($Color, [Math]::Max(2, 2 * $Scale))
    $TargetGraphics.DrawRectangle($pen, $X, $Y, [int](34 * $Scale), [int](28 * $Scale))
    $TargetGraphics.DrawLine($pen, $X, $Y + [int](28 * $Scale), $X - [int](6 * $Scale), $Y + [int](50 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + [int](34 * $Scale), $Y + [int](28 * $Scale), $X + [int](40 * $Scale), $Y + [int](50 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + [int](6 * $Scale), $Y + [int](28 * $Scale), $X + [int](4 * $Scale), $Y + [int](52 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + [int](28 * $Scale), $Y + [int](28 * $Scale), $X + [int](30 * $Scale), $Y + [int](52 * $Scale))
    $pen.Dispose()
  }

  function Draw-RoundTable([System.Drawing.Graphics]$TargetGraphics, [int]$X, [int]$Y, [int]$Radius, [System.Drawing.Color]$Color) {
    $brush = New-Object System.Drawing.SolidBrush($Color)
    $TargetGraphics.FillEllipse($brush, $X, $Y, $Radius, $Radius / 3)
    $TargetGraphics.FillRectangle($brush, $X + ($Radius / 2) - 5, $Y + 10, 10, 34)
    $TargetGraphics.FillEllipse($brush, $X + ($Radius / 2) - 18, $Y + 42, 36, 10)
    $brush.Dispose()
  }

  function Draw-Lounge([System.Drawing.Graphics]$TargetGraphics, [int]$X, [int]$Y, [float]$Scale) {
    $wood = [System.Drawing.Color]::FromArgb(124, 84, 55)
    $fabric = [System.Drawing.Color]::FromArgb(152, 112, 79)
    $pen = New-Object System.Drawing.Pen($wood, [Math]::Max(2, 2 * $Scale))
    $brush = New-Object System.Drawing.SolidBrush($fabric)
    $TargetGraphics.FillRectangle($brush, $X, $Y, [int](54 * $Scale), [int](28 * $Scale))
    $TargetGraphics.FillRectangle($brush, $X + 4, $Y - 18, [int](46 * $Scale), [int](18 * $Scale))
    $TargetGraphics.DrawLine($pen, $X, $Y + [int](28 * $Scale), $X - [int](6 * $Scale), $Y + [int](56 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + [int](54 * $Scale), $Y + [int](28 * $Scale), $X + [int](60 * $Scale), $Y + [int](56 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + 8, $Y + [int](28 * $Scale), $X + 6, $Y + [int](58 * $Scale))
    $TargetGraphics.DrawLine($pen, $X + [int](46 * $Scale), $Y + [int](28 * $Scale), $X + [int](48 * $Scale), $Y + [int](58 * $Scale))
    $pen.Dispose()
    $brush.Dispose()
  }

  Draw-RoundTable $graphics 70 600 120 ([System.Drawing.Color]::FromArgb(37, 37, 37))
  Draw-RoundTable $graphics 1090 600 120 ([System.Drawing.Color]::FromArgb(37, 37, 37))
  Draw-Chair $graphics 68 650 1.4 ([System.Drawing.Color]::FromArgb(50, 50, 50))
  Draw-Chair $graphics 165 650 1.4 ([System.Drawing.Color]::FromArgb(50, 50, 50))
  Draw-Chair $graphics 1088 650 1.4 ([System.Drawing.Color]::FromArgb(50, 50, 50))
  Draw-Chair $graphics 1185 650 1.4 ([System.Drawing.Color]::FromArgb(50, 50, 50))
  Draw-Lounge $graphics 400 470 1.0
  Draw-Lounge $graphics 510 470 1.0
  Draw-Lounge $graphics 620 470 1.0
  Draw-Lounge $graphics 730 470 1.0

  $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(93, 126, 75))
  for ($index = 0; $index -lt 5; $index += 1) {
    $graphics.FillEllipse($greenBrush, 520 + ($index * 45), 210 + (Get-Random -Minimum -8 -Maximum 8), 34, 24)
  }
  $greenBrush.Dispose()

  $font2 = New-Object System.Drawing.Font('Arial', 28, [System.Drawing.FontStyle]::Bold)
  $graphics.DrawString('JUNGLE', $font2, $textBrush, 970, 240)
  $graphics.DrawString('TOURS', $font2, $textBrush, 980, 285)
  $font2.Dispose()
  $textBrush.Dispose()
  $signBrush.Dispose()
  $graphics.Dispose()
  $bitmap.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
  $bitmap.Dispose()
}

function New-LocalFallbackRender {
  param(
    [Parameter(Mandatory = $true)][string]$SourcePath,
    [Parameter(Mandatory = $true)][string]$TargetPath
  )

  $sourceBitmap = [System.Drawing.Bitmap]::FromFile($SourcePath)
  $targetBitmap = New-Object System.Drawing.Bitmap($sourceBitmap.Width, $sourceBitmap.Height)
  $random = [System.Random]::new(42)

  for ($y = 0; $y -lt $sourceBitmap.Height; $y += 1) {
    for ($x = 0; $x -lt $sourceBitmap.Width; $x += 1) {
      $color = $sourceBitmap.GetPixel($x, $y)
      $r = $color.R / 255.0
      $g = $color.G / 255.0
      $b = $color.B / 255.0

      $r = [Math]::Min(1, [Math]::Max(0, (($r - 0.5) * 1.08) + 0.5))
      $g = [Math]::Min(1, [Math]::Max(0, (($g - 0.5) * 1.08) + 0.5))
      $b = [Math]::Min(1, [Math]::Max(0, (($b - 0.5) * 1.08) + 0.5))
      $r = [Math]::Min(1, $r * 1.03)
      $g = [Math]::Min(1, $g * 1.03)
      $b = [Math]::Min(1, $b * 1.03)

      $gray = ($r + $g + $b) / 3.0
      $saturation = 1.06
      $r = [Math]::Min(1, [Math]::Max(0, $gray + (($r - $gray) * $saturation)))
      $g = [Math]::Min(1, [Math]::Max(0, $gray + (($g - $gray) * $saturation)))
      $b = [Math]::Min(1, [Math]::Max(0, $gray + (($b - $gray) * $saturation)))

      $sepiaRed = [Math]::Min(1, (0.393 * $r) + (0.769 * $g) + (0.189 * $b))
      $sepiaGreen = [Math]::Min(1, (0.349 * $r) + (0.686 * $g) + (0.168 * $b))
      $sepiaBlue = [Math]::Min(1, (0.272 * $r) + (0.534 * $g) + (0.131 * $b))
      $r = ($r * 0.92) + ($sepiaRed * 0.08)
      $g = ($g * 0.92) + ($sepiaGreen * 0.08)
      $b = ($b * 0.92) + ($sepiaBlue * 0.08)

      $blend = (($x + $y) / [double]($sourceBitmap.Width + $sourceBitmap.Height))
      $overlayRed = ((255 / 255.0) * (1 - $blend)) + ((71 / 255.0) * $blend)
      $overlayGreen = ((184 / 255.0) * (1 - $blend)) + ((52 / 255.0) * $blend)
      $overlayBlue = ((120 / 255.0) * (1 - $blend)) + ((35 / 255.0) * $blend)
      $alpha = (0.08 * (1 - $blend)) + (0.16 * $blend)
      $r = ($r * (1 - $alpha)) + ($overlayRed * $alpha)
      $g = ($g * (1 - $alpha)) + ($overlayGreen * $alpha)
      $b = ($b * (1 - $alpha)) + ($overlayBlue * $alpha)

      if ($random.NextDouble() -lt 0.008) {
        $grain = if ($random.Next(0, 2) -eq 0) { 0.08 } else { -0.08 }
        $r = [Math]::Min(1, [Math]::Max(0, $r + $grain))
        $g = [Math]::Min(1, [Math]::Max(0, $g + $grain))
        $b = [Math]::Min(1, [Math]::Max(0, $b + $grain))
      }

      $targetBitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb([int]($r * 255), [int]($g * 255), [int]($b * 255)))
    }
  }

  $targetBitmap.Save($TargetPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $sourceBitmap.Dispose()
  $targetBitmap.Dispose()
}

if (-not (Test-Path -LiteralPath $referencePath)) {
  New-ReferenceImage -Path $referencePath
}

$referenceDataUrl = 'data:image/png;base64,' + [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($referencePath))
$server = Start-Process powershell -ArgumentList @(
  '-NoProfile',
  '-ExecutionPolicy', 'Bypass',
  '-File', (Join-Path $root 'start-server.ps1'),
  '-Port', $Port
) -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 2

try {
  $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/health"
  $pdfPayload = @{
    title = 'Presentation Live Demo'
    summary = 'Visible output generated from the local RenderAI Studio backend.'
    slides = @(
      @{ title = 'Portada'; subtitle = 'Proyecto de prueba'; bullets = @('Salida PDF real', 'Backend local') },
      @{ title = 'Contexto'; subtitle = 'Modo desarrollo'; bullets = @('Secretos seguros', 'OpenAI opcional') },
      @{ title = 'Cierre'; subtitle = 'Estado'; bullets = @('Proyecto listo para pruebas humanas') }
    )
    fileName = 'presentation-live.pdf'
  } | ConvertTo-Json -Depth 8

  Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$Port/api/export-pdf" -Method Post -ContentType 'application/json' -Body $pdfPayload -OutFile $pdfPath | Out-Null

  $imagePayload = @{
    prompt = 'Transform this approved architectural reference into a premium warm editorial architectural photograph. Preserve geometry, signage, furniture, and composition exactly.'
    size = '1536x1024'
    images = @($referenceDataUrl)
  } | ConvertTo-Json -Depth 10

  $imageSource = 'local-fallback'
  $providerMessage = ''
  try {
    $result = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/api/generate-render-image" -Method Post -ContentType 'application/json' -Body $imagePayload -TimeoutSec 240
    if ($result.ok -and -not [string]::IsNullOrWhiteSpace($result.imageBase64)) {
      [System.IO.File]::WriteAllBytes($renderPath, [Convert]::FromBase64String($result.imageBase64))
      $imageSource = [string](Get-ObjectPropertyValue -Object $result -Name 'provider' -Default 'openai')
      $providerMessage = [string](Get-ObjectPropertyValue -Object $result -Name 'revisedPrompt' -Default '')
    } else {
      New-LocalFallbackRender -SourcePath $referencePath -TargetPath $renderPath
      $providerMessage = 'The image generation provider did not return imageBase64.'
    }
  } catch {
    New-LocalFallbackRender -SourcePath $referencePath -TargetPath $renderPath
    $providerMessage = if ($_.ErrorDetails -and $_.ErrorDetails.Message) { [string]$_.ErrorDetails.Message } else { $_.Exception.Message }
  }

  @{
    generatedAt = (Get-Date).ToString('o')
    referencePath = $referencePath
    renderPath = $renderPath
    pdfPath = $pdfPath
    imageSource = $imageSource
    aiReady = [bool]$health.aiReady
    secretSource = [string](Get-ObjectPropertyValue -Object $health -Name 'secretSource' -Default 'unknown')
    providerMessage = $providerMessage
  } | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $statusPath -Encoding UTF8

  Write-Host "Reference: $referencePath"
  Write-Host "Render: $renderPath"
  Write-Host "PDF: $pdfPath"
  Write-Host "Status: $statusPath"
} finally {
  if ($server -and -not $server.HasExited) {
    Stop-Process -Id $server.Id -Force
  }
}
