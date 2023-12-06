import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FxRates } from '../entities/fx-rates.entity';
import { CreateFxRateDto } from '../dtos/create-fx-rate.dto';

@Injectable()
export class FxRatesService {

  constructor(
    @InjectRepository(FxRates) private fxRatesRepository: Repository<FxRates>
  ) {}

  async saveFxRateData(fxRateDto: CreateFxRateDto) {
    
    return await this.fxRatesRepository.save(fxRateDto);
  }

  async getLatestFxRateData() {

    const latestFxRate = await this.fxRatesRepository
      .createQueryBuilder('fx_rates')
      .select('*')
      .orderBy('created_at', 'DESC')
      .limit(1)
      .getRawOne();

    return latestFxRate;
  }

  async databaseEmpty(): Promise<boolean> {
    
    return await this.fxRatesRepository.count() === 0;
  }
}
