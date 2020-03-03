import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createApp } from './app';
import Bots from './bots';

createApp(Object.values(Bots))
  .then(app => app.launch())
  .catch(error => console.error(error));
