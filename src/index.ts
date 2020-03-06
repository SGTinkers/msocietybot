import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createApp, createConnection } from './app';
import createDebug from 'debug';
import { Bots } from './bots';

const debug = createDebug('msocietybot');

createConnection()
  .then(connection => {
    const app = createApp(connection, Object.values(Bots));
    Object.keys(Bots).forEach(bot => debug(bot, 'loaded!'));
    return app;
  })
  .then(app => app.launch())
  .catch(error => console.error(error));
