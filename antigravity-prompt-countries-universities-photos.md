# Antigravity Prompt — Client Data Update: Countries, Universities, Student Photos

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis, Neon + Vercel `/api/lead`, admin panel, `src/lib/contentFlags.js` (`SHOW_PLACEHOLDERS`), SAMPLE badges.

The client has sent their **official list of countries and universities**. This task:
1. replaces the country list,
2. adds the client's universities,
3. replaces the sample student photos with photos of Indian students.

**The Events page is out of scope.** Don't touch it.

### Hard rules

1. **No invented facts.** The client gave country names and university names only. Don't add fees, programmes, rankings, intakes, websites, logos or descriptions. Missing details stay `null` or empty, and the existing "Full details for this university are being updated" fallback handles them.
2. **Use the names and cities exactly as listed in this file.** Don't "correct" them.
3. **No new npm dependencies.**
4. **Don't break leads.** The booking form, the inline forms, `api/_lib/allowed.js` and the admin filters all read `countries.js` by **name**. Leads already in the database keep their stored values.
5. **Images:** download locally, verify each image actually shows what it should before using it, no identifiable public figures, and report a table. Prefer Unsplash or Pexels; any Wikimedia image goes into `imageCredits.js` with author, licence, licence link, exact source URL and "Resized and compressed".
6. **Avoid loops.** Max 3 search attempts per image; if a download fails twice, skip it and list it in the report. **Don't open a browser.**
7. **Work in the three stages in Section 5** and stop after each one.

---

## 1. Countries (`src/data/countries.js`)

### 1.1 Final list: exactly 30 countries

**Remove** `united-states` completely (data, image, any references).

Keep the 12 existing countries (United Kingdom, Canada, Australia, Germany, France, Hungary, Slovenia, Slovakia, Latvia, Lithuania, Malta, Bulgaria) with their current fields, then **add these 18**, using the same schema as the existing entries (`intro: null`, `visa: { overview: null, officialLinks: [] }`, `lastChecked: null`, `universityCount: null`, `featured: false`, empty `comparison` object):

| slug | name | flag | region | article |
|---|---|---|---|---|
| `austria` | Austria | 🇦🇹 | Europe | |
| `belgium` | Belgium | 🇧🇪 | Europe | |
| `croatia` | Croatia | 🇭🇷 | Europe | |
| `czech-republic` | Czech Republic | 🇨🇿 | Europe | the |
| `denmark` | Denmark | 🇩🇰 | Europe | |
| `estonia` | Estonia | 🇪🇪 | Europe | |
| `finland` | Finland | 🇫🇮 | Europe | |
| `italy` | Italy | 🇮🇹 | Europe | |
| `luxembourg` | Luxembourg | 🇱🇺 | Europe | |
| `netherlands` | Netherlands | 🇳🇱 | Europe | the |
| `poland` | Poland | 🇵🇱 | Europe | |
| `romania` | Romania | 🇷🇴 | Europe | |
| `spain` | Spain | 🇪🇸 | Europe | |
| `sweden` | Sweden | 🇸🇪 | Europe | |
| `switzerland` | Switzerland | 🇨🇭 | Europe | |
| `ireland` | Ireland | 🇮🇪 | Europe | |
| `georgia` | Georgia | 🇬🇪 | Other destinations | |
| `vietnam` | Vietnam | 🇻🇳 | Other destinations | |

- **Region values:** use exactly the strings the existing entries use (`'Europe'` and the existing "other" value). Don't introduce a new spelling.
- **Georgia's region:** add `// CONFIRM WITH CLIENT: list Georgia under Europe or Other destinations?`
- **Blurb for each new country** (same sentence for all 18, swapping the name; add `// CONFIRM WITH CLIENT: blurb` once above the new entries):
  `Explore universities, available courses and student life in {name}.`
- **Order in the file:** alphabetical by name. Every list that renders countries (Countries page, dropdowns, admin filter) must sort alphabetically unless it has its own explicit order or the Featured sort.

### 1.2 Featured countries

Set `featured: true` on exactly these 9, the countries the client gave universities for in Europe:

**Bulgaria, Hungary, Latvia, Lithuania, Malta, Slovakia, Slovenia, Spain, Sweden.**

All other countries `featured: false`.

### 1.3 Country images

- **Every** country must have a **local** image in `public/images/countries/{slug}.jpg` (around 800px wide, under 250 KB). Any country still pointing to a remote `https://images.unsplash.com/...` URL must be downloaded and switched to the local path.
- **Keep** the existing verified images for Hungary, Slovenia, Slovakia, Latvia, Lithuania, Malta and Bulgaria.
- **New images:** a clearly recognisable landmark of that country, no identifiable people. Use these subjects:

