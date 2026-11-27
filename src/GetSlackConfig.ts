import { AmericanExpress } from "./rules/AmericanExpress";
import { AppStore } from "./rules/AppStore";
import { Aws } from "./rules/Aws";
import { Base } from "./rules/Base";
import { Cloudflare } from "./rules/Cloudflare";
import { GooglePayments } from "./rules/GooglePayments";
import { Mufg } from "./rules/Mufg";
import { Mufgcard } from "./rules/Mufgcard";
import { Nihontsushin } from "./rules/Nihontsushin";
import { Paidy } from "./rules/Paidy";
import { Paypay } from "./rules/Paypay";
import { Qenest } from "./rules/Qenest";
import { RakutenCard } from "./rules/RakutenCard";
import type { GmailMessage, Rule } from "./rules/Rule";
import { Smbc } from "./rules/Smbc";
import { TokyoSuido } from "./rules/TokyoSuido";
import { UpT } from "./rules/UpT";
import { Vpass } from "./rules/Vpass";

export interface SlackConfig {
  address: string;
  icon_emoji: string;
  channel: string;
}

const createRules = (gmailMessage: GmailMessage): Rule[] => {
  return [
    new RakutenCard(gmailMessage),
    new AmericanExpress(gmailMessage),
    new Vpass(gmailMessage),
    new Mufg(gmailMessage),
    new Paypay(gmailMessage),
    new Smbc(gmailMessage),
    new Cloudflare(gmailMessage),
    new Aws(gmailMessage),
    new TokyoSuido(gmailMessage),
    new Mufgcard(gmailMessage),
    new Qenest(gmailMessage),
    new Nihontsushin(gmailMessage),
    new AppStore(gmailMessage),
    new GooglePayments(gmailMessage),
    new Paidy(gmailMessage),
    new UpT(gmailMessage),
    new Base(gmailMessage),
  ];
};

export const getGmailSearchQuery = (): string => {
  const emptyMessage: GmailMessage = {
    getFrom: () => "",
    getTo: () => "",
    getSubject: () => "",
  };
  const ruleQueries = createRules(emptyMessage).map((rule) =>
    rule.gmailSearchClause(),
  );

  return `in:inbox is:unread newer_than:30d {${ruleQueries.join(" ")}}`;
};

export const getConfig = (gmailMessage: GmailMessage): SlackConfig | null => {
  const rules = createRules(gmailMessage);

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
