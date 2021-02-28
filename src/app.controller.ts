import { Controller, Get, Post, UseGuards, Request, Query, InternalServerErrorException } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiSettingsService } from './api-settings/api-settings.service';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@ApiBearerAuth('bearer')
@ApiTags('Public')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly apiSettingsService: ApiSettingsService,
    private readonly authService: AuthService
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('auth/login')
  async login(@Query('username') username: String, @Query('password') password: String) {
    let user = await this.authService.validateUser(username, password)
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Get('testDatabaseConnection')
  async testDbConnection() {
    try {
      let time = new Date().getTime()
      let settings = await this.apiSettingsService.findFirst()
      let end = (new Date().getTime() - time)
      return `Database reached in ${end} milliseconds`
    } catch (error) {
      throw new InternalServerErrorException(`Could not connect to the database at ${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}`)
    }
  }
}
