import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Aws extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domains = ["amazonaws.com", "aws.com"];
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject().toLowerCase();

    return ["月次コスト", "billing"].some((pattern) =>
      subject.includes(pattern),
    );
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "",
    };
  }
}
