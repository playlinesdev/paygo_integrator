import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { jwtConstants } from './constants';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService,
        private jwtService: JwtService
    ) { }

    async hashPassword(password: String) {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }

    async validateUser(username: String, password: String) {
        var user = await this.usersService.getUserInfo({ login: username })
        if (!user)
            return null
        var passEquals = await bcrypt.compare(password, user.password.toString())
        if (user && passEquals) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId }
        var serverTime = new Date()
        var expireServerTime: Date = new Date()
        expireServerTime.setSeconds(expireServerTime.getSeconds() + jwtConstants.expiresIn)

        return {
            ...user,
            serverTime: serverTime,
            expireServerTime: expireServerTime,
            expiresInSeconds: jwtConstants.expiresIn,
            access_token: this.jwtService.sign(payload),
        }
    }
}
