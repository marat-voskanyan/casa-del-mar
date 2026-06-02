# Casa del Mar — Replace Office Images

Read CLAUDE.md for full project context.
Complete this task automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK — Replace Office Photos

Two new images are in public/images/:
- Outdoor new.png  (replaces Outdoor.jpeg)
- Inside new.png   (replaces Inside.jpeg)

The animation must work exactly the same way.
Only the image files change, nothing else.

---

## Step 1 — Rename files to URL-safe names

Run this script:

```javascript
// scripts/rename-office-images.js
const fs = require('fs')
const path = require('path')

const renames = [
  ['public/images/Outdoor new.png', 'public/images/outdoor-new.png'],
  ['public/images/Inside new.png',  'public/images/inside-new.png'],
]

renames.forEach(([from, to]) => {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to)
    console.log(`Renamed: ${from} → ${to}`)
  } else {
    console.log(`Not found: ${from} — checking alternate names...`)
    // List files to help debug
    const files = fs.readdirSync('public/images')
    const matches = files.filter(f => 
      f.toLowerCase().includes('outdoor') || 
      f.toLowerCase().includes('inside')
    )
    console.log('Found:', matches)
  }
})
```

Run: node scripts/rename-office-images.js

---

## Step 2 — Update image paths in component

Find components/OfficeScrollExperience.tsx
Replace ALL occurrences of old image paths:

OLD: /images/Outdoor.jpeg
NEW: /images/outdoor-new.png

OLD: /images/Inside.jpeg
NEW: /images/inside-new.png

Search entire codebase for these paths:
grep -r "Outdoor.jpeg" --include="*.tsx" --include="*.ts" .
grep -r "Inside.jpeg" --include="*.tsx" --include="*.ts" .

Replace every single occurrence found.

Also check lib/images.ts if office images are stored there.

---

## Step 3 — Update alt text

Update alt text to match new photos:
- Outdoor: "Casa del Mar office entrance Yerevan Armenia"
- Inside: "Casa del Mar office interior Yerevan Armenia"

---

## Step 4 — Verify files exist

```bash
ls -la public/images/outdoor-new.png
ls -la public/images/inside-new.png
```

If the files have different names find them:
```bash
ls public/images/ | grep -i "outdoor\|inside\|office"
```

Use whatever names the files actually have.

---

## Step 5 — Keep animation identical

Do NOT change anything in the animation logic.
Do NOT change scroll thresholds or timing.
Do NOT change the mobile tap behavior.
Only the src paths change.

---

## Final Step

```bash
npm run build
git add .
git commit -m "Office images replaced - outdoor-new and inside-new"
git push
vercel --prod
```

---

## Checklist:
- [ ] Files renamed to URL-safe names
- [ ] All Outdoor.jpeg references replaced
- [ ] All Inside.jpeg references replaced
- [ ] New paths use outdoor-new.png and inside-new.png
- [ ] Animation logic unchanged
- [ ] Mobile tap behavior unchanged
- [ ] Alt text updated
- [ ] npm run build passes
- [ ] Deployed to Vercel
