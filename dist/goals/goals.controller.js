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
exports.GoalsController = void 0;
const common_1 = require("@nestjs/common");
const goals_service_1 = require("./goals.service");
const decorator_1 = require("../auth/decorator");
const dto_1 = require("../auth/dto");
const guard_1 = require("../auth/guard");
const remapgoals_dto_1 = require("../auth/dto/remapgoals.dto");
let GoalsController = class GoalsController {
    constructor(goalService) {
        this.goalService = goalService;
    }
    allGoals(user) {
        return this.goalService.allgoal(user);
    }
    initialGoals(user) {
        return this.goalService.initialGoals(user);
    }
    initialGoalsAdmin(user) {
        return this.goalService.initialGoalsAdmin(user);
    }
    childGoals(user, parent_goals) {
        return this.goalService.childGoals(user, parent_goals);
    }
    alltreeGoals(user) {
        return this.goalService.alltreegoal(user);
    }
    allGoalsAdmin(user) {
        return this.goalService.allgoaladmin(user);
    }
    allGoalsCluster(user, dto) {
        return this.goalService.alltreegoalcluster(user, dto);
    }
    addGoals(user, dto) {
        return this.goalService.addgoal(user, dto);
    }
    editGoals(user, dto) {
        dto.type_goals = JSON.parse(dto.type_goals.toString());
        dto.indikator = JSON.parse(dto.indikator.toString());
        return this.goalService.editgoal(user, dto);
    }
    remapGoals(user, dto) {
        return this.goalService.remapgoal(user, dto);
    }
    treeGoals(user, dto) {
        if (dto.parent_family == undefined || dto.parent_family == null)
            throw new common_1.BadRequestException("Parent Family belum didefinisikan");
        if (dto.id_goals == undefined || dto.id_goals == null)
            throw new common_1.BadRequestException("ID Goals belum didefinisikan");
        var parent_family = parseInt(dto.parent_family);
        var id_goals = parseInt(dto.id_goals);
        return this.goalService.treeGoal(user, parent_family, id_goals);
    }
    treeGoalsAdmin(user, dto) {
        if (dto.parent_family == undefined || dto.parent_family == null)
            throw new common_1.BadRequestException("Parent Family belum didefinisikan");
        if (dto.id_goals == undefined || dto.id_goals == null)
            throw new common_1.BadRequestException("ID Goals belum didefinisikan");
        var parent_family = parseInt(dto.parent_family);
        var id_goals = parseInt(dto.id_goals);
        return this.goalService.treeGoalAdmin(user, parent_family, id_goals);
    }
    searchGoal(user, dto) {
        return this.goalService.searchGoal(user, dto);
    }
    getStats(user) {
        return this.goalService.getStats(user);
    }
    getModGoals(user) {
        return this.goalService.getLastModifiedGoals(user);
    }
    async downloadExcelGoal(user, parent_family, res) {
        let result = await this.goalService.downloadExcelGoal(user, parent_family);
        res.download(result);
    }
    async downloadCsvGoal(user, parent_family, res) {
        let result = await this.goalService.downloadCsvGoal(user, parent_family);
        res.download(result);
    }
};
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('allgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "allGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('initialgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "initialGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('initialgoalsadmin'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "initialGoalsAdmin", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('childgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)('parent_goals', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "childGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('alltreegoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "alltreeGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('allgoalsadmin'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "allGoalsAdmin", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('alltreegoalscluster'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "allGoalsCluster", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('addgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.AddGoalsDto]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "addGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('editgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.EditGoalsDto]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "editGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('remapgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, remapgoals_dto_1.RemapsGoalDto]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "remapGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('treegoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "treeGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('treegoalsadmin'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "treeGoalsAdmin", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Post)('searchgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "searchGoal", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('getstats'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "getStats", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Get)('getlastmodifgoals'),
    __param(0, (0, decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "getModGoals", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Content-Type', 'text/xlsx'),
    (0, common_1.Get)('downloadExcelGoal/:parent_family'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('parent_family', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "downloadExcelGoal", null);
__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Content-Type', 'text/csv'),
    (0, common_1.Get)('downloadCsvGoal/:parent_family'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('parent_family', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "downloadCsvGoal", null);
GoalsController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('goals'),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
exports.GoalsController = GoalsController;
//# sourceMappingURL=goals.controller.js.map