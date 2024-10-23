import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from 'src/entities/positions.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PositionEntity])],
  controllers: [PositionsController],
  providers: [PositionsService]
})
export class PositionsModule {}
