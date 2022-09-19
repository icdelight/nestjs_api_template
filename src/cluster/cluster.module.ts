import { Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { ClusterController } from './cluster.controller';
import { ClusterServices } from './cluster.service';
import { JwtStrategy } from "../auth/strategy";

@Module({
    imports: [
        JwtModule.register({}),
    ],
    controllers: [ClusterController],
    providers: [ClusterServices,JwtStrategy],
  })
  export class ClusterModule {};