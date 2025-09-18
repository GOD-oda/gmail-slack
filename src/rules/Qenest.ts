import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Qenest extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "esp-smart.com";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["今月のご請求のお知らせ"].some((pattern) =>
      subject.includes(pattern),
    );
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "qenest_logo_icon",
    };
  }
}
