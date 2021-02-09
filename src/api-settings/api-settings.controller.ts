import { Body, Controller, Get, NotFoundException, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiSettings } from './api-settings';
import { ApiSettingsService } from './api-settings.service';

@ApiBearerAuth('bearer')
@ApiTags('Api Settings')
@Controller('api-settings')
export class ApiSettingsController {
    constructor(private apiSettingsService: ApiSettingsService) { }

    @Get()
    async findFirst(): Promise<ApiSettings> {
        let first = await this.apiSettingsService.findFirst();
        if (first)
            return first
        throw new NotFoundException()
    }

    @ApiQuery({ required: false, name: 'name' })
    @ApiQuery({ required: false, name: 'enterativeHost' })
    @ApiQuery({ required: false, name: 'enterativePort' })
    @ApiQuery({ required: false, name: 'enterativePayGoUser' })
    @ApiQuery({ required: false, name: 'enterativePayGoPassword' })
    @ApiQuery({ required: false, name: 'paygoAuthenticationApi' })
    @ApiQuery({ required: false, name: 'paygoAuthenticationKey' })
    @ApiQuery({ required: false, name: 'paygoBaseUrl' })
    @ApiQuery({ required: false, name: 'paygoPixKey' })
    @ApiQuery({ required: false, name: 'paygoPixProvider' })
    @ApiQuery({ required: false, name: 'puchaseDescriptionTemplate' })
    @Post('/set')
    async inserOrUpdate(
        @Query('name') name?: String,
        @Query('enterativeHost') enterativeHost?: String,
        @Query('enterativePort') enterativePort?: Number,
        @Query('enterativePayGoUser') enterativePayGoUser?: String,
        @Query('enterativePayGoPassword') enterativePayGoPassword?: String,
        @Query('paygoAuthenticationApi') paygoAuthenticationApi?: String,
        @Query('paygoAuthenticationKey') paygoAuthenticationKey?: String,
        @Query('paygoBaseUrl') paygoBaseUrl?: String,
        @Query('paygoPixKey') paygoPixKey?: String,
        @Query('paygoPixProvider') paygoPixProvider?: String,
        @Query('puchaseDescriptionTemplate') puchaseDescriptionTemplate?: String,
    ) {
        let settings = await this.apiSettingsService.findFirst();
        if (!settings)
            settings = new ApiSettings()
        settings.enterativeHost = enterativeHost
        settings.enterativePayGoPassword = enterativePayGoPassword
        settings.enterativePayGoUser = enterativePayGoUser
        settings.enterativePort = enterativePort
        settings.name = name
        settings.paygoAuthenticationApi = paygoAuthenticationApi
        settings.paygoAuthenticationKey = paygoAuthenticationKey
        settings.paygoBaseUrl = paygoBaseUrl
        settings.paygoPixKey = paygoPixKey
        settings.paygoPixProvider = paygoPixProvider
        settings.puchaseDescriptionTemplate = puchaseDescriptionTemplate

        return await this.apiSettingsService.insert(settings)
    }

    @ApiBody({ type: ApiSettings, required: true })
    @Post()
    async insertOne(@Body() apiSettings: ApiSettings) {
        return await this.apiSettingsService.insert(apiSettings);
    }
}
