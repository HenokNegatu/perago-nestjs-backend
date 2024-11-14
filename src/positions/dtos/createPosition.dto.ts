import { IsNotEmpty, IsNumber } from "class-validator";

export class createPositionDto {
    @IsNotEmpty()
    name: string; 
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    parent_id: string
}