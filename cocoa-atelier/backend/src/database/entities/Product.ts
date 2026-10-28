import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../numericTransformer.js';
import { ProductType } from './ProductType.js';

@Entity()
@Check('min_partner_price >= 0')
export class Product {
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  productArticle: string;

  @Column({ type: 'int' })
  productTypeId: number;

  @ManyToOne(() => ProductType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @Column({ type: 'varchar', length: 150, unique: true })
  productName: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  minPartnerPrice: number;
}
