import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class TokyoSuido extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "tokyo.suidoapp.jp";
    this.subjects = ["水道料金算定のお知らせ"];
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "tokyo_suido_logo_icon",
    };
  }
}
