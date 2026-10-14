import bcrypt from 'bcryptjs';
import { sql } from '../_lib/db.js';
import { createSession, requireAdmin, clearSession } from '../_lib/session.js';
import { verifyOrigin } from '../_lib/origin.js';

// Pre-hashed bcrypt cost 12 dummy salt for constant-time comparisons when email is not found
const DUMMY_HASH = '$2b$12$B7E17qCfH2SvUKVnd0EekOUJs7TQIqB6SUcSmswzkEjWpmZHE94k.';

function ensureResHelpers(res) {
  if (!res.status) {
    res.status = function status(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function json(payload) {
      this.setHeader('Content-Type', 'application/json');
      this.end(JSON.stringify(payload));
      return this;
    };
  }
}

export default async function handler(req, res) {
  ensureResHelpers(res);

  const action = req.query?.action || new URL(req.url, 'http://localhost').searchParams.get('action');

  try {
    // -------------------------------------------------------------------------
    // POST ?action=login
    // -------------------------------------------------------------------------
    if (action === 'login') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'method_not_allowed' });
      }

      // CSRF protection for POST
      if (!verifyOrigin(req, res)) {
        return;
      }

      let body = req.body;
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body);
        } catch {
          return res.status(400).json({ ok: false, error: 'Invalid request body' });
        }
      }
      body = body || {};

      const { email, password } = body;
      if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return res.status(401).json({ ok: false, error: 'Incorrect email or password.' });
      }

      const normalizedEmail = email.trim().toLowerCase();
      const forwarded = req.headers?.['x-forwarded-for'];
      const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null)
        || req.socket?.remoteAddress
        || req.connection?.remoteAddress
        || '127.0.0.1';

      // Lockout check: 5 or more failed attempts for this email in last 15 minutes
      const [failCheck] = await sql`
        SELECT count(*)::int AS count
        FROM login_attempts
        WHERE email = ${normalizedEmail}
          AND success = false
          AND created_at > now() - interval '15 minutes'
      `;

      if (failCheck && failCheck.count >= 5) {
        return res.status(429).json({
          ok: false,
          error: 'Too many attempts. Try again in 15 minutes.',
        });
      }

      // Check password: lookup admin, or compare with dummy hash to prevent timing attacks
      const [admin] = await sql`
        SELECT id, email, password_hash
        FROM admins
        WHERE email = ${normalizedEmail}
        LIMIT 1
      `;

      let isValid = false;
      if (admin) {
        isValid = await bcrypt.compare(password, admin.password_hash);
      } else {
        await bcrypt.compare(password, DUMMY_HASH);
      }

      // Log attempt in login_attempts
      await sql`
        INSERT INTO login_attempts (email, ip, success)
        VALUES (${normalizedEmail}, ${clientIp}, ${isValid})
      `;

      // Wrong email or password
      if (!isValid || !admin) {
        return res.status(401).json({
          ok: false,
          error: 'Incorrect email or password.',
        });
      }

      // Success
      await createSession(res, admin);
      return res.status(200).json({ ok: true, email: admin.email });
    }

    // -------------------------------------------------------------------------
    // POST ?action=logout
    // -------------------------------------------------------------------------
    if (action === 'logout') {
      if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ ok: false, error: 'method_not_allowed' });
      }

      // CSRF protection for POST
      if (!verifyOrigin(req, res)) {
        return;
      }

      clearSession(res);
      return res.status(200).json({ ok: true });
    }

    // -------------------------------------------------------------------------
    // GET ?action=me
    // -------------------------------------------------------------------------
    if (action === 'me') {
      if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET');
        return res.status(405).json({ ok: false, error: 'method_not_allowed' });
      }

      const admin = await requireAdmin(req, res);
      if (!admin) {
        return; // requireAdmin already sent 401
      }

      return res.status(200).json({ email: admin.email });
    }

    // Unrecognized action
    return res.status(400).json({ ok: false, error: 'invalid_action' });
  } catch (err) {
    console.error('Admin auth endpoint error:', err);
    return res.status(500).json({ ok: false, error: 'server' });
  }
}
