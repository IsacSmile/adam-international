import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sql } from '../api/_lib/db.js';
import { getCategoryByName } from '../src/data/blogCategories.js';
import { parseFrontmatter } from '../src/lib/blog.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function seedContent() {
  console.log('--- Seeding Events and Blog Posts into Neon DB ---');

  // 1. Resolve events file path (supports both pre-move and post-move)
  const seedEventsPath = path.join(rootDir, 'db/seed/events.js');
  const srcEventsPath = path.join(rootDir, 'src/data/events.js');
  const eventsFilePath = fs.existsSync(seedEventsPath) ? seedEventsPath : srcEventsPath;

  if (!fs.existsSync(eventsFilePath)) {
    throw new Error(`Events file not found at ${eventsFilePath}`);
  }

  console.log(`Loading events from: ${eventsFilePath}`);
  const eventsModule = await import(`file://${eventsFilePath}`);
  const eventsList = eventsModule.events || [];

  let eventsInserted = 0;
  for (const e of eventsList) {
    const bodyStr = Array.isArray(e.body) ? e.body.join('\n\n') : (e.body || '');
    const factsJson = JSON.stringify(e.facts || []);

    // At most one of date / month / year
    let dateVal = null;
    let monthVal = null;
    let yearVal = null;
    if (e.date) {
      dateVal = e.date;
    } else if (e.month) {
      monthVal = e.month;
    } else if (e.year) {
      yearVal = String(e.year);
    }

    const res = await sql`
      INSERT INTO events (
        slug,
        type,
        status,
        title,
        tagline,
        country,
        date,
        month,
        year,
        location,
        organised_by,
        highlight,
        condition_note,
        summary,
        body,
        closing_line,
        closing_italic,
        facts,
        image,
        poster,
        poster_width,
        poster_height,
        photo,
        awarding_body,
        registration_open,
        published_at
      ) VALUES (
        ${e.slug},
        ${e.type},
        'published',
        ${e.title},
        ${e.tagline || null},
        ${e.country || null},
        ${dateVal},
        ${monthVal},
        ${yearVal},
        ${e.location || null},
        ${e.organisedBy || null},
        ${e.highlight || null},
        ${e.conditionNote || null},
        ${e.summary},
        ${bodyStr},
        ${e.closingLine || null},
        ${e.closingItalic || false},
        ${factsJson}::jsonb,
        ${e.image || null},
        ${e.poster || null},
        ${e.posterWidth || null},
        ${e.posterHeight || null},
        ${e.photo || null},
        ${e.awardingBody || null},
        ${e.registrationOpen || false},
        now()
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug;
    `;

    if (res.length > 0) {
      eventsInserted++;
      console.log(`  ✓ Inserted event: ${e.slug}`);
    } else {
      console.log(`  • Event already exists (skipped): ${e.slug}`);
    }
  }

  // 2. Resolve blog directory (supports both pre-move and post-move)
  const seedBlogDir = path.join(rootDir, 'db/seed/blog');
  const srcBlogDir = path.join(rootDir, 'src/content/blog');
  const blogDir = fs.existsSync(seedBlogDir) ? seedBlogDir : srcBlogDir;

  if (!fs.existsSync(blogDir)) {
    throw new Error(`Blog directory not found at ${blogDir}`);
  }

  console.log(`Loading blog posts from: ${blogDir}`);
  const blogFiles = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'));

  let postsInserted = 0;
  for (const filename of blogFiles) {
    const filePath = path.join(blogDir, filename);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, body } = parseFrontmatter(rawContent);

    const slug = data.slug || filename.replace(/\.md$/, '');
    const catObj = getCategoryByName(data.category);
    const categorySlug = catObj ? catObj.slug : (data.category?.toLowerCase() || 'general');
    const publishDate = data.date || data.publish_date || new Date().toISOString().split('T')[0];

    const res = await sql`
      INSERT INTO blog_posts (
        slug,
        status,
        title,
        category,
        summary,
        body_md,
        image,
        image_alt,
        author,
        featured,
        is_sample,
        publish_date
      ) VALUES (
        ${slug},
        'published',
        ${data.title},
        ${categorySlug},
        ${data.summary},
        ${body},
        ${data.image || null},
        ${data.imageAlt || null},
        ${data.author || 'Adam International Team'},
        ${Boolean(data.featured)},
        true,
        ${publishDate}
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING id, slug;
    `;

    if (res.length > 0) {
      postsInserted++;
      console.log(`  ✓ Inserted post: ${slug}`);
    } else {
      console.log(`  • Post already exists (skipped): ${slug}`);
    }
  }

  console.log(`\nSeed completed: ${eventsInserted} events inserted, ${postsInserted} blog posts inserted.`);
  process.exit(0);
}

seedContent().catch((err) => {
  console.error('❌ Error during seeding:', err);
  process.exit(1);
});
