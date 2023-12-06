import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestStats } from './request-stats.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string

  @Column()
  password: string;

  @OneToMany(() => RequestStats, (requestStats) => requestStats.user)
  request_stats: RequestStats[];
}