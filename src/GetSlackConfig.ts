import { AmericanExpress } from "./rules/AmericanExpress";
import { Aws } from "./rules/Aws";
import { Cloudflare } from "./rules/Cloudflare";
import { Mufg } from "./rules/Mufg";
import { Paypay } from "./rules/Paypay";
import { RakutenCard } from "./rules/RakutenCard";
import type { GmailMessage, Rule } from "./rules/Rule";
import { Smbc } from "./rules/Smbc";
import { TokyoSuido } from "./rules/TokyoSuido";
import { Vpass } from "./rules/Vpass";
import {Mufgcard} from "./rules/Mufgcard";

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
    // new SmbcMsgRule(gmailMessage),
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
    new TokyoSuido(gmailMessage),
    new Mufgcard(gmailMessage),
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
