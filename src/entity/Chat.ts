import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, PrimaryColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { ChatPreference } from './ChatPreference';
import { Message } from './Message';
import { ChatPhoto } from 'telegram-typings';

@Entity('chats')
export class Chat {
  @PrimaryColumn('bigint')
  id: number;

  @Column({ nullable: false })
  type: string;

  @ManyToOne(
    () => User,
    user => user.chats,
    { nullable: true },
  )
  user: User | null;

  @Column({ nullable: true })
  allMembersAreAdministrators: boolean | null;

  @Column({ nullable: true })
  title: string | null;

  @Column({ nullable: true })
  description: string | null;

  @Column('simple-json', { nullable: true })
  photo: ChatPhoto | null;

  @Column({ nullable: true })
  inviteLink: string | null;

  @ManyToOne(() => Message, { nullable: true })
  pinnedMessage: Message | null;

  @Column({ nullable: true })
  stickerSetName: string | null;

  @Column({ nullable: true })
  botCanSetStickerSet: boolean | null;

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
