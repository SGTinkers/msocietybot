import Composer from 'telegraf/composer';
import { EntityManager } from 'typeorm';
import { User } from '../entity/User';
import { User as TelegramUser, Chat as TelegramChat } from 'telegram-typings';
import { Chat } from '../entity/Chat';

export const ScriberBot = new Composer();
ScriberBot.on('message', ctx => {
  upsertChat(ctx.entityManager, ctx.message.chat);

  if (ctx.message.new_chat_members && ctx.message.new_chat_members.length > 0) {
    ctx.message.new_chat_members.forEach(member => upsertUser(ctx.entityManager, member));
  }
});

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
    });
    await entityManager.save(chat);
  } else {
    chat.type = telegramChat.type;
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
