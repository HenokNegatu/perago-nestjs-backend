import { Injectable, NotFoundException } from '@nestjs/common';
import * as nodemailer from 'nodemailer'
import { ConfigService } from '@nestjs/config';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SendOtpDto } from './dtos/sendOtp.dto';
import * as crypto from 'crypto';

@Injectable()
export class MailerService {
    constructor(private readonly configService: ConfigService,
        @InjectRepository(EmployeeEntity)
        private readonly mailerRepository: Repository<EmployeeEntity>
    ) { }
    emailTrasport() {
        const transporter = nodemailer.createTransport({
            host: this.configService.get<string>("EMAIL_HOST"),
            port: this.configService.get<number>("EMAIL_PORT"),
            secure: false,
            auth: {
                user: this.configService.get<string>("EMAIL"),
                pass: this.configService.get<string>("EMAIL_PASSWORD")
            }
        })
        return transporter
    }
    async sendMail(email: string, name: string, otp: string) {

        const subject = "Complete Your Employee Registration - Verify Your OTP"
        const text = `Dear ${name},
    
    Thank you for signing up! To complete your registration, please verify your email by entering the One - Time Password(OTP) provided below:
    
    Your OTP: ${otp}
    
    This OTP is valid for the next 5 minutes.Please do not share this code with anyone for security reasons.
    
    If you did not request this registration, please ignore this email.
    
    Best regards,
        Perago systems 
    ${this.configService.get<string>("SUPPORT_EMAIL")}
    `
        const trasport = this.emailTrasport()
        const options: nodemailer.SendMailOptions = {
            to: email,
            subject: subject,
            text: text
        }

        try {
            await trasport.sendMail(options)
            console.log("email sent to", email)
        } catch (error) {
            console.log('Error sending mail', error)
        }

    }

    async generateOtp(body: SendOtpDto) {

        const employee = await this.mailerRepository.findOne({
            where: { email: body.email }
        })

        if (!employee) {
            throw new NotFoundException('Employee not registered!')
        }

        try {
            const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
            const name = `${employee.firstName} ${employee.lastName}`
            await this.mailerRepository.update(employee.id, { otp, expiresAt });
            
            
            this.sendMail(body.email, name, otp)
        } catch (error) {
            console.log(error)
            throw new Error('Some unexpected error')
        }


    }

    async verifyOtp(email: string, otp: string): Promise<boolean> {
        const record = await this.mailerRepository.findOne({ where: { email, otp } });
        if (!record || record.expiresAt < new Date()) return false;
        await this.mailerRepository.save(record);
        return true;
    }
}
