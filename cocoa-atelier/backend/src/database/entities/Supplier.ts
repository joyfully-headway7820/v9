import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierType } from './SupplierType.js';

@Entity()
@Check('rating >= 0')
@Check("inn ~ '^[0-9]{10}([0-9]{2})?$'")
export class Supplier {
  @PrimaryGeneratedColumn()
  supplierId: number;

  @Column({ type: 'int' })
  supplierTypeId: number;

  @ManyToOne(() => SupplierType, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'supplier_type_id' })
  supplierType: SupplierType;

  @Column({ type: 'varchar', length: 150, unique: true })
  supplierName: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  inn: string;

  @Column({ type: 'smallint' })
  rating: number;

  // Дата начала сотрудничества в формате YYYY-MM-DD
  @Column({ type: 'date' })
  startDate: string;
}
