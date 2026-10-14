import fs from 'fs';
import path from 'path';
import { Pool, neonConfig } from '@neondatabase/serverless';

if (typeof WebSocket !== 'undefined') {
  neonConfig.webSocketConstructor = WebSocket;
}

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL is not set in environment.');
  process.exit(1);
}

async function applySchema() {
  const schemaPath = path.resolve(process.cwd(), 'db/schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`Error: Schema file not found at ${schemaPath}`);
    process.exit(1);
  }

  const schemaSql = fs.readFileSync(schemaPath, 'utf8');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    const client = await pool.connect();
    try {
      console.log('Applying db/schema.sql...');
      await client.query(schemaSql);
      console.log('✓ Schema applied successfully.');
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error applying schema:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

applySchema();
