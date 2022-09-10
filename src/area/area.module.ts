import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { AreaController } from './area.controller';
import { AreaServices } from './area.service';
import { JwtStrategy } from "../auth/strategy";

@Module({
  imports: [
      JwtModule.register({}),
  ],
  controllers: [AreaController],
  providers: [AreaServices,JwtStrategy],
})
export class AreaModule {}
