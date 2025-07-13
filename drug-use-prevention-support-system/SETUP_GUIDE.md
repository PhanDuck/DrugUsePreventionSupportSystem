# 🚀 Hướng dẫn cài đặt và chạy Frontend

## 📋 Yêu cầu hệ thống

- **Node.js**: Phiên bản 16.0.0 trở lên
- **npm**: Phiên bản 8.0.0 trở lên
- **Git**: Để clone repository

## 🔧 Bước 1: Clone project

```bash
git clone https://github.com/PhanDuck/DrugUsePreventionSupportSystem.git
cd DrugUsePreventionSupportSystem
```

## 📁 Bước 2: Vào đúng thư mục

**QUAN TRỌNG**: Bạn phải vào thư mục `drug-use-prevention-support-system` (không phải thư mục gốc)

```bash
cd drug-use-prevention-support-system
```

Cấu trúc thư mục sẽ như sau:
```
DrugUsePreventionSupportSystem/
└── drug-use-prevention-support-system/  ← VÀO THƯ MỤC NÀY
    ├── frontend/
    ├── backend/
    ├── package.json
    └── README.md
```

## 📦 Bước 3: Cài đặt dependencies

### Cách 1: Cài đặt tất cả cùng lúc
```bash
npm run install:all
```

### Cách 2: Cài đặt từng phần
```bash
# Cài đặt dependencies gốc
npm install

# Cài đặt frontend dependencies
cd frontend
npm install
cd ..
```

## 🎯 Bước 4: Chạy Frontend

### Cách 1: Chạy từ thư mục gốc (khuyến nghị)
```bash
npm run dev
```

### Cách 2: Chạy từ thư mục frontend
```bash
cd frontend
npm run dev
```

### Cách 3: Dùng script PowerShell (Windows)
```powershell
.\start-dev.ps1
```

## ✅ Bước 5: Kiểm tra

Sau khi chạy thành công, bạn sẽ thấy:
- Terminal hiển thị: `Local: http://localhost:5173/`
- Mở trình duyệt và truy cập: `http://localhost:5173`

## 🛠️ Troubleshooting

### Lỗi 1: "npm run dev" không tìm thấy
**Nguyên nhân**: Đang ở sai thư mục
**Giải pháp**: 
```bash
cd drug-use-prevention-support-system
npm run dev
```

### Lỗi 2: "Cannot find module"
**Nguyên nhân**: Chưa cài đặt dependencies
**Giải pháp**:
```bash
npm run install:all
```

### Lỗi 3: Port 5173 đã được sử dụng
**Giải pháp**: 
- Đóng ứng dụng khác đang dùng port 5173
- Hoặc chạy: `npm run dev -- --port 3000`

### Lỗi 4: Node.js version quá cũ
**Giải pháp**: Cập nhật Node.js lên phiên bản 16+ từ https://nodejs.org/

## 📝 Lệnh tóm tắt (Copy & Paste)

```bash
# Clone và setup
git clone https://github.com/PhanDuck/DrugUsePreventionSupportSystem.git
cd DrugUsePreventionSupportSystem/drug-use-prevention-support-system
npm run install:all
npm run dev
```

## 🎉 Thành công!

Nếu mọi thứ hoạt động, bạn sẽ thấy:
- ✅ Terminal hiển thị "Local: http://localhost:5173/"
- ✅ Trình duyệt mở trang web React
- ✅ Không có lỗi trong console

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề, hãy:
1. Kiểm tra Node.js version: `node --version`
2. Kiểm tra npm version: `npm --version`
3. Xóa `node_modules` và cài đặt lại: `rm -rf node_modules && npm install`
4. Liên hệ team lead để được hỗ trợ 