export interface BaseContact {
  name?: string;
  email: string;
  phone: string;
  privacy: boolean;
  utm_campaign?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_source?: string;
  utm_term?: string;
}

export interface PendingContact extends BaseContact {
  token: string;
  expirationDate: number;
}
