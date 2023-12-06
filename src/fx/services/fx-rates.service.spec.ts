import { Repository } from 'typeorm';
import { FxRatesService } from './fx-rates.service';
import { FxRates } from '../entities/fx-rates.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateFxRateDto } from '../dtos/create-fx-rate.dto';

describe('Fx Rates Service', () => {

  const fxRateDto: CreateFxRateDto = {
    eur_to_usd: 1.2,
    usd_to_eur: 0.8,
    created_at: 123456789
  }

  const fxRateMock: FxRates = {
    id: 2,
    eur_to_usd: 1.2,
    usd_to_eur: 0.8,
    created_at: 123456789
  };

  let fxRatesService: FxRatesService;
  let fxRatesRepository: Repository<FxRates>;
  let fxRatesRepositoryToken: string | Function = getRepositoryToken(FxRates);

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxRatesService,
        {
          provide: fxRatesRepositoryToken,
          useClass: Repository,
        },
      ],
    }).compile();

    fxRatesService = module.get<FxRatesService>(FxRatesService);
    fxRatesRepository = module.get<Repository<FxRates>>(fxRatesRepositoryToken);
  });

  it('should be defined', () => {
    expect(fxRatesService).toBeDefined();
  });

  it('should save fx rate data', async () => {

    jest.spyOn(fxRatesRepository, 'create').mockReturnValue(fxRateMock);
    jest.spyOn(fxRatesRepository, 'save').mockResolvedValue(fxRateMock);

    const result = await fxRatesService.saveFxRateData(fxRateDto);

    expect(fxRatesRepository.create).toHaveBeenCalledWith(fxRateDto);
    expect(fxRatesRepository.save).toHaveBeenCalledWith(fxRateMock);
    expect(result).toEqual(fxRateMock);
  });

  it('should get the latest fx rate data', async () => {

    // TODO...
    // const createQueryBuilder: any = {
    //   select: () => createQueryBuilder,
    //   orderBy: () => createQueryBuilder,
    //   limit: () => createQueryBuilder,
    //   getRawData: () => jest.fn().mockImplementationOnce((x) => x.id === 1)
    // }

    // jest.spyOn(fxRatesRepository, 'createQueryBuilder').mockReturnValue(createQueryBuilder);

    // const result = await fxRatesService.getLatestFxRateData();

    // expect(fxRatesRepository.createQueryBuilder).toHaveBeenCalledWith('fx_rates');
    // expect(result).toEqual(fxRateMock);
  });

  it('should return true if the database is empty', async () => {

    jest.spyOn(fxRatesRepository, 'count').mockResolvedValue(0);

    const result = await fxRatesService.databaseEmpty();

    expect(fxRatesRepository.count).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false if the database is not empty', async () => {

    jest.spyOn(fxRatesRepository, 'count').mockResolvedValue(1);

    const result = await fxRatesService.databaseEmpty();

    expect(fxRatesRepository.count).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});