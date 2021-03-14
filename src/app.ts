import {
  createConnection as createTypeOrmConnection,
  getConnectionOptions,
  ConnectionOptions,
  getManager,
  Connection,
} from 'typeorm';
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';
import createDebug from 'debug';

const debugDb = createDebug('db');

export async function createConnection(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  const connection = await createTypeOrmConnection(connectionOptions);
  if (!connectionOptions.synchronize) {
    await migrate(connection);
  }

  return connection;
}

export async function migrate(connection: Connection) {
  const migrations = await connection.runMigrations({ transaction: 'all' });
  migrations.forEach(migration => {
    debugDb('DB: Migrated ' + migration.name + ' (' + migration.timestamp + ').');
  });

  if (migrations.length === 0) {
    debugDb('DB: All good! Nothing to migrate.');
  }
}

export function createApp(connection: Connection, middlewares: Array<Middleware<ContextMessageUpdate>>) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bot.context as Record<string, any>).entityManager = getManager(connection.name);

  middlewares.forEach(middleware => bot.use(middleware));

  return bot;
}
