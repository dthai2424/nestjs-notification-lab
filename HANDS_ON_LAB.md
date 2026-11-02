# ỦY BAN NHÂN DÂN THÀNH PHỐ HỒ CHÍ MINH
# TRƯỜNG ĐẠI HỌC SÀI GÒN
## KHOA CÔNG NGHỆ THÔNG TIN
***

<br/>

# BÁO CÁO CUỐI KỲ
## HỌC PHẦN: CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI
### CHUYÊN ĐỀ NGHIÊN CỨU: TÌM HIỂU VỀ CÔNG NGHỆ NESTJS

<br/>

---

# MỤC RIÊNG: TÀI LIỆU HƯỚNG DẪN THỰC HÀNH HANDS-ON LAB
## CHỦ ĐỀ: LÀM CHỦ KIẾN TRÚC LÕI NESTJS VÀ REQUEST LIFECYCLE QUA BÀI TOÁN XÂY DỰNG NOTIFICATION SERVICE (RESEND API & POSTGRESQL)

<br/>

| THÔNG TIN BÁO CÁO VÀ HỌC PHẦN | CHI TIẾT |
| :--- | :--- |
| **Nhóm thực hiện** | Nhóm 15 |
| **Giảng viên hướng dẫn** | ThS. Phạm Thi Vương |
| **Học phần** | Các công nghệ lập trình hiện đại |
| **Thời lượng thực hành bài Lab** | 35 – 45 phút |
| **Chuẩn mực đánh giá** | Khung Rubric Hands-on Lab (Mã D0 – D3, Thang điểm 20) |
| **Danh sách thành viên:** | 3122410001 – Diệp Thụy An<br/>3122410380 – Nguyễn Duy Thái<br/>3122410483 – Nguyễn Tuấn Vũ |

<br/>

**TP. HỒ CHÍ MINH, THÁNG 11 NĂM 2026**

---

<div style="page-break-after: always;"></div>

## QUY CHUẨN ĐỊNH DẠNG VĂN BẢN (TYPOGRAPHY & FORMATTING STANDARDS)
* **Khổ giấy:** A4 (210 mm x 297 mm); Định lề: Lề trên (Top) 2.0 cm, Lề dưới (Bottom) 2.0 cm, Lề trái (Left) 3.0 cm (phục vụ đóng tập/gáy), Lề phải (Right) 2.0 cm.
* **Phông chữ chủ đạo (Typography):** Times New Roman (hoặc Segoe UI/Inter đối với tài liệu số); Màu chữ đen tiêu chuẩn (`#111827`).
* **Hệ thống phân cấp cỡ chữ (Type Hierarchy):**
  - **Tiêu đề Báo cáo / Tiêu đề Mục cấp 1 (H1):** Cỡ chữ 16 pt, In hoa, Đậm (Bold), giãn dòng trước 12 pt, sau 6 pt.
  - **Tiêu đề Mục cấp 2 (H2):** Cỡ chữ 14 pt, Đậm (Bold), giãn dòng trước 8 pt, sau 4 pt.
  - **Tiêu đề Mục cấp 3 (H3):** Cỡ chữ 13 pt, Đậm nghiêng (Bold Italic), giãn dòng trước 6 pt, sau 2 pt.
  - **Nội dung văn bản (Body Text):** Cỡ chữ 13 pt, Kiểu chữ đứng (Regular), giãn dòng (Line Spacing) 1.3 – 1.5 lines, canh đều hai bên (Justified), thụt đầu dòng đoạn văn 1.27 cm.
  - **Bảng biểu & Chú thích (Tables & Captions):** Cỡ chữ 11 – 12 pt, canh giữa. Tiêu đề cột in đậm với nền xám nhạt (`#F3F4F6`).
  - **Mã nguồn (Code Blocks):** Phông chữ đơn cách (Monospace: Consolas / Courier New), cỡ chữ 10.5 – 11 pt, thụt lề chuẩn 2 ký tự (spaces).
* **Văn phong báo cáo:** Văn phong học thuật, khách quan, sử dụng đại từ ngôi thứ ba ("Nhóm nghiên cứu", "Người học", "Hệ thống"); diễn giải tường minh bản chất cơ chế hoạt động, có minh chứng kiểm thử và đối sánh sâu với các mẫu thiết kế hướng đối tượng (OOP/Design Patterns).

---

## MỤC LỤC HANDS-ON LAB
1. **Lý do chọn chủ đề và Mục tiêu học tập (Tiêu chí Rubric D0 - 5 điểm)**
   - 1.1. Bối cảnh kỹ thuật và Lý do lựa chọn đề tài (Vượt qua bẫy CRUD cơ bản)
   - 1.2. Mục tiêu học tập và Năng lực cốt lõi người học đạt được
2. **Điều kiện môi trường và Yêu cầu chuẩn bị trước (Prerequisites)**
   - 2.1. Yêu cầu công cụ và hạ tầng phần mềm
   - 2.2. Tài nguyên dịch vụ bên thứ ba (Resend API & Mock Fallback)
3. **Quy trình triển khai môi trường và Khởi tạo mã nguồn (Starter Code Setup)**
   - 3.1. Các bước chạy lệnh đánh số tuần tự
   - 3.2. Bảng tham chiếu các tham số biến môi trường (.env)
   - 3.3. Cơ chế ánh xạ mạng Docker Compose và Khởi tạo cơ sở dữ liệu với Prisma ORM
