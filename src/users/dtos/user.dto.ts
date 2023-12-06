import { Expose } from 'class-transformer';
import { RequestStats } from '../entities/request-stats.entity';

export class UserDto {

  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  request_stats: RequestStats[];
}