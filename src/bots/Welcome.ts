import Composer from 'telegraf/composer';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';

const bot = new Composer();
const WelcomeMessage = {
  newMember: `Would you mind doing a short intro of yourself? :) The members would be interested to know the following:

  1. Some background of your academics
  2. Your current job/situation
  3. Your tech interest/aspirations
  
  If you found a message in this group helpful, reply to the message with a 👍🏻 or 💯 to upvote the author. The points accumulated does not have any value though but only for posterity sake! 😄
  
  Also, follow us on socmed:
  - IG: @msociety.tech
  - Twitter: @msociety_tech
  
  Related Channels/Chats:
  - @MSOCIETYChannel - Up to date announcements on career opportunities and upcoming events
  - @MSOCIETYIdeas - Idea dumping ground extracted from lobby discussions
  - @MSOCIETYSoftwareDev - Discussions on Software Dev
  - @MSOCIETYML - DIscussions on AI/ML`,
  returningMember: 'Welcome back',
};

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
      ctx.reply(`Let's welcome ${member.first_name}! \n Hi ${member.first_name} ${WelcomeMessage.newMember} `); // TODO: Set/get welcome message from db?
    } else {
      ctx.reply(`${WelcomeMessage.returningMember} ${member.first_name}!`);
    }
  });
});

export { bot as WelcomeBot };
export { WelcomeMessage };
