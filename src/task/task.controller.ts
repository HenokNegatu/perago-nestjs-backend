import { Body, Controller, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { CreateTaskDto } from './dtos/createTaskDto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) { }

    @Post()
    async assignTaskToEmployee(@Body() body: CreateTaskDto) {
        return await this.taskService.assignTaskToEmployee(body)
    }

    @Put(':taskId')
    async editTask(@Param('taskId', new ParseUUIDPipe()) taskId: string, @Body() body: CreateTaskDto) {
        return await this.taskService.editTask(taskId, body)
    }


}
