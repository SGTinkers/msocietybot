/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixNotNullables1583549570878 implements MigrationInterface {
  name = 'FixNotNullables1583549570878';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "temporary_reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "reputation"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_reputation" RENAME TO "reputation"', undefined);
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
    await queryRunner.query(
      'CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "permissions"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_permissions" RENAME TO "permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "permissions"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_permissions" RENAME TO "permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"), CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "reputation"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_reputation" RENAME TO "reputation"', undefined);
    await queryRunner.query(
      'CREATE TABLE "temporary_permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "permissions"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_permissions" RENAME TO "permissions"', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "permissions" RENAME TO "temporary_permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer NOT NULL)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "temporary_permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_permissions"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" RENAME TO "temporary_reputation"', undefined);
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "temporary_reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_reputation"', undefined);
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
    await queryRunner.query('ALTER TABLE "permissions" RENAME TO "temporary_permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer, CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "temporary_permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_permissions"', undefined);
    await queryRunner.query('ALTER TABLE "permissions" RENAME TO "temporary_permissions"', undefined);
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "role_id" integer, CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "permissions"("id", "name", "role_id") SELECT "id", "name", "role_id" FROM "temporary_permissions"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_permissions"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" RENAME TO "temporary_reputation"', undefined);
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "UQ_c89129a8dd16dc8a7afe4d4b4bc" UNIQUE ("message_id", "message_chat"), CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "temporary_reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_reputation"', undefined);
  }
}
