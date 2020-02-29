import { createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import Telegraf from 'telegraf';
import Bots from './bots';

export async function createApp(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  await createConnection(connectionOptions);

  const bot = new Telegraf(
    process.env.BOT_TOKEN,
    process.env.BOT_API_ROOT ? { telegram: { apiRoot: process.env.BOT_API_ROOT } } : undefined,
  );

  bot.hears('hello', ctx => ctx.reply('world'));
  bot.hears('hi', ctx => ctx.reply('holla'));

  bot.use(Bots.Welcome);
  bot.use(Bots.NewMember);
  return bot;
}
