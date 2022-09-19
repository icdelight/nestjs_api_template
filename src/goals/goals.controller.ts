import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Req, Post, Query, UseGuards, ParseIntPipe, BadRequestException, HttpException } from '@nestjs/common';
import { GoalsService } from "./goals.service";
import { AuthGuard } from '@nestjs/passport';
import { tbl_users } from '@prisma/client';
import { query, Request } from 'express';
import { GetUser } from '../auth/decorator';
import { AddGoalsDto, EditGoalsDto } from '../auth/dto';
import { JwtGuard } from '../auth/guard';

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
    @Post('addgoals')
    addGoals(@GetUser() user: tbl_users, @Body() dto: AddGoalsDto) {
        // console.log('DTO', dto); return false;
        return this.goalService.addgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('editgoals')
    editGoals(@GetUser() user: tbl_users,  @Body() dto: EditGoalsDto) {
        // console.log(dto);
        // const req = JSON.parse(dto);
        // console.log(dto.id_goals);
        // return true;
        return this.goalService.editgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('remapgoals')
    remapGoals(@GetUser() user: tbl_users,  @Body() dto: any) {
        // console.log(dto);
        return this.goalService.remapgoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('treegoals')
    treeGoals(@GetUser() user: tbl_users,  @Body('parent_family', ParseIntPipe) dto: any) {
        return this.goalService.treeGoal(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('searchgoals')
    searchGoal(@GetUser() user: tbl_users,  @Body('searchTerm') searchTerm: string) {
        return this.goalService.searchGoal(user,searchTerm);
    }

}
