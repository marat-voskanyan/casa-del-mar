# Casa del Mar — AI Description Writer & AVIF Support

Read CLAUDE.md for full project context.
Complete ALL tasks automatically without asking questions.
Run `npm run build` only once at the very end.

---

## TASK 1 — AVIF File Format Support

Add AVIF image format support to the admin panel 
image upload system.

### 1.1 — Update file input in admin form:
Find the image upload component in the admin property form
and update the file input accept attribute:
```html
accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
```

### 1.2 — Update server-side validation:
Find the upload API route (app/api/admin/upload/route.ts 
or similar) and add AVIF to accepted MIME types:
```typescript
const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif',  // ADD THIS
]

const ACCEPTED_EXTENSIONS = [
  '.jpg', '.jpeg', '.png', '.webp', '.avif'  // ADD .avif
]
```

### 1.3 — Update Next.js config:
In next.config.js make sure AVIF is supported:
```javascript
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // ... existing config
  }
}
```

### 1.4 — Update error messages in all 3 languages:
Find any file type validation error messages and update:
```
EN: "Accepted formats: JPG, PNG, WebP, AVIF. Max size: 10MB"
RU: "Допустимые форматы: JPG, PNG, WebP, AVIF. Макс. размер: 10МБ"
AM: "Ընդունելի ձևաչափեր: JPG, PNG, WebP, AVIF: Առավ. չափ: 10ՄԲ"
```

### 1.5 — Update the upload slots UI hint text:
In the images tab of the admin form update the 
helper text below the upload grid:
```
EN: "Upload up to 20 photos. Supported: JPG, PNG, WebP, AVIF. Max 10MB each."
RU: "Загрузите до 20 фото. Форматы: JPG, PNG, WebP, AVIF. Макс. 10МБ каждое."
AM: "Բեռնեք մինչև 20 նկար: Ձևաչափեր: JPG, PNG, WebP, AVIF: Մaks. 10ՄԲ:"
```

---

## TASK 2 — AI Description Writer

Add an AI-powered description generator to the 
admin property form using the Anthropic Claude API.

### 2.1 — Install dependencies:
```bash
npm install @anthropic-ai/sdk
```

### 2.2 — Environment variables:
Add to .env.local:
```
ANTHROPIC_API_KEY=your_key_here
```

Add a comment in .env.local explaining where to get it:
```
# Get your API key from: https://console.anthropic.com/api-keys
```

Also add to .env.example so it is documented.

### 2.3 — Create the API route:
Create file: `app/api/admin/generate-description/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Rate limiting - simple in-memory store
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per hour
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms

export async function POST(request: NextRequest) {
  // Verify admin JWT cookie
  const token = request.cookies.get('admin_token')?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate limiting
  const now = Date.now()
  const rateData = rateLimitMap.get('admin') || { count: 0, resetTime: now + RATE_WINDOW }
  if (now > rateData.resetTime) {
    rateData.count = 0
    rateData.resetTime = now + RATE_WINDOW
  }
  if (rateData.count >= RATE_LIMIT) {
    return NextResponse.json(
      { error: 'Rate limit reached. Try again in an hour.' },
      { status: 429 }
    )
  }
  rateData.count++
  rateLimitMap.set('admin', rateData)

  try {
    const body = await request.json()
    const { name, location, price, bedrooms, bathrooms, floor, size, parking, status, features } = body

    // Validate required fields
    if (!name || !location || !price || !bedrooms) {
      return NextResponse.json(
        { error: 'Please fill in name, location, price and bedrooms first.' },
        { status: 400 }
      )
    }

    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })

    const prompt = `You are a luxury real estate copywriter for Casa del Mar, a premium international real estate agency based in Yerevan, Armenia. Write compelling property descriptions for Spanish and Cypriot properties targeting Armenian and Russian-speaking buyers.

Property details:
- Name: ${name}
- Location: ${location}
- Price: €${Number(price).toLocaleString()}
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms || 'not specified'}
- Floor: ${floor ? `Floor ${floor}` : 'not specified'}
- Size: ${size ? `${size}m²` : 'not specified'}
- Parking: ${parking ? 'Yes' : 'No'}
- Status: ${status || 'available'}
- Special features: ${features ? features.join(', ') : 'none listed'}

Write THREE property descriptions:

1. ENGLISH (80-100 words): Luxury tone. Highlight the location, views, lifestyle benefits, and investment potential. Mention specific area details if you know them (e.g. La Cala is modern, built 2008-2015, has pool and tennis). End with a subtle investment angle.

2. RUSSIAN (80-100 words): Same luxury tone in natural Russian. Do not just translate — write naturally for Russian-speaking buyers. Mention proximity to beach, infrastructure, rental potential.

3. ARMENIAN (80-100 words): Write in proper Armenian Unicode characters only. Natural, professional Armenian. Do not use Latin transliteration. Target Armenian buyers looking for European investment property.

Return ONLY a valid JSON object with no other text, markdown, or explanation:
{
  "en": "English description here",
  "ru": "Russian description here",
  "hy": "Armenian description here"
}`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : ''

    // Parse JSON response
    const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const descriptions = JSON.parse(cleanJson)

    return NextResponse.json({ 
      success: true, 
      descriptions,
      remaining: RATE_LIMIT - rateData.count
    })

  } catch (error) {
    console.error('AI description generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 }
    )
  }
}
```

### 2.4 — Add the Generate button to admin form:

Find the Description tab in the admin property form component.
Add the AI generation UI above the three description textareas.

