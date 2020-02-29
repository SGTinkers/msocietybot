import Composer from 'telegraf/composer';
const PhotoURL = 'https://picsum.photos/200/300/?random';

const bot = new Composer();
bot.start(ctx => ctx.reply('Hello there!'));
bot.help(ctx => ctx.reply('Help message'));
bot.command('photo', ctx => ctx.replyWithPhoto({ url: PhotoURL }));

export default bot;
