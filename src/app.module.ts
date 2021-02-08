import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ApiSettingsModule } from './api-settings/api-settings.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiSettings } from './api-settings/api-settings';
import { TransactionModule } from './transaction/transaction.module';
import { Transaction } from './transaction/transaction';

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
    entities: [ApiSettings, Transaction],
    synchronize: true,
    // logging: true,
  }), ApiSettingsModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
