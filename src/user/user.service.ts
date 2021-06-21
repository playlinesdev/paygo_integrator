import { Injectable } from '@nestjs/common'
import { AxiosBasicCredentials } from 'axios'
import { EnterativeRequestHandlerService } from 'src/enterative/enterative-request-handler/enterative-request-handler.service'

@Injectable()
export class UserService {
  constructor (
    private enterativeRequestHandler: EnterativeRequestHandlerService,
  ) {}

  async getUserInfo (params: {
    userId?: Number
    login?: String
    credentials?: AxiosBasicCredentials
  }) {
    const { userId, login, credentials } = params
    let url = `/paygoIntegrator/user/get_info`
    return await this.enterativeRequestHandler.handle(url, {
      credentials: credentials,
      params: {
        id: userId ?? '',
        login: login ?? '',
      },
    })
  }
}