#### Button and UI:
```tsx
'use client'
import { useState } from 'react'

// State variables to add:
const [isGenerating, setIsGenerating] = useState(false)
const [generateError, setGenerateError] = useState('')
const [generateSuccess, setGenerateSuccess] = useState(false)
const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false)

// Generate function:
const handleGenerateDescriptions = async () => {
  // Check if descriptions already exist
  if (formData.description_en || formData.description_ru || formData.description_hy) {
    if (!showRegenerateConfirm) {
      setShowRegenerateConfirm(true)
      return
    }
  }
  
  setIsGenerating(true)
  setGenerateError('')
  setGenerateSuccess(false)
  setShowRegenerateConfirm(false)

  try {
    const response = await fetch('/api/admin/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        location: formData.location,
        price: formData.price,
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        floor: formData.floor,
        size: formData.size,
        parking: formData.parking,
        status: formData.status,
        features: formData.features_en 
          ? formData.features_en.split('\n').filter(Boolean) 
          : [],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Generation failed')
    }

    // Fill in the description fields
    setFormData(prev => ({
      ...prev,
      description_en: data.descriptions.en,
      description_ru: data.descriptions.ru,
      description_hy: data.descriptions.hy,
    }))

    setGenerateSuccess(true)
    setTimeout(() => setGenerateSuccess(false), 5000)

  } catch (error) {
    setGenerateError(error instanceof Error ? error.message : 'Generation failed')
  } finally {
    setIsGenerating(false)
  }
}
```

#### UI to add in the Description tab (above the textareas):
```tsx
{/* AI Generator Section */}
<div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
  <div className="flex items-center justify-between mb-3">
    <div>
      <h3 className="font-semibold text-gray-800 text-sm">
        ✨ AI Description Writer
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">
        Generates professional descriptions in English, Russian and Armenian
      </p>
    </div>
    
    {showRegenerateConfirm ? (
      <div className="flex items-center gap-2">
        <span className="text-xs text-amber-700">Replace existing?</span>
        <button
          type="button"
          onClick={handleGenerateDescriptions}
          className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded hover:bg-amber-600"
        >
          Yes, replace
        </button>
        <button
          type="button"
          onClick={() => setShowRegenerateConfirm(false)}
          className="px-3 py-1.5 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={handleGenerateDescriptions}
        disabled={isGenerating || !formData.name || !formData.location || !formData.price || !formData.bedrooms}
        className="flex items-center gap-2 px-4 py-2 bg-[#C9A84C] text-[#0D1F2D] font-semibold text-sm rounded hover:bg-[#E0C99A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        title={
          !formData.name || !formData.location || !formData.price || !formData.bedrooms
            ? 'Fill in name, location, price and bedrooms first'
            : 'Generate AI descriptions'
        }
      >
        {isGenerating ? (
          <>
            <span className="animate-spin">⟳</span>
            Generating...
          </>
        ) : (
          <>
            ✨ Generate with AI
          </>
        )}
      </button>
    )}
  </div>

  {/* Success message */}
  {generateSuccess && (
    <div className="p-2 bg-green-50 border border-green-200 rounded text-green-700 text-xs">
      ✅ Descriptions generated successfully! Review and edit before saving.
    </div>
  )}

  {/* Error message */}
  {generateError && (
    <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs">
      ❌ {generateError}
    </div>
  )}
</div>

{/* Loading shimmer on textareas */}
{isGenerating && (
  <div className="absolute inset-0 bg-amber-50/50 rounded-lg flex items-center justify-center z-10">
    <div className="text-amber-700 text-sm animate-pulse">
      ✨ AI is writing your descriptions...
    </div>
  </div>
)}
```

### 2.5 — Add setup instructions file:
Create `AI_SETUP.md` in the project root:
```markdown
# AI Description Writer Setup

## Getting Your API Key
1. Go to https://console.anthropic.com/api-keys
2. Sign in or create an account
3. Click "Create Key"
4. Copy the key

## Adding to Local Development
In .env.local add:
ANTHROPIC_API_KEY=sk-ant-your-key-here

## Adding to Vercel (Production)
1. Go to vercel.com → your project
2. Settings → Environment Variables
3. Add:
   Name: ANTHROPIC_API_KEY
   Value: sk-ant-your-key-here
4. Click Save
5. Redeploy: vercel --prod

## Usage Limits
- Max 10 AI generations per hour
- Each generation creates EN + RU + AM descriptions
- Uses claude-sonnet-4-20250514 model

## Cost
Very low cost — approximately $0.01-0.02 per generation
Monitor usage at: https://console.anthropic.com/usage
```

---

## Final Step

After both tasks are complete:
```bash
npm run build
git add .
git commit -m "AVIF support added, AI description writer integrated"
git push
vercel --prod
```

Then add ANTHROPIC_API_KEY to Vercel:
- Go to vercel.com → casa-del-mar project
- Settings → Environment Variables
- Add ANTHROPIC_API_KEY with your key value
- Redeploy after adding the key

---

## Checklist:
- [ ] AVIF accepted in file input (accept attribute)
- [ ] AVIF accepted in server-side upload validation
- [ ] AVIF in next.config.js image formats
- [ ] Error messages updated to mention AVIF in all 3 languages
- [ ] Upload hint text updated to mention AVIF
- [ ] Anthropic SDK installed
- [ ] .env.local updated with ANTHROPIC_API_KEY placeholder
- [ ] API route created at /api/admin/generate-description
- [ ] JWT auth check on the API route
- [ ] Rate limiting (10 per hour)
- [ ] Generate button added to Description tab
- [ ] Button disabled when required fields empty
- [ ] Loading state with spinner
- [ ] Success message after generation
- [ ] Error message if generation fails
- [ ] Regenerate confirmation when text already exists
- [ ] All 3 textareas filled automatically
- [ ] AI_SETUP.md created with instructions
- [ ] npm run build passes with zero errors
- [ ] Deployed to Vercel
