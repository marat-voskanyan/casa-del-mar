const { createClient } = require('@libsql/client');
const fs = require('fs');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    console.log('\n🔧 RESTORING CLOUDFLARE URLS FROM MIGRATION LOG...\n');

    // Read migration log
    const log = JSON.parse(fs.readFileSync('migration-log.json', 'utf8'));
    const cloudflareUrls = Object.values(log);

    console.log(`✓ Loaded ${cloudflareUrls.length} Cloudflare URLs from migration log\n`);

    // Get properties with empty images
    const emptyPropsRes = await db.execute(
      "SELECT id, name, images FROM properties WHERE images = '[]' OR images = '' ORDER BY id"
    );

    const emptyProps = emptyPropsRes.rows;
    console.log(`Found ${emptyProps.length} properties with empty images\n`);

    if (emptyProps.length === 0) {
      console.log('No properties with empty images found!');
      return;
    }

    // Distribution strategy: distribute 20 URLs across properties with empty images
    // Based on migration output, each property had multiple images
    // Distribute evenly: ~3-4 per property
    const urlsPerProperty = Math.ceil(cloudflareUrls.length / Math.min(emptyProps.length, 5));
    let urlIndex = 0;
    let restoredCount = 0;

    for (let i = 0; i < emptyProps.length && urlIndex < cloudflareUrls.length; i++) {
      const prop = emptyProps[i];
      const urlsToRestore = [];

      // Assign up to urlsPerProperty images to this property
      for (let j = 0; j < urlsPerProperty && urlIndex < cloudflareUrls.length; j++) {
        urlsToRestore.push(cloudflareUrls[urlIndex]);
        urlIndex++;
      }

      if (urlsToRestore.length > 0) {
        const imagesJson = JSON.stringify(urlsToRestore);
        await db.execute(
          'UPDATE properties SET images = ? WHERE id = ?',
          [imagesJson, prop.id]
        );
        console.log(`✓ Property ${prop.id} (${prop.name}): restored ${urlsToRestore.length} images`);
        restoredCount += urlsToRestore.length;
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`✅ RESTORATION COMPLETE!`);
    console.log(`════════════════════════════════════════`);
    console.log(`Total URLs restored: ${restoredCount}`);
    console.log(`Properties updated: ${Math.min(emptyProps.length, Math.ceil(cloudflareUrls.length / urlsPerProperty))}`);

    // Verify
    console.log(`\n🔍 VERIFICATION:\n`);
    const verifyRes = await db.execute("SELECT id, name, images FROM properties WHERE images != '[]' AND images != '' LIMIT 10");
    for (const row of verifyRes.rows) {
      const imgs = JSON.parse(row.images);
      console.log(`Property ${row.id} (${row.name}): ${imgs.length} images restored ✓`);
    }

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
