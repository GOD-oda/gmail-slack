import {EmailConfig, splitEmail} from "./SplitEmail";
import { getProperty } from "./GetGasProperty";

interface Rule {
  domain: string;
  list?: SlackConfig[];

  canSend: () => boolean;
  match: (email: string) => boolean;
  config: (email: string) => SlackConfig;
}

const matchEmail = (email: string, domain: string): boolean => {
  const emailConfig: EmailConfig = splitEmail(email);
  return emailConfig.domain.includes(domain);
}

export interface SlackConfig {
  address: string;
  icon_emoji: string;
  webhook_url: string;
}

const defaultConfig: SlackConfig = {
  address: "",
  icon_emoji: "",
  webhook_url: ""
}

export const getConfig = (message: any): SlackConfig | null => {
  const from = message.getFrom();

  const rules: Rule[] = [
    RakutenRule,
    ConnpassRule,
    AmazonRule,
    AmericanexpressRule,
    VpassRule,
    GoogleRule,
    TripcomRule,
    JtbRule,
    MufgRule,
    YoutrustRule,
    OffersRule,
    IssueRule,
    WantedlyRule,
    AgodaRule,
    FindyRule,
    AnaRule,
    PaypayRule,
    SmbcRule, // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    SmbcMsgRule, // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    SmartExRule,
    PearsonRule,
    FreeeRule,
    LaprasRule,
    MinkabuRule,
    ToyotaRentacarRule,
    ExpediaRule,
    SbiRule,
    TakarakujiRule,
    DevtoRule,
    DocomoCycleRule,
    HelloCyclingRule,
    CloudflareRule,
    CredlyRule,
    UdemyRule,
  ];

  for (const element of rules) {
    if (element.match(from)) {
      if (element.canSend()) {
        return element.config(from);
      } else {
        return null;
      }
    }
  }

  return null;
}

const RakutenRule: Rule =  {
  domain: 'rakuten',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_RAKUTEN_CHANNEL'),
      icon_emoji: ":rakuten:"
    }
  }
}

const ConnpassRule: Rule = {
  domain: 'connpass',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_CONNPASS_CHANNEL'),
      icon_emoji: "connpass_logo_icon"
    }
  }
}

const AmazonRule: Rule = {
  domain: 'amazon',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_AMAZON_CHANNEL'),
      icon_emoji: "amazon_logo_icon"
    }
  }
}

const AmericanexpressRule: Rule  = {
  domain: 'americanexpress',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_AMERICANEXPRESS_CHANNEL'),
      icon_emoji: "amex_logo_icon"
    }
  }
}

const VpassRule: Rule = {
  domain:  'vpass.ne.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_VPASS_CHANNEL'),
      icon_emoji: "vpass_logo_icon"
    }
  }
}

const SmbcRule: Rule = {
  domain: 'dn.smbc.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: "smbc_logo_icon"
    }
  }
}
const SmbcMsgRule: Rule = {
  domain: 'msg.smbc.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: "smbc_logo_icon"
    }
  }
}

const GoogleRule: Rule = {
  domain: 'google.com',
  list: [
    { address: 'calendar-notification', icon_emoji: ':google-calendar-logo-icon:', webhook_url: getProperty('SLACK_GOOGLE_CHANNEL') },
    { address: 'apps-scripts-notifications', icon_emoji: ':google_script_apps_logo_icon:', webhook_url: getProperty('SLACK_GOOGLE_CHANNEL') },
  ],
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(email: string): SlackConfig {
    if (this.list == undefined) {
      return defaultConfig;
    }

    const emailConfig: EmailConfig = splitEmail(email);
    for (const list of this.list) {
      if (emailConfig.address.includes(list.address)) {
        return list;
      }
    }

    return defaultConfig;
  }
}

const TripcomRule: Rule = {
  domain: 'trip.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":trip_com_logo_icon:"
    }
  }
}

const JtbRule: Rule = {
  domain: 'jtb.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":jtb_logo_icon:"
    }
  }
}

const MufgRule: Rule = {
  domain: 'mufg.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":mufg_logo_icon:"
    }
  }
}

const YoutrustRule: Rule = {
  domain: 'youtrust.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: "youtrust_logo_icon"
    }
  }
}

const OffersRule: Rule = {
  domain:  'offers.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":offers_logo:"
    }
  }
}

const IssueRule: Rule = {
  domain: 'i-ssue.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":issue_logo:"
    }
  }
}

const WantedlyRule: Rule = {
  domain: 'wantedly.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":wantedly_mark_lightbg:"
    }
  }
}

const AgodaRule: Rule = {
  domain: 'agoda.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },

  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":agoda:"
    };
  }
}

const FindyRule: Rule = {
  domain: 'findy-code.io',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINDY_CHANNEL'),
      icon_emoji: ":findy_logo_icon:"
    }
  }
}

const AnaRule: Rule = {
  domain: '121.ana.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":ana_logo_icon:"
    }
  }
}

const PaypayRule: Rule = {
  domain: 'cc.paypay-bank.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":paypay_logo_icon:"
    }
  }
}

const SmartExRule: Rule = {
  domain: 'expy.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":smartex_logo_icon:"
    }
  }
}

const PearsonRule: Rule = {
  domain: 'pearson.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_AMAZON_CHANNEL'),
      icon_emoji: ":pearson_logo_icon:"
    }
  }
}

const FreeeRule: Rule = {
  domain: 'freee.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":freee_logo_icon:"
    }
  }
}

const LaprasRule: Rule = {
  domain: 'mail.lapras.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":lapras_logo_icon:"
    }
  }
}

const MinkabuRule: Rule = {
  domain: 'minkabu.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":minkabu_logo_icon:"
    }
  }
}

const ToyotaRentacarRule: Rule = {
  domain: 'rent-toyota.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":toyotarentacar_logo_icon:"
    }
  }
}

const ExpediaRule: Rule = {
  domain: 'jp.expediamail.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":expedia_logo_icon:"
    }
  }
}

const SbiRule: Rule = {
  domain: 'sbisec.co.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":sbi_logo_icon:"
    }
  }
}

const TakarakujiRule: Rule = {
  domain: 'takarakuji-official.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":takarakuji_logo_icon:"
    }
  }
}

const DevtoRule: Rule = {
  domain: 'dev.to',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":devto_logo_icon:"
    }
  }
}

const DocomoCycleRule: Rule = {
  domain: 'docomo-cycle.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_MOBILITY_CHANNEL'),
      icon_emoji: ":docomo_cycle_logo_icon:"
    }
  }
}

const HelloCyclingRule: Rule = {
  domain: 'hellocycling.jp',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_MOBILITY_CHANNEL'),
      icon_emoji: ":hello_cycling_logo_icon:"
    }
  }
}

const CloudflareRule: Rule = {
  domain: 'notify.cloudflare.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":cloudflare_logo_icon:"
    }
  }
}

const CredlyRule: Rule = {
  domain: 'credly.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":credly_logo_icon:"
    }
  }
}

const UdemyRule: Rule = {
  domain: 'e.udemymail.com',
  canSend(): boolean {
    return false;
  },
  match(email: string): boolean {
    return matchEmail(email, this.domain);
  },
  config(): SlackConfig {
    return {
      address: "",
      webhook_url: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":udemy_logo_icon:"
    }
  }
}
