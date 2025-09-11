import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { firstValueFrom, retry } from 'rxjs';
import { Source } from 'src/interfaces/Destination';

export default class Fetcher {
    constructor(private readonly httpService: HttpService, public readonly groupType: string) {}

    async fetch(sources: Source[], index = 0) {
        const source1 = sources[index];

        const config: AxiosRequestConfig = {};

        if (source1.queryParams) {
            config.params = {
                ...source1.queryParams
            }
        } 
        if (source1.headers) {
            config.headers = {
                ...source1.headers
            }
        }
        if (source1.token) {
            config.headers = {
                ...config.headers,
                'Authorization': source1.token
            }
        }

        try {
            const response = await firstValueFrom(
                this.httpService.get(source1.url, config).pipe(retry(3))
            );
            return response;
        } catch (error) {
            if(index < sources.length - 1) {
                return this.fetch(sources, index + 1);
            }
            throw error;
        }
    }
}
