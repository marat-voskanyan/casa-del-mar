# AI Description Writer Setup

## How It Works — 3-Step Flow

| Step | Tool | Language | Quality |
|------|------|----------|---------|
| Step 1 | **Groq Llama** | English | Native AI writing |
| Step 2 | **DeepL** | Russian | World's best translator |
| Step 3 | **Groq Llama** | Armenian | Focused Unicode translation |

DeepL does NOT support Armenian, so Groq handles that step directly.

---

## Getting Your API Keys

### Groq API Key (for English + Armenian)
1. Go to https://console.groq.com
2. Sign in or create a free account (no credit card needed)
3. Click **API Keys** → **Create API Key**
4. Copy the key (starts with `gsk_`)
- **Free tier:** 14,400 requests/day — effectively unlimited

### DeepL API Key (for Russian translation)
1. Go to https://www.deepl.com/pro-api
2. Sign up for the **DeepL API Free** plan (no credit card needed)
3. Go to **Account** → **Authentication Key**
4. Copy the key (ends with `:fx` for free tier)
- **Free tier:** 500,000 characters/month — generous limit

---

## Adding Keys to Local Development
In `.env.local`:
```
GROQ_API_KEY=gsk_your-groq-key-here
DEEPL_API_KEY=your-deepl-key-here:fx
```

## Adding Keys to Vercel (Production)
1. Go to **vercel.com** → your project → **Settings → Environment Variables**
2. Add both keys:
   - **Name:** `GROQ_API_KEY` · **Value:** `gsk_your-key`
   - **Name:** `DEEPL_API_KEY` · **Value:** `your-key:fx`
   - **Environments:** Production, Preview, Development
3. Click **Save** for each
4. Redeploy: `vercel --prod`

---

## Usage Limits & Cost

| Service | Free Limit | Cost After |
|---------|-----------|------------|
| Groq | 14,400 req/day | Paid plans available |
| DeepL | 500,000 chars/month | €5.99/month for Pro |

Both are **effectively free** for admin use (generating ~5-20 descriptions/day).

---

## How to Use
1. Open Admin → Add/Edit Property
2. Fill in: **Name, Location** (required)
3. Go to the **Description** tab
4. Select feature pills (view, distance to sea, facilities, etc.)
5. Choose a writing style (Casa del Mar · Luxury · Investment · etc.)
6. Click **✨ Generate — [Style] Style**
7. Watch the 3 steps complete:
   - *Step 1/3: Writing English description…*
   - *Step 2/3: Translating to Russian with DeepL…*
   - *Step 3/3: Translating to Armenian…*
8. Review and edit all three descriptions
9. Save the property

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `GROQ_API_KEY not configured` | Add `GROQ_API_KEY` to Vercel env vars and redeploy |
| `DEEPL_API_KEY not configured` | Add `DEEPL_API_KEY` to Vercel env vars and redeploy |
| `Session expired` | Log out and back in to admin panel |
| `Rate limit reached` | Wait 1 hour (app-level 20/hour limit) |
| Armenian has Latin letters | Groq translation step — try generating again |
