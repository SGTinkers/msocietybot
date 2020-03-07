import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, Index, PrimaryColumn } from 'typeorm';
import { Chat } from './Chat';

@Entity('chats_preferences')
@Index(['chat', 'key'], { unique: true })
export class ChatPreference {
  @ManyToOne(
    () => Chat,
    chat => chat.preferences,
    { primary: true, nullable: false },
  )
  chat: Chat;

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
