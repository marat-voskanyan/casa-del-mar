export default function cloudflareLoader({ src, width, quality }) {
  // If src is already a full URL (Cloudflare, Vercel Blob, or any http), return as-is
  if (src.startsWith('http')) return src
  // For local paths, serve as-is (fallback)
  return src
}
