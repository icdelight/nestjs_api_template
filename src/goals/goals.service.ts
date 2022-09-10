import { BadRequestException, ConflictException, ForbiddenException, HttpException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GoalsDto } from "../auth/dto";
import { AddGoalsDto } from "../auth/dto";
import { EditGoalsDto } from "../auth/dto";
import * as argon from "argon2";
import { empty, PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_users } from '@prisma/client';
import { isNull } from "util";


function recurseTree(allGoal,parent) {
    let obj = [];
    let ChildGoal = [];
    let parentGoal = {};
    let parentKey = {};
    let resTree = [];
    let indikator = [];
    let style_col = {};

    Object.keys(allGoal[parent]).forEach(function(key) {
        obj = allGoal[key];
        if(!parentGoal[key] && key != "0") {
            parentGoal[key] = {};
        }
    });
    let idx = "0";
    if(Object.keys(allGoal[parent])) {
        Object.keys(allGoal[parent]).forEach(function(key) {
            obj = allGoal[parent][key];
            ChildGoal = [];
            Object.keys(obj).forEach(async function(keys) {
                if(obj[keys] !== null && keys.length <= 3 && parentGoal[keys]) {
                }else{
                    parentGoal[key]["id_goals"] = obj['id_goals'];
                    parentGoal[key]["title_goals"] = obj['title_goals'];
                    parentGoal[key]["desc_goals"] = obj['desc_goals'];
                    parentGoal[key]["pic_goals"] = obj['pic_goals'];
                    parentGoal[key]["start_date"] = obj['start_date'];
                    parentGoal[key]["due_date"] = obj['due_date'];
                    parentGoal[key]["status_goals"] = obj['status_goals'];
                    parentGoal[key]["progress"] = obj['progress'];
                    parentGoal[key]["parent_goals"] = obj['parent_goals'];
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ?JSON.parse(obj['type_goals']):style_col;
                    parentGoal[key]["last_modified_date"] = obj['firstName'];
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ?JSON.parse(obj['indikator']):indikator;
                }
            });

            if(allGoal[key]) {
                // console.log('all',allGoal[key]);
                ChildGoal =  recurseTree(allGoal,key);
                parentGoal[key]["children"] = ChildGoal;
            }
            idx = key;

        resTree.push(parentGoal[key]);
        });
    }
    return resTree;
}

function recurseTreeAdmin(allGoal,parent) {
    let obj = [];
    let ChildGoal = [];
    let parentGoal = {};
    let parentKey = {};
    let resTree = [];
    let indikator = [];
    let style_col = {};

    Object.keys(allGoal[parent]).forEach(function(key) {
        obj = allGoal[key];
        if(!parentGoal[key] && key != "0") {
            parentGoal[key] = {};
        }
    });
    let idx = "0";
    if(Object.keys(allGoal[parent])) {
        Object.keys(allGoal[parent]).forEach(function(key) {
            obj = allGoal[parent][key];
            ChildGoal = [];
            Object.keys(obj).forEach(async function(keys) {
                if(obj[keys] !== null && parentGoal[keys]) {
                }else{
                    parentGoal[key]["id"] = obj['id'];
                    parentGoal[key]["title"] = obj['title'];
                    parentGoal[key]["description"] = obj['description'];
                    parentGoal[key]["pic"] = obj['pic'];
                    parentGoal[key]["start_date"] = obj['start_date'];
                    parentGoal[key]["due_date"] = obj['due_date'];
                    parentGoal[key]["status_goals"] = obj['status_goals'];
                    parentGoal[key]["progress"] = obj['progress'];
                    parentGoal[key]["parent"] = obj['parent'];
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ?JSON.parse(obj['type_goals']):style_col;
                    parentGoal[key]["last_modified_date"] = obj['last_modified_date'];
                    parentGoal[key]["firstName"] = obj['name'];
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ?JSON.parse(obj['indikator']):indikator;
                }
            });

            if(allGoal[key]) {
                // console.log('all',allGoal[key]);
                ChildGoal =  recurseTreeAdmin(allGoal,key);
                parentGoal[key]["children"] = ChildGoal;
            }
            idx = key;
        // console.log(parentGoal[key]);
        resTree.push(parentGoal[key]);
        });
    }
    // console.log(resTree);
    return resTree;
}

