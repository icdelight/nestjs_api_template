import { UserServices } from "./user.service";
import { tbl_users } from '@prisma/client';
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
    getAllUserByPage(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    findUserByName(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    getAllMenu(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
    manageuser(user: tbl_users, dto: any): Promise<{
        statusCode: number;
        message: string;
        data: any;
    }>;
}
