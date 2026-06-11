#!/usr/bin/env node

/**
 * Replace /images/... references with Cloudflare URLs in source code
 * Usage: node --env-file=.env.local scripts/update-static-refs.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const MAP_FILE = path.join(rootDir, 'cloudflare-static-map.json')

// Load mapping
if (!fs.existsSync(MAP_FILE)) {
  console.error('❌ cloudflare-static-map.json not found.')
  console.error('   Run: node --env-file=.env.local scripts/migrate-static-images.js')
  process.exit(1)
}

const map = JSON.parse(fs.readFileSync(MAP_FILE, 'utf8'))

console.log('\n🚀 Starting code reference updates...\n')
console.log(`Loaded ${Object.keys(map).length} image mappings from ${MAP_FILE}\n`)

function getAllFiles(dir, pattern) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    // Skip node_modules, .next, .git, etc.
    if (['node_modules', '.next', '.git', '.vercel', 'dist', 'build'].includes(entry.name)) {
      continue
    }

    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...getAllFiles(fullPath, pattern))
    } else if (entry.isFile() && pattern.test(entry.name)) {
      files.push(fullPath)
    }
  }

  return files
}

function updateFileReferences(filePath, map) {
  let content = fs.readFileSync(filePath, 'utf8')
  let originalContent = content
  let changeCount = 0

  for (const [localPath, cloudflareUrl] of Object.entries(map)) {
    // Create regex that matches the path in quotes, apostrophes, template literals
    const escaped = localPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const patterns = [
      new RegExp(`(['"])${escaped}(['"])`, 'g'), // Single and double quotes
      new RegExp(`\`${escaped}\``, 'g'), // Template literals
    ]

    for (const pattern of patterns) {
      const matches = content.match(pattern)
      if (matches) {
        changeCount += matches.length
        content = content.replace(pattern, (match) => {
          const quote = match[0]
          return `${quote}${cloudflareUrl}${quote}`
        })
      }
    }
  }

  if (changeCount > 0) {
    // Create backup
    const bakPath = filePath + '.bak'
    fs.writeFileSync(bakPath, originalContent)

    // Write updated content
    fs.writeFileSync(filePath, content)
    console.log(`✓ ${path.relative(rootDir, filePath)} — ${changeCount} replacement(s)`)

    return true
  }

  return false
}

async function main() {
  const sourceFiles = getAllFiles(path.join(rootDir, 'app'), /\.(js|jsx|ts|tsx)$/)
  const componentFiles = getAllFiles(path.join(rootDir, 'components'), /\.(js|jsx|ts|tsx)$/)
  const libFiles = getAllFiles(path.join(rootDir, 'lib'), /\.(js|jsx|ts|tsx)$/)

  const allFiles = [...sourceFiles, ...componentFiles, ...libFiles]

  console.log(`Found ${allFiles.length} source files to scan\n`)

  let updatedCount = 0

  for (const file of allFiles) {
    if (updateFileReferences(file, map)) {
      updatedCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log('✅ Code reference updates complete!')
  console.log('='.repeat(60))
  console.log(`Updated: ${updatedCount} files`)
  console.log('')
  console.log('🔄 Backups created with .bak extension')
  console.log('')
  console.log('Next steps:')
  console.log('  1. Review the changes: git diff')
  console.log('  2. Run the build: npm run build')
  console.log('  3. Commit: git add . && git commit -m "chore: update image refs to Cloudflare"')
  console.log('  4. Push: git push')
  console.log('')
}

main().catch((err) => {
  console.error('\n❌ Update failed:', err.message)
  process.exit(1)
})
