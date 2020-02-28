import { createConnection } from 'typeorm';
import Telegraf from 'telegraf';

export async function app(): Promise<void> {
  await createConnection();

  const bot = new Telegraf(
    process.env.BOT_TOKEN,
    process.env.BOT_API_ROOT ? { telegram: { apiRoot: process.env.BOT_API_ROOT } } : undefined,
  );
  bot.launch();
}
