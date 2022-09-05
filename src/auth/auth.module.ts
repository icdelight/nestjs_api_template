import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthServices } from "./auth.service";
import { JwtStrategy } from "./strategy";

@Module({
    imports: [
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthServices, JwtStrategy],
})
export class AuthModule {}