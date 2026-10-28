import { sql } from './_lib/db.js';
import { services } from '../src/data/services.js';
import { countries } from '../src/data/countries.js';
import { getVisibleUniversities } from '../src/lib/universities.js';

function ensureResHelpers(res) {
  if (!res.status) {
    res.status = function status(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.send) {
    res.send = function send(payload) {
      this.end(payload);
      return this;
    };
  }
}

export default async function handler(req, res) {
  ensureResHelpers(res);

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    res.statusCode = 405;
    return res.end('Method Not Allowed');
  }

  const BASE_URL = (
    process.env.SITE_URL || 'https://www.adaminternational.in'
  ).replace(/\/+$/, '');

  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Static Routes (excluding /admin)
    const staticRoutes = [
      { path: '/', priority: '1.0', changefreq: 'daily', lastmod: today },
      { path: '/about', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/services', priority: '0.9', changefreq: 'weekly', lastmod: today },
      { path: '/countries', priority: '0.9', changefreq: 'weekly', lastmod: today },
      { path: '/universities', priority: '0.9', changefreq: 'weekly', lastmod: today },
      { path: '/success-stories', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/gallery', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/events', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/contact', priority: '0.8', changefreq: 'weekly', lastmod: today },
      { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly', lastmod: today },
      { path: '/terms', priority: '0.5', changefreq: 'monthly', lastmod: today },
      { path: '/credits', priority: '0.5', changefreq: 'monthly', lastmod: today },
    ];

    // 2. Services routes
    const serviceRoutes = (services || [])
      .filter((s) => Boolean(s?.slug))
      .map((s) => ({
        path: `/services/${s.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: today,
      }));

    // 3. Countries routes
    const countryRoutes = (countries || [])
      .filter((c) => Boolean(c?.slug))
      .map((c) => ({
        path: `/countries/${c.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: today,
      }));

    // 4. Universities routes (visible universities)
    const visibleUniversities = getVisibleUniversities() || [];
    const showPlaceholders = process.env.VITE_SHOW_PLACEHOLDERS !== 'false';
    const universityRoutes = visibleUniversities
      .filter((u) => Boolean(u?.slug) && (u.clientListed === true || showPlaceholders))
      .map((u) => ({
        path: `/universities/${u.slug}`,
        priority: '0.8',
        changefreq: 'weekly',
        lastmod: today,
      }));

    // 5. Published Events from DB
    const eventRows = await sql`
      SELECT slug, updated_at
      FROM events
      WHERE status = 'published'
      ORDER BY created_at DESC
    `;
    const eventRoutes = (eventRows || []).map((e) => ({
      path: `/events/${e.slug}`,
      priority: '0.7',
      changefreq: 'weekly',
      lastmod: e.updated_at ? String(e.updated_at).split('T')[0] : today,
    }));

    // 6. Published Blog Posts from DB
    const postRows = await sql`
      SELECT slug, updated_at, publish_date, is_sample
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY publish_date DESC NULLS LAST, created_at DESC
    `;
    const postRoutes = (postRows || [])
      .filter((p) => !p.is_sample || showPlaceholders)
      .map((p) => ({
        path: `/blog/${p.slug}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: p.updated_at
          ? String(p.updated_at).split('T')[0]
          : p.publish_date
          ? String(p.publish_date).split('T')[0]
          : today,
      }));

    // Combine and deduplicate
    const allRoutes = [
      ...staticRoutes,
      ...serviceRoutes,
      ...countryRoutes,
      ...universityRoutes,
      ...eventRoutes,
      ...postRoutes,
    ];

    const seenPaths = new Set();
    const filteredRoutes = [];
    for (const item of allRoutes) {
      const cleanPath = item.path.trim();
      if (cleanPath.startsWith('/admin') || cleanPath === '/admin') continue;
      if (!seenPaths.has(cleanPath)) {
        seenPaths.add(cleanPath);
        filteredRoutes.push(item);
      }
    }

    const xmlEntries = filteredRoutes.map((item) => {
      const loc = item.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${item.path}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${item.lastmod || today}</lastmod>
    <changefreq>${item.changefreq || 'weekly'}</changefreq>
    <priority>${item.priority || '0.7'}</priority>
  </url>`;
    });

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>
`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.end(xmlContent);
  } catch (err) {
    console.error('Sitemap API error:', err);
    res.statusCode = 500;
    return res.end('Error generating sitemap');
  }
}
