import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { type GmailMessage, Rule } from "./Rule";

export class Mufg extends Rule {
  constructor(gmailMessage: GmailMessage) {
    super(gmailMessage);
    this.domain = "mufg.jp";
    this.subjects = [
      "（三菱ＵＦＪ銀行）口座振替処理（お引き落とし）未済のお知らせ",
    ];
  }

  config(): SlackConfig {
    return {
      address: "",
      channel: getGasProperty("SLACK_PAYMENT_CHANNEL"),
      icon_emoji: ":mufg_logo_icon:",
    };
  }
}
