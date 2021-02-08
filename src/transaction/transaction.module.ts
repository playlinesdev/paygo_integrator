import { HttpModule, Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { Transaction } from './transaction';
import { TransactionService } from './transaction.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSettings } from 'src/api-settings/api-settings';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';

@Module({
  imports: [HttpModule.register({
    timeout: 5000,
    maxRedirects: 5,
  }), TypeOrmModule.forFeature([Transaction, ApiSettings])],
  controllers: [TransactionController],
  providers: [Transaction, TransactionService, ApiSettingsService]
})
export class TransactionModule { }
