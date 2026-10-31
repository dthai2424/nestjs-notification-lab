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
    // =========================================================================
    // TODO: [BÀI TẬP 3] - Hoàn thiện ResponseTimeInterceptor
    // Mục tiêu:
    // 1. Lưu mốc thời gian bắt đầu trước khi Controller xử lý: const now = Date.now();
    // 2. Can thiệp vào Observable sau khi Controller xử lý xong bằng toán tử map() của RxJS:
    //    return next.handle().pipe(
    //      map((data) => ({
    //        success: true,
    //        duration: `${Date.now() - now}ms`,
    //        data,
    //      })),
    //    );
    // =========================================================================

    return next.handle();
  }
}
