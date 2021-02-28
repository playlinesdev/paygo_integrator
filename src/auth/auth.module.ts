import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiSettings } from 'src/api-settings/api-settings';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { EnterativeJobManager } from 'src/enterative-job-manager/enterative-job-manager';
import { EnterativeJobManagerService } from 'src/enterative-job-manager/enterative-job-manager.service';
import { UserMapping } from 'src/user-mapping/user-mapping';
import { UserMappingService } from 'src/user-mapping/user-mapping.service';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { LocalAuthGuard } from './local-auth.guard';
import { LocalStrategy } from './local.strategy';

@Module({
    imports: [
        UserModule,
        PassportModule,
        TypeOrmModule.forFeature([ApiSettings, UserMapping, EnterativeJobManager]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: jwtConstants.expiresIn }
        }),],
    providers: [LocalStrategy, AuthService, LocalAuthGuard, UserService, JwtStrategy, ApiSettingsService, UserMappingService, EnterativeJobManagerService],
    exports: [AuthService, UserService]
})
export class AuthModule { }
