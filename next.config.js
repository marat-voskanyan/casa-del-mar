/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // Server-only DB access via @libsql/client (Turso in prod, file: locally).
}

module.exports = nextConfig
