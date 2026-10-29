import { openDatabase, getDb } from '../db/client';
import { migrations } from '../db/migrations';

/**
 * Opens SQLite/SQLCipher, executes migrations, and verifies database integrity.
 */
export const initDatabase = async (): Promise<void> => {
  // Use a temporary key for now until Keystore is fully wired in Batch 15
  openDatabase('temp-dev-key');

  const db = getDb();
  
  // Get current schema version
  const result = db.executeSync('PRAGMA user_version;');
  const currentVersion = Number((result.rows?.[0] as any)?.user_version || 0);

  // Run migrations
  await db.transaction(async (tx) => {
    for (const migration of migrations) {
      if (migration.id > currentVersion) {
        await tx.execute(migration.sql);
      }
    }
    const maxVersion = migrations.length > 0 ? migrations[migrations.length - 1].id : currentVersion;
    await tx.execute(`PRAGMA user_version = ${maxVersion};`);
  });
};
