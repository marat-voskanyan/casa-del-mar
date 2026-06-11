const { createClient } = require('@libsql/client');
const fs = require('fs');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    console.log('\n════════════════════════════════════════');
    console.log('1️⃣  PROPERTIES WITH EMPTY IMAGES IN TURSO');
    console.log('════════════════════════════════════════\n');

    const emptyRes = await db.execute(
      "SELECT id, name FROM properties WHERE images = '[]' OR images = '' ORDER BY id"
    );

    console.log(`Total properties with empty images: ${emptyRes.rows.length}\n`);

    if (emptyRes.rows.length > 0) {
      console.log('Property ID | Name');
      console.log('-'.repeat(80));
      for (const row of emptyRes.rows) {
        console.log(`${row.id.toString().padEnd(11)} | ${row.name}`);
      }
    }

    console.log('\n════════════════════════════════════════');
    console.log('2️⃣  MIGRATION LOG ANALYSIS');
    console.log('════════════════════════════════════════\n');

    const log = JSON.parse(fs.readFileSync('migration-log.json', 'utf8'));
    const entries = Object.entries(log);

    console.log(`Total entries in migration-log.json: ${entries.length}\n`);

    console.log('Sample entries (showing original → Cloudflare mapping):\n');
    console.log('ORIGINAL URL (Vercel Blob)'.padEnd(70) + ' | CLOUDFLARE URL');
    console.log('-'.repeat(150));

    // Show first 5 entries
    for (let i = 0; i < Math.min(5, entries.length); i++) {
      const [original, cloudflare] = entries[i];
      const origShort = original.substring(0, 65);
      const cfShort = cloudflare.substring(0, 70);
      console.log(`${origShort.padEnd(70)} | ${cfShort}`);
    }

    console.log('\n════════════════════════════════════════');
    console.log('3️⃣  KEY OBSERVATION');
    console.log('════════════════════════════════════════\n');

    console.log(`✓ Migration log has ${entries.length} entries with ORIGINAL Vercel Blob URLs`);
    console.log(`✓ All entries appear to be Vercel Blob URLs → Cloudflare mappings`);
    console.log(`✓ Empty properties found: ${emptyRes.rows.length}`);

    if (entries.length === 20) {
      console.log(`\n⚠️  Only 20 URLs in log, but ${emptyRes.rows.length} properties are empty`);
      console.log('   = We have ~20 URLs for ~55+ properties needing recovery');
    }

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
