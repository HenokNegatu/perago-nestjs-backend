import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {

    constructor(private employeeService: EmployeeService){}
 
    @Post()
    async addEmployee(@Body(new ValidationPipe()) body:AddEmployeeDto){
        return await this.employeeService.addEmployee(body)
    }
}
