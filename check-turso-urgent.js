const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    const res = await db.execute('SELECT id, name, images FROM properties LIMIT 3');

    console.log('\n=== TURSO PRODUCTION DATABASE STATE ===\n');
    for (const row of res.rows) {
      console.log(`Property ID: ${row.id}, Name: ${row.name}`);
      try {
        const imgs = JSON.parse(row.images);
        console.log(`Images count: ${imgs.length}`);
        if (imgs.length > 0) {
          console.log(`First URL type: ${imgs[0].includes('imagedelivery.net') ? 'Cloudflare ✓' : imgs[0].includes('blob.vercel') ? 'Vercel Blob' : 'LOCAL PATH ⚠️'}`);
          console.log(`First image: ${imgs[0].substring(0, 100)}...`);
        } else {
          console.log('Images: EMPTY ARRAY ⚠️⚠️⚠️');
        }
      } catch (e) {
        console.log(`Images: PARSE ERROR - ${row.images}`);
      }
      console.log('');
    }
  } catch (err) {
    console.error('ERROR connecting to Turso:', err.message);
  }
})();
