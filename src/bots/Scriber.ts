import createDebug from 'debug';
import { Composer } from 'telegraf';
import { EntityManager, FindConditions } from 'typeorm';
import { User } from '../entity/User';
import {
  Chat as TelegramChat,
  Message as TelegramMessage,
  User as TelegramUser,
} from 'telegraf/typings/core/types/typegram';
import { Chat } from '../entity/Chat';
import { Message } from '../entity/Message';
import { MsocietyBotContext } from '../context';

const debug = createDebug('msocietybot:scriber');

export const ScriberBot = new Composer<MsocietyBotContext>();
ScriberBot.on('message', async (ctx, next) => {
  await ctx.entityManager.transaction(async entityManager => {
    const message = await handleMessage(entityManager, ctx.message);
    debug('created message %s for chat %s', message.id, message.chat.id);
  });
  next();
});
ScriberBot.on('edited_message', async (ctx, next) => {
  await ctx.entityManager.transaction(async entityManager => {
    const message = await handleMessage(entityManager, ctx.update.edited_message);
    debug('edited message %s for chat: %s', message.id, message.chat.id);
  });
  next();
});

async function handleMessage(entityManager: EntityManager, message: TelegramMessage) {
  const messageFields: Partial<Message> = {};
  const chat = await upsertChat(entityManager, message.chat);

  if ('forward_from_chat' in message && message.forward_from_chat) {
    messageFields.forwardFromChat = await upsertChat(entityManager, message.forward_from_chat);
  }

  if (message.from) {
    messageFields.sender = await upsertUser(entityManager, message.from);
  }

  if ('forward_from' in message && message.forward_from) {
    messageFields.forwardFrom = await upsertUser(entityManager, message.forward_from);
  }

  if ('left_chat_member' in message && message.left_chat_member) {
    messageFields.userLeft = await upsertUser(entityManager, message.left_chat_member);
  }

  if ('new_chat_members' in message && message.new_chat_members && message.new_chat_members.length > 0) {
    messageFields.usersJoined = [];
    const users = await Promise.all(message.new_chat_members.map(member => upsertUser(entityManager, member)));
    users.forEach((user: User) => messageFields.usersJoined.push(user));
  }

  if ('reply_to_message' in message && message.reply_to_message) {
    messageFields.replyToMessage = await handleMessage(entityManager, message.reply_to_message);
  }

  if ('pinned_message' in message && message.pinned_message) {
    messageFields.pinnedMessage = await handleMessage(entityManager, message.pinned_message);
  }

  if ('forward_from_message_id' in message && message.forward_from_message_id) {
    messageFields.forwardFromMessage = await entityManager.findOne(
      Message,
      {
        id: message.forward_from_message_id.toString(),
        chat: { id: message.forward_from_chat.id.toString() },
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tgMsg: any = telegramMessage;
  partialMessage.forwardDate = tgMsg.forward_date ? new Date(tgMsg.forward_date) : null;
  partialMessage.forwardSignature = tgMsg.forward_signature;
  partialMessage.mediaGroupId = tgMsg.media_group_id;
  partialMessage.authorSignature = tgMsg.author_signature;
  partialMessage.entities = tgMsg.entities;
  partialMessage.captionEntities = tgMsg.caption_entities;
  partialMessage.audio = tgMsg.audio;
  partialMessage.document = tgMsg.document;
  partialMessage.animation = tgMsg.animation;
  partialMessage.game = tgMsg.game;
  partialMessage.photo = tgMsg.photo;
  partialMessage.sticker = tgMsg.sticker;
  partialMessage.video = tgMsg.video;
  partialMessage.voice = tgMsg.voice;
  partialMessage.videoNote = tgMsg.video_note;
  partialMessage.caption = tgMsg.caption;
  partialMessage.contact = tgMsg.contact;
  partialMessage.location = tgMsg.location;
  partialMessage.venue = tgMsg.venue;
  partialMessage.newGroupTitle = tgMsg.new_chat_title;
  partialMessage.newGroupPhoto = tgMsg.new_chat_photo;
  partialMessage.groupPhotoDeleted = tgMsg.delete_chat_photo;
  partialMessage.groupCreated = tgMsg.group_chat_created;
  partialMessage.supergroupCreated = tgMsg.supergroup_chat_created;
  partialMessage.channelCreated = tgMsg.channel_chat_created;
  partialMessage.invoice = tgMsg.invoice;
  partialMessage.successfulPayment = tgMsg.successful_payment;
  partialMessage.connectedWebsite = tgMsg.connected_website;
  partialMessage.passportData = tgMsg.passport_data;

  if ('migrate_from_chat_id' in tgMsg && tgMsg.migrate_from_chat_id) {
    const chat = await entityManager.findOne(Chat, {
      id: tgMsg.migrate_from_chat_id.toString(),
    } as FindConditions<Chat>);
    if (chat) {
      partialMessage.migrateFromChat = chat;
    }
  }

  if ('migrate_to_chat_id' in tgMsg && tgMsg.migrate_to_chat_id) {
    const chat = await entityManager.findOne(Chat, {
      id: tgMsg.migrate_to_chat_id.toString(),
    } as FindConditions<Chat>);
    if (chat) {
      partialMessage.migrateToChat = chat;
    }
  }

  const message = await entityManager.findOne(Message, {
    id: tgMsg.message_id.toString(),
    chat: chat.id.toString(),
  } as FindConditions<Message>);

  if (message === undefined) {
    const newMessage = entityManager.create(Message, {
      id: tgMsg.message_id.toString(),
      unixtime: tgMsg.date.toString(),
      text: 'text' in tgMsg ? tgMsg.text : undefined,
      chat: chat,
      ...partialMessage,
    });
    return await entityManager.save(newMessage);
  } else {
    if ('edit_date' in tgMsg && tgMsg.edit_date) {
      message.editHistory = message.editHistory ? message.editHistory : [];
      message.editHistory.push(JSON.parse(JSON.stringify(message)));
      message.lastEdit = new Date(tgMsg.edit_date);
    }
    message.unixtime = tgMsg.date.toString();
    message.text = 'text' in tgMsg ? tgMsg.text : undefined;
    message.chat = chat;
    Object.keys(partialMessage).forEach(k => (message[k] = partialMessage[k]));
    return await entityManager.save(message);
  }
}

async function upsertUser(entityManager: EntityManager, telegramUser: TelegramUser) {
  const user = await entityManager.findOne(User, telegramUser.id);
  if (user === undefined) {
    const newUser = entityManager.create(User, {
      id: telegramUser.id.toString(),
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
      id: telegramChat.id.toString(),
      type: telegramChat.type,
      title: 'title' in telegramChat ? telegramChat.title : undefined,
      ...partialChat,
    });
    return await entityManager.save(chat);
  } else {
    chat.type = telegramChat.type;
    chat.title = 'title' in telegramChat ? telegramChat.title : undefined;
    Object.keys(partialChat).forEach(k => (chat[k] = partialChat[k]));
    return await entityManager.save(chat);
  }
}
