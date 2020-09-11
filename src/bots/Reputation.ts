import Composer from 'telegraf/composer';
import { EntityManager } from 'typeorm';
import { Reputation, voteQuota, voteQuotaDuration, defaultVoteValue } from '../entity/Reputation';
import { Chat as TelegramChat, Message as TelegramMessage, User as TelegramUser } from 'telegram-typings';

const bot = new Composer();

bot.hears(/thank you|thanks|👍|💯|👆|🆙|🔥/i, async ctx => {
  if (ctx.message.reply_to_message !== undefined) {
    const sender = ctx.message.from;
    const recipient = ctx.message.reply_to_message.from;
    const canVote = await Reputation.isAllowedToVote(ctx.entityManager, sender);

    // Can't vote for yourself :)
    if (recipient.id === sender.id) {
      await ctx.reply('Good try there but nope. 🙃', { reply_to_message_id: ctx.message.message_id });
    }
    // Can't vote for the bot.
    else if (recipient.id === ctx.botInfo.id) {
      // eslint-disable-next-line quotes
      await ctx.reply("🙂 I'm flattered but there's no point in licking my boots.", {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    // Does user have enough votes in their quota to give out?
    else if (!canVote) {
      const { nextVote } = await Reputation.getVoteQuota(ctx.entityManager, ctx.message.from);

      await ctx.replyWithMarkdown(
        `You have already used up your vote quota of ${voteQuota} for the past ${voteQuotaDuration} hours. Please try again later!\nYou will receive a new vote in *${nextVote.hours} hours* and *${nextVote.minutes} minutes*`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
    // Can't vote for bots
    else if (!recipient.is_bot && canVote) {
      await insertReputation(ctx.entityManager, sender, recipient, ctx.chat, ctx.message, defaultVoteValue);
      const senderRep = await Reputation.getLocalReputation(ctx.entityManager, sender, ctx.chat);
      const recipientRep = await Reputation.getLocalReputation(ctx.entityManager, recipient, ctx.chat);
      await ctx.replyWithMarkdown(
        `*${sender.first_name}* (${senderRep}) has increased reputation of *${recipient.first_name}* (${recipientRep})`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
  }
});

bot.hears(/👎|👇|🔽|\bboo(o*)\b|\beww(w*)\b/i, async ctx => {
  if (ctx.message.reply_to_message !== undefined) {
    const sender = ctx.message.from;
    const recipient = ctx.message.reply_to_message.from;
    const canVote = await Reputation.isAllowedToVote(ctx.entityManager, sender);

    // Can't vote for yourself :)
    if (recipient.id === sender.id) {
      await ctx.replyWithMarkdown('Are you _ok_?', { reply_to_message_id: ctx.message.message_id });
    }
    // Can't vote for the bot.
    else if (recipient.id === ctx.botInfo.id) {
      // eslint-disable-next-line quotes
      await ctx.reply('🙂 Excuse me?', {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    // Does user have enough votes in their quota to give out?
    else if (!canVote) {
      const { nextVote } = await Reputation.getVoteQuota(ctx.entityManager, ctx.message.from);

      await ctx.replyWithMarkdown(
        `You have already used up your vote quota of ${voteQuota} for the past ${voteQuotaDuration} hours. Please try again later!\nYou will receive a new vote in *${nextVote.hours} hours* and *${nextVote.minutes} minutes*`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
    // Can't vote for bots
    else if (!recipient.is_bot && canVote) {
      await insertReputation(ctx.entityManager, sender, recipient, ctx.chat, ctx.message, defaultVoteValue * -1);
      const senderRep = await Reputation.getLocalReputation(ctx.entityManager, sender, ctx.chat);
      const recipientRep = await Reputation.getLocalReputation(ctx.entityManager, recipient, ctx.chat);
      await ctx.replyWithMarkdown(
        `*${sender.first_name}* (${senderRep}) has decreased reputation of *${recipient.first_name}* (${recipientRep})`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
  }
});

bot.command('vote_quota', async ctx => {
  const { nextVote, votesGiven } = await Reputation.getVoteQuota(ctx.entityManager, ctx.message.from);

  if (votesGiven >= voteQuota) {
    await ctx.replyWithMarkdown(
      `You have used your *${voteQuota}* votes in the last *${voteQuotaDuration}* hour window. \nYou will receive a new vote in *${nextVote.hours} hours* and *${nextVote.minutes} minutes*`,
      { reply_to_message_id: ctx.chat.title ? ctx.message.message_id : null },
    );
  } else {
    const remainingQuota = voteQuota - votesGiven;
    let msg = `You have ${remainingQuota} out of ${voteQuota} votes remaining.`;
    if (nextVote) {
      msg += `\nYou will receive a new vote in *${nextVote.hours} hours* and *${nextVote.minutes} minutes*`;
    }
    await ctx.replyWithMarkdown(msg, { reply_to_message_id: ctx.chat.title ? ctx.message.message_id : null });
  }
});

bot.command('reputation', async ctx => {
  const globalScore = await Reputation.getGlobalReputation(ctx.entityManager, ctx.message.from);
  let msg = `*${ctx.message.from.first_name}*, `;
  if (ctx.chat.title) {
    const localScore = await Reputation.getLocalReputation(ctx.entityManager, ctx.message.from, ctx.chat);
    msg += `your reputation in this chat *(${ctx.chat.title})* is: *(${localScore})*\n`;
  }
  msg += `Your total reputation is *(${globalScore})*.`;
  await ctx.replyWithMarkdown(msg, {
    reply_to_message_id: ctx.chat.title ? ctx.message.message_id : null,
  });
});

const insertReputation = async (
  entityManager: EntityManager,
  sender: TelegramUser,
  recipient: TelegramUser,
  telegramChat: TelegramChat,
  telegramMessage: TelegramMessage,
  value,
) => {
  const newReputation = entityManager.create(Reputation, {
    fromUser: { id: sender.id.toString() },
    toUser: { id: recipient.id.toString() },
    message: { id: telegramMessage.message_id.toString(), chat: { id: telegramChat.id.toString() } },
    chat: { id: telegramChat.id.toString() },
    value,
  });
  await entityManager.save(Reputation, newReputation);
};

export { bot as ReputationBot };
