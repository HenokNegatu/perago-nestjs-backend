import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signUpDto } from './dtos/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import { EmployeeEntity, Role, StatusType } from 'src/entities/employee.entity';
import { hash, verify } from 'argon2';
import { signInDto } from './dtos/signIn.dto';
import { AuthJwtPayload } from 'src/utils/types';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
        private jwtService: JwtService
    ) { }

    async signUp(body: signUpDto) {
        const findEmployee = await this.employeeRepository.findOne({
            where: { email: body.email },
            select: ["password", "id", "role", "otp"]
        })

        if (findEmployee.otp !== body.otp) {
            throw new UnauthorizedException('Invalid otp!')
        }

        if (!findEmployee) {
            throw new NotFoundException('Employee not registered!')
        }

        if (findEmployee.password !== null) {
            throw new ConflictException('Employee has already signed up!');
        }

        const { password, ...theRest } = body
        const hashedPassword = await hash(password)

        await this.employeeRepository.update({
            email: body.email
        }, { ...theRest, password: hashedPassword, status: StatusType.Active })
    }

    async forgotPassword(body: signUpDto) {
        const findEmployee = await this.employeeRepository.findOne({
            where: { email: body.email },
            select: ["password", "id", "role", "otp"]
        })

        if (findEmployee.otp !== body.otp) {
            throw new UnauthorizedException('Invalid otp!')
        }

        if (!findEmployee) {
            throw new NotFoundException('Employee not registered!')
        }

        const { password, ...theRest } = body
        const hashedPassword = await hash(password)

        await this.employeeRepository.update({
            email: body.email
        }, { ...theRest, password: hashedPassword, status: StatusType.Active })
    }


    async validateLocalUser({ email, password }: signInDto) {
        const employee = await this.employeeRepository.findOne({
            where: { email: email },
            select: ['id', 'role', 'password'],
        })

        if (!employee) {
            throw new UnauthorizedException('employee not registered!')
        }

        if (employee.password === null) {
            throw new UnauthorizedException('please signup first!')
        }

        const isPasswordMatched = await verify(employee.password, password)

        if (!isPasswordMatched) {
            throw new UnauthorizedException("Invalid credentials!")
        }

        return { employeeId: employee.id, employeeRole: employee.role }
    }

    async login(userId: string, role: Role) {
        const { accessToken } = await this.generateTokens(userId);
        return {
            id: userId,
            role,
            accessToken,
        };
    }

    async generateTokens(userId: string) {
        const payload: AuthJwtPayload = { sub: userId };
        const [accessToken] = await Promise.all([
            this.jwtService.signAsync(payload)
        ]);

        return {
            accessToken
        };
    }

    async validateJwtUser(userId: string) {
        const user = await this.employeeRepository.findOne({
            where: { id: userId }
        });
        if (!user) throw new UnauthorizedException('User not found!');
        const currentUser = { id: user.id, role: user.role };
        return currentUser;
    }
}
