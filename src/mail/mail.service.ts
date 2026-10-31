import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;
  private isSimulationMode = false;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey || apiKey.startsWith('re_sample')) {
      this.logger.warn('⚠️ RESEND_API_KEY không có hoặc là key mẫu. MailService sẽ chạy ở chế độ MÔ PHỎNG (Simulation Mode).');
      this.isSimulationMode = true;
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(to: string | string[], subject: string, content: string) {
    this.logger.log(`📧 Đang gửi email tới: ${Array.isArray(to) ? to.join(', ') : to} | Tiêu đề: "${subject}"`);

    // Chế độ mô phỏng khi học viên không có key thật
    if (this.isSimulationMode) {
      // Giả lập độ trễ mạng 200ms
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        id: `mock_email_${Date.now()}`,
        from: 'onboarding@resend.dev',
        to,
        subject,
        status: 'delivered',
        simulated: true,
      };
    }

    // Gọi API Resend thật
    const { data, error } = await this.resend.emails.send({
      from: 'Notification Lab <onboarding@resend.dev>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: `<p>${content}</p>`,
    });

    if (error) {
      this.logger.error(`❌ Gửi email qua Resend thất bại: ${error.message}`);
      throw new Error(`Resend API Error: ${error.message}`);
    }

    return data;
  }
}
