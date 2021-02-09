import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiSettings } from './api-settings';
import { ApiSettingsService } from './api-settings.service';

@ApiBearerAuth('bearer')
@ApiTags('Api Settings')
@Controller('api-settings')
export class ApiSettingsController {
    constructor(private apiSettingsService: ApiSettingsService) { }

    // @UseGuards(JwtAuthGuard)
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
