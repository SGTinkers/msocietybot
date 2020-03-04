/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReputation1583330500552 implements MigrationInterface {
  name = 'CreateReputation1583330500552';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "reputation" ("id" SERIAL NOT NULL, "value" integer NOT NULL DEFAULT 1, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "from_user_id" bigint, "to_user_id" bigint, "chat_id" bigint, "message_id" bigint, CONSTRAINT "REL_dab63482eb4a70947e0bf27ef8" UNIQUE ("message_id"), CONSTRAINT "PK_640807583e8622e1d9bbe6f1b7b" PRIMARY KEY ("id"))',
      undefined,
    );
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
      'ALTER TABLE "reputation" ADD CONSTRAINT "FK_dab63482eb4a70947e0bf27ef8a" FOREIGN KEY ("message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_dab63482eb4a70947e0bf27ef8a"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_0ca5aaff74c6eadcf6cc0fdf9ff"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_092d6c747696d58b9e627565bda"', undefined);
    await queryRunner.query('ALTER TABLE "reputation" DROP CONSTRAINT "FK_6318e7cab1e73a7d58d4373c7a6"', undefined);
    await queryRunner.query('DROP TABLE "reputation"', undefined);
  }
}
