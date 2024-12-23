export type AccountType = 'checking' | 'wallet' | 'credit' | 'debit';
export type SettlementType = 'partial' | 'full';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  linkedAccountId?: string;
  creditLimit?: number;
  settlementDate?: Date;
  settlementAmount?: number;
  settlementType?: SettlementType;
}