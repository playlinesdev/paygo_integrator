import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiSettings } from 'src/api-settings/api-settings'
import { ApiSettingsService } from 'src/api-settings/api-settings.service'
import { EnterativeRequestHandlerService } from './enterative-request-handler/enterative-request-handler.service'

@Module({
  imports: [TypeOrmModule.forFeature([ApiSettings])],
  providers: [EnterativeRequestHandlerService, ApiSettingsService],
})
export class EnterativeModule {}
