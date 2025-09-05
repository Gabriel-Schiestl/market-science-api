import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SourceGroup } from 'src/interfaces/Destination';

export default class Fetcher {
    constructor(private readonly httpService: HttpService) {}

    async fetchGroupData(group: SourceGroup) {
        const response = await firstValueFrom(this.httpService.get(group["dolar"][0].url));
        return response.data;
    } 
}
