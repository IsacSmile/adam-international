import { del } from '@vercel/blob';
import { sql } from '../_lib/db.js';
import { requireAdmin } from '../_lib/session.js';
import { verifyOrigin } from '../_lib/origin.js';
import { validateEvent, validatePost } from '../_lib/contentValidate.js';
import { getCategoryBySlug, getCategoryByName } from '../../src/data/blogCategories.js';

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

function getTodayIST() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

let blobDeleteFn = del;
export function __setBlobDeleteFn(fn) {
  blobDeleteFn = fn;
}
export function __resetBlobDeleteFn() {
  blobDeleteFn = del;
}

export function isBlobUrl(url) {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === 'https:' &&
      (parsed.hostname === 'public.blob.vercel-storage.com' ||
        parsed.hostname.endsWith('.public.blob.vercel-storage.com'))
    );
  } catch {
    return false;
  }
}

export async function safeDeleteBlobs(urls) {
  const blobUrls = (Array.isArray(urls) ? urls : [urls]).filter(isBlobUrl);
  if (blobUrls.length === 0) return;
  try {
    await blobDeleteFn(blobUrls, { token: process.env.BLOB_READ_WRITE_TOKEN });
  } catch (err) {
    console.error('Failed to delete blob(s):', err.message);
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

const formatDbDate = toDateString;

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
    bodyRaw: row.body,
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
    countries: Array.isArray(row.countries) ? row.countries : [],
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

  // Authenticate admin on all requests
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  // On write requests (POST, PATCH, DELETE), verify CSRF origin
  if (['POST', 'PATCH', 'DELETE'].includes(req.method)) {
    if (!verifyOrigin(req, res)) return;
  }

  // Parse body only for POST and PATCH
  let body = {};
  if (req.method === 'POST' || req.method === 'PATCH') {
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
  }

  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams.entries());
  if (req.query) {
    Object.assign(query, req.query);
  }

  const type = query.type || body.type;
  const id = query.id || body.id;
  const slug = query.slug || body.slug;
  const q = query.q || body.q;
  const status = query.status || body.status;

  try {
    // --- GET handlers ---
    if (req.method === 'GET') {
      if (type === 'events') {
        let rows;
        if (q && status && status !== 'all') {
          const search = `%${q.trim()}%`;
          rows = await sql`
            SELECT * FROM events
            WHERE status = ${status} AND title ILIKE ${search}
            ORDER BY created_at DESC
          `;
        } else if (q) {
          const search = `%${q.trim()}%`;
          rows = await sql`
            SELECT * FROM events
            WHERE title ILIKE ${search}
            ORDER BY created_at DESC
          `;
        } else if (status && status !== 'all') {
          rows = await sql`
            SELECT * FROM events
            WHERE status = ${status}
            ORDER BY created_at DESC
          `;
        } else {
          rows = await sql`
            SELECT * FROM events
            ORDER BY created_at DESC
          `;
        }
        return res.status(200).json(rows.map(formatEvent));
      }

      if (type === 'posts') {
        let rows;
        if (q && status && status !== 'all') {
          const search = `%${q.trim()}%`;
          rows = await sql`
            SELECT * FROM blog_posts
            WHERE status = ${status} AND title ILIKE ${search}
            ORDER BY publish_date DESC NULLS LAST, created_at DESC
          `;
        } else if (q) {
          const search = `%${q.trim()}%`;
          rows = await sql`
            SELECT * FROM blog_posts
            WHERE title ILIKE ${search}
            ORDER BY publish_date DESC NULLS LAST, created_at DESC
          `;
        } else if (status && status !== 'all') {
          rows = await sql`
            SELECT * FROM blog_posts
            WHERE status = ${status}
            ORDER BY publish_date DESC NULLS LAST, created_at DESC
          `;
        } else {
          rows = await sql`
            SELECT * FROM blog_posts
            ORDER BY publish_date DESC NULLS LAST, created_at DESC
          `;
        }
        return res.status(200).json(rows.map(formatPost));
      }

      if (type === 'event') {
        if (!id) return res.status(400).json({ ok: false, error: 'missing_id' });
        const rows = await sql`SELECT * FROM events WHERE id = ${id} LIMIT 1`;
        if (!rows || rows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        return res.status(200).json(formatEvent(rows[0]));
      }

      if (type === 'post') {
        if (!id) return res.status(400).json({ ok: false, error: 'missing_id' });
        const rows = await sql`SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1`;
        if (!rows || rows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        return res.status(200).json(formatPost(rows[0]));
      }

      if (type === 'event-registrations') {
        if (!slug) return res.status(400).json({ ok: false, error: 'missing_slug' });
        const countRows = await sql`
          SELECT count(*)::int as count
          FROM leads
          WHERE form_type = 'event' AND details->>'eventSlug' = ${slug.trim()}
        `;
        return res.status(200).json({ ok: true, count: countRows[0]?.count || 0 });
      }

      return res.status(400).json({ ok: false, error: 'invalid_type' });
    }

    // --- POST handlers ---
    if (req.method === 'POST') {
      if (type === 'event') {
        const { ok, data, fields } = validateEvent(body);
        if (!ok) {
          return res.status(400).json({ ok: false, error: 'validation', fields });
        }

        const existing = await sql`SELECT id FROM events WHERE slug = ${data.slug} LIMIT 1`;
        if (existing.length > 0) {
          return res.status(409).json({ ok: false, error: 'slug_taken' });
        }

        const publishedAt = data.status === 'published' ? sql`now()` : null;

        const rows = await sql`
          INSERT INTO events (
            slug, type, status, title, tagline, country,
            date, month, year, location, organised_by,
            highlight, condition_note, summary, body,
            closing_line, closing_italic, facts,
            image, image_thumb, poster, poster_thumb,
            poster_width, poster_height, photo,
            awarding_body, registration_open, published_at, updated_by
          ) VALUES (
            ${data.slug}, ${data.type}, ${data.status}, ${data.title}, ${data.tagline}, ${data.country},
            ${data.date}, ${data.month}, ${data.year}, ${data.location}, ${data.organised_by},
            ${data.highlight}, ${data.condition_note}, ${data.summary}, ${data.body},
            ${data.closing_line}, ${data.closing_italic}, ${JSON.stringify(data.facts)},
            ${data.image}, ${data.image_thumb}, ${data.poster}, ${data.poster_thumb},
            ${data.poster_width}, ${data.poster_height}, ${data.photo},
            ${data.awarding_body}, ${data.registration_open}, ${publishedAt}, ${admin.email}
          )
          RETURNING *
        `;

        return res.status(201).json(formatEvent(rows[0]));
      }

      if (type === 'post') {
        const { ok, data, fields } = validatePost(body);
        if (!ok) {
          return res.status(400).json({ ok: false, error: 'validation', fields });
        }

        const existing = await sql`SELECT id FROM blog_posts WHERE slug = ${data.slug} LIMIT 1`;
        if (existing.length > 0) {
          return res.status(409).json({ ok: false, error: 'slug_taken' });
        }

        if (data.featured) {
          await sql`UPDATE blog_posts SET featured = false WHERE featured = true`;
        }

        const rows = await sql`
          INSERT INTO blog_posts (
            slug, status, title, category, countries, summary, body_md,
            image, image_thumb, image_alt, author,
            featured, is_sample, publish_date, updated_by
          ) VALUES (
            ${data.slug}, ${data.status}, ${data.title}, ${data.category}, ${data.countries}::text[], ${data.summary}, ${data.body_md},
            ${data.image}, ${data.image_thumb}, ${data.image_alt}, ${data.author},
            ${data.featured}, ${data.is_sample}, ${data.publish_date}, ${admin.email}
          )
          RETURNING *
        `;

        return res.status(201).json(formatPost(rows[0]));
      }

      return res.status(400).json({ ok: false, error: 'invalid_type' });
    }

    // --- PATCH handlers ---
    if (req.method === 'PATCH') {
      const targetId = id || body.id;
      if (!targetId) {
        return res.status(400).json({ ok: false, error: 'missing_id' });
      }

      if (type === 'event') {
        const existingRows = await sql`SELECT * FROM events WHERE id = ${targetId} LIMIT 1`;
        if (!existingRows || existingRows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        const existing = existingRows[0];

        const regOpenPresent = body.registration_open !== undefined || body.registrationOpen !== undefined;
        const targetRegOpen = regOpenPresent
          ? (body.registration_open !== undefined ? body.registration_open : body.registrationOpen)
          : existing.registration_open;

        const merged = {
          type: body.type !== undefined ? body.type : existing.type,
          status: body.status !== undefined ? body.status : existing.status,
          title: body.title !== undefined ? body.title : existing.title,
          slug: body.slug !== undefined ? body.slug : existing.slug,
          tagline: body.tagline !== undefined ? body.tagline : existing.tagline,
          summary: body.summary !== undefined ? body.summary : existing.summary,
          country: body.country !== undefined ? body.country : existing.country,
          date: body.date !== undefined ? body.date : formatDbDate(existing.date),
          month: body.month !== undefined ? body.month : existing.month,
          year: body.year !== undefined ? body.year : existing.year,
          location: body.location !== undefined ? body.location : existing.location,
          organisedBy: body.organisedBy !== undefined ? body.organisedBy : (body.organised_by !== undefined ? body.organised_by : existing.organised_by),
          organised_by: body.organised_by !== undefined ? body.organised_by : (body.organisedBy !== undefined ? body.organisedBy : existing.organised_by),
          highlight: body.highlight !== undefined ? body.highlight : existing.highlight,
          conditionNote: body.conditionNote !== undefined ? body.conditionNote : (body.condition_note !== undefined ? body.condition_note : existing.condition_note),
          condition_note: body.condition_note !== undefined ? body.condition_note : (body.conditionNote !== undefined ? body.conditionNote : existing.condition_note),
          body: body.body !== undefined ? body.body : existing.body,
          closingLine: body.closingLine !== undefined ? body.closingLine : (body.closing_line !== undefined ? body.closing_line : existing.closing_line),
          closing_line: body.closing_line !== undefined ? body.closing_line : (body.closingLine !== undefined ? body.closingLine : existing.closing_line),
          closingItalic: body.closingItalic !== undefined ? body.closingItalic : (body.closing_italic !== undefined ? body.closing_italic : existing.closing_italic),
          closing_italic: body.closing_italic !== undefined ? body.closing_italic : (body.closingItalic !== undefined ? body.closingItalic : existing.closing_italic),
          facts: body.facts !== undefined ? body.facts : existing.facts,
          image: body.image !== undefined ? body.image : existing.image,
          image_thumb: body.image_thumb !== undefined ? body.image_thumb : (body.imageThumb !== undefined ? body.imageThumb : existing.image_thumb),
          imageThumb: body.image_thumb !== undefined ? body.image_thumb : (body.imageThumb !== undefined ? body.imageThumb : existing.image_thumb),
          poster: body.poster !== undefined ? body.poster : existing.poster,
          poster_thumb: body.poster_thumb !== undefined ? body.poster_thumb : (body.posterThumb !== undefined ? body.posterThumb : existing.poster_thumb),
          posterThumb: body.poster_thumb !== undefined ? body.poster_thumb : (body.posterThumb !== undefined ? body.posterThumb : existing.poster_thumb),
          poster_width: body.poster_width !== undefined ? body.poster_width : (body.posterWidth !== undefined ? body.posterWidth : existing.poster_width),
          posterWidth: body.poster_width !== undefined ? body.poster_width : (body.posterWidth !== undefined ? body.posterWidth : existing.poster_width),
          poster_height: body.poster_height !== undefined ? body.poster_height : (body.posterHeight !== undefined ? body.posterHeight : existing.poster_height),
          posterHeight: body.poster_height !== undefined ? body.poster_height : (body.posterHeight !== undefined ? body.posterHeight : existing.poster_height),
          photo: body.photo !== undefined ? body.photo : existing.photo,
          awardingBody: body.awardingBody !== undefined ? body.awardingBody : (body.awarding_body !== undefined ? body.awarding_body : existing.awarding_body),
          awarding_body: body.awarding_body !== undefined ? body.awarding_body : (body.awardingBody !== undefined ? body.awardingBody : existing.awarding_body),
          registration_open: targetRegOpen,
          registrationOpen: targetRegOpen,
        };

        const { ok, data, fields } = validateEvent(merged);
        if (!ok) {
          return res.status(400).json({ ok: false, error: 'validation', fields });
        }

        const conflict = await sql`
          SELECT id FROM events WHERE slug = ${data.slug} AND id != ${targetId} LIMIT 1
        `;
        if (conflict.length > 0) {
          return res.status(409).json({ ok: false, error: 'slug_taken' });
        }

        let publishedAt = existing.published_at;
        if (!publishedAt && data.status === 'published') {
          publishedAt = new Date();
        }

        const rows = await sql`
          UPDATE events SET
            slug = ${data.slug},
            type = ${data.type},
            status = ${data.status},
            title = ${data.title},
            tagline = ${data.tagline},
            country = ${data.country},
            date = ${data.date},
            month = ${data.month},
            year = ${data.year},
            location = ${data.location},
            organised_by = ${data.organised_by},
            highlight = ${data.highlight},
            condition_note = ${data.condition_note},
            summary = ${data.summary},
            body = ${data.body},
            closing_line = ${data.closing_line},
            closing_italic = ${data.closing_italic},
            facts = ${JSON.stringify(data.facts)},
            image = ${data.image},
            image_thumb = ${data.image_thumb},
            poster = ${data.poster},
            poster_thumb = ${data.poster_thumb},
            poster_width = ${data.poster_width},
            poster_height = ${data.poster_height},
            photo = ${data.photo},
            awarding_body = ${data.awarding_body},
            registration_open = ${data.registration_open},
            published_at = ${publishedAt},
            updated_by = ${admin.email}
          WHERE id = ${targetId}
          RETURNING *
        `;

        // Clean up replaced / removed Blob images AFTER the DB update succeeds
        const imageKeys = ['image', 'image_thumb', 'imageThumb', 'poster', 'poster_thumb', 'posterThumb', 'photo'];
        const imageProvided = imageKeys.some((k) => body[k] !== undefined);
        if (imageProvided) {
          const oldImages = [
            existing.image,
            existing.image_thumb,
            existing.poster,
            existing.poster_thumb,
            existing.photo,
          ];
          const newImages = new Set([
            data.image,
            data.image_thumb,
            data.poster,
            data.poster_thumb,
            data.photo,
          ]);
          const blobsToDelete = oldImages.filter((u) => isBlobUrl(u) && !newImages.has(u));
          await safeDeleteBlobs(blobsToDelete);
        }

        return res.status(200).json(formatEvent(rows[0]));
      }

      if (type === 'post') {
        const existingRows = await sql`SELECT * FROM blog_posts WHERE id = ${targetId} LIMIT 1`;
        if (!existingRows || existingRows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        const existing = existingRows[0];

        const featuredPresent = body.featured !== undefined;
        const targetFeatured = featuredPresent ? body.featured : existing.featured;

        const merged = {
          status: body.status !== undefined ? body.status : existing.status,
          title: body.title !== undefined ? body.title : existing.title,
          slug: body.slug !== undefined ? body.slug : existing.slug,
          category: body.category !== undefined ? body.category : existing.category,
          countries: body.countries !== undefined ? body.countries : existing.countries,
          summary: body.summary !== undefined ? body.summary : existing.summary,
          body_md: body.body_md !== undefined ? body.body_md : (body.bodyMd !== undefined ? body.bodyMd : existing.body_md),
          image: body.image !== undefined ? body.image : existing.image,
          image_thumb: body.image_thumb !== undefined ? body.image_thumb : (body.imageThumb !== undefined ? body.imageThumb : existing.image_thumb),
          imageThumb: body.image_thumb !== undefined ? body.image_thumb : (body.imageThumb !== undefined ? body.imageThumb : existing.image_thumb),
          image_alt: body.image_alt !== undefined ? body.image_alt : (body.imageAlt !== undefined ? body.imageAlt : existing.image_alt),
          imageAlt: body.image_alt !== undefined ? body.image_alt : (body.imageAlt !== undefined ? body.imageAlt : existing.image_alt),
          author: body.author !== undefined ? body.author : existing.author,
          featured: targetFeatured,
          is_sample: body.is_sample !== undefined ? body.is_sample : (body.isSample !== undefined ? body.isSample : existing.is_sample),
          publish_date:
            body.publish_date !== undefined
              ? body.publish_date
              : (body.publishDate !== undefined ? body.publishDate : formatDbDate(existing.publish_date)),
        };

        const { ok, data, fields } = validatePost(merged);
        if (!ok) {
          return res.status(400).json({ ok: false, error: 'validation', fields });
        }

        const conflict = await sql`
          SELECT id FROM blog_posts WHERE slug = ${data.slug} AND id != ${targetId} LIMIT 1
        `;
        if (conflict.length > 0) {
          return res.status(409).json({ ok: false, error: 'slug_taken' });
        }

        if (body.featured !== undefined && data.featured) {
          await sql`UPDATE blog_posts SET featured = false WHERE id != ${targetId} AND featured = true`;
        }

        let publishDate = existing.publish_date;
        if (!publishDate && data.status === 'published') {
          publishDate = data.publish_date || getTodayIST();
        } else if (body.publish_date !== undefined || body.publishDate !== undefined) {
          publishDate = data.publish_date;
        }

        const rows = await sql`
          UPDATE blog_posts SET
            slug = ${data.slug},
            status = ${data.status},
            title = ${data.title},
            category = ${data.category},
            countries = ${data.countries}::text[],
            summary = ${data.summary},
            body_md = ${data.body_md},
            image = ${data.image},
            image_thumb = ${data.image_thumb},
            image_alt = ${data.image_alt},
            author = ${data.author},
            featured = ${data.featured},
            is_sample = ${data.is_sample},
            publish_date = ${publishDate},
            updated_by = ${admin.email}
          WHERE id = ${targetId}
          RETURNING *
        `;

        // Clean up replaced / removed Blob images AFTER the DB update succeeds
        const postImageKeys = ['image', 'image_thumb', 'imageThumb'];
        const postImageProvided = postImageKeys.some((k) => body[k] !== undefined);
        if (postImageProvided) {
          const oldImages = [existing.image, existing.image_thumb];
          const newImages = new Set([data.image, data.image_thumb]);
          const blobsToDelete = oldImages.filter((u) => isBlobUrl(u) && !newImages.has(u));
          await safeDeleteBlobs(blobsToDelete);
        }

        return res.status(200).json(formatPost(rows[0]));
      }

      return res.status(400).json({ ok: false, error: 'invalid_type' });
    }

    // --- DELETE handlers ---
    if (req.method === 'DELETE') {
      const targetId = id || body.id;
      if (!targetId) {
        return res.status(400).json({ ok: false, error: 'missing_id' });
      }

      if (type === 'event') {
        const existingRows = await sql`SELECT * FROM events WHERE id = ${targetId} LIMIT 1`;
        if (!existingRows || existingRows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        const existing = existingRows[0];

        const countRows = await sql`
          SELECT count(*)::int as count
          FROM leads
          WHERE form_type = 'event' AND details->>'eventSlug' = ${existing.slug}
        `;
        const registrationCount = countRows[0]?.count || 0;

        // Collect all Blob images referenced by the row
        const blobsToDelete = [
          existing.image,
          existing.image_thumb,
          existing.poster,
          existing.poster_thumb,
          existing.photo,
        ].filter(isBlobUrl);

        // Delete from database first
        await sql`DELETE FROM events WHERE id = ${targetId}`;

        // Clean up all Blob images after DB delete succeeds (failure must not block DB delete)
        await safeDeleteBlobs(blobsToDelete);

        return res.status(200).json({ ok: true, count: registrationCount });
      }

      if (type === 'post') {
        const existingRows = await sql`SELECT * FROM blog_posts WHERE id = ${targetId} LIMIT 1`;
        if (!existingRows || existingRows.length === 0) {
          return res.status(404).json({ ok: false, error: 'not_found' });
        }
        const existing = existingRows[0];

        // Collect all Blob images referenced by the row
        const blobsToDelete = [existing.image, existing.image_thumb].filter(isBlobUrl);

        // Delete from database first
        await sql`DELETE FROM blog_posts WHERE id = ${targetId}`;

        // Clean up all Blob images after DB delete succeeds (failure must not block DB delete)
        await safeDeleteBlobs(blobsToDelete);

        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ ok: false, error: 'invalid_type' });
    }

    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('Admin content API error:', err);
    return res.status(500).json({ ok: false, error: 'server_error', message: err.message });
  }
}
