import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';
export declare class GoalsService {
    private config;
    private prisma;
    private jwt;
    constructor(config: ConfigService, prisma: PrismaService, jwt: JwtService);
    allgoal(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    alltreegoal(user: tbl_users): Promise<any>;
    allgoaladmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any[];
    }>;
    goalbyparentRec(user: tbl_users, id_goals: number): Promise<any>;
    goalbyid(user: tbl_users, id_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    goalbyparent(user: tbl_users, id_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    remapgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    delgoal(user: tbl_users, id_goals: number): Promise<any>;
}
