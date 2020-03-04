import Composer from 'telegraf/composer';
import { EntityManager } from 'typeorm';
import { User } from '../entity/User';
import { User as TelegramUser, Chat as TelegramChat, Message as TelegramMessage } from 'telegram-typings';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';

export const ScriberBot = new Composer();
ScriberBot.on('message', async (ctx, next) => {
  await upsertChat(ctx.entityManager, ctx.message.chat);

  if (ctx.message.forward_from_chat) {
    await upsertChat(ctx.entityManager, ctx.message.forward_from_chat);
  }

  if (ctx.message.from) {
    await upsertUser(ctx.entityManager, ctx.message.from);
  }

  if (ctx.message.forward_from) {
    await upsertUser(ctx.entityManager, ctx.message.forward_from);
  }

  if (ctx.message.left_chat_member) {
    await upsertUser(ctx.entityManager, ctx.message.left_chat_member);
  }

  if (ctx.message.new_chat_members && ctx.message.new_chat_members.length > 0) {
    await Promise.all(ctx.message.new_chat_members.map(member => upsertUser(ctx.entityManager, member)));
  }

  await upsertMessage(ctx.entityManager, ctx.message);

  next();
});

async function upsertMessage(entityManager: EntityManager, telegramMessage: TelegramMessage) {
  const message = await entityManager.findOne(Message, telegramMessage.message_id);
  if (message === undefined) {
    const newMessage = entityManager.create(Message, {
      id: telegramMessage.message_id,
      unixtime: telegramMessage.date,
      text: telegramMessage.text,
    });
    await entityManager.save(newMessage);
  } else {
    message.unixtime = telegramMessage.date;
    message.text = telegramMessage.text;
    await entityManager.save(message);
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
    await entityManager.save(newUser);
  } else {
    user.firstName = telegramUser.first_name;
    user.lastName = telegramUser.last_name;
    user.username = telegramUser.username;
    await entityManager.save(user);
  }
}

async function upsertChat(entityManager: EntityManager, telegramChat: TelegramChat) {
  const chat = await entityManager.findOne(Chat, telegramChat.id);
  if (chat === undefined) {
    const chat = entityManager.create(Chat, {
      id: telegramChat.id,
      type: telegramChat.type,
      title: telegramChat.title,
    });
    await entityManager.save(chat);
  } else {
    chat.type = telegramChat.type;
    chat.title = telegramChat.title;
    await entityManager.save(chat);
  }

  if (telegramChat.type === 'private') {
    await upsertUser(entityManager, {
      id: telegramChat.id,
      first_name: telegramChat.first_name,
      last_name: telegramChat.last_name,
      username: telegramChat.username,
      is_bot: false,
    });
  }
}
