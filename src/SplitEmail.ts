export interface EmailConfig {
  address: string;
  domain: string;
}

export function splitEmail(email: string): EmailConfig {
  const emailConfig: EmailConfig = {
    address: '',
    domain: ''
  }
  
  if (email != undefined) {
    const [address, domain] = email.split('@');
    emailConfig.address = address;
    emailConfig.domain = domain;
  }
  
  return emailConfig;
}