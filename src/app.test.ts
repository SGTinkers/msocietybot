import { createApp } from './app';
import nock from 'nock';

describe('test', () => {
  it('this test does nothing except to check that ts-jest is working', async () => {
    nock(process.env.BOT_API_ROOT)
      .get(/\/bot(.+?)\/getUpdates/)
      .reply(200, { ok: true, result: [] })
      .persist();
    nock(process.env.BOT_API_ROOT)
      .post(/\/bot(.+?)\/getUpdates/)
      .reply(200, { ok: true, result: [] })
      .persist();
    nock(process.env.BOT_API_ROOT)
      .post(/\/bot(.+?)\/getMe/)
      .reply(200, {
        ok: true,
        result: {
          username: 'Test Name',
          // eslint-disable-next-line @typescript-eslint/camelcase
          first_name: 'Test First name',
          id: 666,
        },
      })
      .persist();
    nock(process.env.BOT_API_ROOT)
      .post(/\/bot(.+?)\/deleteWebhook/)
      .reply(200, { ok: true, result: true, description: 'Webhook was deleted' })
      .persist();

    const app = await createApp();
    app.stop();
  });
});
