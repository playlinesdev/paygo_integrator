import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiSettings } from './api-settings';

@Injectable()
export class ApiSettingsService {
    constructor(@InjectRepository(ApiSettings) private readonly repository: Repository<ApiSettings>) { }

    async findFirst(): Promise<ApiSettings> {
        try {
            return await this.repository.createQueryBuilder('findFirst').where('name is not null').take(1).getOne()
        } catch (e) {
            throw new HttpException(`Could not connect to the database at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    async insertOrUpdate(apiSettings: ApiSettings) {
        if (!apiSettings.paygoBaseUrl) apiSettings.paygoBaseUrl = 'https://apidemo.gate2all.com.br/v1/transactions/'
        if (!apiSettings.paygoPixKey) apiSettings.paygoPixKey = 'RANDOM_KEY'
        if (!apiSettings.paygoPixProvider) apiSettings.paygoPixProvider = 'C6BANK'

        if (!apiSettings.id)
            return this.repository.insert(apiSettings)
        return this.repository.update(apiSettings.id, apiSettings)
    }
}
