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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStateController = void 0;
const common_1 = require("@nestjs/common");
const user_state_service_1 = require("./user-state.service");
let UserStateController = class UserStateController {
    constructor(userStateService) {
        this.userStateService = userStateService;
    }
    findAll() {
        return this.userStateService.findAll();
    }
    getStats() {
        return this.userStateService.getStats();
    }
    findByUserId(userId) {
        return this.userStateService.findByUserId(userId);
    }
    updateState(body) {
        return this.userStateService.updateState(body.userId, body.ruleResult);
    }
};
exports.UserStateController = UserStateController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserStateController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserStateController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(":userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserStateController.prototype, "findByUserId", null);
__decorate([
    (0, common_1.Post)("update"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserStateController.prototype, "updateState", null);
exports.UserStateController = UserStateController = __decorate([
    (0, common_1.Controller)("user-state"),
    __metadata("design:paramtypes", [user_state_service_1.UserStateService])
], UserStateController);
//# sourceMappingURL=user-state.controller.js.map