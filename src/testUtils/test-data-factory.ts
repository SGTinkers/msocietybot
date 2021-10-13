import { Chat, User, Message } from 'telegraf/typings/core/types/typegram';

export function createTgUser(): User {
  return {
    id: 2,
    is_bot: false,
    first_name: 'Abu',
    last_name: 'Bakr',
    username: 'abu_bakr',
  };
}

export function createTgGroupChat(): Chat.GroupChat {
  return {
    id: -10000,
    type: 'group',
    title: 'Some chat title',
  };
}

export function createTgPrivateChat(user: User): Chat.PrivateChat {
  return {
    id: user.id,
    type: 'private',
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
  };
}

export function createTgTextMessage<T extends Partial<Omit<Message.TextMessage, 'text'>>>(
  text: string,
  overrides?: T,
): Message.TextMessage & T {
  return createTgMessage({
    text,
    ...overrides,
  });
}

export function createTgMessage<T extends Partial<UnionToIntersection<Message>>>(
  overrides?: T,
): Message.ServiceMessage & T {
  return {
    date: new Date().getTime(),
    chat: overrides?.chat ?? createTgGroupChat(),
    from: overrides && 'from' in overrides ? overrides?.from : createTgUser(),
    message_id: overrides?.message_id ?? defaultIdGen.next().value,
    ...overrides,
  };
}

const defaultIdGen = idGenerator();

export function* idGenerator(): Generator<number> {
  let index = 2;
  while (true) yield index++;
}

// dark arts of TS
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
