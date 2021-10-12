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

export function createTgTextMessage(
  text: string,
  chat: Chat = createTgGroupChat(),
  user: User = createTgUser(),
): Message.TextMessage {
  return {
    ...createTgMessage(chat, user),
    text,
  };
}

export function createTgMessage(chat: Chat = createTgGroupChat(), user: User = createTgUser()): Message.ServiceMessage {
  return {
    message_id: 10,
    date: new Date().getTime(),
    chat: chat,
    from: user,
  };
}
