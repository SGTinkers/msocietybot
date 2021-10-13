import { WelcomeBot } from './Welcome';
import { ScriberBot } from './Scriber';
import { Message as TelegramMessage } from 'telegraf/typings/core/types/typegram';
import { createTgMessage } from '../testUtils/test-data-factory';

describe('WelcomeBot', () => {
  const userGen = telegramUserGenerator();
  const member_1 = userGen.next().value;
  const member_2 = userGen.next().value;

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

  const assertBotDidNotSay = (messages: TelegramMessage[], match: RegExp | string) => {
    expect(messages).not.toEqual(
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
      const message = createTgMessage({
        message_id: -1,
        from: undefined,
        new_chat_members: [member_1],
      });
      sendMessage(message);
    });

    assertBotSaid(messages, /Would you mind doing a short intro of yourself/);
    assertBotDidNotSay(messages, /Welcome back/);
  });

  it('when more than one member joined', async () => {
    const messages = await runBot([ScriberBot, WelcomeBot], ({ sendMessage }) => {
      const message = createTgMessage({
        message_id: -1,
        from: undefined,
        new_chat_members: [member_1, member_2],
      });
      sendMessage(message);
    });

    assertBotSaid(messages, /Would you mind doing a short intro of yourself/);
    assertBotDidNotSay(messages, /Welcome back/);
  });

  it('show a different message when rejoining', async () => {
    const messages = await runBot([ScriberBot, WelcomeBot], ({ sendMessage }) => {
      const message = createTgMessage({
        message_id: -1,
        from: undefined,
        new_chat_members: [member_1],
      });
      sendMessage(message);
      sendMessage(message);
    });

    assertBotSaid(messages, /Welcome back/);
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
