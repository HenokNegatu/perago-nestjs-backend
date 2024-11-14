import { IsNotEmpty, IsNumber } from "class-validator";

export class updatePositionDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    description: string;
    @IsNotEmpty()
    parent_id: string;
}