# Antigravity Prompt — Service Pages v2, Country Pages, Enquiry Forms

## 0. Context and rules

The project is React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis, a Neon + Vercel `/api` backend, and an admin panel. Shared components live in `src/components/shared/`. Data lives in `src/data/`.

The client has given new content for `/services` and all 7 service pages. **Replace the existing service page content with the content in this file.** The page structure changes from one fixed template to a **data-driven section list**, so each service page can have different sections.

### Hard rules

1. **Copy:** use it exactly as written here. Don't add claims, statistics, guarantees, years, awards or badges.
2. **Spelling:** use Indian/UK English everywhere in new copy: counselling, personalised, programme, specialisation, enrolment, organise.
   - Rename the service title "Career Counseling" to **"Career Counselling"** in `services.js`, the header, footer, booking form and admin filters.
   - **Keep the slug `career-counseling`** so existing links don't break.
3. **Missing data:** never invent programmes, fees, batches, scholarships, university details, visa rules or official links. Data that doesn't exist yet must **hide its section** or show the fallback text given here.
4. **No new npm dependencies.**
5. **GSAP:** always use `gsap.context()` with cleanup, and respect `prefers-reduced-motion`.
6. **Mobile first:** no horizontal scroll at 360px. Forms must be easy to fill in on a phone.
7. **Images:**
   - Download every image locally into `public/images/services/`.
   - The image must actually show what's described.
   - No identifiable public figures.
   - Prefer Unsplash or CC0.
   - If you use a Wikimedia image, add it to `imageCredits.js` with author, licence, source and changes.
   - Report a table with: page, scene, source URL, licence.
8. **Stages:** work in the stages in Section 12 and stop after each one.

---

## 1. Backend: support multiple enquiry forms

Several pages now have their own forms. All of them save to the **same `leads` table** through `/api/lead`, with a form type and extra details.

### 1.1 Database

Append to `db/schema.sql`. Keep it idempotent, then run `npm run db:apply`.

```sql
alter table leads add column if not exists form_type text not null default 'appointment';
alter table leads add column if not exists details jsonb not null default '{}'::jsonb;
alter table leads add column if not exists message text;
alter table leads add column if not exists whatsapp boolean;
do $$ begin
  alter table leads add constraint leads_form_type_chk
    check (form_type in ('appointment','eligibility','admission','visa','training'));
exception when duplicate_object then null; end $$;
create index if not exists leads_form_type_idx on leads (form_type);
```

### 1.2 `api/lead.js`

- Accept `formType`. Default is `'appointment'`. Reject unknown values with a 400.
- Accept `message` (optional, trimmed, max 2000 characters) and `whatsapp` (boolean).
- Accept a `details` object. **Only keep keys on the allow-list for that form type** (Section 3). Validate every value against its allowed options or max length. Drop any unknown keys.
- Change the duplicate guard to the same **phone + form_type** within 10 minutes.
- Keep all existing validation, the honeypot and the rate limit.

### 1.3 Admin panel

- **Form type:** add a filter (All, Booking, Eligibility, Admission, Visa, Training). Show a small label in each table row:
  - Booking form
  - Eligibility check
  - Admission enquiry
  - Visa enquiry
  - Training enquiry
- **Drawer:** show `message`, a "WhatsApp: Yes/No" line, and `details` as labelled rows using human-readable labels (e.g. "Highest qualification"). Hide empty values.
- **CSV:** add the columns `form_type`, `whatsapp` and `message`, plus one `details` column formatted as `Label: value; Label: value`. Keep the formula-injection protection.

### 1.4 Tests

Extend `scripts/test-lead.js` to cover each form type, an unknown detail key being dropped, an invalid detail value being rejected, and an unknown form type being rejected. Run it, then delete the test rows.

---

## 2. Shared `InlineEnquiryForm` component

Create `src/components/shared/InlineEnquiryForm.jsx`. It takes `formType`, `fields` (which optional fields to show), `submitLabel`, `successTitle`, `successText` and `note`.

**Always included fields:**
- Full name
- Phone, with a checkbox **"This number is on WhatsApp"** (ticked by default)
- Email
- Consent checkbox, with the same text as the booking form
- Hidden honeypot

**Optional fields** are selected by key from Section 3.

**Behaviour:**
- Use the same client-side validation and inline error messages as AppointmentModal.
- Show `Sending…` while submitting.
- On success, replace the form with the success message.
- On error, show the same error message as the modal and keep the form filled in.

**Under the button:** a small row with a WhatsApp link and `Call +91 9895 890 500` (a `tel:` link).

**Layout:** use a single column on mobile and two columns on desktop for the short fields.

---

## 3. Form field definitions (`src/data/formFields.js`)

