# Casa del Mar — Fixes & New Features

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — Fix Emojis Not Showing on Desktop

Emojis are visible on mobile but not on desktop.
This is usually caused by missing emoji font fallback.

### Fix:
Add emoji font support to globals.css and tailwind config.

In globals.css add to the body or root font-family:
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 
  'Segoe UI', 'Segoe UI Emoji', 'Segoe UI Symbol',
  'Apple Color Emoji', 'Noto Color Emoji', 
  'Android Emoji', sans-serif;
```

For specific emoji elements add a utility class:
```css
.emoji {
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji', sans-serif;
  font-style: normal;
}
```

Also check:
- Any element using emoji that has font-family overridden
- Any SVG or icon font that might be replacing emoji characters
- Make sure emoji characters are not inside a font that 
  does not support them

Find every place in the codebase that uses emojis:
🌞 🏖️ ✈️ 🌡️ 🏙️ 🏊 🎾 🚗 🏗️ 🛒 📈 🌍 📋 🏥 📞 💰 👤 🔑 🔒 ⚠️
and wrap them in a span with the emoji class:
```tsx
<span className="emoji">🏊</span>
```

Or apply the emoji font-family directly to the 
containing element so emojis render on all platforms
including Windows Chrome, Firefox, and Edge.

---

## TASK 2 — WhatsApp Floating Button on Property Pages

Add a luxury animated WhatsApp shortcut button that 
appears when a user is viewing a property detail page.

### WhatsApp number: +374 44 20 30 08
### WhatsApp link: https://wa.me/37444203008

### Where to show it:
- Property detail pages only (/property/[id])
- Also show on Spain, Cyprus listing pages
- Do NOT show on homepage, contact page, admin panel

### Button design (luxury floating button):
```tsx
// Position: fixed, bottom right corner
// Bottom: 24px from bottom
// Right: 24px from right
// z-index: 50

// Button shape: circle, 60px x 60px
// Background: #25D366 (WhatsApp green)
// Icon: WhatsApp SVG logo in white
// Box shadow: 0 4px 20px rgba(37, 211, 102, 0.4)
```

### Luxury entrance animation:
- Button slides in from the right when page loads
- Delay: 1.5 seconds after page load
- Animation: slide in from right + fade in
```css
@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

### Pulse animation (draws attention):
After the button appears, add a continuous subtle pulse:
```css
@keyframes whatsappPulse {
  0% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
  50% { box-shadow: 0 4px 35px rgba(37, 211, 102, 0.7), 
                    0 0 0 8px rgba(37, 211, 102, 0.1); }
  100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
}
```

### Hover effect:
- Scale up slightly: transform: scale(1.1)
- Shadow intensifies
- Smooth transition: 0.3s ease

### Tooltip:
When hovering the button show a tooltip to the left:
- Text: "Chat on WhatsApp" (EN) / "Написать в WhatsApp" (RU) / "WhatsApp-ով գրել" (AM)
- Background: #25D366
- White text, small font
- Rounded pill shape
- Slides in from right when button is hovered
- Arrow pointing right toward the button

### Pre-filled message:
When button is clicked, open WhatsApp with a pre-filled message:
```
EN: "Hello! I'm interested in this property. Can you provide more information?"
RU: "Здравствуйте! Меня интересует этот объект. Можете рассказать подробнее?"
AM: "Բарев! Ես հeтaqrqrvум еm аys guуtkоv: Кarелi е aveliн manal?"
```

Use the current locale to choose the right message.
Encode the message in the WhatsApp URL:
```
https://wa.me/37444203008?text=Hello%21%20I%27m%20interested...
```

### WhatsApp SVG icon:
```tsx
<svg viewBox="0 0 24 24" fill="white" width="28" height="28">
  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
</svg>
```

### Component file:
Create a new component: `components/WhatsAppButton.tsx`
Import and use it in:
- `app/[locale]/spain/page.tsx`
- `app/[locale]/cyprus/page.tsx`  
- `app/[locale]/property/[id]/page.tsx`

---

## TASK 3 — Update Working Hours

Change the working hours displayed on the website.

### Old hours: Mon–Sat: 9:00 – 19:00 (or whatever is current)
### New hours: Mon–Sat: 11:00 – 18:00

Find and update working hours in ALL these places:
1. Footer component
2. Contact page
3. Any other place working hours appear
4. i18n translation files — update in all 3 languages:
   - EN: "Mon–Sat: 11:00 – 18:00"
   - RU: "Пн–Сб: 11:00 – 18:00"
   - AM: "Երկ–Շբթ: 11:00 – 18:00"

Search the entire codebase for "9:00" or "19:00" or 
"working hours" or "hours" and update all instances.

---

## TASK 4 — Add Instagram Link

Add Instagram social media link throughout the website.

### Instagram handle: 
Search casadelmar.am website or use: @casadelmar.am
### Instagram URL: https://www.instagram.com/casadelmar.am/

If the above URL is not correct, use:
https://www.instagram.com/casadelmar.am

### Add Instagram link to these places:

1. **Footer** — Add Instagram icon next to Facebook and WhatsApp
   Use a proper Instagram SVG icon:
   ```tsx
   <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
     <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
   </svg>
   ```

2. **Contact page** — Add Instagram to the social links section

3. **Mobile menu** — Add Instagram to social links at bottom of menu

4. **Update CLAUDE.md** — Add Instagram URL to business info

### Social links order everywhere:
Facebook → Instagram → WhatsApp

### Style the Instagram icon:
- Same size and style as existing Facebook and WhatsApp icons
- Hover color: Instagram gradient or just gold #C9A84C
- Opens in new tab: target="_blank" rel="noopener noreferrer"

---

## Final Step

After all 4 tasks are complete:
```bash
npm run build
git add .
git commit -m "Emoji fix, WhatsApp button, hours updated, Instagram added"
git push
vercel --prod
```

---

## Checklist:
- [ ] Emojis visible on desktop (Windows Chrome, Firefox, Edge)
- [ ] WhatsApp floating button on property and listing pages
- [ ] WhatsApp button has luxury slide-in animation
- [ ] WhatsApp button has pulse animation
- [ ] WhatsApp tooltip on hover
- [ ] Pre-filled WhatsApp message in correct language
- [ ] Working hours changed to 11:00 - 18:00 everywhere
- [ ] Working hours updated in all 3 languages
- [ ] Instagram link added to footer
- [ ] Instagram link added to contact page
- [ ] Instagram link added to mobile menu
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
