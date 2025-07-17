# Drug Use Prevention Support System - Development Script
# Chạy script này để khởi động dự án

Write-Host "🚀 Khởi động Drug Use Prevention Support System..." -ForegroundColor Green

# Kiểm tra xem có đang ở đúng thư mục không
if (-not (Test-Path "frontend") -or -not (Test-Path "backend")) {
    Write-Host "❌ Lỗi: Không tìm thấy thư mục frontend hoặc backend" -ForegroundColor Red
    Write-Host "Hãy chạy script này từ thư mục drug-use-prevention-support-system" -ForegroundColor Yellow
    exit 1
}

# Kiểm tra Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Lỗi: Node.js chưa được cài đặt" -ForegroundColor Red
    Write-Host "Hãy cài đặt Node.js từ https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Cài đặt dependencies nếu cần
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Cài đặt dependencies..." -ForegroundColor Yellow
    npm install
}

if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "📦 Cài đặt frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Khởi động frontend
Write-Host "🌐 Khởi động frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "✅ Frontend đang chạy tại http://localhost:5173" -ForegroundColor Green
Write-Host "📝 Để chạy backend, mở terminal mới và chạy: cd backend && ./mvnw spring-boot:run" -ForegroundColor Yellow 