import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Paidy extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "paidy.com";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();
    const targets = ["お引き落とし日"];

    return targets.some((pattern) => subject.includes(pattern));
  }
  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":paidy_logo_icon:",
    };
  }
}
