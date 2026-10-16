# Antigravity Prompt — Events Page

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis, Neon + Vercel `/api/lead`, admin panel. These already exist: PageHero, InlineEnquiryForm, `formFields.js`, SelectField, ActionButton, FinalCtaBanner, `contact.js`, `countries.js`, and the country images in `public/images/countries/`.

Build an **Events** section from the client's content: a listing page at **`/events`** and a page per event at **`/events/:slug`**.

### Hard rules

1. **Copy:** use the client text in Section 3 **exactly**. The only edits allowed are the ones already applied in this file: the duplicate heading removed, and `--` changed to `–`.
2. **No invented facts.** No exact dates, venues, times, universities, fees or award details beyond what Section 3 gives. Missing fields are `null` and are **hidden** in the UI. Never show "null", "TBD" or an empty label.
3. **No stock photos of people or events.** Event visuals are designed banners (Section 4.3), built from the existing local country images plus text.
4. **Every on-the-spot offer letter mention must show its condition.** Anywhere the site says "offer letter on the spot" (cards, badges, banners, the homepage strip), show the client's condition text next to it: *subject to eligibility and university approval*. Never show the claim alone.
5. **No new npm dependencies.**
6. **GSAP and layout:** use `gsap.context()` with cleanup and respect `prefers-reduced-motion`. Mobile first, with no horizontal scroll at 360px.
7. **Don't open a browser.** Run `npm run build` and `scripts/test-lead.js` at the end.
8. **Work in the two stages in Section 8** and stop after each one.

---

## 1. Data: `src/data/events.js`

Add this comment at the top of the file:

`// CONFIRM WITH CLIENT: exact dates, times and venues; awarding organisation and photo for the award.`

### Schema

```js
{
  slug,
  type,            // 'spot-admission' | 'award'
  title,
  tagline,         // short line under the title (may be null)
  country,         // countries.js slug, or null
  date,            // 'YYYY-MM-DD' exact date, or null
  month,           // 'YYYY-MM' when only the month is known, or null
  year,            // 'YYYY' when only the year is known, or null
  location,        // string or null
  organisedBy,     // string or null
  highlight,       // short highlight line or null
  conditionNote,   // the eligibility condition text, or null
  summary,         // 1–2 sentences for cards
  body,            // array of paragraphs (exact client text)
  closingLine,     // bold closing line, or null
  facts,           // [{ label, value }] in client wording
  image,           // banner background: country image path, or null
  photo,           // real event photo from the client, or null
  awardingBody,    // award only: null until the client confirms it
  registrationOpen // true for spot admissions, false for the award
}
```

### Date display and upcoming/past

Write `getEventDateLabel(event)` and `getEventStatus(event)` in `src/lib/events.js`. Use Asia/Kolkata time.

| Data available | Label shown | Becomes "past" after |
|---|---|---|
| `date` | `25 September 2026` | the end of that day |
| `month` | `October 2026` | the end of that month |
| `year` only | `2026 · Date to be announced` | the end of that year |

- When an event becomes **past**, its registration form is replaced by: `This event has ended. Talk to an advisor about upcoming spot admissions.` with a **Book a Free Consultation** button.
- The `award` type is always shown under **Recent News & Achievements**, never as upcoming.

---

## 2. Backend: new `event` form type

### Database

Append to `db/schema.sql` (keep it idempotent), then run `npm run db:apply`:

```sql
alter table leads drop constraint if exists leads_form_type_chk;
alter table leads add constraint leads_form_type_chk
  check (form_type in ('appointment','eligibility','admission','visa','training','contact','event'));
```

### Form fields and server

- **`formFields.js`:** add form type `event`, labelled `Event registration`. Add a field `eventSlug`, labelled `Event`.
  - Its options are the events with `registrationOpen: true` that are not past.
  - On an event page it's pre-filled and hidden; the event title shows as read-only text above the form instead.
- **Allowed fields for `event`:** `eventSlug`, `qualification`, `country`, plus `message`.
- **Server validation:** `eventSlug` must be the slug of an existing event with `registrationOpen: true`. Otherwise return 400.

### Admin panel

- `Event registration` appears in the form type filter and as the row label.
- The drawer shows **Event** using the event **title**, not the slug.
- The CSV export includes the event title.

### Tests

