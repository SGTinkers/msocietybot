import Composer from 'telegraf/composer';

const bot = new Composer();
bot.on('new_chat_members', ctx => {
  ctx.message.new_chat_members.forEach(member => {
    ctx.reply(`Welcome ${member.first_name}!`);
  });
});

export default bot;
