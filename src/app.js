function main() {
  const threads = GmailApp.search('in:Inbox is:Unread', 0, 10)

  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      if (!message.isUnread()) { return }

      send_to_slack(message);
    })
  })
}

// GASのプロパティ取得
function get_property(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function debug_mode() {
  const mode = PropertiesService.getScriptProperties().getProperty('DEBUG_MODE');

  return mode == 1;
}

function create_payload(message) {
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
    }]
  };
}

function send_to_slack(message) {
  const url = webhook_url(message)
  if (debug_mode()) {
    console.log({
      webhook_url: url
    });
  }

  if (url == '') { return }
  const headers = { "Content-type": "application/json" }
  const payload = create_payload(message)
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
  UrlFetchApp.fetch(url, options)
  message.markRead()
}











