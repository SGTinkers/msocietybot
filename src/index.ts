import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { createApp } from './app';

createApp()
  .then(app => app.launch())
  .catch(error => console.error(error));