| key | Label | Type / options |
|---|---|---|
| `qualification` | Highest qualification | select: Plus Two · Diploma · Bachelor's degree · Master's degree · Other |
| `currentQualification` | Current qualification | same options as `qualification` |
| `score` | Percentage / CGPA | text, max 20 characters |
| `fieldOfStudy` | Field of study | text, max 100 characters |
| `graduationYear` | Graduation year | select: next year back to 15 years ago |
| `englishTest` | English-language qualification | select: IELTS · PTE · TOEFL · Duolingo English Test · Not taken yet · Other |
| `country` | Preferred country | select: names from `countries.js` + Not sure yet |
| `budget` | Approximate budget per year (tuition + living) | select: Under ₹5 lakh · ₹5–10 lakh · ₹10–15 lakh · ₹15–25 lakh · Above ₹25 lakh · Not sure yet |
| `courseInterest` | Course you're interested in | text, max 100 characters |
| `intake` | Preferred intake | select: the next 4 intakes as "February YYYY" / "September YYYY", worked out from today's date, + Not sure yet. **[CONFIRM intake months with client]** |
| `admissionStatus` | Admission status | select: I've received an offer · I'm applying · I'm exploring options |
| `programme` | Programme you're interested in | select: titles from `trainingProgrammes.js` + Not sure yet |
| `message` | Message or question | textarea, max 2000 characters (saved to the `message` column, not `details`) |

### Server allow-list per form type

| Form type | Allowed fields |
|---|---|
| eligibility | qualification, score, fieldOfStudy, graduationYear, englishTest, country, budget |
| admission | qualification, score, courseInterest, country, intake |
| visa | currentQualification, country, admissionStatus, message |
| training | programme, message |

---

## 4. Section-based service pages

### Files

- Create `src/data/servicePages/{slug}.js` for each of the 7 services, plus `src/data/servicePages/overview.js` for `/services`. Each exports `{ seo, hero, sections: [...] }`.
- `services.js` keeps only what listings need: `slug`, `title`, `icon`, `image`, and the new `card` fields from Section 5.2.

### `ServiceSections.jsx`

Create `ServiceSections.jsx`, which renders a section list in order. Each section has a `type` and an optional `id` (for anchors). Supported types:

| type | What it renders |
|---|---|
| `intro` | eyebrow, heading, paragraphs, optional image (two columns) |
| `cardGrid` | eyebrow, heading, sub, items `{ icon, title, text?, link?: { label, to } }`, columns 2/3/4 |
| `checklist` | heading, sub, items, `interactive` (tickable, local state only, never saved), `note` |
| `timeline` | heading, sub, steps `{ title, text }`. Horizontal on desktop (≥1024px), vertical on mobile. GSAP stagger. |
| `twoColumnLists` | two titled lists side by side, stacked on mobile |
| `featureBand` | a highlighted band: heading, text, optional items, button |
| `countryGrid` | heading, sub, country slugs, card style (`compact` or `detailed`), button label pattern e.g. `"Explore {name} →"` |
| `universityGrid` | heading, limit, `showDetails`, "View All Universities" button |
| `programmeList` | renders `trainingProgrammes.js`, or the fallback text if empty |
| `scholarshipList` | renders `scholarships.js`, or the fallback if empty |
| `storyStrip` | 3 StoryCards + button |
| `courseFinder` | see Section 7.4 |
| `form` | an InlineEnquiryForm with the props given |
| `faq` | the existing FaqAccordion with JSON-LD |
| `linkCards` | small cards linking to other services |

### `ServiceDetailPage`

`ServiceDetailPage` renders: the **hero** (H1, sub, up to 2 buttons, image with navy overlay, breadcrumb), then `sections`, then the **CTA band**. The CTA band text is `Have a question about {title}?` / `Talk to an advisor at any of our branches, on a call, or on WhatsApp.`, with buttons **Book a Free Consultation** and **WhatsApp Us**.

### Button actions in data

Write each action in one of these forms:
- `{ type: 'appointment', service }`: opens the booking form
- `{ type: 'link', to }`
- `{ type: 'scroll', to: '#id' }`: scrolls with Lenis, offset by the header height
- `{ type: 'whatsapp' }`
- `{ type: 'tel' }`

---

## 5. `/services` overview page (`overview.js`)

### 5.1 Hero and sections

**SEO:**
- Title: `Our Services`
- Description: `Study abroad support from Adam International: career counselling, admission, financial and visa guidance, travel and pre-departure support.`

**Hero:**
- H1: `Complete Study Abroad Support, From Counselling to Departure`
- Sub: `Get personalised guidance on choosing your course, university and destination, with complete support for admission, visa and pre-departure.`
- Buttons: **Book a Free Consultation** (appointment) · **Explore Our Services** (scroll to `#all-services`)
- Image: a student and counsellor in conversation, or students on a European campus.

**Sections, in order:**

1. **timeline**
   - Eyebrow: `HOW WE HELP YOU`
   - Heading: `Your Study Abroad Journey`
   - Steps (each card links to the page shown in brackets):

   | Step | Text | Links to |
   |---|---|---|
   | Career Counselling | Understand your academic profile, interests and career goals. | career-counseling |
   | Course Selection | Find courses that match your qualifications and future plans. | career-counseling |
   | University Selection | Explore suitable universities based on course, location, budget and eligibility. | /universities |
   | Application & Admission | Get support with applications, documentation and admission procedures. | admission-support |
   | Financial Assistance | Get guidance on planning and managing the cost of studying abroad. | financial-assistance |
   | Visa Assistance | Receive guidance throughout the student visa process. | visa-assistance |
   | Travel & Settling In | Prepare for your journey and your first weeks in a new country. | pre-departure-post-landing |

