import { config as dotenv } from 'dotenv';
dotenv();
import 'reflect-metadata';
import { app } from './app';

app().catch(error => console.error(error));