4. **Cấu trúc kiến trúc Starter Code và Phân tách thành phần**
   - 4.1. Sơ đồ cây thư mục dự án
   - 4.2. Trách nhiệm của các Module nền tảng được dựng sẵn
5. **Nội dung thực hành chi tiết theo Request Lifecycle (Tiêu chí D1 – D3)**
   - 5.1. **BÀI TẬP 1 (ĐÃ HOÀN THÀNH):** Xây dựng `JwtAuthGuard` bảo vệ route nhạy cảm với `ExecutionContext` và `JwtService`
     - 5.1.1. Bối cảnh nghiệp vụ và Phân tích bản chất cơ chế Guard
     - 5.1.2. Hướng dẫn các bước triển khai chi tiết
     - 5.1.3. Mã nguồn giải pháp thực tế (Source Code Implemented)
     - 5.1.4. Phân tích kỹ thuật chuyên sâu: ExecutionContext, Header Parsing và Declaration Merging
     - 5.1.5. Minh chứng kiểm thử thực nghiệm (Test Cases & Execution Results)
   - 5.2. **BÀI TẬP 2:** Xây dựng `SanitizeContentPipe` làm sạch mã HTML/Script độc hại trong nội dung thông báo
   - 5.3. **BÀI TẬP 3:** Xây dựng `ResponseTimeInterceptor` đo lường độ trễ mạng và chuẩn hóa cấu trúc phản hồi với RxJS
   - 5.4. **BÀI TẬP 4:** Xây dựng `NotificationExceptionFilter` bắt lỗi ngoại vi từ dịch vụ Resend và chuẩn hóa mã HTTP 422
6. **Mục lỗi thường gặp và Bài học kinh nghiệm (Common Pitfalls & Troubleshooting)**
7. **Tổng kết và Tài liệu tham khảo**

---

<div style="page-break-after: always;"></div>

# 1. LÝ DO CHỌN CHỦ ĐỀ VÀ MỤC TIÊU HỌC TẬP (TIÊU CHÍ RUBRIC D0 - 5 ĐIỂM)

### 1.1. Bối cảnh kỹ thuật và Lý do lựa chọn đề tài (Vượt qua bẫy CRUD cơ bản)
Trong hệ sinh thái phát triển ứng dụng Backend trên nền tảng Node.js, NestJS đã định vị là một framework doanh nghiệp (Enterprise-grade Framework) nhờ tích hợp chặt chẽ ngôn ngữ TypeScript, nguyên tắc lập trình hướng đối tượng (OOP) và kiến trúc phân tầng chịu ảnh hưởng sâu sắc từ Angular và Spring Boot. Tuy nhiên, trong quá trình tiếp cận công nghệ, một bộ phận đáng kể lập trình viên thường chỉ dừng lại ở việc áp dụng NestJS để xây dựng các thao tác CRUD (Create - Read - Update - Delete) truyền thống: Controller tiếp nhận request, chuyển giao trực tiếp cho Service để gọi ORM truy vấn cơ sở dữ liệu. Cách tiếp cận này vô tình biến NestJS thành "một lớp vỏ bọc Express bằng Class", làm lu mờ toàn bộ sức mạnh kiến trúc cốt lõi của framework.

Để giải quyết triệt để hạn chế trên, nhóm nghiên cứu lựa chọn chủ đề: **"Xây dựng Notification Service gửi thông báo qua email (sử dụng thư viện Resend API và cơ sở dữ liệu PostgreSQL) nhằm làm chủ kiến trúc lõi và chuỗi vòng đời Request Lifecycle trong NestJS"**. Đề tài này được lựa chọn dựa trên các luận điểm khoa học và thực tiễn sau:

1. **Tính chất đa tầng và tích hợp ngoại vi thực tế:** Một Notification Service không chỉ giao tiếp với cơ sở dữ liệu quan hệ nội bộ (PostgreSQL thông qua Prisma ORM) để quản lý cấu trúc nhóm (`Group`, `GroupMember`), mà còn bắt buộc phải kết nối tới một nền tảng điện toán đám mây bên thứ ba (Third-party Cloud SaaS là Resend Email API). Sự hiện diện của dịch vụ ngoại vi đặt ra bài toán về độ trễ mạng không đồng nhất và nguy cơ lỗi mạng ngoài tầm kiểm soát.
2. **Khám phá trọn vẹn chuỗi Request Lifecycle của NestJS:** Để vận hành một hệ thống gửi thông báo chuyên nghiệp, luồng dữ liệu bắt buộc phải đi qua 4 tầng xử lý độc lập:
   - **Tầng Kiểm soát Quyền truy cập (Guards):** Gửi email hàng loạt cho một nhóm người dùng (`Group Notification`) là tác vụ tiêu tốn tài nguyên và tiềm ẩn nguy cơ lạm dụng/spam. Hệ thống bắt buộc phải kiểm tra căn cước số của người gửi thông qua Token JWT trước khi cho phép dữ liệu đi sâu vào tầng nghiệp vụ.
   - **Tầng Biến đổi và Kiểm duyệt Dữ liệu (Pipes):** Nội dung thông báo do người dùng gửi lên có thể bị chèn các đoạn mã script tấn công (Stored Cross-Site Scripting - XSS) hoặc khoảng trắng bất thường. Việc thanh lọc (Sanitization) dữ liệu cần được thực thi tự động tại tầng Pipe trước khi chạm tới Controller.
   - **Tầng Quan sát và Chuẩn hóa (Interceptors):** Việc gọi API ra bên ngoài (Resend) làm phát sinh độ trễ dao động (từ 200ms đến hàng giây). Áp dụng Interceptor kết hợp lập trình phản ứng với RxJS (Reactive Extensions) cho phép đo đạc thời gian thực thi (Latency Tracking) và bọc dữ liệu trả về theo định dạng thống nhất mà không làm phân mảnh mã nguồn Service.
   - **Tầng Xử lý Ngoại lệ Tập trung (Exception Filters):** Khi Resend API phản hồi lỗi (sai API key, vượt hạn ngạch gửi mail, domain chưa được xác thực DNS), nếu để ngoại lệ văng ra tự do, NestJS sẽ ném mã lỗi `500 Internal Server Error` làm lộ cấu trúc nội bộ của máy chủ. Cần một Exception Filter cô lập lỗi ngoại vi và chuyển hóa thành định dạng `422 Unprocessable Entity` rõ ràng cho phía Client.

