# Claude Code Prompt — Fix Broken Property Photos

Copy and paste this into Claude Code from:
`C:\Users\Marat\casa-del-mar`

---

## PROMPT START

Property photos on casadelmar.am are not loading. I have NOT made any changes yet.
Photos are stored in Vercel Blob, with URLs saved in the Turso database.

Please diagnose and fix the issue. Do the following steps in order:

---

### Step 1 — Check environment variables

Look at `.env.local` and check if these variables exist and have values:
- `BLOB_READ_WRITE_TOKEN` (or similar Vercel Blob token)
- Any `TURSO_` variables for the database connection

Do NOT print the actual secret values — just tell me if they exist or are missing/empty.

---

### Step 2 — Check how photos are fetched and displayed

Find the code that:
1. Fetches property data from Turso (the database query)
2. Renders property photos — find every `<Image>` or `<img>` that displays a property photo
3. Check what URL format is being used for the `src` — is it a full Vercel Blob URL like `https://xxxx.blob.vercel-storage.com/...`?

---

### Step 3 — Check `next.config.js`

Look at the `images.domains` or `images.remotePatterns` section.
Vercel Blob URLs use the domain `*.blob.vercel-storage.com` or a custom subdomain.
If this domain is NOT listed in `next.config.js`, Next.js will block the images from loading.

Check if the Blob storage domain is missing or misconfigured.

---

### Step 4 — Check Vercel Blob token

Check if `BLOB_READ_WRITE_TOKEN` is present in `.env.local`.
If it is missing, the app cannot connect to Vercel Blob at all.

Also check: is there any code that tries to generate a signed/temporary URL for each photo?
If yes — check if that code is failing silently and returning null or undefined as the src.

---

### Step 5 — Fix the issue

Based on what you find, apply the correct fix:

**If `next.config.js` is missing the Blob domain:**
Add the correct `remotePatterns` entry:
```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '*.blob.vercel-storage.com',
    },
    // keep any other existing entries
  ],
}
```

**If `BLOB_READ_WRITE_TOKEN` is missing from `.env.local`:**
- Do NOT add the real token — just add a placeholder and tell me:
  "BLOB_READ_WRITE_TOKEN is missing from .env.local — please add it from your Vercel dashboard:
  vercel.com → your project → Storage → Blob → your store → .env.local tab → copy the token"

**If photo URLs in database are null/empty:**
- Show me a sample query result so I can see what the database is returning

**If there is another cause:**
- Explain what you found and fix it

---

### Step 6 — Verify

After applying the fix:
- Run `npm run build` to confirm no errors
- Tell me exactly what was wrong and what was fixed
- If the fix requires adding a real credential, tell me exactly where to get it and what to paste where

## PROMPT END
