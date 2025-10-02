import { AmericanExpress } from "./rules/AmericanExpress";
import { Aws } from "./rules/Aws";
import { Cloudflare } from "./rules/Cloudflare";
import { Mufg } from "./rules/Mufg";
import { Mufgcard } from "./rules/Mufgcard";
import { Paypay } from "./rules/Paypay";
import { Qenest } from "./rules/Qenest";
import { RakutenCard } from "./rules/RakutenCard";
import type { GmailMessage, Rule } from "./rules/Rule";
import { Smbc } from "./rules/Smbc";
import { TokyoSuido } from "./rules/TokyoSuido";
import { Vpass } from "./rules/Vpass";
import {Nihontsushin} from "./rules/Nihontsushin";

export interface SlackConfig {
  address: string;
  icon_emoji: string;
  channel: string;
}

export const getConfig = (gmailMessage: GmailMessage): SlackConfig | null => {
  const rules: Rule[] = [
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
