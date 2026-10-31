# HANDS-ON LAB: THỰC HÀNH NESTJS CORE & REQUEST LIFECYCLE
## Đề tài: Notification Service (Gửi mail qua Resend API)
> **Thời lượng ước tính:** 35 – 45 phút  
> **Người thực hiện/Học viên:** Nhóm tự học / Sinh viên thực hành  
> **Bộ tiêu chí đánh giá:** Rubric mã D0 – D3 (20 điểm)

---

## 1. Lý Do Chọn Chủ Đề & Mục Tiêu Học Tập (Tiêu chí D0 - 5 điểm)

### 1.1. Vì sao chọn đề tài này? (Vượt qua CRUD cơ bản)
- Đa số người mới tiếp cận NestJS thường chỉ viết các API CRUD cơ bản (Controller gọi Service, Service gọi Database). Cách tiếp cận này khiến người học bỏ lỡ sức mạnh kiến trúc lớn nhất của NestJS: **Request Lifecycle (Vòng đời của một HTTP Request)** và **Inversion of Control (IoC)**.
- Đề tài **Notification API** (Gửi thông báo qua email cho cá nhân và nhóm người dùng) là một bài toán thực tế điển hình, buộc người học phải giải quyết các thách thức:
  1. **Bảo mật (Authentication):** Chỉ người dùng đã đăng nhập (sở hữu Token JWT hợp lệ) mới được phép gửi thông báo $\rightarrow$ Giải quyết bằng **`Guard`**.
  2. **An toàn dữ liệu (Sanitization & Anti-XSS):** Nội dung email do người gửi nhập có thể chứa thẻ `<script>` nguy hiểm $\rightarrow$ Tự động làm sạch trước khi gửi bằng **`Pipe`**.
  3. **Khả năng quan sát (Observability / Latency Tracking):** Resend là dịch vụ bên thứ ba (Third-party Cloud), độ trễ mạng có thể dao động $\rightarrow$ Đo thời gian xử lý và chuẩn hóa định dạng trả về bằng **`Interceptor`** và **`RxJS`**.
  4. **Khả năng chống chịu lỗi (Fault Tolerance):** Nếu API key sai, domain chưa xác thực hoặc mất kết nối tới Resend $\rightarrow$ Bắt trọn lỗi và format lại mã HTTP 422 chuẩn hóa bằng **`Exception Filter`**, không làm lộ stack trace hay crash server.

### 1.2. Năng lực đạt được sau khi hoàn thành bài Lab
Hoàn thành bài thực hành này, người học sẽ có năng lực:
* Hiểu rõ thứ tự thực thi của chuỗi **Guard $\rightarrow$ Interceptor (Pre) $\rightarrow$ Pipe $\rightarrow$ Controller/Service $\rightarrow$ Exception Filter $\rightarrow$ Interceptor (Post)**.
* Tự tay xây dựng được `JwtAuthGuard` kế thừa `CanActivate` bằng cách tương tác với `ExecutionContext` và `JwtService`.
* Tự viết được Custom `PipeTransform` để biến đổi và thanh lọc dữ liệu đầu vào.
* Sử dụng thành thạo RxJS `map()` bên trong `NestInterceptor` để bao bọc và tính toán thời gian phản hồi API.
* Làm chủ `ExceptionFilter` với decorator `@Catch()` để cô lập và xử lý lỗi từ các thư viện SDK bên ngoài.

---

## 2. Điều Kiện Môi Trường Cần Chuẩn Bị Trước

