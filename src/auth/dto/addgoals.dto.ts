import { Type } from "class-transformer";
import {IsDate, IsJSON, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddGoalsDto {
    @IsString()
    @IsNotEmpty({message : "$property kosong."})
    issue_goals: string;

    @IsString()
    @IsNotEmpty({message : "$property kosong."})
    title_goals: string;

    @IsString()
    @IsNotEmpty({message : "$property kosong."})
    desc_goals: string;

    @IsString()
    @IsNotEmpty({message : "$property kosong."})
    pic_goals: string;

    @IsJSON({message : "Tipe Goal JSON tidak valid"})
    type_goals: JSON;

    @IsJSON({message : "Indikator JSON tidak valid"})
    indikator: JSON;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    start_date: Date;

    @IsDate()
    @IsNotEmpty({message : "$property kosong."})
    @Type(() => Date)
    due_date: Date;

    @IsNumber()
    @IsNotEmpty({message : "$property kosong."})
    @Type(() => Number)
    parent_goals: number;

    @IsNumber()
    @IsNotEmpty({message : "$property kosong."})
    @Type(() => Number)
    id_area: number;

    @IsNumber()
    @IsNotEmpty({message : "$property kosong."})
    @Type(() => Number)
    id_cluster: number;
}