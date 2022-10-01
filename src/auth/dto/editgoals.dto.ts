import { Type } from "class-transformer";
import {IsDate, IsInt, IsJSON, IsNotEmpty, isNotEmptyObject, IsNumber, IsOptional, IsString } from "class-validator";

export class EditGoalsDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id_goals: number;

    @IsString()
    @IsOptional()
    issue_goals: string;

    @IsString()
    @IsOptional()
    title_goals: string;

    @IsString()
    @IsOptional()
    desc_goals: string;

    @IsString()
    @IsOptional()
    pic_goals: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    start_date: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    due_date: Date;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    status_goals: number;

    @IsJSON({ message: "Tipe Goal JSON tidak valid" })
    @IsOptional()
    type_goals: JSON;

    @IsJSON({ message: "Indikator JSON tidak valid" })
    @IsOptional()
    indikator: JSON;

    @IsOptional()
    @Type(() => Number)
    id_cluster: number;

    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    id_area: number;
}