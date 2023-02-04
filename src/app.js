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

function webhook_url(message) {
  const from = message.getFrom();

  if (from.includes('rakuten')) {
    return get_property('SLACK_RAKUTEN_CHANNEL');
  }

  if (from.includes('connpass')) {
    return get_property('SLACK_CONNPASS_CHANNEL');
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

  if (from.includes('trip.com')) {
    return get_property('SLACK_TRIP_CHANNEL');
  }

  return '';
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
      url: url,
      from: message.getFrom()
    });
  }
  UrlFetchApp.fetch(url, options)
  message.markRead()
}











