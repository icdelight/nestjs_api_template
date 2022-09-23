import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { AreaServices } from './area.service';
import { GetUser } from '../auth/decorator';
import { tbl_users } from '@prisma/client';
import { AreaDto } from '../auth/dto';


@UseGuards(JwtGuard)
@Controller('area')
export class AreaController {
    constructor(private areaService: AreaServices) {}
    
    @Post('allarea')
    getAllArea(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getAllArea(user,dto);
    }
    
    @Post('allparentarea')
    getAllParentArea(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getAllParentArea(user,dto);
    }

    @Post('allareapage')
    getAllAreaPage(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getAllAreaByPage(user,dto);
    }

    @Post('findareapage')
    findAreaPage(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getAllAreaByName(user,dto);
    }

    @Post('allareatree')
    getAllAreatTree(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getAllAreaTree(user,dto);
    }

    @Post('allareaparent')
    getAllParentsArea(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.getParentArea(user,dto);
    }

    @Post('addarea')
    addArea(@GetUser() user: tbl_users, @Body() dto: AreaDto) {
        return this.areaService.addArea(user,dto);
    }

    @Post('addregion')
    addRegion(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.addRegion(user,dto);
    }

    @Post('editarea')
    editArea(@GetUser() user: tbl_users, @Body() dto: any) {
        return this.areaService.editArea(user,dto);
    }
    
}