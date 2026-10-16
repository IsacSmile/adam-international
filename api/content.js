import { sql } from './_lib/db.js';
import { getAdminSession } from './_lib/session.js';
import { getCategoryBySlug, getCategoryByName } from '../src/data/blogCategories.js';

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

function toDateString(val) {
  if (!val) return null;
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val.trim())) {
    return val.trim();
  }
  const d = val instanceof Date ? val : new Date(val);
  if (isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function toIsoString(val) {
  if (!val) return null;
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val.toISOString();
  }
  if (typeof val === 'string') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? val : d.toISOString();
  }
  return null;
}

function formatEvent(row) {
  let bodyArr = [];
  if (Array.isArray(row.body)) {
    bodyArr = row.body;
  } else if (typeof row.body === 'string') {
    bodyArr = row.body.split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean);
  }

  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    status: row.status,
    title: row.title,
    tagline: row.tagline,
    country: row.country,
    date: toDateString(row.date),
    month: row.month,
    year: row.year,
    location: row.location,
    organisedBy: row.organised_by,
    highlight: row.highlight,
    conditionNote: row.condition_note,
    summary: row.summary,
    body: bodyArr,
    closingLine: row.closing_line,
    closingItalic: Boolean(row.closing_italic),
    facts: Array.isArray(row.facts) ? row.facts : [],
    image: row.image,
    imageThumb: row.image_thumb,
    poster: row.poster,
    posterThumb: row.poster_thumb,
    posterWidth: row.poster_width,
    posterHeight: row.poster_height,
    photo: row.photo,
    awardingBody: row.awarding_body,
    registrationOpen: Boolean(row.registration_open),
    registration_open: Boolean(row.registration_open),
    publishedAt: toIsoString(row.published_at),
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    updatedBy: row.updated_by || null,
  };
}

function formatPost(row) {
  const catObj = getCategoryBySlug(row.category) || getCategoryByName(row.category);
  const categoryName = catObj ? catObj.name : row.category;
  const categorySlug = catObj ? catObj.slug : row.category;
  const publishDate = toDateString(row.publish_date);

  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    category: categoryName,
    categorySlug: categorySlug,
    summary: row.summary,
    body_md: row.body_md,
    bodyMd: row.body_md,
    image: row.image,
    imageThumb: row.image_thumb,
    imageAlt: row.image_alt,
    author: row.author,
    featured: Boolean(row.featured),
    isSample: Boolean(row.is_sample),
    isPlaceholder: Boolean(row.is_sample),
    publishDate: publishDate,
    date: publishDate,
    updated: toDateString(row.updated_at) || publishDate,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    publishedAt: toIsoString(row.published_at),
    updatedBy: row.updated_by || null,
  };
}

export default async function handler(req, res) {
  ensureResHelpers(res);

  // Method check: GET only
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams.entries());
  if (req.query) {
    Object.assign(query, req.query);
  }

  const { type, slug, preview } = query;

  // Check preview credentials
  let allowDrafts = false;
  if (preview === '1') {
    const admin = await getAdminSession(req);
    if (admin) {
      allowDrafts = true;
    }
  }

  // Set appropriate caching headers
  if (allowDrafts) {
    res.setHeader('Cache-Control', 'no-store');
  } else {
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  }

  try {
    if (type === 'events') {
      const rows = allowDrafts
        ? await sql`SELECT * FROM events ORDER BY created_at DESC`
        : await sql`SELECT * FROM events WHERE status = 'published' ORDER BY created_at DESC`;

      return res.status(200).json(rows.map(formatEvent));
    }

    if (type === 'event') {
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ ok: false, error: 'missing_slug' });
      }

      const rows = allowDrafts
        ? await sql`SELECT * FROM events WHERE slug = ${slug.trim()} LIMIT 1`
        : await sql`SELECT * FROM events WHERE slug = ${slug.trim()} AND status = 'published' LIMIT 1`;

      if (!rows || rows.length === 0) {
        return res.status(404).json({ ok: false, error: 'not_found' });
      }

      return res.status(200).json(formatEvent(rows[0]));
    }

    if (type === 'posts') {
      const rows = allowDrafts
        ? await sql`SELECT * FROM blog_posts ORDER BY publish_date DESC NULLS LAST, created_at DESC`
        : await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC NULLS LAST, created_at DESC`;

      return res.status(200).json(rows.map(formatPost));
    }

    if (type === 'post') {
      if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ ok: false, error: 'missing_slug' });
      }

      const rows = allowDrafts
        ? await sql`SELECT * FROM blog_posts WHERE slug = ${slug.trim()} LIMIT 1`
        : await sql`SELECT * FROM blog_posts WHERE slug = ${slug.trim()} AND status = 'published' LIMIT 1`;

      if (!rows || rows.length === 0) {
        return res.status(404).json({ ok: false, error: 'not_found' });
      }

      return res.status(200).json(formatPost(rows[0]));
    }

    return res.status(400).json({ ok: false, error: 'invalid_type' });
  } catch (err) {
    console.error('Content API error:', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
}
