import { BadRequestException, Injectable } from '@nestjs/common';
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
        try {
            const newEmployee = this.employeeRepository.create(body)
            await this.employeeRepository.insert(newEmployee)
            return newEmployee
        } catch (error) {
            throw new BadRequestException()
        }
    }

    async getEmployeeWithTask(employeeId: string){
        return await this.employeeRepository.find({
            where:{id: employeeId},
            relations:['task']
        })
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