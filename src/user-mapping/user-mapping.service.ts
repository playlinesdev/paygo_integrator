import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserMapping } from './user-mapping';

@Injectable()
export class UserMappingService {
    constructor(@InjectRepository(UserMapping) private readonly repository: Repository<UserMapping>) { }

    async saveUserShop(userId: Number, shopId: Number) {
        let userMapping = await this.repository.findOne({ where: { userId: userId } })
        if (!userMapping) {
            userMapping = new UserMapping()
            userMapping.userId = userId
        }
        userMapping.shopId = shopId
        userMapping = await this.repository.save(userMapping)
        return userMapping
    }

    async getUserShopId(userId: Number) {
        let row = await this.repository.findOne({ where: { userId: userId } })
        return row?.shopId
    }
}
