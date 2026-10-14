# Antigravity Prompt — About Us Page

## 0. Context

Same project: React 18 + Vite + Tailwind, react-router-dom, AppointmentContext, shared components in `src/components/shared/` (PageHero, Breadcrumb, StoryCard, etc.), data files in `src/data/`.

Right now "About Us" in the header and footer points to `/#about`. Build a real **`/about`** page. If the homepage has an existing "Our Journey" or about section, **replace it on the About page with the new sections below**. Don't duplicate it, and don't delete anything from the homepage unless this prompt says so.

### Hard rules

1. **Use the copy in this file exactly as written.** Don't add marketing claims, statistics, years ("since 2008"), awards or badges.
2. **Reuse the existing design system:** colours, fonts, radius, shadows, buttons and section spacing.
3. **No new npm dependencies.**
4. **Wrap any GSAP in `gsap.context()` with cleanup**, and respect `prefers-reduced-motion`.
5. **Mobile first.** No horizontal scroll at 360px.
6. **Images:**
   - Download every new image into `public/images/...` instead of hotlinking.
   - No identifiable real public figures.
   - Every image needs meaningful `alt` text.
7. **Work in the two stages in Section 9 and stop after each one.**

---

## 1. Routing and navigation

- Add a lazy-loaded route: `/about` → `src/pages/AboutPage.jsx`, inside MainLayout.
- Header "About Us" → `/about`, with an active state on `/about`.
- Footer "About Us" → `/about`.
- **Helmet:**
  - Title: `About Us | Adam International`
  - Description: `Adam International helps students choose the right course and university in Europe and beyond, with support from admission and visa to pre-departure.`
- **No FinalCtaBanner on this page.** The CTA in Section 8 replaces it.

---

## 2. Data changes

### 2.1 `src/data/countries.js`: add 6 European countries

Add these with `region: 'Europe'` and `universityCount: null`. Download a fitting landmark or city image for each (no identifiable people) into `public/images/countries/`. Add `// CONFIRM WITH CLIENT: country offered + blurb` above the new entries.

| slug | name | flag | blurb |
|---|---|---|---|
| `slovenia` | Slovenia | 🇸🇮 | A small Central European EU country with a growing number of English-taught programmes. |
| `slovakia` | Slovakia | 🇸🇰 | A Central European EU country with English-taught programmes and living costs lower than much of Western Europe. |
| `latvia` | Latvia | 🇱🇻 | A Baltic EU country, with Riga as its main study hub and English-taught programmes across many subjects. |
| `lithuania` | Lithuania | 🇱🇹 | A Baltic EU country with universities in Vilnius and Kaunas offering English-taught programmes. |
| `malta` | Malta | 🇲🇹 | An EU island country where English is an official language, which makes everyday life easier for international students. |
| `bulgaria` | Bulgaria | 🇧🇬 | An EU country known for comparatively low tuition and living costs, and popular English-taught programmes, especially in medicine. |

These automatically appear on `/countries`, in the booking form's country dropdown, in the server's allowed list and in the admin filters. Confirm all four still work after the change.

### 2.2 `src/data/branches.js`: expand each branch to an object

```js
export const branches = [
  { slug: 'kochi', name: 'Kochi (Head Office)', city: 'Kochi', address: 'MAF Plaza, Edappally-Panvel Highway, Kochi, Kerala', phone: '+91 9895 890 500', lat: 9.9312, lng: 76.2673, isHeadOffice: true },
  { slug: 'kozhikode', name: 'Kozhikode', city: 'Kozhikode', address: null, phone: null, lat: 11.2588, lng: 75.7804 },
  { slug: 'trivandrum', name: 'Trivandrum', city: 'Thiruvananthapuram', address: null, phone: null, lat: 8.5241, lng: 76.9366 },
  { slug: 'bangalore', name: 'Bangalore', city: 'Bengaluru', address: null, phone: null, lat: 12.9716, lng: 77.5946 },
  { slug: 'mangalore', name: 'Mangalore', city: 'Mangaluru', address: null, phone: null, lat: 12.9141, lng: 74.8560 },
  { slug: 'alappuzha', name: 'Alappuzha', city: 'Alappuzha', address: null, phone: null, lat: 9.4981, lng: 76.3388 },
];
// CONFIRM WITH CLIENT: full address and phone for every branch except Kochi.
// lat/lng are city-centre coordinates, used only to find the nearest branch.
```

