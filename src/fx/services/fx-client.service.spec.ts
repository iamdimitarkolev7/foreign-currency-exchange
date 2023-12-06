import { Test, TestingModule } from '@nestjs/testing';
import { FxClientService } from './fx-client.service';
import axios from 'axios';
import { FxRatesObjectType } from '../../common/types/fx-rates-object.type';

jest.mock('axios');

describe('Fx Client Service', () => {

  const requestUrl = 'https://api.apilayer.com/exchangerates_data/convert?from=EUR&to=USD&amount=1';

  let fxClientService: FxClientService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FxClientService,
      ]
    }).compile();

    fxClientService = module.get<FxClientService>(FxClientService);
  });

  it('should be defined', () => {
    expect(fxClientService).toBeDefined();
  });

  it('should fetch data successfully', async () => {

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
    
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: mockData, status: 200 });

    const result = await fxClientService.getData(requestUrl);

    expect(result).toEqual(mockData);
  });

  it('should handle errors and return empty string', async () => {

    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValueOnce({ status: 500 });

    const result = await fxClientService.getData(requestUrl);

    expect(result).toEqual('');
  });
});