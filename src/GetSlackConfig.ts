import { AmericanExpress } from "./rules/AmericanExpress";
import { Aws } from "./rules/Aws";
import { Cloudflare } from "./rules/Cloudflare";
import { Mufg } from "./rules/Mufg";
import { Paypay } from "./rules/Paypay";
import { RakutenCard } from "./rules/RakutenCard";
import type { GmailMessage, Rule } from "./rules/Rule";
import { Smbc } from "./rules/Smbc";
import { Vpass } from "./rules/Vpass";

export interface SlackConfig {
  address: string;
  icon_emoji: string;
  channel: string;
}

const defaultConfig: SlackConfig = {
  address: "",
  icon_emoji: "",
  channel: "",
};

export const getConfig = (gmailMessage: GmailMessage): SlackConfig | null => {
  // TODO: AmericanexpressRule以外はgasでchannelを設定していないので動かない
  const rules: Rule[] = [
    new RakutenCard(gmailMessage),
    // new ConnpassRule(gmailMessage),
    // new AmazonRule(gmailMessage),
    new AmericanExpress(gmailMessage),
    new Vpass(gmailMessage),
    // new GoogleRule(gmailMessage),
    // new TripcomRule(gmailMessage),
    // new JtbRule(gmailMessage),
    new Mufg(gmailMessage),
    // new YoutrustRule(gmailMessage),
    // new OffersRule(gmailMessage),
    // new IssueRule(gmailMessage),
    // new WantedlyRule(gmailMessage),
    // new AgodaRule(gmailMessage),
    // new FindyRule(gmailMessage),
    // new AnaRule(gmailMessage),
    new Paypay(gmailMessage),
    new Smbc(gmailMessage), // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    // new SmbcMsgRule(gmailMessage), // TODO: 同じSMBCだけどドメインが複数の場合に1つのルールクラスで対応するか検討する
    // new SmartExRule(gmailMessage),
    // new PearsonRule(gmailMessage),
    // new FreeeRule(gmailMessage),
    // new LaprasRule(gmailMessage),
    // new MinkabuRule(gmailMessage),
    // new ToyotaRentacarRule(gmailMessage),
    // new ExpediaRule(gmailMessage),
    // new SbiRule(gmailMessage),
    // new TakarakujiRule(gmailMessage),
    // new DevtoRule(gmailMessage),
    // new DocomoCycleRule(gmailMessage),
    // new HelloCyclingRule(gmailMessage),
    new Cloudflare(gmailMessage),
    // new CredlyRule(gmailMessage),
    // new UdemyRule(gmailMessage),
    new Aws(gmailMessage),
  ];

  for (const rule of rules) {
    rule.gmailMessage = gmailMessage;

    if (rule.match()) {
      if (rule.canSend()) {
        return rule.config();
      }

      return null;
    }
  }

  return null;
};

// class ConnpassRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "connpass";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_CONNPASS_CHANNEL"),
//       icon_emoji: "connpass_logo_icon",
//     };
//   }
// }

// class AmazonRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "amazon";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_AMAZON_CHANNEL"),
//       icon_emoji: "amazon_logo_icon",
//     };
//   }
// }

// class SmbcMsgRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "msg.smbc.co.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINANCE_CHANNEL"),
//       icon_emoji: "smbc_logo_icon",
//     };
//   }
// }

