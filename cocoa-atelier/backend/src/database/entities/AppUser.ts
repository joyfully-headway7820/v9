import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role.js';

// Учётная запись; «user» в PostgreSQL зарезервировано, поэтому таблица app_user
@Entity()
export class AppUser {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 200 })
  fullName: string;

  @Column({ type: 'int' })
  roleId: number;

  @ManyToOne(() => Role, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'varchar', length: 254, unique: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
