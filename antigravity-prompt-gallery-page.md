# Antigravity Prompt — Gallery Page

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis. These shared components already exist: PageHero, Lightbox, YouTubeFacade, ActionButton, FinalCtaBanner, and the section components in `src/components/shared/serviceSections/`.

Build a new **`/gallery`** page from the client's content below.

### Hard rules

1. **Copy:** use it exactly as written here. Use Indian/UK spelling (counselling, programme).
2. **🚨 No stock or placeholder photos in the gallery.** A gallery claims "these are our students and our events", so every photo must be a **real Adam International photo** supplied by the client. Don't download any images for this page.
   - Until real photos are added, each section shows its empty state (Section 4).
   - The hero background is the **only** exception: it may use an existing local image, such as `/images/about/hero.jpg`.
3. **Consent:** student photos and videos (the visa success and student life categories) render **only** when `consentOnFile: true`.
4. **No new npm dependencies.**
5. **GSAP and layout:** GSAP must use `gsap.context()` with cleanup. Mobile first, with no horizontal scroll at 360px.
6. **Don't open a browser.** Run `npm run build` at the end.

---

## 1. Routing and navigation

- Add a lazy-loaded route: `/gallery` → `src/pages/GalleryPage.jsx`, inside MainLayout.
- Point the header "Gallery" link and the footer "Gallery" link (if present) to `/gallery`, with an active state on that page.
- **Helmet:**
  - Title: `Gallery`
  - Description: `Student visa successes, university events and pre-departure moments from Adam International.`

---

## 2. Data: `src/data/gallery.js`

Export an empty array with this schema, and put `// Add only real Adam International photos. Student photos need written consent (consentOnFile: true).` above it.

```js
export const galleryItems = [
  // {
  //   id: 'visa-2026-001',
  //   category: 'visa',          // 'visa' | 'events' | 'student-life'
  //   type: 'Visa approval',     // see allowed types below
  //   image: '/images/gallery/visa/visa-2026-001.jpg',
  //   width: 1200, height: 1500, // real pixel size, used to prevent layout shift
  //   alt: 'Student holding her approved visa',
  //   video: null,               // or { provider: 'youtube', id: 'XXXXXXXXXXX' }
  //   caption: '',               // short line shown under the photo
  //   studentName: null,
  //   country: null,             // country slug from countries.js
  //   university: null,
  //   message: null,             // short success message from the student
  //   date: null,                // 'YYYY-MM-DD'
  //   location: null,            // e.g. 'Kochi branch'
  //   consentOnFile: false,
  //   featured: false,
  // },
];

export const galleryTypes = {
  visa: ['Visa approval', 'Admission offer'],
  events: ['University delegate visit', 'Spot admission session', 'Counselling event', 'Student seminar', 'Education fair', 'Our team'],
  'student-life': ['Pre-departure session', 'Student send-off', 'Travel preparation', 'Student life in Europe'],
};
```

**Folders:** create empty folders with a `.gitkeep` file in each: `public/images/gallery/visa/`, `public/images/gallery/events/` and `public/images/gallery/student-life/`.

**`docs/adding-gallery-photos.md`:** write short, plain-English steps that I can follow later without help:
1. Compress the photo to 300 KB or less, 1600px max on the long side.
2. Put it in the right folder.
3. Copy the example entry and fill it in, with the real width and height.
4. Set `consentOnFile: true` only when the student has given written permission.
5. For a video, upload it to YouTube (unlisted is fine) and paste the ID.

Also include the **list of photos to request from the client** from Section 6.

---

## 3. Page structure (in this order)

### 3.1 Hero

Use the full-width hero style from the About page, with breadcrumb `Home / Gallery`.

- **H1:** `Every Success Story Begins with a Dream`
- **Sub:** `From choosing the right European destination to achieving your study-abroad dreams, we are proud to be part of every milestone.`
- **Button:** `Explore Success Stories`, which scrolls to `#visa-success` (Lenis, header offset).
- **Background:** `/images/about/hero.jpg`, with the same left-to-right navy gradient used on the service heroes.

### 3.2 Intro

A centred block, max-width 720px.

- **Eyebrow:** `OUR GALLERY`
- **Heading:** `Our Journey, Your Success`
- **Paragraph 1:** `At Adam International, we believe every student's journey deserves to be celebrated. From taking the first step towards international education to receiving a visa approval, every milestone represents a dream moving closer to reality.`
- **Paragraph 2:** `Explore our gallery to discover student achievements, memorable events, university interactions and experiences that reflect our commitment to helping students pursue educational opportunities across Europe.`

### 3.3 Category tabs

A sticky tab bar that sits just under the header while scrolling the gallery sections.

- **Tabs:** `All` · `Visa Success` · `Events & Partnerships` · `Pre-Departure & Student Life`
- **Behaviour:**
  - Clicking a tab scrolls to that section.
  - `All` scrolls to `#visa-success`.
  - The active tab updates as the user scrolls (IntersectionObserver).
