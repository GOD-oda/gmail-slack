import {getConfig, SlackConfig} from "./get_slack_config";

export function  main(): void {
  const threads = GmailApp.search('in:Inbox is:Unread', 0, 10)

  threads.forEach((thread: any): void => {
    thread.getMessages().forEach((message: any): void => {
      if (!message.isUnread()) { return }

      send_to_slack(message);
    })
  })
}
declare let global: any;
global.main = main;

function debug_mode(): boolean {
  const mode = PropertiesService.getScriptProperties().getProperty('DEBUG_MODE');

  return mode == 1;
}

function create_payload(message: any, config: any) {
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

function send_to_slack(message: any): void {
  const config: SlackConfig = getConfig(message)
  if (debug_mode()) {
    console.log(config);
  }

  if (config.webhook_url == undefined || config.webhook_url == '') { return }
  const headers = { "Content-type": "application/json" }
  const payload = create_payload(message, config)
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(payload)
    // "muteHttpExceptions": true
  }

  if (debug_mode()) {
    console.log({
      from: message.getFrom()
    });
  }
  UrlFetchApp.fetch(config.webhook_url, options)
  message.markRead()
}











