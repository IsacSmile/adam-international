import { sql } from '../_lib/db.js';
import { requireAdmin } from '../_lib/session.js';
import { verifyOrigin } from '../_lib/origin.js';
import { FIELD_LABELS, FORM_TYPE_LABELS, FORM_TYPES } from '../../src/data/formFields.js';

const VALID_STATUSES = ['new', 'contacted', 'follow_up', 'converted', 'not_interested'];

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

/**
 * Formats a Date object or ISO string in Asia/Kolkata (IST) timezone.
 * Format: 14 Oct 2026, 10:56
 */
function formatISTDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Returns current date in IST formatted as YYYY-MM-DD for file attachment naming.
 */
function getISTDateString() {
  const d = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(d);
}

/**
 * Fetches title for event slugs from Neon events table.
 */
async function getEventTitleMap(leadsList = []) {
  const slugs = new Set();
  for (const l of leadsList) {
    let details = l.details;
    if (typeof details === 'string') {
      try {
        details = JSON.parse(details);
      } catch {}
    }
    if (details && typeof details === 'object' && details.eventSlug) {
      slugs.add(details.eventSlug);
    }
  }

  if (slugs.size === 0) return {};

  const slugArray = Array.from(slugs);
  const rows = await sql`
    SELECT slug, title FROM events WHERE slug = ANY(${slugArray})
  `;

  const map = {};
  for (const r of rows) {
    map[r.slug] = r.title;
  }
  return map;
}

/**
 * Formats details JSON into 'Label: value; Label: value' for CSV export.
 */
function formatDetailsForCsv(details, eventTitleMap = {}) {
  if (!details) return '';
  let obj = details;
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj);
    } catch {
      return obj;
    }
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) return '';
  const pairs = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined && String(v).trim() !== '') {
      const label = FIELD_LABELS[k] || k;
      let displayVal = v;
      if (k === 'eventSlug') {
        displayVal = eventTitleMap[v] || `${v} (deleted)`;
      }
      pairs.push(`${label}: ${displayVal}`);
    }
  }
  return pairs.join('; ');
}

/**
 * Neutralizes Excel spreadsheet formula injection and escapes CSV quotes.
 * Phone is excluded from formula prefixing as it is server-normalized (+91 followed by digits).
 */
