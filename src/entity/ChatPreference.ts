import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, PrimaryColumn } from 'typeorm';
import { Chat } from './Chat';

@Entity()
export class ChatPreference {
  @ManyToOne(
    () => Chat,
    chat => chat.preferences,
  )
  @PrimaryColumn()
  chat: Chat;

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
