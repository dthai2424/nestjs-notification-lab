import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class SanitizeContentPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // =========================================================================
    // TODO: [BÀI TẬP 2] - Hoàn thiện SanitizeContentPipe
    // Mục tiêu:
    // 1. Kiểm tra nếu value là object và có thuộc tính 'content' (chuỗi nội dung email):
    //    a. Loại bỏ các thẻ <script> nguy hiểm bằng Regex:
    //       value.content = value.content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    //    b. Trim khoảng trắng thừa ở 2 đầu: value.content = value.content.trim();
    //    c. Kiểm tra nếu sau khi làm sạch mà content rỗng:
    //       ném new BadRequestException('Nội dung email không được để trống sau khi làm sạch')
    // 2. Bắt buộc phải return value (dữ liệu sau khi làm sạch để truyền tiếp vào Controller)
    // =========================================================================

    return value;
  }
}
