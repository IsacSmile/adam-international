function ensureResHelpers(res) {
  if (!res) return;
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

/**
 * CSRF protection for state-changing requests under /api/admin.
 * Compares the Origin header against the site's host (or x-forwarded-host).
 * Rejects with 403 { ok: false, error: 'forbidden_origin' } if mismatched or missing.
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @returns {boolean} true if valid, false if rejected with 403
 */
export function verifyOrigin(req, res) {
  ensureResHelpers(res);

  const origin = req.headers?.origin;
  const forwardedHost = req.headers?.['x-forwarded-host'];
  const host = (typeof forwardedHost === 'string' ? forwardedHost.split(',')[0].trim() : null)
    || req.headers?.host;

  if (!origin || !host) {
    if (res) {
      res.status(403).json({ ok: false, error: 'forbidden_origin' });
    }
    return false;
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.host.toLowerCase() !== host.toLowerCase()) {
      if (res) {
        res.status(403).json({ ok: false, error: 'forbidden_origin' });
      }
      return false;
    }
    return true;
  } catch (err) {
    if (res) {
      res.status(403).json({ ok: false, error: 'forbidden_origin' });
    }
    return false;
  }
}

export const checkOrigin = verifyOrigin;
export default verifyOrigin;
