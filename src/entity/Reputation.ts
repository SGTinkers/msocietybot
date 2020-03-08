import {
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  EntityManager,
  LessThan,
} from 'typeorm';
import { User } from './User';
import { Message } from './Message';
import { Chat } from './Chat';
import { Chat as TelegramChat, User as TelegramUser } from 'telegram-typings';

// TODO: Move this to some config file.
export const voteQuota = 3;
export const voteQuotaDuration = 24;
export const defaultVoteValue = 1;

@Entity('reputation')
export class Reputation {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @ManyToOne(
    () => User,
    user => user.reputations,
  )
  @JoinColumn({ name: 'from_user_id' })
  fromUser: User;

  @ManyToOne(
    () => User,
    user => user.reputations,
  )
  @JoinColumn({ name: 'to_user_id' })
  toUser: User;

  @ManyToOne(() => Chat)
  @JoinColumn()
  chat: Chat;

  @OneToOne(() => Message)
  @JoinColumn()
  message: Message;

  @Column({ default: 1, nullable: false })
  value: number;

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

  static getRecentVotes = async (
    entityManager: EntityManager,
    telegramUser: TelegramUser,
    hoursAgo: number = voteQuotaDuration,
  ) => {
    const now = new Date();
    const voteLimit = now.setHours(now.getHours() - hoursAgo);

    return await entityManager.find(Reputation, {
      where: {
        from_user_id: telegramUser.id,
        created_at: LessThan(voteLimit),
      },
    });
  };

  static getVoteQuota = async (entityManager: EntityManager, telegramUser: TelegramUser) => {
    const votes = await Reputation.getRecentVotes(entityManager, telegramUser);
    let nextVote = null;
    if (votes.length > 0) {
      const lastVote = votes[0].createdAt;
      nextVote = lastVote.setHours(lastVote.getHours() + voteQuotaDuration);
    }
    nextVote !== null ? getDuration(new Date(nextVote), new Date()) : null;
    return { nextVote, votesGiven: votes.length };
  };

  static isAllowedToVote = async (entityManager: EntityManager, telegramUser: TelegramUser) => {
    const votes = await Reputation.getRecentVotes(entityManager, telegramUser);
    return votes.length < voteQuota;
  };

  static getLocalReputation = async (
    entityManager: EntityManager,
    telegramUser: TelegramUser,
    telegramChat: TelegramChat,
  ) => {
    const reputations = await entityManager.find(Reputation, {
      where: {
        toUser: telegramUser.id,
        chat: telegramChat.id,
      },
    });
    let score = 0;
    reputations.forEach(rep => (score += rep.value));
    return score;
  };

  static getGlobalReputation = async (entityManager: EntityManager, telegramUser: TelegramUser) => {
    const reputations = await entityManager.find(Reputation, {
      where: {
        toUser: telegramUser.id,
      },
    });
    let score = 0;
    reputations.forEach(rep => (score += rep.value));
    return score;
  };
}

const getDuration = (start, end) => {
  const msDiff = start.getTime() - end.getTime();
  const minDiff = msDiff / 60000;
  const hourDiff = Math.floor(msDiff / 3600000);
  return {
    hours: hourDiff,
    minutes: Math.floor(minDiff - 60 * hourDiff),
  };
};
