import { createClient, type Client, type InValue } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import type { Property } from '@/types'

// Re-export type so existing callers that import `SQLInputValue` keep working.
export type SQLInputValue = InValue

let _db: Client | null = null
let _schemaReady: Promise<void> | null = null

/**
 * Returns a libsql client. In production it connects to Turso via
 * TURSO_DATABASE_URL + TURSO_AUTH_TOKEN. Locally it falls back to a
 * file-based SQLite db at data/casa.db.
 */
export function getDb(): Client {
  if (_db) return _db

  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (url) {
    _db = createClient({ url, authToken })
  } else {
    // Local fallback — file: URL
    const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'casa.db')
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    _db = createClient({ url: `file:${dbPath}` })
  }

  return _db
}

/** Idempotent schema creation; cached so it only runs once per cold start. */
export function ensureSchema(): Promise<void> {
  if (_schemaReady) return _schemaReady
  _schemaReady = initSchema(getDb())
  return _schemaReady
}

async function initSchema(db: Client) {
  await db.batch([
    `CREATE TABLE IF NOT EXISTS properties (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      name            TEXT    NOT NULL,
      location        TEXT    NOT NULL,
      price           REAL    NOT NULL DEFAULT 0,
      bedrooms        INTEGER,
      bathrooms       INTEGER,
      floor           INTEGER,
      size_sqm        REAL,
      parking         INTEGER NOT NULL DEFAULT 0,
      status          TEXT    NOT NULL DEFAULT 'available',
      country         TEXT    NOT NULL DEFAULT 'spain',
      ref             TEXT,
      description_en  TEXT,
      description_ru  TEXT,
      description_hy  TEXT,
      features_en     TEXT,
      features_ru     TEXT,
      features_hy     TEXT,
      internal_notes  TEXT,
      images          TEXT    NOT NULL DEFAULT '[]',
      latitude        REAL,
      longitude       REAL,
      created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at      DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TRIGGER IF NOT EXISTS trg_properties_updated_at
      AFTER UPDATE ON properties FOR EACH ROW
      BEGIN
        UPDATE properties SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END`,
  ], 'write')

  // ── Lightweight migrations for older DBs ───────────────────────────────────
  const info = await db.execute('PRAGMA table_info(properties)')
  const names = new Set(info.rows.map(r => (r as Record<string, unknown>).name as string))

  const alters: string[] = []
  if (!names.has('images'))         alters.push("ALTER TABLE properties ADD COLUMN images TEXT NOT NULL DEFAULT '[]'")
  if (!names.has('latitude'))       alters.push('ALTER TABLE properties ADD COLUMN latitude REAL')
  if (!names.has('longitude'))      alters.push('ALTER TABLE properties ADD COLUMN longitude REAL')
  if (!names.has('ref'))            alters.push('ALTER TABLE properties ADD COLUMN ref TEXT')
  if (!names.has('description_en')) alters.push('ALTER TABLE properties ADD COLUMN description_en TEXT')
  if (!names.has('description_ru')) alters.push('ALTER TABLE properties ADD COLUMN description_ru TEXT')
  if (!names.has('description_hy')) alters.push('ALTER TABLE properties ADD COLUMN description_hy TEXT')
  if (!names.has('features_en'))    alters.push('ALTER TABLE properties ADD COLUMN features_en TEXT')
  if (!names.has('features_ru'))    alters.push('ALTER TABLE properties ADD COLUMN features_ru TEXT')
  if (!names.has('features_hy'))    alters.push('ALTER TABLE properties ADD COLUMN features_hy TEXT')
  if (!names.has('internal_notes')) alters.push('ALTER TABLE properties ADD COLUMN internal_notes TEXT')
  if (!names.has('size_sqm'))       alters.push('ALTER TABLE properties ADD COLUMN size_sqm REAL')
  if (alters.length) await db.batch(alters, 'write')
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseImages(raw: unknown): string[] {
  if (!raw || typeof raw !== 'string') return []
  try {
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? (arr.filter(Boolean) as string[]) : []
  } catch { return [] }
}

function toProperty(row: Record<string, unknown>): Property {
  return {
    ...(row as unknown as Property),
    images: parseImages(row.images),
    parking: row.parking ? 1 : 0,
  }
}

// ── Property queries ──────────────────────────────────────────────────────────

export async function getAllProperties(country?: string): Promise<Property[]> {
  await ensureSchema()
  const db = getDb()
  const res = country
    ? await db.execute({
        sql: 'SELECT * FROM properties WHERE country = ? ORDER BY created_at DESC',
        args: [country],
      })
    : await db.execute('SELECT * FROM properties ORDER BY created_at DESC')
  return res.rows.map(r => toProperty(r as Record<string, unknown>))
}

export async function getPropertyById(id: number): Promise<Property | null> {
  await ensureSchema()
  const res = await getDb().execute({
    sql: 'SELECT * FROM properties WHERE id = ?',
    args: [id],
  })
  const row = res.rows[0]
  return row ? toProperty(row as Record<string, unknown>) : null
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  await ensureSchema()
  const res = await getDb().execute({
    sql: "SELECT * FROM properties WHERE status = 'available' ORDER BY created_at DESC LIMIT ?",
    args: [limit],
  })
  return res.rows.map(r => toProperty(r as Record<string, unknown>))
}

export async function getSimilarProperties(id: number, country: string, limit = 4): Promise<Property[]> {
  await ensureSchema()
  const res = await getDb().execute({
    sql: 'SELECT * FROM properties WHERE country = ? AND id != ? ORDER BY created_at DESC LIMIT ?',
    args: [country, id, limit],
  })
  return res.rows.map(r => toProperty(r as Record<string, unknown>))
}

export async function createProperty(data: Record<string, SQLInputValue>): Promise<number> {
  await ensureSchema()
  const res = await getDb().execute({
    sql: `INSERT INTO properties
        (name, location, price, bedrooms, bathrooms, floor, size_sqm, parking,
         status, country, ref, description_en, description_ru, description_hy,
         features_en, features_ru, features_hy, internal_notes,
         images, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      data.name, data.location, data.price, data.bedrooms, data.bathrooms,
      data.floor, data.size_sqm, data.parking, data.status, data.country,
      data.ref, data.description_en, data.description_ru, data.description_hy,
      data.features_en, data.features_ru, data.features_hy, data.internal_notes,
      data.images, data.latitude, data.longitude,
    ],
  })
  return Number(res.lastInsertRowid)
}

export async function updateProperty(id: number, data: Record<string, SQLInputValue>): Promise<void> {
  await ensureSchema()
  await getDb().execute({
    sql: `UPDATE properties SET
        name = ?, location = ?, price = ?,
        bedrooms = ?, bathrooms = ?, floor = ?,
        size_sqm = ?, parking = ?, status = ?,
        country = ?, ref = ?,
        description_en = ?, description_ru = ?, description_hy = ?,
        features_en = ?, features_ru = ?, features_hy = ?, internal_notes = ?,
        images = ?, latitude = ?, longitude = ?
      WHERE id = ?`,
    args: [
      data.name, data.location, data.price, data.bedrooms, data.bathrooms,
      data.floor, data.size_sqm, data.parking, data.status, data.country,
      data.ref, data.description_en, data.description_ru, data.description_hy,
      data.features_en, data.features_ru, data.features_hy, data.internal_notes,
      data.images, data.latitude, data.longitude, id,
    ],
  })
}

export async function deleteProperty(id: number): Promise<void> {
  await ensureSchema()
  await getDb().execute({ sql: 'DELETE FROM properties WHERE id = ?', args: [id] })
}

// ── Admin user queries ────────────────────────────────────────────────────────

export async function getAdminUser(username: string): Promise<Record<string, unknown> | null> {
  await ensureSchema()
  const res = await getDb().execute({
    sql: 'SELECT * FROM admin_users WHERE username = ?',
    args: [username],
  })
  return (res.rows[0] as Record<string, unknown> | undefined) ?? null
}

export async function getAdminCount(): Promise<number> {
  await ensureSchema()
  const res = await getDb().execute('SELECT COUNT(*) as count FROM admin_users')
  const row = res.rows[0] as unknown as { count: number } | undefined
  return row ? Number(row.count) : 0
}

export async function createAdminUser(username: string, passwordHash: string): Promise<void> {
  await ensureSchema()
  await getDb().execute({
    sql: 'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
    args: [username, passwordHash],
  })
}
