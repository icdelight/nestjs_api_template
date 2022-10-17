import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, Post, Query, UseGuards, ParseIntPipe, BadRequestException, HttpException, Param, Head, Header, Res } from '@nestjs/common';
import { GoalsService } from "./goals.service";
import { tbl_users } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { AddGoalsDto, EditGoalsDto } from '../auth/dto';
import { JwtGuard } from '../auth/guard';
import { RemapsGoalDto } from 'src/auth/dto/remapgoals.dto';
import { Response } from 'express';

@UseGuards(JwtGuard)
@Controller('goals')
export class GoalsController {
    constructor(private goalService: GoalsService) {}

    @HttpCode(HttpStatus.OK)
    @Post('allgoals')
    allGoals(@GetUser() user: tbl_users) {
        return this.goalService.allgoal(user);
    }

    @HttpCode(HttpStatus.OK)
    @Get('initialgoals')
    initialGoals(@GetUser() user: tbl_users) {
        return this.goalService.initialGoals(user);
    }

    @HttpCode(HttpStatus.OK)
    @Get('initialgoalsadmin')
    initialGoalsAdmin(@GetUser() user: tbl_users) {
        return this.goalService.initialGoalsAdmin(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('childgoals')
    childGoals(@GetUser() user: tbl_users, @Body('parent_goals', ParseIntPipe) parent_goals: number) {
        return this.goalService.childGoals(user,parent_goals);
    }

    @HttpCode(HttpStatus.OK)
    @Post('alltreegoals')
    alltreeGoals(@GetUser() user: tbl_users) {
        return this.goalService.alltreegoal(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('allgoalsadmin')
    allGoalsAdmin(@GetUser() user: tbl_users) {
        return this.goalService.allgoaladmin(user);
    }

    @HttpCode(HttpStatus.OK)
    @Post('alltreegoalscluster')
    allGoalsCluster(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.goalService.alltreegoalcluster(user, dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('addgoals')
    addGoals(@GetUser() user: tbl_users, @Body() dto: AddGoalsDto) {
        // console.log('DTO', dto); return false;
        return this.goalService.addgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('editgoals')
    editGoals(@GetUser() user: tbl_users,  @Body() dto: EditGoalsDto) {
        // console.log(dto);
        // return true;
        /** JSON String to JSON object */
        dto.type_goals = JSON.parse(dto.type_goals.toString())
        dto.indikator = JSON.parse(dto.indikator.toString())
        /** JSON String to JSON object */
        return this.goalService.editgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('remapgoals')
    remapGoals(@GetUser() user: tbl_users,  @Body() dto: RemapsGoalDto) {
        // if(dto.NewMap == undefined || dto.NewMap == null) throw new BadRequestException("Data belum didefiniskan")
        // console.log(dto);
        return this.goalService.remapgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('treegoals')
    treeGoals(@GetUser() user: tbl_users, @Body() dto: any) {
        if(dto.parent_family == undefined || dto.parent_family == null) throw new BadRequestException("Parent Family belum didefinisikan")
        if (dto.id_goals == undefined || dto.id_goals == null) throw new BadRequestException("ID Goals belum didefinisikan")
        var parent_family = parseInt(dto.parent_family);
        var id_goals = parseInt(dto.id_goals);
        return this.goalService.treeGoal(user,parent_family, id_goals);
    }

    @HttpCode(HttpStatus.OK)
    @Post('treegoalsadmin')
    treeGoalsAdmin(@GetUser() user: tbl_users, @Body() dto: any) {
        if(dto.parent_family == undefined || dto.parent_family == null) throw new BadRequestException("Parent Family belum didefinisikan")
        if (dto.id_goals == undefined || dto.id_goals == null) throw new BadRequestException("ID Goals belum didefinisikan")
        var parent_family = parseInt(dto.parent_family);
        var id_goals = parseInt(dto.id_goals);
        return this.goalService.treeGoalAdmin(user,parent_family, id_goals);
    }

    @HttpCode(HttpStatus.OK)
    @Post('searchgoals')
    searchGoal(@GetUser() user: tbl_users,  @Body() dto: any) {
        return this.goalService.searchGoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Get('getstats')
    getStats(@GetUser() user: tbl_users) {
        return this.goalService.getStats(user);
    }

    @HttpCode(HttpStatus.OK)
    @Get('getlastmodifgoals')
    getModGoals(@GetUser() user: tbl_users) {
        return this.goalService.getLastModifiedGoals(user);
    }

    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'text/xlsx')
    @Get('downloadExcelGoal/:parent_family')
    async downloadExcelGoal(@GetUser() user: tbl_users,  @Param('parent_family', ParseIntPipe) parent_family: number, @Res() res: Response) {
    // downloadExcelGoal(@GetUser() user: tbl_users,  @Param('parent_family', ParseIntPipe) parent_family: number) {

        let result =  await this.goalService.downloadExcelGoal(user,parent_family);
        // return result;
        res.download(result as string)
    }

    @HttpCode(HttpStatus.OK)
    @Header('Content-Type', 'text/csv')
    @Get('downloadCsvGoal/:parent_family')
    async downloadCsvGoal(@GetUser() user: tbl_users,  @Param('parent_family', ParseIntPipe) parent_family: number, @Res() res: Response) {
    // downloadExcelGoal(@GetUser() user: tbl_users,  @Param('parent_family', ParseIntPipe) parent_family: number) {

        let result =  await this.goalService.downloadCsvGoal(user,parent_family);
        res.download(result as string)
    }
}
