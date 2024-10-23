import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../entities/positions.entity';
import { Position } from 'src/utils/types';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(PositionEntity)
        private readonly positionRepository: Repository<PositionEntity>
    ) {}

    getAllPositions() {
        return this.positionRepository.find();
    }   

    getPositionById(id: number) {
        return this.positionRepository.findOne({ where: { id } });
    }   

    createPosition(position: Position) {
        return this.positionRepository.save(position);
    }

    updatePosition(id: number, position: Position) {
        return this.positionRepository.update(id, position);
    }

    deletePosition(id: number) {
        return this.positionRepository.delete(id);
    }
}
