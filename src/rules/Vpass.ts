import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Vpass extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "vpass.ne.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["お支払い日のご案内", "お支払い金額のお知らせ"].some((pattern) =>
      subject.includes(pattern),
    );
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "vpass_logo_icon",
    };
  }
}
