import { IsNotEmpty, IsNumber } from "class-validator";

export class updatePositionDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    parent_id: number;
}