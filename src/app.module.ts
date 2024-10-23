import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionsModule } from './positions/positions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from './entities/positions.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'root',
    database: 'orga_structure',
    entities: [PositionEntity],
    synchronize: true,
  }), PositionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
