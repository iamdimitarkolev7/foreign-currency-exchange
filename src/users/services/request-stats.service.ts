import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestStats } from '../entities/request-stats.entity';
import { UsersService } from './users.service';

@Injectable()
export class RequestStatsService {

  constructor(
    @InjectRepository(RequestStats) private requestStatsService: Repository<RequestStats>,
    private usersService: UsersService
  ) {}

  async saveRequestStats(userId: number, ip: string, userAgent: string) {

    const user = await this.usersService.findOne(userId);
    const requestStat = this.requestStatsService.create({ ip, user_agent: userAgent, user });

    return this.requestStatsService.save(requestStat);
  }
}