import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiSettings } from './api-settings';

@Injectable()
export class ApiSettingsService {
    constructor(@InjectRepository(ApiSettings) private readonly repository: Repository<ApiSettings>) { }

    async findFirst(): Promise<ApiSettings> {
        return await this.repository.createQueryBuilder('findOne').getOne()
    }

    async insert(apiSettings: ApiSettings) {
        return this.repository.insert(apiSettings);
    }
}
