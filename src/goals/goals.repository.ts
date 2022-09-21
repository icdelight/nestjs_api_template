import { PrismaService } from "../prisma/prisma.service";
import { Injectable } from "@nestjs/common";


@Injectable()
export class GoalRepository {
    constructor(private prisma: PrismaService) {}

    async createGoal(params: any) {
        const goal = await this.prisma.tbl_goals.create({
            data:params
        })
        return goal;
    }

    async getGoal(params: any) {
        const goal = await this.prisma.tbl_goals.findFirst({
            where:{
                id_goals: params
            }
        })
        return goal;
    }

    async getGoals(params: any) {
        const goal = await this.prisma.tbl_goals.findMany(params)
        return goal;
    }

    async updateGoals(id_goals: any, data: any) {
        const goal = await this.prisma.tbl_goals.updateMany({
            where: {id_goals: id_goals},
            data:data
        })
        return goal.count;
    }

    async updateKodefikasi(id_goal: number, parent_data: any) {
        var finalKodefikasi = (parent_data.kodefikasi == null || parent_data.kodefikasi == '') ? id_goal.toString() : parent_data.kodefikasi+'-'+id_goal.toString(); 
        const goal = await this.prisma.tbl_goals.update({
            where:{
                id_goals: id_goal
            },
            data : {
                kodefikasi: finalKodefikasi,
                parent_family: parent_data.parent_goals == 0 || parent_data.parent_goals == "0" ? parent_data.id_goals : parent_data.parent_family
            }
        })
        return goal;
    }

    async deleteGoal(id_goal: number) {
        const goal = await this.prisma.tbl_goals.delete({
            where:{
                id_goals: id_goal
            }
        })
        return goal;
    }


}