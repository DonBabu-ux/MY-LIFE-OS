import { RecurringPeriod } from '../enums';

export interface RecurringRule {
  id: string;
  merchant?: string | null;
  amount_minor?: number | null;
  period: RecurringPeriod;
  next_run_at: string;
  last_seen_at?: string | null;
  confidence: number;
  created_at: string;
}