| Country | Subject |
|---|---|
| Austria | Schönbrunn Palace, Vienna |
| Belgium | Grand-Place, Brussels |
| Croatia | Dubrovnik old town walls |
| Czech Republic | Charles Bridge, Prague |
| Denmark | Nyhavn, Copenhagen |
| Estonia | Tallinn Old Town |
| Finland | Helsinki Cathedral |
| Italy | Colosseum, Rome |
| Luxembourg | Luxembourg City old quarter / Adolphe Bridge |
| Netherlands | Amsterdam canal houses |
| Poland | Kraków Main Square |
| Romania | Palace of the Parliament, Bucharest |
| Spain | Sagrada Família, Barcelona |
| Sweden | Gamla Stan, Stockholm |
| Switzerland | Zurich old town on the Limmat |
| Ireland | Ha'penny Bridge, Dublin |
| Georgia | Tbilisi old town with Narikala Fortress |
| Vietnam | Ho Chi Minh City skyline |

**Before using each image, view it and confirm it shows that exact landmark.** Earlier in this project, images labelled Malta and Bulgaria actually showed Dubai and Greece. Report: country, what the image shows, source URL, licence.

### 1.4 Homepage hero marquee

- The two vertical marquee columns must show **only `featured: true` countries** (the 9 above), read from `countries.js`. No hard-coded country list in `HeroShowcase.jsx`.
- Split them across the two columns; repeat items so the marquee loops smoothly.
- Each tile links to `/countries/{slug}`. No count pills.
- Search `HeroShowcase.jsx` and the rest of the homepage for text that mentions the **USA / United States / America**, and list what you find. Don't rewrite other copy; just report it.

### 1.5 Country dropdowns

Applies to: the booking form (AppointmentModal), every InlineEnquiryForm country field (`formFields.js`), and the admin country filter.

- Use `<optgroup label="Europe">` and `<optgroup label="Other destinations">`, alphabetical within each group.
- `Not sure yet` stays as the last option, outside the groups.
- Values remain the country **name** (unchanged behaviour).
- Pre-fill from `openAppointment({ country })` must still work with both slugs and names.

### 1.6 Contact page FAQ ("Which European countries do you support?")

With 26 European countries, the generated sentence is too long. Change the generator to this exact text:

`We currently help students apply to universities in {N} European countries, including {featured names joined with commas and "and"}. You can see the full list on our Countries page. If you're considering another destination, ask us and we'll tell you what's possible.`

- `{N}` = count of countries with region Europe.
- Featured names use `article` where present.

### 1.7 Clean-up for the removed United States

- Remove `northeastern-university` from `universities.js`.
- Remove the success story whose university is Northeastern University (Arun Kumar), and any visa approval or gallery item that references the United States.
- Grep `src/` and `api/` for `united-states`, `United States`, `USA`, `Northeastern` and `F1` and list every remaining match.

---

## 2. Universities (`src/data/universities.js`)

### 2.1 Add a `clientListed` field to every university

- `clientListed: true` for every university in the client's list below.
- `clientListed: false` for the existing universities the client did **not** list: De Montfort, BPP, Coventry, Bangor, Hertfordshire, Greenwich, UE Applied Sciences, NEOMA. Add `// CONFIRM WITH CLIENT: not in the client's university list (Oct 2026)` above them.

**Visibility rule:** create one helper, e.g. `getVisibleUniversities()` in `src/lib/universities.js`, returning universities where `clientListed === true || SHOW_PLACEHOLDERS`. **Every** page and component that lists universities must use it:
- Universities page
- University detail page (unknown or hidden slug → 404)
- Country detail page
- Homepage partners section
- Countries page universities section and comparison table
- Admission Support university grid
- Course finder
- About page

`api/_lib/allowed.js` keeps accepting **all** university slugs so old leads and links still validate.

**Important:** the existing `isPlaceholder` field on universities means *details are missing*. It must **never** hide a university. Check that no code filters universities by `isPlaceholder` or by `SHOW_PLACEHOLDERS` directly, and fix any that does.

### 2.2 Update the two existing client-listed universities

`university-of-debrecen` and `eotvos-lorand-university`: set `clientListed: true`, and keep all their other fields.

### 2.3 Add these 45 universities

Use the existing schema: `logo: null`, `coverImage: null`, `overview: null`, `programs: []`, `requirements` all null, `tuition` and `livingCost` null amounts, `website: null`, `languageOfInstruction: null`, `isPlaceholder: true`, `clientListed: true`.

