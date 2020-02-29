import { initializeBotMock } from '../testUtils/BotMock';

describe('app', () => {
  it('bot should reply with world when hello is received', async () => {
    const { sendMessage, sentMessages } = initializeBotMock({
      messageForBot: {
        update_id: 1,
        message: {
          message_id: 1,
          from: 1,
          chat: 1,
          date: new Date().toISOString(),
          text: 'hello',
          entities: [],
        },
      },
    });

    await act();

    expect(sendMessage.isDone()).toBe(true);
    expect(sentMessages[0].text).toBe('world');
  });
});
