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

class GoogleRule extends Rule {
  match(from) {
    return from.includes('google.com');
  }

  url() {
    return get_property('SLACK_GOOGLE_CHANNEL');
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
    new GoogleRule(),
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