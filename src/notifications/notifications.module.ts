import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailModule } from '../mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResponseTimeInterceptor } from './interceptors/response-time.interceptor';
import { NotificationExceptionFilter } from './filters/notification-exception.filter';

@Module({
  imports: [MailModule, AuthModule],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    JwtAuthGuard,
    ResponseTimeInterceptor,
    NotificationExceptionFilter,
  ],
})
export class NotificationsModule {}
