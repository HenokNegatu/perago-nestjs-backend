import { Body, Controller, Post } from '@nestjs/common';
import { CreateTaskDto } from './dtos/createTaskDto';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService) { }

    @Post()
    async assignTaskToEmployee(@Body() body: CreateTaskDto) {
        return await this.taskService.assignTaskToEmployee(body)
    }


}
