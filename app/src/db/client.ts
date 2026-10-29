import { open, DB } from '@op-engineering/op-sqlite';

export const DB_NAME = 'mylifeos.sqlite';

let dbInstance: DB | null = null;

/**
 * Initializes the database connection with encryption key.
 * @param encryptionKey The 256-bit AES key for SQLCipher (as a hex string or raw string supported by op-sqlite).
 */
export const openDatabase = (encryptionKey: string): DB => {
  if (dbInstance) {
    return dbInstance;
  }

  // Open the database with encryption
  dbInstance = open({
    name: DB_NAME,
    encryptionKey,
  });

  // Execute required PRAGMAs
  dbInstance.execute('PRAGMA foreign_keys = ON;');
  dbInstance.execute('PRAGMA journal_mode = WAL;');

  return dbInstance;
};

export const getDb = (): DB => {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call openDatabase first.');
  }
  return dbInstance;
};

export const closeDatabase = () => {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
};
