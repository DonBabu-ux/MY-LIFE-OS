import { SyncableEntity } from './Common';

export interface Note extends SyncableEntity {
  title?: string | null;
  body: string;
  folder?: string | null;
  is_favorite: boolean;
  tags?: string[];
}
