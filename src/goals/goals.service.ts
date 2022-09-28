import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_goals, tbl_users } from '@prisma/client';
import { GoalRepository } from "./goals.repository";

import { Workbook, Worksheet } from "exceljs";
import * as tmp from 'tmp';
import { writeFile } from "fs/promises";
import { resolve } from "path";
import { ExecFileException } from "child_process";

function response(statusCode: number, message: string, data:any)
{
    const response = {
        statusCode: statusCode,
        message: message,
        data: data
    };
    return response;
}

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
                    parentGoal[key]["id_cluster"] = obj['id_cluster'] !== "" && obj['id_cluster'] !== null ?(obj['id_cluster']):'';
                    parentGoal[key]["id_area"] = obj['id_area'] !== "" && obj['id_area'] !== null ?(obj['id_area']):'';
                    parentGoal[key]["clustered"] = obj['clustered'] !== "" && obj['clustered'] !== null ?(obj['clustered']):'';
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
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ? JSON.parse(obj['type_goals']):style_col;
                    parentGoal[key]["last_modified_date"] = obj['last_modified_date'];
                    parentGoal[key]["firstName"] = obj['name'];
                    parentGoal[key]["id_cluster"] = obj['id_cluster'] !== "" && obj['id_cluster'] !== null ?(obj['id_cluster']):'';
                    parentGoal[key]["id_area"] = obj['id_area'] !== "" && obj['id_area'] !== null ?(obj['id_area']):'';
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ? JSON.parse(obj['indikator']):indikator;
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

function recurseCluster(newObj,allGoal,obj,idxClust) {
    let resObj = [];
    for(let objPar in allGoal) {
        if(allGoal[objPar].hasOwnProperty(obj)) {
            // console.log('parent',objPar);
            // console.log('child',obj);
            if(!newObj[objPar] && !newObj.hasOwnProperty(objPar)) {
                newObj[objPar] = {};
            }
            if(!newObj[objPar].hasOwnProperty(obj)) {
                newObj[objPar][obj] = allGoal[objPar][obj];
                // console.log(objPar,Object.keys(newObj[objPar]));
                // console.log(newObj['1']['3']);
                resObj = Object.entries(newObj);
                const sorted = Object.keys(newObj)
                .sort()
                .reduce((accumulator, key) => {
                    accumulator[key] = newObj[key];

                    return accumulator;
                }, {});
                // console.log(sorted);
                // resObj.sort(function(a, b) {
                //     // console.log('a',a[0]);
                //     // console.log('b',b[0]);
                //     return Number(a[0]) - Number(b[0]);
                // });
                // console.log(resObj);
                newObj = sorted;
                // console.log(sorted['1']['3']);
                // console.log(idxClust);
                // console.log(objPar,idxClust.includes(objPar));
                if(!idxClust.includes(`${objPar}_${obj}`)) {
                    idxClust.push(`${objPar}_${obj}`);
                    // console.log('find pareng',`${objPar}_${obj}`);
                    recurseCluster(newObj,allGoal,objPar,idxClust);
                }
            }
        }
    }
    
    return newObj;
}

function convertToGoalsArray(tbl_goals, kodefikasi = 'GOAL')
{
    let resData = [];
    let i = 1;
    let finalData = {};
    tbl_goals.forEach(function(element) {
        var stringID = `${element.id_goals}`;
        finalData[stringID] = {};
        finalData[stringID]["id_goals"] = element.id_goals? element.id_goals : null;
        finalData[stringID]["issue_goals"] = element.issue_goals? element.issue_goals : null;
        finalData[stringID]["title_goals"] = element.title_goals? element.title_goals : null;
        finalData[stringID]["desc_goals"] = element.desc_goals ? element.desc_goals : null
        finalData[stringID]["parent_family"] = element.parent_family ? element.parent_family : null
        finalData[stringID]["title"] = element.title_goals? element.title_goals : null;
        finalData[stringID]["subtitle"] = element.desc_goals? element.desc_goals: null;
        finalData[stringID]["pic_goals"] = element.pic_goals? element.pic_goals : null;
        finalData[stringID]["start_date"] = element.start_date? element.start_date : null;
        finalData[stringID]["due_date"] = element.due_date? element.due_date : null;
        finalData[stringID]["status_goals"] = element.status_goals? element.status_goals : null;
        finalData[stringID]["progress"] = element.progress? element.progress : null;
        finalData[stringID]["parent_goals"] = element.parent_goals? element.parent_goals : null;
        finalData[stringID]["type_goals"] = element.type_goals? element.type_goals : null;
        finalData[stringID]["indikator"] = element.indikator? element.indikator : null;
        finalData[stringID]["kodefikasi"] = kodefikasi+ '-' + element.id_goals;
        finalData[stringID]['id_area'] = element.id_area;
        finalData[stringID]['id_cluster'] = element.id_cluster;
        finalData[stringID]['nama_cluster'] = element.tbl_cluster != null && element.tbl_cluster.nama_cluster != null ? element.tbl_cluster.nama_cluster : null;
        finalData[stringID]["children"] = []
        resData[stringID] = finalData[stringID]
        finalData = {}
    });
    
    return resData;
}