### 1.2. Mục tiêu học tập và Năng lực cốt lõi người học đạt được
Sau khi hoàn thành bài thực hành Hands-on Lab trong khoảng thời gian từ 35 đến 45 phút, người học sẽ được trang bị các năng lực cụ thể sau:
* **Về mặt tư duy kiến trúc:** Nắm vững sơ đồ tuần tự thực thi của một HTTP Request trong NestJS: `Client Request` → `Guard (CanActivate)` → `Interceptor (Pre-handler)` → `Pipe (PipeTransform)` → `Controller` → `Service & 3rd-party API` → `Exception Filter` → `Interceptor (Post-handler / RxJS)` → `HTTP Response`.
* **Về kỹ năng lập trình:**
  1. Tự tay thiết kế và triển khai `JwtAuthGuard` kế thừa giao diện `CanActivate`, sử dụng thuần thục đối tượng trừu tượng `ExecutionContext`, trích xuất `Authorization: Bearer <token>` từ HTTP Headers, giải mã xác thực bằng `JwtService.verifyAsync()` và ứng dụng kỹ thuật TypeScript Declaration Merging để gắn payload vào `request.user`.
  2. Xây dựng Custom `PipeTransform` thực hiện làm sạch dữ liệu đầu vào bằng Regular Expressions kết hợp cắt tỉa khoảng trắng.
  3. Áp dụng `NestInterceptor` và toán tử RxJS `map()` để can thiệp hai chiều vào luồng Observable, đo lường thời gian thực thi API tính bằng mili-giây (`ms`).
  4. Cấu hình `ExceptionFilter` với decorator `@Catch()` để phân loại chính xác giữa `HttpException` nội bộ và lỗi ngoại vi từ thư viện bên ngoài.

---

<div style="page-break-after: always;"></div>

# 2. ĐIỀU KIỆN MÔI TRƯỜNG VÀ YÊU CẦU CHUẨN BỊ TRƯỚC (PREREQUISITES)

### 2.1. Yêu cầu công cụ và hạ tầng phần mềm
Để đảm bảo toàn bộ tiến trình thực hành diễn ra liên tục, không phát sinh xung đột phần mềm hoặc sai lệch môi trường, máy trạm của người học cần đáp ứng các điều kiện sau:

| STT | Tên công cụ / Nền tảng | Phiên bản tối thiểu yêu cầu | Vai trò trong bài thực hành |
| :---: | :--- | :--- | :--- |
| 1 | **Node.js** | Phiên bản ≥ v18.x (Khuyến nghị **v20.x** hoặc **v22.x LTS**) | Nền tảng thực thi JavaScript/TypeScript phía máy chủ |
| 2 | **npm** | Phiên bản ≥ v9.x (Đi kèm sẵn cùng Node.js) | Trình quản lý các gói thư viện phụ thuộc |
| 3 | **Docker Desktop / Engine** | Docker Engine ≥ 24.x & Docker Compose v2.x | Ảo hóa và chạy container cơ sở dữ liệu PostgreSQL 16 |
| 4 | **Trình soạn thảo mã (IDE)** | Visual Studio Code / Cursor IDE | Không gian soạn thảo mã nguồn và gỡ lỗi |
| 5 | **Tiện ích mở rộng VS Code** | **REST Client** (của tác giả Huachao Mao) | Thực thi các kịch bản gọi API kiểm thử từ tệp `.http` |

