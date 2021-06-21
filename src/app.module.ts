import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiSettingsModule } from './api-settings/api-settings.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiSettings } from './api-settings/api-settings';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/transaction';
import { UserMappingModule } from './user-mapping/user-mapping.module';
import { UserMapping } from './user-mapping/user-mapping';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { PaygoModule } from './paygo/paygo.module';
import { EnterativeJobManagerModule } from './enterative-job-manager/enterative-job-manager.module';
import { EnterativeJobManager } from './enterative-job-manager/enterative-job-manager';
import { ApiSettingsService } from './api-settings/api-settings.service';
import { EnterativeModule } from './enterative/enterative.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }), TypeOrmModule.forRoot({
    type: 'mysql',
    host: process.env.MYSQL_HOST ?? '127.0.0.1',
    port: process.env.MYSQL_PORT ? Number(process.env.MYSQL_PORT) : 3306,
    username: process.env.MYSQL_USER ?? 'root',
    password: process.env.MYSQL_PASSWORD ?? 'root',
    database: process.env.MYSQL_DATABASE ?? 'enterative_pay',
    entities: [ApiSettings, Transaction, UserMapping, EnterativeJobManager,],
    synchronize: true,
    // logging: true,
  }), TypeOrmModule.forFeature([ApiSettings]), ScheduleModule.forRoot(), TransactionModule, UserModule, AuthModule, ApiSettingsModule, UserMappingModule, PaygoModule, EnterativeJobManagerModule, EnterativeModule],
  controllers: [AppController],
  providers: [AppService, ApiSettingsService],
})
export class AppModule { }
