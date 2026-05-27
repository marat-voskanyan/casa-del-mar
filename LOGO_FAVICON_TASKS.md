# Casa del Mar — Logo & Favicon Task

Read CLAUDE.md for full project context.
Complete this task automatically without asking questions.
Run `npm run build` only once at the very end.

---

## Files Available
The following files have been added to the public/ folder:
- `public/logo.png` — main company logo
- `public/favicon.png` — favicon for browser tab

---

## TASK 1 — Add Logo to Navbar

Find the Header/Navbar component and replace the 
text-based "Casa del Mar" branding with the actual logo image.

### Requirements:
- Use Next.js `<Image>` component from 'next/image'
- Source: `/logo.png`
- Height: 45px on desktop, 38px on mobile
- Width: auto (maintain aspect ratio)
- Alt text: "Casa del Mar International Real Estate"
- Wrap in a link that goes to the homepage
- Logo must be clickable on mobile too
- If the navbar has a dark background (navy #0D1F2D) 
  make sure the logo is visible — if it has a dark 
  background itself, add a small white padding or 
  use CSS filter: brightness(0) invert(1) only if needed
- Keep the "Casa del Mar" and "International Real Estate" 
  text as fallback if logo fails to load (use onError handler)
- Logo sits on the left side of the navbar

### Code example:
```tsx
import Image from 'next/image'

// In navbar component:
<Link href={`/${locale}`}>
  <Image
    src="/logo.png"
    alt="Casa del Mar International Real Estate"
    height={45}
    width={180}
    className="h-[45px] w-auto object-contain"
    priority={true}
  />
</Link>
```

---

## TASK 2 — Add Logo to Footer

Find the Footer component and add the logo above 
the "Casa del Mar" text or replacing it.

### Requirements:
- Use Next.js `<Image>` component
- Source: `/logo.png`
- Height: 40px
- Width: auto
- Alt text: "Casa del Mar"
- Logo sits above the copyright text
- If footer has dark background check logo visibility
- Keep existing footer links and content below the logo

---

## TASK 3 — Add Favicon

Set up the favicon so it appears in browser tabs,
bookmarks, and on iPhone/Android home screens.

### Step 1 — Copy favicon to app folder:
Copy `public/favicon.png` to `app/favicon.png`
Also copy to `app/icon.png`

### Step 2 — Update app/layout.tsx metadata:
Find the metadata export in app/layout.tsx and 
add/update the icons section:

```typescript
export const metadata: Metadata = {
  // ... existing metadata ...
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/favicon.png' },
    ],
    shortcut: '/favicon.png',
  },
}
```

### Step 3 — Add favicon link tags:
In the `<head>` section of layout.tsx or in metadata,
make sure these are included:
```html
<link rel="icon" type="image/png" href="/favicon.png" />
<link rel="apple-touch-icon" href="/favicon.png" />
<link rel="shortcut icon" href="/favicon.png" />
```

### Step 4 — Install sharp for image optimization:
```bash
npm install sharp
```
Sharp is required by Next.js for favicon optimization.

---

## TASK 4 — Open Graph & Social Sharing Image

Update the metadata in app/layout.tsx to use the logo
as the default social sharing image:

```typescript
export const metadata: Metadata = {
  // ... existing metadata ...
  openGraph: {
    title: 'Casa del Mar | International Real Estate',
    description: 'Premium properties in Spain and Cyprus. Based in Yerevan, Armenia.',
    url: 'https://casa-del-mar.vercel.app',
    siteName: 'Casa del Mar',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Casa del Mar International Real Estate',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Casa del Mar | International Real Estate',
    description: 'Premium properties in Spain and Cyprus.',
    images: ['/logo.png'],
  },
}
```

---

## TASK 5 — Admin Panel Logo

Add the logo to the admin panel as well:
- Admin login page: show logo above the login form
  Height: 60px, centered
- Admin dashboard sidebar: show logo at top of sidebar
  Height: 40px

---

## TASK 6 — Verify Everything Works

Check the following after making changes:
- [ ] Logo shows in navbar on desktop
- [ ] Logo shows in navbar on mobile
- [ ] Logo shows in footer
- [ ] Logo shows on admin login page
- [ ] Favicon shows in browser tab
- [ ] No broken image errors in console
- [ ] Logo is visible on dark navbar background
- [ ] Logo does not look stretched or distorted

---

## Final Step

After all tasks are complete:
```bash
npm install sharp
npm run build
git add .
git commit -m "Logo and favicon added to website and admin"
git push
vercel --prod
```

---

## Checklist:
- [ ] Logo added to navbar
- [ ] Logo added to footer  
- [ ] Logo added to admin login page
- [ ] Logo added to admin sidebar
- [ ] Favicon set in app/layout.tsx
- [ ] Apple touch icon set
- [ ] Open Graph image set
- [ ] sharp package installed
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
- [ ] Logo visible on live site
- [ ] Favicon visible in browser tab
