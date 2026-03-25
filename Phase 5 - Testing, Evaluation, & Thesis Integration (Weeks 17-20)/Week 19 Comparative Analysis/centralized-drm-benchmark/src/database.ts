/**
 * SQLite database setup using sql.js (pure JavaScript, no native build).
 *
 * Creates tables mirroring the blockchain pallet storage maps.
 *
 * @module database
 */

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';

let db: SqlJsDatabase;

/** Initialises the in-memory SQLite database with the content rights schema. */
export async function initDatabase(): Promise<SqlJsDatabase> {
  const SQL = await initSqlJs();
  db = new SQL.Database();

  db.run(`
    CREATE TABLE IF NOT EXISTS content (
      content_id INTEGER PRIMARY KEY AUTOINCREMENT,
      creator_id TEXT NOT NULL,
      metadata_hash TEXT NOT NULL,
      title TEXT NOT NULL,
      subscription_price INTEGER NOT NULL,
      ppv_price INTEGER NOT NULL,
      ownership_price INTEGER NOT NULL,
      period_length INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subscription (
      content_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      expiry_time TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (content_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS view_pack (
      content_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      views_remaining INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (content_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS ownership (
      content_id INTEGER NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (content_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS balance (
      user_id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS event_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  return db;
}

/** Returns the active database instance. */
export function getDb(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialised. Call initDatabase() first.');
  return db;
}

/** Returns the database size in bytes. */
export function getDbSize(): number {
  return db.export().length;
}

/** Resets all data in the database. */
export function resetDatabase(): void {
  db.run('DELETE FROM event_log; DELETE FROM ownership; DELETE FROM view_pack; DELETE FROM subscription; DELETE FROM content; DELETE FROM balance;');
}
