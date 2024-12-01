import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';
import { PositionEntity } from './positions.entity';
import { TaskEntity } from './task.entity';


export enum StatusType {
  Active = "Active",
  Inactive = "Inactive",
  OnLeave = "On Leave"
}

export enum GenderType {
  Male = "Male",
  Female = "Female"
}

export enum MaritalStatusType {
  Single = "Single",
  Married = "Married",
  Divorced = "Divorced",
  Widowed = "Widowed"
}

export enum Role {
  Admin = "admin",
  NonAdmin = 'non-admin'
}

@Entity('employees') // Specify table name
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 150, unique: true })
  email: string;

  @Column({ length: 15 })
  phoneNumber: string;

  @Column({ type: 'timestamptz', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'timestamptz' })
  hireDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column({
    type: 'enum',
    enum: StatusType,
    default: 'Inactive',
  })
  status: StatusType;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({
    type: 'enum',
    enum: GenderType,
  })
  gender: GenderType;

  @Column({
    type: 'enum',
    enum: MaritalStatusType,
    nullable: true,
  })
  maritalStatus: MaritalStatusType;

  @Column({ length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ length: 15, nullable: true })
  emergencyContactNumber: string;

  @Column({ length: 50, unique: true, nullable: true })
  nationalId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  profilePictureUrl: string;

  @ManyToOne(() => PositionEntity, (position) => position.employee)
  position: PositionEntity;

  @ManyToMany(() => TaskEntity, (task) => task.employee)
  task: TaskEntity[];

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.NonAdmin
  })
  role: Role

  @Column({ nullable: true, select: false })
  password: string

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
