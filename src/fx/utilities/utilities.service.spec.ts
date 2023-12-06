import { Test, TestingModule } from '@nestjs/testing';
import { UtilitiesService } from './utilities.service';
import { FxExchangeType } from '../../common/enums/fx-exchange-type.enum';
import { InvalidFxTypeException } from '../../common/exceptions/invalid-exchange-type.exception';

require('dotenv').config();

describe('Utilities Service', () => {
  
  let utilitiesService: UtilitiesService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilitiesService
      ]
    }).compile();

    utilitiesService = module.get<UtilitiesService>(UtilitiesService);
  });

  it('should be defined', () => {
    expect(utilitiesService).toBeDefined();
  });

  it('should generate a correct url using EUR_TO_USD type', () => {

    const url = utilitiesService.generateUrl(FxExchangeType.EUR_TO_USD);
    const expectedUrl = 'https://api.apilayer.com/exchangerates_data/convert?from=EUR&to=USD&amount=1';

    expect(url).toEqual(expectedUrl);
  });

  it('should generate a correct url using USD_TO_EUR type', () => {

    const url = utilitiesService.generateUrl(FxExchangeType.USD_TO_EUR);
    const expectedUrl = 'https://api.apilayer.com/exchangerates_data/convert?from=USD&to=EUR&amount=1';

    expect(url).toEqual(expectedUrl);
  });

  it('should generate a correct url using DEFAULT type', () => {

    const url = utilitiesService.generateUrl(FxExchangeType.DEFAULT);
    const expectedUrl = 'https://api.apilayer.com/exchangerates_data/convert?from=EUR&to=USD&amount=1';

    expect(url).toEqual(expectedUrl);
  });

  it('should throw an error when using invalid type', () => {

    try {
      let url = utilitiesService.generateUrl(FxExchangeType.UNKNOWN);
    } catch (err) {
      expect(err).toBeInstanceOf(InvalidFxTypeException);
    }
  });
});