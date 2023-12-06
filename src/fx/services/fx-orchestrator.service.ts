import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { FxClientService } from './fx-client.service';
import { FxRatesService } from './fx-rates.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { FxRedisService } from './fx-redis.service';
import { FxRatesResponseObjectType } from '../../common/types/fx-rates-response-object.type';
import { RequestStatsService } from '../../users/services/request-stats.service';
import { FxExchangeType } from '../../common/enums/fx-exchange-type.enum';

@Injectable()
export class FxOrchestratorService {

  constructor(
    private fxRatesService: FxRatesService,
    private fxClientService: FxClientService,
    private fxRedisService: FxRedisService,
    private utilitiesService: UtilitiesService,
    private requestStatsService: RequestStatsService
  ) {}

  async getFxRatesData(@Req() request: Request, type: FxExchangeType = FxExchangeType.DEFAULT) {

    const ip = request.ip;
    const userId = request.session.userId;
    const userAgent = request.headers['user-agent'] ? request.headers['user-agent'] : '';
    const { eur_to_usd, usd_to_eur } = await this.fxRedisService.getDataFromRedis()
    const databaseEmpty = (await this.fxRatesService.databaseEmpty()).valueOf()

    this.requestStatsService.saveRequestStats(userId, ip, userAgent);

    if (eur_to_usd && usd_to_eur) {
      return { eur_to_usd, usd_to_eur };
    } else {

      if (databaseEmpty) {

        const requestUrl = this.utilitiesService.generateUrl(type);
        const fxRatesData = await this.fxClientService.getData(requestUrl);
        const fxRatesDto = this.utilitiesService.fxDataToDto(fxRatesData);
        const responseData: FxRatesResponseObjectType = await this.fxRatesService.saveFxRateData(fxRatesDto);

        await this.fxRedisService.saveDataInRedis(responseData);

        return responseData;
      }
    }

    const latestFxRate = await this.fxRatesService.getLatestFxRateData();
    this.fxRedisService.saveDataInRedis(latestFxRate);

    return latestFxRate;
  }
}