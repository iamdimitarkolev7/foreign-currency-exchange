import { Module } from '@nestjs/common';
import { FxRatesService } from './services/fx-rates.service';
import { FxController } from './controllers/fx.controller';
import { FxClientService } from './services/fx-client.service';
import { FxRates } from './entities/fx-rates.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxOrchestratorService } from './services/fx-orchestrator.service';
import { UtilitiesService } from './utilities/utilities.service';
import { FxRedisService } from './services/fx-redis.service';
import { RequestStats } from '../users/entities/request-stats.entity';
import { UsersModule } from '../users/users.module';

@Module({
  providers: [
    FxOrchestratorService,
    FxRatesService,
    FxClientService,
    UtilitiesService,
    FxRedisService
  ],
  exports: [
    FxRatesService,
    FxClientService,
    FxRedisService,
    UtilitiesService
  ],
  controllers: [
    FxController
  ],
  imports: [
    TypeOrmModule.forFeature([FxRates, RequestStats]),
    UsersModule
  ]
})
export class FxModule {}
