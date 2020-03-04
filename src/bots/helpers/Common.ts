import Composer from 'telegraf/composer';

// This file adds custom functions to the context
const bot = new Composer();
bot.use((ctx, next) => {
  ctx.replyToMessage = (text, message_id) => {
    return ctx.reply(text, { reply_to_message_id: message_id });
  };
  next();
});

export { bot as CommonHelper };
