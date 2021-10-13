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

export function createTgTextMessage<T extends Partial<Message.TextMessage> & Record<string, unknown>>(
  text: string,
  overrides?: T,
): Message.TextMessage & T {
  return {
    ...createTgMessage({ chat: overrides?.chat, from: overrides?.from }),
    text,
    ...overrides,
  };
}

export function createTgMessage<T extends Partial<Message.ServiceMessage> & Record<string, unknown>>(
  overrides?: T,
): Message.ServiceMessage & T {
  return {
    date: new Date().getTime(),
    ...overrides,
    message_id: overrides?.message_id ?? defaultIdGen.next().value,
    chat: overrides?.chat ?? createTgGroupChat(),
    from: overrides?.from ?? createTgUser(),
  };
}

const defaultIdGen = idGenerator();

export function* idGenerator(): Generator<number> {
  let index = 2;
  while (true) yield index++;
}
