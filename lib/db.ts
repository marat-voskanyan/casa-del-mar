import { DatabaseSync, type SQLInputValue } from 'node:sqlite'
import path from 'path'
import fs from 'fs'
import type { Property } from '@/types'

const DB_PATH =
  process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'casa.db')

let _db: DatabaseSync | null = null

export function getDb(): DatabaseSync {
  if (_db) return _db

  const dir = path.dirname(DB_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  _db = new DatabaseSync(DB_PATH)
  _db.exec('PRAGMA journal_mode = WAL')
  _db.exec('PRAGMA foreign_keys = ON')
  initSchema(_db)
  return _db
}

function initSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
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
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT        NOT NULL,
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TRIGGER IF NOT EXISTS trg_properties_updated_at
      AFTER UPDATE ON properties FOR EACH ROW
      BEGIN
        UPDATE properties SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
      END;
  `)

  // ── Migrations for existing DBs ──
  const cols = db.prepare('PRAGMA table_info(properties)').all() as { name: string }[]
  const names = new Set(cols.map(c => c.name))

  if (!names.has('images')) {
    db.exec("ALTER TABLE properties ADD COLUMN images TEXT NOT NULL DEFAULT '[]'")
    const rows = db.prepare('SELECT id, image1, image2, image3 FROM properties').all() as {
      id: number; image1: string | null; image2: string | null; image3: string | null
    }[]
    const upd = db.prepare('UPDATE properties SET images = $images WHERE id = $id')
    for (const row of rows) {
      const imgs = [row.image1, row.image2, row.image3].filter(Boolean)
      upd.run({ images: JSON.stringify(imgs), id: row.id })
    }
  }
  if (!names.has('latitude'))       { db.exec('ALTER TABLE properties ADD COLUMN latitude REAL') }
  if (!names.has('longitude'))      { db.exec('ALTER TABLE properties ADD COLUMN longitude REAL') }
  if (!names.has('ref'))            { db.exec('ALTER TABLE properties ADD COLUMN ref TEXT') }
  if (!names.has('features_en'))    { db.exec('ALTER TABLE properties ADD COLUMN features_en TEXT') }
  if (!names.has('features_ru'))    { db.exec('ALTER TABLE properties ADD COLUMN features_ru TEXT') }
  if (!names.has('features_hy'))    { db.exec('ALTER TABLE properties ADD COLUMN features_hy TEXT') }
  if (!names.has('internal_notes')) { db.exec('ALTER TABLE properties ADD COLUMN internal_notes TEXT') }
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

export function getAllProperties(country?: string): Property[] {
  const db = getDb()
  const rows = country
    ? db.prepare('SELECT * FROM properties WHERE country = $country ORDER BY created_at DESC').all({ country })
    : db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all()
  return (rows as Record<string, unknown>[]).map(toProperty)
}

export function getPropertyById(id: number): Property | null {
  const row = getDb().prepare('SELECT * FROM properties WHERE id = $id').get({ id })
  return row ? toProperty(row as Record<string, unknown>) : null
}

export function getFeaturedProperties(limit = 6): Property[] {
  const rows = getDb()
    .prepare("SELECT * FROM properties WHERE status = 'available' ORDER BY created_at DESC LIMIT $limit")
    .all({ limit })
  return (rows as Record<string, unknown>[]).map(toProperty)
}

export function getSimilarProperties(id: number, country: string, limit = 4): Property[] {
  const rows = getDb()
    .prepare('SELECT * FROM properties WHERE country = $country AND id != $id ORDER BY created_at DESC LIMIT $limit')
    .all({ country, id, limit })
  return (rows as Record<string, unknown>[]).map(toProperty)
}

export function createProperty(data: Record<string, SQLInputValue>): number {
  return Number(
    getDb().prepare(`
      INSERT INTO properties
        (name, location, price, bedrooms, bathrooms, floor, size_sqm, parking,
         status, country, ref, description_en, description_ru, description_hy,
         features_en, features_ru, features_hy, internal_notes,
         images, latitude, longitude)
      VALUES
        ($name, $location, $price, $bedrooms, $bathrooms, $floor, $size_sqm, $parking,
         $status, $country, $ref, $description_en, $description_ru, $description_hy,
         $features_en, $features_ru, $features_hy, $internal_notes,
         $images, $latitude, $longitude)
    `).run(data).lastInsertRowid
  )
}

export function updateProperty(id: number, data: Record<string, SQLInputValue>): void {
  getDb().prepare(`
    UPDATE properties SET
      name = $name, location = $location, price = $price,
      bedrooms = $bedrooms, bathrooms = $bathrooms, floor = $floor,
      size_sqm = $size_sqm, parking = $parking, status = $status,
      country = $country, ref = $ref,
      description_en = $description_en, description_ru = $description_ru,
      description_hy = $description_hy,
      features_en = $features_en, features_ru = $features_ru,
      features_hy = $features_hy, internal_notes = $internal_notes,
      images = $images, latitude = $latitude, longitude = $longitude
    WHERE id = $id
  `).run({ ...data, id })
}

export function deleteProperty(id: number): void {
  getDb().prepare('DELETE FROM properties WHERE id = $id').run({ id })
}

// ── Admin user queries ────────────────────────────────────────────────────────

export function getAdminUser(username: string): Record<string, unknown> | null {
  return (getDb().prepare('SELECT * FROM admin_users WHERE username = $username').get({ username }) ?? null) as Record<string, unknown> | null
}

export function getAdminCount(): number {
  const row = getDb().prepare('SELECT COUNT(*) as count FROM admin_users').get() as { count: number }
  return row.count
}

export function createAdminUser(username: string, passwordHash: string): void {
  getDb().prepare('INSERT INTO admin_users (username, password_hash) VALUES ($username, $password_hash)').run({ username, password_hash: passwordHash })
}
