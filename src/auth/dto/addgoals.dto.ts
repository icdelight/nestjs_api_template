import {IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

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

    @IsDate()
    @IsNotEmpty()
    start_date: Date;

    @IsDate()
    @IsNotEmpty()
    due_date: Date;

    @IsNumber()
    @IsNotEmpty()
    parent_goals: number;
}