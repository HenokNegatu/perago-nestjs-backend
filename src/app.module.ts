import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionsModule } from './positions/positions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './entities/positions.entity';
import { AuthModule } from './auth/auth.module';
import { UsersEntity } from './entities/users.entity';
import { ConfigModule } from '@nestjs/config';
import { EmployeeEntity } from './entities/employee.entity';
import { EmployeeModule } from './employee/employee.module';
import { TaskEntity } from './entities/task.entity';
import { TaskModule } from './task/task.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }),
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: `${process.env.HOST}`,
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'orga_structure',
    entities: [PositionEntity, UsersEntity, EmployeeEntity, TaskEntity],
    synchronize: true,
  }), PositionsModule, AuthModule, EmployeeModule, TaskModule, MailerModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [PositionsModule]
})
export class AppModule { }
export { PositionsModule };

