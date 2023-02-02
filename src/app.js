function main() {
  const threads = GmailApp.search('in:Inbox is:Unread', 0, 100)

  
  threads.forEach((thread) => {
    thread.getMessages().forEach((message) => {
      if (!message.isUnread()) { return }

      send_to_slack(message);
    })
  })
}

function get_property(name) {
  return PropertiesService.getScriptProperties().getProperty(name);
}

function webhook_url(message) {
  const from = message.getFrom();

  if (from.includes('rakuten')) {
    return get_property('SLACK_RAKUTEN_CHANNEL');
  }

  if (from.includes('connpass')) {
    return get_property('SLACK_RAKUTEN_CHANNEL');
  }

  if (from.includes('amazon')) {
    return get_property('SLACK_AMAZON_CHANNEL');
  }

  if (from.includes('americanexpress')) {
    return get_property('SLACK_AMERICANEXPRESS_CHANNEL');
  }

  if (from.includes('vpass')) {
    return get_property('SLACK_VPASS_CHANNEL');
  }

  if (from.includes('calendar-notification@google.com')) {
    return get_property('SLACK_GOOGLECALENDAR_CHANNLE');
  }

  return '';
}


function create_payload(message) {
  return {
    username: message.getFrom(),
    attachments: [{
      color: "36a64f",
      pretext:message.getDate(),
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
  if (url == '') { return }
  const headers = { "Content-type": "application/json" }
  const payload = create_payload(message)
  const options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(payload)
    // "muteHttpExceptions": true
  }
  UrlFetchApp.fetch(url, options)
  message.markRead()
}











