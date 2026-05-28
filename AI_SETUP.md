# AI Description Writer Setup

## Getting Your Free API Key
1. Go to https://console.groq.com
2. Sign in or create a free account (no credit card needed)
3. Click "API Keys" → "Create API Key"
4. Copy the key

## Adding to Local Development
In `.env.local` add:
```
GROQ_API_KEY=gsk_your-key-here
```

## Adding to Vercel (Production)
1. Go to vercel.com → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `GROQ_API_KEY`
   - **Value:** `gsk_your-key-here`
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. Redeploy: `vercel --prod`

## Model & Limits
- **Model:** `llama-3.3-70b-versatile` (Meta's Llama 3.3 70B)
- **Free tier:** 14,400 requests per day — effectively unlimited for admin use
- **No credit card needed**
- Monitor usage at: https://console.groq.com/usage

## How to Use
1. Open Admin → Add/Edit Property
2. Fill in: **Name, Location** (required; price/bedrooms improve quality)
3. Go to the **Description** tab
4. Click **✨ Generate with AI**
5. Wait ~3 seconds for descriptions to appear
6. Review and edit the generated text
7. Save the property

## Troubleshooting
- **"GROQ_API_KEY is not configured"** — Add the key to Vercel env vars and redeploy
- **"Rate limit reached"** — Wait 1 hour (app-level limit), or restart server to reset
- **"Session expired"** — Log out and log back in to the admin panel
- **"Generation failed"** — Check Vercel function logs for details
