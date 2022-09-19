import { Type } from "class-transformer";
import {IsDate, IsInt, IsJSON, isJSON, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddGoalsDto {
    @IsString()
    @IsNotEmpty()
    title_goals: string;

    @IsString()
    @IsNotEmpty()
    desc_goals: string;

    @IsString()
    @IsNotEmpty()
    pic_goals: string;

    @IsJSON()
    type_goals: JSON;

    @IsJSON()
    indikator: JSON;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    start_date: Date;

    @IsDate()
    @IsNotEmpty()
    @Type(() => Date)
    due_date: Date;

    @IsNumber()
    @IsNotEmpty()
    @Type(() => Number)
    parent_goals: number;
}