// class GoogleRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "google.com";
//     this.list = [
//       {
//         address: "calendar-notification",
//         icon_emoji: ":google-calendar-logo-icon:",
//         channel: getProperty("SLACK_GOOGLE_CHANNEL"),
//       },
//       {
//         address: "apps-scripts-notifications",
//         icon_emoji: ":google_script_apps_logo_icon:",
//         channel: getProperty("SLACK_GOOGLE_CHANNEL"),
//       },
//     ];
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     if (this.list === undefined) {
//       return defaultConfig;
//     }
//
//     const emailConfig: EmailConfig = splitEmail(this.gmailMessage.getFrom());
//     for (const list of this.list) {
//       if (emailConfig.address.includes(list.address)) {
//         return list;
//       }
//     }
//
//     return defaultConfig;
//   }
// }

// class TripcomRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "trip.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":trip_com_logo_icon:",
//     };
//   }
// }

// class JtbRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "jtb.co.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":jtb_logo_icon:",
//     };
//   }
// }

// class YoutrustRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "youtrust.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_HR_CHANNEL"),
//       icon_emoji: "youtrust_logo_icon",
//     };
//   }
// }

// class OffersRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "offers.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_HR_CHANNEL"),
//       icon_emoji: ":offers_logo:",
//     };
//   }
// }

// class IssueRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "i-ssue.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_HR_CHANNEL"),
//       icon_emoji: ":issue_logo:",
//     };
//   }
// }

// class WantedlyRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "wantedly.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_HR_CHANNEL"),
//       icon_emoji: ":wantedly_mark_lightbg:",
//     };
//   }
// }

// class AgodaRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "agoda.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":agoda:",
//     };
//   }
// }

// class FindyRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "findy-code.io";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINDY_CHANNEL"),
//       icon_emoji: ":findy_logo_icon:",
//     };
//   }
// }

// class AnaRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "121.ana.co.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":ana_logo_icon:",
//     };
//   }
// }

// class SmartExRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "expy.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":smartex_logo_icon:",
//     };
//   }
// }

// class PearsonRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "pearson.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_AMAZON_CHANNEL"),
//       icon_emoji: ":pearson_logo_icon:",
//     };
//   }
// }

// class FreeeRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "freee.co.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINANCE_CHANNEL"),
//       icon_emoji: ":freee_logo_icon:",
//     };
//   }
// }

// class LaprasRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "mail.lapras.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_HR_CHANNEL"),
//       icon_emoji: ":lapras_logo_icon:",
//     };
//   }
// }

// class MinkabuRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "minkabu.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINANCE_CHANNEL"),
//       icon_emoji: ":minkabu_logo_icon:",
//     };
//   }
// }

// class ToyotaRentacarRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "rent-toyota.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":toyotarentacar_logo_icon:",
//     };
//   }
// }

// class ExpediaRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "jp.expediamail.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TRIP_CHANNEL"),
//       icon_emoji: ":expedia_logo_icon:",
//     };
//   }
// }

// class SbiRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "sbisec.co.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINANCE_CHANNEL"),
//       icon_emoji: ":sbi_logo_icon:",
//     };
//   }
// }

// class TakarakujiRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "takarakuji-official.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_FINANCE_CHANNEL"),
//       icon_emoji: ":takarakuji_logo_icon:",
//     };
//   }
// }

// class DevtoRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "dev.to";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TECH_CHANNEL"),
//       icon_emoji: ":devto_logo_icon:",
//     };
//   }
// }

// class DocomoCycleRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "docomo-cycle.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_MOBILITY_CHANNEL"),
//       icon_emoji: ":docomo_cycle_logo_icon:",
//     };
//   }
// }

// class HelloCyclingRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "hellocycling.jp";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_MOBILITY_CHANNEL"),
//       icon_emoji: ":hello_cycling_logo_icon:",
//     };
//   }
// }

// class CredlyRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "credly.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TECH_CHANNEL"),
//       icon_emoji: ":credly_logo_icon:",
//     };
//   }
// }

// class UdemyRule extends Rule {
//   constructor(gmailMessage: GmailMessage) {
//     super(gmailMessage);
//     this.domain = "e.udemymail.com";
//   }
//
//   canSend(): boolean {
//     return false;
//   }
//
//   config(): SlackConfig {
//     return {
//       address: "",
//       channel: getProperty("SLACK_TECH_CHANNEL"),
//       icon_emoji: ":udemy_logo_icon:",
//     };
//   }
// }
