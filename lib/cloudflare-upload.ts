// Server-side only — never import on client side
export async function uploadToCloudflare(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN
  const accountHash = process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH

  if (!accountId || !apiToken || !accountHash) {
    throw new Error(
      'Cloudflare credentials missing. Set CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_API_TOKEN, and NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_HASH in environment'
    )
  }

  // Create FormData with the image buffer
  const formData = new FormData()
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: 'application/octet-stream' })
  formData.append('file', blob, filename)

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
      body: formData,
    }
  )

  const data = await response.json()

  if (!data.success) {
    const errorMsg = data.errors?.[0]?.message || 'Unknown error'
    throw new Error(`Cloudflare upload failed: ${errorMsg}`)
  }

  if (!data.result || !data.result.id) {
    throw new Error('No image ID returned from Cloudflare')
  }

  return `https://imagedelivery.net/${accountHash}/${data.result.id}/public`
}
