class Rule {
  match(from) {
    throw new Error('You should implement match()');
  }

  config() {
    throw new Error('You should implement config()');
  }
}

class RakutenRule extends Rule {
  match(from) {
    return from.includes('rakuten')
  }

  config() {
    return {
      webhook_url: get_property('SLACK_RAKUTEN_CHANNEL'),
      icon_emoji: ":rakuten:"
    }
  }
}

class ConnpassRule extends Rule {
  match(from) {
    return from.includes('connpass')
  }

  config() {
    return {
      webhook_url: get_property('SLACK_CONNPASS_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class AmazonRule extends Rule{
  match(from) {
    return from.includes('amazon');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_AMAZON_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class AmericanexpressRule extends Rule {
  match(from) {
    return from.includes('americanexpress');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_AMERICANEXPRESS_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class VpassRule extends Rule {
  match(from) {
    return from.includes('vpass');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_VPASS_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class GoogleRule extends Rule {
  match(from) {
    return from.includes('google.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_GOOGLE_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class TripcomRule extends Rule {
  match(from) {
    return from.includes('trip.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class JtbRule extends Rule {
  match(from) {
    return from.includes('jtb');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class FinanceRule extends Rule {
  match(from) {
    return from.includes('mufg');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class YoutrustRule extends Rule {
  match(from) {
    return from.includes('youtrust');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ""
    }
  }
}

class OffersRule extends Rule {
  match(from) {
    return from.includes('offers.jp');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":offers_logo:"
    }
  }
}

class IssueRule extends Rule {
  match(from) {
    return from.includes('i-ssue.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":issue_logo:"
    }
  }
}

class WantedlyRule extends Rule {
  match(from) {
    return from.includes('wantedly.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":wantedly_mark_lightbg:"
    }
  }
}

class AgodaRule extends Rule {
  match(from) {
    return from.includes('agoda.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":agoda:"
    };
  }
}

class GasRule extends Rule {
  match(from) {
    return from.includes('\n' +
      'apps-scripts-notifications@google.com');
  }

  config() {
    return {
      webhook_url: get_property('SLACK_GAS_CHANNEL'),
      icon_emoji: ":google_script_apps_logo_icon:"
    };
  }
}

function get_config(message) {
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
    new YoutrustRule(),
    new OffersRule(),
    new IssueRule(),
    new WantedlyRule(),
    new AgodaRule(),
    new JtbRule(),
    new GasRule(),
  ];

  for (const element of rules) {
    if (element.match(from)) {
      return element.config();
    }
  }

  return {};
}