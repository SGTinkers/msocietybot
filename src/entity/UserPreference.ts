import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, Index, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity('users_preferences')
@Index(['user', 'key'], { unique: true })
export class UserPreference {
  @ManyToOne(
    () => User,
    user => user.preferences,
    { primary: true, nullable: false },
  )
  user: User;

  @PrimaryColumn()
  key: string;

  @Column({ nullable: false })
  value: string;

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
