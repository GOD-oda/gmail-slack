import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Paypay extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "mail.paypay-card.co.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = ["請求金額"];

    return targets.some((pattern) => subject.includes(pattern));
  }
  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":paypay_logo_icon:",
    };
  }
}
