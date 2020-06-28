import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1591528074907 implements MigrationInterface {
  name = 'Migration1591528074907';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL)',
    );
    await queryRunner.query(
      'CREATE TABLE "roles" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "display_name" varchar, "description" varchar, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime)',
    );
    await queryRunner.query(
      'CREATE TABLE "users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, PRIMARY KEY ("key", "user_id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
    );
    await queryRunner.query(
      'CREATE TABLE "messages" ("id" bigint NOT NULL, "unixtime" bigint NOT NULL, "last_edit" datetime, "edit_history" text, "album_id" varchar, "signature" varchar, "text" varchar, "payload" varchar, "entities" text, "caption" varchar, "caption_entities" text, "audio" text, "document" text, "animation" text, "game" text, "photo" text, "sticker" text, "voice" text, "video_note" text, "video" text, "contact" text, "location" text, "venue" text, "new_group_title" varchar, "new_group_photo" text, "group_photo_deleted" boolean, "group_created" boolean, "supergroup_created" boolean, "channel_created" boolean, "forward_signature" varchar, "forward_date" datetime, "media_group_id" varchar, "author_signature" varchar, "invoice" text, "successful_payment" text, "connected_website" varchar, "passport_data" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "sender_id" bigint, "reply_to_message_id" bigint, "chat_id" bigint NOT NULL, "user_joined_id" bigint, "user_left_id" bigint, "migrate_to_chat_id" bigint, "migrate_from_chat_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, "forward_from_id" bigint, "forward_from_chat_id" bigint, "forward_from_message_id" bigint, "forward_from_message_chat" bigint, PRIMARY KEY ("id", "chat_id"))',
    );
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint NOT NULL, "to_user_id" bigint NOT NULL, "chat_id" bigint NOT NULL, "message_id" bigint NOT NULL, "message_chat" bigint NOT NULL, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"))',
    );
    await queryRunner.query(
      'CREATE TABLE "user" ("id" bigint PRIMARY KEY NOT NULL, "username" varchar, "first_name" varchar, "last_name" varchar, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"))',
    );
    await queryRunner.query(
      'CREATE TABLE "chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, PRIMARY KEY ("key", "chat_id"))',
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
    );
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint)',
    );
    await queryRunner.query(
      'CREATE TABLE "messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
    );
    await queryRunner.query(
      'CREATE TABLE "user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, PRIMARY KEY ("user_id", "role_id"))',
    );
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ');
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ');
    await queryRunner.query(
      'CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "permissions"',
    );
    await queryRunner.query('DROP TABLE "permissions"');
    await queryRunner.query('ALTER TABLE "temporary_permissions" RENAME TO "permissions"');
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"');
    await queryRunner.query(
      'CREATE TABLE "temporary_users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, CONSTRAINT "FK_cf08e0df86a017203c6075fd113" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("key", "user_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_users_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "user_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "user_id" FROM "users_preferences"',
    );
    await queryRunner.query('DROP TABLE "users_preferences"');
    await queryRunner.query('ALTER TABLE "temporary_users_preferences" RENAME TO "users_preferences"');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
    );
    await queryRunner.query(
      'CREATE TABLE "temporary_reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint NOT NULL, "to_user_id" bigint NOT NULL, "chat_id" bigint NOT NULL, "message_id" bigint NOT NULL, "message_chat" bigint NOT NULL, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"), CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "reputation"',
    );
    await queryRunner.query('DROP TABLE "reputation"');
    await queryRunner.query('ALTER TABLE "temporary_reputation" RENAME TO "reputation"');
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"');
    await queryRunner.query(
      'CREATE TABLE "temporary_chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("key", "chat_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_chats_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "chat_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "chat_id" FROM "chats_preferences"',
    );
    await queryRunner.query('DROP TABLE "chats_preferences"');
    await queryRunner.query('ALTER TABLE "temporary_chats_preferences" RENAME TO "chats_preferences"');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
    );
    await queryRunner.query(
      'CREATE TABLE "temporary_chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, CONSTRAINT "FK_b6c92d818d42e3e298e84d94414" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_2792176a81b1ed4887f32f30c17" FOREIGN KEY ("pinned_message_id", "pinned_message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_chats"("id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat") SELECT "id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat" FROM "chats"',
    );
    await queryRunner.query('DROP TABLE "chats"');
    await queryRunner.query('ALTER TABLE "temporary_chats" RENAME TO "chats"');
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"');
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"');
    await queryRunner.query(
      'CREATE TABLE "temporary_messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "FK_c9b630a8c6797b8c58d62984c8b" FOREIGN KEY ("messages_id", "messages_chat_id") REFERENCES "messages" ("id", "chat_id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_440e71f0173a226b86edd432783" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_messages_users_joined_user"("messages_id", "messages_chat_id", "user_id") SELECT "messages_id", "messages_chat_id", "user_id" FROM "messages_users_joined_user"',
    );
    await queryRunner.query('DROP TABLE "messages_users_joined_user"');
    await queryRunner.query(
      'ALTER TABLE "temporary_messages_users_joined_user" RENAME TO "messages_users_joined_user"',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
    );
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"');
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"');
    await queryRunner.query(
      'CREATE TABLE "temporary_user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("user_id", "role_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "temporary_user_roles"("user_id", "role_id") SELECT "user_id", "role_id" FROM "user_roles"',
    );
    await queryRunner.query('DROP TABLE "user_roles"');
    await queryRunner.query('ALTER TABLE "temporary_user_roles" RENAME TO "user_roles"');
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ');
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"');
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"');
    await queryRunner.query('ALTER TABLE "user_roles" RENAME TO "temporary_user_roles"');
    await queryRunner.query(
      'CREATE TABLE "user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, PRIMARY KEY ("user_id", "role_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "user_roles"("user_id", "role_id") SELECT "user_id", "role_id" FROM "temporary_user_roles"',
    );
    await queryRunner.query('DROP TABLE "temporary_user_roles"');
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ');
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ');
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"');
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"');
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" RENAME TO "temporary_messages_users_joined_user"',
    );
    await queryRunner.query(
      'CREATE TABLE "messages_users_joined_user" ("messages_id" bigint NOT NULL, "messages_chat_id" bigint NOT NULL, "user_id" bigint NOT NULL, PRIMARY KEY ("messages_id", "messages_chat_id", "user_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "messages_users_joined_user"("messages_id", "messages_chat_id", "user_id") SELECT "messages_id", "messages_chat_id", "user_id" FROM "temporary_messages_users_joined_user"',
    );
    await queryRunner.query('DROP TABLE "temporary_messages_users_joined_user"');
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
    );
    await queryRunner.query('ALTER TABLE "chats" RENAME TO "temporary_chats"');
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" bigint PRIMARY KEY NOT NULL, "type" varchar NOT NULL, "all_members_are_administrators" boolean, "title" varchar, "description" varchar, "photo" text, "invite_link" varchar, "sticker_set_name" varchar, "bot_can_set_sticker_set" boolean, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint)',
    );
    await queryRunner.query(
      'INSERT INTO "chats"("id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat") SELECT "id", "type", "all_members_are_administrators", "title", "description", "photo", "invite_link", "sticker_set_name", "bot_can_set_sticker_set", "created_at", "updated_at", "deleted_at", "user_id", "pinned_message_id", "pinned_message_chat" FROM "temporary_chats"',
    );
    await queryRunner.query('DROP TABLE "temporary_chats"');
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"');
    await queryRunner.query('ALTER TABLE "chats_preferences" RENAME TO "temporary_chats_preferences"');
    await queryRunner.query(
      'CREATE TABLE "chats_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "chat_id" bigint NOT NULL, PRIMARY KEY ("key", "chat_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "chats_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "chat_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "chat_id" FROM "temporary_chats_preferences"',
    );
    await queryRunner.query('DROP TABLE "temporary_chats_preferences"');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
    );
    await queryRunner.query('ALTER TABLE "reputation" RENAME TO "temporary_reputation"');
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint NOT NULL, "to_user_id" bigint NOT NULL, "chat_id" bigint NOT NULL, "message_id" bigint NOT NULL, "message_chat" bigint NOT NULL, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"))',
    );
    await queryRunner.query(
      'INSERT INTO "reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "temporary_reputation"',
    );
    await queryRunner.query('DROP TABLE "temporary_reputation"');
    await queryRunner.query(
      'CREATE TABLE "messages" ("id" bigint NOT NULL, "unixtime" bigint NOT NULL, "last_edit" datetime, "edit_history" text, "album_id" varchar, "signature" varchar, "text" varchar, "payload" varchar, "entities" text, "caption" varchar, "caption_entities" text, "audio" text, "document" text, "animation" text, "game" text, "photo" text, "sticker" text, "voice" text, "video_note" text, "video" text, "contact" text, "location" text, "venue" text, "new_group_title" varchar, "new_group_photo" text, "group_photo_deleted" boolean, "group_created" boolean, "supergroup_created" boolean, "channel_created" boolean, "forward_signature" varchar, "forward_date" datetime, "media_group_id" varchar, "author_signature" varchar, "invoice" text, "successful_payment" text, "connected_website" varchar, "passport_data" text, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "sender_id" bigint, "reply_to_message_id" bigint, "chat_id" bigint NOT NULL, "user_joined_id" bigint, "user_left_id" bigint, "migrate_to_chat_id" bigint, "migrate_from_chat_id" bigint, "pinned_message_id" bigint, "pinned_message_chat" bigint, "forward_from_id" bigint, "forward_from_chat_id" bigint, "forward_from_message_id" bigint, "forward_from_message_chat" bigint, PRIMARY KEY ("id", "chat_id"))',
    );
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"');
    await queryRunner.query('ALTER TABLE "users_preferences" RENAME TO "temporary_users_preferences"');
    await queryRunner.query(
      'CREATE TABLE "users_preferences" ("key" varchar NOT NULL, "value" varchar NOT NULL, "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "user_id" bigint NOT NULL, PRIMARY KEY ("key", "user_id"))',
    );
    await queryRunner.query(
      'INSERT INTO "users_preferences"("key", "value", "created_at", "updated_at", "deleted_at", "user_id") SELECT "key", "value", "created_at", "updated_at", "deleted_at", "user_id" FROM "temporary_users_preferences"',
    );
    await queryRunner.query('DROP TABLE "temporary_users_preferences"');
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
    );
    await queryRunner.query('ALTER TABLE "permissions" RENAME TO "temporary_permissions"');
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL)',
    );
    await queryRunner.query(
      'INSERT INTO "permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "temporary_permissions"',
    );
    await queryRunner.query('DROP TABLE "temporary_permissions"');
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"');
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"');
    await queryRunner.query('DROP TABLE "user_roles"');
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"');
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"');
    await queryRunner.query('DROP TABLE "messages_users_joined_user"');
    await queryRunner.query('DROP TABLE "chats"');
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"');
    await queryRunner.query('DROP TABLE "chats_preferences"');
    await queryRunner.query('DROP TABLE "user"');
    await queryRunner.query('DROP TABLE "reputation"');
    await queryRunner.query('DROP TABLE "messages"');
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"');
    await queryRunner.query('DROP TABLE "users_preferences"');
    await queryRunner.query('DROP TABLE "roles"');
    await queryRunner.query('DROP TABLE "permissions"');
  }
}
