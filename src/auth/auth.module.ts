import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { localStrategy } from './strategies/local.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [JwtModule.registerAsync(jwtConfig.asProvider()),
  JwtModule.registerAsync(jwtConfig.asProvider()),
  ConfigModule.forFeature(jwtConfig),
  TypeOrmModule.forFeature([EmployeeEntity]),
  MailerModule
  ],
  controllers: [AuthController],
  providers: [AuthService, localStrategy, JwtStrategy ]
})
export class AuthModule { }
