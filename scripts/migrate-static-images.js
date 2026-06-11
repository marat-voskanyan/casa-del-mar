#!/usr/bin/env node

/**
 * Upload all static images from public/images/ to Cloudflare Images
 * Usage: node --env-file=.env.local scripts/migrate-static-images.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const imagesDir = path.join(rootDir, 'public', 'images')
const MAP_FILE = path.join(rootDir, 'cloudflare-static-map.json')

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

// Load or create mapping
const map = fs.existsSync(MAP_FILE)
  ? JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))
  : {}

async function uploadBufferToCloudflare(buffer, filename) {
  const form = new FormData()
  const mimeType = getMimeType(filename)
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType })
  form.append('file', blob, filename)

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
    throw new Error(data.errors?.[0]?.message || 'Upload failed')
  }

  return `https://imagedelivery.net/${ACCOUNT_HASH}/${data.result.id}/public`
}

function getAllFiles(dir, base = '') {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(base, entry.name)

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, relativePath))
    } else if (entry.isFile()) {
      files.push({ full: fullPath, relative: relativePath })
    }
  }

  return files
}

async function main() {
  console.log('\n🚀 Starting static images migration to Cloudflare...\n')

  if (!fs.existsSync(imagesDir)) {
    console.log(`❌ Directory not found: ${imagesDir}`)
    process.exit(1)
  }

  const files = getAllFiles(imagesDir)
  const imageFiles = files.filter((f) => {
    const ext = path.extname(f.full).toLowerCase()
    return ext !== '.svg' // Skip SVGs
  })

  console.log(`Found ${imageFiles.length} image files (SVGs excluded)\n`)

  let migrated = 0
  let skipped = 0
  let failed = 0

  for (const file of imageFiles) {
    const publicPath = `/images/${file.relative.replace(/\\/g, '/')}`

    // Check if already migrated
    if (map[publicPath]) {
      console.log(`⏭  ${publicPath} — already migrated`)
      skipped++
      continue
    }

    try {
      console.log(`🔄 ${publicPath} — uploading...`)
      const buffer = fs.readFileSync(file.full)
      const filename = path.basename(file.full)
      const url = await uploadBufferToCloudflare(buffer, filename)
      map[publicPath] = url
      fs.writeFileSync(MAP_FILE, JSON.stringify(map, null, 2))
      console.log(`✓ ${publicPath}`)
      migrated++
    } catch (err) {
      console.log(`✗ ${publicPath} — failed (${err.message})`)
      failed++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Static images migration complete!')
  console.log('='.repeat(60))
  console.log(`Migrated: ${migrated} | Skipped: ${skipped} | Failed: ${failed}`)
  console.log(`Mapping saved to: ${MAP_FILE}`)
  console.log('\nNext step: node --env-file=.env.local scripts/update-static-refs.js')
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