2. **Service cards**, `id="all-services"`
   - Eyebrow: `OUR SERVICES`
   - Heading: `Everything We Help With`
   - 7 detailed cards from `services.js`. Each card shows: icon + title, tagline (bold), description, a "What we provide:" label, the bullets, and `Learn More →`. Use 2 columns on desktop and 1 on mobile.

3. **featureBand**
   - Heading: `Financial & Loan Guidance`
   - Text: `Understand your financial options and get guidance on education-loan documentation and related requirements.`
   - Button: `Explore Financial Assistance →` linking to `/services/financial-assistance`

4. **featureBand**
   - Heading: `Student Visa Assistance`
   - Text: `From documentation to submission, we'll guide you through the visa process.`
   - Items: Visa document checklist · Application guidance · Financial-document guidance · Appointment guidance · Interview preparation · Application-status guidance
   - Button: `Explore Visa Assistance →`

5. **featureBand**
   - Heading: `Find the Right University`
   - Text: `Choosing a university is more than choosing a name. We help you compare institutions based on your course, academic profile, budget and preferred destination.`
   - Button: `Explore Universities →` linking to `/universities`

6. **countryGrid**
   - Heading: `Explore Your European Study Destinations`
   - Countries: hungary, slovenia, slovakia, latvia, lithuania, malta, bulgaria, germany
   - Each card shows: flag + `Study in {name}`, the line `Universities · Courses · Admission`, and `Explore {name} →`, linking to `/countries/{slug}`

7. **form**, `id="eligibility"`
   - Heading: `Find the Right Course for Your Profile`
   - Sub: `Tell us about yourself and a counsellor will review your profile.`
   - formType: `eligibility`
   - Fields: qualification, score, fieldOfStudy, graduationYear, englishTest, country, budget
   - Button: `Check Your Eligibility →`
   - Note: `This is a preliminary review by our counsellors, not an automatic result or a guarantee of admission.`
   - Success title: `Thanks, we've received your details.`
   - Success text: `A counsellor will review your profile and contact you, usually within one working day.`

### 5.2 Card content for `services.js`

| slug | tagline | description | bullets |
|---|---|---|---|
| career-counseling | Find the right academic path for your future. | Our counsellors help you identify suitable courses and destinations based on your academic background, interests, career goals and budget. | Profile evaluation · Course and country selection · University shortlisting · Career guidance · Eligibility assessment |
| admission-support | Apply with confidence, complete and on time. | We guide you through your university applications, from choosing programmes to understanding your offer. | University and programme selection · Application preparation and submission guidance · Document checklist and review · SOP and CV guidance, where required · Offer review and next steps |
| training-assistance | Prepare for the requirements ahead. | Training support to help you prepare for the language, interview and readiness requirements of studying abroad. | **[CONFIRM — replace with the actual programmes offered]** English-language test preparation · Interview preparation |
| financial-assistance | Plan your costs and explore funding options. | Understand the full cost of studying abroad and get guidance on education loans, scholarships and proof-of-funds requirements. | Cost planning · Education loan guidance · Scholarship guidance · Proof-of-funds guidance · Loan document checklist |
| visa-assistance | From documentation to submission, guided step by step. | We guide you through the student visa process for your destination country. | Visa document checklist · Application guidance · Financial-document guidance · Appointment and interview preparation · Application-status guidance |
| travel-assistance | Travel to Europe with confidence. | Guidance on flights, travel insurance and getting ready for departure. | Flight options and baggage guidance · Travel insurance guidance · Pre-departure briefing · Cultural orientation |
| pre-departure-post-landing | Support before you leave and after you land. | Practical guidance to help you prepare for your journey and settle into your new destination. | Pre-departure orientation · Accommodation planning · Arrival and registration guidance · Local essentials: transport, SIM card, banking |

The homepage service carousel keeps using `card.summary`: set it to the description above, and set `card.highlights` to the first 2 bullets.

---

## 6. Career Counselling (`career-counseling.js`)

**SEO:**
- Title: `Career Counselling`
- Description: `Personalised career counselling to help you choose the right course, university and European study destination for your profile and budget.`

**Hero:**
- H1: `Find the Right Course. Build Your Future in Europe.`
- Sub: `Personalised career guidance to help you explore courses, universities and study destinations that match your academic background and future goals.`
- Buttons: **Book a Free Consultation** (appointment, service) · **Call Us** (tel)
- Image: a student talking with a counsellor.

**Sections:**

1. **cardGrid** (3 columns)
   - Eyebrow: `IS THIS FOR YOU?`
   - Heading: `Who Needs Career Counselling?`

   | Icon | Title | Text |
   |---|---|---|
   | School | Plus Two students | Explore bachelor's options that suit your stream, marks and interests. |
   | BookOpen | Undergraduate applicants | Compare programmes and countries before you commit to a degree. |
   | GraduationCap | Graduates planning a master's | Find postgraduate programmes that build on your degree and career plans. |
   | HelpCircle | Unsure about your course | Get clarity on which course or specialisation fits you best. |
   | Globe2 | Planning to study in Europe | Understand your options across European study destinations. |
   | Wallet | Working within a budget | Find programmes that fit both your qualifications and your budget. |

