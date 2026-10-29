import { ShoppingListStatus } from '../enums';
import { BaseEntity, SyncableEntity } from './Common';

export interface ShoppingList extends BaseEntity {
  name: string;
  budget_minor?: number | null;
  currency: string;
  status: ShoppingListStatus;
}

export interface ShoppingItem extends SyncableEntity {
  list_id: string;
  name: string;
  quantity: number;
  unit?: string | null;
  priority: number;
  estimated_price_minor?: number | null;
  actual_price_minor?: number | null;
  purchased: boolean;
  transaction_id?: string | null;
}

export interface PriceHistory {
  id: string;
  item_key: string;
  price_minor: number;
  currency: string;
  observed_at: string;
  source: string;
}
