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
        @InjectRepository(Transaction) repository: Repository<Transaction>,
        private httpService: HttpService,
        private apiSettingsService: ApiSettingsService
    ) { }

    async createPurchase(userId: String, amount: Number, shopId: Number) {
        try {
            let apiSettings = await this.apiSettingsService.findFirst()
            let baseUrl = apiSettings.getEnterativeUrl()
            let url = baseUrl + `/paygoIntegrator/purchase_order/create?userId=${userId}&value=${amount}&shopId=${shopId}`
            console.log(url)
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
            console.log(response.data)
            return response.data.response.entity
        } catch (error) {
            console.log(error.code)
            console.log(error.message)
            throw new InternalServerErrorException(error.message)
        }
    }
}
