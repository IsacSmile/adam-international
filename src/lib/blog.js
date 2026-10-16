import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { blogCategories } from '../data/blogCategories.js';
import { SHOW_PLACEHOLDERS } from './contentFlags.js';

// Configure custom marked renderer for external links
const renderer = new marked.Renderer();
renderer.link = function (arg1, arg2, arg3) {
  let href, title, text;
  if (typeof arg1 === 'object' && arg1 !== null) {
    href = arg1.href;
    title = arg1.title;
    text = this.parser ? this.parser.parseInline(arg1.tokens) : arg1.text;
  } else {
    href = arg1;
    title = arg2;
    text = arg3;
  }
  const isExternal =
    typeof href === 'string' &&
    (href.startsWith('http://') || href.startsWith('https://'));
  const targetAttr = isExternal
    ? ' target="_blank" rel="noopener noreferrer"'
    : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href || '#'}"${titleAttr}${targetAttr}>${text || ''}</a>`;
};

/**
 * Parses markdown into HTML and sanitizes it with DOMPurify
 */
export function renderMarkdown(markdown = '') {
  if (!markdown || typeof markdown !== 'string') return '';
  const rawHtml = marked.parse(markdown, { renderer });

  if (typeof window !== 'undefined') {
    const purify = typeof DOMPurify?.sanitize === 'function' ? DOMPurify : DOMPurify(window);
    return purify.sanitize(rawHtml, {
      ADD_ATTR: ['target', 'rel'],
    });
  }

  // Server/test fallback when window is not defined
  return rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(["'][^"']*["']|[^\s>]+)/gi, '');
}

/**
 * Simple Frontmatter Parser (YAML-like key: value lines)
 */
export function parseFrontmatter(fileContent) {
  if (typeof fileContent !== 'string') {
    return { data: {}, body: '' };
  }

  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: fileContent };
  }

  const rawYaml = match[1];
  const body = match[2];
  const data = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value = trimmed.slice(colonIdx + 1).trim();

    // Parse array: [a, b, c]
    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      data[key] = inner
        ? inner.split(',').map((item) => {
            let s = item.trim();
            if (
              (s.startsWith("'") && s.endsWith("'")) ||
              (s.startsWith('"') && s.endsWith('"'))
            ) {
              s = s.slice(1, -1);
            }
            return s;
          })
        : [];
      continue;
    }

    // Parse booleans
    if (value.toLowerCase() === 'true') {
      data[key] = true;
      continue;
    }
    if (value.toLowerCase() === 'false') {
      data[key] = false;
      continue;
    }

    // Parse numbers
    if (/^-?\d+(\.\d+)?$/.test(value)) {
      data[key] = Number(value);
      continue;
    }

    // Strip surrounding quotes
    if (
      (value.startsWith("'") && value.endsWith("'")) ||
      (value.startsWith('"') && value.endsWith('"'))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  }

  return { data, body };
}

/**
 * Calculates estimated reading time at ~200 words per minute
 */
export function calculateReadingTime(bodyText = '') {
  const plainText = bodyText
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~\[\]()>-]/g, ' ');
  const words = plainText.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Formats date like '14 Oct 2026'
 */
export function formatBlogDate(dateStr) {
  if (!dateStr) return '';
  const str =
    dateStr instanceof Date
      ? new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(dateStr)
      : String(dateStr).trim();

  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const day = parseInt(match[3], 10);
    const month = months[parseInt(match[2], 10) - 1];
    const year = match[1];
    if (day && month && year) {
      return `${day} ${month} ${year}`;
    }
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? str
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'Asia/Kolkata',
      });
}

