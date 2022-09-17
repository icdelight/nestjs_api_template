import { GoalsService } from "./goals.service";
import { tbl_users } from '@prisma/client';
import { AddGoalsDto, EditGoalsDto } from '../auth/dto';
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
        data: import(".prisma/client").tbl_goals[];
    }>;
    childGoals(user: tbl_users, parent_goals: number): Promise<{
        statusCode: number;
        message: string;
        data: any[];
    }>;
    alltreeGoals(user: tbl_users): Promise<any>;
    allGoalsAdmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any[];
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
    remapGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    treeGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any[];
    }>;
}
