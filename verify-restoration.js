const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    console.log('\n════════════════════════════════════════');
    console.log('STEP 3: VERIFICATION');
    console.log('════════════════════════════════════════\n');

    // Check how many properties have images now
    const withImagesRes = await db.execute(
      "SELECT COUNT(*) as count FROM properties WHERE images != '[]' AND images != ''"
    );
    const withImagesCount = withImagesRes.rows[0].count;

    // Check total properties
    const totalRes = await db.execute('SELECT COUNT(*) as count FROM properties');
    const totalCount = totalRes.rows[0].count;

    console.log(`✓ Properties with images: ${withImagesCount}`);
    console.log(`✓ Total properties: ${totalCount}\n`);

    // Sample a few restored properties
    console.log('Sample restored properties:\n');
    const sampleRes = await db.execute(
      "SELECT id, name, images FROM properties WHERE images != '[]' AND images != '' LIMIT 10"
    );

    for (const row of sampleRes.rows) {
      const imgs = JSON.parse(row.images);
      console.log(`Property ${row.id.toString().padEnd(3)} (${row.name.substring(0, 35).padEnd(35)}): ${imgs.length} images`);
    }

    console.log(`\n✅ Database verification complete!`);
    console.log(`\nResult: ${withImagesCount} properties now have Vercel Blob URLs restored\n`);

  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
})();
