# Antigravity Prompt — Adam International: Routing, Service Pages, Countries, Universities, Visa Approvals, Success Stories

## 0. Context (read first)

You are working on an existing **React 18 + Vite + Tailwind CSS** site for **Adam International**, an overseas education consultancy based in Kochi, Kerala. It uses **GSAP 3 (ScrollTrigger)**, **Lenis** smooth scroll, **Lucide React** icons, and `React.lazy` + `Suspense` with skeleton loaders.

Today the site is a **single homepage**. Every nav link is a `#hash` anchor that points to nothing. Components live in `src/components/` and are assembled in `src/App.jsx`:

`Header`, `HeroShowcase`, `WhyChooseUsSection`, `ServicesSection`, `UniversityPartnersSection`, `VisaSuccessSection`, `TestimonialsSection`, `FinalCtaBanner`, `AppointmentModal`, `Footer`, `SectionSkeleton`, `SmoothScroll`.

**Your job:** turn this into a multi-page site with real routes, add the new pages below, and drive all lists (services, countries, universities, visa approvals, success stories) from data files.

**Before writing any code**, read `src/App.jsx`, `Header`, `ServicesSection`, `UniversityPartnersSection`, `VisaSuccessSection`, `TestimonialsSection`, `AppointmentModal`, `Footer` and `SmoothScroll`. Then reuse their existing design tokens, spacing, card styles, fonts, colours (navy `#0B1E3A`-ish + gold accent) and animation patterns. New pages must look like they belong to the same site.

---

## 1. Hard rules (do not break these)

1. **Do not invent facts.** No new statistics, rankings, fees, university names, student names, testimonials, visa dates or partner counts. Where data is missing, use the placeholder pattern in Section 9 and hide empty fields in the UI. Never render "undefined", "null", "TBD" or an empty label.
2. **Do not change the visual design system.** Same colours, fonts, radii, shadows, button styles.
3. **Only add these dependencies:** `react-router-dom` (v6) and `react-helmet-async`. Nothing else.
4. **One source of truth.** The services list must come from one data file and feed the homepage cards, the header dropdown, the footer "Services" column and the service pages. The same applies to countries, universities, visa approvals and stories.
5. **Keep everything accessible.** Keyboard-navigable dropdown, focus styles, `alt` text on every image, semantic headings (one `h1` per page), and `aria-expanded` on the dropdown and FAQ accordions.
6. **Mobile first.** Every new page must work at 360px width with no horizontal scroll.
7. **Use the copy in Section 7 exactly as written.** Don't "improve" it with marketing words like *architect, seamless, unlock, world-class, cutting-edge, elevate, journey of a lifetime*.

---

## 2. Routing setup

Install `react-router-dom` and `react-helmet-async`. Wrap the app in `BrowserRouter` and `HelmetProvider`.

### Routes

| Path | Page | Notes |
|---|---|---|
| `/` | `HomePage` | Existing sections, updated per Section 4 |
| `/countries` | `CountriesPage` | Country listing |
| `/services` | `ServicesPage` | Grid of all 7 services |
| `/services/:slug` | `ServiceDetailPage` | One template, data-driven |
| `/universities` | `UniversitiesPage` | Listing with country filter |
| `/universities/:slug` | `UniversityDetailPage` | One template, data-driven |
| `/success-stories` | `SuccessStoriesPage` | Full stories, photos, videos |
| `*` | `NotFoundPage` | Friendly 404 with links home and to Services |

`About Us`, `Gallery`, `Blog` and `Contact Us` stay as homepage anchors for now (`/#about`, `/#gallery`, `/#blog`, `/#contact`). **Do not build those pages.** If a matching section with that `id` doesn't exist on the homepage, leave the link pointing to `/#contact` behaviour as-is and add a `// TODO: page not built yet` comment. Don't create fake sections.

### Layout

Create `src/layouts/MainLayout.jsx` with `Header`, `<Outlet />` and `Footer`. Make `AppointmentModal` **global**: create `src/context/AppointmentContext.jsx` exposing `openAppointment({ service?, country?, university? })`. Every "Book Appointment / Enquire Now / Book Free Counseling" button on every page calls this. When opened from a service, country or university page, pre-fill the relevant field.

### Lazy load every page

Use `React.lazy` for every page component, with `SectionSkeleton` (or a page-level variant) as the fallback.

### Scroll, Lenis and GSAP on route change

- On pathname change, scroll to the top instantly using the Lenis instance (`lenis.scrollTo(0, { immediate: true })`), not `window.scrollTo`.
- When the URL has a hash (e.g. `/#about` clicked from `/services/visa-assistance`), navigate to `/`, wait for the section to mount, then `lenis.scrollTo('#about', { offset: -headerHeight })`.
- Every component that creates ScrollTriggers must clean them up on unmount (`gsap.context()` + `ctx.revert()`). Call `ScrollTrigger.refresh()` after each page's content mounts. Without this, animations on the second page visited will fire at the wrong scroll positions.

### SPA hosting rewrite

Add a rewrite so refreshing `/services/visa-assistance` doesn't 404 in production:

- `public/_redirects` containing `/*  /index.html  200` (Netlify), **and**
- `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`.

### Per-page SEO

Use `react-helmet-async` to give every page a unique `<title>` and `<meta name="description">`, using the `seo` fields in the data files. Title format: `{Page Title} | Adam International`.

---

## 3. Data files (create in `src/data/`)

