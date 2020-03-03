import { createConnection, getConnectionOptions, ConnectionOptions, getManager } from 'typeorm';
import Telegraf, { ContextMessageUpdate, Middleware } from 'telegraf';

async function setupConnection(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  return await createConnection(connectionOptions);
}

export async function createApp(
  middlewares: Array<Middleware<ContextMessageUpdate>>,
  typeOrmConnectionOptions?: ConnectionOptions,
) {
  const connection = await setupConnection(typeOrmConnectionOptions);

  const bot = new Telegraf(process.env.BOT_TOKEN);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bot.context as Record<string, any>).entityManager = getManager(connection.name);
  middlewares.forEach(middleware => bot.use(middleware));

  return bot;
}
