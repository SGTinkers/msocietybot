import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { User } from './User';

@Entity('users_preferences')
@Index(['user', 'key'], { unique: true })
export class UserPreference {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(
    () => User,
    user => user.preferences,
  )
  user: User;

  @Column()
  key: string;

  @Column()
  value: string;

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
