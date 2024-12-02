import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { signUpDto } from './dtos/signUp.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { SendOtpDto } from '../mailer/dtos/sendOtp.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService, private readonly otpService: MailerService) {}


    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() body:signUpDto){
        return await this.authService.signUp(body)
    }

    @UseGuards(LocalAuthGuard)
    @Post('Signin')
    async signIn(@Request() req){
        return this.authService.login(req.user.employeeId, req.user.employeeRole)
    }

    @Post('send-otp')
    async sendOtp(@Body() email: SendOtpDto){
        return await this.otpService.generateOtp(email)
    }
}