### 2.2. Tài nguyên dịch vụ bên thứ ba (Resend API & Mock Fallback)
* **Khóa xác thực Resend API (Tùy chọn):** Người học có thể đăng ký một tài khoản miễn phí tại trang chủ [https://resend.com](https://resend.com) để tạo khóa API cá nhân (có định dạng bắt đầu bằng `re_...`).
* **Cơ chế Mô phỏng An toàn (Simulation Mock Mode):** Nhằm ngăn chặn triệt để tình huống người học bị ngắt quãng tiến độ bài lab do không có tài khoản Resend, chưa xác thực thẻ ngân hàng, hoặc mạng Internet gặp sự cố chặn cổng gửi mail, mã nguồn khởi đầu (Starter Code) được thiết kế cơ chế Fallback tự động:
  > *Nếu biến môi trường `RESEND_API_KEY` bị bỏ trống hoặc giữ nguyên giá trị mẫu `re_sample_key_123`, `MailService` sẽ tự động kích hoạt Simulation Mode: in thông báo log trực quan trên Console, tạo độ trễ giả lập 200 ms tương đương độ trễ mạng thực tế và trả về kết quả gửi thư thành công với mã định danh giả lập `mock_email_...`.*

---

# 3. QUY TRÌNH TRIỂN KHAI MÔI TRƯỜNG VÀ KHỞI TẠO MÃ NGUỒN (STARTER CODE SETUP)

### 3.1. Các bước chạy lệnh đánh số tuần tự
Nhóm nghiên cứu đã chuẩn bị sẵn bộ mã nguồn khởi tạo (Starter Code) bao gồm toàn bộ các định nghĩa cơ sở dữ liệu, container Docker và các lớp vận chuyển dữ liệu (DTOs). Người học chỉ cần thực thi tuần tự 5 bước lệnh dưới đây trong Terminal tại thư mục dự án:

```bash
# ==============================================================================
# BƯỚC 1: KHỞI ĐỘNG CƠ SỞ DỮ LIỆU POSTGRESQL THÔNG QUA DOCKER COMPOSE
# ==============================================================================
docker compose up -d

# Lệnh kiểm tra trạng thái container (đảm bảo trạng thái 'Up' trên cổng 5432):
docker compose ps
```

```bash
# ==============================================================================
# BƯỚC 2: ĐỒNG BỘ CẤU TRÚC SCHEMA VÀO DATABASE VÀ SINH PRISMA CLIENT
# ==============================================================================
# Đẩy trực tiếp các model User, Group, GroupMember vào CSDL PostgreSQL
npx prisma db push

# Tạo mã nguồn TypeScript định kiểu an toàn cho thư viện @prisma/client
npx prisma generate
```

```bash
# ==============================================================================
# BƯỚC 3: NẠP DỮ LIỆU MẪU BAN ĐẦU VÀO CƠ SỞ DỮ LIỆU (DATABASE SEEDING)
# ==============================================================================
# Chạy tệp kịch bản prisma/seed.ts nạp sẵn nhóm DEV_TEAM và các người dùng mẫu
npx prisma db seed
```
> **Thông báo kỳ vọng trên Terminal sau khi hoàn thành Bước 3:**
> ```text
> 🌱 Starting seed database...
> ✅ Seed database finished successfully!
> - Created Group: DEV_TEAM (Members: alice@example.com, bob@example.com)
> - Created Group: MARKETING (Members: charlie@example.com)
> ```

```bash
# ==============================================================================
# BƯỚC 4: (TÙY CHỌN) KIỂM TRA TRỰC QUAN CƠ SỞ DỮ LIỆU BẰNG PRISMA STUDIO
# ==============================================================================
# Mở bảng quản trị dữ liệu trực quan trên giao diện Web (Cổng http://localhost:5555)
npx prisma studio
# (Nhấn tổ hợp phím Ctrl + C để dừng Prisma Studio sau khi kiểm tra xong)
```

```bash
# ==============================================================================
# BƯỚC 5: KHỞI CHẠY ỨNG DỤNG NESTJS Ở CHẾ ĐỘ THEO DÕI THỜI GIAN THỰC (WATCH MODE)
# ==============================================================================
npm run start:dev
```
> **Kết quả xác nhận:** Khi dòng thông báo `[Bootstrap] 🚀 Ứng dụng Notification Lab đang chạy tại: http://localhost:3000` xuất hiện, môi trường đã hoàn toàn sẵn sàng cho việc lập trình thực hành.

### 3.2. Bảng tham chiếu các tham số biến môi trường (.env)
Tệp cấu hình môi trường `.env` được đặt tại thư mục gốc dự án với nội dung chuẩn hóa:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/notification_db?schema=public"
JWT_SECRET="super-secret-jwt-key-for-lab"
RESEND_API_KEY="re_sample_key_123"
```

| Tên biến môi trường | Giá trị cấu hình mẫu | Ý nghĩa kỹ thuật |
| :--- | :--- | :--- |
| `PORT` | `3000` | Cổng tiếp nhận lưu lượng HTTP Request của máy chủ NestJS |
| `DATABASE_URL` | `postgresql://postgres:...` | Chuỗi kết nối mạng trực tiếp tới container PostgreSQL của Docker |
| `JWT_SECRET` | `super-secret-jwt-key-for-lab` | Khóa bí mật dùng để ký và giải mã chữ ký điện tử JSON Web Token |
| `RESEND_API_KEY` | `re_sample_key_123` | Khóa xác thực truy cập dịch vụ Resend Cloud API |

---

<div style="page-break-after: always;"></div>

# 4. CẤU TRÚC KIẾN TRÚC STARTER CODE VÀ PHÂN TÁCH THÀNH PHẦN

### 4.1. Sơ đồ cây thư mục dự án
Mã nguồn dự án được tổ chức khoa học theo mô hình Modular Design chuẩn mực của NestJS:

```text
hands-on-lab/
├── docker-compose.yml              # Khai báo dịch vụ cơ sở dữ liệu PostgreSQL 16
├── .env                            # Lưu trữ biến môi trường bảo mật
├── prisma/
│   ├── schema.prisma               # Định nghĩa Schema ORM: User, Group, GroupMember
│   └── seed.ts                     # Kịch bản nạp dữ liệu mẫu ban đầu
├── test-requests.http              # Tập hợp các kịch bản kiểm thử API định dạng HTTP
└── src/
    ├── app.module.ts               # Root Module liên kết các phân hệ
    ├── main.ts                     # Điểm khởi tạo ứng dụng, cấu hình ValidationPipe
    ├── prisma/                     # Đóng gói kết nối CSDL (PrismaModule & PrismaService)
    │   ├── prisma.module.ts
    │   └── prisma.service.ts
    ├── mail/                       # Tầng hạ tầng gửi mail (MailModule & MailService)
    │   ├── mail.module.ts
    │   └── mail.service.ts
    ├── auth/                       # Phân hệ cấp phát Token phục vụ kiểm thử bài lab
    │   ├── auth.module.ts
    │   ├── auth.service.ts
    │   └── auth.controller.ts      # Endpoint POST /auth/login sinh JWT token
    └── notifications/              # KHÔNG GIAN BÀI TẬP THỰC HÀNH CỦA HỌC VIÊN
        ├── dto/
        │   ├── send-user.dto.ts    # DTO kiểm thực thông tin gửi mail cá nhân
        │   └── send-group.dto.ts   # DTO kiểm thực thông tin gửi mail theo nhóm
        ├── guards/
        │   └── jwt-auth.guard.ts   # [BÀI TẬP 1] - Xây dựng Guard bảo vệ xác thực
        ├── pipes/
        │   └── sanitize-content.pipe.ts # [BÀI TẬP 2] - Xây dựng Pipe thanh lọc dữ liệu
        ├── interceptors/
        │   └── response-time.interceptor.ts # [BÀI TẬP 3] - Xây dựng Interceptor đo độ trễ
        ├── filters/
        │   └── notification-exception.filter.ts # [BÀI TẬP 4] - Xây dựng Exception Filter
        ├── notifications.service.ts    # Thực thi logic nghiệp vụ và phối hợp dữ liệu
        ├── notifications.controller.ts # Điều phối HTTP, gắn kết Guard, Pipe, Interceptor
        └── notifications.module.ts
```

### 4.2. Trách nhiệm của các Module nền tảng được dựng sẵn
1. **`PrismaModule` (`src/prisma/`):** Khởi tạo kết nối tới cơ sở dữ liệu PostgreSQL thông qua vòng đời `OnModuleInit` và tự động giải phóng tài nguyên ở `OnModuleDestroy`. Được gắn decorator `@Global()` để cung cấp `PrismaService` cho toàn bộ ứng dụng mà không cần khai báo lặp lại.
2. **`MailModule` (`src/mail/`):** Chịu trách nhiệm tương tác trực tiếp với SDK `resend`. Tự động nhận diện cấu hình môi trường để chuyển đổi giữa gửi thư thực tế qua Resend hoặc kích hoạt chế độ mô phỏng (`Simulation Mode`).
3. **`AuthModule` (`src/auth/`):** Cung cấp API `POST /auth/login` cho phép người học đăng nhập nhanh bằng email để nhận một chuỗi JSON Web Token hợp lệ (ký bằng thuật toán HS256 với thời hạn 1 ngày), đóng vai trò cung cấp dữ liệu đầu vào cho bài tập Guard.
4. **`NotificationsService` (`src/notifications/`):** Đã được cài đặt sẵn logic truy vấn cơ sở dữ liệu để tìm kiếm danh sách email của toàn bộ thành viên trong nhóm (`prisma.group.findUnique`), sau đó kích hoạt dịch vụ gửi mail tương ứng.

---

<div style="page-break-after: always;"></div>

# 5. NỘI DUNG THỰC HÀNH CHI TIẾT THEO REQUEST LIFECYCLE (TIÊU CHÍ D1 – D3)

---

## 5.1. BÀI TẬP 1 (ĐÃ HOÀN THÀNH): XÂY DỰNG `JwtAuthGuard` BẢO VỆ ROUTE NHẠY CẢM VỚI `ExecutionContext` VÀ `JwtService`

### 5.1.1. Bối cảnh nghiệp vụ và Phân tích bản chất cơ chế Guard
Trong các hệ thống phân tán và ứng dụng Web hiện đại, việc bảo vệ các tài nguyên nhạy cảm là yêu cầu tối quan trọng. Đối với hệ thống Notification API, hai endpoint:
* `POST /notifications/user` (Gửi thông báo cá nhân)
* `POST /notifications/group` (Gửi thông báo số lượng lớn cho cả nhóm người dùng)

tiềm ẩn rủi ro rất lớn nếu bị truy cập nặc danh (Anonymous Access). Kẻ xấu có thể lợi dụng endpoint này để gửi thư rác (spam), làm cạn kiệt hạn ngạch gửi thư của tài khoản Resend hoặc giả mạo thông báo của hệ thống. Do đó, yêu cầu đặt ra là: **Bắt buộc người gửi phải có phiên đăng nhập hợp lệ thông qua cơ chế Bearer Token (JWT)**.

Trong kiến trúc NestJS, **Guard** là thành phần chịu trách nhiệm xác định xem một request có được phép tiếp tục thực thi bởi Route Handler hay không. Khác với Middleware truyền thống trong Express (chỉ có quyền truy cập vào `req`, `res`, `next` mà không nắm được ngữ cảnh phương thức nào sẽ được gọi tiếp theo), Guard có quyền truy cập trực tiếp vào đối tượng **`ExecutionContext`**. Nhờ đó, Guard biết chính xác Controller và Handler mục tiêu, đồng thời có thể tận dụng toàn bộ sức mạnh của Dependency Injection từ NestJS IoC Container.

### 5.1.2. Hướng dẫn các bước triển khai chi tiết
Người học thực hiện xây dựng `JwtAuthGuard` theo quy trình chuẩn:
* **Bước 1:** Khởi tạo lớp `JwtAuthGuard` kế thừa giao diện `CanActivate` và gắn decorator `@Injectable()`.
* **Bước 2:** Tiêm phụ thuộc (Inject) `JwtService` và `ConfigService` thông qua Constructor Injection.
* **Bước 3:** Cài đặt phương thức `canActivate(context: ExecutionContext): Promise<boolean>`:
  - Chuyển đổi ngữ cảnh sang HTTP: `const request = context.switchToHttp().getRequest<Request>();`.
  - Trích xuất tiêu đề `authorization` từ `request.headers`.
  - Kiểm tra điều kiện tiên quyết: Nếu không tồn tại tiêu đề hoặc tiêu đề không bắt đầu bằng tiền tố `"Bearer "`, ném ngoại lệ `new UnauthorizedException('Token không tồn tại')`.
  - Tách chuỗi để lấy token độc lập bằng cú pháp Destructuring: `const [type, token] = authHeader.split(' ');`.
  - Xác thực và giải mã chữ ký số: Sử dụng hàm bất đồng bộ `await this.jwtService.verifyAsync(token, { secret: ... })`. Nếu chữ ký sai hoặc token hết hạn, `JwtService` sẽ tự động quăng lỗi, Guard sẽ chặn đứng request.
  - Gắn dữ liệu định danh người dùng vào ngữ cảnh yêu cầu: `request.user = payload;`.
  - Trả về `true` để cấp quyền cho request đi tiếp vào Pipe và Controller.
* **Bước 4:** Gắn decorator `@UseGuards(JwtAuthGuard)` lên các phương thức `sendToUser` và `sendToGroup` trong `NotificationsController`.

### 5.1.3. Mã nguồn giải pháp thực tế (Source Code Implemented)

Dưới đây là mã nguồn hoàn chỉnh đã được người học hiện thực và kiểm chứng trong tệp `src/notifications/guards/jwt-auth.guard.ts`:

```typescript
// =============================================================================
// TỆP TIN: src/notifications/guards/jwt-auth.guard.ts
// MÔ TẢ: Guard kiểm soát xác thực JWT, bảo vệ các endpoint gửi thông báo
// =============================================================================
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Chuyển đổi ngữ cảnh thực thi sang ngữ cảnh HTTP và lấy đối tượng Request của Express
    const request = context.switchToHttp().getRequest<Request>();

    // 2. Trích xuất tiêu đề authorization từ HTTP Headers gửi lên từ Client
    const authHeader = request.headers.authorization;

    // 3. Kiểm tra sự tồn tại của Token và cấu trúc định dạng chuẩn Bearer Token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    // 4. Phân tách chuỗi để trích xuất phần giá trị Token: "Bearer <token>" -> token
    const [type, token] = authHeader.split(' ');

    // 5. Kiểm tra tính toàn vẹn và giải mã Token bất đồng bộ bằng JwtService
    // Nếu token giả mạo, sai chữ ký hoặc hết hạn, verifyAsync sẽ ném ngoại lệ
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // 6. Gán payload đã giải mã vào thuộc tính request.user để các tầng Controller/Service sử dụng
    // Kỹ thuật này tận dụng TypeScript Declaration Merging để mở rộng giao diện Express.Request
    request['user'] = payload;

    // 7. Xác thực thành công -> Cấp phép cho request đi tiếp vào Request Pipeline
    return true;
  }
}
```

Tại tệp điều phối `src/notifications/notifications.controller.ts`, lớp Guard được kích hoạt trên các endpoint nghiệp vụ:

```typescript
// =============================================================================
// TRÍCH ĐOẠN TỆP TIN: src/notifications/notifications.controller.ts
// =============================================================================
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('user')
  @UseGuards(JwtAuthGuard) // <-- Kích hoạt bảo vệ bằng JwtAuthGuard
  async sendToUser(@Body() body: SendUserDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToUser(body, sender);
  }

  @Post('group')
  @UseGuards(JwtAuthGuard) // <-- Kích hoạt bảo vệ bằng JwtAuthGuard
  async sendToGroup(@Body() body: SendGroupDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToGroup(body, sender);
  }
}
```

### 5.1.4. Phân tích kỹ thuật chuyên sâu (In-depth Technical Analysis)
1. **Bản chất của `ExecutionContext`:** `ExecutionContext` là lớp trừu tượng hóa mạnh mẽ của NestJS, kế thừa từ `ArgumentsHost`. Nó cho phép mã nguồn Guard hoạt động nhất quán mà không bị ràng buộc cứng vào một giao thức duy nhất. Khi thực hiện `context.switchToHttp()`, NestJS cung cấp các phương thức trợ giúp chuyên biệt (`getRequest()`, `getResponse()`) dành riêng cho ứng dụng HTTP RESTful API.
2. **Trích xuất Header và Chuẩn RFC 6750:** Việc kiểm tra tiền tố `authHeader.startsWith('Bearer ')` tuân thủ nghiêm ngặt tiêu chuẩn RFC 6750 về việc truyền tải Bearer Token qua tiêu đề HTTP Authorization. Phép tách chuỗi `authHeader.split(' ')` đảm bảo loại bỏ từ khóa giao thức và trích xuất nguyên vẹn phần thân mã hóa Base64URL của JWT.
3. **Cơ chế TypeScript Declaration Merging:** Mặc định trong thư viện kiểu `@types/express`, giao diện `Request` không định nghĩa trường dữ liệu `user`. Khi lập trình viên gán giá trị `request['user'] = payload`, đối tượng `user` sẽ được truyền tải xuyên suốt vòng đời request, cho phép các Controller Handler sau đó đọc được thông tin người gửi (`req['user'].email`) một cách minh bạch mà không cần truy vấn lại cơ sở dữ liệu.

### 5.1.5. Minh chứng kiểm thử thực nghiệm (Test Cases & Execution Results)
Quá trình kiểm thử được thực hiện thông qua tệp kịch bản `test-requests.http`:

#### Trường hợp 1: Truy cập không gửi kèm Token xác thực
* **Yêu cầu HTTP (Request):**
  ```http
  POST http://localhost:3000/notifications/user
  Content-Type: application/json

  {
    "to": "bob@example.com",
    "subject": "Test Guard: Không kèm token",
    "content": "Email này sẽ bị chặn bởi JwtAuthGuard!"
  }
  ```
* **Phản hồi từ máy chủ (Response - HTTP 401 Unauthorized):**
  ```json
  {
    "statusCode": 401,
    "message": "Token không tồn tại",
    "error": "Unauthorized"
  }
  ```
  > *Nhận xét:* `JwtAuthGuard` đã phát hiện tiêu đề Authorization bị thiếu và chủ động ngắt luồng xử lý ngay tại cổng vào, ném lỗi 401 chuẩn mực.

#### Trường hợp 2: Đăng nhập lấy Token và gửi yêu cầu hợp lệ
* **Bước 1: Khởi tạo phiên đăng nhập:**
  ```http
  POST http://localhost:3000/auth/login
  Content-Type: application/json

  {
    "email": "alice@example.com",
    "name": "Alice Johnson"
  }
  ```
  *Kết quả trả về Token:*
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJuYW1lIjoiQWxpY2UgSm9obnNvbiIsImlhdCI6MTc2MTgzMzg5MiwiZXhwIjoxNzYxOTIwMjkyfQ...",
    "user": {
      "sub": 1,
      "email": "alice@example.com",
      "name": "Alice Johnson"
    }
  }
  ```

* **Bước 2: Gửi thông báo kèm Bearer Token:**
  ```http
  POST http://localhost:3000/notifications/user
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json

  {
    "to": "bob@example.com",
    "subject": "Test Guard: Kèm token hợp lệ",
    "content": "Chúc mừng bạn đã vượt qua JwtAuthGuard!"
  }
  ```
* **Phản hồi từ máy chủ (Response - HTTP 200 OK):**
  ```json
  {
    "type": "SINGLE",
    "sender": "alice@example.com",
    "recipient": "bob@example.com",
    "subject": "Test Guard: Kèm token hợp lệ",
    "deliveryResult": {
      "id": "mock_email_1761834012450",
      "from": "onboarding@resend.dev",
      "to": "bob@example.com",
      "subject": "Test Guard: Kèm token hợp lệ",
      "status": "delivered",
      "simulated": true
    }
  }
  ```
  > *Nhận xét:* Token hợp lệ đã được giải mã chính xác. Thuộc tính `sender` trong dữ liệu trả về thể hiện đúng danh tính `alice@example.com` lấy từ payload của Token, chứng minh Guard đã hoàn thành xuất sắc nhiệm vụ bảo vệ và truyền tải thông tin định danh.

---

<div style="page-break-after: always;"></div>

## 5.2. BÀI TẬP 2: XÂY DỰNG `SanitizeContentPipe` LÀM SẠCH MÃ HTML/SCRIPT ĐỘC HẠI

### 5.2.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Ngăn chặn nguy cơ tấn công Stored XSS khi người gửi chèn các đoạn mã JavaScript nguy hiểm dạng `<script>alert('hack')</script>` vào nội dung email.
* **Nhiệm vụ:**
  - Hoàn thiện tệp `src/notifications/pipes/sanitize-content.pipe.ts` kế thừa giao diện `PipeTransform`.
  - Kiểm tra nếu `value` có trường `content`: dùng Regular Expression loại bỏ toàn bộ thẻ `<script>`, thực hiện `trim()` khoảng trắng ở 2 đầu chuỗi.
  - Nếu sau khi lọc mà nội dung bị rỗng, ném `new BadRequestException('Nội dung email không được để trống sau khi làm sạch')`.
  - Luôn đảm bảo trả về (`return value`) đối tượng đã làm sạch.
  - Gắn `@UsePipes(new SanitizeContentPipe())` vào Controller.

---

## 5.3. BÀI TẬP 3: XÂY DỰNG `ResponseTimeInterceptor` ĐO LƯỜNG ĐỘ TRỄ MẠNG VỚI RXJS

### 5.3.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Dịch vụ Resend gửi mail qua mạng có độ trễ dao động. Cần đo lường thời gian thực thi của endpoint và chuẩn hóa mọi kết quả phản hồi theo định dạng: `{ success: true, duration: "XXXms", data: ... }`.
* **Nhiệm vụ:**
  - Hoàn thiện tệp `src/notifications/interceptors/response-time.interceptor.ts` kế thừa `NestInterceptor`.
  - Ghi nhận mốc thời gian bắt đầu: `const now = Date.now();`.
  - Sử dụng toán tử `map()` trong thư viện `rxjs/operators` để biến đổi luồng dữ liệu trả về từ `next.handle()`.
  - Tính toán chênh lệch thời gian `duration = Date.now() - now` và bọc dữ liệu trả về.
  - Gắn `@UseInterceptors(ResponseTimeInterceptor)` ở cấp Controller.

---

## 5.4. BÀI TẬP 4: XÂY DỰNG `NotificationExceptionFilter` BẮT LỖI NGOẠI VI AN TOÀN

### 5.4.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Khi SDK Resend ném ra lỗi (API key không đúng, email người nhận không hợp lệ), máy chủ NestJS không được crash hay trả về lỗi `500 Internal Server Error`, mà phải trả về mã `422 Unprocessable Entity` với định dạng JSON chuẩn mực.
* **Nhiệm vụ:**
  - Hoàn thiện tệp `src/notifications/filters/notification-exception.filter.ts` với decorator `@Catch()`.
  - Phân loại lỗi: Giữ nguyên các ngoại lệ `HttpException` thông thường; đối với các đối tượng `Error` ngoại vi từ Resend, đặt mã trạng thái HTTP là `422`.
  - Trả về cấu trúc JSON gồm: `statusCode`, `timestamp`, `path`, `error`, `message`.
  - Gắn `@UseFilters(NotificationExceptionFilter)` ở cấp Controller.

---

<div style="page-break-after: always;"></div>

# 6. MỤC LỖI THƯỜNG GẶP VÀ BÀI HỌC KINH NGHIỆM (COMMON PITFALLS & TROUBLESHOOTING)

Trong quá trình nghiên cứu, xây dựng và tự thực hành kiểm thử bài lab, nhóm nghiên cứu đã ghi nhận và đúc kết các lỗi kỹ thuật phổ biến sau:

| STT | Hiện tượng lỗi (Symptom) | Nguyên nhân gốc rễ (Root Cause) | Giải pháp xử lý triệt để (Solution) |
| :---: | :--- | :--- | :--- |
| 1 | `Nest can't resolve dependencies of the JwtAuthGuard (?)` | `NotificationsModule` chưa nhập khẩu `AuthModule` hoặc `AuthModule` chưa xuất khẩu `JwtModule`. | Kiểm tra tại `src/auth/auth.module.ts` đảm bảo đã khai báo `exports: [JwtModule]`, đồng thời tại `notifications.module.ts` phải có `imports: [AuthModule]`. |
| 2 | Lỗi `401 Unauthorized` dù Client đã gửi Header | Header trong môi trường HTTP Node.js/Express mặc định chuyển về chữ thường (`authorization`). Nếu đọc bằng `request.headers['Authorization']` hoa ký tự đầu có thể bị `undefined`. | Luôn truy xuất tiêu đề bằng cú pháp an toàn: `request.headers.authorization`. |
| 3 | Lỗi biên dịch TypeScript `TS2883: The inferred type cannot be named` | TypeScript ở chế độ kiểm tra nghiêm ngặt không thể tự động suy luận kiểu trả về của các phương thức Service liên quan tới kiểu nội bộ của thư viện `resend`. | Thêm tường minh kiểu trả về cho phương thức: `async sendToUser(...): Promise<any>`. |
| 4 | Yêu cầu bị treo vô hạn (Hanging Request) khi sử dụng Interceptor | Lập trình viên gọi `next.handle().pipe(...)` nhưng quên từ khóa `return`. | Interceptor hoạt động theo mô hình luồng Reactive Streams (RxJS). Bắt buộc phải trả về Observable: `return next.handle().pipe(...)`. |
| 5 | Controller nhận giá trị Body là `undefined` sau khi gắn Pipe | Phương thức `transform(value)` trong Custom Pipe thực hiện xử lý nhưng quên trả về dữ liệu. | Giá trị trả về từ hàm `transform` chính là tham số truyền vào Handler. Bắt buộc phải kết thúc bằng lệnh `return value;`. |

