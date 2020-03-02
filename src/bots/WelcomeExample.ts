import Composer from 'telegraf/composer';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const bot = new Composer();
bot.on('new_chat_members', ctx => {
  const userRepo = getRepository(User);

  ctx.message.new_chat_members.forEach(async member => {
    const user = await userRepo.findOne(member.id);
    if (user === undefined && !member.is_bot) {
      const newUser = userRepo.create({
        id: member.id,
        firstName: member.first_name,
        lastName: member.last_name,
        username: member.username,
      });
      await userRepo.save(newUser);
      ctx.reply(`Welcome ${member.first_name}!`); // TODO: Set/get welcome message from db?
    } else {
      ctx.reply(`Welcome back ${member.first_name}!`);
    }
  });
});

export default bot;