### `services.js`

```js
export const services = [
  {
    slug: 'career-counseling',
    title: 'Career Counseling',
    icon: 'Compass',            // lucide-react icon name
    image: '/images/services/career-counseling.jpg', // reuse existing service images where they fit
    card: { summary: '', highlights: ['', ''] },
    hero: { subtitle: '' },
    intro: '',
    includes: [],               // string[]
    howWeHelp: [],              // paragraph strings
    steps: [],                  // { title, text }[]
    benefits: [],               // { title, text }[]
    faqs: [],                   // { q, a }[]
    seo: { title: '', description: '' },
  },
  // ...6 more, in this exact order:
  // career-counseling, admission-support, training-assistance,
  // financial-assistance, visa-assistance, travel-assistance,
  // pre-departure-post-landing
];
```

Fill every field using the copy in **Section 7**.

Icons: `Compass`, `GraduationCap`, `BookOpenCheck`, `Wallet`, `FileCheck2`, `Plane`, `Luggage`.

### `countries.js`

```js
export const countries = [
  { slug: 'united-kingdom', name: 'United Kingdom', flag: '🇬🇧', image: '...', blurb: '', region: 'Europe' },
  // united-states, canada, australia, germany, france, hungary
];
```

Reuse the hero's existing destination images. Use the blurbs in Section 7.8. Keep the hero's "150+ Universities"-style counts **only if they already exist in the code**. Move them into a `universityCount` field, and hide that field if it's `null`.

### `universities.js`

```js
export const universities = [
  {
    slug: 'coventry-university',
    name: 'Coventry University',
    country: 'united-kingdom',   // must match a countries.js slug
    city: 'Coventry',
    logo: null,
    coverImage: null,
    overview: null,              // paragraph
    programs: [],                // { name, level: 'Bachelor'|'Master'|'Foundation'|'PhD', duration, intakes: [] }[]
    requirements: {
      academic: null,
      english: null,             // e.g. "IELTS 6.5 overall, no band below 6.0"
      other: null,
    },
    tuition: { amount: null, currency: null, per: 'year', note: null },
    livingCost: { amount: null, currency: null, per: 'year', note: null },
    scholarships: null,
    highlights: [],              // string[]; only verifiable facts
    applicationDeadlines: null,
    lastUpdated: null,           // 'YYYY-MM-DD'; show "Information last checked: ..." on the page
    isPlaceholder: true,
  },
];
```

Migrate the existing universities from `UniversityPartnersSection` into this file, keeping **only name and location**. Drop the existing badge lines ("5-Star QS Rated", "#1 Student Experience", "96.5% Graduate Jobs", "Top 10 for Teaching Quality"). They are unverified and some are time-sensitive. Set `isPlaceholder: true` on all of them. The client will supply the real data and the European universities later.

### `visaApprovals.js`

```js
export const visaApprovals = [
  {
    id: 'va-001',
    studentName: '',
    photo: null,                 // real photo only, with written consent
    country: 'hungary',          // countries.js slug
    university: '',              // display name, or a universities.js slug if one exists
    universitySlug: null,
    course: '',
    visaType: '',                // e.g. 'National Visa (Type D)'
    status: 'Approved',
    approvalDate: null,          // 'YYYY-MM-DD'; hide the row if null
    storyId: null,               // links to successStories.js if a full story exists
    consentOnFile: false,
    isPlaceholder: true,
  },
];
```

Move the 3 existing cards into this file with `isPlaceholder: true` and fix the following.

- **Remove the "Visa Ref: HUN-2024-8849" style reference numbers entirely**, from data and UI. Even when real, publishing visa reference numbers is a privacy and fraud risk.
- **Correct "Student Visa (Subclass D)" to "National Visa (Type D)".** "Subclass" is Australian terminology. Hungary issues a national Type D visa for study.
- Keep "VLS-TS" for France. It is correct.
- **Render rule:** only show approvals where `consentOnFile === true` **or** `isPlaceholder === true`. While any `isPlaceholder` item is still in the array, show a dev-only `console.warn`.

### `successStories.js`

```js
export const successStories = [
  {
    id: 'aswathi-krishna',
    studentName: '',
    photo: null,
    country: '',
    university: '',
    universitySlug: null,
    course: '',
    intake: '',                  // e.g. 'September 2024'
    quote: '',                   // short pull-quote shown on the homepage
    story: [],                   // paragraphs, the student's own words, lightly edited
    journey: [],                 // { label: 'Counseling'|'Offer received'|'Visa approved'|'Landed', date }[]
    gallery: [],                 // image URLs
    video: null,                 // { provider: 'youtube', id: '' }
    rating: null,                // 1–5; hide stars if null
    consentOnFile: false,
    isPlaceholder: true,
  },
];
```

Migrate the existing 8 testimonials into this file as `isPlaceholder: true`. **Do not write new testimonial text.** Keep the existing quotes as-is until the client replaces them.

---

## 4. Homepage changes

Final homepage order:

1. `HeroShowcase`
2. `WhyChooseUsSection`
3. `ServicesSection` (now 7 services)
4. `UniversityPartnersSection` (data-driven)
5. `VisaSuccessSection` → retitled **"Recent Visa Approvals"**
6. `TestimonialsSection` → retitled **"Student Success Stories"**
7. `FinalCtaBanner`

### 4.1 Hero → Countries

