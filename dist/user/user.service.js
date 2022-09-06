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
exports.UserServices = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
function recurseArea(allArea, parent) {
    let obj = [];
    let ChildArea = [];
    let parentArea = {};
    let parentKey = {};
    let resArea = [];
    let indikator = [];
    let style_col = {};
    Object.keys(allArea[parent]).forEach(function (key) {
        obj = allArea[key];
        if (!parentArea[key] && key != "0") {
            parentArea[key] = {};
        }
    });
    let idx = "0";
    if (Object.keys(allArea[parent]) && Object.keys(allArea[parent]).length > 0) {
        Object.keys(allArea[parent]).forEach(function (key) {
            obj = allArea[parent][key];
            ChildArea = [];
            Object.keys(obj).forEach(async function (keys) {
                if (obj[keys] !== null && keys.length <= 3 && parentArea[keys]) {
                }
                else {
                    parentArea[key]["id_area"] = obj['id_area'];
                    parentArea[key]["id_sub_area"] = obj['id_sub_area'];
                    parentArea[key]["desc_area"] = obj['desc_area'];
                    parentArea[key]["desc_sub_area"] = obj['desc_sub_area'];
                    parentArea[key]["id_parent_area"] = obj['id_parent_area'];
                    parentArea[key]["active"] = obj['active'];
                }
            });
            if (allArea[key]) {
                ChildArea = recurseArea(allArea, key);
                parentArea[key]["children"] = ChildArea;
            }
            idx = key;
            resArea.push(parentArea[key]);
        });
    }
    return resArea;
}
let UserServices = class UserServices {
    constructor(config, prisma, jwt) {
        this.config = config;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async manageuser(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let updusers = null;
        const checkUser = await this.prisma.tbl_users.count({ where: { name: { equals: dto.user } } });
        if (checkUser == 0) {
            throw new common_1.ForbiddenException('User not found.');
        }
        let flag = false;
        if (dto.active.match("1") || dto.active.match("0")) {
            if (dto.active == "1") {
                flag = true;
            }
        }
        else {
            throw new common_1.BadRequestException('Active must be 1 or 0.');
        }
        let roles = "1";
        if (dto.role.match("1") || dto.role.match("2")) {
            roles = dto.role;
        }
        else {
            throw new common_1.BadRequestException('Roles must be 1 or 2.');
        }
        try {
            updusers = await this.prisma.tbl_users.updateMany({
                data: {
                    role: roles,
                    flag_active: flag,
                    id_area: dto.area,
                    id_sub_area: dto.subarea,
                    firstName: dto.firstname,
                    lastName: dto.lastname,
                    apps: dto.apps,
                },
                where: {
                    name: dto.user,
                }
            });
            if (updusers) {
                statusCode = 200;
                message = "Success manage user.";
            }
            else {
                statusCode = 0;
                message = "Failed manage user.";
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async getAllUsers(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let users = null;
        users = await this.prisma.$queryRaw `SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1;`;
        if (users) {
            statusCode = 200;
            message = "Success inquiry user";
            data = users;
        }
        else {
            statusCode = 0;
            message = "Failed inquiry user";
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async getAllArea(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let allArea = [];
        let topArea = [];
        let parent_id = 0;
        let resArea = [];
        try {
            topArea = await this.prisma.mst_area.findMany();
            topArea.forEach(element => {
                if (element !== null) {
                    if (element.id_parent_area != parent_id || parent_id == 0) {
                        allArea[element.id_parent_area] = {};
                    }
                    allArea[element.id_parent_area][element.id_area] = element;
                    parent_id = element.id_parent_area;
                }
            });
            resArea = recurseArea(allArea, "0");
            if (resArea[0]) {
                statusCode = 200;
                message = "Success inquiry area";
                data = resArea[0];
            }
            else {
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
    async getAllMenu(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let menus = null;
        menus = await this.prisma.$queryRaw `SELECT a.id_menu,a.menu_name,a.menu_link,b.role_name FROM menu a INNER JOIN roles b ON a.id_menu = b.id_menu WHERE b.id_role = ${user.role}`;
        if (menus) {
            statusCode = 200;
            message = "Success inquiry menus.";
            data = menus;
        }
        else {
            statusCode = 0;
            message = "Failed inquiry menus.";
        }
        let result = { "statusCode": statusCode, "message": message, "data": data };
        return result;
    }
};
UserServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService, jwt_1.JwtService])
], UserServices);
exports.UserServices = UserServices;
//# sourceMappingURL=user.service.js.map