import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PositionEntity } from '../entities/positions.entity';
import { Position, PositionWithChildren } from 'src/utils/types';

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


    async getAllPositions(): Promise<PositionWithChildren> {
        const rootPosition = await this.positionRepository.findOne({
            where: { id: 1 },
            relations: ['children'],
        });

        if (!rootPosition) {
            throw new NotFoundException('Root position not found');
        }

        return this.buildPositionTree(rootPosition);
    }

    private async buildPositionTree(position: PositionEntity): Promise<PositionWithChildren> {
        const children = await this.positionRepository.find({
            where: { parent: { id: position.id } },
            relations: ['children'],
        });

        const positionWithChildren: PositionWithChildren = {
            id: position.id,
            name: position.name,
            description: position.description,
            parent_id: position.parent?.id,
            children: [],
        };

        for (const child of children) {
            positionWithChildren.children.push(await this.buildPositionTree(child));
        }

        return positionWithChildren;
    }

    getPositionById(id: number) {
        return this.positionRepository.findOne({ where: { id } });
    }

    createPosition(position: Position) {
        return this.positionRepository.save(position);
    }

    updatePosition(id: number, position: Position) {
        if (id === 1) {
            throw new BadRequestException("Cannot update CEO position");
        }
        return this.positionRepository.update(id, position);
    }

    async deletePosition(id: number, deleteChildren: boolean): Promise<void> {

        if (id === 1) {
            throw new BadRequestException("Cannot delete CEO position");
        }

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
