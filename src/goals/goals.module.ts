import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { JwtStrategy } from "../auth/strategy";
import { GoalRepository } from './goals.repository';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
    imports: [
        JwtModule.register({}),
    ],
    controllers: [GoalsController],
    providers: [GoalsService,GoalRepository,JwtStrategy],
})
export class GoalsModule {}
