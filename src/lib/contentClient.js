import { renderMarkdown, calculateReadingTime } from './blog.js';

export function transformPost(raw) {
  if (!raw) return null;
  const bodyMd = raw.bodyMd || raw.body_md || '';
  return {
    ...raw,
    body: bodyMd,
    bodyMd,
    body_md: bodyMd,
    readingTime: calculateReadingTime(bodyMd),
    htmlContent: renderMarkdown(bodyMd),
    isPlaceholder: Boolean(raw.isPlaceholder ?? raw.isSample ?? raw.is_sample),
    isSample: Boolean(raw.isSample ?? raw.is_sample),
  };
}

export async function fetchEvents(preview = false) {
  const url = '/api/content?type=events' + (preview ? '&preview=1' : '');
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) {
    throw new Error(`Failed to load events: ${res.status}`);
  }
  return await res.json();
}

export async function fetchEvent(slug, preview = false) {
  if (!slug) return null;
  const url =
    '/api/content?type=event&slug=' +
    encodeURIComponent(slug) +
    (preview ? '&preview=1' : '');
  const res = await fetch(url, { credentials: 'same-origin' });
  if (res.status === 404) {
    const err = new Error('not_found');
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`Failed to load event: ${res.status}`);
  }
  return await res.json();
}

export async function fetchPosts(preview = false) {
  const url = '/api/content?type=posts' + (preview ? '&preview=1' : '');
  const res = await fetch(url, { credentials: 'same-origin' });
  if (!res.ok) {
    throw new Error(`Failed to load posts: ${res.status}`);
  }
  const rawPosts = await res.json();
  return rawPosts.map(transformPost);
}

export async function fetchPost(slug, preview = false) {
  if (!slug) return null;
  const url =
    '/api/content?type=post&slug=' +
    encodeURIComponent(slug) +
    (preview ? '&preview=1' : '');
  const res = await fetch(url, { credentials: 'same-origin' });
  if (res.status === 404) {
    const err = new Error('not_found');
    err.status = 404;
    throw err;
  }
  if (!res.ok) {
    throw new Error(`Failed to load post: ${res.status}`);
  }
  const rawPost = await res.json();
  return transformPost(rawPost);
}
