import { getDb } from '../client';
import { BaseRow } from '../types';

export class BaseRepository<T extends BaseRow> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public findById(id: string): T | null {
    const db = getDb();
    const result = db.executeSync(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    if (result.rows && result.rows.length > 0) {
      return result.rows[0] as unknown as T;
    }
    return null;
  }

  public findAll(): T[] {
    const db = getDb();
    const result = db.executeSync(`SELECT * FROM ${this.tableName} WHERE deleted_at IS NULL`);
    const items: T[] = [];
    if (result.rows) {
      for (let i = 0; i < result.rows.length; i++) {
        items.push(result.rows[i] as unknown as T);
      }
    }
    return items;
  }

  public create(data: Partial<T>): void {
    const db = getDb();
    const keys = Object.keys(data);
    const values = Object.values(data) as any[];
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    
    db.executeSync(sql, values);
  }

  public update(id: string, data: Partial<T>): void {
    const db = getDb();
    const keys = Object.keys(data);
    const values = Object.values(data) as any[];
    const setClause = keys.map((key) => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    db.executeSync(sql, [...values, id]);
  }

  public softDelete(id: string): void {
    const db = getDb();
    db.executeSync(
      `UPDATE ${this.tableName} SET deleted_at = ?, sync_state = 'pending_sync' WHERE id = ?`,
      [new Date().toISOString(), id]
    );
  }

  public hardDelete(id: string): void {
    const db = getDb();
    db.executeSync(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
  }
}
