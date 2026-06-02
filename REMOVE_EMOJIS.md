# Casa del Mar — Remove Emojis, Replace with Luxury Icons

Read PROJECT_SUMMARY.md first for project context.
Then read ONLY the files you need to edit.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## The Problem
The website uses colorful emojis (📍🕐🏖️✈️🌞🏊🎾📞💰👤🔑📋⚠️)
which look cheap and unprofessional on a luxury website.

## The Solution
Replace ALL emojis with clean SVG icons or elegant
typographic symbols. Reference: luxinmo.com/contact
uses zero emojis — just clean text and minimal icons.

---

## TASK 1 — Find All Emojis in the Codebase

Search every file for emoji characters:
grep -r "📍\|🕐\|🏖️\|✈️\|🌞\|🏊\|🎾\|🚗\|🏗️\|🛒\|📈\|🌍\|📋\|🏥\|📞\|💰\|👤\|🔑\|🔒\|⚠️\|🌡️\|🏙️\|🏠\|🏔️\|🏛️\|⛶\|✓\|★\|🌐\|✨\|⟳" --include="*.tsx" --include="*.ts" -l

List every file that contains emojis.
Then fix each one.

---

## TASK 2 — SVG Icon Library

Create file: components/icons/LuxuryIcons.tsx

This file contains clean SVG icons to replace emojis.
All icons use currentColor so they inherit gold/white/navy.

```tsx
// components/icons/LuxuryIcons.tsx

interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

// Location pin — replaces 📍
export function LocationIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  )
}

// Clock — replaces 🕐
export function ClockIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

// Phone — replaces 📞
export function PhoneIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
    </svg>
  )
}

// Email — replaces @
export function EmailIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

// Building/Office — replaces 🏢
export function BuildingIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="2" width="16" height="20" rx="1"/>
      <line x1="9" y1="22" x2="9" y2="2"/>
      <line x1="15" y1="22" x2="15" y2="2"/>
      <line x1="4" y1="7" x2="8" y2="7"/>
      <line x1="4" y1="12" x2="8" y2="12"/>
      <line x1="4" y1="17" x2="8" y2="17"/>
      <line x1="16" y1="7" x2="20" y2="7"/>
      <line x1="16" y1="12" x2="20" y2="12"/>
      <line x1="16" y1="17" x2="20" y2="17"/>
    </svg>
  )
}

// Bed — replaces 🛏️
export function BedIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4v16M2 8h20v12M2 8c0-2.2 1.8-4 4-4h12a4 4 0 014 4"/>
      <path d="M6 8v4M10 8v4"/>
    </svg>
  )
}

// Bath — replaces 🚿
export function BathIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 12h16a1 1 0 011 1v3a4 4 0 01-4 4H7a4 4 0 01-4-4v-3a1 1 0 011-1z"/>
      <path d="M6 12V5a2 2 0 012-2h3v2.25"/>
    </svg>
  )
}

// Maximize/Fullscreen — replaces ⛶
export function MaximizeIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="15 3 21 3 21 9"/>
      <polyline points="9 21 3 21 3 15"/>
      <line x1="21" y1="3" x2="14" y2="10"/>
      <line x1="3" y1="21" x2="10" y2="14"/>
    </svg>
  )
}

// Car/Parking — replaces 🚗
export function ParkingIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  )
}

// Floor/Stairs — replaces floor number
export function FloorIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="4 20 4 14 10 14 10 8 16 8 16 2 20 2"/>
      <line x1="4" y1="20" x2="20" y2="20"/>
    </svg>
  )
}

// Size/Area — replaces m²
export function AreaIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <path d="M9 3v18M3 9h18"/>
    </svg>
  )
}

// Check/Tick — replaces ✓
export function CheckIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// Globe/Language — replaces 🌐
export function GlobeIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
    </svg>
  )
}

// Lock — replaces 🔒
export function LockIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  )
}

// Warning — replaces ⚠️
export function WarningIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  )
}

// Sun — replaces 🌞
export function SunIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  )
}

// Plane — replaces ✈️
export function PlaneIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2A1 1 0 001 7.3l.8 2.6 6.3-2.2 3.4 3.4-2.2 6.3 2.6.8a1 1 0 001.1-.8z"/>
    </svg>
  )
}

// Beach/Waves — replaces 🏖️
export function WavesIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
      <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
    </svg>
  )
}

// Thermometer — replaces 🌡️
export function ThermometerIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z"/>
    </svg>
  )
}

// City/Building2 — replaces 🏙️
export function CityIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="8" height="15"/>
      <rect x="14" y="2" width="8" height="20"/>
      <line x1="10" y1="22" x2="10" y2="12"/>
      <line x1="14" y1="7" x2="10" y2="7"/>
    </svg>
  )
}

// Pool/Swimming — replaces 🏊
export function PoolIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
      <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2"/>
      <circle cx="12" cy="5" r="2"/>
      <path d="M12 7v4"/>
    </svg>
  )
}

// Star/Rating
export function StarIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

// Arrow right — for lists
export function ArrowRightIcon({ size = 16, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}

// Notes/Clipboard — replaces 📋
export function ClipboardIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    </svg>
  )
}

// Money/Investment — replaces 💰
export function TrendIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  )
}

// Person/Client — replaces 👤
export function PersonIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

// Key — replaces 🔑
export function KeyIcon({ size = 18, className = '', strokeWidth = 1.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
    </svg>
  )
}
```