Người học cần cài đặt sẵn trên máy:
* **Node.js:** Phiên bản $\ge$ 18.x (khuyến nghị Node 20 LTS trở lên).
* **npm:** Phiên bản $\ge$ 9.x.
* **Docker & Docker Compose:** Đã cài đặt và đang chạy nền.
* **IDE:** VS Code hoặc Cursor (khuyến nghị cài extension **REST Client** để test API trực tiếp).
* **Resend API Key (Tùy chọn):** Có thể đăng ký miễn phí tại [resend.com](https://resend.com). *(Nếu không có, starter code đã tích hợp sẵn chế độ Mock tự động nhận diện `re_sample_...` để mô phỏng gửi thành công, đảm bảo làm lab mượt mà không bị gián đoạn).*

---

## 3. Các Bước Khởi Động Starter Code (Kèm các lệnh chạy đánh số)

Starter code đã chuẩn bị sẵn cơ sở dữ liệu, Docker compose, Prisma schema và các DTO kiểm thực để người học không mất thời gian gõ boilerplate.

### Bước 1: Khởi động Cơ sở Dữ liệu qua Docker Compose
Khởi chạy container PostgreSQL 16:
```bash
docker compose up -d
```
> Kiểm tra trạng thái: `docker compose ps` (thấy container `nestjs_lab_postgres` trạng thái `Up` là thành công).

---

### Bước 2: Khởi tạo Cấu trúc Bảng Database & Sinh Prisma Client
Đẩy cấu trúc bảng `User`, `Group`, `GroupMember` vào PostgreSQL:
```bash
npx prisma db push
npx prisma generate
```

---

### Bước 3: Nạp Dữ liệu Mẫu vào Database (Seed Data)
Thực thi script nạp sẵn dữ liệu để phục vụ việc kiểm thử gửi mail cho nhóm:
```bash
npx prisma db seed
```
> Kết quả terminal sẽ báo:
> - Tạo nhóm: **`DEV_TEAM`** (chứa thành viên: `alice@example.com`, `bob@example.com`).
> - Tạo nhóm: **`MARKETING`** (chứa thành viên: `charlie@example.com`).

*(Tùy chọn: Mở `npx prisma studio` tại cổng `http://localhost:5555` để xem dữ liệu trực quan).*

---

### Bước 4: Khởi động Ứng dụng NestJS
Chạy server NestJS ở chế độ Hot Reload:
```bash
npm run start:dev
```
> Server sẵn sàng tại: **`http://localhost:3000`**.

---

## 4. Cấu Trúc Mã Nguồn Starter Code

```text
hands-on-lab/
├── docker-compose.yml          # Container Postgres 16
├── .env                        # DATABASE_URL, JWT_SECRET, RESEND_API_KEY
├── prisma/
│   ├── schema.prisma           # Model User, Group, GroupMember (Prisma 5 chuẩn)
│   └── seed.ts                 # Script nạp sẵn DEV_TEAM và users
├── test-requests.http          # File chứa sẵn toàn bộ các request HTTP để test lab
└── src/
    ├── app.module.ts           # Cấu hình ConfigModule, PrismaModule, MailModule, AuthModule
    ├── main.ts                 # Bật sẵn ValidationPipe toàn cục
    ├── prisma/                 # PrismaService & PrismaModule
    ├── mail/                   # MailService wrap Resend SDK (sẵn chế độ mock)
    ├── auth/                   # POST /auth/login sinh token JWT test nhanh
    └── notifications/          # KHÔNG GIAN BÀI TẬP THỰC HÀNH CỦA HỌC VIÊN
        ├── dto/
        │   ├── send-user.dto.ts        # DTO gửi email cá nhân
        │   └── send-group.dto.ts       # DTO gửi email theo nhóm
        ├── guards/
        │   └── jwt-auth.guard.ts       # [BÀI TẬP 1: Hoàn thiện CanActivate]
        ├── pipes/
        │   └── sanitize-content.pipe.ts# [BÀI TẬP 2: Hoàn thiện PipeTransform]
        ├── interceptors/
        │   └── response-time.interceptor.ts # [BÀI TẬP 3: Hoàn thiện NestInterceptor]
        ├── filters/
        │   └── notification-exception.filter.ts # [BÀI TẬP 4: Hoàn thiện ExceptionFilter]
        ├── notifications.service.ts    # Logic nghiệp vụ gửi mail
        ├── notifications.controller.ts # Nơi gắn Guard, Pipe, Interceptor, Filter
        └── notifications.module.ts
```

---

## 5. Nội Dung Các Bài Tập Thực Hành (Kèm Đáp Án Chi Tiết)

---

### BÀI TẬP 1: Xây Dựng `JwtAuthGuard` Bảo Vệ Route (9 phút)

#### Đề bài:
Route gửi thông báo cá nhân (`POST /notifications/user`) và gửi cho nhóm (`POST /notifications/group`) bắt buộc phải được bảo vệ. Nếu request không có header `Authorization: Bearer <token>` hoặc token không hợp lệ, hệ thống phải chặn lại và trả về mã lỗi `401 Unauthorized`.

#### Nhiệm vụ:
1. Mở file `src/notifications/guards/jwt-auth.guard.ts`.
2. Trích xuất token từ header `request.headers.authorization`.
3. Nếu không có token, ném ra `new UnauthorizedException('Token không tồn tại hoặc không hợp lệ')`.
4. Dùng `this.jwtService.verifyAsync(token, { secret: ... })` để giải mã token.
5. Gán payload giải mã được vào `request['user'] = payload`.
6. Trả về `true`.
7. Mở `src/notifications/notifications.controller.ts`, bỏ comment decorator `@UseGuards(JwtAuthGuard)` trên 2 route `POST user` và `POST group`.

#### Đáp án mẫu Bài tập 1:
```typescript
// src/notifications/guards/jwt-auth.guard.ts
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
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không tồn tại hoặc không hợp lệ');
    }

    const token = authHeader.split(' ')[1];
    const secret = this.configService.get<string>('JWT_SECRET', 'super-secret-jwt-key-for-lab');

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload; // Gắn thông tin người gửi vào request context
    } catch (error) {
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }

    return true;
  }
}
```

---

### BÀI TẬP 2: Tự Động Làm Sạch Dữ Liệu Với `SanitizeContentPipe` (8 phút)

#### Đề bài:
Nội dung email (`content`) do người dùng nhập vào có thể chứa khoảng trắng thừa hoặc chứa các đoạn mã script độc hại (chẳng hạn `<script>alert('hack')</script>`). Cần tạo một Pipe để làm sạch chuỗi này trước khi dữ liệu được chuyển giao cho Controller và Service.

#### Nhiệm vụ:
1. Mở file `src/notifications/pipes/sanitize-content.pipe.ts`.
2. Trong hàm `transform(value: any)`, kiểm tra nếu `value` có chứa thuộc tính `content`:
   - Dùng biểu thức chính quy (Regex) để loại bỏ toàn bộ thẻ `<script>...</script>`.
   - Cắt tỉa khoảng trắng ở 2 đầu bằng hàm `.trim()`.
   - Nếu sau khi làm sạch mà chuỗi `content` rỗng, ném ra `new BadRequestException('Nội dung email không được để trống sau khi làm sạch')`.
3. Bắt buộc phải trả về (`return value`) dữ liệu đã làm sạch.
4. Mở `src/notifications/notifications.controller.ts`, bỏ comment `@UsePipes(new SanitizeContentPipe())`.

#### Đáp án mẫu Bài tập 2:
```typescript
// src/notifications/pipes/sanitize-content.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizeContentPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (value && typeof value === 'object' && typeof value.content === 'string') {
      // 1. Loại bỏ các thẻ script độc hại
      value.content = value.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

      // 2. Cắt bỏ khoảng trắng thừa ở hai đầu
      value.content = value.content.trim();

      // 3. Kiểm tra tính hợp lệ sau khi làm sạch
      if (value.content.length === 0) {
        throw new BadRequestException('Nội dung email không được để trống sau khi làm sạch');
      }
    }

    return value;
  }
}
```

---

### BÀI TẬP 3: Đo Độ Trễ & Chuẩn Hóa Response Với `ResponseTimeInterceptor` (9 phút)

#### Đề bài:
Các tác vụ gửi mail qua mạng luôn có độ trễ nhất định. Hệ thống yêu cầu: Mọi API trả về đều phải được bọc trong cấu trúc thống nhất `{ success: true, duration: "XXXms", data: ... }` để phía Client dễ theo dõi hiệu năng và xử lý dữ liệu.

#### Nhiệm vụ:
1. Mở file `src/notifications/interceptors/response-time.interceptor.ts`.
2. Lấy thời điểm bắt đầu trước khi Controller chạy: `const now = Date.now();`.
3. Can thiệp vào luồng kết quả trả về bằng toán tử `map` của RxJS trên `next.handle()`.
4. Tính độ trễ: `const duration = `${Date.now() - now}ms`;`.
5. Trả về đối tượng `{ success: true, duration, data }`.
6. Mở `src/notifications/notifications.controller.ts`, bỏ comment `@UseInterceptors(ResponseTimeInterceptor)` ở cấp Controller.

#### Đáp án mẫu Bài tập 3:
```typescript
// src/notifications/interceptors/response-time.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        duration: `${Date.now() - now}ms`,
        data,
      })),
    );
  }
}
```

---

### BÀI TẬP 4: Bắt Lỗi Ngoại Vi An Toàn Với `NotificationExceptionFilter` (9 phút)

#### Đề bài:
Khi gửi email, SDK của Resend có thể ném ra các lỗi ngoại vi (ví dụ: API key sai, domain chưa xác thực, lỗi kết nối mạng). Nếu không có Exception Filter, NestJS sẽ quăng lỗi mặc định `500 Internal Server Error`. Ta cần tạo một Exception Filter để bắt các lỗi này và trả về phản hồi chuẩn với mã `422 Unprocessable Entity`.

#### Nhiệm vụ:
1. Mở file `src/notifications/filters/notification-exception.filter.ts`.
2. Triển khai phương thức `catch(exception: unknown, host: ArgumentsHost)`:
   - Nếu `exception instanceof HttpException`: giữ nguyên `status` và `message` của NestJS.
   - Nếu là lỗi thông thường (`Error` do Resend ném ra): đặt mã `status = HttpStatus.UNPROCESSABLE_ENTITY` (422) và message tương ứng.
3. Trả về response JSON chuẩn hóa:
   ```json
   {
     "statusCode": 422,
     "timestamp": "...",
     "path": "/notifications/...",
     "error": "MailDeliveryError",
     "message": "..."
   }
   ```
4. Mở `src/notifications/notifications.controller.ts`, bỏ comment `@UseFilters(NotificationExceptionFilter)` ở cấp Controller.

#### Đáp án mẫu Bài tập 4:
```typescript
// src/notifications/filters/notification-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class NotificationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotificationExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Lỗi máy chủ nội bộ';
    let errorType = 'InternalServerError';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'object' && (res as any).message ? (res as any).message : res;
      errorType = exception.name;
    } else if (exception instanceof Error) {
      status = HttpStatus.UNPROCESSABLE_ENTITY; // 422
      message = exception.message;
      errorType = 'MailDeliveryError';
      this.logger.error(`[MailDeliveryError] Ngoại lệ gửi mail: ${exception.message}`);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: errorType,
      message,
    });
  }
}
```

---

## 6. Hướng Dẫn Kiểm Thử (Verification & Testing)

Học viên mở file `test-requests.http` có sẵn trong thư mục gốc và thực hiện kiểm thử theo trình tự:

1. **Test Đăng nhập (`POST /auth/login`):**
   - Click "Send Request" để nhận `access_token`.
2. **Test Bài 1 (`JwtAuthGuard`):**
   - Chạy request `2a` (không có token) $\rightarrow$ Nhận `401 Unauthorized`.
   - Chạy request `2b` (kèm Bearer token) $\rightarrow$ Nhận `200 OK`.
3. **Test Bài 2 (`SanitizeContentPipe`):**
   - Chạy request `3` (chứa thẻ `<script>alert('hack')</script>`) $\rightarrow$ Kiểm tra log và response: thẻ `<script>` đã hoàn toàn bị thanh lọc.
4. **Test Bài 3 (`ResponseTimeInterceptor`):**
   - Chạy request `4` $\rightarrow$ Kiểm tra JSON trả về: có trường `duration: "215ms"` và `success: true`.
5. **Test Gửi Email Nhóm:**
   - Chạy request `5` (`DEV_TEAM`) $\rightarrow$ Cả 2 email `alice@example.com` và `bob@example.com` đều được gửi thành công.
   - Chạy request `6` (gửi nhóm không tồn tại) $\rightarrow$ Nhận `404 Not Found`.

---

## 7. Mục "Lỗi Thường Gặp" (Common Pitfalls)

| # | Hiện tượng lỗi | Nguyên nhân gốc rễ | Cách khắc phục |
|---|---|---|---|
| 1 | **Quên `return` trong `PipeTransform`** | Hàm `transform(value)` xử lý xong nhưng không `return value`. | Trong NestJS Pipe, giá trị được trả về từ hàm `transform` chính là tham số mà Controller sẽ nhận được. Luôn đảm bảo có dòng `return value;`. |
| 2 | **Lỗi `Cannot read properties of undefined (reading 'get')` trong Guard** | Quên khai báo `ConfigService` hoặc `JwtService` trong constructor của Guard. | Khai báo đúng `constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) {}`. |
| 3 | **Request bị treo vô hạn (Hanging Request) khi gắn Interceptor** | Viết `next.handle().pipe(...)` nhưng quên từ khóa `return`. | Interceptor hoạt động dựa trên Observable. Phải `return next.handle().pipe(...)` để NestJS biết luồng đã hoàn thành. |
| 4 | **Nhầm lẫn thứ tự Header `Authorization`** | Lấy token sai định dạng (ví dụ lấy nguyên chuỗi `"Bearer <token>"` thay vì cắt lấy token). | Dùng `authHeader.split(' ')[1]` để tách lấy đúng chuỗi JWT sau từ khóa `Bearer`. |
| 5 | **Không inject được JwtService trong NotificationsModule** | Quên `imports: [AuthModule]` trong `NotificationsModule`. | Vì `AuthModule` có `exports: [JwtModule]`, nên `NotificationsModule` bắt buộc phải `imports: [AuthModule]` thì Guard mới inject được `JwtService`. |
