const { createClient } = require('@libsql/client');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'casa.db');
const db = createClient({ url: `file:${dbPath}` });

(async () => {
  const res = await db.execute('SELECT id, name, images FROM properties LIMIT 3');

  console.log('\n=== CURRENT DATABASE STATE ===\n');
  for (const row of res.rows) {
    console.log(`Property ID: ${row.id}, Name: ${row.name}`);
    try {
      const imgs = JSON.parse(row.images);
      console.log(`Images count: ${imgs.length}`);
      if (imgs.length > 0) {
        console.log(`First image: ${imgs[0].substring(0, 80)}...`);
      } else {
        console.log('Images: EMPTY ARRAY ⚠️');
      }
    } catch (e) {
      console.log(`Images: PARSE ERROR - ${row.images}`);
    }
    console.log('');
  }
  process.exit(0);
})().catch(err => {
  console.error('ERROR:', err.message);
  process.exit(1);
});
