import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { JwtStrategy } from "../auth/strategy";

@Module({
    imports: [
        JwtModule.register({}),
    ],
    controllers: [GoalsController],
    providers: [GoalsService,JwtStrategy],
})
export class GoalsModule {}