- **"Explore Top Destinations"** links to `/countries`.
- Each country tile in the vertical marquee links to `/universities?country={slug}`.
- Fix the broken Canada image in the marquee.

### 4.2 Services section

- **Eyebrow:** `WHAT WE DO`
- **Heading:** `Everything you need to study abroad,` / gold line: `in one place`
- **Sub:** `From picking the right course to settling in after you land, we work with you at every step, so you're never figuring it out alone.`
- Render all 7 services from `services.js`, keeping the existing horizontal carousel style.
- Each card shows: image, title, `card.summary`, the two `card.highlights`, and an **"Explore Service →"** link to `/services/{slug}`. **The whole card is clickable.**
- Below the carousel, add a button **"View All Services"** linking to `/services`.

### 4.3 Header Services dropdown

Replace the current items (University Admissions, Visa & Immigration Support, Scholarship Guidance, IELTS/PTE Test Prep, Career & Course Mapping) with the 7 services from `services.js`, in order. Each item has an icon and title, and links to `/services/{slug}`. Add a final item, **"All Services →"**, linking to `/services`.

- **Desktop:** opens on hover **and** click. Closes on Esc and on outside click.
- **Mobile full-screen menu:** "Services" is an expandable accordion listing the same 7 links.
- Remove the "Popular" badge.

Update the footer "Services" column to the same 7 items, linking to `/services/{slug}`. Update the footer "Countries" quick link to `/countries`.

### 4.4 Universities section

- **Eyebrow:** `PARTNER UNIVERSITIES`
- **Heading:** `Universities we work with`
- **Sub:** `We help students apply to universities across the UK and Europe, and we're adding more every intake. Tap a university to see courses, fees and entry requirements.`
- Cards come from `universities.js`. They show name, city and country flag. **Clicking a card goes to `/universities/{slug}`.**
- **"View All Universities"** links to `/universities`.

### 4.5 Recent Visa Approvals

