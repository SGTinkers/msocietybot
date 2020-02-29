import { createConnection } from 'typeorm';
import Telegraf from 'telegraf';

export async function createApp() {
  await createConnection();

  const bot = new Telegraf(
    process.env.BOT_TOKEN,
    process.env.BOT_API_ROOT ? { telegram: { apiRoot: process.env.BOT_API_ROOT } } : undefined,
  );

  bot.hears('hello', ctx => ctx.reply('world'));

  return bot;
}
