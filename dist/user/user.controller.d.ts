import { UserServices } from "./user.service";
import { tbl_users } from '@prisma/client';
import { UserDetDto } from '../auth/dto';
export declare class UserController {
    private userService;
    constructor(userService: UserServices);
    getMe(user: tbl_users): tbl_users;
    editUser(): void;
    getAllUser(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllArea(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllMenu(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    manageuser(user: tbl_users, dto: UserDetDto): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