function recurseBuildTree(goals, parent, kodefikasi = 'GOAL')
{
    let final = [];
    let filterGoals = goals.filter( (element, idx, array) => {
        return element.parent_goals == parent;
    })
    let nextParent = null
    filterGoals.forEach((element,index,array) => {
        // console.log(element);
        nextParent = element.id_goals;
        final[(element.id_goals)] = {}
        final[(element.id_goals)]['id_goals'] = element.id_goals;
        final[(element.id_goals)]['parent_goals'] = element.parent_goals;
        final[(element.id_goals)]['parent_family'] = element.parent_family;
        final[(element.id_goals)]['issue_goals'] = element.issue_goals;
        final[(element.id_goals)]['title'] = element.title_goals;
        final[(element.id_goals)]['subtitle'] = element.desc_goals;
        final[(element.id_goals)]['title_goals'] = element.title_goals;
        final[(element.id_goals)]['desc_goals'] = element.desc_goals;
        final[(element.id_goals)]['pic_goals'] = element.pic_goals;
        final[(element.id_goals)]['start_date'] = element.start_date;
        final[(element.id_goals)]['due_date'] = element.due_date;
        final[(element.id_goals)]['status_goals'] = element.status_goals;
        final[(element.id_goals)]['indikator'] = element.indikator;
        final[(element.id_goals)]['type_goals'] = element.type_goals;
        final[(element.id_goals)]['id_area'] = element.id_area;
        final[(element.id_goals)]['id_cluster'] = element.id_cluster;
        final[(element.id_goals)]['nama_cluster'] = element.tbl_cluster != null && element.tbl_cluster.nama_cluster != null ? element.tbl_cluster.nama_cluster : null;
        final[(element.id_goals)]['kodefikasi'] = kodefikasi+ '-' + element.id_goals.toString();
        final[(element.id_goals)]['children'] = recurseBuildTree(goals,nextParent, kodefikasi+ '-' + element.id_goals.toString());
    });

    var filteredFinal = final.filter((el) => {
        return el != null;
    })
    return filteredFinal;
}
@Injectable()
export class GoalsService {
    constructor(private goalRepo: GoalRepository, private config: ConfigService, private prisma: PrismaService, private jwt: JwtService) {}
    
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
        return response(statusCode,message,allGoal);
    }
    async alltreegoal(user: tbl_users) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
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
                        if(!allGoal.hasOwnProperty(element.parent_goals)){
                            allGoal[element.parent_goals] = {}
                        }
                        allGoal[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
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
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        return response(statusCode,message,resTree);
    }
    async allgoaladmin(user: tbl_users) {
        console.log(user)
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
                        if(!allGoal.hasOwnProperty(element.parent)){
                            allGoal[element.parent] = {}
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
        return response(statusCode,message,resTree);
    }
    async alltreegoalcluster(user: tbl_users, dto: any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2" ) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let allGoal = {};
        let allGoalClust = {};
        let topGoal = null;
        let clustGoal = null;
        let resTree = [];
        let idxClust = [];
        try {
            clustGoal = await this.prisma.$queryRaw`SELECT *,'1' as clustered FROM goals WHERE id_cluster = ${dto.id_cluster} AND parent_family = ${dto.parent_family} ORDER BY parent_goals asc;`;
            // clustGoal = await this.prisma.tbl_goals.findMany({
            //     select:{
            //         id_goals: true,
            //         title_goals: true,
            //         desc_goals: true,
            //         pic_goals: true,
            //         start_date: true,
            //         due_date: true,
            //         status_goals: true,
            //         progress: true,
            //         parent_goals: true,
            //         type_goals: true,
            //         last_modified_date: true,
            //         indikator: true,
            //     },
            //     where:{
            //         id_cluster: Number.isInteger(dto.id_cluster) ? dto.id_cluster : Number(dto.id_cluster),
            //         parent_family: Number.isInteger(dto.parent_family) ? dto.parent_family : Number(dto.parent_family),
            //     },
            //     orderBy:{
            //         parent_goals: 'asc',
            //     }
            // });
            topGoal = await this.prisma.$queryRaw`SELECT *,'1' as clustered FROM goals WHERE parent_family = ${dto.parent_family} ORDER BY parent_goals asc;`;
            // topGoal = await this.prisma.tbl_goals.findMany({
            //     select:{
            //         id_goals: true,
            //         title_goals: true,
            //         desc_goals: true,
            //         pic_goals: true,
            //         start_date: true,
            //         due_date: true,
            //         status_goals: true,
            //         progress: true,
            //         parent_goals: true,
            //         type_goals: true,
            //         last_modified_date: true,
            //         indikator: true,
            //     },
            //     orderBy:{
            //         parent_goals: 'asc',
            //     }
            // });
            let parent_id = 0;
            if(topGoal && topGoal.length > 0) {
                topGoal.forEach(element => {
                    if(element !== null) {
                        if(!allGoal.hasOwnProperty(element.parent_goals)){
                            allGoal[element.parent_goals] = {}
                        }
                        allGoal[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
                clustGoal.forEach(element => {
                    idxClust.push(`${element.parent_goals}_${element.id_goals}`);
                    if(element !== null) {
                        if(!allGoalClust.hasOwnProperty(element.parent_goals)){
                            allGoalClust[element.parent_goals] = {}
                        }
                        allGoalClust[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
    
                let newObj = allGoalClust;
                console.log('all',allGoalClust);
                for(let obj in allGoalClust) {
                    // console.log('find parent',obj);
                    recurseCluster(newObj,allGoal,obj,idxClust);
                }
                console.log('cluster',newObj);
                let obj = [];
                parent_id = 0;
                let parentGoal = {};
                let ChildGoal = [];
                resTree = recurseTree(newObj,"0");
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
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        return response(statusCode,message,resTree);
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
        return response(statusCode,message,allGoal);
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
        return response(statusCode,message,allGoal);
    }
    async addgoal(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.role == "2" && (user.id_area != dto.id_area)) {
            throw new ForbiddenException('You dont have privileges.');
        }
        var finalData = null;
        console.log(dto);
        try {
            const addGoal = await this.goalRepo.createGoal(
                {
                    issue_goals: dto.issue_goals,
                    title_goals: dto.title_goals,
                    desc_goals: dto.desc_goals,
                    pic_goals: dto.pic_goals,
                    start_date: new Date(dto.start_date),
                    due_date: new Date(dto.due_date),
                    status_goals: Number("1"),
                    progress: Number("0"),
                    parent_goals: Number.isInteger(dto.parent_goals) ? dto.parent_goals : Number(dto.parent_goals),
                    type_goals: JSON.parse(dto.type_goals),
                    indikator: JSON.parse(dto.indikator),
                    id_area: dto.id_area,
                    id_cluster: dto.id_cluster,
                }
            );
            finalData = addGoal;
            if(addGoal) {
                if(addGoal.parent_goals == 0){
                    const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, addGoal);
                    finalData = updateKodefikasi;
                    if(!updateKodefikasi)
                    {
                        await this.goalRepo.deleteGoal(addGoal.id_goals);
                        const result = {
                            statusCode : 0,
                            message : "Failed Add Goal."
                        }
                        return result;
                    }
                }else{
                    const parentCode = await this.goalRepo.getGoal(addGoal.parent_goals);
                    if(parentCode)
                    {
                        const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, parentCode);
                        finalData = updateKodefikasi;
                        if(!updateKodefikasi)
                        {
                            await this.goalRepo.deleteGoal(addGoal.id_goals);
                            const result = {
                                statusCode : 0,
                                message : "Failed Add Goal."
                            }
                            return result;
                        }
                    }
                }
                statusCode = 200;
                message = "Success Add Goal.";
            }else{
                statusCode = 0;
                message = "Failed Add Goal.";
            }
        }catch(error) {
            console.log(error);
            throw new InternalServerErrorException(error);
        }
        return response(statusCode,message,finalData);
    }
    async editgoal(user: tbl_users, dto: any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.role == "2" && (user.id_area != dto.id_area)) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        try {
            editGoal = await this.goalRepo.updateGoals(dto.id_goals, dto);
            if(editGoal) {
                statusCode = 200;
                message = "Success Edit Goals.";
            }else{
                statusCode = 0;
                message = "Failed Edit Goals.";
            }
        } catch (error) {
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message
            throw new NotImplementedException(message)
        }
        return response(statusCode,message,editGoal);
    }
    async remapgoal(user: tbl_users, dto : any) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if(user.role != "1" && user.role != "2") {
            throw new ForbiddenException('You dont have privileges.');
        }
        if(user.role == "2" && (user.id_area != dto.id_area)) {
            throw new ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        const newMap = JSON.parse(dto.NewMap);
        // console.log(newMap);
        try {
            // for (const queryKey of Object.keys(newMap)) {
            //     const obj = newMap[queryKey];
            //     if(obj.parent_goals == '0' && obj.id_goals != '1') {
            //         throw new BadRequestException('Parent node is cannot more than one');
            //     }
            // }
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
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message
            throw new NotImplementedException(message)
            // throw new InternalServerErrorException(error);
        }
        return response(statusCode,message,editGoal);
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
        } catch (error) {
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message
            throw new NotImplementedException(message)
            // throw new InternalServerErrorException(error);
        }
        return response(statusCode,message,delGoal);
    }
    async initialGoals(user: tbl_users) {
        const tbl_goals = await this.prisma.tbl_goals.findMany({
            where : {
                parent_goals : 0
            }
        });
        if(!tbl_goals || tbl_goals.length <= 0)
        {
            throw new NotFoundException("Data Tidak ditemukan");
        }
        let finalResult = convertToGoalsArray(tbl_goals);
        return response(200,"Berhasil ambil data",finalResult.filter((el) => {return el != null}));
    }
    async childGoals(user: tbl_users, parent_goals) {
        const tbl_goals = await this.goalRepo.getGoals({
            where : {
                parent_goals : parent_goals
            }
        });
        if(!tbl_goals || tbl_goals.length <= 0)
        {
            throw new NotFoundException("Data Tidak ditemukan");
        }else{
            let currentData = convertToGoalsArray(tbl_goals);
            for (const iterator of tbl_goals) {
                var child = await this.subchildGoals(iterator.id_goals);
                for (const iterator of child) {
                    iterator.kodefikasi = 'GOAL-'+iterator.parent_goals+'-'+iterator.id_goals
                }
                currentData[iterator.id_goals]["children"] = child;
            }

            var filtered = currentData.filter((el) => {
                return el != null;
            })

            return response(200,"Berhasil ambil data",filtered);
        }
    }
    async subchildGoals(parent_goals) : Promise<tbl_goals[] | []> {
        const filter : { where : any} = {
            where : {
                parent_goals : parent_goals
            }
        }
        const tbl_goals = await this.goalRepo.getGoals(filter);
        return tbl_goals;
    }
    async treeGoal(user: tbl_users, parent_family, id_goals) {
        const getGoal = await this.goalRepo.getGoals({where : {id_goals : id_goals},include: { tbl_cluster : { select : { nama_cluster: true}}}})
        let parent_goal = convertToGoalsArray(getGoal)
        const param = {
            where : {
                parent_family: parent_family,
            },
            orderBy : {
                parent_goals : 'asc'
            },
            include: {
                tbl_cluster: {
                    select: {
                        nama_cluster: true
                    }
                }
            }
        }
        const tbl_goals = await this.goalRepo.getGoals(param)
        // console.log('tbl_goals', tbl_goals);
        if(!tbl_goals || tbl_goals.length <= 0)
        {
            throw new NotFoundException("Data Tidak ditemukan");
        }
        let final = recurseBuildTree(tbl_goals, id_goals);
        parent_goal[id_goals]['children'] = final;
        return response(200, "Berhasil ambil data", parent_goal.filter((el) => { return el != null; }));
    }
    async searchGoal(user: tbl_users, dto) {
        const searchTerm = dto.searchTerm;
        if(searchTerm == null || searchTerm.trim().length < 3) {
            throw new BadRequestException("Parameter pencarian kosong / kurang dari 3 karakter.")
        }
        const filter = {
            take: 5,
            where : {
                status_goals : 1,
                parent_family : Number.isInteger(dto.parent_family)?dto.parent_family:Number(dto.parent_family),
                title_goals : {
                    contains : searchTerm
                }
            }
        }
        var searchRes = await this.goalRepo.getGoals(filter);
        if(searchRes.length <= 0)
        {
            throw new NotFoundException("Data tidak ditemukan");
        }
        const result = convertToGoalsArray(searchRes);
        return response(200,"Berhasil ambil data",result.filter((el) => { return el != null}));
    }
    
    async downloadExcelGoal(user:tbl_users, parent_family: Number) {
        if(parent_family == null || parent_family == undefined) {
            throw new BadRequestException("Parameter download tidak valid.")
        }
        var filter : any = {
            where : {}
        }
        if(parent_family != 0) filter.where.parent_family = parent_family
        const data = await this.goalRepo.getGoals(filter);
        if(!data) throw new NotFoundException("Tidak ditemukan data");
        const converTed = recurseBuildTree(data,"0").filter((val) => { return val != null});
        // console.log('converTed', converTed);
        // return converTed;
        let rows = []
        let book =  new Workbook();
        let sheet = book.addWorksheet('Goals');
        
        sheet.columns = [
            { header: 'Kode', key: 'id_goals', width: 20, style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}} },
            { header: 'Isu Strategis', key: 'title_goals', width: 32 , style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}}},
            { header: 'Final Outcome', key: 'desc_goals', width: 32 , style : { alignment : { vertical: 'justify', horizontal: 'left', wrapText : true}}},
            { header: 'Kode2', key: 'id_goals', width: 20, style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}} },
            { header: 'CFS', key: 'title_goals', width: 32 , style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}}},
            { header: 'KONDISI YANG DIBUTUHKAN', key: 'desc_goals', width: 32 , style : { alignment : { vertical: 'justify', horizontal: 'left', wrapText : true}}},
            { header: 'Kode3', key: 'id_goals', width: 20, style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}} },
            { header: 'Menentukan Kondisi Antara', key: 'title_goals', width: 32 , style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}}},
            { header: 'Flaging Program', key: 'desc_goals', width: 32 , style : { alignment : { vertical: 'justify', horizontal: 'left', wrapText : true}}},
            { header: 'Kode4', key: 'id_goals', width: 20, style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}} },
            { header: 'MENENTUKAN KONDISI OPERASIONAL', key: 'title_goals', width: 32 , style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}}},
            { header: 'Flaging Kegiatan', key: 'desc_goals', width: 32 , style : { alignment : { vertical: 'justify', horizontal: 'left', wrapText : true}}},
            { header: 'Kode5', key: 'id_goals', width: 20, style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}} },
            { header: 'MENENTUKAN KONDISI OPERASIONAL (Sub-Keg)', key: 'title_goals', width: 32 , style : { alignment : { vertical: 'middle', horizontal: 'center', wrapText : true}}},
            { header: 'Flaging Sub-Keg', key: 'desc_goals', width: 32 , style : { alignment : { vertical: 'justify', horizontal: 'left', wrapText : true}}},
        ];
        this.buildSheet(sheet, converTed)
        this.styleSheet(sheet)
        let File = await new Promise((resolve, reject) => { 
            tmp.file({ discardDescriptor: true, prefix: 'GoalSheet ', postfix: '.xlsx', mode: parseInt('0600', 8)},async (err, file) => {
                if(err) throw new BadRequestException(err);
                book.xlsx.writeFile(file).then(_ => {
                    resolve(file)
                }).catch( err => {
                    throw new BadRequestException(err)
                })
            })
        })
        return File;
    }

    private buildSheet(sheet: Worksheet, converTed)
    {
        let countChild2 = 2;
        let countChild3 = 0;
        let countChild4 = 0;
        let countChild5 = 0;
        let lastCountChild = null
        let row = []
        converTed.forEach((element,index) => {
            row[1] = element.kodefikasi
            row[2] = element.issue_goals
            row[3] = element.title_goals
            sheet.addRow(row) /** Parent */
            countChild2 = sheet.rowCount
            if(element.children.length > 0)
            {   
                element.children.forEach(element => {
                    sheet.getCell('D' + countChild2).value = element.kodefikasi
                    // sheet.getCell('D' + countChild2).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                    sheet.getCell('E' + countChild2).value = element.issue_goals
                    // sheet.getCell('E' + countChild2).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                    sheet.getCell('F' + countChild2).value = element.title_goals
                    // sheet.getCell('F' + countChild2).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                    if(element.children.length > 0)
                    {   countChild3 = countChild2
                        element.children.forEach(element => {
                            sheet.getCell('G' + countChild3).value = element.kodefikasi
                            // sheet.getCell('G' + countChild3).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                            sheet.getCell('H' + countChild3).value = element.issue_goals
                            // sheet.getCell('H' + countChild3).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                            sheet.getCell('I' + countChild3).value = element.title_goals
                            // sheet.getCell('I' + countChild3).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                            if(element.children.length > 0)
                            {
                                countChild4 = countChild3
                                element.children.forEach(element => {
                                    sheet.getCell('J' + countChild4).value = element.kodefikasi
                                    // sheet.getCell('J' + countChild4).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                    sheet.getCell('K' + countChild4).value = element.issue_goals
                                    // sheet.getCell('K' + countChild4).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                    sheet.getCell('L' + countChild4).value = element.title_goals
                                    // sheet.getCell('L' + countChild4).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                    if(element.children.length > 0)
                                    {   countChild5 = countChild4
                                        element.children.forEach(element => {
                                            sheet.getCell('M' + countChild5).value = element.kodefikasi
                                            // sheet.getCell('M' + countChild5).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                            sheet.getCell('N' + countChild5).value = element.issue_goals
                                            // sheet.getCell('N' + countChild5).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                            sheet.getCell('O' + countChild5).value = element.title_goals
                                            // sheet.getCell('O' + countChild5).alignment = { vertical: 'middle', horizontal: 'center', wrapText : true}
                                            if(element.children.length > 0)
                                            {
                                                
                                            }
                                            countChild5++;
                                            lastCountChild = countChild5
                                        });
                                    }
                                    countChild4++;
                                    lastCountChild = countChild4
                                });
                            }
                            countChild3++;
                            lastCountChild = countChild3
                        });
                    }
                    lastCountChild = countChild2
                    countChild2 = sheet.rowCount + 1
                });
            }else{
                lastCountChild = countChild2
            }
            console.log('lastRow', sheet.rowCount)
            let styleBorder = sheet.getRow(lastCountChild)
            for (let index = 1; index < 16; index++) {
                styleBorder.getCell(index).border = {
                    bottom : { style :'medium', color: { argb: '000000'}},
                }    
            }

            for (let index = 1; index <= lastCountChild; index++) {
                sheet.getCell('P'+index).border = { 
                    left : { style :'medium', color: { argb: '000000'}} 
                }
            }
        });
    }

    private styleSheet(sheet: Worksheet)
    {
        sheet.getRow(1).eachCell((cell) => {
            cell.font = {size: 11.5, bold: true, color: {argb: 'FFFFFF'}}
    
            cell.fill = {type: 'pattern', pattern: 'solid', bgColor: { argb: '000000'}, fgColor: { argb: '000000'}}
    
            cell.alignment = {vertical: 'middle', horizontal: 'center', wrapText: true}
    
            cell.border = {
                top : { style :'thin', color: { argb: '000000'}},
                left : { style :'thin', color: { argb: 'FFFFFF'}},
                bottom : { style :'thin', color: { argb: '000000'}},
                right : { style :'thin', color: { argb: 'FFFFFF'}},
            }
        })
    }
}
