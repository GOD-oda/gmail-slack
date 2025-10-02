import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Nihontsushin extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "j-com.co.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = [
      "ご請求のお知らせ",
    ];

    return targets.some((pattern) => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "nihontsushin_logo_icon",
    };
  }
}
