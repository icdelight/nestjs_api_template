import {IsDate, IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AreaDto {
    @IsString()
    @IsNotEmpty()
    id_area: string;

    @IsString()
    @IsNotEmpty()
    desc_area: string;

    @IsString()
    @IsNotEmpty()
    desc_sub_area: string;

    @IsString()
    @IsNotEmpty()
    id_parent_area: string;

    @IsString()
    @IsNotEmpty()
    active: string;
}