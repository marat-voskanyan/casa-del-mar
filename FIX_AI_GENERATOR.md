# Casa del Mar — Fix AI Description Generator

Read CLAUDE.md for full project context.
Complete this task automatically without asking questions.
Run `npm run build` only once at the very end.

---

## The Problem
The AI description generator button shows:
"❌ Failed to generate description. Please try again."

The ANTHROPIC_API_KEY is set in Vercel environment variables
but the generator is still failing.

---

## TASK — Debug and Fix the AI Generator

### Step 1 — Check Vercel logs for the real error
```bash
vercel logs --follow
```
Trigger the generate button while watching logs.
Find the exact error message and fix it.

---

### Step 2 — Check the API route file
Open `app/api/admin/generate-description/route.ts`

Add detailed logging at every step:
```typescript
export async function POST(request: NextRequest) {
  console.log('=== AI Generate Description called ===')
  
  // Log all cookies to find the correct token name
  const allCookies = request.cookies.getAll()
  console.log('Cookies received:', allCookies.map(c => c.name))
  
  // Check API key exists
  console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY)
  console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length || 0)
  
  // Log request body
  const body = await request.json()
  console.log('Request body:', JSON.stringify(body, null, 2))
  
  // ... rest of the function
}
```

---

### Step 3 — Fix JWT authentication check

The cookie name might be different from what the route expects.
Check the admin login route to find the exact cookie name used.

Look in these files for the cookie name:
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `middleware.ts`

Find the line that sets the cookie, for example:
```typescript
response.cookies.set('admin_token', token, { ... })
// or
response.cookies.set('token', token, { ... })
// or  
response.cookies.set('session', token, { ... })
```

Then use that EXACT same cookie name in the generate route:
```typescript
// Use whatever name the login route uses
const token = request.cookies.get('admin_token')?.value
// NOT hardcoded — match the actual cookie name
```

---

### Step 4 — Fix Anthropic SDK import and usage

Make sure the SDK is imported and used correctly:

```typescript
import Anthropic from '@anthropic-ai/sdk'

// Initialize client correctly
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

// Call with correct model and syntax
const message = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: prompt,
    }
  ],
})

// Extract text correctly
const responseText = message.content
  .filter(block => block.type === 'text')
  .map(block => block.type === 'text' ? block.text : '')
  .join('')
```

---

### Step 5 — Fix JSON parsing

The response might have extra text around the JSON.
Make it more robust:
```typescript
// Try multiple JSON extraction methods
let descriptions
try {
  // Method 1: direct parse
  descriptions = JSON.parse(responseText)
} catch {
  try {
    // Method 2: extract JSON from markdown code block
    const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      descriptions = JSON.parse(jsonMatch[1].trim())
    } else {
      // Method 3: find first { to last }
      const start = responseText.indexOf('{')
      const end = responseText.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        descriptions = JSON.parse(responseText.slice(start, end + 1))
      }
    }
  } catch (parseError) {
    console.error('JSON parse error:', parseError)
    console.error('Raw response:', responseText)
    throw new Error('Failed to parse AI response as JSON')
  }
}
```

---

### Step 6 — Make auth check optional for testing

Temporarily make the auth check non-blocking to test
if the issue is auth or the API call itself:

```typescript
// Check auth but don't block if missing (for debugging)
const token = request.cookies.get('admin_token')?.value || 
              request.cookies.get('token')?.value ||
              request.cookies.get('session')?.value

if (!token) {
  console.log('WARNING: No auth token found in request')
  // For now log warning but continue to test API
  // TODO: Re-enable strict auth after confirming API works
}
```

After confirming API works, restore strict auth.

---

### Step 7 — Add better error messages to frontend

Update the error handling in the frontend component
to show more specific error messages:

```typescript
const handleGenerateDescriptions = async () => {
  // ...
  try {
    const response = await fetch('/api/admin/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ... }),
    })

    const data = await response.json()
    
    if (response.status === 401) {
      throw new Error('Session expired. Please log out and log in again.')
    }
    if (response.status === 429) {
      throw new Error('Rate limit reached. Try again in an hour.')
    }
    if (response.status === 400) {
      throw new Error(data.error || 'Please fill in all required fields.')
    }
    if (!response.ok) {
      throw new Error(data.error || `Server error: ${response.status}`)
    }
    // ...
  } catch (error) {
    console.error('Generate error:', error)
    setGenerateError(error instanceof Error ? error.message : 'Unknown error')
  }
}
```

---

### Step 8 — Verify SDK is installed

Check package.json has @anthropic-ai/sdk:
```bash
cat package.json | grep anthropic
```

If not installed:
```bash
npm install @anthropic-ai/sdk
```

---

### Step 9 — Test locally first

Before deploying, test locally:
```bash
npm run dev
```

Open http://localhost:3000/admin
Try the generate button locally
Check the terminal for console.log output
Fix any errors that appear

---

### Step 10 — Full rewrite if needed

If the existing route has too many issues, 
rewrite it completely from scratch:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    // 1. Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured. Add ANTHROPIC_API_KEY to environment variables.' },
        { status: 500 }
      )
    }

    // 2. Parse request
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status } = body

    // 3. Validate required fields
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Property name and location are required.' },
        { status: 400 }
      )
    }

    // 4. Call Anthropic API
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const prompt = `You are a luxury real estate copywriter for Casa del Mar, 
a premium real estate agency in Yerevan, Armenia selling properties in Spain and Cyprus.

Property:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price || 0).toLocaleString()}
- Bedrooms: ${bedrooms || 'N/A'}
- Bathrooms: ${bathrooms || 'N/A'}
- Floor: ${floor || 'N/A'}
- Size: ${size ? size + 'm²' : 'N/A'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}

Write three property descriptions (60-80 words each):
1. English: Professional luxury tone, mention location benefits and investment potential
2. Russian: Natural Russian, luxury tone, mention beach access and rental potential  
3. Armenian: Proper Armenian Unicode only (NO Latin letters), professional tone

Return ONLY this JSON with no other text:
{"en":"...","ru":"...","hy":"..."}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    // 5. Extract and parse response
    const rawText = message.content
      .filter(b => b.type === 'text')
      .map(b => b.type === 'text' ? b.text : '')
      .join('')

    // Try to extract JSON
    const jsonStart = rawText.indexOf('{')
    const jsonEnd = rawText.lastIndexOf('}')
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No JSON found in AI response')
    }

    const jsonStr = rawText.slice(jsonStart, jsonEnd + 1)
    const descriptions = JSON.parse(jsonStr)

    if (!descriptions.en || !descriptions.ru || !descriptions.hy) {
      throw new Error('AI response missing required language fields')
    }

    return NextResponse.json({ success: true, descriptions })

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('AI generation failed:', message)
    return NextResponse.json(
      { error: `Generation failed: ${message}` },
      { status: 500 }
    )
  }
}
```

---

## Final Step

After fixing:
```bash
npm run dev
```
Test locally first. If it works locally:
```bash
npm run build
git add .
git commit -m "Fixed AI description generator"
git push
vercel --prod
```

---

## Checklist:
- [ ] Found exact error in Vercel logs
- [ ] Cookie name matches between login and generate route
- [ ] Anthropic SDK installed in package.json
- [ ] API key check added with clear error message
- [ ] JSON parsing is robust with fallbacks
- [ ] Better error messages shown to admin
- [ ] Tested locally and works
- [ ] npm run build passes
- [ ] Deployed to Vercel
- [ ] Generate button works on live site
