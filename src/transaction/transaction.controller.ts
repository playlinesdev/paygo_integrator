import { ConflictException, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @Post('/createOrder')
    async createOrder(@Query('userId') userId: Number, @Query('amount') amount: Number) {
        let enterativePurchase = await this.transactionService.createEnterativePurchase(userId, amount)
        let purchaseOrder = await this.transactionService.createPayGoPurchase(userId, enterativePurchase)
        return purchaseOrder
    }

    @Post('/activateOrder')
    async activateOrder(@Query('orderId') orderId: Number) {
        let purchaseOrder = await this.transactionService.findOrderById(orderId)
        if (!purchaseOrder)
            throw new NotFoundException(`Order ${orderId} not found`)
        if (purchaseOrder.enterativeActivated)
            throw new ConflictException(`Order ${orderId} already processed`)
        return await this.transactionService.activateOrder(orderId);
    }

    @Get()
    async listUserOrders(@Query('userId') userId: Number) {
        return await this.transactionService.findOrdersOfUser(userId)
    }
}
