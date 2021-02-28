import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSettings } from 'src/api-settings/api-settings';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { jwtConstants } from 'src/auth/constants';
import { EnterativeJobManager } from 'src/enterative-job-manager/enterative-job-manager';
import { EnterativeJobManagerService } from 'src/enterative-job-manager/enterative-job-manager.service';
import { UserMapping } from 'src/user-mapping/user-mapping';
import { UserMappingService } from 'src/user-mapping/user-mapping.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiSettings, UserMapping, EnterativeJobManager]), JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: jwtConstants.expiresIn }
  })],
  providers: [UserService, ApiSettingsService, UserMappingService, EnterativeJobManagerService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule { }
