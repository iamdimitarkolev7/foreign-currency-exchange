import { Controller, Get, Inject, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FxOrchestratorService } from '../services/fx-orchestrator.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { FxRateDto } from '../dtos/fx-rate.dto';
import { FxExchangeType } from '../../common/enums/fx-exchange-type.enum';
import { ClientProxy } from '@nestjs/microservices';
import { Redis } from 'ioredis';

@Controller('fx')
@Serialize(FxRateDto)
export class FxController {

  constructor(
    private fxOrchestratorService: FxOrchestratorService,
    private readonly redisClient: Redis
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getFXData(@Query('type') type: FxExchangeType = FxExchangeType.DEFAULT, @Req() request: Request) {

    const data = await this.fxOrchestratorService.getFxRatesData(request, type);

    this.redisClient.publish('fx', JSON.stringify(data));
      
    return data;
  }
}
