import {getConfig, SlackConfig} from "./GetSlackConfig";

export function  main(): void {
  const threads = GmailApp.search('in:Inbox is:Unread', 0, 100)

  threads.forEach((thread: any): void => {
    thread.getMessages().forEach((message: any): void => {
      if (!message.isUnread()) { return }

      sendToSlack(message);
    })
  })
}
declare let global: any;
global.main = main;

const debugMode = (): boolean => {
  const mode = PropertiesService.getScriptProperties().getProperty('DEBUG_MODE');

  return mode == 1;
}

const createPayload = (message: any, config: any) => {
  return {
    username: message.getFrom(),
    attachments: [{
      color: "36a64f",
      pretext: Utilities.formatString('Subject: *%s*', message.getSubject()),
      fields: [
        {
          value: message.getPlainBody()
        }
      ]
    }],
    icon_emoji: config['icon_emoji']
  };
}

const sendToSlack = (message: any): void => {
  const config: SlackConfig = getConfig(message);
  if (debugMode()) {
    console.log({
      slackConfig: config
    });
  }

  if (config.webhook_url == undefined || config.webhook_url == '') { return }
  const headers = { "Content-type": "application/json" }
  const payload = createPayload(message, config)
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(payload)
    // "muteHttpExceptions": true
  }

  if (debugMode()) {
    console.log({
      from: message.getFrom()
    });
  }
  UrlFetchApp.fetch(config.webhook_url, options)
  message.markRead()
}











