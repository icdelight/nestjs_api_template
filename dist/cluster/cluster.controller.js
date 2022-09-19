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
exports.ClusterController = void 0;
const common_1 = require("@nestjs/common");
const guard_1 = require("../auth/guard");
const cluster_service_1 = require("./cluster.service");
const decorator_1 = require("../auth/decorator");
let ClusterController = class ClusterController {
    constructor(clusterService) {
        this.clusterService = clusterService;
    }
    GetAllCluster(user, dto) {
        return this.clusterService.getAllCluster(user, dto);
    }
    GetAllClusterByPage(user, dto) {
        return this.clusterService.getAllClusterByPage(user, dto);
    }
    FindClusterByPage(user, dto) {
        return this.clusterService.getAllClusterByName(user, dto);
    }
    AddCluster(user, dto) {
        return this.clusterService.addCluster(user, dto);
    }
    EditCluster(user, dto) {
        return this.clusterService.editCluster(user, dto);
    }
};
__decorate([
    (0, common_1.Post)('allcluster'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClusterController.prototype, "GetAllCluster", null);
__decorate([
    (0, common_1.Post)('allclusterpage'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClusterController.prototype, "GetAllClusterByPage", null);
__decorate([
    (0, common_1.Post)('findclusterpage'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClusterController.prototype, "FindClusterByPage", null);
__decorate([
    (0, common_1.Post)('addcluster'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClusterController.prototype, "AddCluster", null);
__decorate([
    (0, common_1.Post)('editcluster'),
    __param(0, (0, decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ClusterController.prototype, "EditCluster", null);
ClusterController = __decorate([
    (0, common_1.UseGuards)(guard_1.JwtGuard),
    (0, common_1.Controller)('cluster'),
    __metadata("design:paramtypes", [cluster_service_1.ClusterServices])
], ClusterController);
exports.ClusterController = ClusterController;
//# sourceMappingURL=cluster.controller.js.map