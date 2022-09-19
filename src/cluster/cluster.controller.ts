import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ClusterServices } from './cluster.service';
import { GetUser } from '../auth/decorator';
import { tbl_users } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('cluster')
export class ClusterController {
    constructor(private clusterService: ClusterServices) {}
    
    @Post('allcluster')
    GetAllCluster(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.clusterService.getAllCluster(user,dto);
    }
    
    @Post('allclusterpage')
    GetAllClusterByPage(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.clusterService.getAllClusterByPage(user,dto);
    }
    
    @Post('findclusterpage')
    FindClusterByPage(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.clusterService.getAllClusterByName(user,dto);
    }
    
    @Post('addcluster')
    AddCluster(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.clusterService.addCluster(user,dto);
    }
    
    @Post('editcluster')
    EditCluster(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.clusterService.editCluster(user,dto);
    }
}