import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { numericTransformer } from '../numericTransformer.js';
import { Material } from './Material.js';
import { Product } from './Product.js';

// Рецептура: сколько материала уходит на единицу продукции
@Entity()
@Check('material_quantity > 0')
export class MaterialProduct {
  @PrimaryColumn({ type: 'int' })
  materialId: number;

  @PrimaryColumn({ type: 'int' })
  productId: number;

  @ManyToOne(() => Material, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Product, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 4,
    transformer: numericTransformer,
  })
  materialQuantity: number;
}
