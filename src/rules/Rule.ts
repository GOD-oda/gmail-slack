import type { SlackConfig } from "../GetSlackConfig";
import { type EmailConfig, splitEmail } from "../SplitEmail";

export abstract class Rule {
  // TODO: 各クラスでデフォルトセットした方が良さそう？
  domain = "";
  list: SlackConfig[] = [];
  gmailMessage: GmailMessage;

  constructor(gmailMessage: GmailMessage) {
    this.gmailMessage = gmailMessage;
  }

  abstract canSend(): boolean;
  abstract config(): SlackConfig;
  match(): boolean {
    return matchEmail(this.gmailMessage.getFrom(), this.domain);
  }
}

// TODO: Ruleクラスの処理にした方が良さそう
const matchEmail = (email: string, domain: string): boolean => {
  const emailConfig: EmailConfig = splitEmail(email);
  return emailConfig.domain.includes(domain);
};

// @see https://developers.google.com/apps-script/reference/gmail/gmail-message?hl=ja
export interface GmailMessage {
  getFrom: () => string;
  getSubject: () => string;
}
