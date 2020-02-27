import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { ChatPreference } from './ChatPreference';
import { Message } from './Message';

@Entity('chats')
export class Chat {
  @PrimaryColumn('bigint')
  id: number;

  @Column()
  type: string;

  @ManyToOne(
    () => User,
    user => user.chats,
    { nullable: true },
  )
  user: User;

  @Column({ nullable: true })
  title: string | null;

  @OneToMany(
    () => ChatPreference,
    preference => preference.chat,
  )
  preferences: ChatPreference[];

  @OneToMany(
    () => Message,
    message => message.chat,
  )
  messages: Message[];

  @OneToMany(
    () => Message,
    message => message.originalChat,
  )
  originalMessages: Message[];

  @OneToMany(
    () => Message,
    message => message.migrateToChat,
  )
  migratedToMessages: Message[];

  @OneToMany(
    () => Message,
    message => message.migrateFromChat,
  )
  migratedFromMessages: Message[];

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
