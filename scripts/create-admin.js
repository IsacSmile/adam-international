import fs from 'fs';
import path from 'path';
import readline from 'readline';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

// Load .env.local or .env if DATABASE_URL is not set in environment
function loadEnv() {
  const candidates = ['.env.local', '.env'];
  for (const file of candidates) {
    const p = path.resolve(process.cwd(), file);
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eq = trimmed.indexOf('=');
          if (eq !== -1) {
            const key = trimmed.slice(0, eq).trim();
            const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  }
}

loadEnv();

function promptPassword(promptText) {
  return new Promise((resolve) => {
    process.stdout.write(promptText);

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.setEncoding('utf8');

      let password = '';
      const onData = (chunk) => {
        for (let i = 0; i < chunk.length; i++) {
          const char = chunk[i];
          if (char === '\n' || char === '\r' || char === '\u0004') {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.stdin.removeListener('data', onData);
            process.stdout.write('\n');
            resolve(password);
            return;
          } else if (char === '\u0003') {
            // Ctrl+C
            process.stdin.setRawMode(false);
            process.stdin.pause();
            process.exit(1);
          } else if (char === '\u0008' || char === '\x7f') {
            // Backspace
            if (password.length > 0) {
              password = password.slice(0, -1);
            }
          } else {
            password += char;
          }
        }
      };

      process.stdin.on('data', onData);
    } else {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question('', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
    }
  });
}

async function main() {
  const emailArg = process.argv[2] || process.env.ADMIN_EMAIL;

  if (!emailArg) {
    console.error('Usage: node scripts/create-admin.js <admin-email>');
    console.error('Or set ADMIN_EMAIL in your environment / .env.local');
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error(`Error: "${emailArg}" is not a valid email address.`);
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set.');
    console.error('Please configure DATABASE_URL in your environment or in .env.local');
    process.exit(1);
  }

  console.log(`\nCreating / updating admin user: ${email}`);

  let password = (!process.argv[2] && process.env.ADMIN_PASSWORD) ? process.env.ADMIN_PASSWORD : '';

  if (!password) {
    password = await promptPassword('Enter password (min 12 characters): ');

    if (!password || password.length < 12) {
      console.error('\nError: Password must be at least 12 characters long.');
      process.exit(1);
    }

    const confirmPassword = await promptPassword('Confirm password: ');

    if (password !== confirmPassword) {
      console.error('\nError: Passwords do not match.');
      process.exit(1);
    }
  } else {
    console.log('Using ADMIN_PASSWORD from environment...');
    if (password.length < 12) {
      console.error('\nError: Password in environment must be at least 12 characters long.');
      process.exit(1);
    }
  }

  console.log('\nHashing password with bcrypt (cost 12)...');
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const sql = neon(process.env.DATABASE_URL);

    await sql`
      INSERT INTO admins (email, password_hash)
      VALUES (${email}, ${passwordHash})
      ON CONFLICT (email)
      DO UPDATE SET password_hash = EXCLUDED.password_hash;
    `;

    console.log(`✓ Admin user "${email}" created/updated successfully.\n`);
  } catch (err) {
    console.error('Database error creating admin:', err.message);
    process.exit(1);
  }
}

main();
