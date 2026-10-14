import { marked } from 'marked';
import { blogCategories } from '../data/blogCategories';
import { SHOW_PLACEHOLDERS } from './contentFlags';

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

// Load all markdown files in src/content/blog/*.md
const markdownFiles = import.meta.glob('/src/content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Process all raw markdown files into structured post objects
 */
function loadAllRawPosts() {
  const posts = [];

  for (const [path, rawContent] of Object.entries(markdownFiles)) {
    const { data, body } = parseFrontmatter(rawContent);

    // Fallback slug from filepath if omitted
    const fileSlug = path.split('/').pop().replace(/\.md$/, '');
    const slug = data.slug || fileSlug;

    // Validate category
    const catObj = blogCategories.find(
      (c) => c.name.toLowerCase() === data.category?.toLowerCase()
    );

    if (!catObj && import.meta.env.DEV) {
      console.warn(
        `[Blog] Unknown category "${data.category}" in post "${slug}". It will appear under "All" only.`
      );
    }

    const readingTime = calculateReadingTime(body);
    const htmlContent = marked.parse(body, { renderer });

    posts.push({
      ...data,
      slug,
      category: data.category || 'General',
      categorySlug: catObj ? catObj.slug : null,
      readingTime,
      body,
      htmlContent,
      author: data.author || 'Adam International Team',
      featured: Boolean(data.featured),
      isPlaceholder: Boolean(data.isPlaceholder),
    });
  }

  // Sort by date with newest first
  posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return posts;
}

const allRawPosts = loadAllRawPosts();

/**
 * Export getAllPosts()
 * Placeholders filtered by SHOW_PLACEHOLDERS
 */
export function getAllPosts() {
  if (SHOW_PLACEHOLDERS) {
    return allRawPosts;
  }
  return allRawPosts.filter((post) => !post.isPlaceholder);
}

/**
 * Export getPostBySlug(slug)
 * Respects SHOW_PLACEHOLDERS
 */
export function getPostBySlug(slug) {
  if (!slug) return null;
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

/**
 * Export getPostsByCategory(categorySlugOrName)
 * Respects SHOW_PLACEHOLDERS
 */
export function getPostsByCategory(category) {
  if (!category || category === 'All' || category === 'all') {
    return getAllPosts();
  }
  const posts = getAllPosts();
  return posts.filter(
    (p) =>
      p.categorySlug === category ||
      p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Helper to check whether there are any visible posts
 */
export function hasVisibleBlogPosts() {
  return getAllPosts().length > 0;
}

/**
 * Formats date like '14 Oct 2026'
 */
export function formatBlogDate(dateStr) {
  if (!dateStr) return '';
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length === 3) {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const day = parseInt(parts[2], 10);
    const month = months[parseInt(parts[1], 10) - 1];
    const year = parts[0];
    if (day && month && year) {
      return `${day} ${month} ${year}`;
    }
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? dateStr
    : date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
}
