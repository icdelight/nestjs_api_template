import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { UserController } from './user.controller';
import { UserServices } from './user.service';
import { JwtStrategy } from "../auth/strategy";

@Module({
  imports: [
      JwtModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserServices,JwtStrategy],
})
export class UserModule {}
