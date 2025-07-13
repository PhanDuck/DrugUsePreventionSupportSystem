# Drug Use Prevention Support System

## Cấu trúc dự án

```
drug-use-prevention-support-system/
├── frontend/          # React/Vite frontend
├── backend/           # Spring Boot backend
├── package.json       # Monorepo configuration
└── README.md
```

## Cách chạy dự án

**📖 Xem hướng dẫn chi tiết: [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### 1. Cài đặt dependencies

```bash
# Cài đặt tất cả dependencies
npm run install:all

# Hoặc cài đặt từng phần
npm install
cd frontend && npm install
cd ../backend && npm install
```

### 2. Chạy frontend (React/Vite)

```bash
# Từ thư mục gốc
npm run dev

# Hoặc từ thư mục frontend
cd frontend
npm run dev
```

### 3. Chạy backend (Spring Boot)

```bash
# Từ thư mục backend
cd backend
./mvnw spring-boot:run
```

## Scripts có sẵn

- `npm run dev` - Chạy frontend development server
- `npm run start:frontend` - Chạy frontend production server
- `npm run build:frontend` - Build frontend
- `npm run install:all` - Cài đặt tất cả dependencies

## Lưu ý quan trọng

1. **Luôn chạy `npm run dev` từ thư mục `drug-use-prevention-support-system`** (không phải từ thư mục gốc)
2. Đảm bảo đã cài đặt Node.js và npm
3. Backend cần Java 17+ và Maven để chạy

## Troubleshooting

Nếu gặp lỗi khi chạy `npm run dev`:
1. Kiểm tra đang ở đúng thư mục `drug-use-prevention-support-system`
2. Chạy `npm run install:all` để cài đặt lại dependencies
3. Xóa `node_modules` và cài đặt lại nếu cần
