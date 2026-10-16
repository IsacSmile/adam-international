import { countries } from '../../src/data/countries.js';
import { blogCategories, getCategoryBySlug, getCategoryByName } from '../../src/data/blogCategories.js';

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const countrySlugs = new Set((countries || []).map((c) => c.slug));


/**
 * Transliterates accented letters and converts text to URL-safe kebab slug
 */
export function generateSlug(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

/**
 * Validates image URL:
 * - null, undefined, empty string
 * - local path starting with /images/
 * - https URL on *.public.blob.vercel-storage.com
 */
export function isValidImageUrl(url) {
  if (url === null || url === undefined) return true;
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed === '') return true;
  if (trimmed.startsWith('/images/')) return true;

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:') return false;
    return (
      parsed.hostname === 'public.blob.vercel-storage.com' ||
      parsed.hostname.endsWith('.public.blob.vercel-storage.com')
    );
  } catch {
    return false;
  }
}

/**
 * Validates Event payload
 * Returns { ok, data, fields }
 */
export function validateEvent(input = {}) {
  const fields = {};
  const data = {};

  // type: 'spot-admission' or 'award'
  const rawType = typeof input.type === 'string' ? input.type.trim() : '';
  if (rawType !== 'spot-admission' && rawType !== 'award') {
    fields.type = "Type must be either 'spot-admission' or 'award'.";
  } else {
    data.type = rawType;
  }

  // status: 'draft' or 'published' (default: 'draft')
  const rawStatus = typeof input.status === 'string' ? input.status.trim() : 'draft';
  if (rawStatus !== 'draft' && rawStatus !== 'published') {
    fields.status = "Status must be 'draft' or 'published'.";
  } else {
    data.status = rawStatus;
  }

  // title: 3-160 chars
  const rawTitle = typeof input.title === 'string' ? input.title.trim() : '';
  if (!rawTitle || rawTitle.length < 3 || rawTitle.length > 160) {
    fields.title = 'Title must be between 3 and 160 characters.';
  } else {
    data.title = rawTitle;
  }

  // slug: pattern check, auto-generate from title if empty
  let rawSlug = typeof input.slug === 'string' ? input.slug.trim() : '';
  if (!rawSlug && rawTitle) {
    rawSlug = generateSlug(rawTitle);
  }
  if (!rawSlug || !SLUG_REGEX.test(rawSlug) || rawSlug.length > 120) {
    fields.slug = 'Slug must contain only lowercase letters, numbers, and single hyphens (max 120 chars).';
  } else {
    data.slug = rawSlug;
  }

  // summary: required, max 300 chars
  const rawSummary = typeof input.summary === 'string' ? input.summary.trim() : '';
  if (!rawSummary || rawSummary.length > 300) {
    fields.summary = 'Summary is required (max 300 characters).';
  } else {
    data.summary = rawSummary;
  }

  // country: must be a slug from countries.js or null
  const rawCountry = typeof input.country === 'string' ? input.country.trim() : null;
  if (rawCountry) {
    if (!countrySlugs.has(rawCountry)) {
      fields.country = 'Please select a valid country.';
    } else {
      data.country = rawCountry;
    }
  } else {
    data.country = null;
  }

  // date fields: at most one of date / month / year; normalize "" to null
  const rawDate = input.date !== undefined && input.date !== null ? String(input.date).trim() : null;
  const rawMonth = input.month !== undefined && input.month !== null ? String(input.month).trim() : null;
  const rawYear = input.year !== undefined && input.year !== null ? String(input.year).trim() : null;

  let cleanDate = null;
  let cleanMonth = null;
  let cleanYear = null;

  if (rawDate && rawDate.length > 0) {
    if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
      cleanDate = rawDate;
    } else {
      fields.date = 'Date must be in YYYY-MM-DD format.';
    }
  }

  if (rawMonth && rawMonth.length > 0) {
    if (/^\d{4}-\d{2}$/.test(rawMonth)) {
      cleanMonth = rawMonth;
    } else {
      fields.month = 'Month must be in YYYY-MM format.';
    }
  }

  if (rawYear && rawYear.length > 0) {
    if (/^\d{4}$/.test(rawYear)) {
      cleanYear = rawYear;
    } else {
      fields.year = 'Year must be in YYYY format.';
    }
  }

  const dateSetCount = [Boolean(cleanDate), Boolean(cleanMonth), Boolean(cleanYear)].filter(Boolean).length;
  if (dateSetCount > 1) {
    fields.date = 'At most one date field (exact date, month only, or year only) can be set.';
  } else {
    data.date = cleanDate;
    data.month = cleanMonth;
    data.year = cleanYear;
  }

  // text fields trimmed, max 300 (body max 5000)
  const trimField = (val, max = 300) => {
    if (val === null || val === undefined) return null;
    const s = String(val).trim();
    return s.length > 0 ? s.slice(0, max) : null;
  };

  data.tagline = trimField(input.tagline, 300);
  data.location = trimField(input.location, 300);
  data.organised_by = trimField(input.organisedBy ?? input.organised_by, 300);
  data.highlight = trimField(input.highlight, 300);
  data.condition_note = trimField(input.conditionNote ?? input.condition_note, 300);
  data.closing_line = trimField(input.closingLine ?? input.closing_line, 300);
  data.closing_italic = Boolean(input.closingItalic ?? input.closing_italic);

  // body: trimmed, max 5000 chars
  let rawBody = input.body;
  if (Array.isArray(rawBody)) {
    rawBody = rawBody.join('\n\n');
  }
  const cleanBody = typeof rawBody === 'string' ? rawBody.trim() : '';
  if (cleanBody.length > 5000) {
    fields.body = 'Body text must not exceed 5000 characters.';
  } else {
    data.body = cleanBody;
  }

  // facts: max 12 rows; label <= 40, value <= 200
  let rawFacts = input.facts;
  if (typeof rawFacts === 'string') {
    try {
      rawFacts = JSON.parse(rawFacts);
    } catch {
      rawFacts = [];
    }
  }
  if (!Array.isArray(rawFacts)) {
    rawFacts = [];
  }
  if (rawFacts.length > 12) {
    fields.facts = 'At most 12 facts rows allowed.';
  } else {
    const cleanFacts = [];
    for (let i = 0; i < rawFacts.length; i++) {
      const row = rawFacts[i];
      if (!row || typeof row !== 'object') continue;
      const label = typeof row.label === 'string' ? row.label.trim().slice(0, 40) : '';
      const value = typeof row.value === 'string' ? row.value.trim().slice(0, 200) : '';
      if (label || value) {
        cleanFacts.push({ label, value });
      }
    }
    data.facts = cleanFacts;
  }

  // awarding_body: allowed only when type is award
  const cleanAwardingBody = trimField(input.awardingBody ?? input.awarding_body, 300);
  if (cleanAwardingBody && data.type !== 'award') {
    fields.awarding_body = 'Awarding body is only allowed when type is award.';
  } else {
    data.awarding_body = cleanAwardingBody;
  }

  // registration_open: can only be true for spot-admission
  const rawRegInput = input.registration_open !== undefined ? input.registration_open : input.registrationOpen;
  const rawRegOpen = rawRegInput === true || rawRegInput === 'true' || rawRegInput === 'on' || rawRegInput === 1 || rawRegInput === '1';
  if (rawRegOpen && data.type !== 'spot-admission') {
    fields.registration_open = 'Registration can only be open for spot admission events.';
  } else {
    data.registration_open = rawRegOpen;
  }

  // condition_note: required when type is spot-admission and highlight is set
  if (data.type === 'spot-admission' && data.highlight && !data.condition_note) {
    fields.condition_note = 'Condition note is required when a highlight is set.';
  }

  // Image fields validation
  const imageFields = [
    ['image', input.image],
    ['image_thumb', input.image_thumb ?? input.imageThumb],
    ['poster', input.poster],
    ['poster_thumb', input.poster_thumb ?? input.posterThumb],
    ['photo', input.photo],
  ];

  for (const [key, rawVal] of imageFields) {
    const val = typeof rawVal === 'string' ? rawVal.trim() : null;
    const cleanVal = val && val.length > 0 ? val : null;
    if (cleanVal) {
      if (!isValidImageUrl(cleanVal)) {
        fields[key] = 'Image must be a local /images/ path or a valid Vercel Blob URL.';
      } else {
        data[key] = cleanVal;
      }
    } else {
      data[key] = null;
    }
  }

  data.poster_width = Number.isInteger(input.posterWidth ?? input.poster_width)
    ? input.posterWidth ?? input.poster_width
    : null;
  data.poster_height = Number.isInteger(input.posterHeight ?? input.poster_height)
    ? input.posterHeight ?? input.poster_height
    : null;

  return {
    ok: Object.keys(fields).length === 0,
    data,
    fields,
  };
}

