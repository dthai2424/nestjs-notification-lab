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
  ) { }
  // =========================================================================
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

    /*
  // Lấy đối tượng request từ context
   context: thông tin về execution hiện tại
   switchToHttp(): nói với NestJS rằng ta đang xử lý HTTP request
   getRequest(): lấy object request của Express/Fastify
   Sau đó có thể dùng:
   request.headers
   request.body
   request.params
   request.query
   request.user
 */
    const request = context.switchToHttp().getRequest<Request>();

    // Trích xuất token từ header
    const authHeader = request.headers.authorization;

    // Kiểm tra nếu không có token hoặc không đúng định dạng là "Bearer <token>" theo chuẩn JWT thì ném ra UnauthorizedException
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token không tồn tại');
    }

    // Lấy type và token từ header, ví dụ: "Bearer <token>" -> type = "Bearer", token = "<token>"\
    const [type, token] = authHeader.split(' ');

    // Nếu token không hợp lệ Nestjs sẽ ném ra UnauthorizedException. Và ExceptionFilters ẽ bắt và trả về response 401 cho client. 
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });

    // Nếu Token không hợp lệ , ném ra UnauthorizedException


    // Gán payload vào request.user để các Controller có thể truy cập
    // thông tin người dùng đã được xác thực.
    // Lưu ý: user đã được khai báo bổ sung trong Express.Request interface
    // thông qua Declaration Merging. Vì Request là một interface, nên có thể mở rộng nó bằng cách khai báo lại interface Request trong src/types/express.d.ts
    // Mặc định Request không có thuộc tính user. Khi khai báo lại, ta thêm thuộc tính user với kiểu AuthUser vào Request. Việc khai báo này đã được thực hiện trong starter code.
    request.user = payload;


    // =========================================================================
    return true;
  }
}
