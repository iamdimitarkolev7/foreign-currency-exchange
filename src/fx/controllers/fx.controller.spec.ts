import { Test, TestingModule } from '@nestjs/testing';
import { FxOrchestratorService } from '../services/fx-orchestrator.service';
import { FxController } from './fx.controller';
import { FxRateDto } from '../dtos/fx-rate.dto';
import { FxExchangeType } from '../../common/enums/fx-exchange-type.enum';

describe('Fx Controller', () => {
  
  const mockFxRates: FxRateDto = {
    eur_to_usd: '1.2',
    usd_to_eur: '0.8'
  }
  const mockRequest: any = {
    ip: ':1',
    session: { userId: 5 },
    headers: { 'user-agent': 'Mozilla' },
  };

  let fxController: FxController;
  let _fxOrchestratorService: Partial<FxOrchestratorService>;

  beforeEach(async () => {

    _fxOrchestratorService = {
      getFxRatesData: () => Promise.resolve(mockFxRates)
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FxController
      ],
      providers: [
        {
          provide: FxOrchestratorService,
          useValue: _fxOrchestratorService
        }
      ]
    }).compile();

    fxController = module.get<FxController>(FxController);
  });

  it('should be defined', () => {
    expect(fxController).toBeDefined();
  });

  it('should get fx data', async () => {

    const result = await fxController.getFXData(FxExchangeType.DEFAULT, mockRequest);
  
    expect(result).toEqual(expect.objectContaining({ usd_to_eur: mockFxRates.usd_to_eur, eur_to_usd: mockFxRates.eur_to_usd }));
  });
});