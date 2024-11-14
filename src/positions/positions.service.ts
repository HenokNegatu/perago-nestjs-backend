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
                    { name: "CTO", description: "Chief Technology Officer", children: [
                        { name: "R&D Manager", description: "A Research and Development (R&D) manager" }
                    ] },
                    { name: "SEO", description: "Description for SEO" }
                ]},
                
            ]);
            console.log('Seed data inserted');
        }
    }


    async getAllPositions(): Promise<PositionWithChildren> {
       
        const rootPosition = await this.positionRepository.findOne({
            where: { name: "CEO" },
            relations: ['children'],
        });

        if (!rootPosition) {
            throw new NotFoundException('Root position not found');
        }

        return this.buildPositionTree(rootPosition);
    }

    private async buildPositionTree(position: PositionEntity): Promise<PositionWithChildren> {
        const children = await this.positionRepository.find({
            where: { parent_id: position.id },
            select: ['id', 'name', 'description', 'createdAt', 'modifiedAt', 'parent_id'],
            relations: ['children'],
        });

        const positionWithChildren: PositionWithChildren = {
            id: position.id,
            name: position.name,
            description: position.description,
            createdAt: position.createdAt,
            modifiedAt: position.modifiedAt,
            parent_id: position.parent_id,
            children: [],
        };

        for (const child of children) {
            positionWithChildren.children.push(await this.buildPositionTree(child));
        }

        return positionWithChildren;
    }

    async getPositionById(id: string): Promise<PositionEntity>{
        const position = await this.positionRepository.findOne({ where: { id } });
        if (position){
            return position
        }
        throw new NotFoundException()
    }

    async createPosition(position: createPositionDto): Promise<PositionEntity>{
        const newPosition = this.positionRepository.create(position);
        return await this.positionRepository.save(newPosition);
    }

    async updatePosition(id: string, editPosition: updatePositionDto): Promise<UpdateResult>{
       
        const position = await this.positionRepository.findOne({ where: { id },relations: [ 'children'] });

        if (position.name === "CEO") {
            throw new BadRequestException("Cannot update CEO position");
        }
        return await this.positionRepository.update(id, editPosition);
    }

    async deletePosition(id: string, deleteChildren: boolean): Promise<void> {
        const position = await this.positionRepository.findOne({ where: { id },relations: [ 'children'] });

        if (position.name === "CEO") {
            throw new BadRequestException("Cannot delete CEO position");
        }

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

   async getPositionHierarchy(id: string): Promise<PositionWithChildren>{
        return await this.positionRepository.findOne({
            where: { id },
            relations: ['children'],
        });
    }
}