**Don't break anything that uses branches:**
- The booking form dropdown and `api/_lib/allowed.js` must still use the branch **`name`** (e.g. "Kochi (Head Office)"), because leads already store names.
- Update every import of `branches` to read `.name`.
- Re-run `scripts/test-lead.js` to confirm branch validation still works, then delete the test rows.

### 2.3 AppointmentContext

`openAppointment()` must also accept `{ branch }`, pre-filling the "Nearest branch" field with the branch name.

---

## 3. Section 1: Hero

Build a **full-width hero** (taller than PageHero, similar in weight to the homepage hero), with the breadcrumb `Home / About Us`.

- **H1:** `Your Journey to European Education Starts Here`
- **Sub:** `From choosing the right course and university to admission, visa assistance and pre-departure support, Adam International helps students turn their study-abroad ambitions into reality.`
- **Buttons:**
  - Primary (gold): `Book a Free Consultation` → `openAppointment()`
  - Secondary (outline): `Explore Our Destinations` → `/countries`
- **Image:** a professional, high-quality photo of international students on a **European university campus**, or a recognisable European campus building. Not a generic office or laptop shot, and no identifiable celebrities. Download it to `public/images/about/hero.jpg` (compress to under 300 KB, width around 1920px). Use a navy gradient overlay so the text stays readable. Tell me the source URL you used.

---

## 4. Section 2: Who We Are

Layout: a two-column split on desktop (text left, image or collage right) and stacked on mobile. This replaces any old "Our Journey" block on the About page.

- **Eyebrow:** `WHO WE ARE`
- **Heading:** `Who We Are`
- **Text:** `Adam International is an overseas education consultancy dedicated to helping students discover the right academic opportunities in Europe and other international destinations. We provide personalized guidance based on each student's academic background, career goals, preferred destination and budget.`
- **4 highlights** as small icon pills or mini-cards in a 2×2 grid. Each has an icon and a title only:
  - `Study Abroad Guidance` (Compass)
  - `European Destinations` (Globe2)
  - `University & Course Selection` (GraduationCap)
  - `Visa & Admission Assistance` (FileCheck2)
- **Image:** a second campus or student image, also downloaded locally.

---

## 5. Section 3: Why Students Choose Adam International

- **Eyebrow:** `WHY CHOOSE US`
- **Heading:** `Why Students Choose Adam International`
- **6 cards:** 3 columns on desktop, 2 on tablet, 1 on mobile. Each card has an icon in a soft gold tile, a title and one line of text. Add a subtle hover lift, and a GSAP stagger on scroll.

| Icon | Title | Text |
|---|---|---|
| UserRound | Personalized Counselling | Guidance based on your academic profile, career goals and preferred destination. |
| GraduationCap | University & Course Guidance | Explore suitable universities and courses based on your interests and eligibility. |
| ClipboardCheck | Complete Application Support | Support with applications, documentation and admission procedures. |
| FileCheck2 | Visa Assistance | Guidance throughout the student visa application process. |
| Plane | Pre-Departure Support | Preparation for travel, accommodation and your transition to studying abroad. |
| HeartHandshake | Continued Student Support | Support even after you begin your international education journey. |

---

## 6. Section 4: Explore Europe With Adam International

