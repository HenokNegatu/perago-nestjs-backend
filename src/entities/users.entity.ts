import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class UsersEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string; //uuid

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

}