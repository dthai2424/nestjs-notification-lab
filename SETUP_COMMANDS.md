# Hướng Dẫn Các Lệnh Khởi Tạo Môi Trường & Cài Đặt (NestJS Hands-on Lab)

Tài liệu này tổng hợp toàn bộ các lệnh cần chạy để khởi tạo dự án NestJS, cài đặt thư viện phụ thuộc, khởi chạy cơ sở dữ liệu qua Docker và làm việc với Prisma ORM.

---

## 1. Khởi tạo dự án NestJS

Chạy lệnh tạo dự án NestJS ngay tại thư mục hiện tại:
```bash
nest new .
```
*(Khi được hỏi chọn package manager, chọn `npm`).*

---

## 2. Cài đặt các thư viện NestJS & Tiện ích

Cài đặt các gói hỗ trợ quản lý cấu hình môi trường, xác thực JWT, gửi mail Resend và kiểm thực dữ liệu (Validation):
```bash
npm install @nestjs/config @nestjs/jwt resend class-validator class-transformer
```

---

## 3. Tải & Khởi tạo Prisma ORM (Khóa phiên bản Prisma 5)

> **LƯU Ý QUAN TRỌNG:** Phải cài phiên bản **`prisma@5`** và **`@prisma/client@5`** để dùng cấu trúc truyền thống với **một file duy nhất `prisma/schema.prisma`**. Không cài Prisma bản mới nhất (v7/v8) vì sẽ tự sinh ra `prisma.config.ts` và các thư mục AI skills không cần thiết.

### 3.1. Dọn dẹp file rác nếu đã lỡ chạy bản mới
```bash
rm -rf prisma.config.ts .agents .claude .cursor .devin
```

### 3.2. Cài đặt Prisma CLI và Prisma Client bản 5
```bash
# Cài đặt Prisma CLI bản 5 và ts-node (để chạy file seed.ts)
npm install prisma@5 ts-node --save-dev

# Cài đặt Prisma Client bản 5
npm install @prisma/client@5
```

### 3.3. Khởi tạo cấu hình Prisma (Chỉ tạo duy nhất `prisma/schema.prisma` và `.env`)
```bash
# Khởi tạo thư mục prisma và file schema.prisma chuẩn
npx prisma init
```

> Sau khi init, trong file `package.json`, thêm cấu hình `seed` ở cuối:
> ```json
> "prisma": {
>   "seed": "ts-node prisma/seed.ts"
> }
> ```

---

## 4. Khởi động Cơ sở Dữ liệu với Docker Compose

Tạo file `docker-compose.yml` (nếu chưa có) và khởi động container PostgreSQL 16:
```bash
docker compose up -d
```

*Kiểm tra trạng thái container:*
```bash
docker compose ps
```

---

## 5. Cấu hình biến môi trường (`.env`)

Mở file `.env` và kiểm tra/cập nhật thông số kết nối Database và các biến cần thiết:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/notification_db?schema=public"
JWT_SECRET="super-secret-jwt-key-for-lab"
RESEND_API_KEY="re_sample_key_123"
```

---

## 6. Các lệnh Init Database, Đồng bộ Schema & Seed Dữ liệu (Prisma)

Sau khi đã định nghĩa các bảng trong file `prisma/schema.prisma`:

### 6.1. Init Database & Migration
```bash
# Cách 1: Tạo file migration ban đầu (Khuyến nghị chuẩn NestJS)
npx prisma migrate dev --name init

# Cách 2: Đẩy thẳng cấu trúc schema vào DB (nhanh, không tạo file migration)
npx prisma db push
```

### 6.2. Sinh mã Prisma Client
```bash
# Cập nhật code gợi ý TypeScript cho PrismaClient
npx prisma generate
```

### 6.3. Nạp dữ liệu mẫu (Seed Data)
```bash
# Thực thi nạp dữ liệu mẫu từ prisma/seed.ts vào DB
npx prisma db seed
```

### 6.4. Mở giao diện trực quan Prisma Studio
```bash
# Mở bảng quản trị database trực quan trên trình duyệt (truy cập http://localhost:5555)
npx prisma studio
```
*(Nhấn Ctrl + C trong terminal để thoát Prisma Studio khi xem xong).*

---

## 7. Khởi chạy ứng dụng NestJS

Chạy ứng dụng ở chế độ theo dõi thay đổi (Hot Reload / Watch Mode):
```bash
npm run start:dev
```
Server sẽ chạy tại địa chỉ: `http://localhost:3000`.

---

## 8. Bảng tra cứu lệnh xử lý sự cố (Troubleshooting)

| Tình huống | Lệnh thực hiện |
| :--- | :--- |
| **Xoá trắng DB và migrate/seed lại từ đầu** | `npx prisma migrate reset` |
| **Bắt buộc đồng bộ lại schema khi bị conflict** | `npx prisma db push --force-reset && npx prisma db seed` |
| **Dừng container Database** | `docker compose down` |
| **Xoá sạch cả volume lưu trữ của Database Docker** | `docker compose down -v` |
| **Xem logs container PostgreSQL** | `docker compose logs -f postgres` |
