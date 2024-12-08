import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity, GenderType, MaritalStatusType, Role, StatusType } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { PositionEntity } from 'src/entities/positions.entity';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
        @InjectRepository(PositionEntity)
        private readonly positionRepository: Repository<PositionEntity>,
    ) { }

    async onModuleInit() {
        await this.seed();
    }

    private async seed() {
        const positions = await this.positionRepository.find();
        if (positions.length === 0) {
            console.log('No positions found. Please seed positions first.');
            return;
        }
        const count = await this.employeeRepository.count();
        const now = new Date();
        if (count === 0) {
            await this.employeeRepository.save([
                {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: `${process.env.ADMIN_SETUP_EMAIL}`,
                    phoneNumber: '+251911111111',
                    dateOfBirth: new Date('1990-01-01'),
                    hireDate: new Date(),
                    salary: 5000.0,
                    status: StatusType.Active,
                    address: '123 Elm Street, Springfield',
                    gender: GenderType.Male,
                    maritalStatus: MaritalStatusType.Single,
                    emergencyContactName: 'Jane Doe',
                    emergencyContactNumber: '0987654321',
                    nationalId: 'ID123456',
                    profilePictureUrl: 'https://example.com/profile/john_doe.jpg',
                    position: positions[0],
                    role: Role.Admin,
                    otp: "111111",
                    expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
                },
            ]);
            console.log('Seed data inserted');
        }
    }

    async addEmployee(body: AddEmployeeDto) {
        const existingEmployee = await this.employeeRepository.findOne({
            where: [
                { email: body.email },
                { nationalId: body.nationalId },
            ],
        });

        if (existingEmployee) {
            throw new ConflictException('An employee with this email or national ID already exists.');
        }
        try {
            const newEmployee = this.employeeRepository.create(body)
            await this.employeeRepository.insert(newEmployee)
            return newEmployee
        } catch (error) {
            console.log(error)
            throw new BadRequestException()
        }
    }

    async getEmployeeWithTask() {
        return await this.employeeRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.task', 'task')
            .leftJoin('employee.position', 'position')
            .addSelect('position.name')
            .getMany();
    }

    async getEmployeeWithTaskById(employeeId: string) {
        return await this.employeeRepository
            .createQueryBuilder('employee')
            .leftJoinAndSelect('employee.task', 'task')
            .leftJoin('employee.position', 'position')
            .addSelect(['position.name', 'position.id'])
            .where('employee.id = :employeeId', { employeeId })
            .getOne();
    }

    async editEmployee(employeeId: string, body: AddEmployeeDto) {
        try {
            const editEmployee = this.employeeRepository.create(body)
            await this.employeeRepository.update(employeeId, editEmployee)
            return editEmployee
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async deleteEmployee(employeeId: string) {
        try {
            const result = await this.employeeRepository.softDelete(employeeId);
            if (result.affected === 0) {
                throw new BadRequestException('Employee not found');
            }
            return { message: 'Employee deleted' };
        } catch (error) {
            throw new BadRequestException();
        }
    }
}