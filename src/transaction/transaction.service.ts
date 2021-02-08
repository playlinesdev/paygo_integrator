import { HttpService, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction';
import axios from 'axios'
import * as https from 'https'

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private readonly repository: Repository<Transaction>,
        private httpService: HttpService,
        private apiSettingsService: ApiSettingsService
    ) { }

    async createEnterativePurchase(userId: Number, amount: Number, shopId: Number) {
        try {
            let apiSettings = await this.apiSettingsService.findFirst()
            let baseUrl = apiSettings.getEnterativeUrl()
            let url = baseUrl + `/paygoIntegrator/purchase_order/create?userId=${userId}&value=${amount}&shopId=${shopId}`
            let agent = new https.Agent({ rejectUnauthorized: false });
            let response = await axios.post(url, {}, {
                timeout: process.env.ENTERATIVE_TIMEOUT ? Number(process.env.ENTERATIVE_TIMEOUT) : 5000,
                httpsAgent: agent,
                withCredentials: true,
                auth: {
                    username: apiSettings.enterativePayGoUser.toString(),
                    password: apiSettings.enterativePayGoPassword.toString()
                },
            })
            return response.data.response.entity
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }

    async createPayGoPurchase(userId: Number, enterativePurchase: any) {
        let date = new Date()
        date.setSeconds(date.getSeconds() + 60)
        let apiSettings = await this.apiSettingsService.findFirst()

        let transaction = new Transaction()
        transaction.amount = enterativePurchase.totalAmount
        transaction.description = enterativePurchase.lines[0].name
        transaction.enterativeActivated = enterativePurchase.status == "ACTIVATED"
        transaction.expirationDateTime = date
        transaction.paygoStatus = 0
        transaction.paygoTransactionId = null
        transaction.paymentPixProvider = apiSettings.paygoPixProvider
        transaction.purchaseDate = new Date()
        transaction.qrCode = null
        transaction.referenceId = enterativePurchase.id.toString()
        transaction.userId = userId

        let saved = await this.repository.save(transaction)
        return saved
    }
}
