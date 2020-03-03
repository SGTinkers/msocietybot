import Composer from 'telegraf/composer';

const testBot = new Composer();
testBot.hears('hello', ctx => ctx.reply('world'));
testBot.hears('hi', ctx => ctx.reply('holla'));

describe('TelegramMock', () => {
  it('bot should reply with world when hello is received', async () => {
    const { messages } = await runBot([testBot], ({ sendMessage }) => {
      sendMessage('hello');
    });

    expect(messages.length).toEqual(2);
    expect(messages[1].text).toBe('world');
  });

  it('bot should reply with holla when hi is received', async () => {
    const { messages } = await runBot([testBot], ({ whenBotSends, sendMessage }) => {
      sendMessage('hi');
      whenBotSends('holla').thenDoNothing();
    });

    expect(messages.length).toEqual(2);
    expect(messages[1].text).toBe('holla');
  });

  it('bot should reply with world and holla when hello and hi is received', async () => {
    const { messages } = await runBot([testBot], ({ whenBotSends, sendMessage }) => {
      sendMessage('hello');
      whenBotSends('world').thenSendBot('hi');
    });

    expect(messages.length).toEqual(4);
    expect(messages[1].text).toBe('world');
    expect(messages[3].text).toBe('holla');
  });

  it('bot should reply with world (regex matched) and holla when hello and hi is received', async () => {
    const { messages } = await runBot([testBot], ({ whenBotSends, sendMessage }) => {
      sendMessage('hello');
      whenBotSends(/^worl/).thenSendBot('hi');
    });

    expect(messages.length).toEqual(4);
    expect(messages[1].text).toBe('world');
    expect(messages[3].text).toBe('holla');
  });

  it('send message without waiting for bot', async () => {
    const { messages } = await runBot([testBot], ({ sendMessage }) => {
      sendMessage('greetings');
      sendMessage('hi');
    });

    expect(messages.length).toEqual(3);
    expect(messages[0].text).toBe('greetings');
    expect(messages[1].text).toBe('hi');
    expect(messages[2].text).toBe('holla');
  });
});
