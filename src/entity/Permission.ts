import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Role } from './Role';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Role,
    role => role.permissions,
  )
  role: Role;

  @Column()
  name: string;
}
