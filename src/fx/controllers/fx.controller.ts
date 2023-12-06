import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { FxOrchestratorService } from '../services/fx-orchestrator.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { FxRateDto } from '../dtos/fx-rate.dto';

@Controller('fx')
@Serialize(FxRateDto)
export class FxController {

  constructor(
    private fxOrchestratorService: FxOrchestratorService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async getFXData(@Query('type') type: string, @Req() request: Request) {

    return this.fxOrchestratorService.getFxRatesData(request);
  }
}
