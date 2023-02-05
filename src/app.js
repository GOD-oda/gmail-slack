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

class Rule {
  match(from) {
    throw new Error('You should implement match()');
  }

  url() {
    throw new Error('You should implement url()');
  }
}

class RakutenRule extends Rule {
  match(from) {
    return from.includes('rakuten')
  }

  url() {
    return get_property('SLACK_RAKUTEN_CHANNEL');
  }
}

class ConnpassRule extends Rule {
  match(from) {
    return from.includes('connpass')
  }

  url() {
    return get_property('SLACK_CONNPASS_CHANNEL');
  }
}

class AmazonRule extends Rule{
  match(from) {
    return from.includes('amazon');
  }

  url() {
    return get_property('SLACK_AMAZON_CHANNEL');
  }
}

class AmericanexpressRule extends Rule {
  match(from) {
    return from.includes('americanexpress');
  }

  url() {
    return get_property('SLACK_AMERICANEXPRESS_CHANNEL');
  }
}

class VpassRule extends Rule {
  match(from) {
    return from.includes('vpass');
  }

  url() {
    return get_property('SLACK_VPASS_CHANNEL');
  }
}

class GoogleCalendarRule extends Rule {
  match(from) {
    return from.includes('calendar-notification@google.com');
  }

  url() {
    return get_property('SLACK_GOOGLECALENDAR_CHANNLE');
  }
}

class TripcomRule extends Rule {
  match(from) {
    return from.includes('trip.com');
  }

  url() {
    return get_property('SLACK_TRIP_CHANNEL');
  }
}

class FinanceRule extends Rule {
  match(from) {
    return from.includes('mufg');
  }

  url() {
    return get_property('SLACK_FINANCE_CHANNEL');
  }

}

function webhook_url(message) {
  const from = message.getFrom();

  const rules = [
    new RakutenRule(),
    new AmericanexpressRule(),
    new AmazonRule(),
    new ConnpassRule(),
    new GoogleCalendarRule(),
    new VpassRule(),
    new TripcomRule(),
    new FinanceRule(),
  ];

  for (const element of rules) {
    if (element.match(from)) {
      return element.url()
    }
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











