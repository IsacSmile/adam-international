# Antigravity Prompt — Countries Page v2

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis. The shared section components live in `src/components/shared/serviceSections/`. Data lives in `src/data/`. Country detail pages `/countries/:slug` already exist.

Rebuild **`/countries`** (`src/pages/CountriesPage.jsx`) using the client's new content below.

### Hard rules

1. **Copy:** use the copy exactly as written here. Use Indian/UK spelling: programme, organise, specialisation.
2. **No invented facts:** never invent fees, living costs, work rules, visa links, course lists or university details. Every comparison value comes from `countries.js`. If a value is missing, hide it or show "Ask an advisor". Never show an estimate.
3. **No new npm dependencies.**
4. **Reuse existing components** (PageHero, CountryGrid card styles, UniversityGridSection, StoryStripSection, CardGridSection, ActionButton). Don't duplicate them.
5. **Layout:** mobile first, no horizontal page scroll at 360px. GSAP must use `gsap.context()` with cleanup.
6. **Don't open a browser.** Run `npm run build` at the end of each stage.
7. **Work in the two stages in Section 8** and stop after each one.

---

## 1. Data changes

### 1.1 `src/data/countries.js`

Add these fields to **every** country, all empty by default. Add the comment `// CONFIRM WITH CLIENT: fill only with verified figures and official sources` above the first country.

```js
featured: false,            // client will choose featured destinations
comparison: {
  tuition: null,            // { min, max, currency: 'EUR', period: 'per year', academicYear: '2026/27', note }
  livingMonthly: null,      // { min, max, currency: 'EUR', note }
  popularFields: [],        // e.g. ['Business', 'Engineering']
  englishTaught: null,      // true | false | null
  languageRequirements: null, // short text
  partTimeWork: null,       // { text, sourceUrl }  (sourceUrl must be an official government page)
  courseCategories: [],     // from the fixed list in Section 4
  studyLevels: [],          // 'Bachelor\'s' | 'Master\'s' | 'Doctoral'
  budgetBand: null,         // one of the budget band keys in Section 4
  lastChecked: null,        // 'YYYY-MM-DD'
},
```

The visa link for the comparison table comes from the existing `visa.officialLinks[0]`. Don't add a second visa field.

**Update the blurbs for 3 countries** with the client's text:

| Country | Blurb |
|---|---|
| Hungary | A destination to explore for university programmes, student life and study options in Central Europe. |
| Slovenia | Discover higher education opportunities, available courses and student life in Slovenia. |
| Malta | Explore study options, university programmes and practical information for international students. |

Leave all other blurbs unchanged. The client will send exact details for every country later.

### 1.2 `src/data/universities.js`

Add `languageOfInstruction: null` to every university, for example `'English'` or `'English, Hungarian'`.

---

## 2. Page structure (in this order)

### 2.1 Hero

Use PageHero, with the breadcrumb `Home / Countries`.

- **H1:** `Discover the Best European Countries to Study Abroad`
- **Sub:** `Explore European study destinations and find the country that matches your academic goals, budget, preferred course and future plans. Compare universities, tuition fees, living expenses and available study opportunities before making your decision.`
- **Three buttons:**
  - `Explore Countries`: scrolls to `#countries`
  - `Find Universities`: links to `/universities`
  - `Get Guidance`: opens the booking form
- **SEO:**
  - Title: `Study Destinations in Europe`
  - Description: `Explore European study destinations, compare countries and find universities that match your goals, budget and course.`

### 2.2 Section: How to Choose the Right Country

Use CardGridSection with 4 columns on desktop, 2 on tablet and 1 on mobile.

- **Eyebrow:** `CHOOSING A DESTINATION`
- **Heading:** `How to Choose the Right Country`

| Icon | Title | Text |
|---|---|---|
| Wallet | Consider Your Budget | Compare tuition fees, accommodation, transport, insurance and other living expenses. |
| BookOpen | Choose Your Course | Check course availability, entry requirements, language of instruction and university recognition. |
| FileCheck2 | Understand Visa Requirements | Review the student visa process, financial requirements and documentation for your destination. |
| Users | Explore Student Life | Research accommodation, transport, local culture and the support available to international students. |

### 2.3 Section: Compare Countries

**Only render this section if at least 2 countries have at least one non-empty comparison value.** Until then, hide it completely.

- **Heading:** `Compare Study Destinations`
- **Sub:** `A quick comparison to help you shortlist. Check each country page for full details.`
- **Layout:** countries are the columns and the factors are the rows.
  - **Desktop:** a sticky first column, with horizontal scroll *inside the table only*.
  - **Mobile:** one card per country, listing the factors.
- **Rows:**

| Factor | What to show |
|---|---|
| Tuition fees | `€{min}–{max} {period} ({academicYear})`, or the note |
| Living expenses | `€{min}–{max} per month` |
| Available courses | `popularFields` joined by ", ", plus `· English-taught programmes available` when `englishTaught` is true |
| Language requirements | `languageRequirements` |
| Part-time work | `partTimeWork.text`, plus a small `Official source ↗` link |
| Visa requirements | `Official visa information ↗`, linking to `visa.officialLinks[0].url` |
| Universities | up to 3 university names for that country, each linking to `/universities/{slug}`, plus `+N more` |

- **Empty cells** show `Ask an advisor` in muted text.
- **Below the table, show a note:** `Fees and living costs vary by university, city and course. Figures are checked regularly. Last checked: {latest lastChecked}. Always confirm current figures with the university or an advisor.`
- **Country selector:** a "Choose countries to compare" control above the table, up to 4 countries at once. By default it selects the first 4 countries that have data.

### 2.4 Section: All destinations, `id="countries"`

