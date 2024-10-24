import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../entities/positions.entity';
import { Position } from 'src/utils/types';

@Injectable()
export class PositionsService {
    constructor(
        @InjectRepository(PositionEntity)
        private readonly positionRepository: Repository<PositionEntity>
    ) { }

    async onModuleInit() {
        await this.seed();
    }

    private async seed() {
        const count = await this.positionRepository.count();
        if (count === 0) {
            await this.positionRepository.save([
                { name: "CEO", description: "Chief Executive Officer" },
                { name: "CTO", description: "Chief Technology Officer", parent: { id: 1 } },
                { name: "SEO", description: "Search Engine Optimizer", parent: { id: 1 } }
            ]);
            console.log('Seed data inserted');
        }
    }


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

    async deletePosition(id: number, deleteChildren: boolean): Promise<void> {
        const position = await this.positionRepository.findOne({
            where: { id },
            relations: ['parent', 'children']
        });

        if (!position) {
            throw new NotFoundException(`Position with ID ${id} not found`);
        }

        if (deleteChildren) {
            // Recursively delete all children first

            for (const child of position.children) {
                await this.deletePosition(child.id, true); // Recursively delete child and its descendants
            }

            // Finally, delete the parent position
            await this.positionRepository.remove(position);
        } else {
            // Move children to grandparent and delete the position
            await this.moveChildrenToGrandparentAndDelete(position);
        }
    }


    private async moveChildrenToGrandparentAndDelete(position: PositionEntity): Promise<void> {
        const grandparentId = position.parent ? position.parent.id : null;
    
        // Update children to point to the grandparent
        await this.positionRepository.createQueryBuilder()
            .update(PositionEntity)
            .set({ parent: { id: grandparentId } })
            .where("parent_id = :id", { id: position.id })
            .execute();
    
        // Delete the position
        await this.positionRepository.remove(position);
    }
}
