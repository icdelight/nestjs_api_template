import { GoalsService } from "./goals.service";
import { tbl_users } from '@prisma/client';
import { AddGoalsDto, EditGoalsDto } from '../auth/dto';
import { RemapsGoalDto } from 'src/auth/dto/remapgoals.dto';
import { Response } from 'express';
export declare class GoalsController {
    private goalService;
    constructor(goalService: GoalsService);
    allGoals(user: tbl_users): Promise<{
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
    childGoals(user: tbl_users, parent_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    alltreeGoals(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    allGoalsAdmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    allGoalsCluster(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addGoals(user: tbl_users, dto: AddGoalsDto): Promise<{
        statusCode: number;
        message: string;
    }>;
    editGoals(user: tbl_users, dto: EditGoalsDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    remapGoals(user: tbl_users, dto: RemapsGoalDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    treeGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    treeGoalsAdmin(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    searchGoal(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getStats(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getModGoals(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    downloadExcelGoal(user: tbl_users, parent_family: number, res: Response): Promise<void>;
    downloadCsvGoal(user: tbl_users, parent_family: number, res: Response): Promise<void>;
}