- **Eyebrow:** `EUROPEAN DESTINATIONS`
- **Heading:** `Explore Europe With Adam International`
- **Sub:** `Pick a country to see the universities we work with there, or talk to an advisor about your options.`
- **8 country cards**, in this order: Hungary, Slovenia, Slovakia, Latvia, Lithuania, Malta, Bulgaria, Germany. Read them from `countries.js` by slug. Show 4 columns on desktop, 2 on tablet and 2 on mobile.
- **Each card** shows the image, the flag and the country name, and the whole card is clickable. The image gently zooms on hover.
  - **If the country has at least one university** in `universities.js`, the card shows `Explore Universities →` and links to `/universities?country={slug}`.
  - **If it has none**, the card shows `Ask an Advisor →` and calls `openAppointment({ country: slug })`. Never link to an empty page.
- **Below the grid:** a text link `See all destinations →` that goes to `/countries`.

---

## 7. Section 5: What Our Students Say

- **Eyebrow:** `STUDENT STORIES`
- **Heading:** `What Our Students Say`
- **Show exactly 3 testimonials from `successStories.js`.** Prefer stories with `consentOnFile: true`; otherwise use the first 3. **Do not write any new testimonial text or names.** Use the existing `quote` field.
- **Each card shows:**
  - the photo, or initials if there is none
  - the name
  - the country with its flag
  - the university
  - the quote
  - 5 stars only if `rating` exists. Hide the stars if it's null; don't default to 5.
- **Under each card:** `Read their story →`, linking to `/success-stories#{id}`.
- **Under the section:** `View All Success Stories →`, linking to `/success-stories`.

---

## 8. Section 6: Visit Us, then Section 7: CTA

### Visit Us

- **Eyebrow:** `OUR BRANCHES`
- **Heading:** `Visit Us`
- **Sub:** `Meet an advisor in person at any of our six offices across Kerala and Karnataka.`
- **Layout:** branch cards on the left (a 2×3 grid on desktop, stacked on mobile) and a map on the right (stacked below the cards on mobile).
- **Each branch card shows:**
  - the branch name, with a small `Head Office` badge for Kochi
  - the address, if it exists
  - the phone as a `tel:` link, falling back to the main number +91 9895 890 500
  - `Book a visit` → `openAppointment({ branch: branch.name })`
  - `Get directions`, **only when `address` exists**: `https://www.google.com/maps/search/?api=1&query={encodeURIComponent(address)}` opening in a new tab
- **Clicking a card selects it** and shows it on the map. Kochi is selected by default.
- **Map:** a lazy-loaded iframe `https://www.google.com/maps?q={encodeURIComponent(address)}&output=embed` with `loading="lazy"` and `title="Map of {branch name}"`. **Only show the map for branches with an address.** For the others, show a simple navy panel: `Full address coming soon. Call +91 9895 890 500 for directions.`
- **Button: `Find Your Nearest Office →`**
  - **On click:** ask for the browser's location (`navigator.geolocation`). Work out the nearest branch with the haversine formula using `lat`/`lng`, select that card and scroll it into view, then show: `Your nearest office is {name}.`
  - **If location is denied or unavailable:** show `We couldn't get your location. Pick the office closest to you below.`
  - **Never send the location anywhere.** It's only used in the browser.

### CTA

Make it **visually stronger than FinalCtaBanner**: a full-width navy band with a gold accent and a large heading. The last section before the footer.

- **Heading:** `Ready to Start Your Study Abroad Journey?`
- **Sub:** `Let's find the right country, course and university for you.`
- **Buttons:**
  - Primary (gold): `Book a Free Consultation` → `openAppointment()`
  - Secondary: `Talk to an Expert` → the same WhatsApp link used in FinalCtaBanner, opening in a new tab
- **Small line under the buttons:** `Or call us on +91 9895 890 500`, as a `tel:` link.

---

## 9. Stages (stop after each and report)

**Stage A:**
- Section 1 (route and nav), Section 2 (countries, branches, AppointmentContext)
- Confirm the booking form, server validation (`scripts/test-lead.js`) and admin filters still work with the new countries and the branch objects
- Delete test rows

**Stage B:**
- Build the full About page (Sections 3–8)
- Report every image source URL used
- Run `npm run build`
- Confirm there's no horizontal scroll at 360px
