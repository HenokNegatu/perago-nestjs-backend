import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskEntity } from 'src/entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, EmployeeEntity])],
  controllers: [TaskController],
  providers: [TaskService]
})
export class TaskModule {}
