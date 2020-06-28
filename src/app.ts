import {
  createConnection as createTypeOrmConnection,
  getConnectionOptions,
  ConnectionOptions,
  getManager,
  Connection,
} from 'typeorm';
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';

export async function createConnection(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  if (!connectionOptions.synchronize) {
    const connection = await createTypeOrmConnection(connectionOptions);
    const migrations = await connection.runMigrations({ transaction: 'all' });
    migrations.forEach(migration => {
      if (process.env.npm_lifecycle_event !== 'test') {
        console.log('DB: Migrated ' + migration.name + ' (' + migration.timestamp + ').');
      }
    });

    if (migrations.length === 0) {
      if (process.env.npm_lifecycle_event !== 'test') {
        console.log('DB: All good! Nothing to migrate.');
      }
    }
    await connection.close();
  }

  return await createTypeOrmConnection(connectionOptions);
}

export function createApp(connection: Connection, middlewares: Array<Middleware<ContextMessageUpdate>>) {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bot.context as Record<string, any>).entityManager = getManager(connection.name);

  middlewares.forEach(middleware => bot.use(middleware));

  return bot;
}
