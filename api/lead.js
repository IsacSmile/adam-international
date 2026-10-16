import { sql } from './_lib/db.js';
import {
  sanitizeCountry,
  sanitizeService,
  sanitizeBranch,
  sanitizeUniversity,
} from './_lib/allowed.js';
import { validateLeadPayload, FORM_TYPES } from '../src/data/formFields.js';
import { getEventStatus, isRegistrationOpen } from '../src/lib/events.js';

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

  // Method check: POST only
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  // Parse body safely
  let data = {};
  if (typeof req.body === 'string') {
    const trimmed = req.body.trim();
    if (trimmed) {
      try {
        data = JSON.parse(trimmed);
      } catch {
        return res.status(400).json({
          ok: false,
          error: 'validation',
          fields: { _general: 'Invalid JSON request body' },
        });
      }
    }
  } else if (req.body && typeof req.body === 'object') {
    data = req.body;
  }
  if (!data || typeof data !== 'object') {
    data = {};
  }

  // Honeypot: company_website. If filled, return 200 immediately without saving
  if (data.company_website && String(data.company_website).trim() !== '') {
    return res.status(200).json({ ok: true });
  }

  // Server-side validation
  const fields = {};

  // Form type: default 'appointment', reject unknown
  const rawFormType = data.formType || data.form_type || 'appointment';
  if (!FORM_TYPES.includes(rawFormType)) {
    return res.status(400).json({
      ok: false,
      error: 'validation',
      fields: { formType: `Unknown form type: ${rawFormType}` },
    });
  }

  // Validate details and message according to formType
  const payloadValidation = validateLeadPayload(rawFormType, data.details, data.message);
  if (!payloadValidation.ok) {
    return res.status(400).json({
      ok: false,
      error: 'validation',
      fields: payloadValidation.fields,
    });
  }

  // name: required, trimmed, 2-100 characters
  const rawName = data.name !== undefined ? data.name : data.fullName;
  const trimmedName = typeof rawName === 'string' ? rawName.trim() : '';
  if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
    fields.name = 'Please enter your name.';
  }

  // email: required, basic regex, max 254 characters, lowercased
  const rawEmail = typeof data.email === 'string' ? data.email.trim() : '';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!rawEmail || rawEmail.length > 254 || !emailRegex.test(rawEmail)) {
    fields.email = 'Please enter a valid email address.';
  }
  const lowercasedEmail = rawEmail.toLowerCase();

  // phone: required. Strip spaces and dashes, match ^(\+91)?[6-9]\d{9}$, normalise to +91XXXXXXXXXX
  const rawPhone = typeof data.phone === 'string' ? data.phone.trim() : '';
  const strippedPhone = rawPhone.replace(/[\s\-]/g, '');
  const phoneMatch = strippedPhone.match(/^(\+91)?([6-9]\d{9})$/);
  if (!phoneMatch) {
    fields.phone = 'Please enter a valid 10-digit Indian mobile number.';
  }
  const normalizedPhone = phoneMatch ? `+91${phoneMatch[2]}` : null;

  // consent: must be true
  if (data.consent !== true) {
    fields.consent = 'Please tick the box so we can contact you.';
  }

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({
      ok: false,
      error: 'validation',
      fields,
    });
  }

  try {
    // Client IP for rate limiting
    const forwarded = req.headers?.['x-forwarded-for'];
    const clientIp = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : null)
      || req.socket?.remoteAddress
      || req.connection?.remoteAddress
      || '127.0.0.1';

    // Rate limit: more than 5 leads from the same IP in an hour returns 429
    const [rateCheck] = await sql`
      SELECT count(*)::int AS count
      FROM lead_ip_log
      WHERE ip = ${clientIp}
        AND created_at > now() - interval '1 hour'
    `;

    if (rateCheck && rateCheck.count >= 5) {
      return res.status(429).json({ ok: false, error: 'rate_limited' });
    }

    const { formType, cleanDetails, cleanMessage } = payloadValidation;

    // 3.5 Event registration validation: check events table
    if (formType === 'event') {
      const eventSlug = cleanDetails?.eventSlug;
      if (!eventSlug) {
        return res.status(400).json({
          ok: false,
          error: 'validation',
          fields: { eventSlug: 'Please select an event.' },
        });
      }

      const eventRows = await sql`
        SELECT slug, type, status, registration_open, date, month, year
        FROM events
        WHERE slug = ${eventSlug}
        LIMIT 1
      `;

      if (!eventRows || eventRows.length === 0) {
        return res.status(400).json({
          ok: false,
          error: 'validation',
          fields: { eventSlug: 'Unknown event selected.' },
        });
      }

      const eventRow = eventRows[0];
      if (!isRegistrationOpen(eventRow)) {
        return res.status(400).json({
          ok: false,
          error: 'validation',
          fields: { eventSlug: 'Registrations are not open for this event.' },
        });
      }
    }

    // Duplicate guard: same phone + form_type submitted within last 10 minutes
    const [recentLead] = await sql`
      SELECT id FROM leads
      WHERE phone = ${normalizedPhone}
        AND form_type = ${formType}
        AND created_at > now() - interval '10 minutes'
      LIMIT 1
    `;

    if (recentLead) {
      return res.status(200).json({ ok: true, duplicate: true });
    }

    // Optional sanitized fields
    const rawCountry = data.country || cleanDetails?.country;
    const cleanCountry = sanitizeCountry(rawCountry);
    const cleanService = sanitizeService(data.service);
    const cleanBranch = sanitizeBranch(data.branch);
    const cleanUniversity = sanitizeUniversity(data.university);
    const cleanSourcePage = typeof data.source_page === 'string' && data.source_page.trim()
      ? data.source_page.trim().slice(0, 200)
      : null;
    const consentText = typeof data.consent_text === 'string' && data.consent_text.trim()
      ? data.consent_text.trim()
      : "I agree to Adam International contacting me by phone, email or WhatsApp about my enquiry, and I've read the Privacy Policy.";

    const whatsappVal = typeof data.whatsapp === 'boolean'
      ? data.whatsapp
      : (data.whatsapp === 'true' ? true : (data.whatsapp === 'false' ? false : null));

    // Insert lead into database
    await sql`
      INSERT INTO leads (
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
        form_type,
        details,
        message,
        whatsapp
      ) VALUES (
        ${trimmedName},
        ${lowercasedEmail},
        ${normalizedPhone},
        ${cleanCountry},
        ${cleanService},
        ${cleanUniversity},
        ${cleanBranch},
        ${cleanSourcePage},
        true,
        ${consentText},
        'new',
        ${formType},
        ${JSON.stringify(cleanDetails || {})}::jsonb,
        ${cleanMessage},
        ${whatsappVal}
      )
    `;

    // Record submission IP
    await sql`
      INSERT INTO lead_ip_log (ip)
      VALUES (${clientIp})
    `;

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Lead submission error:', err);
    return res.status(500).json({ ok: false, error: 'server' });
  }
}
