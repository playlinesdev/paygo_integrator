import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import axios, { AxiosBasicCredentials } from 'axios'
import * as https from 'https'
import { EnterativeJobManagerService } from 'src/enterative-job-manager/enterative-job-manager.service';

@Injectable()
export class UserService {
    constructor(
        private enterativeJobManagerService: EnterativeJobManagerService,
        private apiSettingsService: ApiSettingsService
    ) { }

    async getUserInfo(params: { userId?: Number, login?: String, credentials?: AxiosBasicCredentials }) {
        const { userId, login, credentials } = params
        let apiSettings = await this.apiSettingsService.findFirst()
        if (!apiSettings)
            throw new HttpException('There\'s no api settings on the database. Use the POST method of the Api Settings controller to set it up', HttpStatus.NOT_FOUND)
        let baseUrl = apiSettings.getEnterativeUrl()
        let url = baseUrl + `/paygoIntegrator/user/get_info`
        let agent = new https.Agent({ rejectUnauthorized: false });
        let job = await this.enterativeJobManagerService.registerStartCall(url)
        try {
            let response = await axios.get(url, {
                timeout: process.env.ENTERATIVE_TIMEOUT ? Number(process.env.ENTERATIVE_TIMEOUT) : 5000,
                httpsAgent: agent,
                withCredentials: true,
                params: {
                    id: userId ?? '',
                    login: login ?? ''
                },
                auth: credentials ?? {
                    username: apiSettings.enterativePayGoUser.toString(),
                    password: apiSettings.enterativePayGoPassword.toString()
                },
            })
            this.enterativeJobManagerService.registerFinishCall(job.id)
            return response.data
        } catch (error) {
            this.enterativeJobManagerService.registerFinishCall(job.id, false, error?.message ?? '')
            throw new HttpException(error.message, HttpStatus.REQUEST_TIMEOUT)
        }
    }
}
