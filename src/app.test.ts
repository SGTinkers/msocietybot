import { app } from './app';

describe('test', () => {
  it('this test does nothing except to check that ts-jest is working', async () => {
    await app();
  });
});