- **Mobile:** horizontally scrollable pills, with no visible scrollbar.
- **Hide the whole tab bar** if every category is empty.

### 3.4 Section `id="visa-success"`

- **Eyebrow:** `STUDENT VISA SUCCESS STORIES`
- **Heading:** `Dreams Approved, Futures Unlocked`
- **Sub-heading:** `Celebrating Student Success`
- **Paragraph:** `Every achievement tells a story of ambition, dedication and new beginnings. Explore the journeys of students who have taken steps towards their international education goals with guidance from Adam International.`
- **Items:** `category: 'visa'` **and** `consentOnFile: true`, sorted by date with the newest first.
- **Card:** the photo, or the video thumbnail with a play icon; the student name; the country flag and name; the university, if present; the short `message` in quotes, if present; and the date formatted like `Oct 2026`.
- **Below the grid:** a link `Read full student stories`, pointing to `/success-stories`.

### 3.5 Section `id="events"`

- **Eyebrow:** `UNIVERSITY PARTNERSHIPS & EVENTS`
- **Heading:** `Connecting Students with Global Opportunities`
- **Sub-heading:** `Moments That Matter`
- **Paragraph:** `From counselling sessions and university visits to educational events and pre-departure guidance, every moment reflects our commitment to supporting students throughout their study-abroad journey.`
- **Items:** `category: 'events'`.
- **Filter chips:** above the grid, built from `galleryTypes.events`. Show only chips for types that have at least one item, plus `All`.
- **Card:** a small `type` tag; the caption; and the date and location in one muted line.

### 3.6 Section `id="student-life"`

- **Eyebrow:** `PRE-DEPARTURE & STUDENT LIFE`
- **Heading:** `From Kerala to Europe — A New Chapter Begins`
- **Paragraph:** `Pre-departure sessions, travel preparation, student send-offs and moments shared by our students from Europe.`
- **Items:** `category: 'student-life'`. Items of type `Student life in Europe` or `Student send-off` render only when `consentOnFile: true`.
- **Card:** the same layout as the events cards.

### 3.7 CTA

This replaces FinalCtaBanner on this page. Use the same visual weight as the About page CTA.

- **Heading:** `Your Journey Could Be Next`
- **Text:** `Are you planning to study in Europe? Let Adam International help you explore suitable destinations, courses and universities and understand the student visa application process.`
- **Tagline** (bold, gold): `Start Your Study-Abroad Journey Today.`
- **Buttons:**
  - `Book a Free Consultation`, which opens the booking form
  - `WhatsApp Us`, which uses the same WhatsApp link as elsewhere

---

## 4. Grid, lightbox and empty states

**Grid:**
- **Layout:** a masonry-style grid using CSS columns (`columns-1 sm:columns-2 lg:columns-3`, with `break-inside: avoid`).
- **Images:** set `loading="lazy"`, `decoding="async"`, and the real `width`/`height` attributes.
- **Hover:** a subtle zoom on the image, with the caption overlay on desktop.
- **Order:** `featured: true` items first within each section.

**Lightbox:** clicking any card opens the existing Lightbox with all items in that section.
- Show the caption and details in the lightbox.
- For a video, play it in the lightbox using YouTubeFacade.
- Keep the Esc, arrow keys and focus trap behaviour that already exists.

**Empty state:** when a section has no items, show a neat card instead of the grid. Keep the section heading and paragraph visible.
- **Visa:** `We're adding photos from recent visa approvals. Read our students' stories in the meantime.`, with a button `Read Student Stories` linking to `/success-stories`.
- **Events:** `Photos from our recent events and university visits are coming soon.`
- **Student life:** `Photos from pre-departure sessions and student send-offs are coming soon.`

**Show more:** if a section has more than 9 items, show 9 with a `Show more` button that reveals 9 more each time.

---

## 5. Acceptance checklist

- [ ] `/gallery` loads. The header shows "Gallery" as active.
- [ ] With the current empty data, all 3 sections show their empty state, the tab bar is hidden, and nothing is broken.
- [ ] **Temporary test:** add 2 test items per category locally, using an existing local image. Confirm:
  - the tabs appear and scroll correctly
  - the event filter chips work
  - the lightbox opens, navigates and closes
  - visa items with `consentOnFile: false` are hidden

  **Then remove all test items** so `galleryItems` is empty again.
- [ ] No downloaded or stock images were added under `public/images/gallery/`.
- [ ] 360px: no horizontal page scroll.
- [ ] `npm run build` passes.

---

## 6. Photos to request from the client (also put this list in the docs file)

- **Visa approvals:** students holding their visa or offer letter, with their written permission. Include the name, country, university and a one-line message.
- **University events:**
  - university delegate visits
  - spot admission sessions
  - counselling events and seminars
  - education fairs
  - team photos

  Include the date and branch for each.
- **Pre-departure:** briefing sessions and send-offs at the office or airport, with permission.
- **Student life:** photos students have sent from Europe, with permission.
- **Videos:** short visa celebration clips or testimonials, as YouTube links.
