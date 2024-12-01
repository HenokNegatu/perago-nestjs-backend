import { IsEnum } from "class-validator";
import { TaskStatusType } from "src/entities/task.entity";

export class EditByEmployeeDto {
@IsEnum(TaskStatusType)
status: TaskStatusType;
}