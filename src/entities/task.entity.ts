import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { EmployeeEntity } from './employee.entity';

  export enum TaskStatusType {
    Pending = 'Pending',
    InProgress = 'In Progress', 
    Completed = 'Completed', 
    Cancelled = 'Cancelled'
  }
  
  @Entity('employee_tasks')
  export class TaskEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 255 })
    title: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({
      type: 'enum',
      enum: TaskStatusType,
      default: 'Pending',
    })
    status: TaskStatusType;
  
    @Column({ type: 'date', nullable: true })
    dueDate: Date;
  
    @Column({ type: 'boolean', default: false })
    isPriority: boolean;
  
    @ManyToOne(() => EmployeeEntity, (employee) => employee.task, {nullable: true, onDelete: 'SET NULL'})
    employee: EmployeeEntity;
  
    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;
  
    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
  }
  