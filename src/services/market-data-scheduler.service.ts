import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FetcherService } from './fetcher.service';
import { MARKET_DATA_GROUPS } from '../config/groups.config';
import { FetchResult } from '../interfaces/Destination';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class MarketDataScheduler {
  private readonly logger = new Logger(MarketDataScheduler.name);

  constructor(
    private readonly fetcherService: FetcherService,
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchAllMarketData(): Promise<void> {
    this.logger.log('Starting scheduled market data fetch');

    const fetchPromises = Object.entries(MARKET_DATA_GROUPS).map(
      async ([groupName, sources]) => {
        try {
          const result = await this.fetcherService.fetchFromSources(
            groupName,
            sources,
          );
          return result;
        } catch (error) {
          this.logger.error(
            `Failed to fetch data for group ${groupName}:`,
            error.message,
          );
          return null;
        }
      },
    );

    try {
      const allResults = await Promise.allSettled(fetchPromises);
      const successfulResults = allResults
        .filter(
          (result): result is PromiseFulfilledResult<FetchResult> =>
            result.status === 'fulfilled' && result.value !== null,
        )
        .map((result) => result.value);

      this.logger.log(
        `Market data fetch completed. ${successfulResults.length}/${allResults.length} groups successful`,
      );

      this.processMarketData(successfulResults);
    } catch (error) {
      this.logger.error(
        'Error during scheduled market data fetch:',
        error.message,
      );
    }
  }

  private processMarketData(result: FetchResult[]): void {
    for (const data of result) {
      this.client.emit('market_data', data);
      this.logger.log(`Emitted market data for group ${data.groupName}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async healthCheck(): Promise<void> {
    //TODO: Implementar verificações de saúde das APIs
  }
}
