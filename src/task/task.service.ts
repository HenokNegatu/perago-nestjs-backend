import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/createTaskDto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ) { }

    async assignTaskToEmployee(body: CreateTaskDto) {
        try {
            const taskEntity = this.taskRepository.create({
                ...body,
                employee: { id: body.employee }
            });
            await this.taskRepository.insert(taskEntity);
            return taskEntity
        } catch (error) {
            throw new BadRequestException()
        }
    }
}
