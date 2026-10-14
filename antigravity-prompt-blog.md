# Antigravity Prompt — Blog

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis. These already exist: PageHero, ActionButton, FinalCtaBanner, the SAMPLE badge, and `src/lib/contentFlags.js` (`SHOW_PLACEHOLDERS`).

Build a **Blog**: a listing page at `/blog` and a post page at `/blog/:slug`, with posts written as Markdown files.

### Hard rules

1. **Copy:** use it exactly as written here. Indian/UK spelling.
2. **One new dependency only:** `marked`, for Markdown → HTML. Don't add `gray-matter` or a typography plugin; parse the frontmatter yourself (Section 2).
3. **No real articles in this task.** Create **3 sample posts only**, clearly marked as samples (Section 3). Don't write any factual study-abroad articles. Real posts will be added later.
4. **Hide the samples on the live site after launch:** sample posts follow `SHOW_PLACEHOLDERS`, the same as stories and the gallery, and they show the SAMPLE badge.
5. **Layout:** mobile first, no horizontal scroll at 360px. GSAP must use `gsap.context()` with cleanup.
6. **Don't open a browser.** Run `npm run build` at the end.

---

## 1. Routes and navigation

- **Routes:** add lazy-loaded routes `/blog` → `BlogPage.jsx` and `/blog/:slug` → `BlogPostPage.jsx`, both inside MainLayout.
- **Header and footer:** the "Blog" link goes to `/blog`, with an active state on both routes.
- **Hiding the link:** hide "Blog" in the header and footer when there are no visible posts (no real posts, and `SHOW_PLACEHOLDERS` is false). This is the same pattern as Gallery.
- **Unknown slug:** `/blog/:slug` with an unknown slug renders NotFoundPage.

---

## 2. Content system

### Files

- **Posts:** Markdown files in `src/content/blog/*.md`. Load them with `import.meta.glob('/src/content/blog/*.md', { query: '?raw', import: 'default', eager: true })`.
- **`src/lib/blog.js`:**
  - Parses the frontmatter: a simple `---` block of `key: value` lines, with `tags: [a, b]` arrays and quoted strings supported.
  - Converts the body with `marked`.
  - Exports `getAllPosts()`, sorted by date with the newest first and placeholders filtered by `SHOW_PLACEHOLDERS`.
  - Exports `getPostBySlug(slug)` and `getPostsByCategory(category)`.
  - Works out `readingTime` at about 200 words per minute.

### Frontmatter

```yaml
---
title: How to Choose the Right Country to Study in Europe
slug: choose-country-study-europe
date: 2026-10-14
updated: 2026-10-14
category: Study in Europe
summary: A short two-line summary shown on the blog card.
image: /images/blog/choose-country-study-europe.jpg
imageAlt: Students walking through a European university campus
author: Adam International Team
featured: false
isPlaceholder: false
---
```

### Categories

The categories are fixed, in this order. Put them in `src/data/blogCategories.js` with a slug for each.

| Category | slug |
|---|---|
| Study in Europe | `study-in-europe` |
| Country Guides | `country-guides` |
| Student Visa Guidance | `student-visa-guidance` |
| University and Course Updates | `university-course-updates` |
| Scholarships and Financial Planning | `scholarships-financial-planning` |
| Student Success Stories | `student-success-stories` |

**Validate posts:** if a post's category isn't in the list, `console.warn` in dev and show it under "All" only.

### Guide for adding posts

Write `docs/adding-blog-posts.md`: plain-English steps for adding a post (copy the template, fill in the frontmatter, add an image of 1200×675 or larger under 250 KB to `public/images/blog/`, and set `isPlaceholder: false`). Include a ready-to-copy template.

---

## 3. Sample posts (placeholders)

Create 3 files with `isPlaceholder: true` and **obviously sample** text, so nobody mistakes them for real advice.

| File | title | category | featured |
|---|---|---|---|
| `sample-post-1.md` | `Sample article: Study in Europe` | Study in Europe | `true` |
| `sample-post-2.md` | `Sample article: Student visa guidance` | Student Visa Guidance | `false` |
| `sample-post-3.md` | `Sample article: Scholarships and financial planning` | Scholarships and Financial Planning | `false` |

**Every sample post:**
- **Summary:** `This is a sample article used to preview the blog layout. It will be replaced with a real post.`
- **Body:** must demonstrate formatting (an h2, an h3, a paragraph, a bulleted list, a numbered list, a blockquote, a link, and **bold** and *italic* text). Every sentence says it's sample text, e.g. "This is sample text to preview a heading style."
- **Images:**
  - Download one free Unsplash image per post into `public/images/blog/_placeholder/`, under 250 KB, landscape 16:9. Pick a neutral study or Europe scene.
  - Verify each image shows that scene before using it.
  - No browser; max 3 attempts per image.

