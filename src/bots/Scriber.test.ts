import { ScriberBot } from './Scriber';
import { Message as TelegramMessage, User as TelegramUser } from 'telegram-typings';
import { User } from '../entity/User';

describe('Scriber', () => {
  it('insert user into db', async () => {
    const userAbu: TelegramUser = {
      id: 2,
      is_bot: false,
      first_name: 'Abu',
      last_name: 'Bakr',
      username: 'abu_bakr',
    };
    const { entityManager } = await runBot([ScriberBot], ({ sendMessage }) => {
      const newMemberMessage: TelegramMessage = {
        message_id: -1,
        chat: {
          id: -100000,
          type: 'group',
        },
        date: new Date().getTime(),
        new_chat_members: [userAbu],
      };
      sendMessage(newMemberMessage);
    });

    const users = await entityManager.find(User);

    expect(users.length).toEqual(1);
    expect(users[0]).toStrictEqual(
      expect.objectContaining({
        id: userAbu.id,
        firstName: userAbu.first_name,
        lastName: userAbu.last_name,
        username: userAbu.username,
      }),
    );
    expect(users[0].createdAt).not.toBeNull();
    expect(users[0].updatedAt).not.toBeNull();
  });
});
