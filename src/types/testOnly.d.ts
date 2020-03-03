import { Message } from 'telegram-typings';
import { ReplyFnResult } from 'nock';
import { ContextMessageUpdate, Middleware } from 'telegraf';
import { EntityManager } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NockResponse = (uri: string, requestBody: Record<string, any>) => ReplyFnResult;

interface WhenBuilder {
  thenSendBot: (message: Message | NockResponse | string) => WhenBuilder;
  thenDoNothing: () => WhenBuilder;
  persist: () => WhenBuilder;
}

interface ActArgs {
  whenBotSends: (message: Message | string | RegExp) => WhenBuilder;
  sendMessage: (message: Message | string) => void;
}

export type RunBot = (
  bots: Array<Middleware<ContextMessageUpdate>>,
  act?: (args: ActArgs) => void | Promise<void>,
  options?: { timeout?: number },
) => Promise<{ entityManager: EntityManager; messages: Message[] }>;

declare global {
  const runBot: RunBot;
}
