import { Test, TestingModule } from '@nestjs/testing';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FxRedisService } from './fx-redis.service';

describe('FxRedisService', () => {

  let fxRedisService: FxRedisService;
  let cacheManager: Cache;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxRedisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    fxRedisService = module.get<FxRedisService>(FxRedisService);
    cacheManager = module.get<Cache>(CACHE_MANAGER);
  });

  it('should be defined', () => {
    expect(fxRedisService).toBeDefined();
  });

  it('should save data in Redis', async () => {

    const fxData = {
      usd_to_eur: 0.8,
      eur_to_usd: 1.2,
    };

    await fxRedisService.saveDataInRedis(fxData);

    expect(cacheManager.set).toHaveBeenCalledWith('usd_to_eur', 0.8);
    expect(cacheManager.set).toHaveBeenCalledWith('eur_to_usd', 1.2);
  });

  it('should check if data is saved in Redis', async () => {
    
    (cacheManager.get as jest.MockedFunction<typeof cacheManager.get>)
      .mockResolvedValueOnce(0.8)
      .mockResolvedValueOnce(1.2);

    const result = await fxRedisService.dataSavedInRedis();

    expect(result).toBe(true);
  });

  it('should get data from Redis', async () => {
    
    (cacheManager.get as jest.MockedFunction<typeof cacheManager.get>)
      .mockResolvedValueOnce(0.8)
      .mockResolvedValueOnce(1.2);

    const result = await fxRedisService.getDataFromRedis();

    expect(result).toEqual({
      usd_to_eur: 0.8,
      eur_to_usd: 1.2,
    });
  });
});
