import Composer from 'telegraf/composer';

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
  ctx.message.new_chat_members.forEach(member => {
    if (!member.is_bot) {
      // TODO: Set/get welcome message from db?
      ctx.reply(`Let's welcome ${member.first_name}! \n Hi ${member.first_name} ${WelcomeMessage.newMember} `);
    }
  });
});

export { bot as WelcomeBot };
