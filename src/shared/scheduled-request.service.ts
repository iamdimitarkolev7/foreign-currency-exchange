import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FxClientService } from '../fx/services/fx-client.service';
import { UtilitiesService } from '../fx/utilities/utilities.service';
import { FxRatesService } from '../fx/services/fx-rates.service';
import { FxRedisService } from '../fx/services/fx-redis.service';
import { FxRatesResponseObjectType } from '../common/types/fx-rates-response-object.type';

@Injectable()
export class ScheduledRequestService {

  constructor(
    private fxClientService: FxClientService,
    private utilitiesService: UtilitiesService,
    private fxRatesService: FxRatesService,
    private fxRedisService: FxRedisService
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleScheduledRequest() {

    const requestUrl = this.utilitiesService.generateUrl();
    const fxRatesData = await this.fxClientService.getData(requestUrl);
    const fxRatesDto = this.utilitiesService.fxDataToDto(fxRatesData);
    const responseData: FxRatesResponseObjectType = await this.fxRatesService.saveFxRateData(fxRatesDto);
    
    await this.fxRedisService.saveDataInRedis(responseData);
  }
}