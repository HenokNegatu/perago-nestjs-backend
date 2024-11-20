import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsDate, IsNumber, Min, MaxLength, IsUUID, IsPhoneNumber, IsDateString } from 'class-validator';
import { GenderType, MaritalStatusType, StatusType } from 'src/entities/employee.entity';
import { PositionEntity } from 'src/entities/positions.entity';

export class AddEmployeeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsOptional()
  @IsPhoneNumber(null)
  phoneNumber?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @IsNotEmpty()
  @IsDateString()
  hireDate: Date;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salary?: number;

  @IsOptional()
  @IsEnum(StatusType)
  status?: StatusType;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsEnum(GenderType)
  gender?: GenderType;

  @IsOptional()
  @IsEnum(MaritalStatusType)
  maritalStatus?: MaritalStatusType;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergencyContactName?: string;

  @IsOptional()
  @IsPhoneNumber(null)
  emergencyContactNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationalId?: string;

  @IsOptional()
  @IsUUID()
  position?: PositionEntity;
}
