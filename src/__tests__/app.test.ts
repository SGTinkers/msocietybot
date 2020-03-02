describe('app', () => {
  it('bot should reply with world when hello is received', async () => {
    const messages = await sendBotMessage('hello');

    console.log(messages);
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
});
