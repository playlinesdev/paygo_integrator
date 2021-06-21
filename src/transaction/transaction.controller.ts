import {
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard'
import { TransactionService } from './transaction.service'

@ApiBearerAuth('bearer')
@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor (private transactionService: TransactionService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/createOrder')
  async createOrder (
    @Query('userId') userId: Number,
    @Query('amount') amount: Number,
  ) {
    let enterativePurchase = await this.transactionService.createEnterativePurchase(
      userId,
      amount,
    )
    let purchaseOrder = await this.transactionService.createPayGoPurchase(
      userId,
      enterativePurchase,
    )
    return purchaseOrder
  }

  @UseGuards(JwtAuthGuard)
  @Post('/activateOrder')
  async activateOrder (@Query('orderId') orderId: Number) {
    let purchaseOrder = await this.transactionService.findOrderById(orderId)
    if (!purchaseOrder)
      throw new NotFoundException(`Order ${orderId} not found`)
    if (purchaseOrder.enterativeActivated)
      throw new ConflictException(`Order ${orderId} already processed`)
    return await (await this.transactionService.activateOrder(orderId)).data
  }

  @UseGuards(JwtAuthGuard)
  @Get('/reference/:id')
  async getOrderByReference (@Param('id') id: Number) {
    return this.transactionService.findOrderById(id)
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listUserOrders (@Query('userId') userId: Number) {
    return await this.transactionService.findOrdersOfUser(userId)
  }
}
