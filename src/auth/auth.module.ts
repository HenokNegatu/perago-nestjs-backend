import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from '../utils/constants';
import { UsersEntity } from '../entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[JwtModule.register({
    global: true,
    secret: JwtConstants.secret,
    signOptions: { expiresIn: '60s' },
  }),
  TypeOrmModule.forFeature([UsersEntity])
],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
