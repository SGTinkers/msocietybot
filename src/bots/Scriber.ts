import createDebug from 'debug';
import Composer from 'telegraf/composer';
import { EntityManager, FindConditions } from 'typeorm';
import { User } from '../entity/User';
import { Chat as TelegramChat, Message as TelegramMessage, User as TelegramUser } from 'telegram-typings';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';

const debug = createDebug('msocietybot:scriber');

export const ScriberBot = new Composer();
ScriberBot.on('message', async (ctx, next) => {
  await ctx.entityManager.transaction(async entityManager => {
    const message = await handleMessage(entityManager, ctx.message);
    debug('created message %s for chat %s', message.id, message.chat.id);
    next();
  });
});
ScriberBot.on('edited_message', async (ctx, next) => {
  await ctx.entityManager.transaction(async entityManager => {
    const message = await handleMessage(entityManager, ctx.update.edited_message);
    debug('edited message %s for chat: %s', message.id, message.chat.id);
    next();
  });
});

async function handleMessage(entityManager: EntityManager, message: TelegramMessage) {
  const messageFields: Partial<Message> = {};
  const chat = await upsertChat(entityManager, message.chat);

  if (message.forward_from_chat) {
    messageFields.forwardFromChat = await upsertChat(entityManager, message.forward_from_chat);
  }

  if (message.from) {
    messageFields.sender = await upsertUser(entityManager, message.from);
  }

  if (message.forward_from) {
    messageFields.forwardFrom = await upsertUser(entityManager, message.forward_from);
  }

  if (message.left_chat_member) {
    messageFields.userLeft = await upsertUser(entityManager, message.left_chat_member);
  }

  if (message.new_chat_members && message.new_chat_members.length > 0) {
    messageFields.usersJoined = [];
    const users = await Promise.all(message.new_chat_members.map(member => upsertUser(entityManager, member)));
    users.forEach((user: User) => messageFields.usersJoined.push(user));
  }

  if (message.reply_to_message) {
    messageFields.replyToMessage = await handleMessage(entityManager, message.reply_to_message);
  }

  if (message.pinned_message) {
    messageFields.pinnedMessage = await handleMessage(entityManager, message.pinned_message);
  }

  if (message.forward_from_message_id) {
    messageFields.forwardFromMessage = await entityManager.findOne(
      Message,
      {
        id: message.forward_from_message_id,
        chat: { id: message.forward_from_chat.id },
      },
      { relations: ['chat'] },
    );
  }

  return await upsertMessage(entityManager, chat, message, messageFields);
}

async function upsertMessage(
  entityManager: EntityManager,
  chat: Chat,
  telegramMessage: TelegramMessage,
  partialMessage: Partial<Message> = {},
) {
  partialMessage.forwardDate = telegramMessage.forward_date ? new Date(telegramMessage.forward_date) : null;
  partialMessage.forwardSignature = telegramMessage.forward_signature;
  partialMessage.mediaGroupId = telegramMessage.media_group_id;
  partialMessage.authorSignature = telegramMessage.author_signature;
  partialMessage.entities = telegramMessage.entities;
  partialMessage.captionEntities = telegramMessage.caption_entities;
  partialMessage.audio = telegramMessage.audio;
  partialMessage.document = telegramMessage.document;
  partialMessage.animation = telegramMessage.animation;
  partialMessage.game = telegramMessage.game;
  partialMessage.photo = telegramMessage.photo;
  partialMessage.sticker = telegramMessage.sticker;
  partialMessage.video = telegramMessage.video;
  partialMessage.voice = telegramMessage.voice;
  partialMessage.videoNote = telegramMessage.video_note;
  partialMessage.caption = telegramMessage.caption;
  partialMessage.contact = telegramMessage.contact;
  partialMessage.location = telegramMessage.location;
  partialMessage.venue = telegramMessage.venue;
  partialMessage.newGroupTitle = telegramMessage.new_chat_title;
  partialMessage.newGroupPhoto = telegramMessage.new_chat_photo;
  partialMessage.groupPhotoDeleted = telegramMessage.delete_chat_photo;
  partialMessage.groupCreated = telegramMessage.group_chat_created;
  partialMessage.supergroupCreated = telegramMessage.supergroup_chat_created;
  partialMessage.channelCreated = telegramMessage.channel_chat_created;
  partialMessage.invoice = telegramMessage.invoice;
  partialMessage.successfulPayment = telegramMessage.successful_payment;
  partialMessage.connectedWebsite = telegramMessage.connected_website;
  partialMessage.passportData = telegramMessage.passport_data;

  if (telegramMessage.migrate_from_chat_id) {
    const chat = await entityManager.findOne(Chat, {
      id: telegramMessage.migrate_from_chat_id,
    } as FindConditions<Chat>);
    if (chat) {
      partialMessage.migrateFromChat = chat;
    }
  }

  if (telegramMessage.migrate_to_chat_id) {
    const chat = await entityManager.findOne(Chat, {
      id: telegramMessage.migrate_to_chat_id,
    } as FindConditions<Chat>);
    if (chat) {
      partialMessage.migrateToChat = chat;
    }
  }

  const message = await entityManager.findOne(Message, {
    id: telegramMessage.message_id,
    chat: chat.id,
  } as FindConditions<Message>);

  if (message === undefined) {
    const newMessage = entityManager.create(Message, {
      id: telegramMessage.message_id,
      unixtime: telegramMessage.date,
      text: telegramMessage.text,
      chat: chat,
      ...partialMessage,
    });
    return await entityManager.save(newMessage);
  } else {
    if (telegramMessage.edit_date) {
      message.editHistory = message.editHistory ? message.editHistory : [];
      message.editHistory.push(JSON.parse(JSON.stringify(message)));
      message.lastEdit = new Date(telegramMessage.edit_date);
    }
    message.unixtime = telegramMessage.date;
    message.text = telegramMessage.text;
    message.chat = chat;
    Object.keys(partialMessage).forEach(k => (message[k] = partialMessage[k]));
    return await entityManager.save(message);
  }
}

async function upsertUser(entityManager: EntityManager, telegramUser: TelegramUser) {
  const user = await entityManager.findOne(User, telegramUser.id);
  if (user === undefined) {
    const newUser = entityManager.create(User, {
      id: telegramUser.id,
      firstName: telegramUser.first_name,
      lastName: telegramUser.last_name,
      username: telegramUser.username,
    });
    return await entityManager.save(newUser);
  } else {
    user.firstName = telegramUser.first_name;
    user.lastName = telegramUser.last_name;
    user.username = telegramUser.username;
    return await entityManager.save(user);
  }
}

async function upsertChat(entityManager: EntityManager, telegramChat: TelegramChat) {
  const partialChat: Partial<Chat> = {};
  if (telegramChat.type === 'private') {
    partialChat.user = await upsertUser(entityManager, {
      id: telegramChat.id,
      first_name: telegramChat.first_name,
      last_name: telegramChat.last_name,
      username: telegramChat.username,
      is_bot: false,
    });
  }

  const chat = await entityManager.findOne(Chat, telegramChat.id);
  if (chat === undefined) {
    const chat = entityManager.create(Chat, {
      id: telegramChat.id,
      type: telegramChat.type,
      title: telegramChat.title,
      ...partialChat,
    });
    return await entityManager.save(chat);
  } else {
    chat.type = telegramChat.type;
    chat.title = telegramChat.title;
    Object.keys(partialChat).forEach(k => (chat[k] = partialChat[k]));
    return await entityManager.save(chat);
  }
}
