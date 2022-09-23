import { AreaServices } from './area.service';
import { tbl_users } from '@prisma/client';
import { AreaDto } from '../auth/dto';
export declare class AreaController {
    private areaService;
    constructor(areaService: AreaServices);
    getAllArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllParentArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllAreaPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    findAreaPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllAreatTree(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllParentsArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addArea(user: tbl_users, dto: AreaDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    addRegion(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    editArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
