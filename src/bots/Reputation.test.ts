import { ReputationBot } from './Reputation';
import { Message as TelegramMessage, User as TelegramUser, Chat as TelegramChat } from 'telegram-typings';
import { Reputation } from '../entity/Reputation';

describe('ReputationBot', () => {
  const userGen = telegramUserGenerator();
  const senderUser = userGen.next().value;
  const recipientUser = userGen.next().value;
  const thisChat = createTelegramChat();

  describe('increases reputation', () => {
    const mainMessage: TelegramMessage = createTelegramMessage(
      thisChat,
      recipientUser,
      'amazingly interesting message sent by me!',
    );

    const assert = async msg => {
      const reputations = await entityManager.find(Reputation);

      expect(reputations.length).toEqual(1);
      expect(reputations[0]).toStrictEqual(
        expect.objectContaining({
          from_user: senderUser.id,
          to_user: recipientUser.id, // Not sure about this one
          message: msg.message_id,
          chat: thisChat.id,
          value: 1,
        }),
      );
      expect(reputations[0].createdAt).not.toBeNull();
      expect(reputations[0].updatedAt).not.toBeNull();
    };

    // Testing main tokens:
    // /thank you|thanks|👍|💯|👆|🆙|🔥/
    it('when user replies "thank you" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, 'thank you', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "thanks" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, 'thanks', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "👍" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '👍', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "💯" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '💯', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "👆" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '👆', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "🆙" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '🆙', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "🔥" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '🔥', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });

    // Testing other edge cases
    it('when user replies "thanks" + other things to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, 'thanks', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "👍🏽" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '👍🏽', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    it('when user replies "👍🏻" to another user message', async () => {
      const triggerMessage: TelegramMessage = createTelegramReply(thisChat, senderUser, '👍🏻', mainMessage);

      await runBot([ReputationBot], ({ sendMessage }) => {
        sendMessage(mainMessage);
        sendMessage(triggerMessage);
      });

      await assert(triggerMessage);
    });
    // it('when user has enough votes in their quota', () => { });
  });

  // describe('decreases reputation', () => {
  //   const mainMessage: TelegramMessage = createTelegramMessage(
  //     thisChat,
  //     recipientUser,
  //     'terribly bad message shared by me',
  //   );

  //   const assert = async msg => {
  //     const reputations = await entityManager.find(Reputation);

  //     expect(reputations.length).toEqual(1);
  //     expect(reputations[0]).toStrictEqual(
  //       expect.objectContaining({
  //         from_user: senderUser.id,
  //         to_user: recipientUser.id,
  //         message: msg.message_id,
  //         chat: thisChat.id,
  //         value: -1,
  //       }),
  //     );
  //     expect(reputations[0].createdAt).not.toBeNull();
  //     expect(reputations[0].updatedAt).not.toBeNull();
  //   };
  // });

  // describe('does not change reputation', () => {
  //   it('when a user replies to themselves', () => { });
  //   it('when a user replies to another bot', () => { });
  //   it('when a user replies to this bot', () => { });
  // });
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
    is_bot: false,
    first_name: 'Uthman',
    last_name: 'Ibn Affan',
    username: 'uthman_affan',
  };
}

function createTelegramChat(typeOrUser?: string | TelegramUser): TelegramChat {
  const fields: Record<string, string | number> = {};
  if (typeof typeOrUser === 'string') {
    fields['type'] = typeOrUser;
  } else if (typeOrUser) {
    fields['id'] = typeOrUser.id;
    fields['first_name'] = typeOrUser.first_name;
    fields['last_name'] = typeOrUser.last_name;
    fields['username'] = typeOrUser.username;
    fields['type'] = 'private';
  }

  if (fields['type'] !== 'private') {
    fields['title'] = 'Some chat title';
  }

  return {
    id: -10000,
    type: 'group',
    ...fields,
  };
}

let messageId = 1;

function createTelegramMessage(
  chat: TelegramChat = createTelegramChat(),
  user: TelegramUser,
  text: string,
): TelegramMessage {
  return {
    message_id: messageId++,
    date: new Date().getTime(),
    chat: chat,
    from: user,
    text,
  };
}

function createTelegramReply(
  chat: TelegramChat = createTelegramChat(),
  user: TelegramUser,
  text: string,
  reply_to_message: TelegramMessage,
): TelegramMessage {
  return {
    message_id: messageId++,
    date: new Date().getTime(),
    chat: chat,
    from: user,
    reply_to_message,
    text,
  };
}