2. **cardGrid** (2 columns)
   - Heading: `What Our Career Counselling Includes`

   | Item | Link |
   |---|---|
   | Academic background evaluation | none |
   | Course and specialisation selection | none |
   | Identifying suitable European study destinations | `Explore destinations →` /countries |
   | University and programme recommendations | `Explore universities →` /universities |
   | Tuition fees and estimated living expenses | `Financial guidance →` |
   | Entry and language requirements | `Training support →` |
   | Admission requirements and application preparation | `Admission support →` |

3. **countryGrid** (detailed)
   - Heading: `Explore European Study Destinations`
   - Countries: slovenia, slovakia, hungary, malta, latvia, lithuania, bulgaria
   - Each card shows: flag, image, blurb, and `Explore {name} →` linking to `/countries/{slug}`

4. **timeline**
   - Heading: `How Our Career Counselling Works`
   - Steps:
     1. **Share Your Details**: Tell us about your qualifications and interests.
     2. **Attend a Counselling Session**: Discuss your goals, preferences and budget with a counsellor.
     3. **Explore Suitable Options**: Review courses, universities and countries that fit your profile.
     4. **Plan Your Next Steps**: Get clear guidance on admission requirements and the application process.

5. **cardGrid**
   - Heading: `Why Choose Adam International?`
   - Items (title only, with icons):
     - Personalised course and country recommendations
     - Guidance based on your qualifications and budget
     - Support with university selection and admission procedures
     - Visa and documentation guidance, where applicable
     - Support throughout your study-abroad journey

6. **storyStrip**
   - Heading: `Student Success Stories`
   - Button: `Read Student Stories →` linking to `/success-stories`

7. **faq**: reuse the 5 existing Career Counselling FAQs, with spelling updated to "counselling".

---

## 7. Admission Support (`admission-support.js`)

**SEO:**
- Title: `Admission Support`
- Description: `University admission support for Europe: programme selection, applications, document checks and offer guidance.`

**Hero:**
- H1: `Your Journey to a European University Starts Here`
- Sub: `Get personalised guidance on university selection, application preparation, admission requirements and the next steps toward studying in Europe.`
- Buttons: **Explore Universities** (link `/universities`) · **Enquire Now** (scroll to `#admission-form`)
- Image: a student and counsellor, with a European university setting if possible.

**Sections:**

1. **cardGrid** (3 columns)
   - Heading: `What Our Admission Support Includes`

   | Icon | Item |
   |---|---|
   | Building2 | University and programme selection |
   | ClipboardCheck | Eligibility and academic qualification assessment |
   | FileEdit | Application form preparation and submission guidance |
   | FileCheck2 | Document checklist and verification support |
   | PenLine | Guidance on statements of purpose and CVs, where required |
   | RefreshCw | Application status follow-up, where available |
   | MailCheck | Guidance on admission offers and next steps |

2. **form**, `id="admission-form"`
   - Heading: `Check Your Eligibility & Enquire`
   - Sub: `Share a few details and our admission team will get back to you with suitable options.`
   - formType: `admission`
   - Fields: qualification, score, courseInterest, country, intake
   - Button: `Send My Enquiry`
   - Note: `This is a preliminary assessment, not a guarantee of admission.`
   - Success title: `Thanks, we've received your enquiry.`
   - Success text: `Our admission team will contact you, usually within one working day.`

3. **universityGrid**, with `showDetails` on
   - Heading: `Explore Universities We Support`
   - Show up to 6 universities. Each card shows: name, logo (or the building icon), country and city, subject areas (unique programme names, max 3), general requirements (`requirements.academic`), `Official website ↗` (only if `website` exists, `rel="noopener noreferrer"`), and `View University Details`.
   - Button: `View All Universities →` linking to `/universities`
   - Add `website: null` to every entry in `universities.js`.

4. **checklist** (not interactive)
   - Heading: `Documents Required for University Admission`
   - Items:
     - Academic certificates and mark sheets
     - Passport or other accepted identification
     - Updated CV or résumé, if required
     - Statement of purpose or motivation letter, if required
     - English-language test results, where applicable
     - Letters of recommendation, where required by the programme
   - Note: `A general guide only. Each university and programme sets its own requirements.`

5. **timeline**
   - Heading: `Step-by-Step Admission Process`
   - Steps:
     1. **Enquiry and profile assessment**: We understand your background, goals and budget.
     2. **Course and university shortlisting**: We agree a realistic list of options with you.
     3. **Document preparation**: We help you gather and check everything you need.
     4. **Application submission**: Your applications go in complete and on time.
     5. **Admission decision and offer review**: We go through each offer and its conditions with you.
     6. **Next steps**: Including visa preparation, where applicable.

6. **courseFinder**, `id="course-finder"`
   - Heading: `University & Course Finder`
   - Sub: `Search the universities and programmes we currently support.`
   - Filters:
     - **Country:** from countries that have universities
     - **Study level:** Bachelor's · Master's · Diploma
     - **Subject area:** unique programme names, as a free-text match
     - **Preferred intake:** unique intakes from programmes
   - **Only show a filter when the data has options for it.** Country is always shown.
   - Button: `Find My University →` navigates to `/universities?country=&level=&subject=&intake=`
   - Note: `Only verified, currently available programmes and intakes are listed.`
   - **Also update `UniversitiesPage`** to read and apply `level`, `subject` and `intake` from the URL, using university programmes. Show those filter chips only when programme data exists.

