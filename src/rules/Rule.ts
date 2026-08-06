import type { SlackConfig } from "../GetSlackConfig";
import { type EmailConfig, splitEmail } from "../SplitEmail";

export abstract class Rule {
  // TODO: 各クラスでデフォルトセットした方が良さそう？
  domain = "";
  domains: string[] = [];
  subjects: string[] = [];
  list: SlackConfig[] = [];
  gmailMessage: GmailMessage;

  constructor(gmailMessage: GmailMessage) {
    this.gmailMessage = gmailMessage;
  }

  abstract config(): SlackConfig;
  canSend(): boolean {
    const subject = this.gmailMessage.getSubject().toLowerCase();

    return this.subjects.some((pattern) =>
      subject.includes(pattern.toLowerCase()),
    );
  }
  gmailSearchClause(): string {
    const senderTerms = this.gmailSearchSenders().map(
      (sender) => `from:${sender}`,
    );
    const senderQuery = groupTerms(senderTerms);

    if (this.subjects.length === 0) {
      return senderQuery;
    }

    const subjectTerms = this.subjects.map(
      (subject) => `subject:"${escapeSearchPhrase(subject)}"`,
    );

    return `(${senderQuery} ${groupTerms(subjectTerms)})`;
  }
  gmailSearchSenders(): string[] {
    return this.domains.length > 0 ? this.domains : [this.domain];
  }
  match(): boolean {
    const domains = this.domains.length > 0 ? this.domains : [this.domain];

    return domains.some((domain) =>
      matchEmail(this.gmailMessage.getFrom(), domain),
    );
  }
}

const groupTerms = (terms: string[]): string => {
  return terms.length === 1 ? terms[0] : `{${terms.join(" ")}}`;
};

const escapeSearchPhrase = (phrase: string): string => {
  return phrase.replace(/[\\"]/g, "\\$&");
};

const matchEmail = (email: string, domain: string): boolean => {
  const emailConfig: EmailConfig = splitEmail(email);
  return emailConfig.domain.includes(domain);
};

// @see https://developers.google.com/apps-script/reference/gmail/gmail-message?hl=ja
export interface GmailMessage {
  getFrom: () => string;
  getSubject: () => string;
}
