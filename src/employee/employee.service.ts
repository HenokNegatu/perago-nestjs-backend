import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { Repository } from 'typeorm';
import { AddEmployeeDto } from './dtos/addEmployee.dto';

@Injectable()
export class EmployeeService {
    constructor(
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>
    ){}

    async addEmployee(body: AddEmployeeDto){
        try {
            const newEmployee = this.employeeRepository.create(body)
            await this.employeeRepository.insert(newEmployee)
            return newEmployee
        } catch (error) {
            throw new BadRequestException()
        }
    }
}
