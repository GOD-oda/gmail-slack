function splitEmail(from) {
  if (from == undefined) {
    return ['', ''];
  }

  return from.split('@');
}
class Rule {
  match(from) {
    const [_address, domain_str] = splitEmail(from);
    return domain_str.includes(this.domain);
  }

  config() {
    throw new Error('You should implement config()');
  }
}

class RakutenRule extends Rule {
  constructor() {
    super();
    this.domain = 'rakuten';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_RAKUTEN_CHANNEL'),
      icon_emoji: ":rakuten:"
    }
  }
}

class ConnpassRule extends Rule {
  constructor() {
    super();
    this.domain = 'connpass';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_CONNPASS_CHANNEL'),
      icon_emoji: "connpass_logo_icon"
    }
  }
}

class AmazonRule extends Rule{
  constructor() {
    super();
    this.domain = 'amazon';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_AMAZON_CHANNEL'),
      icon_emoji: "amazon_logo_icon"
    }
  }
}

class AmericanexpressRule extends Rule {
  constructor() {
    super();
    this.domain = 'americanexpress';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_AMERICANEXPRESS_CHANNEL'),
      icon_emoji: "amex_logo_icon"
    }
  }
}

class VpassRule extends Rule {
  constructor() {
    super();
    this.domain = 'vpass.ne.jp';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_VPASS_CHANNEL'),
      icon_emoji: "vpass_logo_icon"
    }
  }
}

class GoogleRule extends Rule {
  constructor() {
    super();
    this.domain = 'google.com';
    this.lists = [
      { address: 'calendar-notification', icon_emoji: ':google-calendar-logo-icon:', webhook_url: get_property('SLACK_GOOGLE_CHANNEL') },
      { address: 'apps-scripts-notifications', icon_emoji: ':google_script_apps_logo_icon:', webhook_url: get_property('SLACK_GOOGLE_CHANNEL') },
    ];
  }

  config(from) {
    const [address, _domain] = splitEmail(from);
    for (const list of this.lists) {
      if (list['address'].match(address)) {
        return list;
      }
    }
  }
}

class TripcomRule extends Rule {
  constructor() {
    super();
    this.domain = 'trip.com';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":trip_com_logo_icon:"
    }
  }
}

class JtbRule extends Rule {
  constructor() {
    super();
    this.domain = 'jtb.co.jp';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":jtb_logo_icon:"
    }
  }
}

class MufgRule extends Rule {
  constructor() {
    super();
    this.domain = 'mufg.jp';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":mufg_logo_icon:"
    }
  }
}

class YoutrustRule extends Rule {
  constructor() {
    super();
    this.domain = 'youtrust.jp';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: "youtrust_logo_icon"
    }
  }
}

class OffersRule extends Rule {
  constructor() {
    super();
    this.domain = 'offers.jp';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":offers_logo:"
    }
  }
}

class IssueRule extends Rule {
  constructor() {
    super();
    this.domain = 'i-ssue.com';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":issue_logo:"
    }
  }
}

class WantedlyRule extends Rule {
  constructor() {
    super();
    this.domain = 'wantedly.com';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_HR_CHANNEL'),
      icon_emoji: ":wantedly_mark_lightbg:"
    }
  }
}

class AgodaRule extends Rule {
  constructor() {
    super();
    this.domain = 'agoda.com';
  }

  config() {
    return {
      webhook_url: get_property('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":agoda:"
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
    new MufgRule(),
    new YoutrustRule(),
    new OffersRule(),
    new IssueRule(),
    new WantedlyRule(),
    new AgodaRule(),
    new JtbRule(),
  ];

  for (const element of rules) {
    if (element.match(from)) {
      return element.config();
    }
  }

  return {};
}