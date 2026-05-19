/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  // node:sqlite is a built-in Node.js module — no webpack exclusion needed.
  // It is never imported on the client because all DB calls are server-only.
}

module.exports = nextConfig
