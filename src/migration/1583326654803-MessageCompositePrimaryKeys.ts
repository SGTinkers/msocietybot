/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageCompositePrimaryKeys1583326654803 implements MigrationInterface {
  name = 'MessageCompositePrimaryKeys1583326654803';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "messages" DROP CONSTRAINT "FK_4069a648e1bc903d5e4928ac25a" CASCADE',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" DROP CONSTRAINT "FK_c9f3fcb8ef9ec7d732a623244fc" CASCADE',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_0d8383b9e259368e426bb2a772a" CASCADE', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "FK_f2cbbc177159c7b7e2a1e93c1e4" CASCADE',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_f2cbbc177159c7b7e2a1e93c1e"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "pinned_message_chat" bigint', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "forward_from_message_chat" bigint', undefined);
    await queryRunner.query('ALTER TABLE "chats" ADD "pinned_message_chat" bigint', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD "messages_chat_id" bigint NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "PK_eabc3a9375af71aa6cd29657c8d" CASCADE',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "PK_641657a7975d5f2699f04d4517d" PRIMARY KEY ("messages_id", "user_id", "messages_chat_id")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" DROP CONSTRAINT "PK_18325f38ae6de43878487eff986" CASCADE',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "PK_9a489ce7e933b30a43f599f29f9" PRIMARY KEY ("id", "chat_id")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" CASCADE',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" ALTER COLUMN "chat_id" SET NOT NULL', undefined);
    await queryRunner.query(
      'CREATE INDEX "IDX_c9b630a8c6797b8c58d62984c8" ON "messages_users_joined_user" ("messages_id", "messages_chat_id") ',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7f81219c47b09bd26197d253b8c" FOREIGN KEY ("pinned_message_id", "pinned_message_chat") REFERENCES "messages"("id","chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_0d4a0a3f31c0c82d8ca936d8752" FOREIGN KEY ("forward_from_message_id", "forward_from_message_chat") REFERENCES "messages"("id","chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "FK_2792176a81b1ed4887f32f30c17" FOREIGN KEY ("pinned_message_id", "pinned_message_chat") REFERENCES "messages"("id","chat_id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "FK_c9b630a8c6797b8c58d62984c8b" FOREIGN KEY ("messages_id", "messages_chat_id") REFERENCES "messages"("id","chat_id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "FK_c9b630a8c6797b8c58d62984c8b"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_2792176a81b1ed4887f32f30c17"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_0d4a0a3f31c0c82d8ca936d8752"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7f81219c47b09bd26197d253b8c"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"', undefined);
    await queryRunner.query('DROP INDEX "IDX_c9b630a8c6797b8c58d62984c8"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ALTER COLUMN "chat_id" DROP NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "PK_9a489ce7e933b30a43f599f29f9"', undefined);
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" DROP CONSTRAINT "PK_641657a7975d5f2699f04d4517d"',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "PK_eabc3a9375af71aa6cd29657c8d" PRIMARY KEY ("messages_id", "user_id")',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages_users_joined_user" DROP COLUMN "messages_chat_id"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP COLUMN "pinned_message_chat"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "forward_from_message_chat"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "pinned_message_chat"', undefined);
    await queryRunner.query(
      'CREATE INDEX "IDX_f2cbbc177159c7b7e2a1e93c1e" ON "messages_users_joined_user" ("messages_id") ',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages_users_joined_user" ADD CONSTRAINT "FK_f2cbbc177159c7b7e2a1e93c1e4" FOREIGN KEY ("messages_id") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "FK_0d8383b9e259368e426bb2a772a" FOREIGN KEY ("pinned_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_c9f3fcb8ef9ec7d732a623244fc" FOREIGN KEY ("forward_from_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_4069a648e1bc903d5e4928ac25a" FOREIGN KEY ("pinned_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }
}
