# TRƯỜNG ĐẠI HỌC SÀI GÒN
## KHOA CÔNG NGHỆ THÔNG TIN
### HỌC PHẦN: CÁC CÔNG NGHỆ LẬP TRÌNH HIỆN ĐẠI

---

# BÁO CÁO CHUYÊN ĐỀ HANDS-ON LAB
## LÀM CHỦ KIẾN TRÚC LÕI NESTJS VÀ REQUEST LIFECYCLE
### Đề tài: Xây dựng Notification Service gửi thông báo qua Resend API & PostgreSQL

| THÔNG TIN BÁO CÁO | CHI TIẾT |
| :--- | :--- |
| **Nhóm thực hiện** | Nhóm 15 |
| **Giảng viên hướng dẫn** | ThS. Phạm Thi Vương |
| **Học phần** | Các công nghệ lập trình hiện đại |
| **Thời lượng thực hành** | 35 – 45 phút |
| **Chuẩn đánh giá** | Rubric Hands-on Lab (Mã D0 – D3, Thang điểm 20) |
| **Danh sách sinh viên thực hiện** | 3122410001 – Diệp Thụy An<br>3122410380 – Nguyễn Duy Thái<br>3122410483 – Nguyễn Tuấn Vũ |

**Thành phố Hồ Chí Minh, Tháng 11 Năm 2026**

---

# 1. LÝ DO CHỌN ĐỀ TÀI VÀ MỤC TIÊU HỌC TẬP (TIÊU CHUẨN RUBRIC D0)

### 1.1. Bối cảnh kỹ thuật và Lý do lựa chọn đề tài (Vượt qua bẫy CRUD cơ bản)
Trong hệ sinh thái phát triển ứng dụng Backend trên nền tảng Node.js, NestJS đã trở thành framework doanh nghiệp phổ biến nhờ kết hợp chặt chẽ ngôn ngữ TypeScript, nguyên tắc lập trình hướng đối tượng (OOP) và kiến trúc phân tầng tương tự Angular và Spring Boot. Tuy nhiên, nhiều lập trình viên khi mới tiếp cận NestJS thường chỉ dừng lại ở các thao tác CRUD (Create - Read - Update - Delete) cơ bản: Controller tiếp nhận request, gọi Service rồi truy vấn cơ sở dữ liệu. Cách làm này vô tình biến NestJS thành "lớp bọc Express bằng Class", chưa tận dụng được sức mạnh kiến trúc thực sự của framework.

Để giải quyết vấn đề đó, đề tài **"Xây dựng Notification Service gửi email (cá nhân và nhóm) với Resend API và PostgreSQL"** được lựa chọn nhằm giúp người học làm chủ trọn vẹn **Request Lifecycle (Vòng đời của một HTTP Request)** và **Inversion of Control (IoC)** trong NestJS:

1. **Giao tiếp dịch vụ bên ngoài thực tế:** Hệ thống vừa tương tác với cơ sở dữ liệu quan hệ nội bộ (PostgreSQL qua Prisma ORM) để quản lý nhóm người dùng (`Group`, `GroupMember`), vừa tích hợp nền tảng gửi mail đám mây (Resend API). Bài toán này đặt ra yêu cầu kiểm soát độ trễ mạng và xử lý sự cố kết nối ngoại vi.
2. **Khám phá trọn vẹn 4 tầng Request Lifecycle:**
   - **Guard (`CanActivate`):** Chặn truy cập trái phép, chỉ người dùng đã đăng nhập (sở hữu Token JWT hợp lệ) mới được phép gửi thông báo.
   - **Pipe (`PipeTransform`):** Tự động thanh lọc (Sanitize) nội dung email, loại bỏ mã script độc hại (Anti-XSS) và chuẩn hóa dữ liệu trước khi vào Controller.
   - **Interceptor (`NestInterceptor`):** Sử dụng lập trình phản ứng với RxJS để đo lường thời gian thực thi (Latency Tracking) và chuẩn hóa định dạng JSON phản hồi `{ success, duration, data }`.
   - **Exception Filter (`ExceptionFilter`):** Bắt trọn các lỗi từ Resend SDK (sai API key, lỗi kết nối, email không hợp lệ) và chuyển đổi thành mã phản hồi chuẩn `422 Unprocessable Entity`, không làm crash máy chủ hay lộ stack trace `500`.

