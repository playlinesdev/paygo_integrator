import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ApiSettings {
    @PrimaryColumn({ generated: true })
    id: number

    @Column()
    name: String

    @Column()
    enterativeHost: String

    @Column()
    enterativePort: Number

    @Column()
    enterativePayGoUser: String

    @Column()
    enterativePayGoPassword: String

    @Column()
    paygoBaseUrl: String

    @Column()
    paygoAuthenticationApi: String

    @Column()
    paygoAuthenticationKey: String

    @Column()
    paygoPixProvider: String

    @Column()
    paygoPixKey: String

    @Column({ default: '' })
    puchaseDescriptionTemplate: String

    @Column()
    postBackUrl: String

    getEnterativeUrl(): string {
        return `${this.enterativeHost}:${this.enterativePort.toString()}`
    }
}
