import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
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
    // console.log(resArea);
    return resArea;
}

@Injectable()
export class AreaServices{
    constructor(private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {}

    async getAllArea(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        // console.log(dto);
        if(user.role != '1' && dto.id_area != undefined && user.id_area != dto.id_area) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let topArea = [];
        try {
            // console.log(user.role);
            if(dto.id_area != undefined && user.role == '1') {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_sub_area != ${dto.id_sub_area} order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${dto.id_area} order by a.id_area asc, a.id_parent_area asc;`);
            }else if(user.role == '2') {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND a.id_sub_area != ${dto.id_sub_area} order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} order by a.id_area asc, a.id_parent_area asc;`);
            }else {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area order by a.id_area asc, a.id_parent_area asc;`);
            }
            
            if(topArea) {
                statusCode = 200;
                message = "Success inquiry area";
                data = topArea;
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllParentArea(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.role != '1' && dto.id_area != undefined && user.id_area != dto.id_area) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let topArea = [];
        try {
            // console.log(user.role);
            if(dto.id_area != undefined && user.role == '1') {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_parent_area in ('0','1') order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${dto.id_area} AND a.id_sub_area = ${dto.id_area} order by a.id_area asc, a.id_parent_area asc;`);
            }else if(user.role == '2') {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND a.id_sub_area = ${dto.id_area} order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND a.id_sub_area = ${dto.id_area} order by a.id_area asc, a.id_parent_area asc;`);
            }else {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area order by a.id_area asc, a.id_parent_area asc;`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area order by a.id_area asc, a.id_parent_area asc;`);
            }
            
            if(topArea) {
                statusCode = 200;
                message = "Success inquiry area";
                data = topArea;
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllAreaByPage(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let where = "";
        if(user.role == "2") {
            where = `WHERE a.id_area = ${user.id_area} `;
        }
        let topArea = [];
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        if(dto.page != undefined && dto.page != '') {
            offset = perPage*(dto.page-1);
            limit = offset + perPage;
        }
        try {
            if(user.role == "2") {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND a.id_sub_area != ${user.id_area} AND a.id_parent_area != '' order by a.id_area asc, a.id_parent_area asc limit ${offset},${limit};`;
            }else{
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area order by a.id_area asc, a.id_parent_area asc limit ${offset},${limit};`;
            }
            if(topArea) {
                if(topArea.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry area";
                    data = topArea;
                }else{
                    statusCode = 0;
                    message = `Failed inquiry area, no data found at page : ${dto.page}`;
                }
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllAreaByName(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let where = "";
        if(user.role == "2") {
            where = `WHERE a.id_area = ${user.id_area} `;
        }
        let topArea = [];
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        let filter = "";
        // console.log(dto);
        // const param = JSON.parse(dto);
        if(dto.search != undefined && dto.search != '') {
            filter = '%' + dto.search + '%';
        }
        if(dto.page != undefined && dto.page != '') {
            offset = perPage*(dto.page-1);
            limit = offset + perPage;
        }
        try {
            if(user.role == "2") {
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND a.id_parent_area != '' AND (a.desc_area like ${filter} OR a.desc_sub_area like ${filter} OR b.desc_sub_area like ${filter}) order by a.id_area asc, a.id_parent_area asc limit ${offset},${limit};`;
            }else{
                topArea = await this.prisma.$queryRaw`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE (a.desc_area like ${filter} OR a.desc_sub_area like ${filter} OR b.desc_sub_area like ${filter}) order by a.id_area asc, a.id_parent_area asc limit ${offset},${limit};`;
                // console.log(`SELECT a.*,b.desc_sub_area as desc_parent_area FROM mst_area a LEFT JOIN mst_area b ON a.id_parent_area = b.id_sub_area WHERE (a.desc_area like ${filter} OR a.desc_sub_area like ${filter}) order by a.id_area asc, a.id_parent_area asc limit ${offset},${limit};`);
            }
            // console.log(topArea);
            if(topArea) {
                if(topArea.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry area";
                    data = topArea;
                }else{
                    statusCode = 0;
                    message = `Failed inquiry area, no data found at page : ${dto.page}, filter : ${dto.search}`;
                }
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllAreaTree(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allArea = {};
        let topArea = [];
        let parent_id = 0;
        let resArea = [];
        try {
            if(user.role == "2") {
                topArea = await this.prisma.mst_area.findMany({
                    where: {
                        id_area: user.id_area,
                    },
                    orderBy:{
                        id_parent_area: 'asc',
                    }
                });
            }else{
                topArea = await this.prisma.mst_area.findMany({
                    orderBy:{
                        id_parent_area: 'asc',
                    }
                });
            }
            topArea.forEach(element => {
                if(element !== null) {
                    if(element.id_parent_area != parent_id || parent_id == 0) {
                        allArea[element.id_parent_area] = {};
                    }
                    allArea[element.id_parent_area][element.id_sub_area] = element;
                    parent_id = element.id_parent_area;
                }
            });
            resArea = recurseArea(allArea,"0");
            if(resArea) {
                statusCode = 200;
                message = "Success inquiry area";
                data = resArea;
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getParentArea(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let where = "";
        if(user.role == "2") {
            where = `AND id_area = ${user.id_area}`;
        }
        let allArea = [];
        let topArea = [];
        let parent_id = 0;
        let resArea = [];
        try {
            // topArea = await this.prisma.mst_area.findMany();
            topArea = await this.prisma.$queryRaw`SELECT * FROM mst_area where id_parent_area in (1,0) {where}`;
            // console.log(topArea);
            topArea.forEach(element => {
                if(element !== null) {
                    if(element.id_parent_area != parent_id || parent_id == 0) {
                        allArea[element.id_parent_area] = {};
                    }
                    allArea[element.id_parent_area][element.id_area] = element;
                    parent_id = element.id_parent_area;
                }
            });
            // console.log(allArea);
            resArea = recurseArea(allArea,"0");

            if(resArea[0]) {
                statusCode = 200;
                message = "Success inquiry area";
                data = resArea[0];
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async addArea(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.')
        }
        if(user.id_area != dto.id_area && user.id_area == 2) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let addArea = null;
        
        try {
            addArea = await this.prisma.mst_area.create({
                data: {
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                    desc_area: dto.desc_area,
                    desc_sub_area: dto.desc_sub_area,
                    id_parent_area: Number.isInteger(dto.id_parent_area) ? dto.id_parent_area : Number(dto.id_parent_area),
                    active: Number.isInteger(dto.active) ? dto.active : Number(dto.active),
                }
            })

            if(addArea) {
                statusCode = 200;
                message = "Success inquiry area";
                data = addArea;
            }else{
                statusCode = 0;
                message = "Failed inquiry area";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async addRegion(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.')
        }
        let addArea = null;
        let lastIdArea = null;
        let lastIdReg = null;
        try {
            lastIdArea = await this.prisma.mst_area.findFirst({
                select:{
                    id_area: true,
                    id_sub_area: true,
                    id_parent_area: true,
                },
                orderBy:{
                    id_sub_area: 'desc',
                }
            });
            if(lastIdArea.id_sub_area !== undefined) {
                const newIdArea = Number(lastIdArea.id_sub_area) + 1;
                addArea = await this.prisma.mst_area.create({
                    data: {
                        id_area: newIdArea,
                        id_sub_area: newIdArea,
                        desc_area: dto.desc_area,
                        desc_sub_area: dto.desc_area,
                        id_parent_area: 1,
                        active: Number.isInteger(dto.active) ? dto.active : Number(dto.active),
                    }
                })

                if(addArea) {
                    statusCode = 200;
                    message = "Success inquiry area";
                    data = addArea;
                }else{
                    statusCode = 0;
                    message = "Failed inquiry area";
                }
            }else{
                throw new InternalServerErrorException('Something went wrong.');
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async editArea(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2" ) {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.id_area != dto.id_area && user.id_area != 1) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editArea = null;
        
        try {
            editArea = await this.prisma.mst_area.updateMany({
                data: {
                    desc_sub_area: dto.desc_sub_area,
                    id_parent_area: Number.isInteger(dto.id_parent_area) ? dto.id_parent_area : Number(dto.id_parent_area),
                    active: Number.isInteger(dto.active) ? dto.active : Number(dto.active),
                },
                where : {
                    id_sub_area: Number.isInteger(dto.id_sub_area) ? dto.id_area : Number(dto.id_sub_area),
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                }
            })
            if(editArea) {
                if(editArea.count == 0) {
                    statusCode = 0;
                    message = "Failed edit area, combination of area and sub area not valid.";
                    data = editArea;
                } else {
                    statusCode = 200;
                    message = "Success edit area";
                    data = editArea;
                }
            }else{
                statusCode = 0;
                message = "Failed edit area";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

}