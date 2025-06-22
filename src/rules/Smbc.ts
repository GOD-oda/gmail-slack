import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Smbc extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "dn.smbc.co.jp";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["口座引き落としの事前お知らせ"].some((pattern) =>
      subject.includes(pattern),
    );
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: "smbc_logo_icon",
    };
  }
}
