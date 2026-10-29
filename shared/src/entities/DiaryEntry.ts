import { SyncableEntity } from './Common';

export interface DiaryEntry extends SyncableEntity {
  entry_date: string; // YYYY-MM-DD
  title?: string | null;
  text: string;
  mood?: string | null;
  is_private: boolean;
}
