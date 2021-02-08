import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { ApiSettings } from './api-settings';
import { ApiSettingsService } from './api-settings.service';

@Controller('api-settings')
export class ApiSettingsController {
    constructor(private apiSettingsService: ApiSettingsService) { }

    @Get()
    async findFirst(): Promise<ApiSettings> {
        let first = await this.apiSettingsService.findFirst();
        return first
    }

    @ApiBody({ type: ApiSettings, required: true })
    @Post()
    async insertOne(@Body() apiSettings: ApiSettings) {
        return await this.apiSettingsService.insert(apiSettings);
    }
}
