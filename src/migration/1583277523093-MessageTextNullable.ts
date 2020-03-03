/* eslint-disable @typescript-eslint/no-explicit-any */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class MessageTextNullable1583277523093 implements MigrationInterface {
  name = 'MessageTextNullable1583277523093';

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" ALTER COLUMN "text" DROP NOT NULL', undefined);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE "messages" ALTER COLUMN "text" SET NOT NULL', undefined);
  }
}
