import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GoalsModule } from './goals/goals.module';
import { AreaModule } from './area/area.module';
import { ClusterModule } from './cluster/cluster.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }), 
    AuthModule, 
    UserModule,
    PrismaModule,
    GoalsModule,
    AreaModule,
    ClusterModule,
  ],
})
export class AppModule {}
