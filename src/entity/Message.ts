import { Entity, Column, BeforeInsert, BeforeUpdate, ManyToOne, PrimaryColumn, OneToOne } from 'typeorm';
import { User } from './User';
import { Chat } from './Chat';

@Entity()
export class Message {
  @PrimaryColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.messages,
    { nullable: true },
  )
  sender: User | null;

  @Column()
  unixtime: number;

  @ManyToOne(
    () => Chat,
    chat => chat.messages,
  )
  chat: Chat;

  @ManyToOne(
    () => User,
    user => user.originalMessages,
    { nullable: true },
  )
  originalSender: User | null;

  @ManyToOne(
    () => Chat,
    chat => chat.originalMessages,
    { nullable: true },
  )
  originalChat: Chat | null;

  @Column({ nullable: true })
  originalUnixtime: number | null;

  @Column({ nullable: true })
  lastEdit: Date | null;

  @Column({ nullable: true })
  editHistory: string | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column({ nullable: true })
  signature: string | null;

  @Column()
  text: string;

  @Column({ nullable: true })
  payload: string | null;

  @Column('simple-json', { nullable: true })
  entities: { [key: string]: string } | null;

  @Column({ nullable: true })
  caption: string | null;

  @Column('simple-json', { nullable: true })
  captionEntities: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  audio: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  document: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  photo: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  sticker: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  voice: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  videoNote: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  video: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  contact: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  location: { [key: string]: string } | null;

  @Column('simple-json', { nullable: true })
  venue: { [key: string]: string } | null;

  @ManyToOne(
    () => User,
    user => user.userJoinedMessages,
    { nullable: true },
  )
  userJoined: User | null;

  @ManyToOne(
    () => User,
    user => user.userLeftMessages,
    { nullable: true },
  )
  userLeft: User | null;

  @Column({ nullable: true })
  newGroupTitle: string | null;

  @Column('simple-json', { nullable: true })
  newGroupPhoto: { [key: string]: string } | null;

  @Column({ nullable: true })
  usersJoined: string | null;

  @Column({ nullable: true })
  groupPhotoDeleted: boolean | null;

  @Column({ nullable: true })
  groupPhotoCreated: boolean | null;

  @Column({ nullable: true })
  supergroupCreated: boolean | null;

  @Column({ nullable: true })
  channelCreated: boolean | null;

  @ManyToOne(
    () => Chat,
    chat => chat.migratedToMessages,
    { nullable: true },
  )
  migrateToChat: Chat | null;

  @ManyToOne(
    () => Chat,
    chat => chat.migratedFromMessages,
    { nullable: true },
  )
  migrateFromChat: Chat | null;

  @OneToOne(() => Message, { nullable: true })
  pinnedMessage: Message | null;

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
