import {IsJSON, IsNotEmpty, IsString } from "class-validator";

export class RemapsGoalDto {
    @IsNotEmpty({message: "Variable New Map kosong."})        
    @IsJSON({
        message: (validate) => {
            return validate.property + ' bukan JSON yang valid.';
    } })
    NewMap: string;
}