### 1.2. Mục tiêu học tập và Năng lực cốt lõi đạt được
Sau khi hoàn thành bài thực hành từ 35 đến 45 phút, người học sẽ có năng lực:
* Hiểu rõ thứ tự thực thi của chuỗi: `Client Request` → `Guard` → `Interceptor (Pre)` → `Pipe` → `Controller/Service` → `Exception Filter` → `Interceptor (Post / RxJS)` → `Client Response`.
* Tự tay xây dựng `JwtAuthGuard` kế thừa `CanActivate`, sử dụng `ExecutionContext`, trích xuất `Authorization: Bearer <token>`, giải mã với `JwtService.verifyAsync()` và ứng dụng TypeScript Declaration Merging để gắn payload vào `request.user`.
* Viết Custom `PipeTransform` làm sạch dữ liệu đầu vào bằng Regular Expressions và hàm cắt tỉa khoảng trắng.
* Áp dụng `NestInterceptor` và toán tử RxJS `map()` để can thiệp vào luồng Observable, đo thời gian xử lý API tính bằng mili-giây.
* Xây dựng `ExceptionFilter` với decorator `@Catch()` để cô lập và xử lý an toàn lỗi từ các dịch vụ bên thứ ba.

---

# 2. ĐIỀU KIỆN MÔI TRƯỜNG CẦN CHUẨN BỊ (PREREQUISITES)

### 2.1. Yêu cầu công cụ và hạ tầng phần mềm
| STT | Tên công cụ / Nền tảng | Phiên bản tối thiểu yêu cầu | Vai trò trong bài thực hành |
| :---: | :--- | :--- | :--- |
| 1 | **Node.js** | Phiên bản ≥ v18.x (Khuyến nghị **v20.x** hoặc **v22.x LTS**) | Nền tảng thực thi JavaScript/TypeScript phía máy chủ |
| 2 | **npm** | Phiên bản ≥ v9.x (Đi kèm sẵn cùng Node.js) | Trình quản lý các gói thư viện phụ thuộc |
| 3 | **Docker Desktop / Engine** | Docker Engine ≥ 24.x & Docker Compose v2.x | Ảo hóa và chạy container cơ sở dữ liệu PostgreSQL 16 |
| 4 | **Trình soạn thảo mã (IDE)** | Visual Studio Code / Cursor IDE | Không gian soạn thảo mã nguồn và gỡ lỗi |
| 5 | **Tiện ích mở rộng VS Code** | **REST Client** (của tác giả Huachao Mao) | Thực thi các kịch bản gọi API kiểm thử từ tệp `.http` |

### 2.2. Tài nguyên dịch vụ bên thứ ba (Resend API & Mock Fallback)
* **Khóa xác thực Resend API:** Đăng ký miễn phí tại trang chủ resend.com để nhận API key cá nhân (dạng `re_...`).
* **Cơ chế mô phỏng an toàn (Simulation Mock Mode):** Nếu biến môi trường `RESEND_API_KEY` để trống hoặc giữ giá trị mẫu `re_sample_key_123`, `MailService` sẽ tự động chuyển sang chế độ mô phỏng: tạo độ trễ giả lập 200 ms tương đương mạng thực tế và trả về kết quả gửi thư thành công với mã `mock_email_...`, giúp người học không bị ngắt quãng bài lab.

---

# 3. QUY TRÌNH THIẾT LẬP MÔI TRƯỜNG VÀ KHỞI ĐỘNG STARTER CODE (ĐÁNH SỐ TỪNG BƯỚC)

Để triển khai dự án từ mã nguồn khởi đầu (Starter Code) hoặc khởi tạo từ đầu, người học thực hiện theo quy trình 6 bước lệnh chuẩn hóa sau:

