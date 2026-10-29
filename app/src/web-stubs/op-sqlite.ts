// Web stub for @op-engineering/op-sqlite
// On web we use an in-memory store (real SQLite via sql.js can be added later)
let _db: any = null;

export const open = ({ name }: { name: string; location?: string }) => {
  console.warn(`[web-stub] op-sqlite: opened mock DB "${name}" — data is not persisted on web.`);
  const tables: Record<string, any[]> = {};
  _db = {
    execute: (sql: string, _params?: any[]) => {
      console.debug('[web-stub] op-sqlite execute:', sql);
      return { rows: { length: 0, item: (_i: number) => null, _array: [] } };
    },
    transaction: (fn: (tx: any) => void) => {
      fn({
        execute: (sql: string, _params?: any[]) => {
          console.debug('[web-stub] op-sqlite tx execute:', sql);
          return { rows: { length: 0, item: (_i: number) => null, _array: [] } };
        },
      });
    },
    close: () => {},
  };
  return _db;
};

export const getDb = () => _db;
export default { open };
