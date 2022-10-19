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
exports.ClusterServices = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let ClusterServices = class ClusterServices {
    constructor(config, prisma, jwt) {
        this.config = config;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    ;
    async getAllCluster(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let topCluster = [];
        try {
            console.log(user.role);
            topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_area order by a.id_cluster asc;`;
            if (topCluster) {
                statusCode = 200;
                message = "Success inquiry cluster";
                data = topCluster;
            }
            else {
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async getAllClusterByPage(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let topCluster = [];
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        if (dto.page != undefined && dto.page != '') {
            offset = perPage * (dto.page - 1);
            limit = offset + perPage;
        }
        try {
            if (user.role == "2") {
                topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} order by a.id_area asc limit ${offset},${limit};`;
            }
            else {
                topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area order by a.id_area asc limit ${offset},${limit};`;
            }
            if (topCluster) {
                if (topCluster.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry cluster";
                    data = topCluster;
                }
                else {
                    statusCode = 0;
                    message = `Failed inquiry cluster, no data found at page : ${dto.page}`;
                }
            }
            else {
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async getAllClusterByName(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let where = "";
        if (user.role != "1") {
            where = `WHERE a.id_area = ${user.id_area} `;
        }
        let topCluster = [];
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        let filter = "";
        if (dto.search != undefined && dto.search != '') {
            filter = '%' + dto.search + '%';
        }
        if (dto.page != undefined && dto.page != '') {
            offset = perPage * (dto.page - 1);
            limit = offset + perPage;
        }
        try {
            if (user.role != "1") {
                if (dto.search != undefined && dto.search != '') {
                    topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`;
                }
                else {
                    topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} order by a.id_area asc limit ${offset},${limit};`;
                }
            }
            else {
                if (dto.search != undefined && dto.search != '') {
                    topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`;
                }
                else {
                    topCluster = await this.prisma.$queryRaw `SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area order by a.id_area asc limit ${offset},${limit};`;
                }
            }
            if (topCluster) {
                if (topCluster.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry cluster";
                    data = topCluster;
                }
                else {
                    statusCode = 0;
                    message = `Failed inquiry cluster, no data found at page : ${dto.page}, filter : ${dto.search}`;
                }
            }
            else {
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async addCluster(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        if (user.id_area != dto.id_area && user.id_area == 2) {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let addArea = null;
        try {
            addArea = await this.prisma.tbl_cluster.create({
                data: {
                    nama_cluster: dto.nama_cluster,
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                    id_sub_areas: dto.id_sub_areas,
                    flag_active: Number.isInteger(dto.flag_active) ? dto.active : Number(dto.flag_active),
                    createdAt: new Date(dto.createdAt),
                }
            });
            if (addArea) {
                statusCode = 200;
                message = "Success add cluster";
                data = addArea;
            }
            else {
                statusCode = 0;
                message = "Failed add cluster";
            }
        }
        catch (error) {
            console.log(error);
            statusCode = 500;
            message = error.message;
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async editCluster(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        if (user.id_area != dto.id_area && user.id_area != 1) {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let editClust = null;
        console.log(dto);
        try {
            editClust = await this.prisma.tbl_cluster.updateMany({
                data: {
                    nama_cluster: dto.nama_cluster,
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                    flag_active: Number.isInteger(dto.flag_active) ? dto.active : Number(dto.flag_active),
                },
                where: {
                    id_cluster: Number.isInteger(dto.id_cluster) ? dto.id_cluster : Number(dto.id_cluster),
                }
            });
            if (editClust) {
                if (editClust.count == 0) {
                    statusCode = 0;
                    message = "Failed edit cluster.";
                    data = editClust;
                }
                else {
                    statusCode = 200;
                    message = "Success edit cluster";
                    data = editClust;
                }
            }
            else {
                statusCode = 0;
                message = "Failed edit cluster";
            }
        }
        catch (error) {
            console.log(error);
            statusCode = 500;
            message = error.message;
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
};
ClusterServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService, jwt_1.JwtService])
], ClusterServices);
exports.ClusterServices = ClusterServices;
//# sourceMappingURL=cluster.service.js.map