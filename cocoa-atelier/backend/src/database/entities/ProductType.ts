import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { numericTransformer } from '../numericTransformer.js';

@Entity()
@Check('product_type_coefficient > 0')
export class ProductType {
  @PrimaryGeneratedColumn()
  productTypeId: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  productTypeName: string;

  @Column({
    type: 'numeric',
    precision: 5,
    scale: 2,
    transformer: numericTransformer,
  })
  productTypeCoefficient: number;
}
