$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$androidRoot = Join-Path $projectRoot "android"
$gradleJdk = "C:\Program Files\Android\Android Studio\jbr"
$sdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk"

if (-not (Test-Path -LiteralPath $gradleJdk)) {
  throw "Android Studio JDK was not found at $gradleJdk"
}

if (-not (Test-Path -LiteralPath $sdkRoot)) {
  throw "Android SDK was not found at $sdkRoot"
}

$env:JAVA_HOME = $gradleJdk
$env:ANDROID_HOME = $sdkRoot
$env:ANDROID_SDK_ROOT = $sdkRoot
$env:PATH = "$gradleJdk\bin;$sdkRoot\platform-tools;$env:PATH"

$sdkDir = $sdkRoot.Replace("\", "/")
Set-Content -LiteralPath (Join-Path $androidRoot "local.properties") -Value "sdk.dir=$sdkDir"

Push-Location $androidRoot
try {
  .\gradlew.bat assembleDebug
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
}
finally {
  Pop-Location
}
