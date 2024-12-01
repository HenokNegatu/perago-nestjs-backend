import { Body, Controller, Param, ParseUUIDPipe, Post, Put, Delete, Get } from '@nestjs/common';
import { CreateTaskDto } from './dtos/createTask.dto';
import { TaskService } from './task.service';
import { EditByEmployeeDto } from './dtos/editByEmployee.dto';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) { }
    
    @Get()
    async getTaskWithEmployee(){
        return await this.taskService.getTaskWithEmployee()
    }

    @Get(':taskId')
    async getTaskById(@Param('taskId', new ParseUUIDPipe()) taskId: string){
        return await this.taskService.getTaskById(taskId)
    }


    @Post()
    async createTask(@Body() body: CreateTaskDto){
        return await this.taskService.createTask(body)
    }

    @Post(":taskId/assign")
    async addEmployeeToTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body('employeeId') employeeId: string) {
        return await this.taskService.addEmployeeToTask(taskId, employeeId)
    }

    @Post(":taskId/remove")
    async removeEmployeeFromTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body('employeeId') employeeId: string) {
        return await this.taskService.removeEmployeeFromTask(taskId, employeeId)
    }

    @Put(':taskId')
    async editTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body() body: CreateTaskDto) {
        return await this.taskService.editTask(taskId, body)
    }

    @Put(':taskId/employee')
    async editTaskByEmployee(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body() body: EditByEmployeeDto) {
        return await this.taskService.editTaskByEmployee(taskId, body)
    }

    @Delete(':taskId')
    async deleteTask(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
        return await this.taskService.deleteTask(taskId);
    }
}
