import createDebug from 'debug';
import Composer from 'telegraf/composer';

const debug = createDebug('msocietybot');

export const DebugBot = new Composer();
DebugBot.on('message', (ctx, next) => {
  debug('event:message: %O', ctx.message);
  next();
});
