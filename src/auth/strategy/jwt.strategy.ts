import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { validate } from "class-validator";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
    constructor(config: ConfigService, private prisma : PrismaService) {
        super ({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get("JWT_SECRET"),
        })
    }

    async validate(payload : {sub: number, user: string}) {
        // console.log({payload}); 
        const user = await this.prisma.tbl_users.findUnique({
            where: {
                id_user : payload.sub,
            } 
        })
        if(user) {
            delete user.pass;
        }
        return user;
    }
}