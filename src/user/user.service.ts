import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiSettingsService } from 'src/api-settings/api-settings.service';
import { UserMappingService } from 'src/user-mapping/user-mapping.service';
import axios from 'axios'
import * as https from 'https'

@Injectable()
export class UserService {
    constructor(
        private userMappingService: UserMappingService,
        private apiSettingsService: ApiSettingsService
    ) { }

    async getUserInfo(userId?: Number, login?: String) {
        let apiSettings = await this.apiSettingsService.findFirst()
        let baseUrl = apiSettings.getEnterativeUrl()
        let url = baseUrl + `/paygoIntegrator/user/get_info`
        let agent = new https.Agent({ rejectUnauthorized: false });
        try {
            let response = await axios.get(url, {
                timeout: process.env.ENTERATIVE_TIMEOUT ? Number(process.env.ENTERATIVE_TIMEOUT) : 5000,
                httpsAgent: agent,
                withCredentials: true,
                params: {
                    id: userId ?? '',
                    login: login ?? ''
                },
                auth: {
                    username: apiSettings.enterativePayGoUser.toString(),
                    password: apiSettings.enterativePayGoPassword.toString()
                },
            })
            return response.data
        } catch (error) {
            throw new InternalServerErrorException(error.message)
        }
    }
}