Extend `scripts/test-lead.js` with:
- a valid registration for `hungary-spot-admission-october-2026`
- an unknown `eventSlug` (rejected)
- registration for the award slug (rejected)

Delete the test rows afterwards.

---

## 3. The 4 events (exact client content)

### 3.1 `consumer-protection-award-2026` (type `award`)

- **title:** `Adam International Honoured with the Consumer Protection Award 2026`
- **tagline:** null
- **country:** null · **date:** `2026-09-25` · **location:** null · **organisedBy:** null
- **image:** null · **photo:** null · **awardingBody:** null · **registrationOpen:** false
- **summary:** `Adam International is proud to announce that we received the Consumer Protection Award on 25 September 2026, marking a special milestone in our journey.`
- **body:**
  1. `Adam International is proud to announce that we received the **Consumer Protection Award on 25 September 2026**, marking a special milestone in our journey.`
  2. `This recognition is an encouragement to continue our commitment to providing reliable, transparent, and student-focused overseas education consultancy services. At Adam International, we believe that every student deserves the right guidance, accurate information, and support to make informed decisions about their educational future.`
  3. `As we help students explore higher education opportunities across Europe, we remain dedicated to building trust, maintaining transparency, and guiding students throughout their study-abroad journey.`
  4. `Receiving this award inspires us to strengthen our commitment to responsible service and student satisfaction. We extend our sincere gratitude to everyone who has supported us and contributed to our growth.`
- **closingLine:** `This achievement marks another proud chapter in the Adam International journey, motivating us to continue helping students turn their European education dreams into reality.`
- **facts:** `[{ label: 'Date', value: '25 September 2026' }]`. When `awardingBody` is filled later, also show `{ label: 'Awarded by', value: awardingBody }`.
- **Visual:** while `photo` is null, use a typographic award card: a navy background, a gold trophy icon (lucide `Award` or `Trophy`), "Consumer Protection Award" and "25 September 2026". When `photo` is set, show the photo instead.
- **Code comment:** `// CONFIRM WITH CLIENT: awarding organisation name + award/certificate photo. Do not name an awarding body until confirmed.`

### 3.2 `hungary-spot-admission-october-2026` (type `spot-admission`)

- **title:** `Hungary Spot Admission – October 2026`
- **tagline:** `Get Your Offer Letter on the Spot!`
- **country:** `hungary` · **month:** `2026-10` · **location:** `Kochi, Kerala` · **organisedBy:** `Adam International`
- **highlight:** `Get your offer letter on the spot`
- **conditionNote:** `Subject to university requirements and document verification.`
- **image:** `/images/countries/hungary.jpg` · **registrationOpen:** true
- **summary:** `Explore higher education options in Hungary and, if eligible, receive your university offer letter on the spot.`
- **body:**
  1. `Adam International is excited to announce the Hungary Spot Admission event for October 2026, offering students an opportunity to explore higher education options in Hungary and take the next step towards their European education journey.`
  2. `The highlight of this event is the opportunity for eligible students to receive their university offer letter on the spot, subject to university requirements and document verification. Students can interact with university representatives, learn more about available courses and admission requirements, and receive guidance on the application process.`
  3. `This event is an excellent opportunity for students who wish to pursue higher education in Hungary and want a more direct and convenient admission experience.`
  4. `At Adam International, we are committed to helping students discover the right educational opportunities in Europe through personalised guidance and admission support.`
- **closingLine:** `Take the first step towards your future in Hungary with Adam International!`
- **facts:**
  - `Event`: `Hungary Spot Admission`
  - `Month`: `October 2026`
  - `Location`: `Kochi, Kerala`
  - `Organised by`: `Adam International`

### 3.3 `slovenia-spot-admission-october-2026` (type `spot-admission`)

