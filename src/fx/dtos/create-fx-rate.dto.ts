import { IsDecimal, IsNumber } from 'class-validator';

export class CreateFxRateDto {

  @IsDecimal()
  eur_to_usd: number;

  @IsDecimal()
  usd_to_eur: number;

  @IsNumber()
  created_at: number;
}