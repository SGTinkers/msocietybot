/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1582812183651 implements MigrationInterface {
  name = 'InitialMigration1582812183651';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "role_id" integer, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "display_name" character varying, "description" character varying, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "users_preferences" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "user_id" bigint, CONSTRAINT "PK_df9f09b89f65406d986a896e9ba" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_a97e76577c1cfb97f7efc663e5" ON "users_preferences" ("user_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "messages" ("id" bigint NOT NULL, "unixtime" bigint NOT NULL, "original_unixtime" bigint, "last_edit" TIMESTAMP, "edit_history" text, "album_id" character varying, "signature" character varying, "text" character varying NOT NULL, "payload" character varying, "entities" text, "caption" character varying, "caption_entities" text, "audio" text, "document" text, "photo" text, "sticker" text, "voice" text, "video_note" text, "video" text, "contact" text, "location" text, "venue" text, "new_group_title" character varying, "new_group_photo" text, "users_joined" character varying, "group_photo_deleted" boolean, "group_photo_created" boolean, "supergroup_created" boolean, "channel_created" boolean, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "sender_id" bigint, "reply_to_message_id" bigint, "chat_id" bigint, "original_sender_id" bigint, "original_chat_id" bigint, "user_joined_id" bigint, "user_left_id" bigint, "migrate_to_chat_id" bigint, "migrate_from_chat_id" bigint, "pinned_message_id" bigint, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "user" ("id" bigint NOT NULL, "username" character varying, "first_name" character varying, "last_name" character varying, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "chats_preferences" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "chat_id" bigint, CONSTRAINT "PK_c76a4c19bb5eca7e0002b970fec" PRIMARY KEY ("id", "key"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_b638bdbf0d286b303ac2639d26" ON "chats_preferences" ("chat_id", "key") ',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "chats" ("id" bigint NOT NULL, "type" character varying NOT NULL, "title" character varying, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "deleted_at" TIMESTAMP, "user_id" bigint, CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE "user_roles" ("user_id" bigint NOT NULL, "role_id" integer NOT NULL, CONSTRAINT "PK_23ed6f04fe43066df08379fd034" PRIMARY KEY ("user_id", "role_id"))',
      undefined,
    );
    await queryRunner.query('CREATE INDEX "IDX_87b8888186ca9769c960e92687" ON "user_roles" ("user_id") ', undefined);
    await queryRunner.query('CREATE INDEX "IDX_b23c65e50a758245a33ee35fda" ON "user_roles" ("role_id") ', undefined);
    await queryRunner.query(
      'ALTER TABLE "permissions" ADD CONSTRAINT "FK_f10931e7bb05a3b434642ed2797" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "users_preferences" ADD CONSTRAINT "FK_cf08e0df86a017203c6075fd113" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_22133395bd13b970ccd0c34ab22" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67" FOREIGN KEY ("reply_to_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7540635fef1922f0b156b9ef74f" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_125663bf804e4c0e3fc2cffab17" FOREIGN KEY ("original_sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_7538eecd947631f054b91ffe6ac" FOREIGN KEY ("original_chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_a68c86f2ff7e0a7dbfb2dcc9a65" FOREIGN KEY ("user_joined_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_4eec01b11cb4f66e2b49dd21947" FOREIGN KEY ("user_left_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_54e96628c7652cf412c39828156" FOREIGN KEY ("migrate_to_chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_5799250bd7acc0eeda514e80646" FOREIGN KEY ("migrate_from_chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "messages" ADD CONSTRAINT "FK_4069a648e1bc903d5e4928ac25a" FOREIGN KEY ("pinned_message_id") REFERENCES "messages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" ADD CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "chats" ADD CONSTRAINT "FK_b6c92d818d42e3e298e84d94414" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"', undefined);
    await queryRunner.query('ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"', undefined);
    await queryRunner.query('ALTER TABLE "chats" DROP CONSTRAINT "FK_b6c92d818d42e3e298e84d94414"', undefined);
    await queryRunner.query(
      'ALTER TABLE "chats_preferences" DROP CONSTRAINT "FK_f66ca9ae3490db14fd3d3546546"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_4069a648e1bc903d5e4928ac25a"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_5799250bd7acc0eeda514e80646"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_54e96628c7652cf412c39828156"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_4eec01b11cb4f66e2b49dd21947"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_a68c86f2ff7e0a7dbfb2dcc9a65"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7538eecd947631f054b91ffe6ac"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_125663bf804e4c0e3fc2cffab17"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7540635fef1922f0b156b9ef74f"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_7f87cbb925b1267778a7f4c5d67"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP CONSTRAINT "FK_22133395bd13b970ccd0c34ab22"', undefined);
    await queryRunner.query(
      'ALTER TABLE "users_preferences" DROP CONSTRAINT "FK_cf08e0df86a017203c6075fd113"',
      undefined,
    );
    await queryRunner.query('ALTER TABLE "permissions" DROP CONSTRAINT "FK_f10931e7bb05a3b434642ed2797"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b23c65e50a758245a33ee35fda"', undefined);
    await queryRunner.query('DROP INDEX "IDX_87b8888186ca9769c960e92687"', undefined);
    await queryRunner.query('DROP TABLE "user_roles"', undefined);
    await queryRunner.query('DROP TABLE "chats"', undefined);
    await queryRunner.query('DROP INDEX "IDX_b638bdbf0d286b303ac2639d26"', undefined);
    await queryRunner.query('DROP TABLE "chats_preferences"', undefined);
    await queryRunner.query('DROP TABLE "user"', undefined);
    await queryRunner.query('DROP TABLE "messages"', undefined);
    await queryRunner.query('DROP INDEX "IDX_a97e76577c1cfb97f7efc663e5"', undefined);
    await queryRunner.query('DROP TABLE "users_preferences"', undefined);
    await queryRunner.query('DROP TABLE "roles"', undefined);
    await queryRunner.query('DROP TABLE "permissions"', undefined);
  }
}
