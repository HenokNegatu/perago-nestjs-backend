import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { AddEmployeeDto } from './dtos/addEmployee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
    ) { }

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