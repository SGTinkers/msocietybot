import { createConnection, getConnectionOptions, ConnectionOptions } from 'typeorm';
import Telegraf from 'telegraf';
import Bots from './bots';

export async function createApp(typeOrmConnectionOptions?: ConnectionOptions) {
  let connectionOptions = await getConnectionOptions();
  if (typeOrmConnectionOptions) {
    connectionOptions = Object.assign({}, connectionOptions, typeOrmConnectionOptions);
  }
  await createConnection(connectionOptions);

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.hears('hello', ctx => ctx.reply('world'));
  bot.hears('hi', ctx => ctx.reply('holla'));

  bot.use(Bots.WelcomeExample);
  bot.use(Bots.SceneExample);

  return bot;
}
