import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import axios, { AxiosBasicCredentials } from 'axios'
import * as https from 'https'
import { EnterativeJobManagerService } from 'src/enterative-job-manager/enterative-job-manager.service'
import { ApiSettingsService } from 'src/api-settings/api-settings.service'

@Injectable()
export class EnterativeRequestHandlerService {
  constructor (private apiSettingsService: ApiSettingsService) {}
  async handle (
    url: string,
    entries: {
      method?: string
      params?: any
      credentials?: AxiosBasicCredentials
      headers?: any
      data?: any
    } = {
      method: 'get',
      params: {},
      credentials: null,
      headers: {},
      data: null,
    },
  ) {
    const { params, credentials, method, data, headers } = entries

    let apiSettings = await this.apiSettingsService.findFirst()
    if (!apiSettings)
      throw new HttpException(
        "There's no api settings on the database. Use the POST method of the Api Settings controller to set it up",
        HttpStatus.NOT_FOUND,
      )
    let fullUrl = apiSettings.getEnterativeUrl() + url
    let oParams = params ?? {}

    let agent = new https.Agent({ rejectUnauthorized: false })
    let requestDetails: any = {
      timeout: process.env.ENTERATIVE_TIMEOUT
        ? Number(process.env.ENTERATIVE_TIMEOUT)
        : 5000,
      httpsAgent: agent,
      withCredentials: true,
      params: oParams,
      auth: credentials ?? {
        username: apiSettings.enterativePayGoUser.toString(),
        password: apiSettings.enterativePayGoPassword.toString(),
      },
    }

    if (headers) requestDetails.headers = headers

    try {
      let response =
        !method || !method || method?.toLowerCase() === 'get'
          ? await axios.get(fullUrl, requestDetails)
          : await axios.post(fullUrl, data, requestDetails)
      return response
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT)
    }
  }
}
