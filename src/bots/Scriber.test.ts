import { ScriberBot } from './Scriber';
import { Message as TelegramMessage, User as TelegramUser, Chat as TelegramChat } from 'telegram-typings';
import { User } from '../entity/User';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';

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

  it('insert chat and user into db if does not exists', async () => {
    const telegramChat = createTelegramChat(createTelegramUser());
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

    const users = await entityManager.find(User);

    expect(users.length).toEqual(1);
    expect(users[0]).toStrictEqual(
      expect.objectContaining({
        id: telegramChat.id,
        firstName: telegramChat.first_name,
        lastName: telegramChat.last_name,
        username: telegramChat.username,
      }),
    );
    expect(users[0].createdAt).not.toBeNull();
    expect(users[0].updatedAt).not.toBeNull();
  });

  it('insert message into db if does not exists', async () => {
    const telegramMessage = createTelegramMessage();
    telegramMessage.text = 'hello world';
    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message);

    expect(messages.length).toEqual(1);
    expect(messages[0]).toStrictEqual(
      expect.objectContaining({
        id: telegramMessage.message_id,
        unixtime: telegramMessage.date,
        text: telegramMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
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
  return {
    id: -10000,
    type: 'group',
    ...fields,
  };
}

function createTelegramMessage(
  chat: TelegramChat = createTelegramChat(),
  user: TelegramUser = createTelegramUser(),
): TelegramMessage {
  return {
    message_id: 10,
    date: new Date().getTime(),
    chat: chat,
    from: user,
  };
}
