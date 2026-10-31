import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UseInterceptors,
  UseFilters,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { NotificationsService } from './notifications.service';
import { SendUserDto } from './dto/send-user.dto';
import { SendGroupDto } from './dto/send-group.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SanitizeContentPipe } from './pipes/sanitize-content.pipe';
import { ResponseTimeInterceptor } from './interceptors/response-time.interceptor';
import { NotificationExceptionFilter } from './filters/notification-exception.filter';

// =============================================================================
// TODO [BÀI TẬP 3 & 4]:
// 1. Gắn @UseInterceptors(ResponseTimeInterceptor) ở cấp Controller
// 2. Gắn @UseFilters(NotificationExceptionFilter) ở cấp Controller
// =============================================================================
@Controller('notifications')
// @UseInterceptors(ResponseTimeInterceptor) // <-- Bỏ comment khi làm xong Bài 3
// @UseFilters(NotificationExceptionFilter)   // <-- Bỏ comment khi làm xong Bài 4
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // ===========================================================================
  // Route gửi email cho cá nhân
  // TODO [BÀI TẬP 1 & 2]:
  // 1. Gắn @UseGuards(JwtAuthGuard) để yêu cầu đăng nhập
  // 2. Gắn @UsePipes(new SanitizeContentPipe()) để làm sạch nội dung email
  // ===========================================================================
  @Post('user')
  // @UseGuards(JwtAuthGuard) // <-- Bỏ comment khi làm xong Bài 1
  // @UsePipes(new SanitizeContentPipe()) // <-- Bỏ comment khi làm xong Bài 2
  async sendToUser(@Body() body: SendUserDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToUser(body, sender);
  }

  // ===========================================================================
  // Route gửi email cho cả Group
  // TODO [BÀI TẬP 1 & 2]:
  // 1. Gắn @UseGuards(JwtAuthGuard) để yêu cầu đăng nhập
  // 2. Gắn @UsePipes(new SanitizeContentPipe()) để làm sạch nội dung email
  // ===========================================================================
  @Post('group')
  // @UseGuards(JwtAuthGuard) // <-- Bỏ comment khi làm xong Bài 1
  // @UsePipes(new SanitizeContentPipe()) // <-- Bỏ comment khi làm xong Bài 2
  async sendToGroup(@Body() body: SendGroupDto, @Req() req: Request): Promise<any> {
    const sender = req['user'];
    return this.notificationsService.sendToGroup(body, sender);
  }
}
