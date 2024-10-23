import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity('positions')
export class PositionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    parent_id: number;
}
