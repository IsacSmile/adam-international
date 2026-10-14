import { SignJWT, jwtVerify } from 'jose';
import { sql } from './db.js';

function getSecretKey() {
  if (!process.env.SESSION_SECRET) {
    try {
      process.loadEnvFile?.('.env.local');
    } catch {}
  }
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error('SESSION_SECRET environment variable is not configured');
  }
  return new TextEncoder().encode(secret);
}

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

function appendCookie(res, cookieStr) {
  const prev = typeof res.getHeader === 'function' ? res.getHeader('Set-Cookie') : null;
  if (!prev) {
    res.setHeader('Set-Cookie', cookieStr);
  } else if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, cookieStr]);
  } else {
    res.setHeader('Set-Cookie', [prev, cookieStr]);
  }
}

function parseCookie(req, name) {
  if (req.cookies && typeof req.cookies === 'object' && req.cookies[name]) {
    return req.cookies[name];
  }
  const header = req.headers?.cookie;
  if (!header || typeof header !== 'string') return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/**
 * Creates an authenticated session for an admin.
 * Signs JWT with HS256, 8-hour expiry, payload { sub: admin.id, email }
 * Sets ai_admin cookie with HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800
 */
export async function createSession(res, admin) {
  ensureResHelpers(res);
  const secretKey = getSecretKey();
  const token = await new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secretKey);

  const cookieStr = `ai_admin=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`;
  appendCookie(res, cookieStr);
  return token;
}

/**
 * Verifies the ai_admin cookie and confirms the admin exists in the database.
 * If either fails, sends 401 and returns null.
 * Otherwise returns the admin record.
 */
export async function requireAdmin(req, res) {
  ensureResHelpers(res);
  const token = parseCookie(req, 'ai_admin');
  if (!token) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return null;
  }

  try {
    const secretKey = getSecretKey();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });

    if (!payload?.sub) {
      res.status(401).json({ ok: false, error: 'unauthorized' });
      return null;
    }

    const rows = await sql`
      SELECT id, email, created_at
      FROM admins
      WHERE id = ${payload.sub}
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      res.status(401).json({ ok: false, error: 'unauthorized' });
      return null;
    }

    return rows[0];
  } catch (err) {
    res.status(401).json({ ok: false, error: 'unauthorized' });
    return null;
  }
}

/**
 * Clears the ai_admin session cookie.
 */
export function clearSession(res) {
  ensureResHelpers(res);
  const cookieStr = 'ai_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
  appendCookie(res, cookieStr);
}