7. **faq**: these 8 questions:
   - **How do I apply to a European university?** Most applications are made online, either on the university's own portal or through a national application system. You'll usually need your academic documents and passport, and sometimes an English test score, CV or motivation letter. We help you choose programmes, prepare your documents and submit each application.
   - **Can I apply after Plus Two?** Yes, Plus Two students can apply for bachelor's programmes. Entry requirements vary by university and course: some ask for specific subjects or minimum marks, and some programmes include an entrance exam or interview.
   - **Can I apply for a master's degree after graduation?** Yes. Most master's programmes ask for a relevant bachelor's degree and your transcripts, and some also ask for an English test, CV or motivation letter. Requirements differ by programme.
   - **Is IELTS required for every university?** No. Some universities accept a Medium of Instruction certificate, an interview or their own test, while others require IELTS or a similar test. We'll check each university on your shortlist.
   - **How much are the application and tuition fees?** They vary widely by country, university and course, and some universities don't charge an application fee at all. We'll give you the current fees for each university on your shortlist before you apply.
   - **Can I apply to multiple universities?** Yes, and it's usually sensible to apply to a few. We'll help you choose a realistic mix based on your profile and budget.
   - **What happens after I receive an admission offer?** You'll usually need to accept the offer, meet any remaining conditions and sometimes pay a deposit or tuition instalment before applying for your visa. We'll walk you through each step.
   - **Does admission support guarantee a university offer or visa?** No. Universities make admission decisions, and embassies or immigration authorities make visa decisions. What we do is help you submit complete, well-prepared applications.

---

## 8. Training Assistance (`training-assistance.js`)

**Create `src/data/trainingProgrammes.js`** with an empty array, and add `// CONFIRM WITH CLIENT: add real programmes` above it. Schema:

```js
{ slug, title, description, eligibility, duration, fee, format, outcomes: [], batches: [{ startDate, schedule, mode, seatsNote }] }
```

**Create `src/data/trainingFormats.js`** with an empty array of `{ icon, title, text }` and the same CONFIRM comment.

**SEO:**
- Title: `Training Assistance`
- Description: `Training support to help students prepare for the language, interview and readiness requirements of studying abroad.`

**Hero:**
- H1: `Build Your Skills. Prepare for Your Future.`
- Sub: `Training support to help you prepare for the requirements of studying abroad, so you can take each step with confidence.`
- Button: **Enquire About Training** (scroll to `#training-form`)
- Image: students in a classroom or training session.

**Sections:**

1. **intro**
   - Heading: `What is Training Assistance?`
   - Text: `Studying abroad often means meeting an English-language requirement, attending a university or visa interview, and adjusting to a new way of learning. Training Assistance helps you prepare for these steps, so you can approach each one with confidence.` **[CONFIRM — matches what the client offers]**

2. **programmeList**
   - Heading: `Our Training Programmes`
   - Each card shows: title, description, then Eligibility / Duration / Fee / Format rows (each hidden if empty), the outcomes list, and an upcoming batches table (hidden if empty). Card button: `Enquire About This Programme` scrolls to the form and pre-selects the programme.
   - Fallback when empty: `Programme details are being updated. Use the form below to ask about current courses, batches and fees.`

3. **cardGrid** from `trainingFormats.js`
   - Heading: `How We Train`
   - **Hide the section if the data is empty.**

4. **storyStrip**: hide it unless there are stories tagged `training: true` in `successStories.js`. Add `training: false` to existing stories.

5. **faq**:
   - **Which training programmes are available?** Our current programmes are listed on this page. If you can't find what you're looking for, ask us and we'll tell you what's available.
   - **Who can join?** Eligibility depends on the programme and is listed with each one.
   - **How long does the training take?** The duration depends on the programme and is listed with each one.
   - **What are the fees?** Fees are listed with each programme, or you can ask us for the current fees.
   - **Will I receive a certificate?** **[CONFIRM with client]**
   - **How do I register?** Fill in the enquiry form on this page, or call or WhatsApp us, and we'll confirm the next available batch.

6. **form**, `id="training-form"`
   - Heading: `Enquire About Training`
   - formType: `training`
   - Fields: programme, message
   - Button: `Send My Enquiry`
   - Success title: `Thanks, we've received your enquiry.`
   - Success text: `Our team will contact you about programmes and batches, usually within one working day.`

7. **linkCards**
   - Heading: `Related Services`
   - Cards: Career Counselling · Admission Support · Pre-Departure & Post-Landing Services

---

## 9. Financial Assistance (`financial-assistance.js`)

**Create `src/data/scholarships.js`** with an empty array, and add `// CONFIRM: add only verified scholarships with official links`. Schema:

```js
{ name, provider, country, eligibility, academicRequirements, deadline, officialUrl, lastChecked }
```

**SEO:**
- Title: `Financial Assistance`
- Description: `Guidance on study-abroad costs, education loans, scholarships and proof-of-funds requirements for studying in Europe.`

