import { IsOptional, IsString, IsUUID, IsDateString, MaxLength, IsEnum, IsBoolean } from 'class-validator';
import { TaskStatusType } from '../../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  isPriority: boolean;

  @IsEnum(TaskStatusType)
  status: TaskStatusType;

  @IsUUID()
  @IsOptional()
  employee?: string; 
}
