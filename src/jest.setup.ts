import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { unlinkSync, rmdirSync } from 'fs';
import { uuid } from 'uuidv4';

const TESTDB_BASE_DIR = './.testdb';

beforeEach(() => {
  process.env.BOT_TOKEN = undefined;
  process.env.BOT_API_ROOT = 'http://localhost';

  process.env.TYPE_ORM_SYNCHRONIZE = 'true';
  process.env.TYPE_ORM_TYPE = 'sqlite';
  process.env.TYPE_ORM_LOGGING = 'true';
  process.env.TYPE_ORM_DATABASE = `${TESTDB_BASE_DIR}/${uuid()}.db`;

  try {
    unlinkSync(process.env.TYPE_ORM_DATABASE);
    // eslint-disable-next-line no-empty
  } catch (e) {}
});

afterAll(() => {
  try {
    rmdirSync(TESTDB_BASE_DIR, { recursive: true });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});
