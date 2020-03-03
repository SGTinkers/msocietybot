import Composer from 'telegraf/composer';
import { EntityManager } from 'typeorm';
import { User } from '../entity/User';
import { User as TelegramUser } from 'telegram-typings';

export const ScriberBot = new Composer();
ScriberBot.on('new_chat_members', ctx => {
  ctx.message.new_chat_members.forEach(member => insertUserIfNotExists(ctx.entityManager, member));
});

async function insertUserIfNotExists(entityManager: EntityManager, telegramUser: TelegramUser) {
  const user = await entityManager.findOne(User, telegramUser.id);
  if (user === undefined) {
    const newUser = entityManager.create(User, {
      id: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });
    await entityManager.save(User, newUser);
  }
}
