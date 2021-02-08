import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserMapping {
    @PrimaryGeneratedColumn()
    id: Number

    @Column({ unique: true })
    userId: Number

    @Column({ nullable: true })
    accountId: Number

    @Column()
    shopId: Number
}
