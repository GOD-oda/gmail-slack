import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class GooglePayments extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "google.com";
  }

  // google.com は他サービスのメールも多いため、送信元アドレス全体で絞る
  match(): boolean {
    return this.gmailMessage.getFrom().includes("payments-noreply@google.com");
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = ["請求書の用意"];

    return targets.some((pattern) => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "",
    };
  }
}
