import { WelcomeBot } from './Welcome';
import { ScriberBot } from './Scriber';

import { Message as TelegramMessage, User as TelegramUser, Chat as TelegramChat } from 'telegram-typings';

describe('WelcomeBot', () => {
  const userGen = telegramUserGenerator();
  const member_1 = userGen.next().value;
  const member_2 = userGen.next().value;
  // const botUser = userGen.next().value;

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

  it('when one new member joined', async () => {
    const messages = await runBot([ScriberBot, WelcomeBot], ({ sendMessage }) => {
      const message: TelegramMessage = {
        message_id: -1,
        chat: createTelegramChat(),
        date: new Date().getTime(),
        new_chat_members: [member_1],
      };
      sendMessage(message);
    });

    assertBotSaid(messages, /Would you mind doing a short intro of yourself/);
  });

  it('when more than one member joined', async () => {
    const messages = await runBot([ScriberBot, WelcomeBot], ({ sendMessage }) => {
      const message: TelegramMessage = {
        message_id: -1,
        chat: createTelegramChat(),
        date: new Date().getTime(),
        new_chat_members: [member_1, member_2],
      };
      sendMessage(message);
    });

    assertBotSaid(messages, /Would you mind doing a short intro of yourself/);
  });

  // it('when a bot is added', () => {});

  // it('when more than one members return', () => {});

  // it('when a bot and a member joined', () => {});
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
