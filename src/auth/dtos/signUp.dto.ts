import { IsEmail, IsNotEmpty } from "class-validator";

export class signUpDto {
    @IsNotEmpty()
    username: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsNotEmpty()
    password: string;
}