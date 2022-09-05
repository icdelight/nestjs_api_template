import {IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Timestamp } from "rxjs";

export class GoalsDto {
    @IsNumber()
    @IsNotEmpty()
    id_goals: number;

    @IsString()
    @IsNotEmpty()
    title_goals: string;

    @IsString()
    @IsNotEmpty()
    desc_goals: string;

    @IsString()
    @IsNotEmpty()
    pic_goals: string;

    @IsString()
    @IsNotEmpty()
    type_goals: string;

    @IsDate()
    @IsNotEmpty()
    start_date: Date;

    @IsDate()
    @IsNotEmpty()
    due_date: Date;

    @IsNumber()
    @IsNotEmpty()
    status_goals: number;

    @IsNumber()
    @IsNotEmpty()
    progress: number;

    @IsNumber()
    @IsNotEmpty()
    parent_goals: number;
}