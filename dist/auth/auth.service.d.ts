import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import { UserDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
export declare class AuthServices {
    private config;
    private prisma;
    private jwt;
    constructor(config: ConfigService, prisma: PrismaService, jwt: JwtService);
    signup(dto: UserDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    signToken(userId: number, user: string, role: string): Promise<{
        access_token: string;
    }>;
    signin(dto: AuthDto): Promise<{
        statusCode: number;
        message: string;
        tokens: {
            access_token: string;
        };
        userData: {
            id: number;
            name: string;
            role: string;
            email: string;
            fullname: string;
            id_area: number;
            id_sub_area: number;
        };
    }>;
}
