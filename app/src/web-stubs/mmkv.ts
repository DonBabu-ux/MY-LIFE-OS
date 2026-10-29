// Web stub for react-native-mmkv — falls back to localStorage
export class MMKV {
  private prefix: string;

  constructor(config?: { id?: string }) {
    this.prefix = config?.id ?? 'mmkv';
  }

  set(key: string, value: string | number | boolean): void {
    try {
      localStorage.setItem(`${this.prefix}:${key}`, JSON.stringify(value));
    } catch (_) {}
  }

  getString(key: string): string | undefined {
    try {
      const v = localStorage.getItem(`${this.prefix}:${key}`);
      if (v === null) return undefined;
      const parsed = JSON.parse(v);
      return typeof parsed === 'string' ? parsed : String(parsed);
    } catch (_) {
      return undefined;
    }
  }

  getNumber(key: string): number | undefined {
    const v = this.getString(key);
    return v !== undefined ? Number(v) : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const v = this.getString(key);
    return v !== undefined ? v === 'true' : undefined;
  }

  contains(key: string): boolean {
    return localStorage.getItem(`${this.prefix}:${key}`) !== null;
  }

  delete(key: string): void {
    localStorage.removeItem(`${this.prefix}:${key}`);
  }

  clearAll(): void {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(`${this.prefix}:`))
      .forEach((k) => localStorage.removeItem(k));
  }

  getAllKeys(): string[] {
    return Object.keys(localStorage)
      .filter((k) => k.startsWith(`${this.prefix}:`))
      .map((k) => k.slice(this.prefix.length + 1));
  }
}

export default MMKV;
