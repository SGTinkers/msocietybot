import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany } from 'typeorm';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string | null;

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

  @Column()
  createdAt: Date;

  @Column()
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
