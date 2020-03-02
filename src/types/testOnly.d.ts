/* eslint-disable no-var */
import { Message } from 'telegram-typings';

export type SendBotMessage = (
  message: Message | string,
  act?: ({ whenBotSends }) => void | Promise<void>,
  options?: { timeout?: number },
) => Promise<Message[]>;

declare global {
  const sendBotMessage: SendBotMessage;
}
