import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "../auth/dto";
import { UserDetDto } from "../auth/dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';

function recurseArea(allArea,parent) {
    let obj = [];
    let ChildArea = [];
    let parentArea = {};
    let parentKey = {};
    let resArea = [];
    let indikator = [];
    let style_col = {};

    Object.keys(allArea[parent]).forEach(function(key) {
        obj = allArea[key];
        if(!parentArea[key] && key != "0") {
            parentArea[key] = {};
        }
    });
    let idx = "0";
    if(Object.keys(allArea[parent]) && Object.keys(allArea[parent]).length > 0) {
        // console.log(Object.keys(allArea[parent]));
        Object.keys(allArea[parent]).forEach(function(key) {
            obj = allArea[parent][key];
            ChildArea = [];
            Object.keys(obj).forEach(async function(keys) {
                if(obj[keys] !== null && keys.length <= 3 && parentArea[keys]) {
                }else{
                    parentArea[key]["id_area"] = obj['id_area'];
                    parentArea[key]["id_sub_area"] = obj['id_sub_area'];
                    parentArea[key]["desc_area"] = obj['desc_area'];
                    parentArea[key]["desc_sub_area"] = obj['desc_sub_area'];
                    parentArea[key]["id_parent_area"] = obj['id_parent_area'];
                    parentArea[key]["active"] = obj['active'];
                }
            });

            if(allArea[key]) {
                // console.log('all',allGoal[key]);
                ChildArea =  recurseArea(allArea,key);
                parentArea[key]["children"] = ChildArea;
            }
            idx = key;

        resArea.push(parentArea[key]);
        });
    }
    return resArea;
}

@Injectable()
export class UserServices{
    constructor(private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {}
    async manageuser(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        console.log(dto);
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let updusers = null;
        const checkUser = await this.prisma.tbl_users.count({where: {name : {equals:dto.user}}});
        if(checkUser == 0) {
            throw new ForbiddenException('User not found.')
        }
        let flag = false;
        if(dto.active.match("1") || dto.active.match("0")) {
            if(dto.active == "1") {
                flag = true;
            }
        }else{
            throw new BadRequestException('Active must be 1 or 0.');
        }
        let roles = "1";
        // if(dto.role.match("1") || dto.role.match("2")) {
            roles = dto.role;
        // }else{
        //     throw new BadRequestException('Roles must be 1 or 2.');
        // }
        try {
            updusers = await this.prisma.tbl_users.updateMany({
                data: {
                    role : roles,
                    flag_active : flag,
                    id_area : Number.isInteger(dto.area) ? dto.area : Number(dto.area),
                    id_sub_area : Number.isInteger(dto.subarea) ? dto.subarea : Number(dto.subarea),
                    firstName : dto.firstname,
                    lastName : dto.lastname,
                    apps : dto.apps,
                },
                where: {
                    name : dto.user,
                }
            });
            if(updusers) {
                statusCode = 200;
                message = "Success manage user.";
            }else{
                statusCode = 0;
                message = "Failed manage user.";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllUsers(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.')
        }
        let users = null;
        if(user.role == '1') {
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1;`;
        }else{
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1 AND (a.id_area = ${user.id_area} OR a.id_area is null);`;
        }
        
        if(users) {
            statusCode = 200;
            message = "Success inquiry user";
            data = users;
        }else{
            statusCode = 0;
            message = "Failed inquiry user";
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllUsersByPage(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.')
        }
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        if(dto.page != undefined && dto.page != '') {
            offset = perPage*(dto.page-1);
            limit = offset + perPage;
        }
        let users = null;
        if(user.role == '1') {
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1 order by id_user asc limit ${offset},${limit};`;
        }else{
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1 AND (a.id_area = ${user.id_area} OR a.id_area is null) order by id_user asc limit ${offset},${limit};`;
        }
        
        if(users) {
            if(users.length > 0) {
                statusCode = 200;
                message = "Success inquiry user";
                data = users;
            }else{
                statusCode = 0;
                message = `Failed inquiry user, no data found at page : ${dto.page}`;
            }
        }else{
            statusCode = 0;
            message = "Failed inquiry user";
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllUsersByName(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.')
        }
        let filter = "";
        // console.log(dto);
        // const param = JSON.parse(dto);
        if(dto.search != undefined && dto.search != '') {
            filter = '%' + dto.search + '%';
        }
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        if(dto.page != undefined && dto.page != '') {
            offset = perPage*(dto.page-1);
            limit = offset + perPage;
        }
        let users = null;
        if(user.role == '1') {
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1 AND (a.name like ${filter} OR a.firstName like ${filter} OR a.lastName like ${filter}) order by id_user asc limit ${offset},${limit};`;
        }else{
            users = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,c.role_name,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN roles c ON a.role = c.id_role LEFT JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.flag_active = 1 AND a.id_area = ${user.id_area} AND (a.name like ${filter} OR a.firstName like ${filter} OR a.lastName like ${filter}) order by id_user asc limit ${offset},${limit};`;
        }
        
        if(users) {
            if(users.length > 0) {
                statusCode = 200;
                message = "Success inquiry user";
                data = users;
            }else{
                statusCode = 0;
                message = `Failed inquiry user, no data found at page : ${dto.page}, filter : ${dto.search}`;
            }
        }else{
            statusCode = 0;
            message = "Failed inquiry user";
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllMenu(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let menus = null;
        menus = await this.prisma.$queryRaw`SELECT a.id_menu,a.menu_name,a.menu_link,b.role_name FROM menu a INNER JOIN roles b ON a.id_menu = b.id_menu WHERE b.id_role = ${user.role}`;
        if(menus) {
            statusCode = 200;
            message = "Success inquiry menus."
            data = menus;
        }else{
            statusCode = 0;
            message = "Failed inquiry menus."
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }
}