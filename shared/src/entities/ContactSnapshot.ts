export interface ContactSnapshot {
  id: string;
  contact_id: string;
  display_name: string;
  phones: string[];
  emails: string[];
  labels: string[];
  last_seen_at: string;
}
