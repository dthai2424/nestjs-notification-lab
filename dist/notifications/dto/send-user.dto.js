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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendUserDto = void 0;
const class_validator_1 = require("class-validator");
class SendUserDto {
}
exports.SendUserDto = SendUserDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'Email người nhận không hợp lệ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email người nhận không được để trống' }),
    __metadata("design:type", String)
], SendUserDto.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Tiêu đề email phải là chuỗi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tiêu đề email không được để trống' }),
    __metadata("design:type", String)
], SendUserDto.prototype, "subject", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Nội dung email phải là chuỗi' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Nội dung email không được để trống' }),
    __metadata("design:type", String)
], SendUserDto.prototype, "content", void 0);
//# sourceMappingURL=send-user.dto.js.map