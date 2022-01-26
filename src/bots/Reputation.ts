import { Composer } from 'telegraf';
import { EntityManager } from 'typeorm';
import { Reputation, voteQuota, voteQuotaDuration, defaultVoteValue } from '../entity/Reputation';
import { User } from '../entity/User';
import {
  Chat as TelegramChat,
  User as TelegramUser,
  Message as TelegramMessage,
} from 'telegraf/typings/core/types/typegram';
import { MsocietyBotContext } from '../context';

const bot = new Composer<MsocietyBotContext>();

async function upvote(ctx: MsocietyBotContext, sender: TelegramUser, recipient: TelegramUser) {
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

async function downvote(ctx: MsocietyBotContext, sender: TelegramUser, recipient: TelegramUser) {
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
bot.hears(/thank you|thanks|👍|💯|👆|🆙|🔥/i, async ctx => {
  const mentionEntities =
    ctx.message?.entities?.filter(entity => ['mention', 'text_mention'].includes(entity.type)) || [];
  if (ctx.message.reply_to_message !== undefined && mentionEntities.length) {
    if (mentionEntities.length > 1) {
      await ctx.reply('Tag only one user at a time to increase rep!', {
        reply_to_message_id: ctx.message.message_id,
      });
      return;
    }
    // get the mention metadata
    const entity = mentionEntities[0];
    if (entity.type === 'mention') {
      //get username from text using metadata
      const username = ctx.message.text.substr(entity.offset + 1, entity.length - 1);

      // check if mentioned user is same as user being replied to
      if (username !== ctx.message.reply_to_message.from.username) {
        await ctx.reply('Reply or Tag only one user at a time to increase rep!', {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      await upvote(ctx, ctx.message.from, ctx.message.reply_to_message.from);
    } else if (entity.type === 'text_mention') {
      if (entity.user.username !== ctx.message.reply_to_message.from.username) {
        await ctx.reply('Reply or Tag only one user at a time to increase rep!', {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      await upvote(ctx, ctx.message.from, entity.user);
    }
  } else if (ctx.message.reply_to_message !== undefined) {
    await upvote(ctx, ctx.from, ctx.message.reply_to_message.from);
  } else if (
    // check if there is a mention
    mentionEntities.length
  ) {
    if (mentionEntities.length > 1) {
      await ctx.reply('Tag only one user at a time to increase rep!', {
        reply_to_message_id: ctx.message.message_id,
      });
      return;
    }
    // get the mention metadata
    const entity = mentionEntities[0];

    if (entity.type === 'mention') {
      //get username from text using metadata
      const username = ctx.message.text.substr(entity.offset + 1, entity.length - 1);
      // telegram api doesn't provide resolving user by username so we depend on our db to get userID
      const recipientId = (await User.getUserByUsername(ctx.entityManager, username))?.id;
      if (!recipientId) {
        // eslint-disable-next-line quotes
        await ctx.reply("Can't find user in DB. Did they change their username?", {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      const recipient = await ctx.getChatMember(+recipientId);
      await upvote(ctx, ctx.message.from, recipient.user);
    } else if (entity.type === 'text_mention') {
      await upvote(ctx, ctx.message.from, entity.user);
    }
  }
});

bot.hears(/👎|👇|🔽|\bboo(o*)\b|\beww(w*)\b/i, async ctx => {
  const mentionEntities =
    ctx.message?.entities?.filter(entity => ['mention', 'text_mention'].includes(entity.type)) || [];
  if (ctx.message.reply_to_message !== undefined && mentionEntities.length) {
    if (mentionEntities.length > 1) {
      await ctx.reply('Tag only one user at a time to increase rep!', {
        reply_to_message_id: ctx.message.message_id,
      });
      return;
    }
    // get the mention metadata
    const entity = mentionEntities[0];
    if (entity.type === 'mention') {
      //get username from text using metadata
      const username = ctx.message.text.substr(entity.offset + 1, entity.length - 1);

      // check if mentioned user is same as user being replied to
      if (username !== ctx.message.reply_to_message.from.username) {
        await ctx.reply('Reply or Tag only one user at a time to increase rep!', {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      await downvote(ctx, ctx.message.from, ctx.message.reply_to_message.from);
    } else if (entity.type === 'text_mention') {
      if (entity.user.username !== ctx.message.reply_to_message.from.username) {
        await ctx.reply('Reply or Tag only one user at a time to increase rep!', {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      await downvote(ctx, ctx.message.from, entity.user);
    }
  } else if (ctx.message.reply_to_message !== undefined) {
    await downvote(ctx, ctx.from, ctx.message.reply_to_message.from);
  } else if (
    // check if there is a mention
    mentionEntities.length
  ) {
    if (mentionEntities.length > 1) {
      await ctx.reply('Tag only one user at a time to increase rep!', {
        reply_to_message_id: ctx.message.message_id,
      });
      return;
    }
    // get the mention metadata
    const entity = mentionEntities[0];

    if (entity.type === 'mention') {
      //get username from text using metadata
      const username = ctx.message.text.substr(entity.offset + 1, entity.length - 1);
      // telegram api doesn't provide resolving user by username so we depend on our db to get userID
      const recipientId = (await User.getUserByUsername(ctx.entityManager, username))?.id;
      if (!recipientId) {
        // eslint-disable-next-line quotes
        await ctx.reply("Can't find user in DB. Did they change their username?", {
          reply_to_message_id: ctx.message.message_id,
        });
        return;
      }
      const recipient = await ctx.getChatMember(+recipientId);
      await downvote(ctx, ctx.message.from, recipient.user);
    } else if (entity.type === 'text_mention') {
      await downvote(ctx, ctx.message.from, entity.user);
    }
  }
});

bot.command('vote_quota', async ctx => {
  const { nextVote, votesGiven } = await Reputation.getVoteQuota(ctx.entityManager, ctx.message.from);

  if (ctx.chat && (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup')) {
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
      await ctx.replyWithMarkdown(msg, { reply_to_message_id: ctx.chat?.title ? ctx.message.message_id : null });
    }
  }
});

bot.command('reputation', async ctx => {
  const globalScore = await Reputation.getGlobalReputation(ctx.entityManager, ctx.message.from);
  let msg = `*${ctx.message.from.first_name}*, `;
  if ((ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') && ctx.chat.title) {
    const localScore = await Reputation.getLocalReputation(ctx.entityManager, ctx.message.from, ctx.chat);
    msg += `your reputation in this chat *(${ctx.chat?.title})* is: *(${localScore})*\n`;
  }
  msg += `Your total reputation is *(${globalScore})*.`;
  await ctx.replyWithMarkdown(msg, {
    reply_to_message_id: ctx.chat.type === 'group' || ctx.chat.type === 'supergroup' ? ctx.message.message_id : null,
  });
});

bot.command('update_my_username', async ctx => {
  const newUsername = ctx.from.username;
  const current = await User.getUserByUserID(ctx.entityManager, ctx.from.id.toString());
  await User.updateUserByID(
    ctx.entityManager,
    {
      ...current,
      username: newUsername,
      updatedAt: new Date(),
    },
    current.id,
  );
  await ctx.reply('Username updated!', {
    reply_to_message_id: ctx.message.message_id,
  });
});

const insertReputation = async (
  entityManager: EntityManager,
  sender: TelegramUser,
  recipient: TelegramUser,
  telegramChat: TelegramChat,
  telegramMessage: TelegramMessage,
  value: number,
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
