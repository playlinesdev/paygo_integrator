import { Module } from '@nestjs/common';
import { EnterativeJobManagerService } from './enterative-job-manager.service';
import { EnterativeJobManager } from './enterative-job-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { ApiSettings } from 'src/api-settings/api-settings';

@Module({
  imports: [TypeOrmModule.forFeature([EnterativeJobManager, ApiSettings])],
  providers: [EnterativeJobManagerService, EnterativeJobManager, ApiSettingsService]
})
export class EnterativeJobManagerModule { }
