import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { uuid } from 'uuidv4';
import { createApp, createConnection } from './app';
import { cleanUpTelegramMock, initTelegramMock } from './testUtils/TelegramMock';
import { RunBot } from './types/testOnly';
import { getManager } from 'typeorm';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

jest.setTimeout(15000);

let postgresContainer: StartedTestContainer;

beforeAll(async () => {
  console.log('Starting container');
  postgresContainer = await new GenericContainer('postgres')
    .withEnv('POSTGRES_PASSWORD', 'postgres')
    .withExposedPorts(5432)
    .withWaitStrategy(Wait.forLogMessage('[1] LOG:  database system is ready to accept connections'))
    .start();
  console.log('Started container');
});

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;

  const name = uuid();

  console.log(
    `Connecting to db: ${postgresContainer.getContainerIpAddress()}:${postgresContainer.getMappedPort(5432)}`,
  );
  const connection = await createConnection({
    name: name,
    type: 'postgres',
    host: postgresContainer.getContainerIpAddress(),
    port: postgresContainer.getMappedPort(5432),
    username: 'postgres',
    password: 'postgres',
    database: `msociety_bot_test_${name}`,
    synchronize: true,
  });

  console.log('Connected to db');

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
  if (global['app']) {
    await global['app'].stop();
  } else if (global['testSetupCompleted']) {
    await postgresContainer.stop();
    // used when the test gets stuck, comment it out (if test behaves weird) to debug
    process.exit(1);
  }
  cleanUpTelegramMock();
});

afterAll(async () => {
  await postgresContainer.stop();
});
