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
exports.AuthServices = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const runtime_1 = require("@prisma/client/runtime");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
let AuthServices = class AuthServices {
    constructor(config, prisma, jwt) {
        this.config = config;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async signup(dto) {
        let statusCode = 999;
        let message = "Something went wrong";
        const hash = await argon.hash(dto.pass);
        let user = null;
        const checkUser = await this.prisma.tbl_users.count({ where: { name: { equals: dto.user } } });
        if (checkUser > 0) {
            throw new common_1.ForbiddenException('User already taken.');
        }
        try {
            user = await this.prisma.tbl_users.create({
                data: {
                    name: dto.user,
                    pass: hash,
                    role: '4',
                    flag_active: true,
                    firstName: dto.firstname,
                },
                select: {
                    id_user: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            });
            console.info(user);
            if (user) {
                statusCode = 200;
                message = "Success to signup.";
            }
            else {
                statusCode = 0;
                message = "Failed to signup.";
            }
        }
        catch (error) {
            if (error instanceof runtime_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new common_1.ForbiddenException('Credential taken.');
                }
            }
        }
        let result = { "statusCode": statusCode, "message": message };
        return result;
    }
    async signToken(userId, user, role) {
        const payload = {
            sub: userId,
            user,
            role
        };
        const secret = this.config.get("JWT_SECRET");
        const token = await this.jwt.signAsync(payload, { expiresIn: "1000m", secret: secret });
        return {
            access_token: token,
        };
    }
    ;
    async signin(dto) {
        let statusCode = 999;
        let message = "Something went wrong";
        const user = await this.prisma.$queryRaw `SELECT a.*,b.role_name as role_name,c.desc_area as desc_area,c.desc_sub_area as desc_sub_area FROM users a INNER JOIN roles b ON a.role = b.id_role LEFT JOIN mst_area c ON a.id_sub_area = c.id_sub_area WHERE a.name = ${dto.user} and a.flag_active = 1;`;
        if (!user || user.length <= 0) {
            throw new common_1.ForbiddenException('Credential incorrect.');
        }
        const passMatch = await argon.verify(user[0].pass, dto.pass);
        if (!passMatch) {
            throw new common_1.ForbiddenException('Credential incorrect.');
        }
        const tokens = await this.signToken(user[0].id_user, user[0].name, user[0].role);
        const userData = {
            id: user[0].id_user,
            name: user[0].name,
            role: user[0]["role_name"],
            email: user[0].firstName,
            fullname: `${user[0].firstName} ${user[0].lastName !== null ? user[0].lastName : ''}`,
            id_area: user[0].id_area,
            desc_area: user[0]['desc_area'],
            id_sub_area: user[0].id_sub_area,
            desc_sub_area: user[0]['desc_sub_area'],
        };
        if (tokens.access_token.length != 0) {
            statusCode = 200;
            message = "Success login.";
        }
        else {
            statusCode = 0;
            message = "Failed login.";
        }
        const resdata = { "statusCode": statusCode, "message": message, tokens, userData };
        return resdata;
    }
    ;
};
AuthServices = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService, prisma_service_1.PrismaService, jwt_1.JwtService])
], AuthServices);
exports.AuthServices = AuthServices;
//# sourceMappingURL=auth.service.js.map