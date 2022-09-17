import { Type } from "class-transformer";
import {IsDate, IsInt, IsNotEmpty, isNotEmptyObject, IsNumber, IsOptional, IsString } from "class-validator";

export class EditGoalsDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    id_goals: number;

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
    status: number;
}