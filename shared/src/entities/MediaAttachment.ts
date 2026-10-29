import { MediaKind, ParentType } from '../enums';

export interface MediaAttachment {
  id: string;
  parent_type: ParentType;
  parent_id: string;
  kind: MediaKind;
  local_path: string;
  duration_ms?: number | null;
  size_bytes: number;
  mime: string;
  created_at: string;
}
