import { CategoryKind } from '../enums';
import { BaseEntity } from './Common';

export interface Category extends BaseEntity {
  name: string;
  kind: CategoryKind;
  icon?: string | null;
  color?: string | null;
  is_system: boolean;
  sort_order: number;
}
