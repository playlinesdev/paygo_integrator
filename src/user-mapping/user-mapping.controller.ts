import { Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserMappingService } from './user-mapping.service';

@ApiBearerAuth('bearer')
@ApiTags('User Mapping')
@Controller('user-mapping')
export class UserMappingController {

    constructor(private userMappingService: UserMappingService) { }

    @Get()
    async findByUser(@Query('userId') userId: Number) {
        let shopId = await this.userMappingService.getUserShopId(userId)
        if (shopId) return shopId
        throw new NotFoundException()
    }

    @Post()
    async setUserShop(@Query('userId') userId: Number, @Query('shopId') shopId: Number) {
        return await this.userMappingService.saveUserShop(userId, shopId)
    }
}
