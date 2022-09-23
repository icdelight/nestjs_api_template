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
exports.AreaController = void 0;
const common_1 = require("@nestjs/common");
const guard_1 = require("../auth/guard");
const area_service_1 = require("./area.service");
const decorator_1 = require("../auth/decorator");
const dto_1 = require("../auth/dto");
let AreaController = class AreaController {
    constructor(areaService) {
        this.areaService = areaService;
    }
    getAllArea(user, dto) {
        return this.areaService.getAllArea(user, dto);
    }
    getAllParentArea(user, dto) {
        return this.areaService.getAllParentArea(user, dto);
    }
    getAllAreaPage(user, dto) {
        return this.areaService.getAllAreaByPage(user, dto);
    }
    findAreaPage(user, dto) {
        return this.areaService.getAllAreaByName(user, dto);
    }
    getAllAreatTree(user, dto) {
        return this.areaService.getAllAreaTree(user, dto);
    }
    getAllParentsArea(user, dto) {
        return this.areaService.getParentArea(user, dto);
    }
    addArea(user, dto) {
        return this.areaService.addArea(user, dto);
    }
    addRegion(user, dto) {
        return this.areaService.addRegion(user, dto);
    }
    editArea(user, dto) {
        return this.areaService.editArea(user, dto);
    }
};
__decorate([
    (0, common_1.Post)('allarea'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getAllArea", null);
__decorate([
    (0, common_1.Post)('allparentarea'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getAllParentArea", null);
__decorate([
    (0, common_1.Post)('allareapage'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getAllAreaPage", null);
__decorate([
    (0, common_1.Post)('findareapage'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "findAreaPage", null);
__decorate([
    (0, common_1.Post)('allareatree'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getAllAreatTree", null);
__decorate([
    (0, common_1.Post)('allareaparent'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "getAllParentsArea", null);
__decorate([
    (0, common_1.Post)('addarea'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AreaDto]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "addArea", null);
__decorate([
    (0, common_1.Post)('addregion'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "addRegion", null);
__decorate([
    (0, common_1.Post)('editarea'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AreaController.prototype, "editArea", null);
AreaController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('area'),
    __metadata("design:paramtypes", [area_service_1.AreaServices])
], AreaController);
exports.AreaController = AreaController;
//# sourceMappingURL=area.controller.js.map