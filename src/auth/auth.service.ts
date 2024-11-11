import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signInDto } from './dtos/signIn.dto';
import { signUpDto } from './dtos/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '../entities/users.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly userRepository: Repository<UsersEntity>,
        private jwtService: JwtService
    ) { }

    async signIn(body: signInDto){
        const findUser = await this.userRepository.findOne({
            where:{email: body.email} 
        })
        if( findUser?.password !== body.password){
            return new ForbiddenException("unauth user")
        }
        const {password, ...user} = findUser
        console.log(user)
        return {access_token: this.jwtService.sign(user)}
    }

    async signUp(body: signUpDto){
        const user = await this.userRepository.findOne({
            where:{email: body.email} 
        })

        if(user){
            return new BadRequestException("email already in use")
        }

        return await this.userRepository.insert(body)

    }

    async allUsers(){
        const users = await this.userRepository.find()
        return users
    }
}
