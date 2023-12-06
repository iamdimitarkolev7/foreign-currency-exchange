import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FxRatesResponseObjectType } from '../../common/types/fx-rates-response-object.type';

export class FxRedisService {

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async saveDataInRedis(fxData: FxRatesResponseObjectType) {

    await this.cacheManager.set('usd_to_eur', fxData.usd_to_eur);
    await this.cacheManager.set('eur_to_usd', fxData.eur_to_usd);
  }

  async dataSavedInRedis(): Promise<boolean> {
    
    const usd_to_eur = await this.cacheManager.get('usd_to_eur');
    const eur_to_usd = await this.cacheManager.get('eur_to_usd');

    return !!usd_to_eur && !!eur_to_usd;
  }

  async getDataFromRedis() {

    const usd_to_eur = await this.cacheManager.get('usd_to_eur');
    const eur_to_usd = await this.cacheManager.get('eur_to_usd');

    return { usd_to_eur, eur_to_usd };
  }
}