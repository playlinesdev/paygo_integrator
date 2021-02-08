import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction';

@Module({
  controllers: [TransactionController],
  providers: [Transaction]
})
export class TransactionModule {}