Add `// Names from client list (Oct 2026). Cities = main campus; CONFIRM WITH CLIENT.` above the block.

| slug | name | country | city |
|---|---|---|---|
| `varna-university-of-management` | Varna University of Management (VUM) | bulgaria | Varna |
| `alte-university` | ALTE University | georgia | Tbilisi |
| `seu-georgian-national-university` | SEU – Georgian National University | georgia | Tbilisi |
| `university-of-georgia` | University of Georgia | georgia | Tbilisi |
| `georgian-technical-university` | Georgian Technical University | georgia | Tbilisi |
| `budapest-metropolitan-university` | Budapest Metropolitan University | hungary | Budapest |
| `hungarian-university-of-sports-science` | Hungarian University of Sports Science (HUSS) | hungary | Budapest |
| `international-business-school-budapest` | International Business School (IBS) | hungary | Budapest |
| `university-of-miskolc` | University of Miskolc | hungary | Miskolc |
| `university-of-pecs` | University of Pécs | hungary | Pécs |
| `john-von-neumann-university` | John von Neumann University | hungary | Kecskemét |
| `baltic-international-academy` | Baltic International Academy (BIA) | latvia | Riga |
| `riga-nordic-university` | Riga Nordic University (ISMA) | latvia | Riga |
| `latvia-university-of-life-sciences-and-technologies` | Latvia University of Life Sciences and Technologies (LBTU) | latvia | Jelgava |
| `novikontas-maritime-college` | Novikontas Maritime College | latvia | Riga |
| `riga-stradins-university` | Rīga Stradiņš University | latvia | Riga |
| `riga-technical-university` | Riga Technical University | latvia | Riga |
| `transport-and-telecommunication-institute` | Transport and Telecommunication Institute (TSI) | latvia | Riga |
| `turiba-university` | Turība University | latvia | Riga |
| `university-of-latvia` | University of Latvia | latvia | Riga |
| `lithuanian-university-of-health-sciences` | Lithuanian University of Health Sciences (LSMU) | lithuania | Kaunas |
| `lithuanian-sports-university` | Lithuanian Sports University (LSU) | lithuania | Kaunas |
| `vilnius-university` | Vilnius University (VU) | lithuania | Vilnius |
| `vytautas-magnus-university` | Vytautas Magnus University (VMU) | lithuania | Kaunas |
| `vilnius-gediminas-technical-university` | Vilnius Gediminas Technical University (VILNIUS TECH) | lithuania | Vilnius |
| `kaunas-university-of-technology` | Kaunas University of Technology (KTU) | lithuania | Kaunas |
| `knights-college-malta` | Knights College | malta | null |
| `global-college-malta` | Global College Malta | malta | null |
| `idea-college-malta` | Idea College | malta | null |
| `london-school-of-commerce-malta` | London School of Commerce (LSC) Malta | malta | null |
| `malta-leadership-institute` | Malta Leadership Institute (MLI) | malta | null |
| `slovak-university-of-technology` | Slovak University of Technology in Bratislava | slovakia | Bratislava |
| `technical-university-of-kosice` | Technical University of Košice | slovakia | Košice |
| `erudio-slovenia` | Erudio | slovenia | Ljubljana |
| `faculty-of-information-studies` | Faculty of Information Studies | slovenia | Novo mesto |
| `university-of-maribor` | University of Maribor | slovenia | Maribor |
| `eu-business-school-barcelona` | EU Business School | spain | Barcelona |
| `ucam-catholic-university-of-murcia` | UCAM Catholic University of Murcia | spain | Murcia |
| `uef-ho-chi-minh-city` | HCMC University of Economics and Finance (UEF) | vietnam | Ho Chi Minh City |
| `halmstad-university` | Halmstad University | sweden | Halmstad |
| `university-of-skovde` | University of Skövde | sweden | Skövde |
| `university-west` | University West | sweden | Trollhättan |
| `linnaeus-university` | Linnaeus University | sweden | Växjö |
| `uppsala-university` | Uppsala University | sweden | Uppsala |
| `jonkoping-university` | Jönköping University | sweden | Jönköping |

- **Malta cities are `null`** on purpose. Where `city` is null, cards and detail pages show only the country (no empty pin, no "null").
- **Not added:** the client's entry "Malaysian University" (Malaysia), because it isn't a specific university name and Malaysia isn't in the client's country list. Add a comment in `universities.js`: `// CONFIRM WITH CLIENT: "Malaysian University" — which university, and is Malaysia offered?`

### 2.4 Pages that list many universities

