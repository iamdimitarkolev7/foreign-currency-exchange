import { UtilitiesService } from '../fx/utilities/utilities.service';
import { FxClientService } from '../fx/services/fx-client.service';
import { ScheduledRequestService } from './scheduled-request.service';
import { FxRatesService } from '../fx/services/fx-rates.service';
import { FxRedisService } from '../fx/services/fx-redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FxRatesObjectType } from '../common/types/fx-rates-object.type';
import { FxRatesDtoType } from '../common/types/fx-rates-dto.type';
import { FxRates } from '../fx/entities/fx-rates.entity';

describe('Scheduled Request Service', () => {

  const url = 'test.test';
  const mockData: FxRatesObjectType = {
    success: true,
    query: {
      from: 'USD',
      to: 'EUR',
      amount: 1,
    },
    info: {
      timestamp: expect.any(Number),
      rate: expect.any(Number),
    },
    date: expect.any(Date),
    result: expect.any(Number),
  };
  const mockFxDataDto: FxRatesDtoType = {
    eur_to_usd: 1.2,
    usd_to_eur: 0.8,
    created_at: 123456789
  };
  const mockFxRates: FxRates = {
    id: 2,
    usd_to_eur: 0.8,
    eur_to_usd: 1.2,
    created_at: 123456789
  };

  let scheduledRequestService: ScheduledRequestService;
  let _fxClientService: Partial<FxClientService>;
  let _utilitiesService: Partial<UtilitiesService>;
  let _fxRatesService: Partial<FxRatesService>;
  let _fxRedisService: Partial<FxRedisService>;

  beforeEach(async () => {

    _utilitiesService = {
      generateUrl: () => url,
      fxDataToDto: () => mockFxDataDto
    };

    _fxClientService = {
      getData: () => Promise.resolve(mockData)
    };

    _fxRatesService = {
      saveFxRateData: () => Promise.resolve(mockFxRates)
    };

    _fxRedisService = {
      saveDataInRedis: () => Promise.resolve()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduledRequestService,
        {
          provide: FxClientService,
          useValue: _fxClientService
        },
        {
          provide: UtilitiesService,
          useValue: _utilitiesService
        },
        {
          provide: FxRatesService,
          useValue: _fxRatesService
        },
        {
          provide: FxRedisService,
          useValue: _fxRedisService
        },
      ]
    }).compile();

    scheduledRequestService = module.get<ScheduledRequestService>(ScheduledRequestService);
  });

  it('should be defined', () => {
    expect(scheduledRequestService).toBeDefined();
  });

  it('should handle scheduled request', async () => {

    _fxRedisService = {
      dataSavedInRedis: () => Promise.resolve(false),
      saveDataInRedis: () => Promise.resolve(),
      getDataFromRedis: () => Promise.resolve(mockFxRates)
    };

    _fxRatesService = {
      databaseEmpty: () => Promise.resolve(true),
      saveFxRateData: () => Promise.resolve(mockFxRates)
    };

    _utilitiesService = {
      generateUrl: () => url,
      fxDataToDto: () => mockFxRates
    };

    _fxClientService = {
      getData: () => Promise.resolve(mockFxRates)
    };

    await scheduledRequestService.handleScheduledRequest();
    const data = await _fxRedisService.getDataFromRedis();

    expect(data).toEqual(expect.objectContaining({ usd_to_eur: expect.any(Number), eur_to_usd: expect.any(Number) }));
  });
});