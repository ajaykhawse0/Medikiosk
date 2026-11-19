# ====================================================================
# MediKiosk — Spring Boot Service Startup Script
# ====================================================================

$ErrorActionPreference = "Stop"
$env:JAVA_TOOL_OPTIONS = "-Duser.timezone=UTC"

# 1. Configure Java 21 environment
$javaHome = "C:\Program Files\Java\jdk-21.0.12.1"
if (Test-Path $javaHome) {
    $env:JAVA_HOME = $javaHome
    $env:PATH = "$javaHome\bin;" + $env:PATH
    Write-Host ">>> Using JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Cyan
} else {
    Write-Host ">>> Using system Java on PATH" -ForegroundColor Yellow
}

# 2. Configure Maven environment
$mavenBin = "C:\Program Files\apache-maven-3.10.1\bin"
if (Test-Path $mavenBin) {
    $env:PATH = "$mavenBin;" + $env:PATH
    Write-Host ">>> Added Maven to PATH: $mavenBin" -ForegroundColor Cyan
}

# 3. Verify tools
Write-Host ">>> Java version:" -ForegroundColor Cyan
java -version

Write-Host "`n>>> Maven version:" -ForegroundColor Cyan
mvn -version

# 4. Navigate to spring-service directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 5. Load .env variables into current process if present
$envFile = Join-Path (Split-Path -Parent $scriptDir) ".env"
if (Test-Path $envFile) {
    Write-Host "`n>>> Loading environment variables from $envFile..." -ForegroundColor Cyan
    Get-Content $envFile | Where-Object { $_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$' } | ForEach-Object {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [System.Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
    }
    Write-Host ">>> .env variables loaded successfully." -ForegroundColor Green
}

# 6. Start Spring Boot application
Write-Host "`n>>> Starting MediKiosk Spring Service (profile: dev)..." -ForegroundColor Green
Write-Host ">>> Swagger UI will be available at: http://localhost:$env:SERVER_PORT/api/v1/swagger-ui.html`n" -ForegroundColor Green

mvn spring-boot:run "-Daether.syncContext.named.factory=noop"
