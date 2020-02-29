import { createConnection } from 'typeorm';
import Telegraf from 'telegraf';

export async function createApp(): Promise<{ launch: Function; stop: Function }> {
  await createConnection();

  const bot = new Telegraf(
    process.env.BOT_TOKEN,
    process.env.BOT_API_ROOT ? { telegram: { apiRoot: process.env.BOT_API_ROOT } } : undefined,
  );

  return bot;
}
