import { HttpService, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { Repository } from 'typeorm';
import { Transaction } from './transaction';
import axios from 'axios'
import * as https from 'https'
import { UserMappingService } from 'src/user-mapping/user-mapping.service';

@Injectable()
export class TransactionService {
    constructor(
        @InjectRepository(Transaction) private readonly repository: Repository<Transaction>,
        private userMappingService: UserMappingService,
        private apiSettingsService: ApiSettingsService
    ) { }

    async findOrdersOfUser(userId: Number) {
        return await this.repository.find({ where: { userId: userId } })
    }

    async findPaygoPendentOrders() {
        return await this.repository.createQueryBuilder('paygoPendent').andWhere('paygo_status <> 6').getMany()
    }

    async findEnterativePendentOrders() {
        return await this.repository.createQueryBuilder('enterativePendent').where('paygo_status = 6').andWhere('enterative_activated = 0').getMany()
    }

    async findOrdersNotSyncedWithPayGo() {
        return await this.repository.find({ where: { paygoTransactionId: null } })
    }

    async findOrderById(orderId: Number) {
        return await this.repository.findOne({ where: { referenceId: orderId } })
    }

    async createEnterativePurchase(userId: Number, amount: Number) {
        let shopId = await this.userMappingService.getUserShopId(userId)
        if (!shopId)
            throw new UnprocessableEntityException(`The user ${userId} has no shop set on the UserMapping table and it's mandatory`)
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

    async activateOrder(orderId: Number) {

        try {
            let apiSettings = await this.apiSettingsService.findFirst()
            let baseUrl = apiSettings.getEnterativeUrl()
            let url = baseUrl + `/paygoIntegrator/purchage_order/activate?purchaseOrderId=${orderId}`
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
            let result = response.data.response.entity
            let purchaseOrder = await this.findOrderById(orderId)
            purchaseOrder.enterativeActivated = result.status == "ACTIVE"
            return this.repository.save(purchaseOrder)
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
}
