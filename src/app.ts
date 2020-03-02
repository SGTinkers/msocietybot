import { createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';

async function setupConnection(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  await createConnection(connectionOptions);
  global['dbConnectionName'] = connectionOptions.name || 'default';
}

export async function createApp(
  middlewares: Array<Middleware<ContextMessageUpdate>>,
  typeOrmConnectionOptions?: ConnectionOptions,
) {
  await setupConnection(typeOrmConnectionOptions);

  const bot = new Telegraf(process.env.BOT_TOKEN);
  middlewares.forEach(middleware => bot.use(middleware));

  return bot;
}
