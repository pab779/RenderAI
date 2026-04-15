param(
  [Parameter(Mandatory = $false)]
  [string]$ApiKey,
  [Parameter(Mandatory = $false)]
  [ValidateSet("openai", "gemini")]
  [string]$Provider = "openai"
)

Add-Type -AssemblyName System.Security

$ErrorActionPreference = "Stop"
$storeRoot = Join-Path $env:APPDATA "RenderAIStudio"
$providerLabel = if ($Provider -eq "gemini") { "Gemini" } else { "OpenAI" }
$envVarName = if ($Provider -eq "gemini") { "GEMINI_API_KEY" } else { "OPENAI_API_KEY" }
$storePath = Join-Path $storeRoot ("{0}_api_key.secure.txt" -f $Provider)
$entropy = [System.Text.Encoding]::UTF8.GetBytes(("RenderAIStudio.{0}Key" -f $providerLabel))

if ([string]::IsNullOrWhiteSpace($ApiKey)) {
  $secureInput = Read-Host "$providerLabel API key" -AsSecureString
} else {
  $secureInput = ConvertTo-SecureString -String $ApiKey -AsPlainText -Force
}

New-Item -ItemType Directory -Force -Path $storeRoot | Out-Null
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureInput)
try {
  $plainText = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  $plainBytes = [System.Text.Encoding]::UTF8.GetBytes($plainText)
  $protectedBytes = [System.Security.Cryptography.ProtectedData]::Protect($plainBytes, $entropy, [System.Security.Cryptography.DataProtectionScope]::CurrentUser)
  $protectedValue = [Convert]::ToBase64String($protectedBytes)
} finally {
  if ($bstr -ne [IntPtr]::Zero) {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
  }
}
Set-Content -LiteralPath $storePath -Value $protectedValue -NoNewline -Encoding UTF8
$ExecutionContext.SessionState.PSVariable.Set("plainText", $plainText)
[System.Environment]::SetEnvironmentVariable($envVarName, $plainText, "Process")

Write-Host "$providerLabel API key stored securely for this Windows user."
Write-Host "Path: $storePath"
Write-Host "Source preference in the app: $envVarName env var, then DPAPI secure file."
