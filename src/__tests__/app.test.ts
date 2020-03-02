describe('app', () => {
  it('bot should reply with world when hello is received', async () => {
    const messages = await sendBotMessage('hello');

    expect(messages.length).toEqual(2);
    expect(messages[1].text).toBe('world');
  });

  it('bot should reply with holla when hi is received', async () => {
    const messages = await sendBotMessage('hi', ({ whenBotSends }) => {
      whenBotSends('holla').thenDoNothing();
    });

    expect(messages.length).toEqual(2);
    expect(messages[1].text).toBe('holla');
  });

  it('bot should reply with world and holla when hello and hi is received', async () => {
    const messages = await sendBotMessage('hello', ({ whenBotSends }) => {
      whenBotSends('world').thenSendBot('hi');
    });

    expect(messages.length).toEqual(4);
    expect(messages[1].text).toBe('world');
    expect(messages[3].text).toBe('holla');
  });
});
