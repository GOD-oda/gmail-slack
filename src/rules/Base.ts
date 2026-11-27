import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { Rule } from "./Rule";

const SENDER = "noreply@thebase.in";
const SHOP_RECIPIENT = "last.pass.oda+gododa_official@gmail.com";

const mailbox = (header: string): string =>
  (header.trim().match(/<([^<>]+)>$/)?.[1] ?? header.trim()).toLowerCase();

export class Base extends Rule {
  subjects = ["商品購入通知"];

  gmailSearchSenders(): string[] {
    return [SENDER];
  }

  gmailSearchClause(): string {
    return `(to:${SHOP_RECIPIENT} ${super.gmailSearchClause()})`;
  }

  match(): boolean {
    return mailbox(this.gmailMessage.getFrom()) === SENDER;
  }

  canSend(): boolean {
    return (
      this.gmailMessage.getSubject().startsWith(this.subjects[0]) &&
      this.gmailMessage
        .getTo()
        .split(",")
        .some((to) => mailbox(to) === SHOP_RECIPIENT)
    );
  }

  config(): SlackConfig {
    return {
      address: SENDER,
      channel: getGasProperty("SLACK_UP_T_CHANNEL"),
      icon_emoji: ":email:",
    };
  }
}
