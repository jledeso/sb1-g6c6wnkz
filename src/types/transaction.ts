export type PeriodicType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface Transaction {
  id: string;
  accountId: string;
  date: Date;
  amount: number;
  concept: string;
  category: string;
  isPeriodic: boolean;
  periodicType?: PeriodicType;
  startDate?: Date;
  endDate?: Date;
  nextExecutionDate?: Date;
}