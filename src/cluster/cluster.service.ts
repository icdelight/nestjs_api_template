import { ForbiddenException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';


@Injectable()
export class ClusterServices{
    constructor(private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {};
    async getAllCluster(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        // if(user.role != "1" && user.role != "2") {
        //     throw new ForbiddenException('You dont have privileges.');
        // }
        // if(user.role != '1') {
        //     throw new ForbiddenException('You dont have privileges.');
        // }
        let topCluster = [];
        try {
            console.log(user.role);
            topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_area order by a.id_cluster asc;`;
            // console.log(`SELECT a.*,b.desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_area order by a.id_cluster asc;`);
            
            if(topCluster) {
                statusCode = 200;
                message = "Success inquiry cluster";
                data = topCluster;
            }else{
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }catch(error) {
            console.log(error);
            
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllClusterByPage(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let topCluster = [];
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        if(dto.page != undefined && dto.page != '') {
            offset = perPage*(dto.page-1);
            limit = offset + perPage;
        }
        try {
            if(user.role == "2") {
                topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} order by a.id_area asc limit ${offset},${limit};`;
            }else{
                topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area order by a.id_area asc limit ${offset},${limit};`;
            }
            if(topCluster) {
                if(topCluster.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry cluster";
                    data = topCluster;
                }else{
                    statusCode = 0;
                    message = `Failed inquiry cluster, no data found at page : ${dto.page}`;
                }
            }else{
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async getAllClusterByName(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        // if(user.role != "1" && user.role != "2") {
        //     throw new ForbiddenException('You dont have privileges.');
        // }
        let where = "";
        if(user.role != "1") {
            where = `WHERE a.id_area = ${user.id_area} `;
        }
        let topCluster = [];
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
            if(user.role != "1") {
                if(dto.search != undefined && dto.search != '') {
                    topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`;
                    // console.log(`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} AND (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`);
                }else{
                    topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE a.id_area = ${user.id_area} order by a.id_area asc limit ${offset},${limit};`;
                }
            }else{
                if(dto.search != undefined && dto.search != '') {
                    topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`;
                    // console.log(`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`);
                }else{
                    topCluster = await this.prisma.$queryRaw`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area order by a.id_area asc limit ${offset},${limit};`;
                    // console.log(`SELECT a.*,b.desc_area as desc_area FROM cluster a LEFT JOIN mst_area b ON a.id_area = b.id_sub_area WHERE (a.nama_cluster like ${filter} OR b.desc_area like ${filter}) order by a.id_area asc limit ${offset},${limit};`);
                }
            }
            // console.log(topCluster);
            if(topCluster) {
                if(topCluster.length > 0) {
                    statusCode = 200;
                    message = "Success inquiry cluster";
                    data = topCluster;
                }else{
                    statusCode = 0;
                    message = `Failed inquiry cluster, no data found at page : ${dto.page}, filter : ${dto.search}`;
                }
            }else{
                statusCode = 0;
                message = "Failed inquiry cluster";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async addCluster(user: tbl_users,dto : any) {
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
            addArea = await this.prisma.tbl_cluster.create({
                data: {
                    nama_cluster: dto.nama_cluster,
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                    id_sub_areas: dto.id_sub_areas,
                    flag_active: Number.isInteger(dto.flag_active) ? dto.active : Number(dto.flag_active),
                    createdAt: new Date(dto.createdAt),
                }
            })

            if(addArea) {
                statusCode = 200;
                message = "Success add cluster";
                data = addArea;
            }else{
                statusCode = 0;
                message = "Failed add cluster";
            }
        }catch(error) {
            console.log(error);
            statusCode = 500;
            message = error.message;
            // throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }

    async editCluster(user: tbl_users,dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2" ) {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.id_area != dto.id_area && user.id_area != 1) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editClust = null;
        console.log(dto);
        try {
            editClust = await this.prisma.tbl_cluster.updateMany({
                data: {
                    nama_cluster: dto.nama_cluster,
                    id_area: Number.isInteger(dto.id_area) ? dto.id_area : Number(dto.id_area),
                    // id_sub_areas: dto.id_sub_areas=='' ? JSON.parse('[]') : dto.id_sub_areas,
                    flag_active: Number.isInteger(dto.flag_active) ? dto.active : Number(dto.flag_active),
                },
                where : {
                    id_cluster: Number.isInteger(dto.id_cluster) ? dto.id_cluster : Number(dto.id_cluster),
                }
            })
            if(editClust) {
                if(editClust.count == 0) {
                    statusCode = 0;
                    message = "Failed edit cluster.";
                    data = editClust;
                } else {
                    statusCode = 200;
                    message = "Success edit cluster";
                    data = editClust;
                }
            }else{
                statusCode = 0;
                message = "Failed edit cluster";
            }
        }catch(error) {
            console.log(error);
            statusCode = 500;
            message = error.message;
            // throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":data};
        return result;
    }
}   