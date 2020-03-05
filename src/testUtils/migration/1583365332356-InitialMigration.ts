/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1583365332356 implements MigrationInterface {
  name = 'InitialMigration1583365332356';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer)',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "display_name" varchar, "description" varchar, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime)',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, PRIMARY KEY ("key", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "messages" ("id" bigint NOT NULL, "unixtime" bigint NOT NULL, "original_unixtime" bigint, "last_edit" datetime, "edit_history" text, "album_id" varchar, "signature" varchar, "text" varchar, "payload" varchar, "entities" text, "caption" varchar, "caption_entities" text, "audio" text, "document" text, "photo" text, "sticker" text, "voice" text, "video_note" text, "video" text, "contact" text, "location" text, "venue" text, "new_group_title" varchar, "new_group_photo" text, "group_photo_deleted" boolean, "group_photo_created" boolean, "supergroup_created" boolean, "channel_created" boolean, "forward_signature" varchar, "forward_date" datetime, "media_group_id" varchar, "author_signature" varchar, "invoice" text, "successful_payment" text, "connected_website" varchar, "passport_data" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "sender_id" bigint, "reply_to_message_id" bigint, "chat_id" bigint NOT NULL, "original_sender_id" bigint, "original_chat_id" bigint, "user_joined_id" bigint, "user_left_id" bigint, "migrate_to_chat_id" bigint, "migrate_from_chat_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, "forward_from_id" bigint, "forward_from_chat_id" bigint, "forward_from_message_id" bigint, "forward_from_message_chat" bigint, PRIMARY KEY ("id", "chat_id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "user" ("id" bigint PRIMARY KEY NOT NULL, "username" varchar, "first_name" varchar, "last_name" varchar, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, PRIMARY KEY ("key", "chat_id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint)',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, PRIMARY KEY ("user_id", "role_id"))',
      undefined,
    );
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ', undefined);
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer, CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "permissions"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_permissions" RENAME TO "permissions"', undefined);
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, CONSTRAINT "FK_cf08e0df86a017203c6075fd113" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("key", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_users_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "user_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "user_id" FROM "users_preferences"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "users_preferences"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_users_preferences" RENAME TO "users_preferences"', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("key", "chat_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_chats_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "chat_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "chat_id" FROM "chats_preferences"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "chats_preferences"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_chats_preferences" RENAME TO "chats_preferences"', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "temporary_chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, CONSTRAINT "FK_b6c92d818d42e3e298e84d94414" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2792176a81b1ed4887f32f30c17" FOREIGN KEY ("pinned_message_id", "pinned_message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_chats"("id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat") SELECT "id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat" FROM "chats"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "chats"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_chats" RENAME TO "chats"', undefined);
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"', undefined);
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "FK_c9b630a8c6797b8c58d62984c8b" FOREIGN KEY ("messages_id", "messages_chat_id") REFERENCES "messages" ("id", "chat_id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_440e71f0173a226b86edd432783" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_messages_users_joined_user"("messages_id", "messages_chat_id", "user_id") SELECT "messages_id", "messages_chat_id", "user_id" FROM "messages_users_joined_user"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "messages_users_joined_user"', undefined);
    await queryRunner.query(
      'ALTER TABLE "temporary_messages_users_joined_user" RENAME TO "messages_users_joined_user"',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("user_id", "role_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_user_roles"("user_id", "role_id") SELECT "user_id", "role_id" FROM "user_roles"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "user_roles"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_user_roles" RENAME TO "user_roles"', undefined);
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ', undefined);
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"', undefined);
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"', undefined);
    await queryRunner.query('ALTER TABLE "user_roles" RENAME TO "temporary_user_roles"', undefined);
    await queryRunner.query(
      'CREATE TABLE "user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, PRIMARY KEY ("user_id", "role_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "user_roles"("user_id", "role_id") SELECT "user_id", "role_id" FROM "temporary_user_roles"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_user_roles"', undefined);
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ', undefined);
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ', undefined);
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"', undefined);
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" RENAME TO "temporary_messages_users_joined_user"',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "messages_users_joined_user"("messages_id", "messages_chat_id", "user_id") SELECT "messages_id", "messages_chat_id", "user_id" FROM "temporary_messages_users_joined_user"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_messages_users_joined_user"', undefined);
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "chats" RENAME TO "temporary_chats"', undefined);
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "chats"("id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat") SELECT "id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat" FROM "temporary_chats"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_chats"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query('ALTER TABLE "chats_preferences" RENAME TO "temporary_chats_preferences"', undefined);
    await queryRunner.query(
      'CREATE TABLE "chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, PRIMARY KEY ("key", "chat_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "chats_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "chat_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "chat_id" FROM "temporary_chats_preferences"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_chats_preferences"', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" RENAME TO "temporary_messages"', undefined);
    await queryRunner.query(
      'CREATE TABLE "messages" ("id" bigint NOT NULL, "unixtime" bigint NOT NULL, "original_unixtime" bigint, "last_edit" datetime, "edit_history" text, "album_id" varchar, "signature" varchar, "text" varchar, "payload" varchar, "entities" text, "caption" varchar, "caption_entities" text, "audio" text, "document" text, "photo" text, "sticker" text, "voice" text, "video_note" text, "video" text, "contact" text, "location" text, "venue" text, "new_group_title" varchar, "new_group_photo" text, "group_photo_deleted" boolean, "group_photo_created" boolean, "supergroup_created" boolean, "channel_created" boolean, "forward_signature" varchar, "forward_date" datetime, "media_group_id" varchar, "author_signature" varchar, "invoice" text, "successful_payment" text, "connected_website" varchar, "passport_data" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "sender_id" bigint, "reply_to_message_id" bigint, "chat_id" bigint NOT NULL, "original_sender_id" bigint, "original_chat_id" bigint, "user_joined_id" bigint, "user_left_id" bigint, "migrate_to_chat_id" bigint, "migrate_from_chat_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, "forward_from_id" bigint, "forward_from_chat_id" bigint, "forward_from_message_id" bigint, "forward_from_message_chat" bigint, PRIMARY KEY ("id", "chat_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "messages"("id", "unixtime", "original_unixtime", "last_edit", "edit_history", "album_id", "signature", "text", "payload", "entities", "caption", "caption_entities", "audio", "document", "photo", "sticker", "voice", "video_note", "video", "contact", "location", "venue", "new_group_title", "new_group_photo", "group_photo_deleted", "group_photo_created", "supergroup_created", "channel_created", "forward_signature", "forward_date", "media_group_id", "author_signature", "invoice", "successful_payment", "connected_website", "passport_data", "created_at", "updated_at", "deleted_at", "sender_id", "reply_to_message_id", "chat_id", "original_sender_id", "original_chat_id", "user_joined_id", "user_left_id", "migrate_to_chat_id", "migrate_from_chat_id", "pinned_message_id", "pinned_message_chat", "forward_from_id", "forward_from_chat_id", "forward_from_message_id", "forward_from_message_chat") SELECT "id", "unixtime", "original_unixtime", "last_edit", "edit_history", "album_id", "signature", "text", "payload", "entities", "caption", "caption_entities", "audio", "document", "photo", "sticker", "voice", "video_note", "video", "contact", "location", "venue", "new_group_title", "new_group_photo", "group_photo_deleted", "group_photo_created", "supergroup_created", "channel_created", "forward_signature", "forward_date", "media_group_id", "author_signature", "invoice", "successful_payment", "connected_website", "passport_data", "created_at", "updated_at", "deleted_at", "sender_id", "reply_to_message_id", "chat_id", "original_sender_id", "original_chat_id", "user_joined_id", "user_left_id", "migrate_to_chat_id", "migrate_from_chat_id", "pinned_message_id", "pinned_message_chat", "forward_from_id", "forward_from_chat_id", "forward_from_message_id", "forward_from_message_chat" FROM "temporary_messages"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_messages"', undefined);
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query('ALTER TABLE "users_preferences" RENAME TO "temporary_users_preferences"', undefined);
    await queryRunner.query(
      'CREATE TABLE "users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, PRIMARY KEY ("key", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "users_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "user_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "user_id" FROM "temporary_users_preferences"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_users_preferences"', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "permissions" RENAME TO "temporary_permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "temporary_permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_permissions"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"', undefined);
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"', undefined);
    await queryRunner.query('DROP TABLE "user_roles"', undefined);
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"', undefined);
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"', undefined);
    await queryRunner.query('DROP TABLE "messages_users_joined_user"', undefined);
    await queryRunner.query('DROP TABLE "chats"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query('DROP TABLE "chats_preferences"', undefined);
    await queryRunner.query('DROP TABLE "user"', undefined);
    await queryRunner.query('DROP TABLE "messages"', undefined);
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query('DROP TABLE "users_preferences"', undefined);
    await queryRunner.query('DROP TABLE "roles"', undefined);
    await queryRunner.query('DROP TABLE "permissions"', undefined);
  }
}
