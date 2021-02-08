import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @Get('/createOrder')
    async createOrder(@Query('userId') userId: Number, @Query('amount') amount: Number, @Query('shopId') shopId: Number) {
        let enterativePurchase = await this.transactionService.createEnterativePurchase(userId, amount, shopId)
        let purchaseOrder = await this.transactionService.createPayGoPurchase(userId, enterativePurchase)
        return purchaseOrder
    }
}