function sanitizeCsvCell(val, isPhone = false) {
  if (val === null || val === undefined) return '';
  let str = String(val);
  // Neutralize formula injection for all columns except phone
  if (!isPhone && /^[=+\-@]/.test(str)) {
    str = "'" + str;
  }
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export default async function handler(req, res) {
  ensureResHelpers(res);

  // Require admin session for every request
  const admin = await requireAdmin(req, res);
  if (!admin) {
    return; // requireAdmin sends 401
  }

  const url = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(url.searchParams.entries());
  // Merge req.query if present in Vercel environment
  if (req.query) {
    Object.assign(query, req.query);
  }

  try {
    // -------------------------------------------------------------------------
    // GET: List or CSV export
    // -------------------------------------------------------------------------
    if (req.method === 'GET') {
      const isCsv = query.export === 'csv';

      const q = query.q ? query.q.trim() : '';
      const searchPattern = q ? `%${q}%` : null;

      const rawStatus = query.status ? query.status.trim() : '';
      const status = VALID_STATUSES.includes(rawStatus) ? rawStatus : null;

      const rawFormType = query.form_type || query.formType || '';
      const formType = FORM_TYPES.includes(rawFormType.trim()) ? rawFormType.trim() : null;

      const country = query.country && query.country.trim() && query.country !== 'all'
        ? query.country.trim()
        : null;

      const service = query.service && query.service.trim() && query.service !== 'all'
        ? query.service.trim()
        : null;

      const branch = query.branch && query.branch.trim() && query.branch !== 'all'
        ? query.branch.trim()
        : null;

      const rawRange = query.range ? query.range.trim().toLowerCase() : 'all';
      const range = ['today', '7d', '30d'].includes(rawRange) ? rawRange : 'all';

      // 1. If CSV Export: Fetch all matching leads without pagination
      if (isCsv) {
        const leads = await sql`
          SELECT *
          FROM leads
          WHERE
            (${searchPattern}::text IS NULL OR name ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR phone ILIKE ${searchPattern})
            AND (${status}::text IS NULL OR status = ${status}::lead_status)
            AND (${formType}::text IS NULL OR form_type = ${formType})
            AND (${country}::text IS NULL OR country = ${country})
            AND (${service}::text IS NULL OR service = ${service})
            AND (${branch}::text IS NULL OR branch = ${branch})
            AND (
              ${range}::text = 'all'
              OR (${range}::text = 'today' AND created_at >= (now() at time zone 'Asia/Kolkata')::date at time zone 'Asia/Kolkata')
              OR (${range}::text = '7d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '7 days') at time zone 'Asia/Kolkata')
              OR (${range}::text = '30d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '30 days') at time zone 'Asia/Kolkata')
            )
          ORDER BY created_at DESC
        `;

        const csvHeader = [
          'ID',
          'Date (IST)',
          'Form Type',
          'Name',
          'Email',
          'Phone',
          'WhatsApp',
          'Country',
          'Service',
          'Branch',
          'University',
          'Source Page',
          'Message',
          'Details',
          'Status',
          'Notes',
          'Assigned To',
        ].join(',');

        const eventTitleMap = await getEventTitleMap(leads);

        const csvRows = leads.map((l) =>
          [
            sanitizeCsvCell(l.id),
            sanitizeCsvCell(formatISTDate(l.created_at)),
            sanitizeCsvCell(FORM_TYPE_LABELS[l.form_type] || l.form_type || ''),
            sanitizeCsvCell(l.name),
            sanitizeCsvCell(l.email),
            sanitizeCsvCell(l.phone, true),
            sanitizeCsvCell(l.whatsapp === true ? 'Yes' : (l.whatsapp === false ? 'No' : '')),
            sanitizeCsvCell(l.country),
            sanitizeCsvCell(l.service),
            sanitizeCsvCell(l.branch),
            sanitizeCsvCell(l.university),
            sanitizeCsvCell(l.source_page),
            sanitizeCsvCell(l.message),
            sanitizeCsvCell(formatDetailsForCsv(l.details, eventTitleMap)),
            sanitizeCsvCell(l.status),
            sanitizeCsvCell(l.notes),
            sanitizeCsvCell(l.assigned_to),
          ].join(',')
        );

        const csvContent = '\uFEFF' + [csvHeader, ...csvRows].join('\r\n');
        const filename = `adam-leads-${getISTDateString()}.csv`;

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.end(csvContent);
      }

      // 2. Paginated List Query
      const page = Math.max(1, parseInt(query.page, 10) || 1);
      const pageSize = 25;
      const offset = (page - 1) * pageSize;

      // Status counts apply the same filters except status
      const [countsRow] = await sql`
        SELECT
          COUNT(*)::int AS all,
          COUNT(*) FILTER (WHERE status = 'new')::int AS new,
          COUNT(*) FILTER (WHERE status = 'contacted')::int AS contacted,
          COUNT(*) FILTER (WHERE status = 'follow_up')::int AS follow_up,
          COUNT(*) FILTER (WHERE status = 'converted')::int AS converted,
          COUNT(*) FILTER (WHERE status = 'not_interested')::int AS not_interested
        FROM leads
        WHERE
          (${searchPattern}::text IS NULL OR name ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR phone ILIKE ${searchPattern})
          AND (${formType}::text IS NULL OR form_type = ${formType})
          AND (${country}::text IS NULL OR country = ${country})
          AND (${service}::text IS NULL OR service = ${service})
          AND (${branch}::text IS NULL OR branch = ${branch})
          AND (
            ${range}::text = 'all'
            OR (${range}::text = 'today' AND created_at >= (now() at time zone 'Asia/Kolkata')::date at time zone 'Asia/Kolkata')
            OR (${range}::text = '7d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '7 days') at time zone 'Asia/Kolkata')
            OR (${range}::text = '30d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '30 days') at time zone 'Asia/Kolkata')
          )
      `;

      const counts = {
        all: countsRow?.all || 0,
        new: countsRow?.new || 0,
        contacted: countsRow?.contacted || 0,
        follow_up: countsRow?.follow_up || 0,
        converted: countsRow?.converted || 0,
        not_interested: countsRow?.not_interested || 0,
      };

      const total = status ? counts[status] || 0 : counts.all;

      const leads = await sql`
        SELECT
          id,
          created_at,
          updated_at,
          name,
          email,
          phone,
          country,
          service,
          university,
          branch,
          source_page,
          consent,
          consent_text,
          status,
          notes,
          assigned_to,
          form_type,
          details,
          message,
          whatsapp
        FROM leads
        WHERE
          (${searchPattern}::text IS NULL OR name ILIKE ${searchPattern} OR email ILIKE ${searchPattern} OR phone ILIKE ${searchPattern})
          AND (${status}::text IS NULL OR status = ${status}::lead_status)
          AND (${formType}::text IS NULL OR form_type = ${formType})
          AND (${country}::text IS NULL OR country = ${country})
          AND (${service}::text IS NULL OR service = ${service})
          AND (${branch}::text IS NULL OR branch = ${branch})
          AND (
            ${range}::text = 'all'
            OR (${range}::text = 'today' AND created_at >= (now() at time zone 'Asia/Kolkata')::date at time zone 'Asia/Kolkata')
            OR (${range}::text = '7d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '7 days') at time zone 'Asia/Kolkata')
            OR (${range}::text = '30d' AND created_at >= (now() at time zone 'Asia/Kolkata' - interval '30 days') at time zone 'Asia/Kolkata')
          )
        ORDER BY created_at DESC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      const eventTitleMap = await getEventTitleMap(leads);
      const augmentedLeads = leads.map((l) => {
        let details = l.details;
        if (typeof details === 'string') {
          try {
            details = JSON.parse(details);
          } catch {}
        }
        if (details && typeof details === 'object' && details.eventSlug) {
          const resolvedTitle = eventTitleMap[details.eventSlug] || `${details.eventSlug} (deleted)`;
          return {
            ...l,
            eventTitle: resolvedTitle,
            event_title: resolvedTitle,
            details: {
              ...details,
              eventTitle: resolvedTitle,
            },
          };
        }
        return l;
      });

      return res.status(200).json({
        leads: augmentedLeads,
        total,
        page,
        pageSize,
        counts,
      });
    }

    // -------------------------------------------------------------------------
    // PATCH ?id=: Update lead status, notes, assigned_to
    // -------------------------------------------------------------------------
    if (req.method === 'PATCH') {
      if (!verifyOrigin(req, res)) {
        return; // verifyOrigin sends 403
      }

      const id = query.id;
      if (!id) {
        return res.status(400).json({ ok: false, error: 'Missing lead ID' });
      }

      let body = {};
      if (typeof req.body === 'string') {
        const trimmed = req.body.trim();
        if (trimmed) {
          try {
            body = JSON.parse(trimmed);
          } catch {
            return res.status(400).json({ ok: false, error: 'Invalid JSON request body' });
          }
        }
      } else if (req.body && typeof req.body === 'object') {
        body = req.body;
      }
      if (!body || typeof body !== 'object') {
        body = {};
      }

      const hasStatus = body.status !== undefined;
      let statusToSet = null;
      if (hasStatus) {
        if (!VALID_STATUSES.includes(body.status)) {
          return res.status(400).json({ ok: false, error: 'Invalid status value' });
        }
        statusToSet = body.status;
      }

      const hasNotes = body.notes !== undefined;
      const notesToSet = hasNotes
        ? (body.notes !== null ? String(body.notes).slice(0, 5000) : null)
        : null;

      const hasAssignedTo = body.assigned_to !== undefined;
      const assignedToSet = hasAssignedTo
        ? (body.assigned_to !== null ? String(body.assigned_to).slice(0, 100) : null)
        : null;

      const [updated] = await sql`
        UPDATE leads
        SET
          status = CASE WHEN ${hasStatus} THEN ${statusToSet}::lead_status ELSE status END,
          notes = CASE WHEN ${hasNotes} THEN ${notesToSet} ELSE notes END,
          assigned_to = CASE WHEN ${hasAssignedTo} THEN ${assignedToSet} ELSE assigned_to END
        WHERE id = ${id}
        RETURNING *
      `;

      if (!updated) {
        return res.status(404).json({ ok: false, error: 'Lead not found' });
      }

      return res.status(200).json({ ok: true, lead: updated });
    }

    // -------------------------------------------------------------------------
    // DELETE ?id=: Delete lead
    // -------------------------------------------------------------------------
    if (req.method === 'DELETE') {
      if (!verifyOrigin(req, res)) {
        return; // verifyOrigin sends 403
      }

      const id = query.id;
      if (!id) {
        return res.status(400).json({ ok: false, error: 'Missing lead ID' });
      }

      await sql`
        DELETE FROM leads
        WHERE id = ${id}
      `;

      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  } catch (err) {
    console.error('Admin leads endpoint error:', err);
    return res.status(500).json({ ok: false, error: 'server' });
  }
}
