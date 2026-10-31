import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendUserDto {
  @IsEmail({}, { message: 'Email người nhận không hợp lệ' })
  @IsNotEmpty({ message: 'Email người nhận không được để trống' })
  to: string;

  @IsString({ message: 'Tiêu đề email phải là chuỗi' })
  @IsNotEmpty({ message: 'Tiêu đề email không được để trống' })
  subject: string;

  @IsString({ message: 'Nội dung email phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung email không được để trống' })
  content: string;
}
