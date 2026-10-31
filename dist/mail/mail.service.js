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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let MailService = MailService_1 = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(MailService_1.name);
        this.isSimulationMode = false;
        const apiKey = this.configService.get('RESEND_API_KEY');
        if (!apiKey || apiKey.startsWith('re_sample')) {
            this.logger.warn('⚠️ RESEND_API_KEY không có hoặc là key mẫu. MailService sẽ chạy ở chế độ MÔ PHỎNG (Simulation Mode).');
            this.isSimulationMode = true;
        }
        else {
            this.resend = new resend_1.Resend(apiKey);
        }
    }
    async sendEmail(to, subject, content) {
        this.logger.log(`📧 Đang gửi email tới: ${Array.isArray(to) ? to.join(', ') : to} | Tiêu đề: "${subject}"`);
        if (this.isSimulationMode) {
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
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map