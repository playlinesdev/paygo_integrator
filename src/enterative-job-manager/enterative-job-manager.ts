import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';

@Entity()
export class EnterativeJobManager {
    @PrimaryGeneratedColumn()
    id: Number

    @Column({ name: 'reference_id', nullable: true })
    referenceId: Number

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

    @Column({ name: 'url', nullable: true })
    fullUrl: String

    @Column()
    status: EnterativeJobStatus

    @Column({ nullable: true })
    message?: String
}

export const enum EnterativeJobStatus {
    START, FINISHED, FAILED
}