import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  JoinTable,
  OneToMany,
  PrimaryColumn,
  EntityManager,
  UpdateResult,
} from 'typeorm';
import { Role } from './Role';
import { UserPreference } from './UserPreference';
import { Chat } from './Chat';
import { Message } from './Message';
import { Reputation } from './Reputation';
@Entity('user')
export class User {
  @PrimaryColumn('bigint')
  id: string;

  @Column({ nullable: true, unique: true })
  username: string | null;

  @Column({ nullable: true })
  firstName: string | null;

  @Column({ nullable: true })
  lastName: string | null;

  @ManyToMany(
    () => Role,
    role => role.users,
  )
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id' },
    inverseJoinColumn: { name: 'role_id' },
  })
  roles: Role[];

  @OneToMany(
    () => UserPreference,
    preference => preference.user,
  )
  preferences: UserPreference[];

  @OneToMany(
    () => Chat,
    chat => chat.user,
  )
  chats: Chat[];

  @OneToMany(
    () => Message,
    message => message.sender,
  )
  messages: Message[];

  @OneToMany(
    () => Message,
    message => message.userJoined,
  )
  userJoinedMessages: Message[];

  @OneToMany(
    () => Message,
    message => message.userLeft,
  )
  userLeftMessages: Message[];

  @OneToMany(
    () => Reputation,
    reputations => reputations.toUser,
  )
  reputations: Reputation[];

  @OneToMany(
    () => Reputation,
    reputations => reputations.fromUser,
  )
  reputationsGiven: Reputation[];

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

  static getUserByUsername = async (entityManager: EntityManager, username: string): Promise<User> => {
    return await entityManager.findOne(User, {
      where: {
        username: username,
      },
    });
  };

  static getUserByUserID = async (entityManager: EntityManager, userID: string): Promise<User> => {
    return await entityManager.findOne(User, {
      where: {
        id: userID,
      },
    });
  };

  static updateUserByID = async (
    entityManager: EntityManager,
    user: Partial<User>,
    id: string,
  ): Promise<UpdateResult> => {
    return await entityManager.update(User, { id }, user);
  };
}
