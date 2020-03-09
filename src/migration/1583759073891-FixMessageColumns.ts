/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixMessageColumns1583759073891 implements MigrationInterface {
  name = 'FixMessageColumns1583759073891';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "group_photo_created"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "animation" text', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "game" text', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "group_created" boolean', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "group_created"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "game"', undefined);
    await queryRunner.query('ALTER TABLE "messages" DROP COLUMN "animation"', undefined);
    await queryRunner.query('ALTER TABLE "messages" ADD "group_photo_created" boolean', undefined);
  }
}
