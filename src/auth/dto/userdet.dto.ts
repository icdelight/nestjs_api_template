import {IsNotEmpty, IsString, IsNumber } from "class-validator";

export class UserDetDto {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    active: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;

    @IsNumber()
    @IsNotEmpty()
    area: number;

    @IsNumber()
    @IsNotEmpty()
    subarea: number;

    @IsString()
    @IsNotEmpty()
    apps: string;
}