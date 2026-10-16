import { list, del } from '@vercel/blob';
import { sql } from '../api/_lib/db.js';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    process.loadEnvFile?.('.env.local');
  } catch {}
}

async function main() {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is not set.');
    console.error('Please configure BLOB_READ_WRITE_TOKEN in .env.local to clean up Vercel Blobs.');
    process.exit(1);
  }

  const isConfirmed = process.argv.includes('--confirm');

  console.log('--- Vercel Blob Cleanup Utility ---');
  console.log(`Mode: ${isConfirmed ? 'CONFIRMED DELETION (--confirm)' : 'DRY RUN (pass --confirm to delete)'}`);

  // 1. Fetch all referenced image/poster/thumb/photo URLs from database
  console.log('\nQuerying database for referenced images...');
  const eventRows = await sql`
    SELECT image, image_thumb, poster, poster_thumb, photo FROM events
  `;
  const postRows = await sql`
    SELECT image, image_thumb FROM blog_posts
  `;

  const referencedUrls = new Set();
  const addRef = (val) => {
    if (val && typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed) {
        referencedUrls.add(trimmed);
        try {
          const u = new URL(trimmed);
          referencedUrls.add(u.pathname.replace(/^\//, ''));
        } catch {
          // not a full URL
        }
      }
    }
  };

  for (const r of eventRows) {
    addRef(r.image);
    addRef(r.image_thumb);
    addRef(r.poster);
    addRef(r.poster_thumb);
    addRef(r.photo);
  }

  for (const r of postRows) {
    addRef(r.image);
    addRef(r.image_thumb);
  }

  console.log(`Found ${referencedUrls.size} distinct image references in database.`);

  // 2. Fetch all blobs from Vercel Blob store
  console.log('\nFetching blobs from Vercel Blob store...');
  const allBlobs = [];
  let cursor;
  let hasMore = true;

  while (hasMore) {
    const res = await list({ cursor, token: process.env.BLOB_READ_WRITE_TOKEN });
    if (res.blobs && Array.isArray(res.blobs)) {
      allBlobs.push(...res.blobs);
    }
    hasMore = res.hasMore;
    cursor = res.cursor;
  }

  console.log(`Total blobs found in store: ${allBlobs.length}`);

  if (allBlobs.length === 0) {
    console.log('No blobs exist in the Vercel Blob store.');
    process.exit(0);
  }

  // 3. Filter blobs:
  // Must NOT be referenced in database
  // Must be older than 24 hours
  // Never touch local /images paths
  const now = Date.now();
  const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

  const referencedBlobs = [];
  const orphanedRecentBlobs = [];
  const eligibleBlobs = [];

  for (const blob of allBlobs) {
    if (blob.url.startsWith('/images/') || blob.url.startsWith('./images/')) {
      continue;
    }

    const isReferenced =
      referencedUrls.has(blob.url) ||
      referencedUrls.has(blob.pathname) ||
      (blob.downloadUrl && referencedUrls.has(blob.downloadUrl));

    if (isReferenced) {
      referencedBlobs.push(blob);
      continue;
    }

    const uploadedTime = new Date(blob.uploadedAt).getTime();
    const ageMs = now - uploadedTime;
    const ageHours = (ageMs / (1000 * 60 * 60)).toFixed(1);

    if (ageMs > TWENTY_FOUR_HOURS_MS) {
      eligibleBlobs.push({ ...blob, ageHours });
    } else {
      orphanedRecentBlobs.push({ ...blob, ageHours });
    }
  }

  console.log(`- Active / referenced blobs: ${referencedBlobs.length}`);
  console.log(`- Orphaned blobs < 24 hours old (preserved as recent uploads/drafts): ${orphanedRecentBlobs.length}`);
  console.log(`- Orphaned blobs > 24 hours old (eligible for cleanup): ${eligibleBlobs.length}`);

  if (eligibleBlobs.length === 0) {
    console.log('\n✓ No unreferenced blobs older than 24 hours to delete.');
    process.exit(0);
  }

  console.log('\nBlobs eligible for deletion:');
  eligibleBlobs.forEach((b, idx) => {
    console.log(`  [${idx + 1}] Pathname: ${b.pathname}`);
    console.log(`      URL: ${b.url}`);
    console.log(`      Size: ${(b.size / 1024).toFixed(1)} KB | Age: ${b.ageHours} hours (uploaded ${new Date(b.uploadedAt).toISOString()})`);
  });

  if (!isConfirmed) {
    console.log('\n[DRY RUN] No blobs were deleted.');
    console.log('To delete these blobs, run: npm run blobs:cleanup -- --confirm');
  } else {
    console.log('\nDeleting unreferenced blobs older than 24h...');
    const urlsToDelete = eligibleBlobs.map((b) => b.url);
    await del(urlsToDelete, { token: process.env.BLOB_READ_WRITE_TOKEN });
    console.log(`✓ Successfully deleted ${urlsToDelete.length} unreferenced blob(s).`);
  }
}

main().catch((err) => {
  console.error('Error during blob cleanup:', err);
  process.exit(1);
});
