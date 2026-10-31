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
    // =========================================================================
    // TODO: [BÀI TẬP 1] - Hoàn thiện JwtAuthGuard
    // Mục tiêu:
    // 1. Lấy đối tượng request từ context (dùng context.switchToHttp().getRequest<Request>())
    // 2. Trích xuất token từ header: request.headers.authorization (định dạng "Bearer <token>")
    // 3. Nếu không có token -> ném ra new UnauthorizedException('Token không tồn tại')
    // 4. Giải mã token bằng: await this.jwtService.verifyAsync(token, { secret: ... })
    // 5. Gán payload giải mã được vào request['user'] = payload
    // 6. Trả về true để cho phép request đi tiếp.
    // =========================================================================

    // Tạm thời cho đi tiếp để app chạy khởi động (Học viên xoá dòng dưới và viết code TODO)
    return true;
  }
}
