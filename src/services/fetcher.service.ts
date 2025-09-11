import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, retry } from 'rxjs';
import { Source, FetchResult } from '../interfaces/Destination';

@Injectable()
export class FetcherService {
  private readonly logger = new Logger(FetcherService.name);

  constructor(private readonly httpService: HttpService) {}

  async fetchFromSources(
    groupName: string,
    sources: Source[],
  ): Promise<FetchResult> {
    let lastError: any;

    for (let index = 0; index < sources.length; index++) {
      const source = sources[index];

      if (source.failing) {
        this.logger.warn(
          `Skipping failing source ${source.url} for group ${groupName}`,
        );
        continue;
      }

      const config: AxiosRequestConfig = {};

      if (source.queryParams) {
        config.params = {
          ...source.queryParams,
        };
      }
      if (source.headers) {
        config.headers = {
          ...source.headers,
        };
      }
      if (source.token) {
        config.headers = {
          ...config.headers,
          Authorization: source.token,
        };
      }

      try {
        const response = await firstValueFrom(
          this.httpService.get(source.url, config).pipe(retry(3)),
        );

        this.logger.log(
          `Successfully fetched data for ${groupName} from ${source.url}`,
        );

        return {
          groupName,
          data: response.data,
          timestamp: new Date().toLocaleString(),
          source: source.url,
        };
      } catch (error) {
        lastError = error;
        this.logger.warn(
          `Failed to fetch from ${source.url} for group ${groupName}: ${error.message}`,
        );

        if (index === sources.length - 1) {
          this.logger.error(`All sources failed for group ${groupName}`);
          throw lastError;
        }
      }
    }

    throw new Error(`No sources available for group ${groupName}`);
  }
}
