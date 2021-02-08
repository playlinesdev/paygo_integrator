import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @Get('/createOrder')
    async createOrder(@Query('userId') userId: Number, @Query('amount') amount: Number) {
        let enterativePurchase = await this.transactionService.createEnterativePurchase(userId, amount)
        let purchaseOrder = await this.transactionService.createPayGoPurchase(userId, enterativePurchase)
        return purchaseOrder
    }
}
