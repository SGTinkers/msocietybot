/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageMissingColumns1583278953093 implements MigrationInterface {
  name = 'MessageMissingColumns1583278953093';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "messages_users_joined_user" ("messages_id" bigint NOT NULL, "user_id" bigint NOT NULL, CONSTRAINT "PK_eabc3a9375af71aa6cd29657c8d" PRIMARY KEY ("messages_id", "user_id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_f2cbbc177159c7b7e2a1e93c1e" ON "messages_users_joined_user" ("messages_id") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_440e71f0173a226b86edd43278" ON "messages_users_joined_user" ("user_id") ',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "users_joined"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_signature" character varying', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_date" TIMESTAMP', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "media_group_id" character varying', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "author_signature" character varying', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "invoice" text', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "successful_payment" text', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "connected_website" character varying', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "passport_data" text', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_from_id" bigint', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_from_chat_id" bigint', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_from_message_id" bigint', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_8298d43b4824ba710ff8f416eca" FOREIGN KEY ("forward_from_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_8c442d060437d5621e14e749592" FOREIGN KEY ("forward_from_chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_c9f3fcb8ef9ec7d732a623244fc" FOREIGN KEY ("forward_from_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "FK_f2cbbc177159c7b7e2a1e93c1e4" FOREIGN KEY ("messages_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "FK_440e71f0173a226b86edd432783" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "FK_440e71f0173a226b86edd432783"',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "FK_f2cbbc177159c7b7e2a1e93c1e4"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_c9f3fcb8ef9ec7d732a623244fc"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_8c442d060437d5621e14e749592"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_8298d43b4824ba710ff8f416eca"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_from_message_id"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_from_chat_id"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_from_id"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "passport_data"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "connected_website"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "successful_payment"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "invoice"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "author_signature"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "media_group_id"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_date"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_signature"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "users_joined" character varying', undefined);
    await queryRunner.query('DROP INDEX "IDX_440e71f0173a226b86edd43278"', undefined);
    await queryRunner.query('DROP INDEX "IDX_f2cbbc177159c7b7e2a1e93c1e"', undefined);
    await queryRunner.query('DROP TABLE "messages_users_joined_user"', undefined);
  }
}
