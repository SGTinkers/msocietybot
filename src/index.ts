import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import Telegraf from 'telegraf';

async function main(): Promise<void> {
  await createConnection();

  const bot = new Telegraf(process.env.BOT_TOKEN);
  bot.launch();
}

main().catch(error => console.error(error));
