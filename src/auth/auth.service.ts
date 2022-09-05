import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import { UserDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthServices{
    constructor(private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {}
    
    async signup(dto : UserDto) {
        let statusCode = 999;
        let message = "Something went wrong";
        // generate password hash
        const hash = await argon.hash(dto.pass);
        let user = null;
        const checkUser = await this.prisma.tbl_users.count({where: {name : {equals:dto.user}}});
        if(checkUser > 0) {
            throw new ForbiddenException('User already taken.')
        }
        try {
            user = await this.prisma.tbl_users.create({
                data: {
                    name : dto.user,
                    pass : hash,
                    role : dto.role,
                    flag_active : true,
                    firstName: dto.firstname,
                },
                select: {
                    id_user: true,
                    name: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true,
                }
            })
            if(user) {
                statusCode = 200;
                message = "Success to signup.";
            }else{
                statusCode = 0;
                message = "Failed to signup.";
            }
        }catch(error) {
            if(error instanceof PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken.')
                }
            }
        }
        let result = {"statusCode":statusCode,"message":message};
        //return saved user
        return result;
    }
    async signToken(userId : number, user: string, role: string): Promise<{ access_token : string }> {
        const payload = { 
            sub: userId,
            user, 
            role
        }
        const secret = this.config.get("JWT_SECRET"); 
        const token = await this.jwt.signAsync(payload,{expiresIn:"60m", secret: secret});
        return {
            access_token : token,
        }; 
    } 
    async signin(dto : AuthDto){
        let statusCode = 999;
        let message = "Something went wrong";
        //find user
        const user = await this.prisma.tbl_users.findFirst({
            where : {
                name : dto.user,
                flag_active: true,
            }
        })
        // const user = await this.prisma.$queryRaw`SELECT name,pass,flag_active,createdAt,updatedAt,firstName,lastName,apps,role,a.id_area as id_area,desc_area,a.id_sub_area as id_sub_area,desc_sub_area,id_parent_area FROM users a INNER JOIN mst_area b ON a.id_sub_area = b.id_sub_area WHERE a.name = ${dto.user} and a.flag_active = 1;`;
        //if user doesnt exist
        if(!user) {
            throw new ForbiddenException('Credential incorrect.');
        }
        //find menu 
        const menu = await this.prisma.tbl_menu.findMany({
            where : {
                role : user.role,
            }
        })
        //compare password
        const passMatch = await argon.verify(user.pass,dto.pass);
        //if password incorrect 
        if(!passMatch) {
            throw new ForbiddenException('Credential incorrect.');
        }
        //send back user
        // delete user.pass;
        const tokens = await this.signToken(user.id_user, user.name, user.role);
        const userData = {
            id : user.id_user,
            name: user.name,
            role: user.role === '1' ? 'superadmin' : user.role === '2' ? 'editor' : 'viewer',
            email: user.firstName,
            fullname: `${user.firstName} ${user.lastName !== null ? user.lastName : '' }`,
            id_area : user.id_area,
            id_sub_area : user.id_sub_area,
        };
        if(tokens.access_token.length != 0) {
            statusCode = 200;
            message = "Success login.";
        }else{
            statusCode = 0;
            message = "Failed login.";
        }
        const resdata = {"statusCode":statusCode,"message":message,tokens,userData};
        return resdata
    }
}