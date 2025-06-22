import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Aws extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "amazonaws.com";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["月次コスト"].some((pattern) => subject.includes(pattern));
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_FINANCE_CHANNEL"),
      icon_emoji: "",
    };
  }
}
