import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { unlinkSync, rmdirSync } from 'fs';
import { uuid } from 'uuidv4';
import { createApp } from './app';
import { cleanUpTelegramMock, initTelegramMock } from './testUtils/TelegramMock';
import { RunBot } from './types/testOnly';
import { getManager } from 'typeorm';

const TESTDB_BASE_DIR = './.testdb';

beforeEach(() => {
  process.env.BOT_TOKEN = undefined;

  const name = uuid();
  const database = `${TESTDB_BASE_DIR}/${name}.db`;

  try {
    unlinkSync(database);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  const runBot: RunBot = async (bots, setupMock, options) => {
    const { messages, sendMessage, buildMocks, unconsumedMocks, whenBotSends } = initTelegramMock();
    if (setupMock) {
      await setupMock({ whenBotSends, sendMessage });
    }
    buildMocks();

    const app = await createApp(bots, {
      synchronize: true,
      type: 'sqlite',
      name: name,
      database: database,
    });
    await app.launch();
    global['app'] = app;
    await new Promise(r => setTimeout(r, options?.timeout ?? 100));

    const unconsumed = unconsumedMocks();
    if (unconsumed.length > 0) {
      throw new Error(`Found ${unconsumed.length} 'whens' not triggered. Please check your test act again.`);
    }

    return { entityManager: getManager(name), messages };
  };

  global['runBot'] = runBot;
  global['dbConnectionName'] = name;
});

afterEach(async () => {
  if (global['app']) {
    await global['app'].stop();
  } else {
    // used when the test gets stuck, comment it out (if test behaves weird) to debug
    process.exit(1);
  }
  cleanUpTelegramMock();
});

afterAll(() => {
  try {
    rmdirSync(TESTDB_BASE_DIR, { recursive: true });
    // eslint-disable-next-line no-empty
  } catch (e) {}
});
