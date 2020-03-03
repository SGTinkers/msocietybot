import { ScriberBot } from './Scriber';
import { Message as TelegramMessage, User as TelegramUser, Chat as TelegramChat } from 'telegram-typings';
import { User } from '../entity/User';
import { Chat } from '../entity/Chat';

describe('Scriber', () => {
  it('insert user into db if does not exists', async () => {
    const userAbu = createTelegramUser();
    await runBot([ScriberBot], ({ sendMessage }) => {
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

  it('update user in db if exists', async () => {
    const existingUser = await createUserInDb();

    const userAbu = createTelegramUser();
    await runBot([ScriberBot], ({ sendMessage }) => {
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
    expect(users[0].createdAt).toEqual(existingUser.createdAt);
    expect(users[0].updatedAt).not.toEqual(existingUser.updatedAt);
  });

  it('insert chat into db if does not exists', async () => {
    const telegramChat = createTelegramChat();
    await runBot([ScriberBot], ({ sendMessage }) => {
      const message: TelegramMessage = {
        message_id: -1,
        chat: telegramChat,
        date: new Date().getTime(),
      };
      sendMessage(message);
    });

    const chats = await entityManager.find(Chat);

    expect(chats.length).toEqual(1);
    expect(chats[0]).toStrictEqual(
      expect.objectContaining({
        id: telegramChat.id,
        type: telegramChat.type,
      }),
    );
    expect(chats[0].createdAt).not.toBeNull();
    expect(chats[0].updatedAt).not.toBeNull();
  });

  it('update chat in db if exists', async () => {
    const existingChat = await createChatInDb('group');

    const telegramChat = createTelegramChat();
    await runBot([ScriberBot], ({ sendMessage }) => {
      const message: TelegramMessage = {
        message_id: -1,
        chat: telegramChat,
        date: new Date().getTime(),
      };
      sendMessage(message);
    });

    const chats = await entityManager.find(Chat);

    expect(chats.length).toEqual(1);
    expect(chats[0]).toStrictEqual(
      expect.objectContaining({
        id: existingChat.id,
        type: existingChat.type,
      }),
    );
    expect(chats[0].createdAt).toEqual(existingChat.createdAt);
    expect(chats[0].updatedAt).toEqual(existingChat.updatedAt);
  });
});

async function createUserInDb() {
  try {
    const user = entityManager.create(User, {
      id: 2,
      firstName: 'AbuBakr',
      lastName: '',
      username: null,
    });
    return await entityManager.save(user);
  } catch (e) {
    console.error(e);
  }
}

async function createChatInDb(type: string) {
  try {
    const chat = entityManager.create(Chat, {
      id: -10000,
      type,
    });
    return await entityManager.save(chat);
  } catch (e) {
    console.error(e);
  }
}

function createTelegramUser(): TelegramUser {
  return {
    id: 2,
    is_bot: false,
    first_name: 'Abu',
    last_name: 'Bakr',
    username: 'abu_bakr',
  };
}

function createTelegramChat(): TelegramChat {
  return {
    id: -10000,
    type: 'group',
  };
}