@Injectable()
export class GoalsService {
    constructor(private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {}
    
    async allgoal(user: tbl_users) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        // if(user.role != "1" && user.role != "2") {
        //     throw new ForbiddenException('You dont have privileges.');
        // }
        let allGoal = null;
        let topGoal = null;
        let childGoal = null;
        try {
            topGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals : 0,
                }
            });
            childGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals : 1,
                }
            });
            // let newChildGoal = [];
            // let i = 0;
            // childGoal.forEach(element => {
            //     // console.log(element);
            //     if(element.parent_goals === 1) {
            //         i++;
            //         let newChild = null;
            //         let childGoal = this.goalbyparentRec(user,element.id_goals).then(function(response) {
            //             element['children'] = response;
            //             newChild = element;
            //             newChild.children.push(newChildGoal);
            //             // console.log(newChildGoal);
            //         });
            //     }
            // });

            // console.log(newChildGoal);
            topGoal[0]['children'] = childGoal;
            // childGoals.push(topGoal[0]);
            // console.log(topGoal[0]);
            allGoal = topGoal[0];
            if(allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }else{
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":allGoal};
        return result;
    }

    async alltreegoal(user: tbl_users) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;let result = null;
        if(user.role != "1" && user.role != "2" ) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allGoal = {};
        let topGoal = null;
        let resTree = [];
        try {
            topGoal = await this.prisma.tbl_goals.findMany({
                select:{
                    id_goals: true,
                    title_goals: true,
                    desc_goals: true,
                    pic_goals: true,
                    start_date: true,
                    due_date: true,
                    status_goals: true,
                    progress: true,
                    parent_goals: true,
                    type_goals: true,
                    last_modified_date: true,
                    indikator: true,
                },
                orderBy:{
                    parent_goals: 'asc',
                }
            });
            let parent_id = 0;
            
            if(topGoal && topGoal.length > 0) {
                topGoal.forEach(element => {
                    if(element !== null) {
                        if(element.parent_goals != parent_id || parent_id == 0) {
                            allGoal[element.parent_goals] = {};
                        }
                        allGoal[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
                // console.log();
                let obj = [];
                parent_id = 0;
                let parentGoal = {};
                let ChildGoal = [];
                resTree = recurseTree(allGoal,"0");
                if(resTree[0] !== undefined) {
                    statusCode = 200;
                    message = "Success Inquiry Goals.";
                }else{
                    statusCode = 0;
                    message = "Failed Inquiry Goals.";
                }
            }else{
                statusCode = 0;
                message = "Failed Inquiry Goals, Empty goals.";
                resTree[0] = [];
            }
            result = {"statusCode":statusCode,"message":message,"data":resTree[0]};
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        return result;
    }

    async allgoaladmin(user: tbl_users) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allGoal = {};
        let topGoal = null;
        let resTree = [];
        let childGoal = null;
        try {
            // topGoal = await this.prisma.tbl_goals.findMany({
            //     where: {
            //         parent_goals : 0,
            //     }
            // });
            topGoal = await this.prisma.$queryRaw`select id_goals as id, title_goals as title, desc_goals as description, pic_goals as pic,b.firstName, start_date, due_date, status_goals, parent_goals as parent, type_goals, last_modified_date, progress, indikator from goals a inner join users b on a.pic_goals = b.name order by parent_goals asc;`;
            // console.log(topGoal);
            let parent_id = 0;
            if(topGoal && topGoal.length != 0) {
                topGoal.forEach(element => {
                    if(element !== null) {
                        if(element.parent != parent_id || parent_id == 0) {
                            allGoal[element.parent] = {};
                        }
                        allGoal[element.parent][element.id] = element;
                        parent_id = element.parent;
                    }
                });
                console.log(allGoal);
                let obj = [];
                parent_id = 0;
                let parentGoal = {};
                let ChildGoal = [];
                resTree = recurseTreeAdmin(allGoal,"0");
                allGoal = topGoal;
                if(resTree[0] !== undefined) {
                    statusCode = 200;
                    message = "Success Inquiry Goals.";
                }else{
                    statusCode = 0;
                    message = "Failed Inquiry Goals.";
                }
            }else{
                statusCode = 0;
                message = "Failed Inquiry Goals, Empty Goals.";
            }
        }catch(error) {
            console.log(error)
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":resTree};
        return result;
    }

    async goalbyparentRec(user: tbl_users, id_goals: number) {
        let allGoal = null;let allGoals = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals : id_goals,
                }
            })
            .then(res => {
                allGoals = res;
            });
        }catch(error) {
            throw new InternalServerErrorException(error);
            allGoals = null;
        }
        return allGoals;
    }

    async goalbyid(user: tbl_users, id_goals: number) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allGoal = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    id_goals : id_goals,
                }
            });
            if(allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }else{
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":allGoal};
        return result;
    }
    async goalbyparent(user: tbl_users, id_goals: number) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allGoal = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals : id_goals,
                }
            });
            if(allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }else{
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":allGoal};
        return result;
    }

    async addgoal(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let addGoal = null;
        try {
            addGoal = await this.prisma.tbl_goals.create({
                data: {
                    title_goals: dto.title_goals,
                    desc_goals: dto.desc_goals,
                    pic_goals: dto.pic_goals,
                    start_date: new Date(dto.start_date),
                    due_date: new Date(dto.due_date),
                    status_goals: Number("1"),
                    progress: Number("0"),
                    parent_goals: Number.isInteger(dto.parent_goals)?dto.parent_goals:Number(dto.parent_goals),
                    type_goals: dto.type_goals,
                    indikator: dto.indikator,
                }
            });
            if(addGoal) {
                statusCode = 200;
                message = "Success Add Goals.";
            }else{
                statusCode = 0;
                message = "Failed Add Goals.";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":addGoal};
        return result;
    }

    async editgoal(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        try {
            editGoal = await this.prisma.tbl_goals.updateMany({
                data: {
                    title_goals: dto.title_goals,
                    desc_goals: dto.desc_goals,
                    pic_goals: dto.pic_goals,
                    start_date: new Date(dto.start_date),
                    due_date: new Date(dto.due_date),
                    status_goals: Number.isInteger(dto.status)?dto.status:Number(dto.status),
                    type_goals: dto.type_goals,
                    indikator: dto.indikator,
                },
                where: {
                    id_goals : Number.isInteger(dto.id_goals)?dto.id_goals:Number(dto.id_goals),
                }
            });
            if(editGoal) {
                statusCode = 200;
                message = "Success Edit Goals.";
            }else{
                statusCode = 0;
                message = "Failed Edit Goals.";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":editGoal};
        return result;
    }

    async remapgoal(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        const newMap = JSON.parse(dto.NewMap);
        // console.log(newMap);
        try {
            for (const queryKey of Object.keys(newMap)) {
                const obj = newMap[queryKey];
                if(obj.parent_goals == '0' && obj.id_goals != '1') {
                    throw new BadRequestException('Parent node is cannot more than one');
                }
            }
            for (const queryKey of Object.keys(newMap)) {
                // console.log(queryKey,`${dto.NewMap[queryKey]}`);
                const obj = newMap[queryKey];
                // console.log(obj);
                editGoal = await this.prisma.$queryRaw`update goals set parent_goals = ${obj.parent_goals}, pic_goals = ${obj.pic_goals} where id_goals = ${obj.id_goals};`;
                // console.log(obj.id_goals,`update goals set parent_goals = ${obj.parent_goals}, pic_goals = ${obj.pic_goals} where id_goals = ${obj.id_goals};`);
            }
            
            if(editGoal) {
                statusCode = 200;
                message = "Success Edit Goals.";
            }else{
                statusCode = 0;
                message = "Failed Edit Goals.";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":editGoal};
        return result;
    }

    async delgoal(user: tbl_users, id_goals : number) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        let delGoal = null;
        try {
            delGoal = await this.prisma.tbl_goals.deleteMany({
                where: {
                    id_goals : id_goals,
                }
            });
            if(delGoal) {
                statusCode = 200;
                message = "Success Delete Goals.";
            }else{
                statusCode = 0;
                message = "Failed Delete Goals.";
            }
        }catch(error) {
            throw new InternalServerErrorException(error);
        }
        let result = {"statusCode":statusCode,"message":message,"data":delGoal};
        return delGoal;
    }
}
