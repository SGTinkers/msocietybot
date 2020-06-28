import Composer from 'telegraf/composer';
import { EntityManager } from 'typeorm';
import { Chat as TelegramChat, User as TelegramUser } from 'telegram-typings';
import { Message } from '../entity/Message';

const bot = new Composer();
const WelcomeMessage = {
  newMember: `Would you mind doing a short intro of yourself? :) The members would be interested to know the following:

  1. Some background of your academics
  2. Your current job/situation
  3. Your tech interest/aspirations
  
  If you found a message in this group helpful, reply to the message with a 👍🏻 or 💯 to upvote the author. The points accumulated does not have any value though but only for posterity sake! 😄
  
  Also, follow us on socmed:
  IG: @msociety.tech
  Twitter: @msociety_tech
  
  Related Channels/Chats:
  1) @MSOCIETYChannel : Up to date announcements on career opportunities and upcoming events
  2) @MSOCIETYIdeas : Idea dumping ground extracted from lobby discussions
  3) @MSOCIETYSoftwareDev : Discussions on Software Dev
  4) @MSOCIETYML : DIscussions on AI/ML`,
  returningMember: 'Welcome back',
};

bot.on('new_chat_members', ctx => {
  ctx.message.new_chat_members.forEach(async (member: TelegramUser) => {
    if (!member.is_bot) {
      // TODO: Set/get welcome message from db?
      if (await isUserRejoining(ctx.entityManager, member, ctx.message.chat)) {
        ctx.reply(`${WelcomeMessage.returningMember} [${member.first_name}](tg://user?id=${member.id})`, {
          parse_mode: 'Markdown',
        });
      } else {
        ctx.reply(
          `Let's welcome <a href="tg://user?id=${member.id}">${member.first_name}</a>!\n Hi <a href="tg://user?id=${member.id}">${member.first_name}</a> ${WelcomeMessage.newMember} `,
          { parse_mode: 'html' },
        );
      }
    }
  });
});

export { bot as WelcomeBot };

async function isUserRejoining(
  entityManager: EntityManager,
  telegramUser: TelegramUser,
  telegramChat: TelegramChat,
): Promise<boolean> {
  const userJoinedChatMessageCount = await entityManager
    .createQueryBuilder(Message, 'message')
    .innerJoin('message.usersJoined', 'uj', 'uj.id = :uj_id', { uj_id: telegramUser.id })
    .innerJoin('message.chat', 'c', 'c.id = :chat_id', { chat_id: telegramChat.id })
    .getCount();
  return userJoinedChatMessageCount > 1;
}
