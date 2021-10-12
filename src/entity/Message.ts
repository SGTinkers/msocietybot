import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  PrimaryColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './User';
import { Chat } from './Chat';
import {
  Animation,
  Audio,
  Contact,
  Document,
  Game,
  Invoice,
  Location,
  MessageEntity,
  PassportData,
  PhotoSize,
  Sticker,
  SuccessfulPayment,
  Venue,
  Video,
  VideoNote,
  Voice,
} from 'telegraf/typings/core/types/typegram';

@Entity('messages')
export class Message {
  @PrimaryColumn('bigint')
  id: string;

  @ManyToOne(
    () => User,
    user => user.messages,
    { nullable: true },
  )
  sender: User | null;

  @ManyToOne(
    () => Message,
    message => message.replies,
    { nullable: true },
  )
  replyToMessage: Message | null;

  @OneToMany(
    () => Message,
    message => message.replyToMessage,
  )
  replies: Message[];

  @Column({ type: 'bigint', nullable: false })
  unixtime: string;

  @ManyToOne(
    () => Chat,
    chat => chat.messages,
    { primary: true, nullable: false },
  )
  chat: Chat;

  @Column({ nullable: true })
  lastEdit: Date | null;

  @Column({ type: 'simple-json', nullable: true })
  editHistory: Message[] | null;

  @Column({ nullable: true })
  albumId: string | null;

  @Column({ nullable: true })
  signature: string | null;

  @Column({ nullable: true })
  text: string;

  @Column({ nullable: true })
  payload: string | null;

  @Column('simple-json', { nullable: true })
  entities: MessageEntity[] | null;

  @Column({ nullable: true })
  caption: string | null;

  @Column('simple-json', { nullable: true })
  captionEntities: MessageEntity[] | null;

  @Column('simple-json', { nullable: true })
  audio: Audio | null;

  @Column('simple-json', { nullable: true })
  document: Document | null;

  @Column('simple-json', { nullable: true })
  animation: Animation | null;

  @Column('simple-json', { nullable: true })
  game: Game | null;

  @Column('simple-json', { nullable: true })
  photo: PhotoSize[] | null;

  @Column('simple-json', { nullable: true })
  sticker: Sticker | null;

  @Column('simple-json', { nullable: true })
  voice: Voice | null;

  @Column('simple-json', { nullable: true })
  videoNote: VideoNote | null;

  @Column('simple-json', { nullable: true })
  video: Video | null;

  @Column('simple-json', { nullable: true })
  contact: Contact | null;

  @Column('simple-json', { nullable: true })
  location: Location | null;

  @Column('simple-json', { nullable: true })
  venue: Venue | null;

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
  newGroupPhoto: PhotoSize[] | null;

  @ManyToMany(() => User, { nullable: true })
  @JoinTable()
  usersJoined: User[] | null;

  @Column({ nullable: true })
  groupPhotoDeleted: boolean | null;

  @Column({ nullable: true })
  groupCreated: boolean | null;

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

  @OneToMany(
    () => Message,
    message => message.pinnedMessage,
  )
  pinnerMessage: Message[];

  @ManyToOne(
    () => Message,
    message => message.pinnerMessage,
    { nullable: true },
  )
  pinnedMessage: Message | null;

  @ManyToOne(() => User, { nullable: true })
  forwardFrom: User | null;

  @ManyToOne(() => Chat, { nullable: true })
  forwardFromChat: Chat | null;

  @ManyToOne(() => Message, { nullable: true })
  forwardFromMessage: Message | null;

  @Column({ nullable: true })
  forwardSignature: string | null;

  @Column({ nullable: true })
  forwardDate: Date | null;

  @Column({ nullable: true })
  mediaGroupId: string | null;

  @Column({ nullable: true })
  authorSignature: string | null;

  @Column('simple-json', { nullable: true })
  invoice: Invoice | null;

  @Column('simple-json', { nullable: true })
  successfulPayment: SuccessfulPayment | null;

  @Column({ nullable: true })
  connectedWebsite: string | null;

  @Column('simple-json', { nullable: true })
  passportData: PassportData | null;

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
