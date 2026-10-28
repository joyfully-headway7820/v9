import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../numericTransformer.js';

@Entity()
@Check('loss_percent >= 0 AND loss_percent < 100')
export class MaterialType {
  @PrimaryGeneratedColumn()
  materialTypeId: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  materialTypeName: string;

  // Процент потери сырья при производстве, например 0.12 = 0,12%
  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  lossPercent: number;
}
