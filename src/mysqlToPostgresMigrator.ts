import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createConnection } from './app';
import mysql from 'mysql2';
import createDebug from 'debug';
import { Chat } from './entity/Chat';
import { User } from './entity/User';
import { Message } from './entity/Message';
import { Reputation } from './entity/Reputation';
import { EntityManager } from 'typeorm';

const debug = createDebug('msocietybot-mysql-migrator');

createConnection()
  .then(postgresConnection => {
    debug('connected: %O', postgresConnection.isConnected);

    const mysqlConnection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    migrate(postgresConnection, mysqlConnection);
  })
  .catch(error => console.error(error));

async function migrate(postgresConnection, mysqlConnection) {
  const entityManager: EntityManager = postgresConnection.createEntityManager();

  const users = await mysqlConnection.promise().query('SELECT * FROM users');
  for (const row of users[0]) {
    const user = entityManager.create(User, {
      id: row.id,
      username: row.username,
      firstName: row.first_name,
      lastName: row.last_name,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
    });
    await entityManager.save(user);
    debug('migrated: %O', user);
  }

  const chats = await mysqlConnection.promise().query('SELECT * FROM chats');
  for (const row of chats[0]) {
    const chat = entityManager.create(Chat, {
      id: row.id,
      type: row.type,
      user: row.user_id ? { id: row.user_id } : undefined,
      title: row.title,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
    });
    await entityManager.save(chat);
    debug('migrated: %O', chat);
  }

  const messages = await mysqlConnection.promise().query('SELECT * FROM messages');
  for (const row of messages[0]) {
    const message = entityManager.create(Message, {
      id: row.id,
      sender: { id: row.sender_id },
      replyToMessage: row.reply_to_message_id ? { id: row.reply_to_message_id } : undefined,
      unixtime: row.unixtime,
      chat: { id: row.chat_id },
      lastEdit: row.last_edit ? toDate(row.last_edit) : undefined,
      editHistory: row.edit_history,
      albumId: row.album_id,
      signature: row.signature,
      text: row.text,
      payload: row.payload,
      entities: row.entities,
      caption: row.caption,
      captionEntities: row.caption_entities,
      audio: row.audio,
      document: row.document,
      animation: row.animation,
      game: row.game,
      photo: row.photo,
      sticker: row.sticker,
      voice: row.voice,
      videoNote: row.video_note,
      video: row.video,
      contact: row.contact,
      location: row.location,
      venue: row.venue,
      userJoined: row.user_joined_id ? { id: row.user_joined_id } : undefined,
      userLeft: row.user_left_id ? { id: row.user_left_id } : undefined,
      newGroupTitle: row.new_group_title,
      newGroupPhoto: row.new_group_photo,
      usersJoined: row.users_joined ? JSON.parse(row.users_joined).map(u => ({ id: u.id })) : undefined,
      groupPhotoDeleted: !!row.group_photo_deleted,
      groupCreated: !!row.group_created,
      supergroupCreated: !!row.supergroup_created,
      channelCreated: !!row.channel_created,
      migrateToChat: row.migrate_to_chat_id ? { id: row.migrate_to_chat_id } : undefined,
      migrateFromChat: row.migrate_from_chat_id ? { id: row.migrate_from_chat_id } : undefined,
      pinnedMessage: row.pinned_message_id ? { id: row.pinned_message_id } : undefined,
      forwardFrom: row.original_sender_id ? { id: row.original_sender_id } : undefined,
      forwardFromChat: row.original_chat_id ? { id: row.original_chat_id } : undefined,
      forwardDate: row.original_unixtime ? new Date(parseInt(row.original_unixtime) / 1000) : undefined,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
    });
    try {
      await entityManager.save(message);
    } catch (e) {
      console.error('error inserting message:', row, message);
      throw e;
    }
    debug('migrated: %O', message);
  }

  const reputations = await mysqlConnection.promise().query('SELECT * FROM reputations');
  for (const row of reputations[0]) {
    const message = await entityManager.findOne(
      Message,
      { id: row.message_id, chat: { id: row.chat_id } },
      { relations: ['sender', 'chat'] },
    );
    if (!message) {
      console.warn('Cannot find message to insert reputation:', row);
      continue;
    }

    const reputation = entityManager.create(Reputation, {
      fromUser: { id: message.sender.id },
      toUser: { id: row.user_id },
      chat: { id: message.chat.id },
      message,
      value: row.value,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      deletedAt: row.deleted_at ? new Date(row.deleted_at) : undefined,
    });
    await postgresConnection.query(
      'INSERT INTO reputation (from_user_id, to_user_id, chat_id, message_id, message_chat, value, created_at, updated_at, deleted_at) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);',
      [
        message.sender.id,
        row.user_id,
        message.chat.id,
        message.id,
        message.chat.id,
        row.value,
        new Date(row.created_at),
        new Date(row.updated_at),
        row.deleted_at ? new Date(row.deleted_at) : undefined,
      ],
    );
    debug('migrated: %O', reputation);
  }

  postgresConnection.close();
  mysqlConnection.end();
}

function filterInt(value: string) {
  if (/^[-+]?(\d+|Infinity)$/.test(value)) {
    return Number(value);
  } else {
    return NaN;
  }
}

function toDate(value: string): Date {
  if (!value) {
    return undefined;
  }

  const number = filterInt(value);
  if (isNaN(number)) {
    return new Date(value);
  } else {
    return new Date(number / 1000);
  }
}
