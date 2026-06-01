# Casa del Mar — Image Swap Task

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Rename New Image Files

The new images have spaces and uppercase in filenames
which cause URL issues. Rename them first.

Create and run this script: scripts/rename-new-images.js

```javascript
const fs = require('fs')
const path = require('path')

const renames = [
  ['La Cala Drone.jpg', 'la-cala-drone.jpg'],
  ['Benidorm Main.jpeg', 'benidorm-main.jpg'],
]

renames.forEach(([oldName, newName]) => {
  const oldPath = path.join('public/images', oldName)
  const newPath = path.join('public/images', newName)
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath)
    console.log(`Renamed: ${oldName} → ${newName}`)
  } else {
    console.log(`File not found: ${oldName}`)
  }
})
```

Run: node scripts/rename-new-images.js

---

## TASK 2 — Update Image References

Update lib/images.ts with the new image paths:

Find these keys and update their values:

1. about_benidorm (or similar key used in About Benidorm section):
   OLD: '/images/benidorm.jpg'
   NEW: '/images/tallest-building.jpg'

2. la_cala_section (or similar key used in La Cala District section):
   OLD: '/images/benidorm-lacala-1.jpg'
   NEW: '/images/la-cala-drone.jpg'

3. spain_destination_card (or similar key for homepage Spain card):
   OLD: '/images/benidorm-poniente-1.jpg'
   NEW: '/images/benidorm-main.jpg'

Also search ALL .tsx and .ts files for any hardcoded
references to these old image paths and update them:

grep -r "benidorm\.jpg" --include="*.tsx" --include="*.ts" .
grep -r "benidorm-lacala-1" --include="*.tsx" --include="*.ts" .
grep -r "benidorm-poniente-1" --include="*.tsx" --include="*.ts" .

Replace every occurrence found.

---

## TASK 3 — Verify Images on Desktop and Mobile

For each replaced image make sure it looks correct
on both desktop and mobile.

### About Benidorm section (tallest-building.jpg):
Desktop:
- Image should fill its container fully
- object-fit: cover, object-position: center
- No stretching or distortion
- Correct aspect ratio maintained

Mobile (375px width):
- Image stacks above text on mobile
- Height: minimum 250px on mobile
- Full width: w-full
- Still uses object-fit: cover
- No horizontal overflow

Check the component and make sure:
```tsx
<Image
  src={BENIDORM_IMAGES.about_benidorm}
  alt="Benidorm tallest building, Costa Blanca Spain"
  fill
  className="object-cover object-center"
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  quality={85}
/>
```

### La Cala District section (la-cala-drone.jpg):
Desktop:
- Drone photo likely wider/landscape format
- Make sure it crops nicely from center
- object-position: center center

Mobile:
- Full width on mobile
- Height: 280px minimum on mobile
- object-fit: cover so it fills without distortion
- The drone aerial view should look impressive on mobile

Check and update component:
```tsx
<Image
  src={BENIDORM_IMAGES.la_cala_section}
  alt="La Cala district aerial drone view, Benidorm"
  fill
  className="object-cover object-center"
  sizes="(max-width: 768px) 100vw, 40vw"
  loading="lazy"
  quality={85}
/>
```

### Homepage Spain Destination Card (benidorm-main.jpg):
Desktop:
- Card image aspect ratio: 3/4 or 16/9
- Image fills card height
- Zoom effect on hover works correctly

Mobile:
- Card is full width on mobile
- Image scales correctly
- Text overlay still readable on mobile
- Gradient overlay strong enough on mobile
  (mobile screens are bright outdoors so darken more)

Check destination card component:
```tsx
<Image
  src={BENIDORM_IMAGES.cards.spain_destination}
  alt="Benidorm city, Costa Blanca, Spain"
  fill
  className="object-cover object-center 
    transition-transform duration-700 
    group-hover:scale-110"
  sizes="(max-width: 768px) 100vw, 
         (max-width: 1200px) 50vw, 33vw"
  priority={false}
  quality={80}
/>
```

---

## TASK 4 — Mobile Image Quality Check

For ALL three replaced images verify these mobile rules:

### Rule 1 — No overflow:
Image containers must have overflow: hidden
so images never exceed their boundaries on small screens.

### Rule 2 — Correct sizes prop:
The sizes prop must be set correctly for responsive loading.
Wrong sizes = browser downloads desktop image on mobile
(wastes bandwidth and slows mobile loading).

Correct pattern:
```tsx
sizes="(max-width: 640px) 100vw, 
       (max-width: 1024px) 50vw, 
       33vw"
```

### Rule 3 — Object position for portrait photos:
If tallest-building.jpg is a portrait/tall photo,
set object-position: center top or center center
so the most important part of the image shows.

### Rule 4 — Lazy loading:
All three images are below the fold.
Make sure loading="lazy" is set (not priority={true}).
This improves mobile page load speed.

### Rule 5 — Alt text:
Update alt text to describe the new images:
- tallest-building.jpg → "Benidorm iconic skyscrapers, Costa Blanca Spain"
- la-cala-drone.jpg → "La Cala district aerial view, Benidorm, Spain"
- benidorm-main.jpg → "Benidorm city panorama, Costa Blanca, Spain"

---

## TASK 5 — Update next.config.js if Needed

Make sure the images config allows local images.
Local /public/ images don't need domain config
but verify there are no issues:

Check next.config.js has correct image settings:
```javascript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // existing remote patterns
    ],
  },
}
```

Local images from /public/ folder work automatically
without any remotePatterns configuration.

---

## Final Step

After all tasks complete:
```bash
npm run build
git add .
git commit -m "3 images updated - tallest building, La Cala drone, Benidorm main"
git push
vercel --prod
```

After deploying check these URLs on mobile:
- https://casa-del-mar.vercel.app/en/benidorm
  → Scroll to About Benidorm section
  → Scroll to La Cala District section
- https://casa-del-mar.vercel.app/en
  → Check Spain destination card

---

## Checklist:
- [ ] La Cala Drone.jpg renamed to la-cala-drone.jpg
- [ ] Benidorm Main.jpeg renamed to benidorm-main.jpg
- [ ] lib/images.ts updated with new paths
- [ ] All hardcoded references updated
- [ ] About Benidorm uses tallest-building.jpg
- [ ] La Cala section uses la-cala-drone.jpg
- [ ] Spain destination card uses benidorm-main.jpg
- [ ] All images have object-fit: cover
- [ ] All images have correct sizes prop
- [ ] All images have loading="lazy"
- [ ] Alt text updated for all 3 images
- [ ] Images look good on 375px mobile width
- [ ] No image overflow on mobile
- [ ] Gradient overlays readable on mobile
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Verified on mobile browser after deploy
