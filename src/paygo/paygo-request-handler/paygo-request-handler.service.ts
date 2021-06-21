import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import axios, { AxiosBasicCredentials } from 'axios'
import * as https from 'https'
import { ApiSettingsService } from 'src/api-settings/api-settings.service'

@Injectable()
export class PaygoRequestHandlerService {
  constructor (private apiSettingsService: ApiSettingsService) {}
  async handle (
    entries: {
      url?: string
      method?: string
      params?: any
      credentials?: AxiosBasicCredentials
      headers?: any
      data?: any
    } = {
      url: '',
      method: 'get',
      params: {},
      credentials: null,
      headers: null,
      data: {},
    },
  ) {
    const { url, params, credentials, method, headers, data } = entries

    let apiSettings = await this.apiSettingsService.findFirst()
    if (!apiSettings)
      throw new HttpException(
        "There's no api settings on the database. Use the POST method of the Api Settings controller to set it up",
        HttpStatus.NOT_FOUND,
      )
    let fullUrl = apiSettings.paygoBaseUrl + (url ?? '')

    let agent = new https.Agent({ rejectUnauthorized: false })
    // let job = await this.enterativeJobManagerService.registerStartCall(url)
    let requestDetails: any = {
      timeout: process.env.ENTERATIVE_TIMEOUT
        ? Number(process.env.ENTERATIVE_TIMEOUT)
        : 5000,
      httpsAgent: agent,
      headers: {
        authenticationApi: apiSettings.paygoAuthenticationApi,
        authenticationKey: apiSettings.paygoAuthenticationKey,
      },
      params: params ?? {},
    }

    if (credentials) requestDetails.auth = credentials
    if (headers) requestDetails.headers = headers

    try {
      let response =
        !method || method?.toLowerCase() === 'get'
          ? await axios.get(fullUrl, requestDetails)
          : await axios.post(fullUrl, data, requestDetails)
      return response
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT)
    }
  }
}
