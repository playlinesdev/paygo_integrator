import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnterativeJobManager, EnterativeJobStatus } from './enterative-job-manager';

/**
 * Service destinated to keep track of all the callings to the Enterative WebService
 */
@Injectable()
export class EnterativeJobManagerService {

    constructor(@InjectRepository(EnterativeJobManager) private readonly repository: Repository<EnterativeJobManager>) { }

    /**
     * Register the beggining of a call to the Enterative Web Service
     * @param fullUrl Enterative Web Service url to be called
     * @param message eventual message
     */
    async registerStartCall(fullUrl: String, message?: String) {
        let job = new EnterativeJobManager()
        job.fullUrl = fullUrl
        job.createdAt = new Date()
        job.status = EnterativeJobStatus.START
        job.message = message
        return await this.repository.save(job);
    }

    /**
     * Register the end of a call
     * @param referenceId The id of a started call
     * @param success Whether the call succeded or not
     * @param message A message to be saved in case of it didn't succced
     */
    async registerFinishCall(referenceId: Number, success: boolean = true, message?: String) {
        let job = new EnterativeJobManager()
        job.referenceId = referenceId
        job.createdAt = new Date()
        job.status = success ? EnterativeJobStatus.FINISHED : EnterativeJobStatus.FAILED
        job.message = message
        return await this.repository.save(job);
    }

    async findCall(params = { fullUrl: String, dateFrom: Date, dateTo: Date }) {
        const { fullUrl, dateFrom, dateTo } = params
        let query = this.repository.createQueryBuilder('search')
        if (fullUrl) query.where(`url like %${fullUrl}%`)
        if (fullUrl && dateFrom) query.andWhere(`date_from >= ${dateFrom}`)
        else if (dateFrom) query.where(`date_from >= ${dateFrom}`)
        if ((fullUrl || dateFrom) && dateTo) query.andWhere(`date_to <= ${dateTo}`)
        else if (dateTo) query.where(`date_to <= ${dateTo}`)
        return await query.getMany()
    }
}
