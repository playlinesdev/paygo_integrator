import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @Get('/createOrder')
    async createOrder(@Query('userId') userId: String, @Query('amount') amount: Number, @Query('shopId') shopId: Number) {
        let response = await this.transactionService.createPurchase(userId, amount, shopId);
        return response.data.response.entity
    }
}
