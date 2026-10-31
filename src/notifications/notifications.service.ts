import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { SendUserDto } from './dto/send-user.dto';
import { SendGroupDto } from './dto/send-group.dto';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendToUser(dto: SendUserDto, sender?: any): Promise<any> {
    this.logger.log(`Sender: ${sender?.email || 'Anonymous'} -> gửi email cho cá nhân: ${dto.to}`);
    
    const result = await this.mailService.sendEmail(dto.to, dto.subject, dto.content);

    return {
      type: 'SINGLE',
      sender: sender?.email || 'Anonymous',
      recipient: dto.to,
      subject: dto.subject,
      deliveryResult: result,
    };
  }

  async sendToGroup(dto: SendGroupDto, sender?: any): Promise<any> {
    this.logger.log(`Sender: ${sender?.email || 'Anonymous'} -> gửi email cho nhóm: ${dto.groupName}`);

    // Truy vấn nhóm và danh sách email thành viên trong database
    const group = await this.prisma.group.findUnique({
      where: { name: dto.groupName },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!group) {
      throw new NotFoundException(`Nhóm "${dto.groupName}" không tồn tại trong hệ thống.`);
    }

    const emails = group.members.map((m) => m.user.email);
    if (emails.length === 0) {
      throw new BadRequestException(`Nhóm "${dto.groupName}" hiện tại không có thành viên nào.`);
    }

    const result = await this.mailService.sendEmail(emails, dto.subject, dto.content);

    return {
      type: 'GROUP',
      groupName: dto.groupName,
      sender: sender?.email || 'Anonymous',
      totalRecipients: emails.length,
      recipients: emails,
      subject: dto.subject,
      deliveryResult: result,
    };
  }
}
