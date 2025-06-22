import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class AmericanExpress extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "americanexpress";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = [
      "次回口座振替のお知らせ",
      "カードご利用金額のお知らせ",
      "ご請求金額確定のご案内",
    ];

    return targets.some((pattern) => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "amex_logo_icon",
    };
  }
}
