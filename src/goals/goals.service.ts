import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, NotImplementedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { tbl_goals, tbl_users } from '@prisma/client';
import { GoalRepository } from "./goals.repository";

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
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ?(obj['type_goals']):style_col;
                    parentGoal[key]["last_modified_date"] = obj['firstName'];
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ?(obj['indikator']):indikator;
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
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ? (obj['type_goals']):style_col;
                    parentGoal[key]["last_modified_date"] = obj['last_modified_date'];
                    parentGoal[key]["firstName"] = obj['name'];
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ? (obj['indikator']):indikator;
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

function convertToGoalsArray(tbl_goals, kodefikasi = 'GOAL')
{
    let resData = [];
    let i = 1;
    let finalData = {};
    tbl_goals.forEach(function(element) {
        var stringID = `${element.id_goals}`;
        finalData[stringID] = {};
        finalData[stringID]["id_goals"] = element.id_goals? element.id_goals : null;
        finalData[stringID]["title_goals"] = element.title_goals? element.title_goals : null;
        finalData[stringID]["desc_goals"] = element.desc_goals ? element.desc_goals : null
        finalData[stringID]["parent_family"] = element.parent_family ? element.parent_family : null
        finalData[stringID]["title"] = element.title_goals? element.title_goals : null;
        finalData[stringID]["subtitle"] = element.desc_goals? element.desc_goals: null
        finalData[stringID]["pic_goals"] = element.pic_goals? element.pic_goals : null
        finalData[stringID]["start_date"] = element.start_date? element.start_date : null
        finalData[stringID]["due_date"] = element.due_date? element.due_date : null
        finalData[stringID]["status_goals"] = element.status_goals? element.status_goals : null
        finalData[stringID]["progress"] = element.progress? element.progress : null
        finalData[stringID]["parent_goals"] = element.parent_goals? element.parent_goals : null
        finalData[stringID]["type_goals"] = element.type_goals? element.type_goals : null
        finalData[stringID]["indikator"] = element.indikator? element.indikator : null
        finalData[stringID]["kodefikasi"] = kodefikasi+ '-' + element.id_goals
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
        nextParent = element.id_goals;
        final[(element.id_goals)] = {}
        final[(element.id_goals)]['id_goals'] = element.id_goals;
        final[(element.id_goals)]['parent_goals'] = element.parent_goals;
        final[(element.id_goals)]['parent_family'] = element.parent_family;
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
        if(user.role != "1") {
            throw new ForbiddenException('You dont have privileges.');
        }
        var finalData = null;
        console.log(dto);
        try {
            const addGoal = await this.goalRepo.createGoal(
                {
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
        if(user.role != "1") {
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
        if(user.role != "1") {
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
        const getGoal = await this.goalRepo.getGoals({where : {id_goals : id_goals}})
        let parent_goal = convertToGoalsArray(getGoal)
        const param = {
            // select : {
            //     id_goals: true,
            //     parent_goals: true,
            //     parent_family: true
            // },
            where : {
                parent_family: parent_family,
            },
            orderBy : {
                parent_goals : 'asc'
            }
        }
        const tbl_goals = await this.goalRepo.getGoals(param)
        // console.log('id_goals', id_goals);
        if(!tbl_goals || tbl_goals.length <= 0)
        {
            throw new NotFoundException("Data Tidak ditemukan");
        }
        let final = recurseBuildTree(tbl_goals, id_goals);
        parent_goal[id_goals]['children'] = final;
        return response(200, "Berhasil ambil data", parent_goal.filter((el) => { return el != null; }));
    }

    async searchGoal(user: tbl_users, searchTerm) {
        if(searchTerm == null || searchTerm.trim().length < 8) {
            throw new BadRequestException("Parameter pencarian kosong / kurang dari 8 karakter.")
        }
        const filter = {
            take: 5,
            where : {
                status_goals : 1,
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
}
