import {EmailConfig, splitEmail} from "./SplitEmail";
import { getProperty } from "./GetGasProperty";

// @see https://developers.google.com/apps-script/reference/gmail/gmail-message?hl=ja
interface GmailMessage {
  getFrom: () => string;
  getSubject: () => string;
}

abstract class Rule {
  // TODO: 各クラスでデフォルトセットした方が良さそう？
  domain: string = "";
  list: SlackConfig[] = [];
  gmailMessage: GmailMessage;

  constructor(gmailMessage: GmailMessage) {
    this.gmailMessage = gmailMessage;
  }

  abstract canSend(): boolean;
  abstract config(): SlackConfig;
  match(): boolean {
    return matchEmail(this.gmailMessage.getFrom(), this.domain);
  }
}

// TODO: Ruleクラスの処理にした方が良さそう
const matchEmail = (email: string, domain: string): boolean => {
  const emailConfig: EmailConfig = splitEmail(email);
  return emailConfig.domain.includes(domain);
}

export interface SlackConfig {
  address: string;
  icon_emoji: string;
  channel: string;
}

const defaultConfig: SlackConfig = {
  address: "",
  icon_emoji: "",
  channel: ""
}

export const getConfig = (gmailMessage: GmailMessage): SlackConfig | null => {
  // TODO: AmericanexpressRule以外はgasでchannelを設定していないので動かない
  const rules: Rule[] = [
    new RakutenRule(gmailMessage),
    new ConnpassRule(gmailMessage),
    new AmazonRule(gmailMessage),
    new AmericanexpressRule(gmailMessage),
    new VpassRule(gmailMessage),
    new GoogleRule(gmailMessage),
    new TripcomRule(gmailMessage),
    new JtbRule(gmailMessage),
    new MufgRule(gmailMessage),
    new YoutrustRule(gmailMessage),
    new OffersRule(gmailMessage),
    new IssueRule(gmailMessage),
    new WantedlyRule(gmailMessage),
    new AgodaRule(gmailMessage),
    new FindyRule(gmailMessage),
    new AnaRule(gmailMessage),
    new PaypayRule(gmailMessage),
    new SmbcRule(gmailMessage), // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    new SmbcMsgRule(gmailMessage), // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    new SmartExRule(gmailMessage),
    new PearsonRule(gmailMessage),
    new FreeeRule(gmailMessage),
    new LaprasRule(gmailMessage),
    new MinkabuRule(gmailMessage),
    new ToyotaRentacarRule(gmailMessage),
    new ExpediaRule(gmailMessage),
    new SbiRule(gmailMessage),
    new TakarakujiRule(gmailMessage),
    new DevtoRule(gmailMessage),
    new DocomoCycleRule(gmailMessage),
    new HelloCyclingRule(gmailMessage),
    new CloudflareRule(gmailMessage),
    new CredlyRule(gmailMessage),
    new UdemyRule(gmailMessage),
  ];

  for (const rule of rules) {
    rule.gmailMessage = gmailMessage;

    if (rule.match()) {
      if (rule.canSend()) {
        return rule.config();
      } else {
        return null;
      }
    }
  }

  return null;
}

class RakutenRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "rakuten";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_RAKUTEN_CHANNEL'),
      icon_emoji: ":rakuten:"
    }
  }
}

class ConnpassRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "connpass";
  }
  
  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_CONNPASS_CHANNEL'),
      icon_emoji: "connpass_logo_icon"
    }
  }
}

class AmazonRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "amazon";
  }
  
  canSend(): boolean {
    return false;
  }
  
  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_AMAZON_CHANNEL'),
      icon_emoji: "amazon_logo_icon"
    }
  }
}

class AmericanexpressRule extends Rule  {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "americanexpress";
  }
  
  canSend(): boolean {
    const subject = this.gmailMessage.getSubject()

    return ["次回口座振替のお知らせ", "カードご利用金額のお知らせ"].some(pattern => subject.includes(pattern));
  }
  
  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_PAYMENT_CHANNEL'),
      icon_emoji: "amex_logo_icon"
    }
  }
}

class VpassRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "vpass.ne.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["お支払い日のご案内", "お支払い金額のお知らせ"].some(pattern => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_PAYMENT_CHANNEL'),
      icon_emoji: "vpass_logo_icon"
    }
  }
}

class SmbcRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "dn.smbc.co.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["口座引き落としの事前お知らせ"].some(pattern => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_PAYMENT_CHANNEL'),
      icon_emoji: "smbc_logo_icon"
    }
  }
}
class SmbcMsgRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "msg.smbc.co.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: "smbc_logo_icon"
    }
  }
}

class GoogleRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "google.com";
    this.list = [
      { address: 'calendar-notification', icon_emoji: ':google-calendar-logo-icon:', channel: getProperty('SLACK_GOOGLE_CHANNEL') },
      { address: 'apps-scripts-notifications', icon_emoji: ':google_script_apps_logo_icon:', channel: getProperty('SLACK_GOOGLE_CHANNEL') },
    ]
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    if (this.list == undefined) {
      return defaultConfig;
    }

    const emailConfig: EmailConfig = splitEmail(this.gmailMessage.getFrom());
    for (const list of this.list) {
      if (emailConfig.address.includes(list.address)) {
        return list;
      }
    }

    return defaultConfig;
  }
}

class TripcomRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "trip.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":trip_com_logo_icon:"
    }
  }
}

class JtbRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "jtb.co.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":jtb_logo_icon:"
    }
  }
}

class MufgRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "mufg.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":mufg_logo_icon:"
    }
  }
}

class YoutrustRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "youtrust.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: "youtrust_logo_icon"
    }
  }
}

class OffersRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "offers.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":offers_logo:"
    }
  }
}

class IssueRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "i-ssue.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":issue_logo:"
    }
  }
}

class WantedlyRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "wantedly.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":wantedly_mark_lightbg:"
    }
  }
}

class AgodaRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "agoda.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":agoda:"
    };
  }
}

class FindyRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "findy-code.io";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINDY_CHANNEL'),
      icon_emoji: ":findy_logo_icon:"
    }
  }
}

class AnaRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "121.ana.co.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":ana_logo_icon:"
    }
  }
}

class PaypayRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "cc.paypay-bank.co.jp";
  }

  canSend(): boolean {
    return false;
  }
  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":paypay_logo_icon:"
    }
  }
}

class SmartExRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "expy.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":smartex_logo_icon:"
    }
  }
}

class PearsonRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "pearson.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_AMAZON_CHANNEL'),
      icon_emoji: ":pearson_logo_icon:"
    }
  }
}

class FreeeRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "freee.co.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":freee_logo_icon:"
    }
  }
}

class LaprasRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "mail.lapras.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_HR_CHANNEL'),
      icon_emoji: ":lapras_logo_icon:"
    }
  }
}

class MinkabuRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "minkabu.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":minkabu_logo_icon:"
    }
  }
}

class ToyotaRentacarRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "rent-toyota.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":toyotarentacar_logo_icon:"
    }
  }
}

class ExpediaRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "jp.expediamail.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TRIP_CHANNEL'),
      icon_emoji: ":expedia_logo_icon:"
    }
  }
}

class SbiRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "sbisec.co.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":sbi_logo_icon:"
    }
  }
}

class TakarakujiRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "takarakuji-official.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_FINANCE_CHANNEL'),
      icon_emoji: ":takarakuji_logo_icon:"
    }
  }
}

class DevtoRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "dev.to";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":devto_logo_icon:"
    }
  }
}

class DocomoCycleRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "docomo-cycle.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_MOBILITY_CHANNEL'),
      icon_emoji: ":docomo_cycle_logo_icon:"
    }
  }
}

class HelloCyclingRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "hellocycling.jp";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_MOBILITY_CHANNEL'),
      icon_emoji: ":hello_cycling_logo_icon:"
    }
  }
}

class CloudflareRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "notify.cloudflare.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":cloudflare_logo_icon:"
    }
  }
}

class CredlyRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "credly.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":credly_logo_icon:"
    }
  }
}

class UdemyRule extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "e.udemymail.com";
  }

  canSend(): boolean {
    return false;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getProperty('SLACK_TECH_CHANNEL'),
      icon_emoji: ":udemy_logo_icon:"
    }
  }
}
