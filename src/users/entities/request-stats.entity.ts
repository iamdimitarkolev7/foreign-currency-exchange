import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RequestStats {
 
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  user_agent: string;

  @ManyToOne(() => User, (user) => user.request_stats)
  user: User;
}