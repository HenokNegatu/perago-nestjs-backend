import { Column, PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('positions')
export class PositionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({nullable: true})
    parent_id: string;

    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    modifiedAt: Date;

    @ManyToOne(() => PositionEntity, position => position.children, {onDelete: 'CASCADE'})
    @JoinColumn({ name: 'parent_id' })
    parent: PositionEntity | null;

    @OneToMany(() => PositionEntity, position => position.parent, {
        onDelete: 'CASCADE',
        cascade: true
    })
    children: PositionEntity[];
}
