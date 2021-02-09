import { Controller, Get, Post, UseGuards, Request, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';

@ApiBearerAuth('bearer')
@ApiTags('Public')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
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
}
