import { Module } from '@nestjs/common';
import { UserMappingController } from './user-mapping.controller';
import { UserMapping } from './user-mapping';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMappingService } from './user-mapping.service';
import { Transaction } from 'src/transaction/transaction';

@Module({
  imports: [TypeOrmModule.forFeature([UserMapping])],
  controllers: [UserMappingController],
  providers: [UserMapping, UserMappingService, Transaction]
})
export class UserMappingModule { }
