import { Context } from 'telegraf';
import { EntityManager } from 'typeorm';

export interface MsocietyBotContext extends Context {
  entityManager: EntityManager;
}
