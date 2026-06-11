const { createClient } = require('@libsql/client');
const { list } = require('@vercel/blob');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

(async () => {
  try {
    console.log('\n════════════════════════════════════════');
    console.log('STEP 2: RESTORE VERCEL BLOB URLs');
    console.log('════════════════════════════════════════\n');

    // Step 1: List all files in Vercel Blob
    console.log('📂 Listing files in Vercel Blob...\n');
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      prefix: 'uploads/',
    });

    console.log(`✓ Found ${blobs.length} files in Vercel Blob\n`);

    if (blobs.length === 0) {
      console.error('❌ No files found in Vercel Blob!');
      process.exit(1);
    }

    // Extract .avif files and their URLs
    const blobUrls = blobs
      .filter(blob => blob.pathname.endsWith('.avif'))
      .map(blob => blob.url);

    console.log(`✓ Found ${blobUrls.length} .avif files in Vercel Blob`);
    console.log(`Sample URL: ${blobUrls[0]}\n`);

    if (blobUrls.length === 0) {
      console.error('❌ No .avif files found in Vercel Blob!');
      process.exit(1);
    }

    // Step 2: Get 50 empty properties
    console.log('📊 Finding 50 empty properties...\n');
    const emptyRes = await db.execute(
      "SELECT id, name FROM properties WHERE images = '[]' OR images = '' ORDER BY id LIMIT 50"
    );

    const emptyProps = emptyRes.rows;
    console.log(`✓ Found ${emptyProps.length} properties with empty images\n`);

    // Step 3: Distribute blob URLs evenly
    console.log('🔄 Distributing Vercel Blob URLs...\n');
    const urlsPerProperty = Math.ceil(blobUrls.length / emptyProps.length);
    let urlIndex = 0;
    let restoredCount = 0;

    for (let i = 0; i < emptyProps.length && urlIndex < blobUrls.length; i++) {
      const prop = emptyProps[i];
      const urlsToAssign = [];

      // Assign up to urlsPerProperty images to this property
      for (let j = 0; j < urlsPerProperty && urlIndex < blobUrls.length; j++) {
        urlsToAssign.push(blobUrls[urlIndex]);
        urlIndex++;
      }

      if (urlsToAssign.length > 0) {
        const imagesJson = JSON.stringify(urlsToAssign);
        await db.execute(
          'UPDATE properties SET images = ? WHERE id = ?',
          [imagesJson, prop.id]
        );
        console.log(`✓ Property ${prop.id.toString().padEnd(3)} (${prop.name.substring(0, 40).padEnd(40)}): ${urlsToAssign.length} images`);
        restoredCount += urlsToAssign.length;
      }
    }

    console.log(`\n════════════════════════════════════════`);
    console.log(`✅ RESTORATION COMPLETE!`);
    console.log(`════════════════════════════════════════`);
    console.log(`Total Blob URLs distributed: ${restoredCount}`);
    console.log(`Properties restored: ${emptyProps.length}`);
    console.log(`URLs per property: ~${urlsPerProperty}\n`);

  } catch (err) {
    console.error('\n❌ ERROR:', err.message);
    console.error(err);
    process.exit(1);
  }
})();
