import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity('positions')
export class PositionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({nullable: true})
    parent_id: number;

    @ManyToOne(() => PositionEntity, position => position.children)
    @JoinColumn({ name: 'parent_id' })
    parent: PositionEntity | null;

    @OneToMany(() => PositionEntity, position => position.parent)
    children: PositionEntity[];
}
