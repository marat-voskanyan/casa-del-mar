# Casa del Mar — International Real Estate

Luxury coastal real estate website for Casa del Mar agency.  
**Site ID:** `69021918-94ab-48db-9e03-ca90f1a79617`

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS (navy/sand/gold palette, Cormorant Garamond + Jost) |
| Database | SQLite via `better-sqlite3` |
| Auth | bcryptjs (passwords) + jose JWT (sessions, httpOnly cookie) |
| i18n | URL-based (`/en`, `/ru`, `/hy`) with inline translations |
| Deployment | Vercel-compatible (see notes) |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env.local
# Edit .env.local — at minimum set a strong JWT_SECRET
```

### 3. Run development server
```bash
npm run dev
```

### 4. Create admin account (first run)
Open [http://localhost:3000/admin](http://localhost:3000/admin) — you will be redirected to the **Setup** page automatically. Enter your desired username and password (min 8 chars). This step only runs once.

After setup, log in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

---

## Admin Panel

| URL | Purpose |
|-----|---------|
| `/admin` | Property dashboard (list, delete) |
| `/admin/properties/new` | Add a property |
| `/admin/properties/[id]/edit` | Edit a property |
| `/admin/login` | Login page |
| `/admin/setup` | First-run setup (auto-redirects after setup) |

### Property fields
Name · Location · Price (€) · Country (Spain / Cyprus) · Status (Available / Reserved / Sold)  
Bedrooms · Bathrooms · Floor · Size m² · Parking  
Description in EN / RU / HY  
Up to 3 images (JPEG, PNG, WebP — 5 MB each)

---

## Public Pages

| URL | Content |
|-----|---------|
| `/en` `/ru` `/hy` | Home page with featured properties |
| `/{locale}/spain` | All Spain listings |
| `/{locale}/cyprus` | All Cyprus listings |
| `/{locale}/properties/[id]` | Property detail |
| `/{locale}/contact` | Contact form |

---

## Deployment

### Option A — VPS / Railway / Render (recommended with SQLite)
SQLite persists on servers with a persistent filesystem. Set `DATABASE_PATH` in your environment to an absolute path outside the project (e.g. `/data/casa.db`).

### Option B — Vercel
Vercel's filesystem is **ephemeral** — data is lost on cold starts.  
For Vercel, replace `better-sqlite3` with **[Turso](https://turso.tech)** (remote SQLite, same API):
1. `npm install @libsql/client`
2. Replace `lib/db.ts` with a Turso client (compatible SQL syntax)
3. Set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` env vars

### Image uploads
Uploaded images are stored in `/public/uploads/`. On Vercel these are ephemeral.  
For production, swap the upload route to use **Vercel Blob** (`@vercel/blob`) or **Cloudinary**.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `casa-del-mar-secret-2024-change-me` | **Change this!** Long random string |
| `DATABASE_PATH` | `./data/casa.db` | Path to SQLite file |
| `NEXT_PUBLIC_SITE_ID` | `69021918-…` | Site identifier |
| `NEXT_PUBLIC_SITE_URL` | `https://casadelmar.eu` | Canonical URL |

---

## Project Structure

```
app/
  [locale]/           # Public pages (en, ru, hy)
    page.tsx          # Home
    spain/            # Spain listings
    cyprus/           # Cyprus listings
    contact/          # Contact
    properties/[id]/  # Property detail
  admin/              # Password-protected admin panel
    login/
    setup/            # First-run setup
    properties/new/
    properties/[id]/edit/
  api/
    auth/login|logout
    setup/
    properties/
    upload/
    contact/
components/
  layout/   Header · Footer
  home/     Hero · FeaturedProperties · WhyUs
  properties/ PropertyCard
  contact/  ContactForm
  admin/    AdminNav · PropertyForm
lib/
  db.ts     SQLite queries
  auth.ts   bcrypt + JWT helpers
  i18n.ts   Translations (EN/RU/HY)
types/
  index.ts
```
