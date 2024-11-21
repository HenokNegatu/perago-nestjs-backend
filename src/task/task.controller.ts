import { Body, Controller, Param, ParseUUIDPipe, Post, Put, Delete, Get } from '@nestjs/common';
import { CreateTaskDto } from './dtos/createTask.dto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) { }
    
    @Get()
    async getTaskWithEmployee(){
        return await this.taskService.getTaskWithEmployee()
    }


    @Post()
    async createTask(@Body() body: CreateTaskDto){
        return await this.taskService.createTask(body)
    }

    @Post(":taskId/assign")
    async addEmployeeToTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body('employeeId') employeeId: string) {
        return await this.taskService.addEmployeeToTask(taskId, employeeId)
    }

    @Put(':taskId')
    async editTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body() body: CreateTaskDto) {
        return await this.taskService.editTask(taskId, body)
    }

    @Delete(':taskId')
    async deleteTask(@Param('taskId', new ParseUUIDPipe()) taskId: string) {
        return await this.taskService.deleteTask(taskId);
    }
}
