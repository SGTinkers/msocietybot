/* eslint-disable @typescript-eslint/no-explicit-any */
import nock, { ReplyFnResult } from 'nock';
import { Update, Message, User, Chat } from 'telegram-typings';
import { NockResponse } from '../types/testOnly';
import { isRegExp } from 'util';

type Predicate = (uri: string, requestBody: Record<string, any>) => boolean;
interface ResponseGenerator {
  predicate: Predicate;
  respond: NockResponse;
  persist?: boolean;
}

const globals = {
  updateId: 1,
  messageId: 1,
};

const BOT_USER: User = {
  id: 1000000,
  is_bot: true,
  first_name: 'Bot',
  username: 'Bot',
};

const USER_USER: User = {
  id: 1,
  is_bot: false,
  first_name: 'User',
};

const CHAT: Chat = {
  id: -2,
  type: 'group',
};

export function initTelegramMock() {
  const messages: Message[] = [];
  const getUpdatesResponses: ReplyFnResult[] = [];
  const whens: ResponseGenerator[] = [];
  const whensCalled: ResponseGenerator[] = [];
  const whenBuilders: WhenBuilder[] = [];

  const whenBotSends = message => {
    const whenBuilder = new WhenBuilder(message);
    whenBuilders.push(whenBuilder);
    return whenBuilder;
  };

  const buildMocks = () => {
    whenBuilders.forEach(whenBuilder => {
      whens.push(whenBuilder.buildResponseGenerator());
    });
  };

  const getUpdatesHandler: NockResponse = function() {
    const response = getUpdatesResponses.shift();
    if (!response) {
      return [200, { ok: true, result: [] }];
    }

    const results = (response[1] as any).result as Update[];
    results.forEach(result => {
      if (result.message) {
        messages.push(result.message);
      }
    });

    return response;
  };

  const sendMessage = (m: Message | string) => {
    const message: Message = createUserMessage(m);

    getUpdatesResponses.push(
      updateReplyResult([
        {
          update_id: globals.updateId++,
          message: message,
        },
      ]),
    );
  };

  const sendMessageHandler: NockResponse = function(uri, requestBody) {
    const message: Message = createBotMessage(requestBody.text);
    messages.push(message);

    const matchingIndex = whens.findIndex(value => value.predicate(uri, requestBody));
    if (matchingIndex === -1) {
      return [200, { ok: true, result: message }];
    }

    const when = whens[matchingIndex];
    if (!when.persist) {
      whens.splice(matchingIndex, 1);
    }

    getUpdatesResponses.push(when.respond(uri, requestBody));
    whensCalled.push(when);

    return [200, { ok: true, result: message }];
  };

  const unconsumedMocks = () => whens.filter(w => !whensCalled.includes(w));

  setupNock(getUpdatesHandler, sendMessageHandler);

  return {
    whenBotSends,
    messages,
    buildMocks,
    sendMessage,
    unconsumedMocks,
  };
}

function setupNock(
  getUpdatesHandler: (uri: string, requestBody: Record<string, any>) => nock.ReplyFnResult,
  sendMessageHandler: (uri: string, requestBody: Record<string, any>) => nock.ReplyFnResult,
) {
  const apiRoot = 'https://api.telegram.org';
  nock.disableNetConnect();

  nock(apiRoot)
    .post(/\/bot(.+?)\/getMe/)
    .reply(200, {
      ok: true,
      result: BOT_USER,
    })
    .persist();

  nock(apiRoot)
    .post(/\/bot(.+?)\/getUpdates/)
    .delay(10)
    .reply(getUpdatesHandler)
    .persist();

  nock(apiRoot)
    .post(/\/bot(.+?)\/sendMessage/)
    .reply(sendMessageHandler)
    .persist();

  nock(apiRoot)
    .post(/\/bot(.+?)\/deleteWebhook/)
    .reply(200, { ok: true, result: true, description: 'Webhook was deleted' })
    .persist();
}

export function cleanUpTelegramMock() {
  nock.cleanAll();
}

class WhenBuilder {
  private predicateMessage: Message | RegExp;

  private thenReply?: Message;

  private thenReplyFn?: NockResponse;

  private persistReplies = false;

  constructor(message: Message | string | RegExp) {
    if (typeof message === 'string') {
      this.predicateMessage = createUserMessage(message);
    } else {
      this.predicateMessage = message;
    }
  }

  public thenSendBot = (message: Message | NockResponse | string) => {
    if (typeof message === 'string') {
      this.thenReply = createUserMessage(message);
    } else if (typeof message === 'function') {
      this.thenReplyFn = message;
    } else {
      this.thenReply = message;
    }

    return this;
  };

  public thenDoNothing = () => {
    return this;
  };

  public persist = () => {
    this.persistReplies = true;
    return this;
  };

  match: Predicate = (uri, requestBody) => {
    if (isRegExp(this.predicateMessage)) {
      return this.predicateMessage.test(requestBody.text);
    }

    return requestBody.text === this.predicateMessage.text;
  };

  public buildResponseGenerator(): ResponseGenerator {
    const replyFn = () =>
      this.thenReply
        ? updateReplyResult([{ update_id: globals.updateId++, message: this.thenReply }])
        : updateReplyResult([]);

    return {
      predicate: this.match,
      respond: this.thenReplyFn ? this.thenReplyFn : replyFn,
      persist: this.persistReplies,
    };
  }
}

function updateReplyResult(result: Update[]): ReplyFnResult {
  return [
    200,
    {
      ok: true,
      result,
    },
  ];
}

function createUserMessage(m: Message | string): Message {
  if (typeof m === 'string') {
    return {
      message_id: globals.messageId++,
      from: USER_USER,
      chat: CHAT,
      date: new Date().getTime(),
      text: m,
      entities: [],
    };
  } else {
    return {
      ...m,
      message_id: m.message_id && m.message_id !== -1 ? m.message_id : globals.messageId++,
    };
  }
}

function createBotMessage(m: Message | string) {
  return {
    ...createUserMessage(m),
    from: BOT_USER,
  };
}
