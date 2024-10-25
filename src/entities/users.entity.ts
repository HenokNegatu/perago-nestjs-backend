import { Column, Entity } from "typeorm";

@Entity('auth')
export class UsersEntity {
    @Column()
    id: string; //uuid

    @Column()
    email: string;

    @Column()
    password: string;

}