/**
 * Validates Blog Post payload
 * Returns { ok, data, fields }
 */
export function validatePost(input = {}) {
  const fields = {};
  const data = {};

  // status: 'draft' or 'published' (default: 'draft')
  const rawStatus = typeof input.status === 'string' ? input.status.trim() : 'draft';
  if (rawStatus !== 'draft' && rawStatus !== 'published') {
    fields.status = "Status must be 'draft' or 'published'.";
  } else {
    data.status = rawStatus;
  }

  // title: 3-160 chars
  const rawTitle = typeof input.title === 'string' ? input.title.trim() : '';
  if (!rawTitle || rawTitle.length < 3 || rawTitle.length > 160) {
    fields.title = 'Title must be between 3 and 160 characters.';
  } else {
    data.title = rawTitle;
  }

  // slug: pattern check, auto-generate from title if empty
  let rawSlug = typeof input.slug === 'string' ? input.slug.trim() : '';
  if (!rawSlug && rawTitle) {
    rawSlug = generateSlug(rawTitle);
  }
  if (!rawSlug || !SLUG_REGEX.test(rawSlug) || rawSlug.length > 120) {
    fields.slug = 'Slug must contain only lowercase letters, numbers, and single hyphens (max 120 chars).';
  } else {
    data.slug = rawSlug;
  }

  // category: must be one of the blogCategories.js slugs or names
  const rawCategory = typeof input.category === 'string' ? input.category.trim() : '';
  const catObj = getCategoryBySlug(rawCategory) || getCategoryByName(rawCategory);
  if (!catObj) {
    fields.category = 'Please select a valid category from blog categories.';
  } else {
    data.category = catObj.slug;
  }

  // summary: required, max 220 chars
  const rawSummary = typeof input.summary === 'string' ? input.summary.trim() : '';
  if (!rawSummary || rawSummary.length > 220) {
    fields.summary = 'Summary is required (max 220 characters).';
  } else {
    data.summary = rawSummary;
  }

  // body_md: max 50,000 chars
  const rawBodyMd = typeof input.body_md === 'string' ? input.body_md : (typeof input.bodyMd === 'string' ? input.bodyMd : '');
  if (rawBodyMd.length > 50000) {
    fields.body_md = 'Article content must not exceed 50,000 characters.';
  } else {
    data.body_md = rawBodyMd;
  }

  // image: required to publish; same allowed values as event images
  const rawImage = typeof input.image === 'string' ? input.image.trim() : null;
  const cleanImage = rawImage && rawImage.length > 0 ? rawImage : null;
  if (cleanImage && !isValidImageUrl(cleanImage)) {
    fields.image = 'Image must be a local /images/ path or a valid Vercel Blob URL.';
  } else if (data.status === 'published' && !cleanImage) {
    fields.image = 'Featured image is required to publish a post.';
  } else {
    data.image = cleanImage;
  }

  // image_thumb: optional thumbnail
  const rawImageThumb = typeof (input.image_thumb ?? input.imageThumb) === 'string'
    ? (input.image_thumb ?? input.imageThumb).trim()
    : null;
  const cleanImageThumb = rawImageThumb && rawImageThumb.length > 0 ? rawImageThumb : null;
  if (cleanImageThumb && !isValidImageUrl(cleanImageThumb)) {
    fields.image_thumb = 'Image thumbnail must be a local /images/ path or a valid Vercel Blob URL.';
  } else {
    data.image_thumb = cleanImageThumb;
  }

  // image_alt: required when an image is set
  const rawImageAlt = typeof (input.image_alt ?? input.imageAlt) === 'string' ? (input.image_alt ?? input.imageAlt).trim() : '';
  const cleanImageAlt = rawImageAlt && rawImageAlt.length > 0 ? rawImageAlt : null;
  if (data.image && !cleanImageAlt) {
    fields.image_alt = 'Image alt text is required when an image is set.';
  } else {
    data.image_alt = cleanImageAlt;
  }

  // author: default 'Adam International Team'
  const rawAuthor = typeof input.author === 'string' ? input.author.trim() : '';
  data.author = rawAuthor || 'Adam International Team';

  // featured
  data.featured = Boolean(input.featured);

  // countries: optional; array of known country slugs from countries.js only; max 5; dedupe
  if (input.countries !== undefined) {
    if (input.countries === null) {
      data.countries = [];
    } else if (!Array.isArray(input.countries)) {
      fields.countries = 'Countries must be an array of country slugs.';
    } else {
      const deduped = [];
      const seen = new Set();
      const invalidSlugs = [];

      for (const item of input.countries) {
        if (typeof item !== 'string') {
          invalidSlugs.push(String(item));
          continue;
        }
        const s = item.trim().toLowerCase();
        if (!s) continue;
        if (!countrySlugs.has(s)) {
          invalidSlugs.push(item);
        } else if (!seen.has(s)) {
          seen.add(s);
          deduped.push(s);
        }
      }

      if (invalidSlugs.length > 0) {
        fields.countries = `Invalid country slug(s): ${invalidSlugs.join(', ')}. Must be known country slugs.`;
      } else if (deduped.length > 5) {
        fields.countries = 'At most 5 countries can be selected.';
      } else {
        data.countries = deduped;
      }
    }
  } else {
    data.countries = [];
  }

  // is_sample
  data.is_sample = Boolean(input.is_sample ?? input.isPlaceholder);


  // publish_date: defaults to today (IST) when first published
  let cleanPublishDate = null;
  const rawPubDate = input.publish_date ?? input.publishDate ?? input.date;
  if (rawPubDate !== undefined && rawPubDate !== null) {
    const s = String(rawPubDate).trim();
    if (s.length > 0) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        cleanPublishDate = s;
      } else {
        fields.publish_date = 'Publish date must be in YYYY-MM-DD format.';
      }
    }
  }
  if (!cleanPublishDate && data.status === 'published' && !fields.publish_date) {
    cleanPublishDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }
  data.publish_date = cleanPublishDate;

  return {
    ok: Object.keys(fields).length === 0,
    data,
    fields,
  };
}
