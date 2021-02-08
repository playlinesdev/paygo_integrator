import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @ApiQuery({ required: false, name: 'userId' })
    @ApiQuery({ required: false, name: 'login' })
    @Get()
    async getUserInfo(@Query('userId') userId?: Number, @Query('login') login?: String) {
        return await this.userService.getUserInfo(userId, login)
    }
}
