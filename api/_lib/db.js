import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile?.('.env.local');
  } catch {}
}

export const sql = neon(process.env.DATABASE_URL);