- **Heading:** `Explore Countries`

#### Search and filter bar

- **Search by country:** a text input that filters by name as you type.
- **Sort:** a dropdown with `Featured` (the default) and `A–Z`.
  - **Featured order:** countries with `featured: true` first, then the current file order.
  - **A–Z:** sort by name.
- **Data-driven filters:** each one renders **only when at least one country has data for it**, and hides otherwise. Use the options in Section 4.

| Filter | Matches on |
|---|---|
| Study budget (approx. per year) | `comparison.budgetBand` |
| Course category | `comparison.courseCategories` |
| Language | `English-taught programmes` → `englishTaught === true`; `Other languages` → `englishTaught === false` |
| Study level | `comparison.studyLevels` |

- **URL sync:** sync search, sort and filters to the URL (`?q=&sort=&budget=&course=&lang=&level=`).
- **Clear filters:** a link that appears when anything is active.
- **Results count:** `Showing {n} of {total} destinations`.
- **Empty state:** `No destinations match these filters.` and a `Clear filters` button.

#### Cards

- **Grouping:** keep the existing grouping, with `Europe` first and then `Other Study Destinations` (renamed from "Other destinations"). When search or filters are active, show one flat list without group headings.
- **Card layout:** use a consistent 4:3 image ratio, matching card heights (flex column, with the buttons pinned to the bottom) and mobile-friendly spacing.
- **Card content:**
  - image
  - flag + name
  - blurb, limited to 3 lines
  - primary button `Explore {name}`, **full width**, linking to `/countries/{slug}`
  - below it, a small text link `or talk to an advisor` that opens the booking form with that country pre-selected
  - a `Featured` badge **only** if `featured: true`

### 2.5 Section: Explore Universities Across Europe

- **Heading:** `Explore Universities Across Europe`
- **Sub:** `Universities we currently help students apply to.`
- **What to show:** use UniversityGridSection with `showDetails` on. Show up to 6 universities from countries in the `Europe` region.
- **Each card shows:**
  - name
  - logo, or the building icon if there isn't one
  - flag, city and country
  - available programmes: unique programme names, up to 3
  - language of instruction (`languageOfInstruction`), shown only if it exists
  - `Official website ↗`, shown only if `website` exists
  - `Admission requirements`, showing `requirements.academic` if it exists, otherwise a link to `/universities/{slug}#requirements`
  - `View University Details`
- **Button:** `View All Universities`, linking to `/universities`.
- **On `UniversityDetailPage`:** add `id="requirements"` to the entry requirements section, so the link above works.

### 2.6 Section: Real Students. Real Journeys.

Use StoryStripSection (the compact cards).

- **Heading:** `Real Students. Real Journeys.`
- **Sub:** `Experiences from students who studied abroad with our support.`
- **Each compact card also shows** the course and intake under the university (one line, muted), and a small `Visa approved` or `Admission confirmed` pill **only** if the story's `journey` contains that milestone with a date.
- **Button:** `Read Student Stories`, linking to `/success-stories`.

### 2.7 CTA

Keep the existing `FinalCtaBanner` at the bottom.

---

## 3. Country detail page addition

On `CountryDetailPage`, directly after the hero, add an **`At a Glance`** section that shows the same comparison values for that one country, as small fact cards with icons:

- Tuition
- Living costs
- Courses
- Language
- Part-time work (with an official source link)
- Last checked

**Only render it if that country has at least one comparison value**, and hide empty facts. Below it, add the same "Fees and living costs vary…" note.

---

## 4. Filter options (`src/data/countryFilters.js`)

```js
export const budgetBands = [
  { key: 'under-5', label: 'Under ₹5 lakh' },
  { key: '5-10', label: '₹5–10 lakh' },
  { key: '10-15', label: '₹10–15 lakh' },
  { key: '15-25', label: '₹15–25 lakh' },
  { key: '25-plus', label: 'Above ₹25 lakh' },
];
export const courseCategories = ['Business', 'Engineering', 'Medicine', 'IT & Computer Science', 'Hospitality & Tourism', 'Health Sciences', 'Arts & Humanities', 'Law'];
export const studyLevels = ["Bachelor's", "Master's", 'Doctoral'];
```

The budget band means **approximate total cost per year (tuition + living)**. Show that as helper text under the filter.

---

## 5. Remove the old copy

Remove the old H1 `Where you can study` and its sub from CountriesPage.

---

## 6. Mobile

- **Filters:** on mobile, collapse the filters into a `Filters` button that opens a bottom sheet. Search and Sort stay visible.
- **Comparison:** on mobile it becomes stacked country cards, not a wide table.

---

## 7. Acceptance checklist

- [ ] With the current empty data, these are hidden: the comparison section, and the budget, course, language and level filters. Search and Sort work.
- [ ] Add temporary test data to 2 countries locally. The comparison section and the matching filters appear and work. **Then remove the test data.**
- [ ] `?q=hun` loads with Hungary only. `?sort=az` is alphabetical.
- [ ] Every card links to the right `/countries/{slug}`. "or talk to an advisor" pre-selects the country.
- [ ] The Universities section shows only European universities, with no empty labels.
- [ ] The stories strip shows no milestone pill unless a dated milestone exists.
- [ ] 360px: no horizontal page scroll. The comparison table scrolls only inside its container (desktop) or stacks (mobile).
- [ ] `npm run build` passes.

---

## 8. Stages

**Stage A:**
- Sections 1, 2.1, 2.2, 2.4, 2.5, 5 and 6 (search, sort, cards and the filter UI)
- Stop and report

**Stage B:**
- Sections 2.3, 2.6, 3 and 4 (comparison, stories, At a Glance, filter options)
- Run the acceptance checklist
- Stop and report