- **Universities page:** country chips stay data-driven, sorted alphabetically, showing only countries that have at least one visible university. The search box searches name and city. Show 24 cards, then a `Load more` button.
- **Homepage partners carousel:** show at most 12 universities, from **featured** countries first (in the featured order above), then the rest.
- **Country detail page:** shows all visible universities for that country (no limit).
- **Admission Support university grid** and the **Countries page "Explore Universities Across Europe"** section: keep their limit of 6; pick from featured countries first.

---

## 3. Student photos (stories, visa approvals, gallery)

The client says the sample students have Indian names but non-Indian faces. Replace the photos so they look like **natural photos of young Indian students**. These remain **sample** content: every item keeps `isPlaceholder: true`, the SAMPLE badge, and stays hidden on the live site when `SHOW_PLACEHOLDERS` is false. Don't change any names, quotes or story text.

### 3.1 Photo rules

- **Who:** young Indian / South Asian adults (about 18–28), looking like students.
- **Style:** natural, not studio fashion shots or heavily posed corporate portraits. Campus, library, outdoor, casual clothing.
- **Gender matches the name.** If the gender implied by a name is unclear (e.g. Angel Varghese), **don't use a photo**: set `photo: null` so the initials avatar shows.
- **One person per student, used everywhere.** The same student must show the same photo on the homepage reviews, About page, Success Stories page, visa approval card and country/service story strips. Use one `photo` field per story; visa approvals with a matching `storyId` must use the story's photo.
- **Every student is a different person.** No photo reused for two students.
- **No celebrities, influencers or recognisable public figures.**
- **Files:** `public/images/_placeholder/students/{story-id}.jpg`, square crop (around 600×600), under 120 KB, face clearly visible.
- **Fallback:** if you can't find a suitable photo for a student within 3 attempts, set `photo: null` (initials). A mismatched photo is worse than initials.

### 3.2 Gallery sample items (`src/data/gallery.js`)

- **Visa items (4)** and any item with a visible person: replace with photos of young Indian / South Asian students that fit the item type (holding documents, celebrating, at an airport with luggage, in a seminar).
- **Events items:** replace photos where the people are clearly not South Asian with seminar, classroom or fair photos showing Indian / South Asian people. Keep the event-type match (delegate visit, spot admission, counselling, seminar, fair).
- **Landmark-only images** (e.g. the Eiffel Tower "Student life in Europe" item) stay as they are.
- Keep `studentName: "Sample Student N"`, `university: "Sample University"` and `country: null`.
- Same file rules: `public/images/gallery/_placeholder/`, under 200 KB, real `width`/`height`.

### 3.3 Report

A table for every photo: item (story id or gallery id), student name, what the photo shows (gender, setting), source URL, licence. Plus a list of every student left on initials and why.

---

## 4. Acceptance checklist

- [ ] `countries.js` has exactly 30 countries; no `united-states` anywhere in `src/` or `api/` (grep result listed).
- [ ] Every country image is local; the 18 new images were viewed and match their landmark (table).
- [ ] Hero marquee shows only the 9 featured countries, each linking to its country page.
- [ ] Booking form, inline forms and admin filter show grouped, alphabetical countries with "Not sure yet" last.
- [ ] `scripts/test-lead.js` passes, including new cases: country `Sweden` and `Czech Republic` are saved; `United States` is stored as null. Test rows deleted.
- [ ] Contact FAQ uses the new "{N} European countries, including …" sentence.
- [ ] `universities.js` has 47 client-listed universities + 8 `clientListed: false`; Northeastern removed.
- [ ] With `SHOW_PLACEHOLDERS` false (production build without the env var): the 8 unlisted universities don't appear anywhere and their URLs 404; the 47 listed ones all appear. With it true, all 55 appear.
- [ ] No university is hidden because of `isPlaceholder`.
- [ ] Malta universities show no empty city.
- [ ] `/countries/latvia` lists 9 universities, `/countries/sweden` 6, `/countries/georgia` 4.
- [ ] Universities page: chips include Georgia and Vietnam, `Load more` works, search finds "Riga" and "Pécs".
- [ ] Every sample student photo matches the name's gender, is a different person, and is used consistently everywhere; SAMPLE badges still show.
- [ ] 360px: no horizontal scroll on Countries, Universities and a country page.
- [ ] `npm run build` passes.

---

## 5. Stages (stop after each and report)

**Stage A:** Section 1 (countries, images, hero, dropdowns, Contact FAQ, US clean-up). Run `scripts/test-lead.js`. Report the image table and grep results.

**Stage B:** Section 2 (universities, visibility helper, page limits). Report counts per country and the `SHOW_PLACEHOLDERS` true/false check.

**Stage C:** Section 3 (student and gallery photos). Report the photo table. Then run the full Section 4 checklist.
