#!/usr/bin/env node

/**
 * Migrate property photos from Vercel Blob / local paths to Cloudflare Images
 * Usage: node --env-file=.env.local scripts/migrate-db-photos.js
 */

import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const LOG_FILE = path.join(rootDir, 'migration-log.json')

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const ACCOUNT_HASH = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH

if (!ACCOUNT_ID || !API_TOKEN || !ACCOUNT_HASH) {
  console.error('❌ Cloudflare credentials not found. Set:')
  console.error('  - CLOUDFLARE_ACCOUNT_ID')
  console.error('  - CLOUDFLARE_API_TOKEN')
  console.error('  - NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH')
  process.exit(1)
}

function getMimeType(filename) {
  const ext = filename.toLowerCase().split('.').pop()
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    avif: 'image/avif',
    svg: 'image/svg+xml',
    heic: 'image/heic',
  }
  return mimeTypes[ext] || 'image/jpeg'
}

// Load or create migration log
const log = fs.existsSync(LOG_FILE)
  ? JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'))
  : {}

async function uploadBufferToCloudflare(buffer, filename) {
  const mimeType = getMimeType(filename)
  const form = new FormData()
  const fileBlob = new Blob([buffer], { type: mimeType })
  form.append('file', fileBlob, filename)

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: form,
    }
  )

  const data = await res.json()
  if (!data.success) {
    const msg = Array.isArray(data.errors) && data.errors[0] ? data.errors[0].message : 'Unknown error'
    throw new Error(`Upload failed: ${msg}`)
  }

  if (!data.result || !data.result.id) {
    throw new Error('No image ID returned from Cloudflare')
  }

  return `https://imagedelivery.net/${ACCOUNT_HASH}/${data.result.id}/public`
}

async function migrateUrl(url, label) {
  if (!url || url.trim() === '') return null

  // Already on Cloudflare
  if (url.includes('imagedelivery.net')) {
    console.log(`  ⏭  ${label}: already on Cloudflare`)
    return url
  }

  // Check if already migrated
  if (log[url]) {
    console.log(`  ⏭  ${label}: already migrated`)
    return log[url]
  }

  let buffer, filename

  try {
    if (url.startsWith('http')) {
      // Download from Vercel Blob or other URL
      console.log(`  ⬇️  ${label}: downloading from URL...`)
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const arrayBuffer = await res.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      filename = url.split('/').pop()?.split('?')[0] || 'image.jpg'
    } else {
      // Local path like /uploads/filename.jpg
      const localPath = path.join(rootDir, 'public', url)
      if (!fs.existsSync(localPath)) {
        console.log(`  ✗ ${label}: local file not found (${localPath}) — skipping`)
        return null
      }
      console.log(`  📁 ${label}: found local file`)
      buffer = fs.readFileSync(localPath)
      filename = path.basename(url)
    }

    // Upload to Cloudflare
    console.log(`  🔄 ${label}: uploading to Cloudflare...`)
    const newUrl = await uploadBufferToCloudflare(buffer, filename)
    log[url] = newUrl
    fs.writeFileSync(LOG_FILE, JSON.stringify(log, null, 2))
    console.log(`  ✓ ${label}: ✅ migrated`)
    return newUrl
  } catch (err) {
    console.log(`  ✗ ${label}: failed (${err.message}) — skipping`)
    return null
  }
}

async function main() {
  console.log('\n🚀 Starting property photo migration to Cloudflare...\n')

  let stats = { migrated: 0, skipped: 0, missing: 0, failed: 0 }

  const { rows } = await db.execute('SELECT id, images FROM properties')

  for (const property of rows) {
    const propertyId = property.id
    console.log(`\n📸 Property ${propertyId}:`)

    let images = []
    try {
      images = JSON.parse(property.images || '[]')
    } catch (e) {
      console.log(`  ⚠️  Failed to parse images JSON — skipping`)
      continue
    }

    if (!images.length) {
      console.log(`  (no images)`)
      continue
    }

    const newImages = []

    for (let i = 0; i < images.length; i++) {
      const oldUrl = images[i]
      const label = `image ${i + 1}/${images.length}`

      const newUrl = await migrateUrl(oldUrl, label)

      if (newUrl) {
        newImages.push(newUrl)
        if (oldUrl.includes('imagedelivery.net') || log[oldUrl] === newUrl) {
          stats.skipped++
        } else {
          stats.migrated++
        }
      } else {
        if (!oldUrl.startsWith('http') && !oldUrl.includes('imagedelivery.net')) {
          stats.missing++
        } else {
          stats.failed++
        }
      }
    }

    // Update database if any images changed
    if (newImages.length !== images.length || newImages.some((url, i) => url !== images[i])) {
      const imagesJson = JSON.stringify(newImages)
      await db.execute({
        sql: 'UPDATE properties SET images = ? WHERE id = ?',
        args: [imagesJson, propertyId],
      })
      console.log(`  📝 Database updated: ${images.length} → ${newImages.length} images`)
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Migration complete!')
  console.log('='.repeat(60))
  console.log(`Migrated: ${stats.migrated} | Skipped: ${stats.skipped} | Missing: ${stats.missing} | Failed: ${stats.failed}`)
  console.log(`Migration log saved to: ${LOG_FILE}`)
  console.log('')

  db.close()
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
