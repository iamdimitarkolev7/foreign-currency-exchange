import { BadRequestException, Injectable } from '@nestjs/common';
import { FxExchangeType } from '../../common/enums/fx-exchange-type.enum';
import { InvalidFxTypeException } from '../../common/exceptions/invalid-exchange-type.exception';
import { FxRatesObjectType } from '../../common/types/fx-rates-object.type';
import { FxCurrency } from '../../common/enums/fx-currency.enum';
import { FxRatesDtoType } from '../../common/types/fx-rates-dto.type';

@Injectable()
export class UtilitiesService {

  generateUrl(fxType: FxExchangeType = FxExchangeType.DEFAULT): string {

    let requestUrl: string = process.env.API_BASE_URL;

    switch (fxType) {
      case FxExchangeType.EUR_TO_USD:
      case FxExchangeType.DEFAULT: {
        requestUrl += '?from=EUR&to=USD';
        break;
      }
      case FxExchangeType.USD_TO_EUR: {
        requestUrl += '?from=USD&to=EUR';
        break;
      }
      default: {
        throw new InvalidFxTypeException();
      }
    }

    requestUrl += '&amount=1';

    return requestUrl;
  }

  fxDataToDto(fxRawData: FxRatesObjectType): FxRatesDtoType {

    let fxRateDto: FxRatesDtoType = {
      eur_to_usd: 0,
      usd_to_eur: 0,
      created_at: 0
    };

    if (fxRawData === '') {
      throw new BadRequestException('invalid data');
    }

    if (fxRawData.query.from === FxCurrency.EUR) {
      fxRateDto.eur_to_usd = fxRawData.info.rate;
      fxRateDto.usd_to_eur = 1 / fxRawData.info.rate;
    } else if (fxRawData.query.from === FxCurrency.USD) {
      fxRateDto.usd_to_eur = fxRawData.info.rate;
      fxRateDto.eur_to_usd = 1 / fxRawData.info.rate;
    }

    fxRateDto.created_at = fxRawData.info.timestamp;

    return fxRateDto;
  }
}