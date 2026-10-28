import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Организационно-правовая форма поставщика: ООО, ИП
@Entity()
export class SupplierType {
  @PrimaryGeneratedColumn()
  supplierTypeId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  supplierTypeName: string;
}
