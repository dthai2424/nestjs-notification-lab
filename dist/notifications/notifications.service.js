"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let NotificationsService = NotificationsService_1 = class NotificationsService {
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
        this.logger = new common_1.Logger(NotificationsService_1.name);
    }
    async sendToUser(dto, sender) {
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
    async sendToGroup(dto, sender) {
        this.logger.log(`Sender: ${sender?.email || 'Anonymous'} -> gửi email cho nhóm: ${dto.groupName}`);
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
            throw new common_1.NotFoundException(`Nhóm "${dto.groupName}" không tồn tại trong hệ thống.`);
        }
        const emails = group.members.map((m) => m.user.email);
        if (emails.length === 0) {
            throw new common_1.BadRequestException(`Nhóm "${dto.groupName}" hiện tại không có thành viên nào.`);
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
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = NotificationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map