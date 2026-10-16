import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { services } from '../src/data/services.js';
import { countries } from '../src/data/countries.js';
import { getVisibleUniversities } from '../src/lib/universities.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL: process.env.SITE_URL or default
const BASE_URL = (
  process.env.SITE_URL || 'https://adam-international-beryl.vercel.app'
).replace(/\/+$/, '');

const today = new Date().toISOString().split('T')[0];

async function generateSitemap() {
  console.log('--- Generating Sitemap ---');
  console.log(`Base URL: ${BASE_URL}`);

  // 1. Static Routes (Exclude /admin)
  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/about', priority: '0.8', changefreq: 'weekly' },
    { path: '/services', priority: '0.9', changefreq: 'weekly' },
    { path: '/countries', priority: '0.9', changefreq: 'weekly' },
    { path: '/universities', priority: '0.9', changefreq: 'weekly' },
    { path: '/success-stories', priority: '0.8', changefreq: 'weekly' },
    { path: '/gallery', priority: '0.8', changefreq: 'weekly' },
    { path: '/events', priority: '0.8', changefreq: 'weekly' },
    { path: '/blog', priority: '0.8', changefreq: 'weekly' },
    { path: '/contact', priority: '0.8', changefreq: 'weekly' },
    { path: '/privacy-policy', priority: '0.5', changefreq: 'monthly' },
    { path: '/terms', priority: '0.5', changefreq: 'monthly' },
    { path: '/credits', priority: '0.5', changefreq: 'monthly' },
  ];

  // 2. Services routes
  const serviceRoutes = (services || [])
    .filter((s) => Boolean(s?.slug))
    .map((s) => ({
      path: `/services/${s.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

  // 3. Countries routes
  const countryRoutes = (countries || [])
    .filter((c) => Boolean(c?.slug))
    .map((c) => ({
      path: `/countries/${c.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

  // 4. Universities routes (all visible universities)
  const visibleUniversities = getVisibleUniversities() || [];
  const universityRoutes = visibleUniversities
    .filter((u) => Boolean(u?.slug))
    .map((u) => ({
      path: `/universities/${u.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
    }));

  // 5. Events routes (if any event data exists)
  let eventRoutes = [];
  const eventsDataPath = path.join(__dirname, '../src/data/events.js');
  if (fs.existsSync(eventsDataPath)) {
    try {
      const eventsModule = await import('../src/data/events.js');
      const eventsList = eventsModule.events || eventsModule.default || [];
      eventRoutes = eventsList
        .filter((e) => Boolean(e?.slug))
        .map((e) => ({
          path: `/events/${e.slug}`,
          priority: '0.7',
          changefreq: 'weekly',
        }));
    } catch (err) {
      console.warn('⚠️ Warning: Failed to load events data:', err.message);
    }
  }

  // 6. Blog posts (read from src/content/blog/*.md)
  const blogDir = path.join(__dirname, '../src/content/blog');
  let blogRoutes = [];
  if (fs.existsSync(blogDir)) {
    const blogFiles = fs
      .readdirSync(blogDir)
      .filter((file) => file.endsWith('.md'));

    blogRoutes = blogFiles.map((file) => {
      const filePath = path.join(blogDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const slugMatch = content.match(/^slug:\s*([^\r\n]+)/m);
      const dateMatch = content.match(/^date:\s*([^\r\n]+)/m);
      const updatedMatch = content.match(/^updated:\s*([^\r\n]+)/m);

      const slug = slugMatch
        ? slugMatch[1].trim()
        : file.replace(/\.md$/, '');
      const lastmod = updatedMatch
        ? updatedMatch[1].trim()
        : dateMatch
          ? dateMatch[1].trim()
          : today;

      return {
        path: `/blog/${slug}`,
        lastmod,
        priority: '0.7',
        changefreq: 'weekly',
      };
    });
  }

  // Combine and deduplicate
  const allRoutes = [
    ...staticRoutes,
    ...serviceRoutes,
    ...countryRoutes,
    ...universityRoutes,
    ...eventRoutes,
    ...blogRoutes,
  ];

  // Exclude /admin, ensure uniqueness
  const seenPaths = new Set();
  const filteredRoutes = [];

  for (const item of allRoutes) {
    const cleanPath = item.path.trim();
    if (cleanPath.startsWith('/admin') || cleanPath === '/admin') {
      continue;
    }
    if (!seenPaths.has(cleanPath)) {
      seenPaths.add(cleanPath);
      filteredRoutes.push({
        path: cleanPath,
        lastmod: item.lastmod || today,
        priority: item.priority || '0.7',
        changefreq: item.changefreq || 'weekly',
      });
    }
  }

  // Build XML
  const xmlEntries = filteredRoutes.map((item) => {
    const loc = item.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${item.path}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>
`;

  // Write to public/sitemap.xml
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicSitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(publicSitemapPath, xmlContent, 'utf-8');
  console.log(`✓ Wrote ${filteredRoutes.length} URLs to public/sitemap.xml`);

  // Breakdown summary
  console.log('\n--- Sitemap Route Breakdown ---');
  console.log(`• Static pages:       ${staticRoutes.length}`);
  console.log(`• Services:           ${serviceRoutes.length}`);
  console.log(`• Countries:          ${countryRoutes.length}`);
  console.log(`• Universities:       ${universityRoutes.length} (visible, includes sample/clientListed:false)`);
  console.log(`• Blog articles:      ${blogRoutes.length}`);
  console.log(`• Events:             ${eventRoutes.length}`);
  console.log(`--------------------------------`);
  console.log(`Total URLs indexed:   ${filteredRoutes.length}`);
  console.log('--------------------------------\n');
}

generateSitemap().catch((err) => {
  console.error('❌ Error generating sitemap:', err);
  process.exit(1);
});
