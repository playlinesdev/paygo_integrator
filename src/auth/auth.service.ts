import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/user/user.service'
import { jwtConstants } from './constants'
import * as bcrypt from 'bcrypt'
import { UserMappingService } from 'src/user-mapping/user-mapping.service'

@Injectable()
export class AuthService {
  constructor (
    private usersService: UserService,
    private jwtService: JwtService,
    private userMappingService: UserMappingService,
  ) {}

  async hashPassword (password: String) {
    const salt = await bcrypt.genSalt()
    return await bcrypt.hash(password, salt)
  }

  async validateUser (username: String, password: String) {
    var response = await this.usersService.getUserInfo({ login: username })
    var user = response.data
    if (!user)
      throw new HttpException(
        `User ${username} not found`,
        HttpStatus.UNAUTHORIZED,
      )
    let shopId = await this.userMappingService.getUserShopId(user.id)
    if (!shopId) {
      Logger.error(
        `The user ${user.id} has no shop set on the UserMapping table and it's mandatory`,
      )
      throw new UnauthorizedException(
        `The user ${user.id} has no shop set on the UserMapping table and it's mandatory`,
      )
    }
    var passEquals = await bcrypt.compare(password, user.password.toString())
    if (user && passEquals) {
      const { password, ...result } = user
      return result
    }
    throw new UnauthorizedException()
  }

  async login (user: any) {
    const payload = { username: user.username, sub: user.userId }
    var serverTime = new Date()
    var expireServerTime: Date = new Date()
    expireServerTime.setSeconds(
      expireServerTime.getSeconds() + jwtConstants.expiresIn,
    )

    return {
      ...user,
      serverTime: serverTime,
      expireServerTime: expireServerTime,
      expiresInSeconds: jwtConstants.expiresIn,
      access_token: this.jwtService.sign(payload),
    }
  }
}
