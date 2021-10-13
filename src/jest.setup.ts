import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { uuid } from 'uuidv4';
import { createApp, createConnection, migrate } from './app';
import { cleanUpTelegramMock, initTelegramMock } from './testUtils/TelegramMock';
import { RunBot } from './types/testOnly';
import { Connection, getManager } from 'typeorm';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';
import createDebug from 'debug';
import { Client } from 'pg';

const debugTestcontainers = createDebug('testcontainers');

jest.setTimeout(15000);

let host = process.env.POSTGRES_HOST || 'localhost';
let port: number = parseInt(process.env.POSTGRES_PORT) || 5432;
const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || 'postgres';
const templateDbName = `msocietybot_test_template_${uuid().replace(/-/g, '_')}`;
let postgresContainer: StartedTestContainer | undefined = undefined;
let connection: Connection | undefined = undefined;
let pgClient: Client | undefined = undefined;

beforeAll(async () => {
  if (process.env.TEST_USE_DOCKER) {
    debugTestcontainers('Starting container...');
    postgresContainer = await new GenericContainer('postgres')
      .withEnv('POSTGRES_PASSWORD', 'postgres')
      .withExposedPorts(5432)
      .withWaitStrategy(Wait.forLogMessage('[1] LOG:  database system is ready to accept connections'))
      .start();
    debugTestcontainers('Started container.');

    host = postgresContainer.getContainerIpAddress();
    port = postgresContainer.getMappedPort(5432);
  }

  await connectToPg();
  await createDb(templateDbName);
  const templateConnection = await createConnection({
    name: templateDbName,
    type: 'postgres',
    host: host,
    port: port,
    username: username,
    password: password,
    database: templateDbName,
  });
  await migrate(templateConnection);
  await templateConnection.close();
});

beforeEach(async () => {
  process.env.BOT_TOKEN = undefined;

  const name = uuid();
  const databaseName = `msociety_bot_test_${name.replace(/-/g, '_')}`;
  await createDbFromTemplate(databaseName);
  connection = await createConnection({
    name: name,
    type: 'postgres',
    host: host,
    port: port,
    username: username,
    password: password,
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
        app.stop();
        r(undefined);
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
  await dropDbIfExists(templateDbName);
  await pgClient?.end();
  await postgresContainer?.stop();
});

async function connectToPg() {
  pgClient = new Client({
    host: host,
    port: port,
    user: username,
    password: password,
    database: 'postgres',
  });
  await pgClient.connect();
}

async function createDb(databaseName: string) {
  await dropDbIfExists(databaseName);
  await pgClient.query(`CREATE DATABASE ${databaseName};`);
}

async function dropDbIfExists(databaseName: string) {
  try {
    await pgClient?.query(`DROP DATABASE ${databaseName};`);
    // eslint-disable-next-line no-empty
  } catch (e) {}
}

async function createDbFromTemplate(databaseName: string) {
  await pgClient.query(`CREATE DATABASE ${databaseName} WITH TEMPLATE ${templateDbName};`);
}