- **Eyebrow:** `RECENT VISA APPROVALS`
- **Heading:** `Recent visa approvals`
- **Sub:** `A few of the students who've recently got their visas with our help.`
- Each card shows: student photo (fall back to initials if there's no photo), student name, destination country with flag, university name, course, an "Approved" status pill, and approval date (formatted `13 Oct 2024`, row hidden if null).
- **"View Story"** only appears when `storyId` exists, and links to `/success-stories#{storyId}`.
- Change the **"Verified Approval"** label to **"Approved"**. Don't claim verification the site can't show.
- Show the **6 most recent** approvals by `approvalDate`.

### 4.6 Student Success Stories

- **Eyebrow:** `STUDENT STORIES`
- **Heading:** `Students who've already made the move`
- **Sub:** `In their own words: what the process was like, what helped, and how life looks now.`
- Keep the current avatar-selector + card interaction. Each card's **"Read More"** links to `/success-stories#{id}`.
- Add a button **"View All Success Stories →"** linking to `/success-stories`.
- Change the **"VERIFIED STUDENT SUCCESS STORIES"** eyebrow to **"STUDENT STORIES"**, and remove the per-card **"VERIFIED"** badge.

---

## 5. New pages

All pages use `MainLayout`. Each has a compact navy hero band (same style as the homepage CTA banner, with a breadcrumb), the page content, and the `FinalCtaBanner` at the bottom.

### 5.1 `/services` — ServicesPage

- **H1:** `Our Services`
- **Sub:** `Seven ways we help, from your first question to your first week abroad.`
- 3-column grid (1 column on mobile) of all services. Each card is the same as the homepage card and links to its detail page.

### 5.2 `/services/:slug` — ServiceDetailPage

If the slug isn't found, render `NotFoundPage`. Sections, in order:

1. **Hero:** breadcrumb (`Home / Services / {title}`), H1 = title, subtitle = `hero.subtitle`, primary button **"Enquire Now"** (opens the modal pre-filled with this service), secondary button **"Call +91 9895 890 500"** (`tel:+919895890500`).
2. **Intro:** a short paragraph (`intro`) next to the service image.
3. **"What's included":** a checklist of `includes`, in a 2-column grid on desktop.
4. **"How we help":** the `howWeHelp` paragraphs.
5. **"How it works":** a numbered vertical timeline of `steps`. On scroll, animate each step in with GSAP (fade + 16px rise, staggered). Respect `prefers-reduced-motion`.
6. **"Why it helps":** cards for `benefits`.
7. **"Questions students ask":** an accessible accordion of `faqs` (only one open at a time, `aria-expanded`, keyboard operable). Also output FAQPage JSON-LD in `<Helmet>`.
8. **"Other services":** 3 other services as small cards.
9. **CTA band:**
   - Heading: `Have a question about {title}?`
   - Text: `Talk to an advisor at any of our branches, on a call, or on WhatsApp. The first consultation is free.`
   - Buttons: **Enquire Now** · **WhatsApp Us**

### 5.3 `/countries` — CountriesPage

- **H1:** `Where you can study`
- **Sub:** `These are the countries we currently help students apply to. Pick one to see the universities we work with there.`
- Grid of country cards: image, flag, name, blurb, and a **"See universities →"** link to `/universities?country={slug}`. Each card also has a secondary **"Talk to an advisor"** button that opens the modal pre-filled with the country.
- Group the cards under two headings: **"Europe"** and **"Other destinations"**.

### 5.4 `/universities` — UniversitiesPage

- **H1:** `Universities we work with`
- **Sub:** `Browse by country. Each profile has courses, fees, entry requirements and intakes.`
- Country filter chips: All + each country that has at least one university. The filter syncs with `?country=` in the URL.
- A search input that filters by university name or city.
- Grid of university cards linking to `/universities/{slug}`.
- **Empty state:** `We're adding universities for this country. Ask an advisor for the current list.` plus an **Enquire Now** button.

### 5.5 `/universities/:slug` — UniversityDetailPage

Sections render **only if their data exists**:

- **Hero:** cover image, logo, name, city and country, breadcrumb, **"Enquire about this university"** button (modal pre-filled).
- **Overview**
- **Courses / programmes:** a table on desktop, stacked cards on mobile. Columns: Programme, Level, Duration, Intakes. Include a level filter (Bachelor / Master / …).
- **Entry requirements:** Academic · English · Other.
- **Fees & costs:** tuition and estimated living cost with currency and period. Show the `note` beneath.
- **Scholarships**
- **Application deadlines**
- **Students we've helped here:** visa approvals and stories whose `universitySlug` matches.
- **Footer note:** `Fees and requirements change every year. Information last checked: {lastUpdated}. Please confirm with an advisor before applying.` This line always shows if `lastUpdated` exists.

If `isPlaceholder` is true and almost every field is empty, show the name, location and this message: `Full details for this university are being updated. Talk to an advisor for current courses, fees and entry requirements.` plus an **Enquire** button.

### 5.6 `/success-stories` — SuccessStoriesPage

- **H1:** `Student success stories`
- **Sub:** `Real students, real offers, real visas. Here's how it went for them, in their own words.`
- Country filter chips at the top.
- **"Featured videos" strip** (only if any story has `video`): use a **YouTube facade**. Show the thumbnail (`https://i.ytimg.com/vi/{id}/hqdefault.jpg`) with a play button, and only load the iframe on click (`youtube-nocookie.com`).
- **Story list:** each story is a full-width card with `id={story.id}` so `/success-stories#{id}` scrolls to it (via Lenis, with header offset). Each card shows:
  - photo, name, university, course, intake, country
  - a pull-quote
  - `story` paragraphs, collapsed after 2 paragraphs with a **"Read the full story"** toggle
  - a `journey` mini-timeline (Counseling → Offer → Visa → Landed)
  - a `gallery` grid that opens a lightbox on click
- **Visa approvals grid:** all approvals from `visaApprovals.js`.
- **CTA:** heading `Want to be the next story here?`, then **Book Free Counseling** · **WhatsApp Us**.

---

## 6. Appointment modal updates

- The country dropdown options come from `countries.js`, plus "Not sure yet".
- Add an optional field **"Service you're interested in"** (options from `services.js` plus "Not sure yet").
- Pre-fill from `openAppointment(...)` arguments.
- Phone placeholder: `+91 98xxx xxxxx`. The current US-style placeholder doesn't suit a Kerala audience.
- Name placeholder: `e.g. Anjali Nair`.
- Modal subtitle: `Leave your details and an advisor will call you back, usually within one working day.` **[CONFIRM callback time with client]**
- Button: `Request a Callback`.

---

## 7. Page copy (use as written)

> Tone: talk like a calm, honest senior counsellor speaking to a student and their parents in Kochi. Short sentences. No hype. No promises we can't keep. Items marked **[CONFIRM]** must be checked with the client before launch. Keep them in the data as written, and add a `// CONFIRM WITH CLIENT` code comment next to each.

### 7.1 Career Counseling — `career-counseling`

**card.summary:** Not sure what to study, or where? We look at your marks, budget and plans, and help you pick a course that actually leads somewhere.
**card.highlights:** One-on-one sessions with an advisor · Shortlists built around your budget

**hero.subtitle:** Choosing a course abroad is a big decision, and most students make it with half the information. We help you make it with all of it.

**intro:** A lot of students come to us having already picked a country because a cousin went there, or a course because it sounded good. Sometimes that's the right choice. Often it isn't. Career counseling is where we slow down, look at the full picture with you, and work out what genuinely makes sense for your profile, your budget and where you want to be in five years.

**includes:**
- A one-on-one session to understand your background, interests and goals
- An honest review of your profile: marks, gaps, backlogs, test scores and work experience
- Country and course options that fit your budget, not just your wishlist
- A clear picture of tuition, living costs and post-study work options for each choice
- A realistic university shortlist: some ambitious, some safe
- Time to answer your parents' questions directly

**howWeHelp:**
- We don't start with a list of universities we'd like to send you to. We start with you. What did you enjoy studying? What kind of job do you want? How much can your family realistically spend?
- If a course or country doesn't suit your profile or budget, we'll say so plainly, even if it means a shorter shortlist. It's far better to hear that now than after you've paid a deposit.
- Parents are welcome in every session, in person at any of our branches or online. Most families make this decision together, and we'd rather answer their questions ourselves than have them answered second-hand.

**steps:**
1. **Book a free consultation.** Pick a time that works for you, at a branch or online.
2. **Share your documents.** Mark sheets, test scores if you have them, and a CV if you've worked.
3. **Talk it through.** We go over your options, costs and career paths together.
4. **Get your shortlist.** A short, realistic list of courses and universities, with reasons for each.
5. **Decide your next step.** When you're ready, we move on to applications with you.

**benefits:**
- **A choice you understand.** You'll know why a course suits you, not just that it exists.
- **No surprise costs.** You see tuition, living expenses and visa costs before you commit.
- **Career-first thinking.** We look at what the course leads to, not just how to get in.
- **Everyone on the same page.** Your parents hear the same advice you do.

**faqs:**
- **Is the first session really free?** Yes. The first consultation costs nothing and you're under no obligation to continue with us. **[CONFIRM]**
- **I have a gap year or backlogs. Can I still study abroad?** In many cases, yes. Many universities accept gaps if you can explain what you did during them, and backlog limits vary by university and country. Bring your documents and we'll tell you honestly where you stand.
- **Do I need IELTS or PTE before I come in?** No. Come and talk to us first. We'll tell you which test you need, the score to aim for, and whether any of your options accept alternatives.
- **Can my parents join the session?** Of course. Many students bring a parent, and we're happy to do the session online if they're somewhere else.
- **How do you decide which country suits me?** We look at your course, budget, preferred intake, career plans and each country's post-study work rules, then explain the trade-offs so you can choose.

**seo.title:** Career Counseling for Study Abroad
**seo.description:** One-on-one career counseling to help you choose the right course, country and university abroad, based on your profile, budget and goals.

### 7.2 Admission Support — `admission-support`

**card.summary:** From your SOP to the final offer letter, we work through the paperwork with you so nothing gets missed or rushed.
**card.highlights:** SOP and LOR guidance · Application tracking until your offer arrives

**hero.subtitle:** Applications have a lot of moving parts: deadlines, documents, essays and portals. We keep track of all of it, so you can focus on getting each one right.

**intro:** A strong student can still get rejected because of a missing document, a weak statement of purpose or a deadline that slipped by. Our admission team handles the details with you, from the first application form to accepting your offer.

**includes:**
- Intake and deadline planning for every university on your shortlist
- A personalised document checklist
- Help writing a statement of purpose (SOP) that sounds like you
- Guidance on who to ask for letters of recommendation (LORs) and what they should cover
- Filling in and submitting applications
- Following up with universities and answering their questions
- Explaining conditional and unconditional offers
- Helping you accept your offer and pay deposits correctly

**howWeHelp:**
- Your SOP should sound like you. We'll help you structure it, sharpen it and check it against what each university asks for. What we won't do is hand you a template. Admission teams read thousands of statements and spot copied ones quickly.
- We keep a single tracker for all your applications, so you always know what's been submitted, what's pending and what the university has asked for.
- When offers arrive, we sit down with you and go through the conditions line by line, so you know exactly what you still need to do before you can enrol.

**steps:**
1. **Finalise your shortlist.** Confirm the universities, courses and intake.
2. **Gather documents.** We give you a checklist and review everything as it comes in.
3. **Write your SOP and arrange LORs.** We guide, review and help you polish them.
4. **Submit applications.** We file each application and confirm it's been received.
5. **Track and respond.** We follow up and handle any questions from the universities.
6. **Review offers and accept.** We help you compare offers and secure your place.

**benefits:**
- **Fewer avoidable rejections.** Applications go in complete and on time.
- **An SOP you're proud of.** Written in your voice, with expert feedback.
- **One point of contact.** You don't chase five university portals alone.
- **Clarity on offers.** You know exactly what each condition means.

**faqs:**
- **How many universities should I apply to?** Usually a handful, with a mix of ambitious and safer choices. The right number depends on your profile and on application fees, and we'll help you decide.
- **How long does it take to get an offer?** It varies a lot by university, course and time of year, from a couple of weeks to a few months. We'll give you a realistic estimate for each application.
- **What's the difference between a conditional and an unconditional offer?** A conditional offer means you still have something to meet, such as final marks or an English test score. An unconditional offer means you've met all the academic requirements.
- **Can you guarantee admission?** No one honestly can. The university makes that decision. What we can do is make sure your application is complete, on time and as strong as it can be.
- **Can you help with application fee waivers?** Some universities waive or reduce application fees at certain times of the year. We'll tell you whenever that applies to your choices.

**seo.title:** University Admission Support
**seo.description:** End-to-end university application support: shortlisting, SOP and LOR guidance, application filing and offer review for UK and European universities.

### 7.3 Training Assistance — `training-assistance`

**card.summary:** IELTS, PTE and interview preparation, so you walk into your test and your visa interview knowing what to expect.
**card.highlights:** IELTS and PTE coaching · Mock university and visa interviews

**hero.subtitle:** Good preparation is the difference between hoping you'll do well and knowing you will. We help you get ready for the tests and interviews that stand between you and your offer.

**intro:** Most students going abroad need to clear an English test, and many also face an interview, either with the university or at the visa stage. Training Assistance covers both. We help you choose the right test, prepare for it properly, and practise speaking until it feels natural.

**includes:**
- Advice on which English test your universities and visa accept
- IELTS and PTE coaching **[CONFIRM: batch sizes, online/offline, fees]**
- Regular mock tests with feedback on where you're losing marks
- University and credibility interview preparation
- Mock visa interviews with honest feedback
- Practice speaking clearly and confidently about your course and plans

**howWeHelp:**
- Before you book any test, we check what each university on your shortlist actually accepts, so you don't spend money on the wrong exam.
- Our mock interviews are meant to be a little uncomfortable. We ask the questions officers and admission teams really ask, then go through your answers with you until they're clear, honest and consistent with your application.

**steps:**
1. **Check requirements.** We confirm which test and score you need.
2. **Take a starting assessment.** We see where you are today.
3. **Train.** Structured coaching focused on your weak areas.
4. **Practise under test conditions.** Timed mock tests with feedback.
5. **Prepare for interviews.** Mock university and visa interviews before the real ones.

**benefits:**
- **The right test, first time.** No wasted test fees.
- **Targeted practice.** Time goes into the sections you actually struggle with.
- **Calmer interviews.** You've already answered the hard questions in practice.
- **Consistent answers.** What you say in the interview matches your SOP and documents.

**faqs:**
- **Should I take IELTS or PTE?** It depends on your universities and destination country. Both are widely accepted, but not everywhere. We'll check your shortlist before you book.
- **How long is my score valid?** IELTS and PTE scores are generally valid for two years from the test date.
- **Do I need an English test for every European university?** Not always. Some universities accept a Medium of Instruction (MOI) certificate from your previous college, but many don't, and visa rules can differ from university rules. We'll check each case.
- **What is a credibility interview?** Some UK universities hold a short interview to make sure you're a genuine student who understands your course and plans. We prepare you for it.
- **Are classes online or at the branch?** **[CONFIRM with client before publishing.]**

**seo.title:** IELTS, PTE and Interview Training
**seo.description:** IELTS and PTE coaching, mock tests, and university and visa interview preparation for students planning to study abroad.

### 7.4 Financial Assistance — `financial-assistance`

**card.summary:** Scholarships, education loans and the bank documents your visa needs, explained in plain terms and without surprises later.
**card.highlights:** Scholarship search and applications · Education loan guidance

**hero.subtitle:** Money is usually the biggest worry for families, and it's where confusing advice does the most damage. We help you plan the full cost early and find the right way to fund it.

**intro:** Tuition is only part of the cost of studying abroad. There's living expenses, visa fees, health cover, travel and the funds you need to show the embassy. We help you put all of it on one page, find scholarships you qualify for, and understand your loan options before you sign anything.

**includes:**
- A full cost breakdown: tuition, living costs, visa and health costs, travel
- Finding scholarships you're eligible for and helping you apply
- Comparing education loan options from banks and NBFCs
- Help preparing loan application documents
- Guidance on the financial proof your visa requires
- Checking your bank statements and sponsor documents before submission

**howWeHelp:**
- We put every cost on paper before you commit, so your family isn't caught off guard six months in.
- For loans, we explain the real differences between secured and unsecured options: interest rates, margin money, moratorium periods and what the co-applicant needs. Then you decide.
- Visa financial rules are strict and specific. For example, the UK requires funds to be held for 28 consecutive days. We check your documents against the current rules for your country before anything is submitted.

**steps:**
1. **Map the full cost.** A clear estimate for your course, city and duration.
2. **Find scholarships.** We identify the ones you qualify for and help you apply.
3. **Plan the gap.** Work out how much needs to come from savings, sponsors or a loan.
4. **Choose a loan, if needed.** Compare lenders and prepare your application.
5. **Prepare visa funds.** Make sure your financial documents meet the embassy's rules.

**benefits:**
- **No hidden costs.** You know the full amount from the start.
- **Money you might have missed.** Scholarships many students never apply for.
- **Informed loan choices.** You understand the terms before you sign.
- **Fewer visa issues.** Financial documents checked before they're submitted.

**faqs:**
- **Can I get an education loan without collateral?** Often, yes. Several banks and NBFCs offer unsecured education loans, but the amount, interest rate and conditions depend on the lender, your course and university, and your co-applicant's income. We'll help you compare.
- **Are scholarships given automatically?** Some universities award them automatically with your offer. Others need a separate application and deadline. We'll tell you which is which for your shortlist.
- **How much money do I need to show for the visa?** It depends on the country, city and course length, and the amounts are revised from time to time. We check the current requirement for you.
- **Can my parents' savings be used as proof of funds?** In many countries, yes, with documents showing your relationship and their consent. The exact rules depend on the country.
- **Do you charge for loan assistance?** **[CONFIRM with client before publishing.]**

**seo.title:** Scholarships & Education Loan Assistance
**seo.description:** Help with study abroad costs: scholarships, education loan comparisons, and preparing financial documents for your student visa.

### 7.5 Visa Assistance — `visa-assistance`

**card.summary:** We prepare your visa file with you, check every document, and get you ready for the interview.
**card.highlights:** Document checklist and file review · Mock visa interviews

**hero.subtitle:** A visa refusal usually comes down to something small: a missing page, unexplained funds, an answer that doesn't match your application. Our job is to catch those before the embassy does.

**intro:** Once you've accepted your offer, the visa is the last big step. Every country has its own forms, documents and rules, and they change often. We prepare your file with you, check it carefully, and make sure you understand everything in it before you submit.

**includes:**
- A country-specific visa document checklist
- Line-by-line review of your documents before submission
- Help completing visa application forms
- Guidance on booking appointments and biometrics
- Financial document checks against the current rules
- Mock visa interviews where the country requires one
- Support if you've been refused before, or are refused this time

**howWeHelp:**
- We check that your visa file tells one consistent story. Your SOP, financial documents, academic records and interview answers should all match. Inconsistencies are one of the most common reasons for refusal.
- We keep up with the current requirements for each country we work with, and we'll tell you if something has changed since a friend applied last year.
- If you've had a refusal before, bring the refusal letter. We'll go through the reasons with you and fix them before you apply again.

**steps:**
1. **Get your checklist.** A document list specific to your country and situation.
2. **Collect and review.** We check every document as you gather it.
3. **Complete the application.** We help you fill in the forms accurately.
4. **Book your appointment.** Biometrics or interview, depending on the country.
5. **Prepare for the interview.** Mock sessions until you're confident.
6. **Submit and track.** We stay with you until the decision arrives.

**benefits:**
- **A complete, consistent file.** Fewer avoidable refusals.
- **Up-to-date guidance.** Based on current rules, not last year's.
- **Interview confidence.** You've practised the real questions.
- **Support after a refusal.** A clear plan if things don't go right the first time.

**faqs:**
- **Can you guarantee my visa?** No, and please be careful with anyone who says they can. The decision belongs to the embassy or immigration authority. What we do is make sure your file is complete and you're well prepared, which is what actually improves your chances.
- **How long does visa processing take?** It depends on the country and the time of year. Peak intake months are slower. We'll give you the current processing times when you apply.
- **Will I have to attend a visa interview?** It depends on the country. Some require an in-person interview, others only biometrics. We'll tell you what to expect for yours.
- **I was refused before. Can I still apply?** Usually, yes. We'll read the refusal letter with you, address each reason, and advise whether to reapply or, where possible, appeal.

**seo.title:** Student Visa Assistance
**seo.description:** Student visa support for the UK and Europe: document checklists, file review, application help and mock visa interviews.

### 7.6 Travel Assistance — `travel-assistance`

**card.summary:** Flights, forex, travel insurance and a place to stay, sorted before you leave rather than after you land.
**card.highlights:** Flight and forex guidance · Help finding accommodation

**hero.subtitle:** Once the visa comes through, there's suddenly a lot to arrange. We help you get it done properly, without paying more than you need to.

**intro:** Booking a student flight, sorting out money for the first few weeks, buying the right insurance and finding somewhere to live are all easy to get wrong when you're doing them for the first time. We help you plan each one so you land with a room to go to and money you can actually use.

**includes:**
- Guidance on student flight fares and extra baggage allowances
- Forex cards and international money transfer options
- Travel and health insurance that meets your visa requirements
- Help finding accommodation: university halls or private housing
- Airport pickup arrangements where the university offers it
- A checklist of what to carry in your hand luggage

**howWeHelp:**
- We'll tell you which things to book early (accommodation in popular cities fills up fast) and which can wait until closer to your flight.
- For accommodation, we help you compare options and check that what you're booking is genuine, because rental scams targeting new international students are real.

**steps:**
1. **Visa approved.** Now we plan your travel.
2. **Book accommodation.** Secure a place before you fly.
3. **Book flights.** Choose a fare with sensible baggage and change rules.
4. **Sort money and insurance.** Forex, transfers and the right cover.
5. **Final checks.** Documents, hand luggage and arrival plan.

**benefits:**
- **A place to stay before you land.** No scrambling in your first week.
- **Better value.** Student fares and sensible forex options.
- **The right cover.** Insurance that meets visa rules.
- **Fewer scams.** Help checking accommodation before you pay.

**faqs:**
- **When should I book my flight?** Usually after your visa is approved. Booking before that risks losing money if dates change.
- **Do I need travel or health insurance?** Many countries, including those in the Schengen area, require health insurance as part of the visa. Others, like the UK, charge a health surcharge with the visa application instead. We'll tell you what applies to you.
- **Can you help me find accommodation?** Yes. We help you compare university and private options and check them before you pay a deposit.
- **How much cash can I carry?** There are limits on how much foreign currency you can carry and when you must declare it. We'll explain the current rules before you travel.

**seo.title:** Travel Assistance for International Students
**seo.description:** Help with student flights, forex, travel and health insurance, and finding accommodation before you leave for your studies abroad.

### 7.7 Pre-Departure & Post-Landing Services — `pre-departure-post-landing`

**card.summary:** A proper briefing before you fly and someone to call after you land. The first few weeks matter more than people think.
**card.highlights:** Pre-departure briefing · Support after you arrive

**hero.subtitle:** Leaving home is a big moment for you and your family. We make sure you know what to expect when you arrive, and that you're not on your own once you're there.

**intro:** The first few weeks abroad are when students feel most lost: new city, new systems, new everything. Our pre-departure briefing prepares you for it, and our post-landing support means there's still someone you know to call once you've arrived.

**includes:**
- A pre-departure briefing, with parents welcome
- A packing checklist suited to your destination and season
- What to do in your first week: university registration, local registration where required, bank account, SIM card
- Getting around: transport, student discounts, finding essentials
- An introduction to other students heading to the same city or university
- Guidance on part-time work rules for your visa
- Support by phone or WhatsApp after you land **[CONFIRM support period]**

**howWeHelp:**
- Our briefing covers the practical things nobody tells you: what to carry in your hand luggage, how your first day on campus works, and the documents you'll need in your first week.
- Where we can, we connect you with other students going to the same city, so you've got familiar faces when you land.
- After you arrive, you can still reach us. Whether it's a question about registration, work rules or something that's just not going right, we'll help you work it out.

**steps:**
1. **Attend the briefing.** In person or online, a few weeks before you fly.
2. **Pack and prepare.** Follow your checklist and keep key documents handy.
3. **Meet your batch.** Connect with students heading the same way.
4. **Land and settle in.** Follow your first-week plan.
5. **Stay in touch.** Reach us whenever you need help.

**benefits:**
- **Fewer first-week surprises.** You know what to do and in what order.
- **Peace of mind for parents.** They know you have support abroad.
- **A ready-made network.** Friends before you arrive.
- **Someone to call.** Help doesn't stop when you board the plane.

**faqs:**
- **What happens in the pre-departure briefing?** We cover travel day, arrival, your first week's tasks, money, accommodation, safety, part-time work rules and life in your city, and answer every question you and your parents have.
- **Can I contact you after I land?** Yes. You can reach us by phone or WhatsApp. **[CONFIRM support period]**
- **Will you find me a part-time job?** We explain the work rules for your visa and how students usually find part-time jobs, but we don't place students in jobs. **[CONFIRM]**
- **Will there be other students from Kerala going to my university?** Often, yes. Where there are, we'll introduce you before you travel.

**seo.title:** Pre-Departure & Post-Landing Support
**seo.description:** Pre-departure briefings, packing checklists, first-week guidance and ongoing support after you land for international students.

### 7.8 Country blurbs (`countries.js`)

**[CONFIRM the final country list with the client.]**

- **United Kingdom:** Shorter master's programmes, globally recognised degrees and a large Indian student community.
- **United States:** A wide choice of universities and courses, with flexibility to explore subjects before you specialise.
- **Canada:** Well-regarded colleges and universities, with a welcoming, multicultural environment.
- **Australia:** Strong universities, a relaxed lifestyle and a large international student population.
- **Germany:** Highly regarded public universities, many with low or no tuition fees, especially for technical courses.
- **France:** Respected universities and business schools, with a growing number of English-taught programmes.
- **Hungary:** Affordable tuition and living costs, popular English-taught programmes, and a central location in Europe.

---

## 8. Components to create or refactor

```
src/
  context/AppointmentContext.jsx
  layouts/MainLayout.jsx
  pages/
    HomePage.jsx
    CountriesPage.jsx
    ServicesPage.jsx
    ServiceDetailPage.jsx
    UniversitiesPage.jsx
    UniversityDetailPage.jsx
    SuccessStoriesPage.jsx
    NotFoundPage.jsx
  components/
    shared/PageHero.jsx          // navy band + breadcrumb + h1 + subtitle + buttons
    shared/Breadcrumb.jsx
    shared/FaqAccordion.jsx
    shared/StepsTimeline.jsx
    shared/ServiceCard.jsx       // used on homepage, /services, "Other services"
    shared/UniversityCard.jsx
    shared/VisaApprovalCard.jsx
    shared/StoryCard.jsx
    shared/YouTubeFacade.jsx
    shared/Lightbox.jsx
    shared/ScrollToTop.jsx       // Lenis-aware, handles hashes
  data/
    services.js  countries.js  universities.js  visaApprovals.js  successStories.js
  utils/formatDate.js            // '2024-10-13' → '13 Oct 2024' (en-IN)
```

Refactor `ServicesSection`, `UniversityPartnersSection`, `VisaSuccessSection`, `TestimonialsSection`, `Header` and `Footer` to read from the data files and use the shared cards.

---

## 9. Placeholder rules

- If an optional field is `null` or an empty array, **hide that row or section**. Don't show an empty label.
- Missing student photo → initials avatar, using the existing style.
- Missing university logo → the existing building-icon tile.
- `isPlaceholder: true` items render normally in development. Before launch they must be replaced or removed. Add a `scripts/check-placeholders.js` that lists every placeholder item and every **[CONFIRM]** string in `src/data/`, and wire it to `npm run check:content`.

---

## 10. Acceptance checklist

- [ ] Every nav and footer link goes somewhere real. There are no `href="#"` links left.
- [ ] Services dropdown (desktop and mobile) lists the 7 services in order and each one opens the correct page.
- [ ] `/services/{each slug}` renders all sections, and the FAQ accordion works with the keyboard.
- [ ] Unknown slugs render the 404 page.
- [ ] Hero "Explore Top Destinations" goes to `/countries`, and country tiles go to the filtered universities page.
- [ ] `/universities?country=hungary` loads already filtered, and changing the filter updates the URL.
- [ ] University cards open `/universities/{slug}` and missing fields are hidden.
- [ ] Visa approval cards show no visa reference numbers, say "National Visa (Type D)" for Hungary, and only show "View Story" when a story exists.
- [ ] "View All Success Stories" and "Read More" go to `/success-stories` and `/success-stories#{id}`, and the hash scrolls correctly through Lenis.
- [ ] The appointment modal opens from every CTA on every page and pre-fills service, country or university.
- [ ] Navigating between pages starts at the top. GSAP animations fire correctly on the second and third pages visited, with no stale ScrollTriggers.
- [ ] Hard refreshing any route works (rewrite files present).
- [ ] Each page has a unique title and meta description.
- [ ] No layout breaks at 360px, 768px, 1280px or 1536px.
- [ ] `prefers-reduced-motion` disables the stagger and scroll animations.
- [ ] `npm run build` passes with no console errors.
- [ ] `npm run check:content` lists every remaining placeholder and [CONFIRM] item.

Work in this order: routing + layout → data files → header/footer → services pages → homepage updates → countries → universities → success stories → modal → QA checklist. After each stage, run the dev server and confirm nothing on the homepage regressed.
