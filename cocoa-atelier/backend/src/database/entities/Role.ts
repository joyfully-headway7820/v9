import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  roleId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  roleName: string;

  @Column({ type: 'text' })
  roleDescription: string;
}