### Bước 1: Cài đặt thư viện phụ thuộc và Công cụ Prisma ORM
Tại thư mục gốc của dự án, chạy lệnh cài đặt toàn bộ các gói thư viện phụ thuộc:
```bash
npm install
```
> **Ghi chú về khởi tạo Prisma từ đầu (Prisma Setup from Scratch):**  
> Trong dự án thực tế, để sử dụng cấu trúc truyền thống ổn định với một tệp duy nhất `prisma/schema.prisma` (tránh các phiên bản thử nghiệm tự động sinh tệp `prisma.config.ts`), nhóm nghiên cứu đã khóa phiên bản **Prisma 5** bằng các lệnh:
> ```bash
> # Cài đặt Prisma CLI và ts-node để chạy file seed
> npm install prisma@5 ts-node --save-dev
> 
> # Cài đặt Prisma Client phục vụ truy vấn CSDL
> npm install @prisma/client@5
> 
> # Khởi tạo cấu hình ban đầu (tạo thư mục prisma/schema.prisma và tệp .env)
> npx prisma init
> ```

### Bước 2: Kiểm tra cấu hình biến môi trường (.env)
Tệp `.env` tại thư mục gốc được thiết lập để kết nối trực tiếp tới container PostgreSQL:
```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/notification_db?schema=public"
JWT_SECRET="super-secret-jwt-key-for-lab"
RESEND_API_KEY="re_sample_key_123"
```

### Bước 3: Khởi động Cơ sở Dữ liệu qua Docker Compose
Khởi chạy container PostgreSQL 16 Alpine ở chế độ chạy ngầm (`-d`):
```bash
docker compose up -d
```
Kiểm tra trạng thái container (đảm bảo trạng thái `Up` trên cổng 5432):
```bash
docker compose ps
```

### Bước 4: Đồng bộ cấu trúc Schema vào Database và Sinh Prisma Client
Đẩy trực tiếp các mô hình dữ liệu (`User`, `Group`, `GroupMember`) trong `schema.prisma` vào database và cập nhật Prisma Client an toàn kiểu (Type-safe):
```bash
npx prisma db push
npx prisma generate
```

### Bước 5: Nạp dữ liệu mẫu ban đầu vào Database (Seed Data)
Thực thi nạp dữ liệu từ tệp `prisma/seed.ts` (được cấu hình qua `"prisma": { "seed": "npx tsx prisma/seed.ts" }` trong `package.json`):
```bash
npx prisma db seed
```
Kết quả hiển thị trên Terminal xác nhận thành công:
* Tạo nhóm: **`DEV_TEAM`** (gồm 2 thành viên: `alice@example.com`, `bob@example.com`).
* Tạo nhóm: **`MARKETING`** (gồm 1 thành viên: `charlie@example.com`).

*(Tùy chọn: Chạy lệnh `npx prisma studio` để mở giao diện quản trị dữ liệu trực quan tại `http://localhost:5555`).*

### Bước 6: Khởi chạy ứng dụng NestJS ở chế độ Watch Mode
```bash
npm run start:dev
```
Khi terminal xuất hiện dòng thông báo `[Bootstrap] 🚀 Ứng dụng Notification Lab đang chạy tại: http://localhost:3000`, hệ thống đã sẵn sàng 100% để bước vào phần thực hành.

---

# 4. MÃ NGUỒN KHỞI ĐẦU (STARTER CODE)

### 4.1. Cấu trúc và trạng thái hiện tại của Starter Code

Bộ mã nguồn khởi đầu (Starter Code) của bài thực hành đã được thiết lập sẵn khung cơ bản theo chuẩn kiến trúc NestJS, giúp người học tập trung hoàn toàn vào việc triển khai logic nghiệp vụ chính và các thành phần cốt lõi của Request Lifecycle mà không mất thời gian cấu hình từ đầu:

