import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ApiSettingsService } from 'src/api-settings/api-settings.service'
import { Repository } from 'typeorm'
import { Transaction } from './transaction'
import { UserMappingService } from 'src/user-mapping/user-mapping.service'
import { TransactionStatus } from './transaction_enum'
import { EnterativeRequestHandlerService } from 'src/enterative/enterative-request-handler/enterative-request-handler.service'

@Injectable()
export class TransactionService {
  constructor (
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private userMappingService: UserMappingService,
    private apiSettingsService: ApiSettingsService,
    private enterativeRequestHandler: EnterativeRequestHandlerService,
  ) {}

  async findOrdersOfUser (userId: Number) {
    return await this.repository.find({ where: { userId: userId } })
  }

  async findPaygoPendentOrders () {
    return await this.repository
      .createQueryBuilder('paygoPendent')
      .andWhere(
        'payment_provider_status <> 6 and payment_provider_status <> 11 and paygo_transaction_id is not null',
      )
      .getMany()
  }

  async findEnterativePendentOrders () {
    return await this.repository
      .createQueryBuilder('enterativePendent')
      .where('payment_provider_status = 6')
      .andWhere('enterative_activated = 0')
      .getMany()
  }

  async findOrdersNotSyncedWithPayGo () {
    return await this.repository.find({ where: { paygoTransactionId: null } })
  }

  async findOrderById (orderId: Number) {
    return await this.repository.findOne({ where: { referenceId: orderId } })
  }

  async createEnterativePurchase (userId: Number, amount: Number) {
    let shopId = await this.userMappingService.getUserShopId(userId)
    if (!shopId)
      throw new UnprocessableEntityException(
        `The user ${userId} has no shop set on the UserMapping table and it's mandatory`,
      )
    try {
      let url = `/paygoIntegrator/purchase_order/create?userId=${userId}&value=${amount}&shopId=${shopId}`
      let response = await this.enterativeRequestHandler.handle(url, {
        method: 'post',
      })
      return response.data.response.entity
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async createPayGoPurchase (userId: Number, enterativePurchase: any) {
    let date = new Date()
    date.setSeconds(date.getSeconds() + 60)
    let apiSettings = await this.apiSettingsService.findFirst()

    let transaction = new Transaction()
    transaction.amount = enterativePurchase.totalAmount
    transaction.description = enterativePurchase.lines[0].name
    transaction.enterativeActivated = enterativePurchase.status == 'ACTIVATED'
    transaction.expirationDateTime = date
    transaction.paymentProviderStatus = TransactionStatus.initiated
    transaction.paygoTransactionId = null
    transaction.paymentPixProvider = apiSettings.paygoPixProvider
    transaction.purchaseDate = new Date()
    transaction.qrCode = null
    transaction.referenceId = enterativePurchase.id.toString()
    transaction.userId = userId

    let saved = await this.repository.save(transaction)
    return saved
  }

  async activateOrder (orderId: Number) {
    try {
      let url = `/paygoIntegrator/purchase_order/activate?purchaseOrderId=${orderId}`
      return await this.enterativeRequestHandler.handle(url)
      // let result = response.data.response.entity
      // let purchaseOrder = await this.findOrderById(orderId)
      // purchaseOrder.enterativeActivated = result.status == 'ACTIVE'
      // return this.repository.save(purchaseOrder)
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
