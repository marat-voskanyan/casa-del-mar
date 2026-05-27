# AI Description Writer Setup

## Getting Your API Key
1. Go to https://console.anthropic.com/api-keys
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key

## Adding to Local Development
In `.env.local` add:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

## Adding to Vercel (Production)
1. Go to vercel.com → your project → **Settings → Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-your-key-here`
   - **Environments:** Production, Preview, Development
3. Click **Save**
4. Redeploy: `vercel --prod`

## Usage Limits
- Max **10 AI generations per hour** (in-memory rate limit)
- Each generation creates EN + RU + AM descriptions simultaneously
- Uses `claude-sonnet-4-20250514` model

## Cost
Very low — approximately **$0.01–0.02 per generation**
Monitor usage at: https://console.anthropic.com/usage

## How to Use
1. Open Admin → Add/Edit Property
2. Fill in: **Name, Location, Price, Bedrooms** (required)
3. Go to the **Description** tab
4. Click **✨ Generate with AI**
5. Wait ~5 seconds for descriptions to appear
6. Review and edit the generated text
7. Save the property

## Troubleshooting
- **"ANTHROPIC_API_KEY is not configured"** — Add the key to Vercel env vars and redeploy
- **"Rate limit reached"** — Wait 1 hour, or restart the server to reset the counter
- **"Fill in name, location, price and bedrooms first"** — The button is disabled until these fields have values
