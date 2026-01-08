
export enum ClientStatus {
  TRIAL = 'Em teste',
  ACTIVE = 'Ativo',
  BILLING = 'Em cobrança',
  EXPIRED = 'Vencido'
}

export enum SaleStatus {
  PAID = 'Paga',
  PENDING = 'Pendente',
  CANCELLED = 'Cancelada'
}

export enum BillingTrigger {
  D3 = 'D-3',
  D1 = 'D-1',
  D0 = 'D-0'
}

export interface Client {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  status: ClientStatus;
  plan: string;
  startDate: string;
  expiryDate: string;
  affiliateId: string;
  billingHistory: {
    d3Sent: boolean;
    d1Sent: boolean;
    d0Sent: boolean;
    lastBillingDate?: string;
  };
}

export interface Sale {
  id: string;
  clientId: string;
  clientName: string;
  plan: string;
  value: number;
  commission: number;
  paymentMethod: string;
  date: string;
  status: SaleStatus;
}

export interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  conversion: string;
}

export interface Trial {
  id: string;
  login: string;
  pass: string;
  expiry: string;
  clientId: string;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
}
