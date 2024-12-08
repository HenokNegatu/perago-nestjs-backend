import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeEntity } from 'src/entities/employee.entity';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { PositionEntity } from 'src/entities/positions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity, PositionEntity])],
    controllers: [EmployeeController],
    providers: [EmployeeService]
  })
export class EmployeeModule {}
