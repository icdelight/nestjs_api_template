import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';
export declare class ClusterServices {
    private config;
    private prisma;
    private jwt;
    constructor(config: ConfigService, prisma: PrismaService, jwt: JwtService);
    getAllCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllClusterByPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllClusterByName(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
