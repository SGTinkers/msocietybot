import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, Index, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity('users_preferences')
@Index(['user', 'key'], { unique: true })
export class UserPreference {
  @ManyToOne(
    () => User,
    user => user.preferences,
    { primary: true },
  )
  user: User;

  @PrimaryColumn()
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
