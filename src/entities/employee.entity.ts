import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
import { PositionEntity } from './positions.entity';
  
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
  
    @Column({ length: 15, nullable: true })
    phoneNumber: string;
  
    @Column({ type: 'date', nullable: true })
    dateOfBirth: Date;
  
    @Column({ type: 'date' })
    hireDate: Date;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    salary: number;
  
    @Column({
      type: 'enum',
      enum: ['Active', 'Inactive', 'On Leave'],
      default: 'Active',
    })
    status: 'Active' | 'Inactive' | 'On Leave';
  
    @Column({ type: 'text', nullable: true })
    address: string;
  
    @Column({
      type: 'enum',
      enum: ['Male', 'Female'],
      nullable: true,
    })
    gender: 'Male' | 'Female';
  
    @Column({
      type: 'enum',
      enum: ['Single', 'Married', 'Divorced', 'Widowed'],
      nullable: true,
    })
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  
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
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
  