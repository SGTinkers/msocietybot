/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChatMissingColumns1583281009195 implements MigrationInterface {
  name = 'ChatMissingColumns1583281009195';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "chats" ADD "all_members_are_administrators" boolean', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "description" character varying', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "photo" text', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "invite_link" character varying', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "sticker_set_name" character varying', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "bot_can_set_sticker_set" boolean', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "pinned_message_id" bigint', undefined);
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "FK_0d8383b9e259368e426bb2a772a" FOREIGN KEY ("pinned_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_0d8383b9e259368e426bb2a772a"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "pinned_message_id"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "bot_can_set_sticker_set"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "sticker_set_name"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "invite_link"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "photo"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "description"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "all_members_are_administrators"', undefined);
  }
}
