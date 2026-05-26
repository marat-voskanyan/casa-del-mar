/**
 * One-time script: rename uploaded Benidorm photos to URL-safe filenames.
 * Run once from the project root: node scripts/rename-images.js
 */

const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'public', 'images')

const renames = [
  ['Benidorm.jpg',                   'benidorm.jpg'],
  ['Tallest building.jpg',           'tallest-building.jpg'],
  ['Poniente Beach.jpg',             'poniente-beach.jpg'],
  ['View from apartment .jpg',       'view-from-apartment.jpg'],
  ['Poniente beach and palmas.jpg',  'poniente-beach-palmas.jpg'],
  ['La Cala.jpg',                    'la-cala.jpg'],
  ['La Cala Beach.jpg',              'la-cala-beach.jpg'],
]

for (const [from, to] of renames) {
  const src = path.join(dir, from)
  const dst = path.join(dir, to)
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst)
    console.log(`✓  ${from}  →  ${to}`)
  } else if (fs.existsSync(dst)) {
    console.log(`—  ${to}  (already renamed)`)
  } else {
    console.warn(`⚠  Not found: ${from}`)
  }
}

console.log('\nDone.')
