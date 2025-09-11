import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FetcherService } from './services/fetcher.service';
import { MarketDataScheduler } from './services/market-data-scheduler.service';

@Module({
  imports: [
    HttpModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FetcherService,
    MarketDataScheduler
  ],
})
export class AppModule {}
