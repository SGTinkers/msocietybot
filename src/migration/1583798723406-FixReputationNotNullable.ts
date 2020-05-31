/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixReputationNotNullable1583798723406 implements MigrationInterface {
  name = 'FixReputationNotNullable1583798723406';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_092d6c747696d58b9e627565bda"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "from_user_id" SET NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "to_user_id" SET NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "chat_id" SET NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "message_id" SET NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "message_chat" SET NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages"("id","chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_092d6c747696d58b9e627565bda"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "message_chat" DROP NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "message_id" DROP NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "chat_id" DROP NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "to_user_id" DROP NOT NULL', undefined);
    await queryRunner.query('ALTER TABLE "reputation" ALTER COLUMN "from_user_id" DROP NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "REL_c89129a8dd16dc8a7afe4d4b4b" UNIQUE ("message_id", "message_chat")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_c89129a8dd16dc8a7afe4d4b4bc" FOREIGN KEY ("message_id", "message_chat") REFERENCES "messages"("id","chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_092d6c747696d58b9e627565bda" FOREIGN KEY ("to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6" FOREIGN KEY ("from_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }
}
