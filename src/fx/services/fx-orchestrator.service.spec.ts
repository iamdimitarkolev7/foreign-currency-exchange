import { RequestStatsService } from '../../users/services/request-stats.service';
import { UtilitiesService } from '../utilities/utilities.service';
import { FxClientService } from './fx-client.service';
import { FxOrchestratorService } from './fx-orchestrator.service';
import { FxRatesService } from './fx-rates.service';
import { FxRedisService } from './fx-redis.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FxRates } from '../entities/fx-rates.entity';

describe('Fx Orchestrator Service', () => {

  const requestUrl = 'https://api.apilayer.com/exchangerates_data/convert?from=EUR&to=USD&amount=1';
  const mockFxRateData: FxRates = {
    id: 3,
    usd_to_eur: 0.8,
    eur_to_usd: 1.2,
    created_at: 123456789
  };
  const mockDataRedis = {
    usd_to_eur: 0.8,
    eur_to_usd: 1.2,
  };
  const mockRequest: any = {
    ip: ':1',
    session: { userId: 5 },
    headers: { 'user-agent': 'Mozilla' },
  };
  const mockUser = {
    id: 5,
    username: 'kolev',
    password: 'kolev',
    request_stats: []
  };
  const mockCreatedRequestStat = {
    id: 1,
    ip: ':1',
    user_agent: 'Mozilla',
    user: mockUser
  };

  let fxOrchestratorService: FxOrchestratorService;
  let _fxRatesService: Partial<FxRatesService>;
  let _fxClientService: Partial<FxClientService>;
  let _fxRedisService: Partial<FxRedisService>;
  let _utilitiesService: Partial<UtilitiesService>;
  let _requestStatsService: Partial<RequestStatsService>;

  beforeEach(async () => {

    _fxRatesService = {
      databaseEmpty: () => Promise.resolve(false),
      getLatestFxRateData: () => Promise.resolve(mockFxRateData)
    }

    _fxRedisService = {
      dataSavedInRedis: () => Promise.resolve(true),
      getDataFromRedis: () => Promise.resolve(mockDataRedis)
    }

    _requestStatsService = {
      saveRequestStats: () => Promise.resolve(mockCreatedRequestStat)
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxOrchestratorService,
        {
          provide: FxRatesService,
          useValue: _fxRatesService
        },
        {
          provide: FxClientService,
          useValue: _fxClientService
        },
        {
          provide: FxRedisService,
          useValue: _fxRedisService
        },
        {
          provide: UtilitiesService,
          useValue: _utilitiesService
        },
        {
          provide: RequestStatsService,
          useValue: _requestStatsService
        },
      ]
    }).compile();

    fxOrchestratorService = module.get<FxOrchestratorService>(FxOrchestratorService);
  });

  it('should be defined', () => {
    expect(fxOrchestratorService).toBeDefined();
  });

  it('should get fx rates data from Redis if data is saved', async () => {

    _fxRedisService = {
      dataSavedInRedis: () => Promise.resolve(true),
      getDataFromRedis: () => Promise.resolve(mockDataRedis)
    };

    _fxRatesService = {
      databaseEmpty: () => Promise.resolve(false)
    };
  
    const result = await fxOrchestratorService.getFxRatesData(mockRequest);

    expect(result).toEqual(expect.objectContaining({ usd_to_eur: expect.any(Number), eur_to_usd: expect.any(Number) }));
  });

  it('should get fx rates data from the internal API and save in Redis if data is not saved in Redis and database is empty', async () => {

    _fxRedisService = {
      dataSavedInRedis: () => Promise.resolve(false),
      saveDataInRedis: () => Promise.resolve()
    };

    _fxRatesService = {
      databaseEmpty: () => Promise.resolve(true),
      saveFxRateData: () => Promise.resolve(mockFxRateData)
    };

    _utilitiesService = {
      generateUrl: () => requestUrl,
      fxDataToDto: () => mockFxRateData
    };

    _fxClientService = {
      getData: () => Promise.resolve(mockFxRateData)
    };

    const result = await fxOrchestratorService.getFxRatesData(mockRequest);

    expect(result).toEqual(expect.objectContaining({ usd_to_eur: expect.any(Number), eur_to_usd: expect.any(Number) }));
  });

  it('should get the latest FX rates data from the database and save in Redis', async () => {

    _fxRedisService = {
      dataSavedInRedis: () => Promise.resolve(false),
      saveDataInRedis: () => Promise.resolve()
    };

    _fxRatesService = {
      databaseEmpty: () => Promise.resolve(false),
      getLatestFxRateData: () => Promise.resolve(mockFxRateData)
    };
    
    const result = await fxOrchestratorService.getFxRatesData(mockRequest);

    expect(result).toEqual(expect.objectContaining({ usd_to_eur: expect.any(Number), eur_to_usd: expect.any(Number) }));
  });
});