---

## TASK 3 — Replace Emojis in Every File

Go through each file that contains emojis and replace
them with the SVG icons from LuxuryIcons.tsx.

### components/contact/OfficeSection.tsx:
Replace 📍 with <LocationIcon className="text-[#C9A84C]" size={16} />
Replace 🕐 with <ClockIcon className="text-[#C9A84C]" size={16} />

### components/contact/ContactForm.tsx:
Remove any emojis, replace with clean text or SVG icons.

### components/admin/PropertyForm.tsx:
Replace 📞 with <PhoneIcon size={14} />
Replace 💰 with <TrendIcon size={14} />
Replace 👤 with <PersonIcon size={14} />
Replace 🔑 with <KeyIcon size={14} />
Replace 📋 with <ClipboardIcon size={14} />
Replace 🔒 with <LockIcon size={16} />
Replace ⚠️ with <WarningIcon size={16} />
Keep the warning banner text but use SVG icon

### components/properties/PropertyCard.tsx:
Replace bed/bath/size/floor emojis if any with SVG icons
or clean text labels.

### components/properties/PropertyGallery.tsx:
Replace ⛶ fullscreen icon with <MaximizeIcon />

### app/[locale]/benidorm/page.tsx:
Replace all emojis in facts strip, why invest, 
districts, getting there sections:
🌞 → <SunIcon />
🏖️ → <WavesIcon />
✈️ → <PlaneIcon />
🌡️ → <ThermometerIcon />
🏙️ → <CityIcon />
🏊 → <PoolIcon />
🎾 → plain text "Tennis" or tennis SVG
📈 → <TrendIcon />
🌍 → <GlobeIcon />
🏥 → plain text or medical cross SVG
🚗 → <ParkingIcon />

### components/home/AboutServices.tsx:
Replace any service emojis with SVG icons
or gold number indicators (01, 02, 03...)

### components/layout/Footer.tsx:
Remove any emojis from footer.

### Any other files:
Search and replace all remaining emojis.

---

## TASK 4 — Styling for SVG Icons

All SVG icons in public-facing sections should use:
- Color: #C9A84C (gold) for info/contact icons
- Color: currentColor for icons inside colored containers
- Size: 16-18px for inline icons
- Size: 22-24px for feature/service icons
- Stroke width: 1.5 (thin, elegant — not bold)

Wrap icons with a small container where needed:
```tsx
<span className="inline-flex items-center justify-center
  w-8 h-8 border border-[#C9A84C]/40 text-[#C9A84C]
  flex-shrink-0">
  <LocationIcon size={14} />
</span>
```

---

## TASK 5 — Admin Panel Icons

In the admin panel (internal use) the icons can be
slightly different — use the same SVG components but
with different colors matching the admin theme.

The 🔒 and ⚠️ in the internal notes tab:
- Keep the warning banner but use SVG icons
- LockIcon for the tab label
- WarningIcon for the red banner

---

## Final Step

After replacing all emojis:
```bash
npm run build
git add .
git commit -m "Emojis replaced with luxury SVG icons throughout"
git push
vercel --prod
```

---

## Checklist:
- [ ] components/icons/LuxuryIcons.tsx created
- [ ] All location pin emojis replaced (📍→LocationIcon)
- [ ] All clock emojis replaced (🕐→ClockIcon)
- [ ] All phone emojis replaced (📞→PhoneIcon)
- [ ] All beach/wave emojis replaced
- [ ] All sun emojis replaced
- [ ] All plane emojis replaced
- [ ] All thermometer emojis replaced
- [ ] All city emojis replaced
- [ ] All pool emojis replaced
- [ ] All car emojis replaced
- [ ] All lock/warning emojis in admin replaced
- [ ] All clipboard/notes emojis replaced
- [ ] Fullscreen icon replaced in gallery
- [ ] Service section emojis replaced
- [ ] Icons styled with gold color #C9A84C
- [ ] Stroke width 1.5 (thin, elegant)
- [ ] No emojis remain on public website
- [ ] Admin panel icons updated
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
