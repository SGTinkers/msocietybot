import { ReplyFnResult } from 'nock';
import { Middleware, Context } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
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
  sendEditedMessage: (message: Message | string) => void;
}

export type RunBot = (
  bots: Array<Middleware<Context>>,
  act?: (args: ActArgs) => void | Promise<void>,
  options?: { timeout?: number },
) => Promise<Message[]>;

declare global {
  const runBot: RunBot;
  const entityManager: EntityManager;
}
