/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReputation1583396509925 implements MigrationInterface {
  name = 'CreateReputation1583396509925';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "temporary_reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"), CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages" ("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION)',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "temporary_reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "reputation"', undefined);
    await queryRunner.query('ALTER TABLE "temporary_reputation" RENAME TO "reputation"', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "reputation" RENAME TO "temporary_reputation"', undefined);
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "value" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL, "updated_at" datetime NOT NULL, "deleted_at" datetime, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, "message_chat" bigint, CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat"))',
      undefined,
    );
    await queryRunner.query(
      'INSERT INTO "reputation"("id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat") SELECT "id", "value", "created_at", "updated_at", "deleted_at", "from_user_id", "to_user_id", "chat_id", "message_id", "message_chat" FROM "temporary_reputation"',
      undefined,
    );
    await queryRunner.query('DROP TABLE "temporary_reputation"', undefined);
    await queryRunner.query('DROP TABLE "reputation"', undefined);
  }
}
