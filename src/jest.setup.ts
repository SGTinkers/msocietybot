import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { rmdirSync, mkdirSync } from 'fs';
import { uuid } from 'uuidv4';
import { createApp, createConnection } from './app';
import { cleanUpTelegramMock, initTelegramMock } from './testUtils/TelegramMock';
import { RunBot } from './types/testOnly';
import { getManager } from 'typeorm';

const TESTDB_BASE_DIR = './.testdb';

beforeAll(() => {
  try {
    rmdirSync(TESTDB_BASE_DIR, { recursive: true });
    // eslint-disable-next-line no-empty
  } catch (e) {}

  mkdirSync(TESTDB_BASE_DIR);
});

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;

  const name = uuid();
  const database = `${TESTDB_BASE_DIR}/${name}.db`;

  const connection = await createConnection({
    // NOTE: When creating migration for test, ensure to delete all lines related to temporary_messages
    migrations: ['src/testUtils/migration/**/*.ts'],
    type: 'sqlite',
    name: name,
    database: database,
  });

  const runBot: RunBot = async (bots, setupMock, options) => {
    const { messages, sendMessage, buildMocks, unconsumedMocks, whenBotSends } = initTelegramMock();
    if (setupMock) {
      await setupMock({ whenBotSends, sendMessage });
    }
    buildMocks();

    const app = createApp(connection, bots);
    await app.launch();
    global['app'] = app;

    await new Promise(r =>
      setTimeout(() => {
        app.stop(r);
      }, options?.timeout ?? 500),
    );

    const unconsumed = unconsumedMocks();
    if (unconsumed.length > 0) {
      throw new Error(`Found ${unconsumed.length} 'whens' not triggered. Please check your test act again.`);
    }

    return messages;
  };

  global['runBot'] = runBot;
  global['entityManager'] = getManager(name);
  global['testSetupCompleted'] = true;
});

afterEach(async () => {
  if (global['app']) {
    await global['app'].stop();
  } else if (global['testSetupCompleted']) {
    // used when the test gets stuck, comment it out (if test behaves weird) to debug
    process.exit(1);
  }
  cleanUpTelegramMock();
});
