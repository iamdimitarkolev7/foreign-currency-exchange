import { Column, Decimal128, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FxRates {

  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({type: 'decimal'})
  eur_to_usd: number;

  @Column({type: 'decimal'})
  usd_to_eur: number;

  @Column()
  created_at: number;
}