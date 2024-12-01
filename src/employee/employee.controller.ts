import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put, ValidationPipe } from '@nestjs/common';
import { AddEmployeeDto } from './dtos/addEmployee.dto';
import { EmployeeService } from './employee.service';

@Controller('employee')
export class EmployeeController {

    constructor(private employeeService: EmployeeService, ) { }

    @Get('')
    async getEmployeeWithTask(){
        return await this.employeeService.getEmployeeWithTask()
    }

    @Get(':employeeId')
    async getEmployeeWithTaskById(@Param('employeeId', new ParseUUIDPipe())employeeId: string){
        return await this.employeeService.getEmployeeWithTaskById(employeeId)
    }

    @Post()
    async addEmployee(@Body(new ValidationPipe()) body: AddEmployeeDto) {
        return await this.employeeService.addEmployee(body)
    }

    @Put(':employeeId')
    async editEmployee(@Param('employeeId', new ParseUUIDPipe()) employeeId: string, @Body(new ValidationPipe()) body: AddEmployeeDto) {
        return await this.employeeService.editEmployee(employeeId, body)
    }

    @Delete(':employeeId')
    async deleteEmployee(@Param('employeeId', new ParseUUIDPipe()) employeeId: string) {
        return await this.employeeService.deleteEmployee(employeeId);
    }

    
}