**Hero:**
- H1: `Plan and Fund Your European Education`
- Sub: `Get guidance on planning your education expenses, exploring funding options and preparing financially for your international study journey.`
- Buttons: **Explore Funding Options** (scroll to `#funding`) · **Book a Consultation** (appointment, service)
- Image: a student discussing costs with a counsellor.

**Sections:**

1. **intro**, `id="funding"`
   - Heading: `Education Loan Assistance`
   - Text: `We help you explore education loan options from banks and financial institutions, and understand what each option involves before you apply.`
   - Items:
     - Understanding loan eligibility
     - Documents commonly required
     - Secured and unsecured education loans, where applicable
     - Interest rates, repayment periods and other charges
     - Support with the application process **[CONFIRM]**
   - Note: `Loan approval, amount and interest rate are decided by the lender.`

2. **scholarshipList**
   - Heading: `Scholarships and Financial Aid`
   - Sub: `Many universities and organisations offer scholarships and other financial support. We help you find the ones you may qualify for.`
   - Each card shows: name, provider, country, eligibility, academic requirements, deadline, `Official details ↗`, and `Last checked {date}`.
   - **Fallback when empty:** text `Scholarship options depend on your country, university and profile. Ask us and we'll check what you may be eligible for.` with the button **Explore Scholarship Opportunities**, which opens the booking form with the Financial Assistance service.

3. **checklist** (interactive)
   - Heading: `Financial Planning Checklist`
   - Sub: `Use this list to estimate how much you may need before you travel.`
   - Items:
     - Tuition fees and initial university payments
     - Accommodation and living expenses
     - Visa and application charges
     - Travel and health insurance costs
     - Proof-of-funds requirements for your destination
     - Emergency funds and other initial expenses
   - Note: `A general guide only. Costs and requirements vary by country, city and university.`

4. **faq**: reuse the 5 existing Financial Assistance FAQs.

---

## 10. Visa Assistance (`visa-assistance.js`)

**SEO:**
- Title: `Visa Assistance`
- Description: `Student visa guidance for European destinations: document checks, application preparation and interview readiness.`

**Hero:**
- H1: `Your European Study Visa Journey Starts Here`
- Sub: `Get expert guidance on student visa documentation, application preparation and interview readiness for your chosen European study destination.`
- Buttons: **Get Visa Assistance** (scroll to `#visa-form`) · **Book a Free Consultation** (appointment, service)
- Image: a passport and documents on a desk, or a student preparing paperwork.

**Sections:**

1. **intro**
   - Heading: `Expert Guidance for Your Student Visa Application`
   - Text: `We help you prepare a complete, well-organised visa application, with careful document review and clear guidance at every step.`
   - Note, shown as a visible info box: `Visa decisions are made by the relevant embassy or immigration authority, and requirements vary by country and visa type. No one can guarantee approval. What we do is help you submit the strongest application you can.`

2. **timeline**
   - Heading: `How Our Visa Assistance Works`
   - Steps:
     1. **Initial Consultation**: We understand your destination, admission status and the visa requirements that apply to you.
     2. **Document Verification**: We help you review your passport, admission letter, financial documents and other paperwork.
     3. **Application Preparation**: We guide you through the forms, supporting documents and submission requirements.
     4. **Interview Preparation**: We help you prepare for common questions and explain your study plans clearly, where an interview applies.
     5. **Final Guidance**: We explain the next steps, appointment requirements and travel preparation for your application.

3. **countryGrid** (compact)
   - Heading: `Country-Specific Visa Guidance`
   - Countries: hungary, slovenia, malta, slovakia, latvia, lithuania, bulgaria
   - Each card shows: flag, the title `{name} Student Visa Assistance`, the text `Guidance for students admitted to universities in {name}, from documents to appointment.`, and `Explore {name} →` linking to `/countries/{slug}#visa`

4. **checklist** (interactive)
   - Heading: `Student Visa Document Checklist`
   - Items:
     - Valid passport
     - University admission letter
     - Academic certificates and transcripts
     - Proof of financial resources
     - Accommodation details, where required
     - Health insurance, where required
     - Completed visa application form
     - Additional documents required by your destination country
   - Note: `A general guide only, not a complete or official list. Requirements vary by country, visa type and your circumstances. Always check the official embassy or immigration website.`

5. **form**, `id="visa-form"`
   - Heading: `Get Student Visa Guidance`
   - formType: `visa`
   - Fields: currentQualification, country (labelled `Preferred study destination`), admissionStatus, message
   - Button: `Get Student Visa Guidance`
   - Success title: `Thanks, we've received your request.`
   - Success text: `A visa advisor will contact you, usually within one working day.`

