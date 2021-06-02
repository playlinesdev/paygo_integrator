import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EnterativeCommunicationStatus, TransactionStatus } from './transaction_enum';

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: Number

    @Column({ name: 'user_id' })
    userId: Number

    @Column({ type: 'decimal', scale: 2, precision: 11 })
    amount: Number

    @Column({ name: 'reference_id', unique: true })
    referenceId: String

    @Column({ nullable: true, name: 'paygo_transaction_id' })
    paygoTransactionId?: String

    @Column({ type: 'int', name: 'payment_provider_status', nullable: false })
    paymentProviderStatus: TransactionStatus

    @Column({ type: 'int', name: 'enterative_status', nullable: false, default: EnterativeCommunicationStatus.idle })
    enterativeStatus: EnterativeCommunicationStatus

    @Column({ default: false, name: 'enterative_activated' })
    enterativeActivated: boolean

    @Column({ default: '' })
    description: String

    @Column({ nullable: true, name: 'qr_code' })
    qrCode: String

    @Column({ default: '' })
    paymentPixProvider: String

    @CreateDateColumn({ name: 'expiration_date_time' })
    expirationDateTime: Date

    @CreateDateColumn({ name: 'purchase_date' })
    purchaseDate: Date
}
