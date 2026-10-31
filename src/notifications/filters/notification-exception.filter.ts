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

    // =========================================================================
    // TODO: [BÀI TẬP 4] - Hoàn thiện NotificationExceptionFilter
    // Mục tiêu:
    // 1. Phân loại lỗi:
    //    - Nếu là HttpException (do Guard hoặc Validation ném ra): giữ nguyên status và message của exception.
    //    - Nếu là Error thông thường (lỗi ngoại vi do Resend SDK ném ra):
    //      + Đặt status = HttpStatus.UNPROCESSABLE_ENTITY (422)
    //      + Đặt message = (exception as Error).message hoặc thông báo lỗi tùy biến
    // 2. Trả về định dạng JSON chuẩn hóa:
    //    response.status(status).json({
    //      statusCode: status,
    //      timestamp: new Date().toISOString(),
    //      path: request.url,
    //      error: 'MailServiceError' hoặc exception name,
    //      message,
    //    });
    // =========================================================================

    // Tạm thời xử lý lỗi mặc định
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : (exception as Error).message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