---

## 4. `/blog` listing page

**Helmet:**
- Title: `Study Abroad Insights & Updates`
- Description: `Study abroad updates, European university opportunities, visa guidance and student success stories from Adam International.`

### 4.1 Hero

Use PageHero, with breadcrumb `Home / Blog`.

- **H1:** `Study Abroad Insights & Updates`
- **Sub:** `Explore European education, visa guidance and student resources.`

### 4.2 Intro

A centred block, max-width 720px:

`Explore the latest study abroad updates, European university opportunities, visa guidance and student success stories from Adam International.`

### 4.3 Category bar

- **Chips:** `All` + the 6 categories. Only show category chips that have at least one visible post; `All` is always shown.
- **URL sync:** sync the selected chip to `?category={slug}`.
- **Mobile:** horizontally scrollable chips, with no visible scrollbar.

### 4.4 Featured post

- **When it shows:** only when `category` is `All` and a post with `featured: true` exists.
- **Layout:** one large card, with the image on the left and text on the right on desktop, stacked on mobile.
- **Content:** image, category tag, date, title, summary and `Read More`.

### 4.5 Post grid

- **Layout:** 3 columns on desktop, 2 on tablet, 1 on mobile. **Exclude** the featured post when it's shown above.
- **Uniform cards:** every card is the same height (flex column), with:
  - **Featured image:** 16:9, `object-cover`, `loading="lazy"`.
  - **Category tag and date:** in one line, with the date formatted like `14 Oct 2026` and reading time like `· 4 min read`.
  - **Title:** clamped to 2 lines.
  - **Summary:** clamped to exactly 2 lines.
  - **Read More link:** pinned to the bottom, with one arrow icon.
- **Behaviour:** the whole card is clickable to `/blog/{slug}`. A SAMPLE badge shows when `isPlaceholder` is true.
- **Paging:** show 9 posts, then a `Load more` button.
- **Empty state:** `No articles in this category yet.`, with a `View all articles` button.

### 4.6 CTA

This replaces FinalCtaBanner on this page.

- **Heading:** `Planning to Study in Europe?`
- **Text:** `Get guidance from Adam International.`
- **Buttons:**
  - `Contact Us`, a link to `/contact`
  - `Book a Free Consultation`, which opens the booking form

---

## 5. `/blog/:slug` post page

**Helmet:**
- `<title>{title} | Adam International</title>`
- the description from `summary`
- `og:title`, `og:description` and `og:image`
- Article JSON-LD (`headline`, `datePublished`, `dateModified`, `author`, `image`)
- **noindex if `isPlaceholder` is true.**

**Sections, in order:**

1. **Breadcrumb:** `Home / Blog / {category}`. The category part links to `/blog?category={slug}`.
2. **Header:** category tag, H1 title, a meta line (`{date} · {readingTime} min read · {author}`), plus `Updated {updated}` when it differs from `date`. Then the featured image, full width, 16:9, rounded.
3. **Content:**
   - **Width:** a centred article column, max-width around 720px.
   - **Typography:** hand-written prose styles in a scoped CSS block, not a plugin. Style: h2, h3, p, ul, ol, li, blockquote, a (gold underline), strong, em, img, table and hr. Line height around 1.75, and comfortable sizes on mobile.
   - **Links:** external links in the content open in a new tab with `rel="noopener noreferrer"`.
4. **Inline CTA box** after the content: `Planning to Study in Europe?` / `Get guidance from Adam International.` with the buttons `Book a Free Consultation` (booking form) and `WhatsApp Us`.
5. **Related articles:** up to 3 other posts from the same category; if there are fewer, fill with the newest posts. Use the same card as the listing. Hide the section if there are none.
6. **Link:** `Back to all articles`, pointing to `/blog`.

---

## 6. Contact link note

The CTA links to `/contact`, which will be built in the next task. Until then, it's OK for `/contact` to show the 404 page. **Don't build the contact page in this task.**

---

## 7. Acceptance checklist

- [ ] `/blog` shows the hero, intro, chips (All + the 3 sample categories), 1 featured post and a grid of 2.
- [ ] `?category=student-visa-guidance` loads filtered. The featured block is hidden when a category is selected.
- [ ] Every card has the same height. Titles are clamped to 2 lines and summaries to exactly 2. SAMPLE badges show.
- [ ] `/blog/sample-post-1`, or whatever slug you set, renders every Markdown element with good typography, the inline CTA and related posts.
- [ ] An unknown slug renders the 404 page.
- [ ] With `SHOW_PLACEHOLDERS` false: no posts, the Blog link is hidden in the header and footer, and `/blog` shows `Articles are coming soon.`
- [ ] 360px: no horizontal scroll, including long words and tables in the post content.
- [ ] `npm run build` passes.
- [ ] Report the image source URLs.
