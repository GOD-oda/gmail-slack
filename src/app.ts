import { getGasProperty } from "./GetGasProperty";
import {
  type SlackConfig,
  getConfig,
  getGmailSearchQuery,
} from "./GetSlackConfig";
import type { GmailMessage } from "./rules/Rule";

const MAX_THREADS_PER_RUN = 25;
const MAX_RUN_DURATION_MS = 4.5 * 60 * 1000;
const LOCK_WAIT_MS = 1000;

interface ProcessableGmailMessage extends GmailMessage {
  getPlainBody: () => string;
  isUnread: () => boolean;
  markRead: () => void;
}

interface SlackPayload {
  channel: string;
  username: string;
  attachments?: Array<{
    color: string;
    pretext: string;
    fields: Array<{ value: string }>;
  }>;
  icon_emoji?: string;
  text?: string;
}

interface SlackResponse {
  ok: boolean;
  error?: string;
}

interface UrlFetchResponse {
  getContentText: () => string;
}

export function main(): void {
  const startedAt = Date.now();
  const lock = LockService.getScriptLock();

  if (!lock.tryLock(LOCK_WAIT_MS)) {
    console.warn("Skipped because another gmail-slack execution is running.");
    return;
  }

  try {
    processUnreadMessages(startedAt);
  } finally {
    lock.releaseLock();
  }
}

const processUnreadMessages = (startedAt: number): void => {
  let errorCount = 0;
  let deadlineReached = false;

  // Search only senders handled by the configured rules. This avoids repeatedly
  // scanning the entire unread inbox while preserving the user's unread state.
  // @see https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#searchquery,-start,-max
  const threads = GmailApp.search(
    getGmailSearchQuery(),
    0,
    MAX_THREADS_PER_RUN,
  );

  // @see https://developers.google.com/apps-script/reference/gmail/gmail-thread?hl=ja
  threadLoop: for (
    let threadIndex = 0;
    threadIndex < threads.length;
    threadIndex += 1
  ) {
    if (hasReachedRunDeadline(startedAt)) {
      deadlineReached = true;
      break;
    }

    try {
      const messages = threads[threadIndex].getMessages();

      // @see https://developers.google.com/apps-script/reference/gmail/gmail-thread?hl=ja#getmessages
      for (
        let messageIndex = 0;
        messageIndex < messages.length;
        messageIndex += 1
      ) {
        if (hasReachedRunDeadline(startedAt)) {
          deadlineReached = true;
          break threadLoop;
        }

        try {
          const message = messages[messageIndex];
          if (!message.isUnread()) {
            continue;
          }

          sendMessageToSlack(message);
        } catch (error) {
          errorCount += 1;
          console.error(
            `Failed to process message ${messageIndex} in thread ${threadIndex}: ${formatError(error)}`,
          );
        }
      }
    } catch (error) {
      errorCount += 1;
      console.error(
        `Failed to read thread ${threadIndex}: ${formatError(error)}`,
      );
    }
  }

  if (deadlineReached) {
    console.warn("Stopped before reaching the Apps Script execution limit.");
  }

  if (errorCount > 0) {
    throw new Error(`Failed to process ${errorCount} Gmail item(s).`);
  }
};

const hasReachedRunDeadline = (startedAt: number): boolean => {
  return Date.now() - startedAt >= MAX_RUN_DURATION_MS;
};

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  return String(error);
};
// biome-ignore lint/suspicious/noExplicitAny:
declare let global: any;
global.main = main;

const debugMode = (): boolean => {
  // @see https://developers.google.com/apps-script/reference/properties/properties?hl=ja#getProperty(String)
  const mode =
    PropertiesService.getScriptProperties().getProperty("DEBUG_MODE");

  return mode === "1";
};

const createPayload = (
  message: ProcessableGmailMessage,
  config: SlackConfig,
): SlackPayload => {
  return {
    channel: config.channel,
    username: message.getFrom(),
    attachments: [
      {
        color: "36a64f",
        pretext: Utilities.formatString("Subject: *%s*", message.getSubject()),
        fields: [
          {
            value: message.getPlainBody(),
          },
        ],
      },
    ],
    icon_emoji: config.icon_emoji,
  };
};

// @see https://developers.google.com/apps-script/reference/gmail/gmail-message?hl=ja
const sendMessageToSlack = (message: ProcessableGmailMessage): void => {
  const config = getConfig(message);

  if (config === null) {
    return;
  }

  const payload = createPayload(message, config);

  if (debugMode()) {
    console.log({
      from: message.getFrom(),
      payload: payload,
    });
  }
  const response = sendToSlack(payload);
  const responseBody = JSON.parse(response.getContentText()) as SlackResponse;

  if (debugMode()) {
    console.log(responseBody);
  }

  if (!responseBody.ok) {
    const errorPayload = createErrorPayload(responseBody, payload);
    sendToSlack(errorPayload);
  } else {
    message.markRead();
  }
};

const sendToSlack = (payload: SlackPayload): UrlFetchResponse => {
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${getGasProperty("OAUTH_TOKEN")}`,
  };
  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  if (debugMode()) {
    console.log({
      payload: payload,
    });
  }

  return UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
};

const createErrorPayload = (
  errorResponse: SlackResponse,
  originalPayload: SlackPayload,
): SlackPayload => {
  const errorChannel = getGasProperty("SLACK_ERROR_CHANNEL");
  return {
    channel: errorChannel,
    username: "Slack Error Notifier",
    text: `Slackへのメッセージ送信に失敗しました。\nエラー内容: ${errorResponse.error}\nオリジナルペイロード: ${JSON.stringify(originalPayload)}`,
    // icon_emoji: ":warning:",
  };
};
