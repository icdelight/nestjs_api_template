import { PrismaService } from "../prisma/prisma.service";
import { UserDetDto } from "../auth/dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';
export declare class UserServices {
    private config;
    private prisma;
    private jwt;
    constructor(config: ConfigService, prisma: PrismaService, jwt: JwtService);
    manageuser(user: tbl_users, dto: UserDetDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllUsers(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllMenu(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
