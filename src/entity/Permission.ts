import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './Role';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(
    () => Role,
    role => role.permissions,
  )
  role: Role;

  @Column()
  name: string;
}
