import Composer from 'telegraf/composer';
import { EntityManager, FindConditions } from 'typeorm';
import { User } from '../entity/User';
import { Chat as TelegramChat, Message as TelegramMessage, User as TelegramUser } from 'telegram-typings';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';

export const ScriberBot = new Composer();
ScriberBot.on('message', async (ctx, next) => {
  const messageFields: Partial<Message> = {};
  const chat = await upsertChat(ctx.entityManager, ctx.message.chat);

  if (ctx.message.forward_from_chat) {
    messageFields.forwardFromChat = await upsertChat(ctx.entityManager, ctx.message.forward_from_chat);
  }

  if (ctx.message.from) {
    messageFields.sender = await upsertUser(ctx.entityManager, ctx.message.from);
  }

  if (ctx.message.forward_from) {
    messageFields.forwardFrom = await upsertUser(ctx.entityManager, ctx.message.forward_from);
  }

  if (ctx.message.left_chat_member) {
    messageFields.userLeft = await upsertUser(ctx.entityManager, ctx.message.left_chat_member);
  }

  if (ctx.message.new_chat_members && ctx.message.new_chat_members.length > 0) {
    messageFields.usersJoined = [];
    const users = await Promise.all(ctx.message.new_chat_members.map(member => upsertUser(ctx.entityManager, member)));
    users.forEach((user: User) => messageFields.usersJoined.push(user));
  }

  await upsertMessage(ctx.entityManager, chat, ctx.message, messageFields);

  next();
});

async function upsertMessage(
  entityManager: EntityManager,
  chat: Chat,
  telegramMessage: TelegramMessage,
  partialMessage: Partial<Message> = {},
) {
  const message = await entityManager.findOne(Message, {
    id: telegramMessage.message_id,
    chat: chat.id,
  } as FindConditions<Message>);
  if (message === undefined) {
    const newMessage = entityManager.create(Message, {
      id: telegramMessage.message_id,
      unixtime: telegramMessage.date,
      text: telegramMessage.text,
      chat: chat,
      ...partialMessage,
    });
    return await entityManager.save(newMessage);
  } else {
    message.unixtime = telegramMessage.date;
    message.text = telegramMessage.text;
    Object.keys(partialMessage).forEach(k => (message[k] = partialMessage[k]));
    return await entityManager.save(message);
  }
}

async function upsertUser(entityManager: EntityManager, telegramUser: TelegramUser) {
  const user = await entityManager.findOne(User, telegramUser.id);
  if (user === undefined) {
    const newUser = entityManager.create(User, {
      id: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });
    return await entityManager.save(newUser);
  } else {
    user.firstName = telegramUser.first_name;
    user.lastName = telegramUser.last_name;
    user.username = telegramUser.username;
    return await entityManager.save(user);
  }
}

async function upsertChat(entityManager: EntityManager, telegramChat: TelegramChat) {
  if (telegramChat.type === 'private') {
    await upsertUser(entityManager, {
      id: telegramChat.id,
      first_name: telegramChat.first_name,
      last_name: telegramChat.last_name,
      username: telegramChat.username,
      is_bot: false,
    });
  }

  const chat = await entityManager.findOne(Chat, telegramChat.id);
  if (chat === undefined) {
    const chat = entityManager.create(Chat, {
      id: telegramChat.id,
      type: telegramChat.type,
      title: telegramChat.title,
    });
    return await entityManager.save(chat);
  } else {
    chat.type = telegramChat.type;
    chat.title = telegramChat.title;
    return await entityManager.save(chat);
  }
}
