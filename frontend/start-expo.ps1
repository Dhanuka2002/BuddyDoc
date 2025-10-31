# Start Expo Development Server
# This script ensures we're in the correct directory before starting Expo

param(
    [switch]$Web
)

Write-Host "Starting Expo development server..." -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location -Path "c:\Users\LOQ\Desktop\BuddyDoc\BuddyDoc\frontend"

Write-Host "Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

if ($Web) {
    Write-Host "Opening in web browser..." -ForegroundColor Yellow
    npx expo start --web
} else {
    # Start Expo
    Write-Host "Generating QR code..." -ForegroundColor Yellow
    Write-Host "Scan the QR code with Expo Go app on your phone" -ForegroundColor Yellow
    Write-Host ""
    npx expo start
}
