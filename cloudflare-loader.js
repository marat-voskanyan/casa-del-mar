export default function cloudflareLoader({ src, width, quality }) {
  // Optimize Cloudflare Image URLs with width, quality, and format parameters
  if (src.includes('imagedelivery.net')) {
    const base = src.replace('/public', '').replace(/\/w=.*$/, '')
    return `${base}/w=${width},q=${quality || 75},format=auto`
  }
  // If src is already a full URL (Vercel Blob, or any other http), return as-is
  if (src.startsWith('http')) return src
  // For local paths, serve as-is (fallback)
  return src
}
