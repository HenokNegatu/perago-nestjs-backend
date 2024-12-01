import { BadRequestException, Body, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/entities/task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/createTask.dto';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { EditTaskDto } from './dtos/editTask.dto';
import { EditByEmployeeDto } from './dtos/editByEmployee.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    @InjectRepository(EmployeeEntity)
    private readonly employeeRepository: Repository<EmployeeEntity>,
  ) { }

  async createTask(body: CreateTaskDto) {
    const existingEmployee = await this.taskRepository.findOne({
      where: [
        { title: body.title }
      ],
    });
    if (existingEmployee) {
      throw new ConflictException('Task with this title already exists.');
    }
    const newTask = this.taskRepository.create(body)
    await this.taskRepository.insert(newTask)
    return newTask
  }

  async getTaskById(taskId: string) {
    return await this.taskRepository.findOne({
      where: { id: taskId }
    })
  }

  async addEmployeeToTask(taskId: string, employeeId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });

    if (!task) {
      throw new Error('Task not found');
    }
    if (!employee) {
      throw new Error('Employee not found');
    }

    await this.taskRepository
      .createQueryBuilder()
      .relation(TaskEntity, 'employee')
      .of(task)
      .add(employee);
  }

  async removeEmployeeFromTask(taskId: string, employeeId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });

    if (!task) {
      throw new Error('Task not found');
    }
    if (!employee) {
      throw new Error('Employee not found');
    }

    await this.taskRepository
      .createQueryBuilder()
      .relation(TaskEntity, 'employee')
      .of(task)
      .remove(employee);
  }


  async getTaskWithEmployee() {
    return await this.taskRepository.find({
      relations: ['employee'],
    });
  }

  async editTask(taskId: string, body: EditTaskDto) {
    try {
      const editTask = this.taskRepository.create(body);
      await this.taskRepository.update(taskId, editTask)
      return editTask
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async editTaskByEmployee(taskId: string, body: EditByEmployeeDto) {

    try {
      const editTask = this.taskRepository.create(body);
      await this.taskRepository.update(taskId, editTask)
      return editTask
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async deleteTask(taskId: string) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    await this.taskRepository.delete(taskId);
  }
}
