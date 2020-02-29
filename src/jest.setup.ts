import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { unlinkSync, rmdirSync } from 'fs';
import { uuid } from 'uuidv4';
import { createApp } from './app';

const TESTDB_BASE_DIR = './.testdb';

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;
  process.env.BOT_API_ROOT = 'http://localhost';

  process.env.TYPE_ORM_SYNCHRONIZE = 'true';
  process.env.TYPE_ORM_TYPE = 'sqlite';
  process.env.TYPE_ORM_DATABASE = `${TESTDB_BASE_DIR}/${uuid()}.db`;

  try {
    unlinkSync(process.env.TYPE_ORM_DATABASE);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const app = await createApp();
  const wait = async (ms = 300) => await new Promise(r => setTimeout(r, ms));

  global['app'] = app;
  global['act'] = async (ms?: number) => {
    await app.launch();
    global['app_started'] = true;
    await wait(ms);
  };
});

afterEach(async () => {
  if (global['app_started'] === true) {
    await global['app'].stop();
  } else {
    // used when the test gets stuck
    process.exit(1);
  }
});

afterAll(() => {
  try {
    rmdirSync(TESTDB_BASE_DIR, { recursive: true });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});
