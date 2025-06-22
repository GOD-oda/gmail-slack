import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class RakutenCard extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "rakuten-card";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = ["カードご請求金額のご案内", "お支払い金額のご案内"];

    return targets.some((pattern) => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":rakuten:",
    };
  }
}
