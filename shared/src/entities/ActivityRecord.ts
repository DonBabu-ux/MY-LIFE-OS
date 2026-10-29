export interface ActivityRecord {
  id: string;
  bucket_date: string; // YYYY-MM-DD
  steps: number;
  distance_m: number;
  active_ms: number;
}
