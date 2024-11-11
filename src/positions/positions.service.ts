import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { PositionEntity } from '../entities/positions.entity';
import { PositionWithChildren } from 'src/utils/types';
import { updatePositionDto } from './dtos/updatePosition.dto';
import { createPositionDto } from './dtos/createPosition.dto';

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
                { name: "CEO", description: "Chief Executive Officer" , children: [
                    { name: "CTO", description: "Chief Technology Officer" },
                    { name: "SEO", description: "Search Engine Optimizer" }
                ]},
                
            ]);
            console.log('Seed data inserted');
        }
    }


    async getAllPositions(): Promise<PositionWithChildren> {
       
        const rootPosition = await this.positionRepository.findOne({
            where: { id: 1 },
            relations: ['children'],
            select: {
                id: true,
                name: true,
                parent_id: true
            }
        });

        if (!rootPosition) {
            throw new NotFoundException('Root position not found');
        }

        return this.buildPositionTree(rootPosition);
    }

    private async buildPositionTree(position: PositionEntity): Promise<PositionWithChildren> {
        const children = await this.positionRepository.find({
            where: { parent_id: position.id },
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

    async getPositionById(id: number): Promise<PositionEntity>{
        const position = await this.positionRepository.findOne({ where: { id } });
        if (position){
            return position
        }
        throw new NotFoundException()
    }

    async createPosition(position: createPositionDto): Promise<PositionEntity>{
        const v = this.positionRepository.create(position);
        console.log(v)
        return await this.positionRepository.save(v);
    }

    async updatePosition(id: number, position: updatePositionDto): Promise<UpdateResult>{
        if (id === 1) {
            throw new BadRequestException("Cannot update CEO position");
        }
        return await this.positionRepository.update(id, position);
    }

    async deletePosition(id: number, deleteChildren: boolean): Promise<void> {

        if (id === 1) {
            throw new BadRequestException("Cannot delete CEO position");
        }

        const position = await this.positionRepository.findOne({
            where: { id },
            relations: [ 'children']
        });

        if (!position) {
            throw new NotFoundException(`Position with ID ${id} not found`);
        }

        

        if (deleteChildren) {
            await this.positionRepository.remove(position);
        } else {
            // Move children to grandparent and delete the position
            await this.moveChildrenToGrandparentAndDelete(position);
        }
    }


    private async moveChildrenToGrandparentAndDelete(position: PositionEntity): Promise<void> {
        const grandparentId = position?.parent_id ;
    
        // Update children to point to the grandparent
        await this.positionRepository.createQueryBuilder()
            .update(PositionEntity)
            .set({ parent: { id: grandparentId } })
            .where("parent_id = :id", { id: position.id })
            .execute();
    
        // Delete the position
        await this.positionRepository.remove(position);
    }

   async getPositionHierarchy(id: number): Promise<PositionWithChildren>{
        return await this.positionRepository.findOne({
            where: { id },
            relations: ['children'],
        });
    }
}
