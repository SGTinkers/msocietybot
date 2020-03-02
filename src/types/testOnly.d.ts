import { Message } from 'telegram-typings';
import { ReplyFnResult } from 'nock';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NockResponse = (uri: string, requestBody: Record<string, any>) => ReplyFnResult;

interface WhenBuilder {
  thenSendBot: (message: Message | NockResponse | string) => WhenBuilder;
  thenDoNothing: () => WhenBuilder;
  persist: () => WhenBuilder;
}

interface ActArgs {
  whenBotSends: (message: Message | string) => WhenBuilder;
  sendMessage: (message: Message | string) => void;
}

export type RunBot = (
  act?: (args: ActArgs) => void | Promise<void>,
  options?: { timeout?: number },
) => Promise<Message[]>;

declare global {
  const runBot: RunBot;
  const dbConnectionName: string;
}