- **title:** `Slovenia Spot Admission – October 2026`
- **tagline:** `Your Gateway to European Education Starts Here!`
- **country:** `slovenia` · **month:** `2026-10` · **location:** null · **organisedBy:** `Adam International`
- **highlight:** `Get your offer letter on the spot`
- **conditionNote:** `Subject to eligibility and university approval.`
- **image:** `/images/countries/slovenia.jpg` · **registrationOpen:** true
- **summary:** `Explore study opportunities in Slovenia and get the chance to receive your offer letter on the spot.`
- **body:**
  1. `Adam International is bringing an exciting opportunity for students who dream of pursuing higher education in Slovenia. Our **Slovenia Spot Admission – October 2026** event is designed to help aspiring students explore study opportunities and take the next step towards their European education journey.`
  2. `The highlight of this event is the opportunity to **receive an offer letter on the spot**, subject to eligibility and university requirements. Students can connect with the admission team, explore available study options, and get guidance on the admission process.`
  3. `This is a valuable opportunity for students looking for a more direct and convenient way to begin their study-abroad journey.`
- **closingLine:** `Join Adam International and take your first step towards studying in Slovenia!`
- **facts:**
  - `Event`: `Slovenia Spot Admission – October 2026`
  - `Special Highlight`: `Get your offer letter on the spot, subject to eligibility and university approval.`
  - `Contact`: `Get in touch with Adam International for event details and registration.`

### 3.4 `spain-spot-admission-2026` (type `spot-admission`)

- **title:** `Spain Calling! Your Admission, Your Opportunity.`
- **tagline:** `Spain Spot Admission 2026 – One Step Closer to Your European Dream`
- **country:** `spain` · **year:** `2026` · **location:** null · **organisedBy:** `Adam International`
- **highlight:** `Opportunity for on-the-spot offer letters`
- **conditionNote:** `Subject to eligibility and university approval.`
- **image:** `/images/countries/spain.jpg` · **registrationOpen:** true
- **summary:** `Discover study opportunities in Spain, get expert admission guidance, and take the chance to receive your offer letter on the spot.`
- **body:**
  1. `What if your dream of studying in Spain could take a big step forward in just one day?`
  2. `Adam International brings you an exciting opportunity to explore higher education in Spain through our **Spain Spot Admission 2026** event. Discover study opportunities, get expert admission guidance, and take advantage of the opportunity to **receive your offer letter on the spot**, subject to eligibility and university approval.`
  3. `No need to wait to explore your possibilities. Meet our team, learn about your options, and take the first step towards your international education journey.`
  4. `**Your future in Spain could start here. Are you ready?**`
- **closingLine:** `Take your first step towards Spain. Let your European journey begin!` (render it in *italic*, as in the client doc)
- **facts:**
  - `Event`: `Spain Spot Admission 2026`
  - `Special Feature`: `Opportunity for on-the-spot offer letters`
  - `Organised by`: `Adam International`

**Formatting:** body text uses `**bold**`. Render it with a tiny inline formatter (only `**…**` → `<strong>`); don't use dangerouslySetInnerHTML with raw HTML.

---

## 4. `/events` listing page

**Helmet:**
- Title: `Events`
- Description: `Spot admission events and news from Adam International.`

### 4.1 Hero

Use PageHero, with breadcrumb `Home / Events`.

- **H1:** `Events & News`
- **Sub:** `Spot admission events, achievements and updates from Adam International.`

### 4.2 Sections

1. **`Upcoming Events`** lists the spot admissions that are not past, sorted by date (known dates first, then month, then year).
   - **Empty state:** `New events will be announced soon. Talk to an advisor about upcoming spot admissions.` with **Book a Free Consultation**.
2. **`Recent News & Achievements`** lists the award, plus any past events, newest first. Hide the section if it's empty.

### 4.3 Event card

Use 2 columns on desktop and 1 on mobile, with equal heights.

- **Banner (16:9):** the country image with a navy gradient overlay, the flag, and the event title in white. For the award, use the typographic award card instead.
- **Badges:**
  - a type badge: `Spot Admission` or `Achievement`
  - an `Upcoming` badge, or a `Past event` badge
- **Info line:** a date line with a calendar icon (`getEventDateLabel`), and a location line with a pin icon **only if `location` exists**.
- **Summary:** clamped to 3 lines.
- **Highlight:** for spot admissions, a gold pill with `highlight`, followed by `conditionNote` in small muted text directly under it.
- **Buttons:**
  - spot admissions that are upcoming: `View Details` (link) and `Register Interest` (link to `/events/{slug}#register`)
  - the award: `Read More`

---

## 5. `/events/:slug` event page

An unknown slug renders NotFoundPage.

**Helmet:**
- Title: `{title}`
- Description: the event's `summary`
- `og:image` = `image`, or the site default

