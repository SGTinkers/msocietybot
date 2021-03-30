import { Composer } from 'telegraf';
import { getRepository } from 'typeorm';
import { User } from '../../entity/User';

const bot = new Composer();
bot.on('new_chat_members', async ctx => {
  const userRepo = getRepository(User);

  await Promise.all(
    ctx.message.new_chat_members.map(async member => {
      const user = await userRepo.findOne(member.id);
      if (user === undefined && !member.is_bot) {
        const newUser = userRepo.create({
          id: `${member.id}`,
          firstName: member.first_name,
          lastName: member.last_name,
          username: member.username,
        });
        await userRepo.save(newUser);
        ctx.reply(`Welcome ${member.first_name}!`); // TODO: Set/get welcome message from db?
      } else {
        ctx.reply(`Welcome back ${member.first_name}!`);
      }
    }),
  );
});

export { bot as WelcomeExampleBot };
