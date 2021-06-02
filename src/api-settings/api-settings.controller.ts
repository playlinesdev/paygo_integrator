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
        throw new NotFoundException('No api settings found. Use the /set method to set it up')
    }

    @ApiQuery({ required: false, name: 'name', example: 'dev' })
    @ApiQuery({ required: false, name: 'enterativeHost', example: 'https://192.168.1.1' })
    @ApiQuery({ required: false, name: 'enterativePort', example: '8080' })
    @ApiQuery({ required: false, name: 'enterativePayGoUser', example: 'paygoIntegrator' })
    @ApiQuery({ required: false, name: 'enterativePayGoPassword', example: 'paygo' })
    @ApiQuery({ required: false, name: 'paygoAuthenticationApi', example: 'chart.claudio' })
    @ApiQuery({ required: false, name: 'paygoAuthenticationKey', example: 'FD1C186AA04684FC6966' })
    @ApiQuery({ required: false, name: 'paygoBaseUrl', example: 'https://apidemo.gate2all.com.br/v1/transactions/' })
    @ApiQuery({ required: false, name: 'paygoPixKey', example: 'RANDOM_KEY' })
    @ApiQuery({ required: false, name: 'paygoPixProvider', example: 'C6BANK' })
    @ApiQuery({ required: false, name: 'postBackUrl', example: 'https://sandbox.enterativeapk.tk/' })
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
        @Query('postBackUrl') postBackUrl?: String,
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
        settings.postBackUrl = postBackUrl
        settings.puchaseDescriptionTemplate = puchaseDescriptionTemplate

        return await this.apiSettingsService.insertOrUpdate(settings)
    }

    @ApiBody({ type: ApiSettings, required: true })
    @Post()
    async insertOne(@Body() apiSettings: ApiSettings) {
        return await this.apiSettingsService.insertOrUpdate(apiSettings);
    }
}
