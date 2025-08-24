import { getGasProperty } from "./GetGasProperty";
import { getConfig } from "./GetSlackConfig";

export function main(): void {
  // @see https://developers.google.com/apps-script/reference/gmail/gmail-app?hl=ja#searchquery,-start,-max
  const threads = GmailApp.search("in:Inbox is:Unread", 0, 100);

  // @see https://developers.google.com/apps-script/reference/gmail/gmail-thread?hl=ja
  for (const thread of threads) {
    // @see https://developers.google.com/apps-script/reference/gmail/gmail-thread?hl=ja#getmessages
    for (const message of thread.getMessages()) {
      if (!message.isUnread()) {
        return;
      }

      sendMessageToSlack(message);
    }
  }
}
// biome-ignore lint/suspicious/noExplicitAny:
declare let global: any;
global.main = main;

const debugMode = (): boolean => {
  // @see https://developers.google.com/apps-script/reference/properties/properties?hl=ja#getProperty(String)
  const mode =
    PropertiesService.getScriptProperties().getProperty("DEBUG_MODE");

  return mode === "1";
};

// biome-ignore lint/suspicious/noExplicitAny:
const createPayload = (message: any, config: any) => {
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
// biome-ignore lint/suspicious/noExplicitAny:
const sendMessageToSlack = (message: any): void => {
  const config = getConfig(message);
  if (debugMode()) {
    console.log({
      slackConfig: config,
    });
  }

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
  const responseBody = JSON.parse(response.getContentText());

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

const sendToSlack = (payload: any): any => {
  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${getGasProperty("OAUTH_TOKEN")}`,
  };
  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(payload),
    // "muteHttpExceptions": true
  };

  if (debugMode()) {
    console.log({
      headers: headers,
      payload: payload,
    });
  }

  return UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
};

const createErrorPayload = (errorResponse: any, originalPayload: any): any => {
  const errorChannel = getGasProperty("SLACK_ERROR_CHANNEL");
  return {
    channel: errorChannel,
    username: "Slack Error Notifier",
    text: `Slackへのメッセージ送信に失敗しました。\nエラー内容: ${errorResponse.error}\nオリジナルペイロード: ${JSON.stringify(originalPayload)}`,
    // icon_emoji: ":warning:",
  };
};
