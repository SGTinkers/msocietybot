import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany } from 'typeorm';
import { Permission } from './Permission';
import { User } from './User';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  displayName: string | null;

  @Column({ nullable: true })
  description: string | null;

  @OneToMany(
    () => Permission,
    permission => permission.role,
  )
  permissions: Permission[];

  @ManyToMany(
    () => User,
    user => user.roles,
  )
  users: User[];

  @Column({ nullable: false })
  createdAt: Date;

  @Column({ nullable: false })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date | null;

  @BeforeInsert()
  onBeforeInsertHook(): void {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  onBeforeUpdateHook(): void {
    this.updatedAt = new Date();
  }
}
