import { getGasProperty } from "../GetGasProperty";
import type { SlackConfig } from "../GetSlackConfig";
import { Rule } from "./Rule";

const SENDER = "do_not_reply@up-t.jp";

export class UpT extends Rule {
  gmailSearchSenders(): string[] {
    return [SENDER];
  }

  match(): boolean {
    const from = this.gmailMessage.getFrom().trim();
    const address = from.match(/<([^<>]+)>$/)?.[1] ?? from;

    return address.toLowerCase() === SENDER;
  }

  canSend(): boolean {
    return true;
  }

  config(): SlackConfig {
    return {
      address: SENDER,
      channel: getGasProperty("SLACK_UP_T_CHANNEL"),
      icon_emoji: ":email:",
    };
  }
}
