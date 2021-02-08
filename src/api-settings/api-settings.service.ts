import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiSettings } from './api-settings';

@Injectable()
export class ApiSettingsService {
    constructor(@InjectRepository(ApiSettings) private readonly repository: Repository<ApiSettings>) { }

    async findFirst(): Promise<ApiSettings> {
        return (await this.repository.find({ take: 1 }))[0]
    }

    async insert(apiSettings: ApiSettings) {
        return this.repository.insert(apiSettings);
    }
}
