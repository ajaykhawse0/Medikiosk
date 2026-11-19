# ====================================================================
# MediKiosk — PostgreSQL Database Initialization Script
# ====================================================================

$ErrorActionPreference = "Stop"

Write-Host ">>> Checking PostgreSQL 18 service status..." -ForegroundColor Cyan

# 1. Start postgres service if not running
$serviceName = "postgresql-x64-18"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -ne "Running") {
        Write-Host ">>> Starting $serviceName service..." -ForegroundColor Yellow
        Start-Service -Name $serviceName
        Write-Host ">>> $serviceName started." -ForegroundColor Green
    } else {
        Write-Host ">>> $serviceName is already running." -ForegroundColor Green
    }
} else {
    Write-Host ">>> Service $serviceName not found via Get-Service. Checking net start..." -ForegroundColor Yellow
    net start postgresql-x64-18 2>$null
}

# 2. Locate psql.exe
$psqlPath = "C:\Program Files\PostgreSQL\18\bin\psql.exe"
if (-not (Test-Path $psqlPath)) {
    $found = Get-Command psql -ErrorAction SilentlyContinue
    if ($found) { $psqlPath = $found.Source }
}

if (-not (Test-Path $psqlPath)) {
    Write-Error "psql.exe not found. Please install PostgreSQL 18 or verify its path."
    exit 1
}

Write-Host ">>> Using psql at: $psqlPath" -ForegroundColor Cyan

# 3. Execute db-init.sql
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$initSql = Join-Path $scriptDir "db-init.sql"

Write-Host ">>> Executing $initSql..." -ForegroundColor Cyan
& $psqlPath -U postgres -h 127.0.0.1 -p 5432 -f $initSql

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n>>> Database initialization completed successfully!" -ForegroundColor Green
    Write-Host ">>> Databases 'medikiosk' and 'medikiosk_dev' are ready." -ForegroundColor Green
    Write-Host ">>> User 'medikiosk' configured with password 'medikioskPostGre'." -ForegroundColor Green
} else {
    Write-Warning "psql exited with code $LASTEXITCODE. If prompted for password, enter your postgres superuser password."
}
