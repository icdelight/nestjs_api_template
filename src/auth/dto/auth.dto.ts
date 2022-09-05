import {IsNotEmpty, IsString } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    user: string;

    @IsString()
    @IsNotEmpty()
    pass: string;

}