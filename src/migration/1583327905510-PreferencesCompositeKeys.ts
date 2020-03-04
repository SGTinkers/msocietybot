/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PreferencesCompositeKeys1583327905510 implements MigrationInterface {
  name = 'PreferencesCompositeKeys1583327905510';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "users_preferences" DROP CONSTRAINT "PK_df9f09b89f65406d986a896e9ba"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "users_preferences" DROP COLUMN "id"', undefined);
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" DROP CONSTRAINT "PK_db89e2a3938e6c1dfbfa5bf0664"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "chats_preferences" DROP COLUMN "id"', undefined);
    await queryRunner.query(
      'ALTER TABLE "users_preferences" ADD CONSTRAINT "PK_a97e76577c1cfb97f7efc663e5d" PRIMARY KEY ("key", "user_id")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" ADD CONSTRAINT "PK_b638bdbf0d286b303ac2639d262" PRIMARY KEY ("key", "chat_id")',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" DROP CONSTRAINT "FK_cf08e0df86a017203c6075fd113"',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query('ALTER TABLE "users_preferences" ALTER COLUMN "user_id" SET NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" DROP CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546"',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query('ALTER TABLE "chats_preferences" ALTER COLUMN "chat_id" SET NOT NULL', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" ADD CONSTRAINT "FK_cf08e0df86a017203c6075fd113" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" ADD CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" DROP CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546"',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" DROP CONSTRAINT "FK_cf08e0df86a017203c6075fd113"',
      undefined,
    );
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query('ALTER TABLE "chats_preferences" ALTER COLUMN "chat_id" DROP NOT NULL', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("key", "chat_id") ',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" ADD CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "users_preferences" ALTER COLUMN "user_id" DROP NOT NULL', undefined);
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("key", "user_id") ',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" ADD CONSTRAINT "FK_cf08e0df86a017203c6075fd113" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" DROP CONSTRAINT "PK_b638bdbf0d286b303ac2639d262"',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" DROP CONSTRAINT "PK_a97e76577c1cfb97f7efc663e5d"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "chats_preferences" ADD "id" SERIAL NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" ADD CONSTRAINT "PK_db89e2a3938e6c1dfbfa5bf0664" PRIMARY KEY ("id")',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "users_preferences" ADD "id" SERIAL NOT NULL', undefined);
    await queryRunner.query(
      'ALTER TABLE "users_preferences" ADD CONSTRAINT "PK_df9f09b89f65406d986a896e9ba" PRIMARY KEY ("id")',
      undefined,
    );
  }
}
