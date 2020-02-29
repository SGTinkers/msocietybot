import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { unlinkSync, rmdirSync } from 'fs';
import { uuid } from 'uuidv4';
import { createApp } from './app';
import { cleanUp } from './testUtils/BotMock';

const TESTDB_BASE_DIR = './.testdb';

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;
  process.env.BOT_API_ROOT = 'http://localhost';

  const name = uuid();
  const database = `${TESTDB_BASE_DIR}/${name}.db`;

  try {
    unlinkSync(database);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const app = await createApp({
    synchronize: true,
    type: 'sqlite',
    name: name,
    database: database,
  });
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
  cleanUp();
});

afterAll(() => {
  try {
    rmdirSync(TESTDB_BASE_DIR, { recursive: true });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});
