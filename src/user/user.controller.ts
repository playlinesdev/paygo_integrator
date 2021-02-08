import { Controller, Get, NotFoundException, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserService } from './user.service';

@ApiBearerAuth('bearer')
@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private userService: UserService) { }

    @ApiQuery({ required: false, name: 'userId' })
    @ApiQuery({ required: false, name: 'login' })
    @UseGuards(JwtAuthGuard)
    @Get()
    async getUserInfo(@Query('userId') userId?: Number, @Query('login') login?: String) {
        let user = await this.userService.getUserInfo({ userId: userId, login: login })
        if (user)
            return user
        throw new NotFoundException()
    }
}
