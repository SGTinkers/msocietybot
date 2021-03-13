import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { uuid } from 'uuidv4';
import { createApp, createConnection } from './app';
import { cleanUpTelegramMock, initTelegramMock } from './testUtils/TelegramMock';
import { RunBot } from './types/testOnly';
import { Connection, getManager } from 'typeorm';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import { createDatabase } from 'pg-god';
import createDebug from 'debug';

const debugTestcontainers = createDebug('testcontainers');

jest.setTimeout(15000);
jest.retryTimes(3);

let postgresContainer: StartedTestContainer | undefined = undefined;
let connection: Connection | undefined = undefined;

beforeAll(async () => {
  if (process.env.TEST_USE_DOCKER) {
    debugTestcontainers('Starting container...');
    postgresContainer = await new GenericContainer('postgres')
      .withEnv('POSTGRES_PASSWORD', 'postgres')
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('[1] LOG:  database system is ready to accept connections'))
      .start();
    debugTestcontainers('Started container.');
  }
});

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;

  const name = uuid();
  let host = process.env.POSTGRES_HOST || 'localhost';
  let port: number = parseInt(process.env.POSTGRES_PORT) || 5432;

  if (process.env.TEST_USE_DOCKER) {
    host = postgresContainer.getContainerIpAddress();
    port = postgresContainer.getMappedPort(5432);
  }

  const databaseName = `msociety_bot_test_${name}`;
  await createDatabase(
    { databaseName: databaseName },
    {
      host,
      port,
      user: process.env.POSTGRES_USERNAME || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
    },
  );
  connection = await createConnection({
    name: name,
    type: 'postgres',
    host: host,
    port: port,
    username: process.env.POSTGRES_USERNAME || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: databaseName,
  });

  const runBot: RunBot = async (bots, setupMock, options) => {
    const { messages, sendMessage, sendEditedMessage, buildMocks, unconsumedMocks, whenBotSends } = initTelegramMock();
    if (setupMock) {
      await setupMock({ whenBotSends, sendMessage, sendEditedMessage });
    }
    buildMocks();

    const app = createApp(connection, bots);
    await app.launch();
    global['app'] = app;

    await new Promise(r =>
      setTimeout(() => {
        app.stop(r);
      }, options?.timeout ?? 200),
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
  await connection?.dropDatabase();
  await connection?.close();
  if (global['app']) {
    await global['app'].stop();
  } else if (global['testSetupCompleted']) {
    await postgresContainer?.stop();
    // used when the test gets stuck, comment it out (if test behaves weird) to debug
    process.exit(1);
  }
  cleanUpTelegramMock();
});

afterAll(async () => {
  await postgresContainer?.stop();
});
