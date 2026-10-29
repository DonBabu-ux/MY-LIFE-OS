import { SourceType, TransactionType } from '../enums';
import { SyncableEntity } from './Common';

export interface Transaction extends SyncableEntity {
  type: TransactionType;
  amount_minor: number;
  currency: string;
  occurred_at: string;
  merchant?: string | null;
  reference?: string | null;
  description?: string | null;
  category_id?: string | null;
  source: SourceType;
  receipt_id?: string | null;
}
