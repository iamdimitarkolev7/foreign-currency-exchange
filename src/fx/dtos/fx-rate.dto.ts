import { Expose } from 'class-transformer';

export class FxRateDto {

  @Expose()
  eur_to_usd: string;

  @Expose()
  usd_to_eur: string;
}