---

# 7. TỔNG KẾT VÀ TÀI LIỆU THAM KHẢO

Bài thực hành Hands-on Lab về **Notification Service** đã chứng minh tính ưu việt và sự chặt chẽ trong kiến trúc phân tầng của NestJS. Thông qua việc tự tay triển khai thành công `JwtAuthGuard` và hiểu sâu sắc chuỗi vòng đời **Request Lifecycle**, người học không chỉ nâng cao kỹ năng lập trình hướng đối tượng với TypeScript mà còn hình thành tư duy xây dựng các hệ thống dịch vụ Backend quy mô doanh nghiệp an toàn, có khả năng mở rộng và dễ bảo trì.

### Tài liệu tham khảo:
1. **NestJS Official Documentation:** *Guards, ExecutionContext, Request Lifecycle & Interceptors*, truy cập tại [https://docs.nestjs.com](https://docs.nestjs.com).
2. **Prisma ORM Guide:** *PostgreSQL Modeling & Client Generation*, truy cập tại [https://www.prisma.io/docs](https://www.prisma.io/docs).
3. **Resend API Reference:** *Node.js SDK & Email Delivery Error Codes*, truy cập tại [https://resend.com/docs](https://resend.com/docs).
4. **IETF RFC 6750:** *The OAuth 2.0 Authorization Framework: Bearer Token Usage*.
