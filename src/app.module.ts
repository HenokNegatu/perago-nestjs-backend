import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionsModule } from './positions/positions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './entities/positions.entity';
import { AuthModule } from './auth/auth.module';
import { UsersEntity } from './entities/users.entity';
import { ConfigModule } from '@nestjs/config';

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
    entities: [PositionEntity, UsersEntity],
    synchronize: true,
  }), PositionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [PositionsModule]
})
export class AppModule { }
export { PositionsModule };

