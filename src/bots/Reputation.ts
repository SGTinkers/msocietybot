import Composer from 'telegraf/composer';
import { EntityManager, LessThan } from 'typeorm';
import { Reputation } from '../entity/Reputation';
import { User as TelegramUser, Chat as TelegramChat, Message as TelegramMessage } from 'telegram-typings';
// import { User } from '../entity/User';
// import { Chat } from '../entity/Chat';

const bot = new Composer();

// TODO: Move this to some config file.
const voteQuota = 3;
const voteQuotaDuration = 24;
const defaultVoteValue = 1;

bot.hears(/thank you|thanks|👍|💯|👆|🆙|🔥/, async ctx => {
  if (ctx.message.reply_to_message !== undefined) {
    const sender = ctx.message.from;
    const recipient = ctx.message.reply_to_message.from;
    const canVote = await isAllowedToVote(ctx.entityManager, sender);

    // Can't vote for yourself :)
    if (recipient.id === sender.id) {
      ctx.reply('Good try there but nope. 🙃', { reply_to_message_id: ctx.message.message_id });
    }
    // Can't vote for the bot.
    else if (recipient.id === ctx.botInfo.id) {
      // eslint-disable-next-line quotes
      ctx.reply("🙂 I'm flattered but there's no point in licking my boots.", {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    // Does user have enough votes in their quota to give out?
    else if (!canVote) {
      ctx.reply(
        `You have already used up your vote quota of ${voteQuota} for the past ${voteQuotaDuration} hours. Please try again later!\nUse /vote_quota to check your quota.`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
    // Can't vote for bots
    else if (!recipient.is_bot && canVote) {
      await insertReputation(ctx.entityManager, sender, recipient, ctx.chat, ctx.message, defaultVoteValue);
      const senderRep = await getReputationScore(ctx.entityManager, sender, ctx.chat);
      const recipientRep = await getReputationScore(ctx.entityManager, recipient, ctx.chat);
      ctx.replyWithMarkdown(
        `*${sender.first_name}* (${senderRep}) has increased reputation of *${recipient.first_name}* (${recipientRep})`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
  }
});

bot.hears(/👎|👇|🔽|boo|eww/, async ctx => {
  if (ctx.message.reply_to_message !== undefined) {
    const sender = ctx.message.from;
    const recipient = ctx.message.reply_to_message.from;
    const canVote = await isAllowedToVote(ctx.entityManager, sender);

    // Can't vote for yourself :)
    if (recipient.id === sender.id) {
      ctx.replyWithMarkdown('Are you _ok_?', { reply_to_message_id: ctx.message.message_id });
    }
    // Can't vote for the bot.
    else if (recipient.id === ctx.botInfo.id) {
      // eslint-disable-next-line quotes
      ctx.reply('🙂 Excuse me?', {
        reply_to_message_id: ctx.message.message_id,
      });
    }
    // Does user have enough votes in their quota to give out?
    else if (!canVote) {
      ctx.reply(
        `You have already used up your vote quota of ${voteQuota} for the past ${voteQuotaDuration} hours. Please try again later!\nUse /vote_quota to check your quota.`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
    // Can't vote for bots
    else if (!recipient.is_bot && canVote) {
      await insertReputation(ctx.entityManager, sender, recipient, ctx.chat, ctx.message, defaultVoteValue * -1);
      const senderRep = await getReputationScore(ctx.entityManager, sender, ctx.chat);
      const recipientRep = await getReputationScore(ctx.entityManager, recipient, ctx.chat);
      ctx.replyWithMarkdown(
        `*${sender.first_name}* (${senderRep}) has decreased reputation of *${recipient.first_name}* (${recipientRep})`,
        { reply_to_message_id: ctx.message.message_id },
      );
    }
  }
});

bot.command('vote_quota', async ctx => {
  const votes = await getRecentVotes(ctx.entityManager, ctx.message.from, voteQuotaDuration);
  if (votes.length > 0) {
    const lastVote = votes[0].createdAt;
    const nextVote = lastVote.setHours(lastVote.getHours() + voteQuotaDuration);
    const duration = getDuration(new Date(nextVote), new Date());

    if (votes.length >= voteQuota) {
      ctx.replyWithMarkdown(
        `You have used your *${voteQuota}* votes in the last *${voteQuotaDuration}* hour window. \nYou will receive a new vote in *${duration.hours} hours* and *${duration.minutes} minutes*`,
        { reply_to_message_id: ctx.chat.title ? ctx.message.message_id : null },
      );
    } else {
      const remainingQuota = voteQuota - votes.length;
      ctx.replyWithMarkdown(
        `You have ${remainingQuota} out of ${voteQuota} votes remaining. \nYou will receive a new vote in *${duration.hours} hours* and *${duration.minutes} minutes*`,
      );
    }
  }
});

bot.command('reputation', async ctx => {
  const globalScore = await getGlobalScore(ctx.entityManager, ctx.message.from);
  let msg = `*${ctx.message.from.first_name}*, `;
  if (ctx.chat.title) {
    const localScore = await getReputationScore(ctx.entityManager, ctx.message.from, ctx.chat);
    msg += `your reputation in this chat *(${ctx.chat.title})* is: *(${localScore})*\n`;
  }
  msg += `Your total reputation is *(${globalScore})*.`;
  ctx.replyWithMarkdown(msg, {
    reply_to_message_id: ctx.chat.title ? ctx.message.message_id : null,
  });
});

const getDuration = (start, end) => {
  const msDiff = start.getTime() - end.getTime();
  const minDiff = msDiff / 60000;
  const hourDiff = Math.floor(msDiff / 3600000);
  return {
    hours: hourDiff,
    minutes: Math.floor(minDiff - 60 * hourDiff),
  };
};

const getRecentVotes = async (entityManager: EntityManager, telegramUser: TelegramUser, hoursAgo: number) => {
  const now = new Date();
  const voteLimit = now.setHours(now.getHours() - hoursAgo);

  const reputations = await entityManager.find(Reputation, {
    where: {
      from_user_id: telegramUser.id,
      created_at: LessThan(voteLimit),
    },
  });

  return reputations;
};

const isAllowedToVote = async (entityManager: EntityManager, telegramUser: TelegramUser) => {
  const reputations = await getRecentVotes(entityManager, telegramUser, voteQuotaDuration);
  return reputations.length < voteQuota;
};

const getReputationScore = async (
  entityManager: EntityManager,
  telegramUser: TelegramUser,
  telegramChat: TelegramChat,
) => {
  const reputations = await entityManager.find(Reputation, {
    where: {
      to_user: telegramUser.id,
      chat: telegramChat.id,
    },
  });
  let score = 0;
  reputations.forEach(rep => (score += rep.value));
  return score;
};

const getGlobalScore = async (entityManager: EntityManager, telegramUser: TelegramUser) => {
  const reputations = await entityManager.find(Reputation, {
    where: {
      to_user: telegramUser.id,
    },
  });
  let score = 0;
  reputations.forEach(rep => (score += rep.value));
  return score;
};

const insertReputation = async (
  entityManager: EntityManager,
  sender: TelegramUser,
  recipient: TelegramUser,
  telegramChat: TelegramChat,
  telegramMessage: TelegramMessage,
  value,
) => {
  const newReputation = entityManager.create(Reputation.name, {
    from_user: sender.id,
    to_user: recipient.id,
    message: telegramMessage.message_id,
    chat: telegramChat.id,
    value,
  });
  await entityManager.save(Reputation.name, newReputation);
};

export { bot as ReputationBot };
