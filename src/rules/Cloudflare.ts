import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Cloudflare extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "notify.cloudflare.com";
  }

  canSend(): boolean {
    const subject = this.gmailMessage.getSubject();

    return ["Cloudflare の購入確認"].some((pattern) =>
      subject.includes(pattern),
    );
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":cloudflare_logo_icon:",
    };
  }
}
