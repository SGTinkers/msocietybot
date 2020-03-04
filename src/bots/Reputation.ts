import Composer from 'telegraf/composer';
// import { EntityManager } from 'typeorm';
// import { Reputation } from '../entity/Reputation';
// import { User as TelegramUser, Chat as TelegramChat, Message as TelegramMessage } from 'telegram-typings';

const bot = new Composer();

bot.hears(/thank you|thanks|👍|💯|👆|🆙/, ctx => {
  if (ctx.message.reply_to_message !== undefined) {
    const sender = ctx.message.from;
    const recipient = ctx.message.reply_to_message.from;

    if (sender.id === recipient.id) {
      ctx.replyToMessage('Good try there but nope. 🙃', ctx.message.message_id);
    }

    if (recipient.id === ctx.botInfo.id) {
      // eslint-disable-next-line quotes
      ctx.replyToMessage("🙂 I'm flattered but there's no point in licking my boots.", ctx.message.message_id);
    }
  }

  // await addReputation(ctx.entityManager, ctx.message.reply_to_message.from, ctx.chat, ctx.message);
});

// const addReputation = async (
//   entityManager: EntityManager,
//   recipient: TelegramUser,
//   telegramChat: TelegramChat,
//   telegramMessage: TelegramMessage,
// ) => {
//   const newReputation = entityManager.create(Reputation.name, {
//     user: recipient.id,
//     message: telegramMessage.message_id,
//     chat: telegramChat.id,
//   });
//   await entityManager.save(newReputation);
// };

export { bot as ReputationBot };
