import { createClient } from '@libsql/client'

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const stmts = [
  `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL, location TEXT NOT NULL,
    price REAL NOT NULL DEFAULT 0,
    bedrooms INTEGER, bathrooms INTEGER, floor INTEGER, size_sqm REAL,
    parking INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'available',
    country TEXT NOT NULL DEFAULT 'spain',
    ref TEXT,
    description_en TEXT, description_ru TEXT, description_hy TEXT,
    features_en TEXT, features_ru TEXT, features_hy TEXT,
    internal_notes TEXT,
    images TEXT NOT NULL DEFAULT '[]',
    latitude REAL, longitude REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TRIGGER IF NOT EXISTS trg_properties_updated_at
    AFTER UPDATE ON properties FOR EACH ROW
    BEGIN UPDATE properties SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id; END`,
]

await db.batch(stmts, 'write')
const t = await db.execute("SELECT name FROM sqlite_master WHERE type='table'")
console.log('Tables created on Turso:', t.rows.map(r => r.name).join(', '))
process.exit(0)