**Event JSON-LD:** output it **only** when an exact `date` exists and the type is a spot admission. The award gets no Event schema.

### Sections, in order

1. **Hero banner**
   - Background: the country image with a navy overlay (or the award card).
   - Breadcrumb: `Home / Events / {title}`.
   - Type badge and status badge.
   - H1 `title`, with `tagline` under it.
   - Date line, plus the location line if it exists.
   - Spot admissions only: the highlight pill, then the condition note, then a **Register Interest** button that scrolls to `#register`.
2. **Two columns on desktop, stacked on mobile**
   - **Left:** the `body` paragraphs, then `closingLine` in bold (italic for Spain).
   - **Right:** a sticky **Event details** card listing `facts` as label and value rows, plus the date row.
     - The award shows its date, plus "Awarded by" once confirmed.
     - Spot admissions add a link to the country page: `Explore {country name}` → `/countries/{slug}`.
3. **Registration section, `id="register"`** (spot admissions only)
   - **Heading:** `Register Your Interest`
   - **Sub:** `Leave your details and our team will contact you with the event date, venue and next steps.`
   - **Form:** InlineEnquiryForm with formType `event`, `eventSlug` pre-filled, and these fields:
     - qualification
     - country, pre-filled with the event's country name
     - message
   - **Button:** `Register Interest`
   - **Success message:**
     - Title: `Thanks, you're registered.`
     - Text: `Our team will contact you with the event details, usually within one working day.`
   - **If the event is past**, show the "This event has ended…" message from Section 1 instead of the form.
4. **More events:** up to 3 other events as cards. Hide the section if there are none.
5. **CTA:** FinalCtaBanner.

---

## 6. Navigation and homepage

- **Header:** add `Events` between `Gallery` and `Blog`, pointing to `/events`, with an active state on `/events` and `/events/*`.
  - Check the desktop header at **1280px** and **1024px**. If the items wrap or crowd the Book Appointment button, reduce the gap between nav items. Report the result.
  - Add `Events` to the mobile menu as well.
- **Footer:** add `Events` to the Quick Links.
- **Homepage:** add a compact `Upcoming Events` strip just before `FinalCtaBanner`.
  - **Content:** up to 3 upcoming spot admissions, each shown as a small horizontal card with the flag, title, date label, the highlight plus its condition note, and `View Details`.
  - **Link:** a `View All Events` link pointing to `/events`.
  - **Hide the strip** when there are no upcoming events.
- **Country pages:** on `/countries/hungary`, `/countries/slovenia` and `/countries/spain`, show a small `Upcoming event` banner under the hero that links to the event, but **only while that event is upcoming**.

---

## 7. Acceptance checklist

- [ ] `/events` shows 3 upcoming spot admissions and the award under Recent News & Achievements.
- [ ] Date labels show `October 2026` (Hungary, Slovenia), `2026 · Date to be announced` (Spain) and `25 September 2026` (award). No location line on Slovenia, Spain or the award.
- [ ] Every "offer letter on the spot" claim has its condition note right next to it.
- [ ] The award shows no awarding body and no Event JSON-LD.
- [ ] Event pages render all client paragraphs word for word. The duplicate Hungary heading is gone.
- [ ] A registration from the Hungary page reaches `/admin` as `Event registration`, showing the event title.
- [ ] `test-lead.js` passes, with the unknown-slug and award-slug registrations rejected. Test rows are deleted.
- [ ] **Temporary check:** set Hungary's `month` to `2026-09` locally. It moves to Recent and its form is replaced by the "This event has ended" message. **Then revert it.**
- [ ] `Events` appears in the header (desktop and mobile) and the footer. The header doesn't wrap at 1024px or 1280px.
- [ ] The homepage Upcoming Events strip shows 3 events. The Hungary, Slovenia and Spain country pages show the event banner.
- [ ] `/events/abc` renders the 404 page.
- [ ] 360px: no horizontal scroll on `/events` or an event page.
- [ ] `npm run build` passes.

---

## 8. Stages

**Stage A:**
- Sections 1 and 2 (data, date logic, backend, admin, tests) and Section 3 (event data)
- Stop and report

**Stage B:**
- Sections 4, 5 and 6 (pages, navigation, homepage strip, country banners)
- Run the Section 7 checklist
- Stop and report
