import createDebug from 'debug';
import { Composer } from 'telegraf';
import { MsocietyBotContext } from '../context';

const debug = createDebug('msocietybot');

export const DebugBot = new Composer<MsocietyBotContext>();
DebugBot.on('message', (ctx, next) => {
  debug('event:message: %O', ctx.message);
  next();
});
DebugBot.on('edited_message', (ctx, next) => {
  debug('event:edited_message: %O', ctx.update.edited_message);
  next();
});
