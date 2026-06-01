const fs = require('fs')
const path = require('path')

const renames = [
  ['La Cala Drone.jpg',  'la-cala-drone.jpg'],
  ['Benidorm Main.jpeg', 'benidorm-main.jpg'],
]

renames.forEach(([oldName, newName]) => {
  const oldPath = path.join(__dirname, '..', 'public', 'images', oldName)
  const newPath = path.join(__dirname, '..', 'public', 'images', newName)
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
    console.log(`✓  ${oldName}  →  ${newName}`)
  } else if (fs.existsSync(newPath)) {
    console.log(`—  ${newName}  (already renamed)`)
  } else {
    console.warn(`⚠  Not found: ${oldName}`)
  }
})

console.log('\nDone.')
