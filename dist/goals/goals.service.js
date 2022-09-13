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
function convertToGoalsArray(tbl_goals) {
    let resData = [];
    let i = 1;
    let finalData = {};
    tbl_goals.forEach(function (element) {
        var stringID = `${element.id_goals}`;
        console.log('iterator', stringID);
        finalData[stringID] = {};
        finalData[stringID]["id_goals"] = element.id_goals ? element.id_goals : null;
        finalData[stringID]["title_goals"] = element.title_goals ? element.title_goals : null;
        finalData[stringID]["desc_goals"] = element.desc_goals ? element.desc_goals : null;
        finalData[stringID]["pic_goals"] = element.pic_goals ? element.pic_goals : null;
        finalData[stringID]["start_date"] = element.start_date ? element.start_date : null;
        finalData[stringID]["due_date"] = element.due_date ? element.due_date : null;
        finalData[stringID]["status_goals"] = element.status_goals ? element.status_goals : null;
        finalData[stringID]["progress"] = element.progress ? element.progress : null;
        finalData[stringID]["parent_goals"] = element.parent_goals ? element.parent_goals : null;
        finalData[stringID]["type_goals"] = element.type_goals ? element.type_goals : null;
        finalData[stringID]["indikator"] = element.indikator ? element.indikator : null;
        finalData[stringID]["children"] = [];
        resData[stringID] = finalData[stringID];
        finalData = {};
    });
    return resData;
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
        let result = { "statusCode": statusCode, "message": message, "data": allGoal };
        return result;
    }
    async alltreegoal(user) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        let result = null;
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
            result = { "statusCode": statusCode, "message": message, "data": resTree };
        }
        catch (error) {
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        return result;
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
        let result = { "statusCode": statusCode, "message": message, "data": resTree };
        return result;
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
        let result = { "statusCode": statusCode, "message": message, "data": allGoal };
        return result;
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
        let result = { "statusCode": statusCode, "message": message, "data": allGoal };
        return result;
    }
    async addgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
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
                    parent_goals: Number.isInteger(dto.parent_goals) ? dto.parent_goals : Number(dto.parent_goals),
                    type_goals: dto.type_goals,
                    indikator: dto.indikator,
                }
            });
            if (addGoal) {
                if (addGoal.parent_goals == 0) {
                    const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, null);
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
                    const coba = await this.goalRepo.getGoal(addGoal.parent_goals);
                    if (coba) {
                        const updateKodefikasi = await this.goalRepo.updateKodefikasi(addGoal.id_goals, coba.kodefikasi);
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
        let result = { "statusCode": statusCode, "message": message, "data": addGoal };
        return result;
    }
    async editgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        try {
            editGoal = await this.prisma.tbl_goals.updateMany({
                data: dto,
                where: {
                    id_goals: Number.isInteger(dto.id_goals) ? dto.id_goals : Number(dto.id_goals),
                }
            });
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
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": editGoal };
        return result;
    }
    async remapgoal(user, dto) {
        let statusCode = 999;
        let message = "Something went wrong.";
        let data = null;
        if (user.role != "1") {
            throw new common_1.ForbiddenException('You dont have privileges.');
        }
        let editGoal = null;
        const newMap = JSON.parse(dto.NewMap);
        try {
            for (const queryKey of Object.keys(newMap)) {
                const obj = newMap[queryKey];
                if (obj.parent_goals == '0' && obj.id_goals != '1') {
                    throw new common_1.BadRequestException('Parent node is cannot more than one');
                }
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
            console.log(error);
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": editGoal };
        return result;
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
            throw new common_1.InternalServerErrorException(error);
        }
        let result = { "statusCode": statusCode, "message": message, "data": delGoal };
        return delGoal;
    }
    async initialGoals(user) {
        const tbl_goals = await this.prisma.tbl_goals.findMany({
            where: {
                parent_goals: 0
            }
        });
        if (!tbl_goals || tbl_goals.length <= 0) {
            throw new common_1.NotFoundException("Data Tidak ditemukan");
        }
        const result = {
            statusCode: 200,
            message: "Berhasil mengambil data.",
            data: tbl_goals
        };
        return result;
    }
    async childGoals(user, parent_goals) {
        const tbl_goals = await this.prisma.tbl_goals.findMany({
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
                const child = await this.subchildGoals(iterator.id_goals);
                currentData[iterator.id_goals]["children"] = child;
            }
            var filtered = currentData.filter((el) => {
                return el != null;
            });
            const response = {
                statusCode: 200,
                message: "Berhasil mengambil data",
                data: filtered
            };
            return response;
            console.log('currentData', currentData);
            return currentData;
        }
    }
    async subchildGoals(parent_goals) {
        const tbl_goals = await this.prisma.tbl_goals.findMany({
            where: {
                parent_goals: parent_goals
            }
        });
        return tbl_goals;
    }
};
GoalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [goals_repository_1.GoalRepository, config_1.ConfigService, prisma_service_1.PrismaService, jwt_1.JwtService])
], GoalsService);
exports.GoalsService = GoalsService;
//# sourceMappingURL=goals.service.js.map