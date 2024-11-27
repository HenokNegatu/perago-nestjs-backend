import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    JoinTable,
    ManyToMany,
  } from 'typeorm';
  import { EmployeeEntity } from './employee.entity';

  export enum TaskStatusType {
    Todo = 'Todo',
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
      default: 'Todo',
    })
    status: TaskStatusType;
  
    @Column({ type: 'timestamptz', nullable: true })
    dueDate: Date;
  
    @Column({ type: 'boolean', default: false })
    isPriority: boolean;
  
    @ManyToMany(() => EmployeeEntity, (employee) => employee.task)
    @JoinTable()
    employee: EmployeeEntity;
  
    @CreateDateColumn({type: 'timestamptz'})
    createdAt: Date;
  
    @UpdateDateColumn({type: 'timestamptz'})
    updatedAt: Date;
  }
  