6. **faq**:
   - **What documents are required for a European student visa?** It depends on the country and your situation, but most applications ask for a valid passport, your university admission letter, academic documents and proof of funds, and often accommodation details and health insurance. Use the checklist above as a starting point, and we'll give you the exact list for your destination.
   - **Can Adam International help me prepare my visa application?** Yes. We help you gather and review your documents, complete the forms, prepare for your appointment and interview, and understand what happens next. The application is made in your name, and the decision is made by the embassy or immigration authority.
   - **How early should I start preparing my visa documents?** As soon as you accept your offer. Some documents, such as bank statements, certificates or translations, can take weeks to arrange, and appointment slots fill up quickly before the main intakes.
   - **Is an IELTS score required for every European study destination?** Not always. Some universities accept a Medium of Instruction certificate or their own test, while others require IELTS or a similar score, and the embassy may have its own expectations. We'll check what applies to your university and country.
   - **What happens if my visa application is refused?** We'll go through the refusal letter with you, address each reason, and advise whether to reapply or, where possible, appeal.
   - **Does the visa process differ between European countries?** Yes. Each country sets its own rules for long-stay study visas or residence permits, including documents, fees, processing times and whether an interview is needed. We guide you through the process for your destination.
   - **How can I book a visa consultation with Adam International?** Fill in the form on this page, use Book a Free Consultation, message us on WhatsApp, or call +91 9895 890 500.

---

## 11. Travel Assistance and Pre-Departure & Post-Landing

### 11.1 Travel Assistance (`travel-assistance.js`)

**SEO:**
- Title: `Travel Assistance`
- Description: `Travel guidance for students heading to Europe: flight options, travel insurance and pre-departure preparation.`

**Hero:**
- H1: `Travel to Europe with Confidence`
- Sub: `Plan your journey with travel guidance from Adam International, including flight booking help, travel insurance guidance and pre-departure preparation.`
- Buttons: **Get Travel Assistance** (appointment, service) · **Contact Our Team** (WhatsApp)
- Image: a student at an airport with luggage.

**Sections:**

1. **cardGrid** (2 columns, each card has its own button)

   | Card | Text | Button | Action |
   |---|---|---|---|
   | Flight Booking Assistance **[CONFIRM: do they book tickets or only guide?]** | Help exploring flight options, comparing fares, understanding baggage allowances and planning travel dates around your university's reporting schedule. | Enquire About Flight Booking | appointment |
   | Travel Insurance Guidance | Help understanding travel insurance options, coverage, exclusions and the documents your destination requires. | Get Insurance Guidance | appointment |
   | Pre-Departure Briefing | Travel preparation, essential documents, baggage planning, airport procedures and key information about your destination. | Learn About Pre-Departure | link `/services/pre-departure-post-landing` |
   | International Adaptation Session | An introduction to cultural differences, local customs, communication, everyday life and what to expect in your destination country. | Explore Orientation Support | link `/services/pre-departure-post-landing` |

2. **timeline**
   - Heading: `How It Works`
   - Steps:
     1. **Submit an Enquiry**: Share your destination, university and expected travel date.
     2. **Discuss Your Travel Plans**: Review your requirements and the support you need.
     3. **Prepare for Departure**: Get guidance on bookings, documents and travel preparation.
     4. **Get Ready to Travel**: Complete your preparations and review the essentials for your journey.

3. **checklist** (interactive)
   - Heading: `Before You Travel to Europe`
   - Sub: `Use this general checklist to prepare for your journey. Requirements vary by country and individual circumstances.`
   - Items:
     - Passport and travel documents
     - University admission letter
     - Visa and entry documents, as applicable
     - Flight booking and baggage allowance
     - Travel insurance, if required
     - Accommodation details
     - Emergency contact information
     - Essential items and personal medicines

4. **cardGrid** (3 columns)
   - Heading: `Why Choose Adam International for Travel Assistance?`

   | Title | Text |
   |---|---|
   | Student-Focused Travel Planning | Plan your travel around your university schedule, destination and personal needs. |
   | Hassle-Free Preparation | Understand travel arrangements, documents, baggage rules and airport procedures before you leave. |
   | Clear, Reliable Information | Practical guidance, and pointers to the latest information from airlines and the relevant authorities. |
   | Personalised Assistance | Support tailored to your travel plans, destination and specific concerns. |
   | Pre-Departure Orientation | Guidance on cultural differences, local customs and everyday life in your new country. |
   | A More Confident Journey | Start your studies abroad knowing what to expect at each step. |

5. **faq**: reuse the 4 existing Travel Assistance FAQs.

### 11.2 Pre-Departure & Post-Landing Services (`pre-departure-post-landing.js`)

**SEO:**
- Title: `Pre-Departure & Post-Landing Services`
- Description: `Guidance to help students prepare for travel to Europe and settle into their new destination after arrival.`

**Hero:**
- H1: `Your Journey to Europe, Made Easier`
- Sub: `From pre-departure preparation to settling into your new destination, Adam International helps you prepare for your international education journey.`
- Buttons: **Explore Our Services** (scroll to `#support`) · **Get Student Support** (appointment, service)
- Image: a student with luggage and passport, or arriving on a European campus. **Not** a visa or counselling image.

**Sections:**

1. **twoColumnLists**, `id="support"`

   **Pre-Departure Assistance** (*Help preparing for your journey before you leave India.*)
   - Pre-departure orientation and travel preparation
   - Travel document and checklist guidance
   - Accommodation planning assistance
   - Information about local culture, weather and daily life
   - Guidance on budgeting and managing expenses
   - Information about university reporting and arrival procedures

   **Post-Landing Assistance** (*Help with the practical steps of settling into your destination.*)
   - Guidance on reaching your accommodation
   - Information about local transport
   - Guidance on university registration and orientation
   - Information about SIM cards, banking and essential services
   - Guidance on local rules and emergency contacts
   - Information about student support services

