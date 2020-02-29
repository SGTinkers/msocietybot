/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';

export function initializeBotMock({ messageForBot }) {
  nock.disableNetConnect();

  nock(process.env.BOT_API_ROOT)
    .get(/\/bot(.+?)\/getUpdates/)
    .reply(200, { ok: true, result: [] })
    .persist();
  const getUpdates = nock(process.env.BOT_API_ROOT)
    .post(/\/bot(.+?)\/getUpdates/)
    .reply(200, {
      ok: true,
      result: [messageForBot],
    });
  nock(process.env.BOT_API_ROOT)
    .post(/\/bot(.+?)\/getUpdates/)
    .reply(200, { ok: true, result: [] })
    .persist();
  const getMe = nock(process.env.BOT_API_ROOT)
    .post(/\/bot(.+?)\/getMe/)
    .reply(200, {
      ok: true,
      result: {
        username: 'Test Name',
        first_name: 'Test First name',
        id: 666,
      },
    })
    .persist();
  const sentMessages = [];
  const sendMessage = nock(process.env.BOT_API_ROOT)
    .post(/\/bot(.+?)\/sendMessage/)
    .reply(200, function(_uri, requestBody: Record<string, any>) {
      sentMessages.push({ ...requestBody });
      return {
        ok: true,
        result: null,
      };
    })
    .persist();
  const deleteWebhook = nock(process.env.BOT_API_ROOT)
    .post(/\/bot(.+?)\/deleteWebhook/)
    .reply(200, { ok: true, result: true, description: 'Webhook was deleted' })
    .persist();

  return {
    getUpdates,
    getMe,
    sendMessage,
    sentMessages,
    deleteWebhook,
  };
}
