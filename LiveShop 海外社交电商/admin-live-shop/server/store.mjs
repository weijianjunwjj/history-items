import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

export function createStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS records (collection TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY(collection,id));
    CREATE TABLE IF NOT EXISTS sequences (collection TEXT PRIMARY KEY, value INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, uid TEXT NOT NULL, expires INTEGER NOT NULL);
  `);
  const read = db.prepare('SELECT data FROM records WHERE collection = ? AND id = ?');
  const write = db.prepare('INSERT INTO records VALUES (?,?,?) ON CONFLICT(collection,id) DO UPDATE SET data=excluded.data');
  const store = {
    db,
    list(collection) {
      return db.prepare('SELECT data FROM records WHERE collection=? ORDER BY CAST(id AS INTEGER),id').all(collection).map(row => JSON.parse(row.data));
    },
    get(collection, id) {
      const row = read.get(collection, String(id));
      return row ? JSON.parse(row.data) : undefined;
    },
    save(collection, record) {
      let id = record.id;
      if (!id) {
        id = Number(db.prepare('INSERT INTO sequences VALUES (?,1) ON CONFLICT(collection) DO UPDATE SET value=value+1 RETURNING value').get(collection).value);
      } else if (Number.isSafeInteger(Number(id))) {
        db.prepare('INSERT INTO sequences VALUES (?,?) ON CONFLICT(collection) DO UPDATE SET value=MAX(value,excluded.value)').run(collection, Number(id));
      }
      const old = store.get(collection, id);
      const now = Math.floor(Date.now() / 1000);
      const saved = { createTime: now, created_at: new Date().toISOString(), ...old, ...record, id, updateTime: now };
      write.run(collection, String(id), JSON.stringify(saved));
      return saved;
    },
    remove(collection, ids) {
      const values = (Array.isArray(ids) ? ids : String(ids ?? '').split(',')).filter(id => id !== '');
      const statement = db.prepare('DELETE FROM records WHERE collection=? AND id=?');
      let count = 0;
      for (const id of values) count += statement.run(collection, String(id)).changes;
      return { count };
    },
    replace(collection, records) {
      db.prepare('DELETE FROM records WHERE collection=?').run(collection);
      return records.map(record => store.save(collection, record));
    },
    close() { db.close(); },
  };
  return store;
}
