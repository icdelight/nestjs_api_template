import { GoalsService } from "./goals.service";
import { tbl_users } from '@prisma/client';
export declare class GoalsController {
    private goalService;
    constructor(goalService: GoalsService);
    allGoals(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    alltreeGoals(user: tbl_users): Promise<any>;
    allGoalsAdmin(user: tbl_users): Promise<{
        statusCode: number;
        message: string;
        data: any[];
    }>;
    addGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    remapGoals(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
