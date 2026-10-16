import { handleUpload } from '@vercel/blob/client';
import { requireAdmin } from '../_lib/session.js';
import { verifyOrigin } from '../_lib/origin.js';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  try {
    process.loadEnvFile?.('.env.local');
  } catch {}
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

export default async function handler(req, res) {
  ensureResHelpers(res);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  let body = {};
  if (typeof req.body === 'string') {
    const trimmed = req.body.trim();
    if (trimmed) {
      try {
        body = JSON.parse(trimmed);
      } catch {
        return res.status(400).json({ ok: false, error: 'invalid_json' });
      }
    }
  } else if (req.body && typeof req.body === 'object') {
    body = req.body;
  }
  if (!body || typeof body !== 'object') {
    body = {};
  }

  try {
    const jsonResponse = await handleUpload({
      token: process.env.BLOB_READ_WRITE_TOKEN,
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        // Authenticate admin session
        const admin = await requireAdmin(req, res);
        if (!admin) {
          throw new Error('Unauthorized');
        }

        // Verify CSRF origin
        const validOrigin = verifyOrigin(req, res);
        if (!validOrigin) {
          throw new Error('Forbidden origin');
        }

        // Validate pathname: must start with events/ or blog/
        if (!pathname || (!pathname.startsWith('events/') && !pathname.startsWith('blog/'))) {
          throw new Error('Pathname must start with events/ or blog/');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
          maximumSizeInBytes: 5 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Webhook from Vercel servers without cookies - do not authenticate
        console.log('Blob upload completed:', blob?.url);
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (err) {
    if (res.headersSent || (res.statusCode && res.statusCode >= 400)) {
      return;
    }
    console.error('Blob upload error:', err.message);
    return res.status(400).json({ ok: false, error: err.message });
  }
}
