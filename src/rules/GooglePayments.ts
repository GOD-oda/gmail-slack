import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class GooglePayments extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "google.com";
    this.subjects = ["請求書の用意"];
  }

  // google.com は他サービスのメールも多いため、送信元アドレス全体で絞る
  match(): boolean {
    return this.gmailMessage.getFrom().includes("payments-noreply@google.com");
  }

  gmailSearchSenders(): string[] {
    return ["payments-noreply@google.com"];
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "",
    };
  }
}
