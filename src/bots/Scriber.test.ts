import { ScriberBot } from './Scriber';
import { User } from '../entity/User';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';
import { DeepPartial } from 'typeorm';
import {
  createTgUser,
  createTgGroupChat,
  createTgMessage,
  createTgPrivateChat,
  createTgTextMessage,
} from '../testUtils/test-data-factory';

describe('Scriber', () => {
  const assertMessageContains = async <E = {}>(containing: E, relations?: string[]) => {
    const messages = await entityManager.find(Message, { relations: relations ? relations : Object.keys(containing) });

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(expect.objectContaining(containing));
  };

  describe('insert user into db if does not exists', () => {
    const userAbu = createTgUser();

    const assert = async () => {
      const users = await entityManager.find(User);

      expect(users.length).toEqual(1);
      expect(users[0]).toEqual(
        expect.objectContaining({
          id: userAbu.id.toString(),
          firstName: userAbu.first_name,
          lastName: userAbu.last_name,
          username: userAbu.username,
        }),
      );
      expect(users[0].createdAt).not.toBeNull();
      expect(users[0].updatedAt).not.toBeNull();
    };

    it('from', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgTextMessage('', {
          message_id: -1,
          from: userAbu,
        });
        sendMessage(message);
      });

      await assert();
      await assertMessageContains({ sender: expect.objectContaining({ id: userAbu.id.toString() }) });
    });

    it('forward_from', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgTextMessage('', {
          message_id: -1,
          forward_from: userAbu,
        });
        sendMessage(message);
      });

      await assert();
      await assertMessageContains({ forwardFrom: expect.objectContaining({ id: userAbu.id.toString() }) });
    });

    it('new_chat_members', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgMessage({
          message_id: -1,
          from: undefined,
          new_chat_members: [userAbu],
        });
        sendMessage(message);
      });

      await assert();
      await assertMessageContains({ usersJoined: [expect.objectContaining({ id: userAbu.id.toString() })] });
    });

    it('left_chat_member', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgMessage({
          message_id: -1,
          from: undefined,
          left_chat_member: userAbu,
        });
        sendMessage(message);
      });

      await assert();
      await assertMessageContains({ userLeft: expect.objectContaining({ id: userAbu.id.toString() }) });
    });
  });

  it('update user in db if exists', async () => {
    const existingUser = await createUserInDb();

    const userAbu = createTgUser();
    await runBot([ScriberBot], ({ sendMessage }) => {
      const newMemberMessage = createTgMessage({
        message_id: -1,
        from: undefined,
        new_chat_members: [userAbu],
      });
      sendMessage(newMemberMessage);
    });

    const users = await entityManager.find(User);

    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(
      expect.objectContaining({
        id: userAbu.id.toString(),
        firstName: userAbu.first_name,
        lastName: userAbu.last_name,
        username: userAbu.username,
      }),
    );
    expect(users[0].createdAt).toEqual(existingUser.createdAt);
    expect(users[0].updatedAt).not.toEqual(existingUser.updatedAt);
  });

  describe('insert chat into db if does not exists', () => {
    const telegramChat = createTgGroupChat();

    const assert = async (totalChats = 1, chat = telegramChat) => {
      const chats = await entityManager.find(Chat);

      expect(chats.length).toEqual(totalChats);
      expect(chats[totalChats - 1]).toEqual(
        expect.objectContaining({
          id: chat.id.toString(),
          type: chat.type,
          title: chat.title,
        }),
      );
      expect(chats[totalChats - 1].createdAt).not.toBeNull();
      expect(chats[totalChats - 1].updatedAt).not.toBeNull();
    };

    it('chat', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgTextMessage('', {
          message_id: -1,
          chat: telegramChat,
        });
        sendMessage(message);
      });

      await assert();
      await assertMessageContains({ chat: expect.objectContaining({ id: telegramChat.id.toString() }) });
    });

    it('forward_from_chat', async () => {
      await runBot([ScriberBot], ({ sendMessage }) => {
        const chat = createTgGroupChat();
        chat.id = -100;
        chat.title = 'Some old chat title';
        const message = createTgTextMessage('', {
          message_id: -1,
          chat: chat,
          forward_from_chat: telegramChat,
        });
        sendMessage(message);
      });

      await assert(2);
      await assertMessageContains({ forwardFromChat: expect.objectContaining({ id: telegramChat.id.toString() }) });
    });

    it('private', async () => {
      const userAbu = createTgUser();
      const privateChat = createTgPrivateChat(userAbu);
      await runBot([ScriberBot], ({ sendMessage }) => {
        const message = createTgTextMessage('', {
          message_id: -1,
          chat: privateChat,
        });
        sendMessage(message);
      });

      await assertMessageContains(
        {
          chat: expect.objectContaining({ user: expect.objectContaining({ id: userAbu.id.toString() }) }),
        },
        ['chat', 'chat.user'],
      );
    });
  });

  it('update chat in db if exists', async () => {
    const existingChat = await createChatInDb('group');

    const telegramChat = createTgGroupChat();
    await runBot([ScriberBot], ({ sendMessage }) => {
      const message = createTgTextMessage('', {
        message_id: -1,
        chat: telegramChat,
      });
      sendMessage(message);
    });

    const chats = await entityManager.find(Chat);

    expect(chats.length).toEqual(1);
    expect(chats[0]).toEqual(
      expect.objectContaining({
        id: existingChat.id.toString(),
        type: existingChat.type,
      }),
    );
    expect(chats[0].createdAt).toEqual(existingChat.createdAt);
    expect(chats[0].updatedAt).not.toEqual(existingChat.updatedAt);
  });

  it('insert chat and user into db if does not exists', async () => {
    const telegramChat = createTgPrivateChat(createTgUser());
    await runBot([ScriberBot], ({ sendMessage }) => {
      const message = createTgTextMessage('', {
        message_id: -1,
        chat: telegramChat,
      });
      sendMessage(message);
    });

    const chats = await entityManager.find(Chat);

    expect(chats.length).toEqual(1);
    expect(chats[0]).toEqual(
      expect.objectContaining({
        id: telegramChat.id.toString(),
        type: telegramChat.type,
      }),
    );
    expect(chats[0].createdAt).not.toBeNull();
    expect(chats[0].updatedAt).not.toBeNull();

    const users = await entityManager.find(User);

    expect(users.length).toEqual(1);
    expect(users[0]).toEqual(
      expect.objectContaining({
        id: telegramChat.id.toString(),
        firstName: telegramChat.first_name,
        lastName: telegramChat.last_name,
        username: telegramChat.username,
      }),
    );
    expect(users[0].createdAt).not.toBeNull();
    expect(users[0].updatedAt).not.toBeNull();
  });

  it('insert message into db if does not exists', async () => {
    const telegramMessage = createTgTextMessage('hello world');
    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message);

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
  });

  it('insert reply message into db if does not exists', async () => {
    const telegramRepliedMessage = createTgTextMessage('some absurd thing here', {
      message_id: 12345,
      reply_to_message: undefined,
    });
    const telegramMessage = createTgTextMessage('hello world', { reply_to_message: telegramRepliedMessage });
    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['replyToMessage'] });

    expect(messages.length).toEqual(2);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramRepliedMessage.message_id.toString(),
        unixtime: telegramRepliedMessage.date.toString(),
        text: telegramRepliedMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
    expect(messages[1]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
        replyToMessage: expect.objectContaining({
          id: telegramRepliedMessage.message_id.toString(),
        }),
      }),
    );
    expect(messages[1].createdAt).not.toBeNull();
    expect(messages[1].updatedAt).not.toBeNull();
  });

  it('insert reply message into db if does not exists but original message exists', async () => {
    const telegramRepliedMessage = createTgTextMessage('some absurd thing here', {
      message_id: 12345,
      reply_to_message: undefined,
    });
    const telegramMessage = createTgTextMessage('hello world', { reply_to_message: telegramRepliedMessage });
    const chat = await createChatInDb(telegramMessage.chat.type);
    await createMessageInDb(chat, {
      id: telegramRepliedMessage.message_id.toString(),
      text: telegramRepliedMessage.text,
      unixtime: telegramRepliedMessage.date.toString(),
    });

    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['replyToMessage'] });

    expect(messages.length).toEqual(2);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramRepliedMessage.message_id.toString(),
        unixtime: telegramRepliedMessage.date.toString(),
        text: telegramRepliedMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
    expect(messages[1]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
        replyToMessage: expect.objectContaining({
          id: telegramRepliedMessage.message_id.toString(),
        }),
      }),
    );
    expect(messages[1].createdAt).not.toBeNull();
    expect(messages[1].updatedAt).not.toBeNull();
  });

  it('insert forwardFromMessage relation into db', async () => {
    const telegramForwardedFromMessage = createTgTextMessage('some absurd thing here', { message_id: 12345 });
    const telegramMessage = createTgTextMessage('hello world', {
      forward_from_message_id: telegramForwardedFromMessage.message_id,
      forward_from_chat: telegramForwardedFromMessage.chat,
    });
    const chat = await createChatInDb(telegramMessage.chat.type);
    await createMessageInDb(chat, {
      id: telegramForwardedFromMessage.message_id.toString(),
      text: telegramForwardedFromMessage.text,
      unixtime: telegramForwardedFromMessage.date.toString(),
    });

    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['forwardFromMessage'] });

    expect(messages.length).toEqual(2);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramForwardedFromMessage.message_id.toString(),
        unixtime: telegramForwardedFromMessage.date.toString(),
        text: telegramForwardedFromMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
    expect(messages[1]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
        forwardFromMessage: expect.objectContaining({
          id: telegramForwardedFromMessage.message_id.toString(),
        }),
      }),
    );
    expect(messages[1].createdAt).not.toBeNull();
    expect(messages[1].updatedAt).not.toBeNull();
  });

  it('insert pinned message into db if does not exists', async () => {
    const telegramPinnedMessage = createTgTextMessage('some absurd thing here', {
      message_id: 12345,
      reply_to_message: undefined,
    });
    telegramPinnedMessage.message_id = 12345;
    const telegramMessage = createTgMessage({
      pinned_message: telegramPinnedMessage,
    });
    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['pinnedMessage'] });

    expect(messages.length).toEqual(2);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramPinnedMessage.message_id.toString(),
        unixtime: telegramPinnedMessage.date.toString(),
        text: telegramPinnedMessage.text,
      }),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
    expect(messages[1]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        pinnedMessage: expect.objectContaining({
          id: telegramPinnedMessage.message_id.toString(),
        }),
      }),
    );
    expect(messages[1].createdAt).not.toBeNull();
    expect(messages[1].updatedAt).not.toBeNull();
  });

  it('insert message with all optional fields into db', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const telegramMessage: any = createTgMessage();
    telegramMessage.text = 'hello world';
    telegramMessage.forward_date = new Date().getTime();
    telegramMessage.forward_signature = 'forward_signature';
    telegramMessage.media_group_id = 'media_group_id';
    telegramMessage.author_signature = 'author_signature';
    telegramMessage.entities = [{ type: 'type', offset: 0, length: 0 }];
    telegramMessage.caption_entities = [{ type: 'type', offset: 0, length: 0 }];
    telegramMessage.audio = { file_id: 'file_id', duration: 1 };
    telegramMessage.document = { file_id: 'file_id' };
    telegramMessage.animation = { file_id: 'file_id', width: 1, height: 1, duration: 1 };
    telegramMessage.game = {
      title: 'title',
      description: 'desc',
      photo: [{ file_id: 'file_id', width: 1, height: 1 }],
    };
    telegramMessage.photo = [{ file_id: 'file_id', width: 1, height: 1 }];
    telegramMessage.sticker = { file_id: 'file_id', width: 1, height: 1 };
    telegramMessage.video = { file_id: 'file_id', width: 1, height: 1, duration: 1 };
    telegramMessage.voice = { file_id: 'file_id', duration: 1 };
    telegramMessage.video_note = { file_id: 'file_id', length: 1, duration: 1 };
    telegramMessage.caption = 'caption';
    telegramMessage.contact = { phone_number: '1234', first_name: 'first_name' };
    telegramMessage.location = { longitude: 1, latitude: 1 };
    telegramMessage.venue = { location: { longitude: 1, latitude: 1 }, title: 'title', address: 'address' };
    telegramMessage.new_chat_title = 'new_chat_title';
    telegramMessage.new_chat_photo = [{ file_id: 'file_id', width: 1, height: 1 }];
    telegramMessage.delete_chat_photo = true;
    telegramMessage.group_chat_created = true;
    telegramMessage.supergroup_chat_created = true;
    telegramMessage.channel_chat_created = true;
    telegramMessage.invoice = {
      title: 'title',
      currency: 'currency',
      description: 'desc',
      start_parameter: 'start_parameter',
      total_amount: 1,
    };
    telegramMessage.successful_payment = {
      currency: 'currency',
      invoice_payload: 'invoice_payload',
      order_info: {},
      provider_payment_charge_id: 'charge_id',
      shipping_option_id: 'shipping_option_id',
      telegram_payment_charge_id: 'charge_id',
      total_amount: 1,
    };
    telegramMessage.connected_website = 'connected_website';
    telegramMessage.passport_data = { data: [{}], credentials: {} };

    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message);

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
        forwardDate: new Date(telegramMessage.forward_date),
        forwardSignature: telegramMessage.forward_signature,
        mediaGroupId: telegramMessage.media_group_id,
        authorSignature: telegramMessage.author_signature,
        entities: telegramMessage.entities,
        captionEntities: telegramMessage.caption_entities,
        audio: telegramMessage.audio,
        document: telegramMessage.document,
        animation: telegramMessage.animation,
        game: telegramMessage.game,
        photo: telegramMessage.photo,
        sticker: telegramMessage.sticker,
        video: telegramMessage.video,
        voice: telegramMessage.voice,
        videoNote: telegramMessage.video_note,
        caption: telegramMessage.caption,
        contact: telegramMessage.contact,
        location: telegramMessage.location,
        venue: telegramMessage.venue,
        newGroupTitle: telegramMessage.new_chat_title,
        newGroupPhoto: telegramMessage.new_chat_photo,
        groupPhotoDeleted: telegramMessage.delete_chat_photo,
        groupCreated: telegramMessage.group_chat_created,
        supergroupCreated: telegramMessage.supergroup_chat_created,
        channelCreated: telegramMessage.channel_chat_created,
        invoice: telegramMessage.invoice,
        successfulPayment: telegramMessage.successful_payment,
        connectedWebsite: telegramMessage.connected_website,
        passportData: telegramMessage.passport_data,
      } as Partial<Message>),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
  });

  it('handle editing of message', async () => {
    const telegramMessage = createTgTextMessage('hello world');
    telegramMessage.edit_date = new Date().getTime();
    const chat = await createChatInDb(telegramMessage.chat.type);
    const originalMessage = await createMessageInDb(chat, {
      id: telegramMessage.message_id.toString(),
      text: 'original message',
    });

    await runBot([ScriberBot], ({ sendEditedMessage }) => {
      sendEditedMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message);

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        text: telegramMessage.text,
        lastEdit: new Date(telegramMessage.edit_date),
        editHistory: expect.arrayContaining([
          expect.objectContaining({
            id: telegramMessage.message_id.toString(),
            unixtime: originalMessage.unixtime,
            text: originalMessage.text,
          }),
        ]),
      } as Partial<Message>),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
  });

  it('handle migration from', async () => {
    const chat = await createChatInDb('group');
    const telegramChat = createTgGroupChat();
    telegramChat.id = -2020;
    const telegramMessage = createTgMessage({ chat: telegramChat, migrate_from_chat_id: parseInt(chat.id) });

    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['migrateFromChat'] });

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        migrateFromChat: expect.objectContaining({
          id: chat.id.toString(),
        }),
      } as Partial<Message>),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
  });

  it('handle migration to', async () => {
    const chat = await createChatInDb('supergroup');
    const telegramChat = createTgGroupChat();
    telegramChat.id = -2020;
    const telegramMessage = createTgMessage({ chat: telegramChat, migrate_to_chat_id: parseInt(chat.id) });

    await runBot([ScriberBot], ({ sendMessage }) => {
      sendMessage(telegramMessage);
    });

    const messages = await entityManager.find(Message, { relations: ['migrateToChat'] });

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual(
      expect.objectContaining({
        id: telegramMessage.message_id.toString(),
        unixtime: telegramMessage.date.toString(),
        migrateToChat: expect.objectContaining({
          id: chat.id.toString(),
        }),
      } as Partial<Message>),
    );
    expect(messages[0].createdAt).not.toBeNull();
    expect(messages[0].updatedAt).not.toBeNull();
  });
});

async function createUserInDb() {
  try {
    const user = entityManager.create(User, {
      id: '2',
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
      id: '-10000',
      type,
    });
    return await entityManager.save(chat);
  } catch (e) {
    console.error(e);
  }
}

async function createMessageInDb(chat: Chat, partialMessage: DeepPartial<Message> = { id: '1' }) {
  try {
    const message = entityManager.create(Message, {
      unixtime: new Date().getTime().toString(),
      text: 'Some text here',
      chat: chat,
      ...partialMessage,
    });
    return await entityManager.save(message);
  } catch (e) {
    console.error(e);
  }
}
