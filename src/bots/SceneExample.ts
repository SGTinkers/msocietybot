import Composer from 'telegraf/composer';
import Stage from 'telegraf/stage';
import Scene from 'telegraf/scenes/base';
import session from 'telegraf/session';

const { leave } = Stage;

// Create scene
const scene = new Scene('welcome_setup');
scene.enter(ctx => ctx.reply('Hi'));
scene.leave(ctx => ctx.reply('Bye'));
scene.hears(/hi/gi, leave());
scene.on('message', ctx => ctx.reply('Send `hi`'));

// Set stage, and register scene
const stage = new Stage();
stage.command('cancel', leave());
stage.register(scene);

// Create bot and register stage middleware.
// Set command to trigger scene.
const bot = new Composer();
bot.use(session());
bot.use(stage.middleware());
bot.command('welcome_setup', ctx => ctx.scene.enter('welcome_setup'));

export default bot;
