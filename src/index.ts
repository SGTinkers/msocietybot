import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createApp } from './app';
import Bots from './bots';

createApp([Bots.SceneExample, Bots.WelcomeExample])
  .then(app => app.launch())
  .catch(error => console.error(error));
