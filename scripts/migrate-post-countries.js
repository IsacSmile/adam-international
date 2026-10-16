import { Pool, neonConfig } from '@neondatabase/serverless';

if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
}

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile?.('.env.local');
  } catch {}
}

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set in environment.');
  process.exit(1);
}

async function migratePostCountries() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const client = await pool.connect();
    try {
      console.log('Migrating blog_posts: adding countries text[] column...');
      await client.query(`
        ALTER TABLE blog_posts
        ADD COLUMN IF NOT EXISTS countries text[] NOT NULL DEFAULT '{}';
      `);
      console.log('✓ Migration successful: blog_posts.countries added (idempotent).');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migratePostCountries();
