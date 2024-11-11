import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { signInDto } from './dtos/signIn.dto';
import { signUpDto } from './dtos/signUp.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Get()
    async allUsers(){
        return this.authService.allUsers()
    }

    @Post('signin')
    @UsePipes(new ValidationPipe())
    async signIn(@Body() body:signInDto){
        return await this.authService.signIn(body)
    }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() body:signUpDto){
        return await this.authService.signUp(body)
    }
}
