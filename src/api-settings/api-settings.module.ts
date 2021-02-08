import { Module } from '@nestjs/common';
import { ApiSettingsController } from './api-settings.controller';
import { ApiSettings } from './api-settings';
import { ApiSettingsService } from './api-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ApiSettings])],
  controllers: [ApiSettingsController],
  providers: [ApiSettings, ApiSettingsService,]
})
export class ApiSettingsModule { }
