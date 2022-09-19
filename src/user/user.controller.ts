import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { UserServices } from "./user.service";
import { AuthGuard } from '@nestjs/passport';
import { tbl_users } from '@prisma/client';
import { Request } from 'express';
import { GetUser } from '../auth/decorator';
import { UserDetDto } from '../auth/dto';
import { JwtGuard } from '../auth/guard';


@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserServices) {}
    @Get('whome')
    getMe(@GetUser() user: tbl_users) {
        return user;
    }

    @Patch()
    editUser() {
         
    }
    
    @Post('allusers')
    getAllUser(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.userService.getAllUsers(user,dto);
    }

    @Post('alluserspage')
    getAllUserByPage(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.userService.getAllUsersByPage(user,dto);
    }

    @Post('finduserspage')
    findUserByName(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.userService.getAllUsersByName(user,dto);
    }

    @Get('allmenus')
    getAllMenu(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.userService.getAllMenu(user,dto);
    }

    @HttpCode(HttpStatus.OK)
    @Post('manageuser')
    manageuser(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.userService.manageuser(user,dto);
    }
    
}
 