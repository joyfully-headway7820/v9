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
import { Supplier } from './Supplier.js';

// Условия, на которых поставщик продаёт конкретный материал
@Entity()
@Check('purchase_price >= 0')
@Check('delivery_days >= 0')
export class MaterialSupplier {
  @PrimaryColumn({ type: 'int' })
  materialId: number;

  @PrimaryColumn({ type: 'int' })
  supplierId: number;

  @ManyToOne(() => Material, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Supplier, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: numericTransformer,
  })
  purchasePrice: number;

  @Column({ type: 'int' })
  deliveryDays: number;
}
