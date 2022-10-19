"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const goals_repository_1 = require("./goals.repository");
const exceljs_1 = require("exceljs");
const tmp = require("tmp");
function response(statusCode, message, data) {
    const response = {
        statusCode: statusCode,
        message: message,
        data: data
    };
    return response;
}
function recurseTree(allGoal, parent) {
    let obj = [];
    let ChildGoal = [];
    let parentGoal = {};
    let parentKey = {};
    let resTree = [];
    let indikator = [];
    let style_col = {};
    Object.keys(allGoal[parent]).forEach(function (key) {
        obj = allGoal[key];
        if (!parentGoal[key] && key != "0") {
            parentGoal[key] = {};
        }
    });
    let idx = "0";
    if (Object.keys(allGoal[parent])) {
        Object.keys(allGoal[parent]).forEach(function (key) {
            obj = allGoal[parent][key];
            ChildGoal = [];
            Object.keys(obj).forEach(async function (keys) {
                if (obj[keys] !== null && keys.length <= 3 && parentGoal[keys]) {
                }
                else {
                    parentGoal[key]["id_goals"] = obj['id_goals'];
                    parentGoal[key]["title_goals"] = obj['title_goals'];
                    parentGoal[key]["desc_goals"] = obj['desc_goals'];
                    parentGoal[key]["pic_goals"] = obj['pic_goals'];
                    parentGoal[key]["start_date"] = obj['start_date'];
                    parentGoal[key]["due_date"] = obj['due_date'];
                    parentGoal[key]["status_goals"] = obj['status_goals'];
                    parentGoal[key]["progress"] = obj['progress'];
                    parentGoal[key]["parent_goals"] = obj['parent_goals'];
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ? (obj['type_goals']) : style_col;
                    parentGoal[key]["last_modified_date"] = obj['firstName'];
                    parentGoal[key]["id_cluster"] = obj['id_cluster'] !== "" && obj['id_cluster'] !== null ? (obj['id_cluster']) : '';
                    parentGoal[key]["id_area"] = obj['id_area'] !== "" && obj['id_area'] !== null ? (obj['id_area']) : '';
                    parentGoal[key]["clustered"] = obj['clustered'] !== "" && obj['clustered'] !== null ? (obj['clustered']) : '';
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ? (obj['indikator']) : indikator;
                }
            });
            if (allGoal[key]) {
                ChildGoal = recurseTree(allGoal, key);
                parentGoal[key]["children"] = ChildGoal;
            }
            idx = key;
            resTree.push(parentGoal[key]);
        });
    }
    return resTree;
}
function recurseTreeAdmin(allGoal, parent) {
    let obj = [];
    let ChildGoal = [];
    let parentGoal = {};
    let parentKey = {};
    let resTree = [];
    let indikator = [];
    let style_col = {};
    Object.keys(allGoal[parent]).forEach(function (key) {
        obj = allGoal[key];
        if (!parentGoal[key] && key != "0") {
            parentGoal[key] = {};
        }
    });
    let idx = "0";
    if (Object.keys(allGoal[parent])) {
        Object.keys(allGoal[parent]).forEach(function (key) {
            obj = allGoal[parent][key];
            ChildGoal = [];
            Object.keys(obj).forEach(async function (keys) {
                if (obj[keys] !== null && parentGoal[keys]) {
                }
                else {
                    parentGoal[key]["id"] = obj['id'];
                    parentGoal[key]["title"] = obj['title'];
                    parentGoal[key]["description"] = obj['description'];
                    parentGoal[key]["pic"] = obj['pic'];
                    parentGoal[key]["start_date"] = obj['start_date'];
                    parentGoal[key]["due_date"] = obj['due_date'];
                    parentGoal[key]["status_goals"] = obj['status_goals'];
                    parentGoal[key]["progress"] = obj['progress'];
                    parentGoal[key]["parent"] = obj['parent'];
                    parentGoal[key]["type_goals"] = obj['type_goals'] !== "" && obj['type_goals'] !== null ? (obj['type_goals']) : style_col;
                    parentGoal[key]["last_modified_date"] = obj['last_modified_date'];
                    parentGoal[key]["firstName"] = obj['name'];
                    parentGoal[key]["id_cluster"] = obj['id_cluster'] !== "" && obj['id_cluster'] !== null ? (obj['id_cluster']) : '';
                    parentGoal[key]["id_area"] = obj['id_area'] !== "" && obj['id_area'] !== null ? (obj['id_area']) : '';
                    parentGoal[key]["indikator"] = obj['indikator'] !== "" && obj['indikator'] !== null ? (obj['indikator']) : indikator;
                }
            });
            if (allGoal[key]) {
                ChildGoal = recurseTreeAdmin(allGoal, key);
                parentGoal[key]["children"] = ChildGoal;
            }
            idx = key;
            resTree.push(parentGoal[key]);
        });
    }
    return resTree;
}
function recurseCluster(newObj, allGoal, obj, idxClust) {
    let resObj = [];
    for (let objPar in allGoal) {
        if (allGoal[objPar].hasOwnProperty(obj)) {
            if (!newObj[objPar] && !newObj.hasOwnProperty(objPar)) {
                newObj[objPar] = {};
            }
            if (!newObj[objPar].hasOwnProperty(obj)) {
                newObj[objPar][obj] = allGoal[objPar][obj];
                resObj = Object.entries(newObj);
                const sorted = Object.keys(newObj)
                    .sort()
                    .reduce((accumulator, key) => {
                    accumulator[key] = newObj[key];
                    return accumulator;
                }, {});
                newObj = sorted;
                if (!idxClust.includes(`${objPar}_${obj}`)) {
                    idxClust.push(`${objPar}_${obj}`);
                    recurseCluster(newObj, allGoal, objPar, idxClust);
                }
            }
        }
    }
    return newObj;
}
function convertToGoalsArray(tbl_goals, kodefikasi = 'GOAL') {
    let resData = [];
    let i = 1;
    let finalData = {};
    tbl_goals.forEach(function (element) {
        var stringID = `${element.id_goals}`;
        finalData[stringID] = {};
        finalData[stringID]["id_goals"] = element.id_goals ? element.id_goals : null;
        finalData[stringID]["issue_goals"] = element.issue_goals ? element.issue_goals : null;
        finalData[stringID]["title_goals"] = element.title_goals ? element.title_goals : null;
        finalData[stringID]["desc_goals"] = element.desc_goals ? element.desc_goals : null;
        finalData[stringID]["parent_family"] = element.parent_family ? element.parent_family : null;
        finalData[stringID]["title"] = element.title_goals ? element.title_goals : null;
        finalData[stringID]["subtitle"] = element.desc_goals ? element.desc_goals : null;
        finalData[stringID]["pic_goals"] = element.pic_goals ? element.pic_goals : null;
        finalData[stringID]["start_date"] = element.start_date ? element.start_date : null;
        finalData[stringID]["due_date"] = element.due_date ? element.due_date : null;
        finalData[stringID]["status_goals"] = element.status_goals ? element.status_goals : null;
        finalData[stringID]["progress"] = element.progress ? element.progress : null;
        finalData[stringID]["parent_goals"] = element.parent_goals ? element.parent_goals : null;
        finalData[stringID]["type_goals"] = element.type_goals ? element.type_goals : null;
        finalData[stringID]["indikator"] = element.indikator ? element.indikator : null;
        finalData[stringID]["kodefikasi"] = kodefikasi + '-' + element.id_goals;
        finalData[stringID]['id_area'] = element.id_area;
        finalData[stringID]['id_cluster'] = element.id_cluster;
        finalData[stringID]['nama_cluster'] = element.tbl_cluster != null && element.tbl_cluster.nama_cluster != null ? element.tbl_cluster.nama_cluster : null;
        finalData[stringID]["children"] = [];
        resData[stringID] = finalData[stringID];
        finalData = {};
    });
    return resData;
}
function recurseBuildTree(goals, parent, kodefikasi = 'GOAL') {
    let final = [];
    let filterGoals = goals.filter((element, idx, array) => {
        return element.parent_goals == parent;
    });
    let nextParent = null;
    filterGoals.forEach((element, index, array) => {
        nextParent = element.id_goals;
        final[(element.id_goals)] = {};
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
        final[(element.id_goals)]['kodefikasi'] = kodefikasi + '-' + element.id_goals.toString();
        final[(element.id_goals)]['children'] = recurseBuildTree(goals, nextParent, kodefikasi + '-' + element.id_goals.toString());
    });
    var filteredFinal = final.filter((el) => {
        return el != null;
    });
    return filteredFinal;
}
let GoalsService = class GoalsService {
    constructor(goalRepo, config, prisma, jwt) {
        this.goalRepo = goalRepo;
        this.config = config;
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async allgoal(user) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let allGoal = null;
        let topGoal = null;
        let childGoal = null;
        try {
            topGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 0,
                }
            });
            childGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 1,
                }
            });
            topGoal[0]['children'] = childGoal;
            allGoal = topGoal[0];
            if (allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, allGoal);
    }
    async alltreegoal(user) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let allGoal = {};
        let topGoal = null;
        let resTree = [];
        try {
            topGoal = await this.prisma.tbl_goals.findMany({
                select: {
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
                orderBy: {
                    parent_goals: 'asc',
                }
            });
            let parent_id = 0;
            if (topGoal && topGoal.length > 0) {
                topGoal.forEach(element => {
                    if (element !== null) {
                        if (!allGoal.hasOwnProperty(element.parent_goals)) {
                            allGoal[element.parent_goals] = {};
                        }
                        allGoal[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
                let obj = [];
                parent_id = 0;
                let parentGoal = {};
                let ChildGoal = [];
                resTree = recurseTree(allGoal, "0");
                if (resTree[0] !== undefined) {
                    statusCode = 200;
                    message = "Success Inquiry Goals.";
                }
                else {
                    statusCode = 0;
                    message = "Failed Inquiry Goals.";
                }
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals, Empty goals.";
                resTree[0] = [];
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, resTree);
    }
    async allgoaladmin(user) {
        console.log(user);
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let allGoal = {};
        let topGoal = null;
        let resTree = [];
        let childGoal = null;
        try {
            topGoal = await this.prisma.$queryRaw `select id_goals as id, title_goals as title, desc_goals as description, pic_goals as pic,b.firstName, start_date, due_date, status_goals, parent_goals as parent, type_goals, last_modified_date, progress, indikator from goals a inner join users b on a.pic_goals = b.name order by parent_goals asc;`;
            let parent_id = 0;
            if (topGoal && topGoal.length != 0) {
                topGoal.forEach(element => {
                    if (element !== null) {
                        if (!allGoal.hasOwnProperty(element.parent)) {
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
                resTree = recurseTreeAdmin(allGoal, "0");
                allGoal = topGoal;
                if (resTree[0] !== undefined) {
                    statusCode = 200;
                    message = "Success Inquiry Goals.";
                }
                else {
                    statusCode = 0;
                    message = "Failed Inquiry Goals.";
                }
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals, Empty Goals.";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, resTree);
    }
    async alltreegoalcluster(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let allGoal = {};
        let allGoalClust = {};
        let topGoal = null;
        let clustGoal = null;
        let resTree = [];
        let idxClust = [];
        try {
            clustGoal = await this.prisma.$queryRaw `SELECT *,'1' as clustered FROM goals WHERE id_cluster = ${dto.id_cluster} AND parent_family = ${dto.parent_family} AND status_goals = 1 ORDER BY parent_goals asc;`;
            topGoal = await this.prisma.$queryRaw `SELECT *,'1' as clustered FROM goals WHERE parent_family = ${dto.parent_family} AND status_goals = 1 ORDER BY parent_goals asc;`;
            let parent_id = 0;
            if (topGoal && topGoal.length > 0) {
                topGoal.forEach(element => {
                    if (element !== null) {
                        if (!allGoal.hasOwnProperty(element.parent_goals)) {
                            allGoal[element.parent_goals] = {};
                        }
                        allGoal[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
                clustGoal.forEach(element => {
                    idxClust.push(`${element.parent_goals}_${element.id_goals}`);
                    if (element !== null) {
                        if (!allGoalClust.hasOwnProperty(element.parent_goals)) {
                            allGoalClust[element.parent_goals] = {};
                        }
                        allGoalClust[element.parent_goals][element.id_goals] = element;
                        parent_id = element.parent_goals;
                    }
                });
                let newObj = allGoalClust;
                for (let obj in allGoalClust) {
                    newObj = recurseCluster(newObj, allGoal, obj, idxClust);
                }
                let obj = [];
                parent_id = 0;
                let parentGoal = {};
                let ChildGoal = [];
                resTree = recurseTree(newObj, "0");
                if (resTree[0] !== undefined) {
                    statusCode = 200;
                    message = "Success Inquiry Goals.";
                }
                else {
                    statusCode = 0;
                    message = "Failed Inquiry Goals.";
                }
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals, Empty goals.";
                resTree[0] = [];
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, resTree);
    }
    async goalbyparentRec(user, id_goals) {
        let allGoal = null;
        let allGoals = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: id_goals,
                }
            })
                .then(res => {
                allGoals = res;
            });
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
            allGoals = null;
        }
        return allGoals;
    }
    async goalbyid(user, id_goals) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let allGoal = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    id_goals: id_goals,
                }
            });
            if (allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, allGoal);
    }
    async goalbyparent(user, id_goals) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let allGoal = null;
        try {
            allGoal = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: id_goals,
                }
            });
            if (allGoal) {
                statusCode = 200;
                message = "Success Inquiry Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Inquiry Goals.";
            }
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, allGoal);
    }
    async addgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        if (user.role == "2" && (user.id_area != dto.id_area)) {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        var finalData = null;
        try {
            const addGoal = await this.goalRepo.createGoal({
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
            });
            finalData = addGoal;
            if (addGoal) {
                if (addGoal.parent_goals == 0) {
                    const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, addGoal);
                    finalData = updateKodefikasi;
                    if (!updateKodefikasi) {
                        await this.goalRepo.deleteGoal(addGoal.id_goals);
                        const result = {
                            statusCode: 0,
                            message: "Failed Add Goal."
                        };
                        return result;
                    }
                }
                else {
                    const parentCode = await this.goalRepo.getGoal(addGoal.parent_goals);
                    if (parentCode) {
                        const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, parentCode);
                        finalData = updateKodefikasi;
                        if (!updateKodefikasi) {
                            await this.goalRepo.deleteGoal(addGoal.id_goals);
                            const result = {
                                statusCode: 0,
                                message: "Failed Add Goal."
                            };
                            return result;
                        }
                    }
                }
                statusCode = 200;
                message = "Success Add Goal.";
            }
            else {
                statusCode = 0;
                message = "Failed Add Goal.";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, finalData);
    }
    async editgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        if (user.role == "2" && (user.id_area != dto.id_area)) {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        try {
            if (isNaN(dto.id_cluster)) {
                editGoal = await this.prisma.$queryRaw `UPDATE goals SET id_cluster=${dto.id_cluster} WHERE id_goals=${dto.id_goals}`;
                editGoal = await this.prisma.tbl_goals.updateMany({
                    data: {
                        title_goals: dto.title_goals,
                        desc_goals: dto.desc_goals,
                        pic_goals: dto.pic_goals,
                        start_date: dto.start_date,
                        due_date: dto.due_date,
                        status_goals: dto.status_goals,
                        type_goals: dto.type_goals,
                        indikator: dto.indikator,
                        id_area: dto.id_area,
                        issue_goals: dto.issue_goals,
                    },
                    where: {
                        id_goals: dto.id_goals,
                    }
                });
            }
            else {
                editGoal = await this.goalRepo.updateGoals(dto.id_goals, dto);
            }
            if (editGoal) {
                statusCode = 200;
                message = "Success Edit Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Edit Goals.";
            }
        }
        catch (error) {
            console.log(error);
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message;
            throw new common_1.NotImplementedException(message);
        }
        return response(statusCode, message, editGoal);
    }
    async remapgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1" && user.role != "2") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        const newMap = JSON.parse(dto.NewMap);
        try {
            let p = 0;
            for (const queryKey of Object.keys(newMap)) {
                const obj = newMap[queryKey];
                if (obj.parent_goals == '0') {
                    p++;
                }
            }
            if (p > 1) {
                throw new common_1.BadRequestException('Parent node is cannot more than one');
            }
            for (const queryKey of Object.keys(newMap)) {
                const obj = newMap[queryKey];
                editGoal = await this.prisma.$queryRaw `update goals set parent_goals = ${obj.parent_goals}, pic_goals = ${obj.pic_goals} where id_goals = ${obj.id_goals};`;
            }
            if (editGoal) {
                statusCode = 200;
                message = "Success Edit Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Edit Goals.";
            }
        }
        catch (error) {
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message;
            throw new common_1.NotImplementedException(message);
        }
        return response(statusCode, message, editGoal);
    }
    async delgoal(user, id_goals) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let delGoal = null;
        try {
            delGoal = await this.prisma.tbl_goals.deleteMany({
                where: {
                    id_goals: id_goals,
                }
            });
            if (delGoal) {
                statusCode = 200;
                message = "Success Delete Goals.";
            }
            else {
                statusCode = 0;
                message = "Failed Delete Goals.";
            }
        }
        catch (error) {
            message = this.config.get('APP_DEBUG') == "true" ? error.message : message;
            throw new common_1.NotImplementedException(message);
        }
        return response(statusCode, message, delGoal);
    }
    async initialGoals(user) {
        let tbl_goals = null;
        if (user.id_area == null || user.id_area == undefined) {
            throw new common_1.NotAcceptableException("Mohon menghubungi admin untuk config user anda.");
        }
        if (user.role == '1') {
            tbl_goals = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 0,
                    status_goals: 1,
                }
            });
        }
        else {
            tbl_goals = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 0,
                    status_goals: 1,
                    id_area: user.id_area,
                }
            });
        }
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        let finalResult = convertToGoalsArray(tbl_goals);
        return response(200, "Berhasil ambil data", finalResult.filter((el) => { return el != null; }));
    }
    async initialGoalsAdmin(user) {
        let tbl_goals = null;
        if (user.role == '1') {
            tbl_goals = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 0,
                }
            });
        }
        else {
            tbl_goals = await this.prisma.tbl_goals.findMany({
                where: {
                    parent_goals: 0,
                    id_area: user.id_area,
                }
            });
        }
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        let finalResult = convertToGoalsArray(tbl_goals);
        return response(200, "Berhasil ambil data", finalResult.filter((el) => { return el != null; }));
    }
    async childGoals(user, parent_goals) {
        const tbl_goals = await this.goalRepo.getGoals({
            where: {
                parent_goals: parent_goals
            }
        });
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        else {
            let currentData = convertToGoalsArray(tbl_goals);
            for (const iterator of tbl_goals) {
                var child = await this.subchildGoals(iterator.id_goals);
                for (const iterator of child) {
                    iterator.kodefikasi = 'GOAL-' + iterator.parent_goals + '-' + iterator.id_goals;
                }
                currentData[iterator.id_goals]["children"] = child;
            }
            var filtered = currentData.filter((el) => {
                return el != null;
            });
            return response(200, "Berhasil ambil data", filtered);
        }
    }
    async subchildGoals(parent_goals) {
        const filter = {
            where: {
                parent_goals: parent_goals
            }
        };
        const tbl_goals = await this.goalRepo.getGoals(filter);
        return tbl_goals;
    }
    async treeGoal(user, parent_family, id_goals) {
        const getGoal = await this.goalRepo.getGoals({ where: { id_goals: id_goals }, include: { tbl_cluster: { select: { nama_cluster: true } } } });
        let parent_goal = convertToGoalsArray(getGoal);
        const param = {
            where: {
                parent_family: parent_family,
                status_goals: 1,
            },
            orderBy: {
                parent_goals: 'asc'
            },
            include: {
                tbl_cluster: {
                    select: {
                        nama_cluster: true
                    }
                }
            }
        };
        const tbl_goals = await this.goalRepo.getGoals(param);
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        let final = recurseBuildTree(tbl_goals, id_goals);
        parent_goal[id_goals]['children'] = final;
        return response(200, "Berhasil ambil data", parent_goal.filter((el) => { return el != null; }));
    }
    async treeGoalAdmin(user, parent_family, id_goals) {
        const getGoal = await this.goalRepo.getGoals({ where: { id_goals: id_goals }, include: { tbl_cluster: { select: { nama_cluster: true } } } });
        let parent_goal = convertToGoalsArray(getGoal);
        const param = {
            where: {
                parent_family: parent_family,
            },
            orderBy: {
                parent_goals: 'asc'
            },
            include: {
                tbl_cluster: {
                    select: {
                        nama_cluster: true
                    }
                }
            }
        };
        const tbl_goals = await this.goalRepo.getGoals(param);
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        let final = recurseBuildTree(tbl_goals, id_goals);
        parent_goal[id_goals]['children'] = final;
        return response(200, "Berhasil ambil data", parent_goal.filter((el) => { return el != null; }));
    }
    async searchGoal(user, dto) {
        const searchTerm = dto.searchTerm;
        if (searchTerm == null || searchTerm.trim().length < 3) {
            throw new common_1.BadRequestException("Parameter pencarian kosong / kurang dari 3 karakter.");
        }
        const filter = {
            take: 5,
            where: {
                status_goals: 1,
                parent_family: Number.isInteger(dto.parent_family) ? dto.parent_family : Number(dto.parent_family),
                title_goals: {
                    contains: searchTerm
                }
            }
        };
        var searchRes = await this.goalRepo.getGoals(filter);
        if (searchRes.length <= 0) {
            throw new common_1.NotFoundException("Data tidak ditemukan");
        }
        const result = convertToGoalsArray(searchRes);
        return response(200, "Berhasil ambil data", result.filter((el) => { return el != null; }));
    }
    async downloadExcelGoal(user, parent_family) {
        if (parent_family == null || parent_family == undefined) {
            throw new common_1.BadRequestException("Parameter download tidak valid.");
        }
        var filter = {
            where: {}
        };
        if (parent_family != 0)
            filter.where.parent_family = parent_family;
        const data = await this.goalRepo.getGoals(filter);
        if (!data)
            throw new common_1.NotFoundException("Tidak ditemukan data");
        const converTed = recurseBuildTree(data, "0").filter((val) => { return val != null; });
        let rows = [];
        let book = new exceljs_1.Workbook();
        let sheet = book.addWorksheet('Goals');
        sheet.columns = [
            { header: 'Kode', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Isu Strategis', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Final Outcome', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Strategis', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode2', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'CFS', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'KONDISI YANG DIBUTUHKAN', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator CSF', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode3', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Menentukan Kondisi Antara', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Program', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Program', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode4', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'MENENTUKAN KONDISI OPERASIONAL', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Kegiatan', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Kegiatan', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode5', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'MENENTUKAN KONDISI OPERASIONAL (Sub-Keg)', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Sub-Keg', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Sub-Keg', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
        ];
        this.buildSheet(sheet, converTed);
        this.styleSheet(sheet);
        let File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'GoalSheet ', postfix: '.xlsx', mode: parseInt('0600', 8) }, async (err, file) => {
                if (err)
                    throw new common_1.BadRequestException(err);
                book.xlsx.writeFile(file).then(_ => {
                    resolve(file);
                }).catch(err => {
                    throw new common_1.BadRequestException(err);
                });
            });
        });
        return File;
    }
    async downloadCsvGoal(user, parent_family) {
        if (parent_family == null || parent_family == undefined) {
            throw new common_1.BadRequestException("Parameter download tidak valid.");
        }
        var filter = {
            where: {}
        };
        if (parent_family != 0)
            filter.where.parent_family = parent_family;
        const data = await this.goalRepo.getGoals(filter);
        if (!data)
            throw new common_1.NotFoundException("Tidak ditemukan data");
        const converTed = recurseBuildTree(data, "0").filter((val) => { return val != null; });
        let rows = [];
        let book = new exceljs_1.Workbook();
        let sheet = book.addWorksheet('Goals');
        sheet.columns = [
            { header: 'Kode', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Isu Strategis', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Final Outcome', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Strategis', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode2', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'CSF', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'KONDISI YANG DIBUTUHKAN', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator CSF', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode3', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Menentukan Kondisi Antara', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Program', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Program', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode4', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'MENENTUKAN KONDISI OPERASIONAL', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Kegiatan', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Kegiatan', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Kode5', key: 'id_goals', width: 20, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'MENENTUKAN KONDISI OPERASIONAL (Sub-Keg)', key: 'title_goals', width: 32, style: { alignment: { vertical: 'middle', horizontal: 'center', wrapText: true } } },
            { header: 'Flaging Sub-Keg', key: 'desc_goals', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
            { header: 'Indikator Sub-Keg', key: 'indikator', width: 32, style: { alignment: { vertical: 'justify', horizontal: 'left', wrapText: true } } },
        ];
        this.buildSheet(sheet, converTed);
        this.styleSheet(sheet);
        let File = await new Promise((resolve, reject) => {
            tmp.file({ discardDescriptor: true, prefix: 'GoalSheet ', postfix: '.csv', mode: parseInt('0600', 8) }, async (err, file) => {
                if (err)
                    throw new common_1.BadRequestException(err);
                book.csv.writeFile(file).then(_ => {
                    resolve(file);
                }).catch(err => {
                    throw new common_1.BadRequestException(err);
                });
            });
        });
        return File;
    }
    buildSheet(sheet, converTed) {
        let countChild2 = 2;
        let countChild3 = 0;
        let countChild4 = 0;
        let countChild5 = 0;
        let lastCountChild = null;
        let row = [];
        let ind = "";
        converTed.forEach((element, index) => {
            row[1] = element.kodefikasi;
            row[2] = element.issue_goals;
            row[3] = element.title_goals;
            ind = element.indikator.map(ind => ind.indikator).join("\n");
            row[4] = ind;
            sheet.addRow(row);
            countChild2 = sheet.rowCount;
            if (element.children.length > 0) {
                element.children.forEach(element => {
                    sheet.getCell('E' + countChild2).value = element.kodefikasi;
                    sheet.getCell('F' + countChild2).value = element.issue_goals;
                    sheet.getCell('G' + countChild2).value = element.title_goals;
                    sheet.getCell('H' + countChild2).value = element.indikator.map(ind => ind.indikator).join("\n");
                    if (element.children.length > 0) {
                        countChild3 = countChild2;
                        element.children.forEach(element => {
                            sheet.getCell('I' + countChild3).value = element.kodefikasi;
                            sheet.getCell('J' + countChild3).value = element.issue_goals;
                            sheet.getCell('K' + countChild3).value = element.title_goals;
                            sheet.getCell('L' + countChild3).value = element.indikator.map(ind => ind.indikator).join("\n");
                            if (element.children.length > 0) {
                                countChild4 = countChild3;
                                element.children.forEach(element => {
                                    sheet.getCell('M' + countChild4).value = element.kodefikasi;
                                    sheet.getCell('N' + countChild4).value = element.issue_goals;
                                    sheet.getCell('O' + countChild4).value = element.title_goals;
                                    sheet.getCell('P' + countChild4).value = element.indikator.map(ind => ind.indikator).join("\n");
                                    if (element.children.length > 0) {
                                        countChild5 = countChild4;
                                        element.children.forEach(element => {
                                            sheet.getCell('Q' + countChild5).value = element.kodefikasi;
                                            sheet.getCell('R' + countChild5).value = element.issue_goals;
                                            sheet.getCell('S' + countChild5).value = element.title_goals;
                                            sheet.getCell('T' + countChild5).value = element.indikator.map(ind => ind.indikator).join("\n");
                                            if (element.children.length > 0) {
                                            }
                                            countChild5++;
                                            lastCountChild = countChild5;
                                        });
                                    }
                                    countChild4++;
                                    lastCountChild = countChild4;
                                });
                            }
                            countChild3++;
                            lastCountChild = countChild3;
                        });
                    }
                    lastCountChild = countChild2;
                    countChild2 = sheet.rowCount + 1;
                });
            }
            else {
                lastCountChild = countChild2;
            }
            console.log('lastRow', sheet.rowCount);
            let styleBorder = sheet.getRow(lastCountChild);
            for (let index = 1; index < 16; index++) {
                styleBorder.getCell(index).border = {
                    bottom: { style: 'medium', color: { argb: '000000' } },
                };
            }
            for (let index = 1; index <= lastCountChild; index++) {
                sheet.getCell('P' + index).border = {
                    left: { style: 'medium', color: { argb: '000000' } }
                };
            }
        });
    }
    styleSheet(sheet) {
        sheet.getRow(1).eachCell((cell) => {
            cell.font = { size: 11.5, bold: true, color: { argb: 'FFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', bgColor: { argb: '000000' }, fgColor: { argb: '000000' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            cell.border = {
                top: { style: 'thin', color: { argb: '000000' } },
                left: { style: 'thin', color: { argb: 'FFFFFF' } },
                bottom: { style: 'thin', color: { argb: '000000' } },
                right: { style: 'thin', color: { argb: 'FFFFFF' } },
            };
        });
    }
    async getStats(user) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let Goals = null;
        let resData = {};
        try {
            if (user.role == "1") {
                Goals = await this.prisma.$queryRaw `SELECT id_goals,parent_goals,parent_family,id_cluster,indikator FROM goals ORDER BY parent_family,parent_goals;`;
            }
            else {
                Goals = await this.prisma.$queryRaw `SELECT id_goals,parent_goals,parent_family,id_cluster,indikator FROM goals WHERE id_area = ${user.id_area} ORDER BY parent_family,parent_goals;`;
            }
            let parent = 0;
            let child = 0;
            let clust = 0;
            let ind = 0;
            if (Goals && Goals.length > 0) {
                Goals.forEach(element => {
                    if (element !== null) {
                        if (element.parent_goals == 0) {
                            parent++;
                        }
                        else {
                            child++;
                        }
                        if (element.id_cluster != null) {
                            clust++;
                        }
                        if (element.indikator.length > 2) {
                            ind++;
                        }
                    }
                });
                statusCode = 200;
                message = "Success Inquiry Stats.";
                resData = {
                    goals: parent,
                    sub_goals: child,
                    cluster_goals: clust,
                    indikator_goals: ind,
                };
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, resData);
    }
    async getLastModifiedGoals(user) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let Goals = null;
        let resData = {};
        const perPage = 5;
        let offset = 0;
        let limit = offset + perPage;
        try {
            if (user.role == "1") {
                Goals = await this.prisma.$queryRaw `SELECT id_goals,title_goals,desc_goals,pic_goals,parent_goals,parent_family,id_cluster,indikator,last_modified_date FROM goals ORDER BY last_modified_date desc limit ${offset},${limit};`;
            }
            else {
                Goals = await this.prisma.$queryRaw `SELECT id_goals,title_goals,desc_goals,pic_goals,parent_goals,parent_family,id_cluster,indikator,last_modified_date FROM goals WHERE id_area = ${user.id_area} ORDER BY last_modified_date desc limit ${offset},${limit};`;
            }
            if (Goals && Goals.length > 0) {
                statusCode = 200;
                message = "Success Inquiry Last Goals.";
                resData = Goals;
            }
            else {
                statusCode = 0;
                message = "Failled Inquiry Last Goals.";
            }
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return response(statusCode, message, resData);
    }
};
GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [goals_repository_1.GoalRepository, config_1.ConfigService, prisma_service_1.PrismaService, jwt_1.JwtService])
], GoalsService);
exports.GoalsService = GoalsService;
//# sourceMappingURL=goals.service.js.map