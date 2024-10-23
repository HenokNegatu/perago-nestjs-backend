import { IsNotEmpty, IsNumber } from "class-validator";

export class createPositionDto {
    @IsNotEmpty()
    name: string; 
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    parent_id: number
}