/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMessagesFK1583363634275 implements MigrationInterface {
  name = 'FixMessagesFK1583363634275';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" ADD "reply_to_message_chat" bigint', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67" FOREIGN KEY ("reply_to_message_id", "reply_to_message_chat") REFERENCES "messages"("id", "chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "reply_to_message_chat"', undefined);
  }
}
