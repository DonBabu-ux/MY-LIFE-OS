import { ReceiptSource } from '../enums';
import { SyncableEntity } from './Common';

export interface ReceiptItem {
  id: string;
  receipt_id: string;
  name: string;
  quantity?: number | null;
  unit_price_minor?: number | null;
}

export interface Receipt extends SyncableEntity {
  file_path: string;
  mime: string;
  source: ReceiptSource;
  merchant?: string | null;
  amount_minor?: number | null;
  currency?: string | null;
  occurred_at?: string | null;
  extracted_text?: string | null;
  category_id?: string | null;
  dedup_hash?: string | null;
  items?: ReceiptItem[];
}
