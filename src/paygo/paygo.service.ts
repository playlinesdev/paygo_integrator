import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule'
import { ApiSettings } from 'src/api-settings/api-settings';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { Transaction } from 'src/transaction/transaction';
import { TransactionService } from 'src/transaction/transaction.service';
import axios from 'axios'
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PaygoService {
    private apiSettings: ApiSettings
    jobRunning: boolean = false

    constructor(
        @InjectRepository(Transaction) private readonly repository: Repository<Transaction>,
        private transactionService: TransactionService,
        private apiSettingsService: ApiSettingsService
    ) {
        this.apiSettingsService.findFirst().then((settings) => {
            this.apiSettings = settings;
        });
    }

    @Interval(5000)
    async update() {
        if (this.jobRunning)
            return
        this.jobRunning = true
        try {
            await this.syncPaygoPurchaseOrders()
            await this.syncPaygoPurchaseOrderStatuses()
            await this.activateRegularOrders()
        } catch (error) {
            Logger.error(error)
        } finally {
            this.jobRunning = false
        }
    }

    async syncPaygoPurchaseOrderStatuses() {
        //List purchase orders that still don't have the qrCode
        let orders = await this.transactionService.findPaygoPendentOrders()

        orders.forEach((order) => {
            //Search the transaction on Paygo Service
            this.searchPaygoTransaction(order.paygoTransactionId).then((paygoOrder) => {
                if (paygoOrder) {
                    let status = order.paymentProviderStatus
                    let qrCode = order.qrCode
                    let paygoQrCode = paygoOrder['payment']['pix']['qrCode']
                    let paymentProviderStatus = paygoOrder.status

                    //Update the qrCode and Status in local db
                    if (status != paymentProviderStatus || qrCode != paygoQrCode) {
                        order.qrCode = paygoQrCode
                        order.paymentProviderStatus = paymentProviderStatus
                        this.updateTransaction(order)
                    }
                }
            })
        })
    }

    async syncPaygoPurchaseOrders() {
        //List puchase orders that still don't have a paygoTransactionId
        let orders = await this.transactionService.findOrdersNotSyncedWithPayGo()
        orders.forEach((order) => {
            //Call PayGo service to create a purchase order
            //Updates the local database
            this.createPixPurchaseOrder(order)
        })
    }

    async activateRegularOrders() {
        //List purchase orders that are already finished on PayGo and that were not activated on Enterative
        let orders = await this.transactionService.findEnterativePendentOrders()

        orders.forEach(async (order) => {
            Logger.log(`Activating order ${order.referenceId}`)
            try {
                await this.transactionService.activateOrder(Number(order.referenceId))
            } catch (error) {
                Logger.error(`Failed to activate:\n${error}`)
            }
        })
    }

    async updateTransaction(transaction: Transaction) {
        Logger.log(`Updating transaction ${transaction.referenceId}`)
        //Updates the local database
        this.repository.save(transaction)
    }

    async createPixPurchaseOrder(transaction: Transaction) {
        let payGoTransaction = await this.createPaygoTransaction(transaction)
        transaction.paygoTransactionId = payGoTransaction.transactionId
        transaction.paymentProviderStatus = payGoTransaction.status
        transaction.qrCode = payGoTransaction.payment.pix.qrCode
        this.updateTransaction(transaction)
    }

    async searchPaygoTransaction(transactionId: String) {
        try {
            let url = `${this.apiSettings.paygoBaseUrl}${transactionId}`

            var response = await axios.get(url, {
                headers: {
                    "authenticationApi": this.apiSettings.paygoAuthenticationApi,
                    "authenticationKey": this.apiSettings.paygoAuthenticationKey
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    }

    async createPaygoTransaction(transaction: Transaction): Promise<any> {
        try {
            let now = new Date()
            let expirationDateTime = new Date((now.getTime() + 300000));
            let url = this.apiSettings.paygoBaseUrl.toString()
            let payGoResponse: any = await axios.post(url, {
                "referenceId": transaction.referenceId,
                "amount": transaction.amount.toString().replace('.', ''),
                "description": transaction.description,
                // "postBackUrl": this.apiSettings.paygo,
                "payment": {
                    "pix": {
                        "provider": this.apiSettings.paygoPixProvider,
                        "key": [this.apiSettings.paygoPixKey],
                        "expirationDateTime": expirationDateTime.toISOString()
                    }
                }
            }, {
                headers: {
                    "authenticationApi": this.apiSettings.paygoAuthenticationApi,
                    "authenticationKey": this.apiSettings.paygoAuthenticationKey
                }
            })
            return payGoResponse.data
        } catch (error) {
            Logger.error(error.response.data.error.message)
        }
    }
}