* **Cấu trúc thư mục:** Đã phân chia sẵn các tầng theo mô hình Module hóa chuẩn mực của NestJS:
  - `src/prisma/`: Đóng gói `PrismaService` và `PrismaModule` (`@Global()`) tự động kết nối và giải phóng tài nguyên CSDL theo vòng đời ứng dụng.
  - `src/mail/`: Đóng gói `MailModule` và `MailService` bọc thư viện `resend`, tích hợp sẵn cơ chế **Simulation Mock Mode** (tự động giả lập gửi thư thành công sau 200 ms nếu người học chưa có API Key thật).
  - `src/auth/`: Cung cấp sẵn endpoint `POST /auth/login` sinh mã JWT Token nhanh phục vụ kiểm thử bài lab.
  - `src/notifications/`: Khung phân hệ chính với `NotificationsService` đã có sẵn logic truy vấn CSDL và các DTO (`SendUserDto`, `SendGroupDto`) tích hợp sẵn bộ kiểm thực `class-validator`.
* **Hạ tầng cơ sở dữ liệu:** Đã tích hợp sẵn tệp cấu hình `docker-compose.yml` để khởi chạy PostgreSQL 16 và tệp `prisma/schema.prisma` định nghĩa sẵn các mô hình dữ liệu quan hệ cơ bản (`User`, `Group`, `GroupMember`).
* **Các thành phần hạ tầng:** Đã cài đặt và cấu hình sẵn các thư viện cốt lõi như `class-validator`, `class-transformer`, `@nestjs/jwt`, `@nestjs/config`, cùng tệp kịch bản kiểm thử `test-requests.http` để thực thi nhanh trong VS Code/Cursor.

### 4.2. Nhiệm vụ cần hoàn thành trong bài Lab

Trong không gian thư mục `src/notifications/`, người học sẽ lần lượt giải quyết 4 bài tập thực hành tương ứng với 4 mắt xích trọng tâm trong chuỗi **Request Lifecycle** của NestJS:

1. **Bài tập 1 – Tầng Kiểm soát Truy cập (Guard):** Xây dựng `JwtAuthGuard` kế thừa `CanActivate`, trích xuất tiêu đề `Authorization: Bearer <token>`, giải mã với `JwtService.verifyAsync()` và gán payload vào `request.user` để bảo vệ các route gửi thông báo.
2. **Bài tập 2 – Tầng Thanh lọc Dữ liệu (Pipe):** Xây dựng `SanitizeContentPipe` kế thừa `PipeTransform`, tự động loại bỏ các thẻ `<script>` nguy hiểm (chống tấn công Stored XSS) và cắt tỉa khoảng trắng thừa trong nội dung email trước khi chuyển giao cho Controller.
3. **Bài tập 3 – Tầng Quan sát và Chuẩn hóa (Interceptor):** Xây dựng `ResponseTimeInterceptor` kế thừa `NestInterceptor`, sử dụng toán tử RxJS `map()` để can thiệp vào luồng Observable, đo lường độ trễ mạng khi gọi Resend API và bọc response theo cấu trúc chuẩn `{ success: true, duration: "XXXms", data: ... }`.
4. **Bài tập 4 – Tầng Xử lý Ngoại lệ Tập trung (Exception Filter):** Xây dựng `NotificationExceptionFilter` với `@Catch()`, bắt trọn các lỗi ngoại vi từ Resend SDK (sai API key, lỗi mạng, email không hợp lệ) và chuẩn hóa thành phản hồi HTTP `422 Unprocessable Entity` rõ ràng, ngăn chặn việc máy chủ bị crash hoặc lộ lỗi `500`.
5. **Kích hoạt và Kiểm thử:** Gắn các Decorator `@UseGuards()`, `@UsePipes()`, `@UseInterceptors()`, `@UseFilters()` lên `NotificationsController` và thực hiện kiểm thử nghiệm thu toàn bộ luồng với tệp `test-requests.http`.

---

# 5. NỘI DUNG THỰC HÀNH CHI TIẾT THEO REQUEST LIFECYCLE

---

