import { ReputationBot } from './Reputation';
import { ScriberBot } from './Scriber';
import { Message as TelegramMessage } from 'telegraf/typings/core/types/typegram';
import { Reputation, voteQuota } from '../entity/Reputation';
import { createTgGroupChat, createTgTextMessage, idGenerator } from '../testUtils/test-data-factory';

describe('ReputationBot', () => {
  const userGen = telegramUserGenerator();
  const senderUser = userGen.next().value;
  const recipientUser = userGen.next().value;
  const botUser = userGen.next().value;
  const thisChat = createTgGroupChat();

  const assertBotSaid = (messages: TelegramMessage[], match: RegExp | string) => {
    expect(messages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          from: expect.objectContaining({
            is_bot: true,
          }),
          text: expect.stringMatching(match),
        }),
      ]),
    );
  };

  const assertBotDidNotReply = (messages: TelegramMessage[]) => {
    expect(messages).toEqual(
      expect.not.arrayContaining([
        expect.not.objectContaining({
          from: expect.not.objectContaining({
            is_bot: true,
          }),
        }),
      ]),
    );
  };

  describe('increases reputation', () => {
    const mainMessage = createTgTextMessage('amazingly interesting message sent by me!', {
      chat: thisChat,
      from: recipientUser,
      reply_to_message: undefined,
    });

    const assert = async msg => {
      const reputations = await entityManager.find(Reputation, {
        relations: ['chat', 'message', 'fromUser', 'toUser'],
      });

      expect(reputations.length).toEqual(1);
      expect(reputations[0]).toStrictEqual(
        expect.objectContaining({
          value: 1,
          // Vote recipient
          toUser: expect.objectContaining({
            id: `${msg.reply_to_message.from.id}`,
            username: msg.reply_to_message.from.username,
          }),
          // Vote sender
          fromUser: expect.objectContaining({
            id: `${msg.from.id}`,
            username: msg.from.username,
          }),
          // Where it happened
          chat: expect.objectContaining({
            id: `${msg.chat.id}`,
          }),
          // The message that created the vote.
          message: expect.objectContaining({
            id: `${msg.message_id}`,
          }),
        }),
      );
      expect(reputations[0].createdAt).not.toBeNull();
      expect(reputations[0].updatedAt).not.toBeNull();
    };

    // Testing main tokens:
    // /thank you|thanks|👍|💯|👆|🆙|🔥/
    it('when user replies "thank you" to another user message', async () => {
      const triggerMessage = createTgTextMessage('thank you', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "thanks" to another user message', async () => {
      const triggerMessage = createTgTextMessage('thanks', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👍" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👍', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "💯" to another user message', async () => {
      const triggerMessage = createTgTextMessage('💯', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👆" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👆', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "🆙" to another user message', async () => {
      const triggerMessage = createTgTextMessage('🆙', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "🔥" to another user message', async () => {
      const triggerMessage = createTgTextMessage('🔥', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    // Testing other edge cases
    it('when user replies "thanks" + other things to another user message', async () => {
      const triggerMessage = createTgTextMessage('123zxcthanksas-flj', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });
    // Case insensitive should work
    it('when user replies "ThAnKs" to another user message', async () => {
      const triggerMessage = createTgTextMessage('ThAnKs', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👍🏽" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👍🏽', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👍🏻" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👍🏻', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /increased reputation/);
      await assert(triggerMessage);
    });
    // it('when user has enough votes in their quota', () => { });
  });

  describe('decreases reputation', () => {
    const mainMessage = createTgTextMessage('terribly bad message shared by me', {
      chat: thisChat,
      from: recipientUser,
      reply_to_message: undefined,
    });

    const assert = async msg => {
      const reputations = await entityManager.find(Reputation, {
        relations: ['chat', 'message', 'fromUser', 'toUser'],
      });

      expect(reputations.length).toEqual(1);
      expect(reputations[0]).toStrictEqual(
        expect.objectContaining({
          value: -1,
          // Vote recipient
          toUser: expect.objectContaining({
            id: `${msg.reply_to_message.from.id}`,
            username: msg.reply_to_message.from.username,
          }),
          // Vote sender
          fromUser: expect.objectContaining({
            id: `${msg.from.id}`,
            username: msg.from.username,
          }),
          // Where it happened
          chat: expect.objectContaining({
            id: `${msg.chat.id}`,
          }),
          // The message that created the vote.
          message: expect.objectContaining({
            id: `${msg.message_id}`,
          }),
        }),
      );
      expect(reputations[0].createdAt).not.toBeNull();
      expect(reputations[0].updatedAt).not.toBeNull();
    };

    // Testing main tokens:
    // /👎|👇|🔽|boo|eww/
    it('when user replies "👎" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👎', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👇" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👇', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "🔽" to another user message', async () => {
      const triggerMessage = createTgTextMessage('🔽', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "boo" to another user message', async () => {
      const triggerMessage = createTgTextMessage('boo', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });
      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "booooo" to another user message', async () => {
      const triggerMessage = createTgTextMessage('booooo', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });
      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });
      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "eww" to another user message', async () => {
      const triggerMessage = createTgTextMessage('eww', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "ewwww" to another user message', async () => {
      const triggerMessage = createTgTextMessage('eww', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    // Testing other edge cases
    it('when user replies "👎🏾" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👎🏾', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    it('when user replies "👇🏾" to another user message', async () => {
      const triggerMessage = createTgTextMessage('👇🏾', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });
      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /decreased reputation/);
      await assert(triggerMessage);
    });

    // Case insensitive should work
    it('when user replies "bOo" to another user message', async () => {
      const triggerMessage = createTgTextMessage('bOo', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      assertBotSaid(messages, /.*?/);
      await assert(triggerMessage);
    });

    it('when user replies "boo" + other things to another user message', async () => {
      const triggerMessage = createTgTextMessage('boooo!', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot(
        [ScriberBot, ReputationBot],
        ({ sendMessage }) => {
          sendMessage(mainMessage);
          sendMessage(triggerMessage);
        },
        { timeout: 800 },
      );

      assertBotSaid(messages, /.*?/);
      await assert(triggerMessage);
    });
  });

  describe('does not change reputation', () => {
    const assert = async rowCount => {
      const reputations = await entityManager.find(Reputation);
      expect(reputations.length).toEqual(rowCount);
    };

    it('when a user sends "thanks" to themselves', async () => {
      const mainMessage = createTgTextMessage('i am so cool', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('thanks', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotSaid(messages, /.*?/);
      await assert(0);
    });

    it('when a user sends "thanks" to the bot', async () => {
      const mainMessage = createTgTextMessage('i am so cool', {
        chat: thisChat,
        from: botUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('thanks', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotSaid(messages, /.*?/);
      await assert(0);
    });

    it('when a user sends "boo" to themselves', async () => {
      const mainMessage = createTgTextMessage('i am so cool', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('boo', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotSaid(messages, /.*?/);
      await assert(0);
    });

    it('when a user sends "boo" to the bot', async () => {
      const mainMessage = createTgTextMessage('i am so cool', {
        chat: thisChat,
        from: botUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('boo', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotSaid(messages, /.*?/);
      await assert(0);
    });

    it('when a user exceeds quota', async () => {
      const idGen = idGenerator();
      const mainMessage = createTgTextMessage('i am so cool', {
        chat: thisChat,
        from: recipientUser,
        reply_to_message: undefined,
      });
      const replies: TelegramMessage[] = [];

      // Assuming quota is 5. Voting 6 times would only allow 5 votes in.
      for (let i = 0; i < voteQuota + 1; i++) {
        replies.push(
          createTgTextMessage('thanks', {
            chat: thisChat,
            from: senderUser,
            reply_to_message: mainMessage,
            id: idGen.next().value,
          }),
        );
      }

      const messages = await runBot(
        [ScriberBot, ReputationBot],
        ({ sendMessage }) => {
          sendMessage(mainMessage);
          replies.forEach(sendMessage);
        },
        { timeout: 500 },
      );

      assertBotSaid(messages, /.*?/);
      await assert(voteQuota);
    });

    it('when user replies "boot" to another user message', async () => {
      const mainMessage = createTgTextMessage('Java framework', {
        chat: thisChat,
        from: recipientUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('springboot', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotDidNotReply(messages);
      await assert(0);
    });

    it('when user replies "boooot" to another user message', async () => {
      const mainMessage = createTgTextMessage('What happend?', {
        chat: thisChat,
        from: recipientUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('it wont boooot', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotDidNotReply(messages);
      await assert(0);
    });

    it('when user replies "newww" to another user message', async () => {
      const mainMessage = createTgTextMessage('Is it your new PC?', {
        chat: thisChat,
        from: recipientUser,
        reply_to_message: undefined,
      });
      const replyMessage = createTgTextMessage('yes. It is so newww', {
        chat: thisChat,
        from: senderUser,
        reply_to_message: mainMessage,
      });

      const messages = await runBot([ScriberBot, ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(replyMessage);
      });

      assertBotDidNotReply(messages);
      await assert(0);
    });
  });
});

function* telegramUserGenerator(): Generator {
  yield {
    id: 1,
    is_bot: false,
    first_name: 'Abu',
    last_name: 'Bakr',
    username: 'abu_bakr',
  };
  yield {
    id: 2,
    is_bot: false,
    first_name: 'Omar',
    last_name: 'Al-Faruq',
    username: 'omar_alfaruq',
  };
  yield {
    id: 3,
    is_bot: true,
    first_name: 'Uthman',
    last_name: 'Ibn Affan',
    username: 'uthman_affan_bot',
  };
}
