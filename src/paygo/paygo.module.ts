import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSettings } from 'src/api-settings/api-settings';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { Transaction } from 'src/transaction/transaction';
import { TransactionService } from 'src/transaction/transaction.service';
import { UserMapping } from 'src/user-mapping/user-mapping';
import { UserMappingService } from 'src/user-mapping/user-mapping.service';
import { PaygoService } from './paygo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, ApiSettings, UserMapping])],
  providers: [PaygoService, TransactionService, ApiSettingsService, UserMappingService]
})
export class PaygoModule { }