## 5.1. BÀI TẬP 1 (ĐÃ HOÀN THÀNH): XÂY DỰNG `JwtAuthGuard` BẢO VỆ ROUTE NHẠY CẢM

### 5.1.1. Bối cảnh nghiệp vụ
Hai endpoint gửi thông báo:
* `POST /notifications/user` (Gửi mail cho cá nhân)
* `POST /notifications/group` (Gửi mail hàng loạt cho nhóm)

tiềm ẩn nguy cơ bị lạm dụng gửi thư rác nếu cho phép truy cập nặc danh. Do đó, yêu cầu đặt ra là: **Bắt buộc người gửi phải có phiên đăng nhập hợp lệ thông qua Bearer Token (JWT)**.

Trong NestJS, **Guard** là thành phần kiểm soát quyền truy cập trước khi request đến Controller. Nhờ truy cập trực tiếp vào đối tượng `ExecutionContext`, Guard nắm bắt được chính xác ngữ cảnh phương thức sắp được gọi và sử dụng được Dependency Injection từ NestJS IoC Container.

### 5.1.2. Các bước triển khai
1. Mở file `src/notifications/guards/jwt-auth.guard.ts`.
2. Chuyển đổi ngữ cảnh sang HTTP: `const request = context.switchToHttp().getRequest<Request>();`.
3. Trích xuất tiêu đề `authorization` từ `request.headers`.
4. Nếu tiêu đề không tồn tại hoặc không bắt đầu bằng `"Bearer "`, ném `new UnauthorizedException('Token không tồn tại')`.
5. Tách chuỗi lấy token: `const [type, token] = authHeader.split(' ');`.
6. Giải mã token bất đồng bộ bằng `await this.jwtService.verifyAsync(token, { secret: ... })`.
7. Gán payload giải mã được vào `request.user = payload` (áp dụng kỹ thuật TypeScript Declaration Merging).
8. Trả về `true` để cho phép request đi tiếp.
9. Tại `src/notifications/notifications.controller.ts`, gắn decorator `@UseGuards(JwtAuthGuard)` trên 2 endpoint `sendToUser` và `sendToGroup`.

### 5.1.3. Mã nguồn thực tế đã triển khai (Source Code)

Tại tệp `src/notifications/guards/jwt-auth.guard.ts`:
```typescript
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
    // 1. Chuyển đổi ngữ cảnh thực thi sang HTTP và lấy đối tượng Request của Express
    const request = context.switchToHttp().getRequest<Request>();

    // 2. Trích xuất tiêu đề authorization từ HTTP Headers
    const authHeader = request.headers.authorization;

    // 3. Kiểm tra sự tồn tại và định dạng Bearer Token theo chuẩn RFC 6750
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    // 4. Phân tách chuỗi để lấy token
    const [type, token] = authHeader.split(' ');

    // 5. Kiểm tra tính hợp lệ và giải mã token bất đồng bộ
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // 6. Gán payload đã giải mã vào request.user để các Controller có thể sử dụng
    request['user'] = payload;

    // 7. Cho phép request tiếp tục xử lý
    return true;
  }
}
```

Tại tệp `src/notifications/notifications.controller.ts`, kích hoạt Guard:
```typescript
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('user')
  @UseGuards(JwtAuthGuard)
  async sendToUser(@Body() body: SendUserDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToUser(body, sender);
  }

  @Post('group')
  @UseGuards(JwtAuthGuard)
  async sendToGroup(@Body() body: SendGroupDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToGroup(body, sender);
  }
}
```

### 5.1.4. Phân tích kỹ thuật chuyên sâu
* **ExecutionContext:** Cung cấp thông tin về tiến trình thực thi hiện tại. Lệnh `context.switchToHttp()` cho phép trích xuất đối tượng `Request` của Express/Fastify.
* **Chuẩn RFC 6750:** Việc kiểm tra `authHeader.startsWith('Bearer ')` và tách chuỗi qua `split(' ')` đảm bảo đúng quy chuẩn truyền tải mã định danh truy cập.
* **TypeScript Declaration Merging:** Giao diện `Request` mặc định của Express không có thuộc tính `user`. Việc gán `request['user'] = payload` cho phép luân chuyển thông tin người gửi đến các tầng sau mà không cần truy vấn lại database.

