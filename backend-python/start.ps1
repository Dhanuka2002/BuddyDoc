# BuddyDoc Backend - Quick Start Script
# Run this script to set up and start the backend server

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "BuddyDoc Backend - Quick Start" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
Write-Host "Checking Python installation..." -ForegroundColor Yellow
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.11+ from https://www.python.org/" -ForegroundColor Red
    exit 1
}
Write-Host "Found: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Check if virtual environment exists
if (-Not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "Virtual environment created!" -ForegroundColor Green
} else {
    Write-Host "Virtual environment already exists" -ForegroundColor Green
}
Write-Host ""

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to activate virtual environment" -ForegroundColor Red
    Write-Host "You may need to run: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    exit 1
}
Write-Host "Virtual environment activated!" -ForegroundColor Green
Write-Host ""

# Navigate to backend-python directory first
Set-Location -Path "c:\Users\LOQ\Desktop\BuddyDoc\BuddyDoc\backend-python"

# Check if dependencies are installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
$pipList = pip list 2>&1
if ($pipList -notmatch "fastapi") {
    Write-Host "Installing dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Copying .env.example to .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ""
    Write-Host "IMPORTANT: Edit .env file with your credentials before proceeding!" -ForegroundColor Red
    Write-Host "Required credentials:" -ForegroundColor Yellow
    Write-Host "  - Google Cloud Project ID & credentials" -ForegroundColor Yellow
    Write-Host "  - Neo4j Aura connection string" -ForegroundColor Yellow
    Write-Host "  - Firebase Admin SDK credentials" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to open .env file in notepad..." -ForegroundColor Cyan
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    notepad .env
    Write-Host ""
    Write-Host "After saving .env, run this script again to start the server" -ForegroundColor Cyan
    exit 0
} else {
    Write-Host ".env file found" -ForegroundColor Green
}
Write-Host ""

# Test agents before starting server
Write-Host "Testing agents..." -ForegroundColor Yellow
python -m app.test_agents
if ($LASTEXITCODE -ne 0) {
    Write-Host "WARNING: Agent tests failed (this is normal if .env is not configured)" -ForegroundColor Yellow
}
Write-Host ""

# Start the server
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting FastAPI server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor Green
Write-Host "  - API: http://localhost:8000" -ForegroundColor Green
Write-Host "  - Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "  - Health: http://localhost:8000/health/" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
