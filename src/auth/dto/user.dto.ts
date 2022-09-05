import {IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    pass: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsString()
    @IsNotEmpty()
    firstname: string;
}