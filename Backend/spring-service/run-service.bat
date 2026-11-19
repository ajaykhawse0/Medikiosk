@echo off
setlocal

echo ====================================================
echo   Starting MediKiosk Spring Service (Java 21)
echo ====================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-service.ps1"

pause
