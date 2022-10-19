import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_goals, tbl_users } from '@prisma/client';
import { GoalRepository } from "./goals.repository";
export declare class GoalsService {
    private goalRepo;
    private config;
    private prisma;
    private jwt;
    constructor(goalRepo: GoalRepository, config: ConfigService, prisma: PrismaService, jwt: JwtService);
    allgoal(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    alltreegoal(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    allgoaladmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    alltreegoalcluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    goalbyparentRec(user: tbl_users, id_goals: number): Promise<any>;
    goalbyid(user: tbl_users, id_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    goalbyparent(user: tbl_users, id_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    editgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    remapgoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    delgoal(user: tbl_users, id_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    initialGoals(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    initialGoalsAdmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    childGoals(user: tbl_users, parent_goals: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    subchildGoals(parent_goals: any): Promise<tbl_goals[] | []>;
    treeGoal(user: tbl_users, parent_family: any, id_goals: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    treeGoalAdmin(user: tbl_users, parent_family: any, id_goals: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    searchGoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    downloadExcelGoal(user: tbl_users, parent_family: Number): Promise<unknown>;
    downloadCsvGoal(user: tbl_users, parent_family: Number): Promise<unknown>;
    private buildSheet;
    private styleSheet;
    getStats(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getLastModifiedGoals(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
