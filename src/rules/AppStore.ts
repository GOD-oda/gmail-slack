import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class AppStore extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "email.apple.com";
  }

  canSend(): boolean {
    return true;
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_APP_STORE_CHANNEL"),
      icon_emoji: "app_store_logo_icon",
    };
  }
}