### 5.1.5. Minh chứng kiểm thử thực nghiệm (Test Results)

**Trường hợp 1: Gọi API không có Token → Bị chặn với lỗi 401 Unauthorized**
* Request:
  ```http
  POST http://localhost:3000/notifications/user
  Content-Type: application/json

  {
    "to": "bob@example.com",
    "subject": "Test Guard: Không kèm token",
    "content": "Email này sẽ bị chặn!"
  }
  ```
* Phản hồi từ server:
  ```json
  {
    "statusCode": 401,
    "message": "Token không tồn tại",
    "error": "Unauthorized"
  }
  ```

**Trường hợp 2: Đăng nhập lấy Token và gửi yêu cầu hợp lệ → Thành công 200 OK**
* Bước 1: Đăng nhập nhận access token qua `POST http://localhost:3000/auth/login`.
* Bước 2: Gửi request kèm Header `Authorization: Bearer <token>`:
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
* Phản hồi từ server:
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
      "status": "delivered",
      "simulated": true
    }
  }
  ```
  > *Nhận xét:* Token được giải mã chính xác, trường `sender` hiển thị đúng email `alice@example.com` lấy từ payload của token. Guard hoạt động hoàn toàn chính xác.

---

## 5.2. BÀI TẬP 2: XÂY DỰNG `SanitizeContentPipe` LÀM SẠCH MÃ HTML/SCRIPT ĐỘC HẠI

### 5.2.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Ngăn chặn nguy cơ tấn công Stored XSS khi người gửi chèn các đoạn mã JavaScript nguy hiểm dạng `<script>alert('hack')</script>` vào nội dung email.
* **Nhiệm vụ:**
  1. Mở file `src/notifications/pipes/sanitize-content.pipe.ts` kế thừa `PipeTransform`.
  2. Trong hàm `transform(value: any)`: kiểm tra nếu `value` có trường `content` kiểu string, sử dụng biểu thức chính quy (Regex) để loại bỏ toàn bộ thẻ `<script>...</script>`, đồng thời gọi `trim()` để cắt khoảng trắng 2 đầu.
  3. Nếu sau khi làm sạch mà nội dung bị rỗng, ném `new BadRequestException('Nội dung email không được để trống sau khi làm sạch')`.
  4. Bắt buộc phải `return value;` để chuyển dữ liệu đã làm sạch cho Controller.
  5. Gắn `@UsePipes(new SanitizeContentPipe())` vào Controller.

---

## 5.3. BÀI TẬP 3: XÂY DỰNG `ResponseTimeInterceptor` ĐO LƯỜNG ĐỘ TRỄ MẠNG VỚI RXJS

### 5.3.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Do dịch vụ Resend là API đám mây có độ trễ dao động, hệ thống yêu cầu đo lường thời gian xử lý và chuẩn hóa toàn bộ response trả về client theo định dạng `{ success: true, duration: "XXXms", data: ... }`.
* **Nhiệm vụ:**
  1. Mở file `src/notifications/interceptors/response-time.interceptor.ts` kế thừa `NestInterceptor`.
  2. Ghi nhận thời điểm bắt đầu trước khi controller thực thi: `const now = Date.now();`.
  3. Sử dụng toán tử `map()` của RxJS trên `next.handle()`.
  4. Tính toán độ trễ: `const duration = `${Date.now() - now}ms`;` và bọc dữ liệu trả về.
  5. Gắn `@UseInterceptors(ResponseTimeInterceptor)` ở cấp Controller.

---

## 5.4. BÀI TẬP 4: XÂY DỰNG `NotificationExceptionFilter` BẮT LỖI NGOẠI VI AN TOÀN

### 5.4.1. Đề bài và Yêu cầu kỹ thuật
* **Mục tiêu:** Khi Resend SDK phát sinh lỗi ngoại vi (sai API key, lỗi mạng, vượt hạn ngạch), máy chủ NestJS không được trả về mã `500 Internal Server Error`, mà phải bắt trọn lỗi và phản hồi mã `422 Unprocessable Entity` với định dạng JSON chuẩn mực.
* **Nhiệm vụ:**
  1. Mở file `src/notifications/filters/notification-exception.filter.ts` với decorator `@Catch()`.
  2. Triển khai phương thức `catch(exception: unknown, host: ArgumentsHost)`.
  3. Nếu là `HttpException`: giữ nguyên status và message của NestJS.
  4. Nếu là `Error` ngoại vi từ Resend: đặt `status = HttpStatus.UNPROCESSABLE_ENTITY` (422) và trích xuất thông điệp lỗi.
  5. Trả về JSON chuẩn: `{ statusCode, timestamp, path, error, message }`.
  6. Gắn `@UseFilters(NotificationExceptionFilter)` ở cấp Controller.

---

# 6. MỤC LỖI THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC (COMMON PITFALLS)

| STT | Hiện tượng lỗi | Nguyên nhân gốc rễ | Cách khắc phục |
| :---: | :--- | :--- | :--- |
| 1 | `Nest can't resolve dependencies of the JwtAuthGuard (?)` | `NotificationsModule` chưa import `AuthModule` hoặc `AuthModule` chưa export `JwtModule`. | Kiểm tra tại `auth.module.ts` có `exports: [JwtModule]`, và tại `notifications.module.ts` có `imports: [AuthModule]`. |
| 2 | Lỗi `401 Unauthorized` dù Client đã gửi Header | Header trong Express mặc định chuyển về chữ thường (`authorization`). Nếu đọc bằng `request.headers['Authorization']` có thể bị `undefined`. | Luôn truy xuất tiêu đề bằng chữ thường: `request.headers.authorization`. |
| 3 | Lỗi biên dịch TypeScript `TS2883: The inferred type cannot be named` | TypeScript ở chế độ kiểm tra nghiêm ngặt không thể tự động suy luận kiểu trả về của các phương thức liên quan tới SDK `resend`. | Thêm tường minh kiểu trả về cho phương thức: `async sendToUser(...): Promise<any>`. |
| 4 | Request bị treo vô hạn (Hanging Request) khi dùng Interceptor | Gọi `next.handle().pipe(...)` nhưng quên từ khóa `return`. | Interceptor hoạt động theo luồng RxJS. Bắt buộc phải có `return next.handle().pipe(...)`. |
| 5 | Controller nhận giá trị Body là `undefined` sau khi gắn Pipe | Phương thức `transform(value)` xử lý xong nhưng quên trả về dữ liệu. | Giá trị trả về từ hàm `transform` chính là tham số truyền vào Controller. Bắt buộc phải kết thúc bằng `return value;`. |

---

# 7. TỔNG KẾT VÀ TÀI LIỆU THAM KHẢO

Bài thực hành Hands-on Lab về Notification Service giúp làm sáng tỏ toàn bộ chuỗi Request Lifecycle của NestJS trong môi trường thực tế. Việc kết hợp chặt chẽ giữa Guard, Pipe, Interceptor và Exception Filter đảm bảo hệ thống vừa an toàn, vừa dễ quan sát hiệu năng, đồng thời có khả năng chịu lỗi cao khi làm việc với các dịch vụ bên thứ ba.

### Tài liệu tham khảo:
1. **NestJS Official Documentation:** *Guards, Pipes, Interceptors, Exception Filters & ExecutionContext*, truy cập tại https://docs.nestjs.com.
2. **Prisma ORM Documentation:** *Schema Modeling & Database Seeding*, truy cập tại https://www.prisma.io/docs.
3. **Resend API Reference:** *Node.js Email Delivery SDK*, truy cập tại https://resend.com/docs.
4. **IETF RFC 6750:** *The OAuth 2.0 Authorization Framework: Bearer Token Usage*.
