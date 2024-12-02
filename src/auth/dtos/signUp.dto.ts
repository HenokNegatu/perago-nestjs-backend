import { IsEmail, IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class signUpDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @MinLength(6)
    @MaxLength(6)
    otp: string;
    @IsNotEmpty()
    password: string;
}