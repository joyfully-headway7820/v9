import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericTransformer } from '../numericTransformer.js';
import { MaterialType } from './MaterialType.js';

@Entity()
@Check('unit_price >= 0')
@Check('package_quantity > 0')
@Check('stock_quantity >= 0')
@Check('min_quantity >= 0')
export class Material {
  @PrimaryGeneratedColumn()
  materialId: number;

  @Column({ type: 'int' })
  materialTypeId: number;

  @ManyToOne(() => MaterialType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'material_type_id' })
  materialType: MaterialType;

  @Column({ type: 'varchar', length: 150, unique: true })
  materialName: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  unitPrice: number;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 3,
    transformer: numericTransformer,
  })
  packageQuantity: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 3,
    transformer: numericTransformer,
  })
  stockQuantity: number;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 3,
    transformer: numericTransformer,
  })
  minQuantity: number;
}
