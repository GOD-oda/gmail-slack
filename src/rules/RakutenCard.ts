import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class RakutenCard extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "rakuten-card";
    this.subjects = ["カードご請求金額のご案内", "お支払い金額のご案内"];
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":rakuten:",
    };
  }
}
