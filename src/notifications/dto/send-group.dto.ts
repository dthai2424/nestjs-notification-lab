import { IsNotEmpty, IsString } from 'class-validator';

export class SendGroupDto {
  @IsString({ message: 'Tên nhóm phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên nhóm không được để trống (ví dụ: DEV_TEAM)' })
  groupName: string;

  @IsString({ message: 'Tiêu đề email phải là chuỗi' })
  @IsNotEmpty({ message: 'Tiêu đề email không được để trống' })
  subject: string;

  @IsString({ message: 'Nội dung email phải là chuỗi' })
  @IsNotEmpty({ message: 'Nội dung email không được để trống' })
  content: string;
}
