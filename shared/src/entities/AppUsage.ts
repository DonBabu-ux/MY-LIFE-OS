export interface AppUsage {
  id: string;
  package_name: string;
  bucket_date: string; // YYYY-MM-DD
  duration_ms: number;
  launches: number;
  category?: string | null;
}
