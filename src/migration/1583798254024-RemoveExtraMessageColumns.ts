/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveExtraMessageColumns1583798254024 implements MigrationInterface {
  name = 'RemoveExtraMessageColumns1583798254024';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_125663bf804e4c0e3fc2cffab17"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7538eecd947631f054b91ffe6ac"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "original_unixtime"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "original_sender_id"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "original_chat_id"', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" ADD "original_chat_id" bigint', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "original_sender_id" bigint', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "original_unixtime" bigint', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7538eecd947631f054b91ffe6ac" FOREIGN KEY ("original_chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_125663bf804e4c0e3fc2cffab17" FOREIGN KEY ("original_sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }
}