2. **timeline**
   - Heading: `How We Support You`
   - Steps:
     1. **Prepare for Departure**: Review your travel checklist and the key steps before leaving India.
     2. **Plan Your Journey**: Prepare for travel, accommodation and arrival procedures.
     3. **Settle Into Your Destination**: Understand local transport, essential services and university procedures.
     4. **Begin Your Student Journey**: Get to know your university and the student support available to you.

3. **cardGrid** with an intro paragraph
   - Heading: `Why Choose Adam International for Pre-Departure & Post-Landing Support?`
   - Intro: `Moving to another country for higher education is exciting, but preparing for a new environment can also feel challenging. We help you prepare with practical guidance and the right information.`

   | Title | Text |
   |---|---|
   | Personalised Guidance | Support based on your destination and individual needs. |
   | Travel Preparation | Understand the documents, travel arrangements and steps before departure. |
   | Destination Awareness | Learn about local culture, transport and everyday essentials. |
   | Arrival Guidance | Understand the first steps of settling into your new destination. |
   | Student-Focused Support | Start your international education with greater confidence. |

4. **faq**:
   - **What should I prepare before travelling to Europe for studies?** Your passport and visa, admission letter, accommodation details, travel insurance if required, some money in local currency or on a forex card, and copies of your important documents. We'll give you a full checklist in your pre-departure briefing.
   - **What documents should I carry when travelling?** Carry the originals of your passport, visa, admission letter, academic certificates, accommodation confirmation and insurance in your hand luggage, along with printed and digital copies. Your destination or university may ask for others.
   - **How can I plan my accommodation before arrival?** Start early, because many cities fill up before the semester begins. We help you compare university housing and private options, and check they're genuine before you pay a deposit.
   - **What should I do after arriving in my destination country?** Get to your accommodation, let your family know you've arrived, then follow your first-week plan: university registration, any local registration or residence-permit steps your country requires, a SIM card and a bank account.
   - **How can I prepare for university registration?** Read your university's arrival instructions, keep your documents ready and note any deadlines. We'll go through the usual steps with you before you travel.
   - **Can I receive guidance specific to my destination country?** Yes. Our briefing covers the country you're travelling to, and you can ask us questions about your city and university.

---

## 11A. Country detail pages `/countries/:slug`

Many buttons now link to country pages, so build them.

**Data:** add to every entry in `countries.js`:

```js
intro: null,
visa: { overview: null, officialLinks: [] },   // officialLinks: [{ label, url }]; only verified official government sources
lastChecked: null,
// CONFIRM WITH CLIENT / verify before filling
```

**Page:** `CountryDetailPage.jsx`. An unknown slug shows the 404 page. Helmet title: `Study in {name}`.

1. **Hero:**
   - Image, flag, H1 `Study in {name}`, the blurb, and a breadcrumb `Home / Countries / {name}`
   - Buttons: **Talk to an Advisor** (appointment, country) · **See Universities** (only if universities exist; scrolls to `#universities`)
2. **intro**, only if `intro` exists.
3. **`#universities`**
   - Heading: `Universities in {name}`
   - UniversityCards for this country.
   - If there are none: `We're adding universities in {name}. Ask an advisor for the current options.` with an Enquire button.
4. **`#visa`**
   - Heading: `Student Visa for {name}`
   - If `visa.overview` exists, show it and the official links (opening in a new tab).
   - Otherwise show: `Visa requirements change, so we confirm the current rules for {name} with you directly.` with a **Get Visa Guidance** button linking to `/services/visa-assistance#visa-form`.
5. **linkCards**
   - Heading: `How We Can Help`
   - Cards: Admission Support · Visa Assistance · Financial Assistance · Pre-Departure & Post-Landing
6. **storyStrip**: stories where `country` matches. Hide the section if there are none.
7. **Other destinations:** 4 compact cards for other European countries.

**Update links:**
- `/countries` page cards: the whole card links to `/countries/{slug}`. Keep the "Talk to an advisor" button.
- About page Europe cards: replace the Explore Universities / Ask an Advisor logic with `Explore {name} →` linking to `/countries/{slug}`.
- Homepage hero country tiles: link to `/countries/{slug}`.

---

## 12. Stages (stop after each and report)

| Stage | Work | Report / verify |
|---|---|---|
| **1** | Sections 1–3: database, API, admin, InlineEnquiryForm, formFields; rename to "Career Counselling" | Run the tests and delete the test rows. Confirm the booking modal still works. |
| **2** | Section 4: section renderer and all section components; Section 5.2: `services.js` card content | — |
| **3** | Section 11A: country pages and link updates | — |
| **4** | Section 5.1: the `/services` overview | — |
| **5** | Sections 6 and 7: Career Counselling and Admission Support (including `courseFinder` and the UniversitiesPage URL filters) | — |
| **6** | Sections 8 and 9: Training and Financial | — |
| **7** | Sections 10 and 11: Visa, Travel and Pre-Departure | — |
| **8** | Images for all heroes, plus QA | Image table (page, scene, source URL, licence). Submit each form type once on `vercel dev` and confirm each appears in `/admin` with the correct label and details, then delete them. `npm run build`. Check 360px on every service page. List every [CONFIRM] item in the new files. |
