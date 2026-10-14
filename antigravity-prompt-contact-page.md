# Antigravity Prompt — Contact Us Page

## 0. Context and rules

Same project: React 18 + Vite + Tailwind, react-router-dom, GSAP + Lenis, with the Neon + Vercel `/api/lead` backend and the admin panel. These already exist and should be reused:
- InlineEnquiryForm and `formFields.js`
- FaqAccordion
- PageHero
- the branches data and the "Visit Us" branch and map section from the About page
- ActionButton
- `contentFlags.js`

Build **`/contact`** from the client's content below.

### Hard rules

1. **Copy:** use it exactly as written here, with Indian/UK spelling.
2. **No new npm dependencies.**
3. **Don't invent facts.** Office hours and WhatsApp availability are marked **[CONFIRM]**. Keep the values given here and add the comment `// CONFIRM WITH CLIENT`.
4. **Layout:** mobile first, no horizontal scroll at 360px. GSAP must use `gsap.context()` with cleanup.
5. **Don't open a browser.** Run `npm run build` and `scripts/test-lead.js` at the end of each stage.
6. **Work in the two stages in Section 8** and stop after each one.

---

## 1. Single source of truth for contact details

Create `src/data/contact.js`:

```js
// CONFIRM WITH CLIENT: office hours and that this number is on WhatsApp
export const contact = {
  phoneDisplay: '+91 98958 90500',
  phoneTel: '+919895890500',
  whatsappNumber: '919895890500',
  whatsappEnabled: true,
  whatsappText: 'Hi Adam International, I would like guidance on studying in Europe.',
  email: 'info@adaminternational.in',
  headOffice: {
    name: 'Adam International — Head Office',
    address: 'MAF Plaza, Edappally–Panvel Highway, Kochi, Kerala',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=MAF%20Plaza%2C%20Edappally%20Panvel%20Highway%2C%20Kochi%2C%20Kerala',
    embedUrl: 'https://www.google.com/maps?q=MAF%20Plaza%2C%20Edappally%20Panvel%20Highway%2C%20Kochi%2C%20Kerala&output=embed',
  },
  hours: [
    { days: 'Monday – Friday', time: '9:30 AM – 5:30 PM' },
  ],
  workingDays: [1, 2, 3, 4, 5], // 0 = Sunday … 6 = Saturday
};
export const whatsappLink = (text = contact.whatsappText) =>
  `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
```

**Replace every hard-coded phone number, `tel:` link, WhatsApp link and email address** across `src/` with values from this file. That includes:
- Header and Footer
- FinalCtaBanner
- the service page CTA band
- ActionButton (`whatsapp` and `tel` types)
- InlineEnquiryForm
- the AppointmentModal success text
- the About page
- the Gallery and Blog CTAs
- the FAQ answers that mention the number

The visible number format everywhere becomes **`+91 98958 90500`**. List every file you changed.

---

## 2. Backend: new `contact` form type

### Database

Append to `db/schema.sql` (keep it idempotent), then run `npm run db:apply`:

```sql
alter table leads drop constraint if exists leads_form_type_chk;
alter table leads add constraint leads_form_type_chk
  check (form_type in ('appointment','eligibility','admission','visa','training','contact'));
```

### Form fields

- **`formFields.js`:**
  - Add `contact` to the form types, with the label `Contact enquiry`.
  - Add `preferredDate`, labelled `Preferred date`: a date in `YYYY-MM-DD` format, between tomorrow and 60 days ahead, on a working day from `contact.workingDays`.
  - Add `preferredTime`, labelled `Preferred time`. It's a select with these options:
    - `Morning (9:30 AM – 12:00 PM)`
    - `Afternoon (12:00 PM – 3:00 PM)`
    - `Late afternoon (3:00 PM – 5:30 PM)`

    Mark these options **[CONFIRM]**; they must sit inside the office hours.
- **Server allow-list for `contact`:** `country`, `preferredDate`, `preferredTime`, plus `message` in the message column.
- **Server validation:** `preferredDate` must be a valid date, between tomorrow and 60 days ahead, on a working day. Otherwise return 400 with the error `Please choose a working day within the next 60 days.` `preferredTime` must be one of the options. Both are optional.

### Admin

- `Contact enquiry` appears in the form type filter and as the row label.
- In the drawer, show "Preferred date" (formatted like `Mon, 20 Oct 2026`) and "Preferred time".
- When `preferredDate` is set, show a small `Consultation requested` badge on the row.

### Tests

Extend `scripts/test-lead.js` with: a valid contact enquiry, one with a valid date and time, a weekend date (rejected), a date in the past (rejected), and a date more than 60 days ahead (rejected). Clean up after.

---

## 3. Routing and navigation

- **Route:** add a lazy-loaded route `/contact` → `ContactPage.jsx`, inside MainLayout.
- **Contact links:** Header "Contact Us", Footer "Contact Us" and any `/#contact` links now point to `/contact`, with an active state on that page.
- **Helmet:**
  - Title: `Contact Us`
  - Description: `Contact Adam International for guidance on European universities, courses, admissions and student visas. Call, WhatsApp, email or visit our Kochi office.`
- **Structured data:** add LocalBusiness JSON-LD with the name, head office address, phone, email and opening hours from `contact.js`.

---

## 4. Page structure (in this order)

### 4.1 Hero

Use PageHero, with breadcrumb `Home / Contact Us`.

- **H1:** `Let's Plan Your Study Abroad Journey`
- **Sub:** `Get personalised guidance for your European education journey.`
- **Intro line** under the sub, smaller: `Have questions about studying in Europe? Contact Adam International for guidance on universities, courses, admissions and student visa procedures.`

### 4.2 Quick contact cards

These sit directly under the hero, overlapping its bottom edge slightly on desktop. Use 4 columns on desktop, 2 on tablet and 1 on mobile. **Each whole card is clickable.**

| Icon | Title | Value | Action |
|---|---|---|---|
| Phone | Call Us | `+91 98958 90500` | `tel:` link |
| Mail | Email Us | `info@adaminternational.in` | `mailto:` link |
| MessageCircle | WhatsApp | `Chat with us` | `whatsappLink()`, opening in a new tab. **Hide the card if `whatsappEnabled` is false.** |
| MapPin | Visit Our Office | `MAF Plaza, Edappally–Panvel Highway, Kochi` | `Get Directions`, linking to `mapsUrl` in a new tab |

**Under the cards:** a small office hours line from `contact.hours`, e.g. `Office hours: Monday – Friday, 9:30 AM – 5:30 PM`.

### 4.3 Enquiry form and office

**Layout:** a two-column section on desktop, stacked on mobile with the form first.

#### Left: the form (`id="enquiry"`)

- **Heading:** `Send Us an Enquiry`
- **Sub:** `Fill in your details and our team can assist you with your enquiry.`
- **InlineEnquiryForm** with formType `contact`.

**Fields, in order:**
- Full Name
- Email Address
- Phone Number (with the WhatsApp checkbox)
- Preferred Study Destination: the `country` field, with this label override
- Your Message: the `message` field, **required** for this form only, at least 10 characters

**Consultation option:** below the message, a checkbox `I'd like to book a consultation`. When it's ticked, two fields appear:
- **Preferred date:** a native date input, with min and max set and non-working days rejected by validation. Show the helper text `Choose a working day.`
- **Preferred time:** the select.

Both are required only when the box is ticked.

**Below the fields:**
- the consent checkbox
- a **Submit Enquiry** button
- a small note: `Our team will contact you regarding your enquiry during working hours.`

**On success:**
- Title: `Thanks, we've received your enquiry.`
- Text: `Our team will contact you regarding your enquiry during working hours.`
- If a consultation was requested, add: `We'll call you to confirm your consultation on {formatted date}, {time}.`

#### Right: the office card

- **Heading:** `Visit Our Office`
- **Office name and address:** from `contact.headOffice`
- **Office hours list**
- **Map:** a lazy-loaded Google Maps iframe using `embedUrl`, with `title="Map of Adam International head office"` and a 4:3 ratio
- **Button:** `Get Directions`, linking to `mapsUrl` in a new tab
- **Other branches list:** below the map, the heading `Our Branches` and the other 5 branches from `branches.js` as a compact list, showing each branch's name and either its phone or "Address coming soon". Add a link `See all branches on a map`, pointing to `/about#branches`. Add `id="branches"` to the About page "Visit Us" section if it's missing.

### 4.4 FAQs

Use FaqAccordion with FAQPage JSON-LD.

- **Heading:** `Frequently Asked Questions`

**Questions and answers:**

- **How can I book a consultation?**
  Fill in the form on this page and tick "I'd like to book a consultation" to choose a date and time. You can also use Book a Free Consultation anywhere on the site, call us on +91 98958 90500, or message us on WhatsApp.
- **Which European countries do you support?**
  Generate this answer from `countries.js` (region `Europe`) so it stays up to date:
  `We currently help students apply to universities in {country names joined with commas and "and"}. If you're considering another destination, ask us and we'll tell you what's possible.`
- **What documents should I prepare?**
  For your first consultation, bring your academic mark sheets and certificates, your passport if you have one, any English test scores, and your CV if you've worked. If you don't have everything yet, come anyway, and we'll tell you exactly what you'll need.

### 4.5 CTA

Use the existing FinalCtaBanner.

---

## 5. Mobile details

- **Contact cards:** on mobile, show the phone and WhatsApp cards first.
- **Fields:** all inputs at least 44px tall, with `type="tel"`, `type="email"` and `inputMode="numeric"` where relevant.
- **Date input:** it must not overflow on iOS Safari.
- **Sticky bar:** add a mobile-only sticky bottom bar on this page with two buttons, `Call` and `WhatsApp`. Hide it while the form inputs are focused, so it doesn't cover the keyboard.

---

## 6. Acceptance checklist

- [ ] `/contact` loads, and the Header "Contact Us" is active. No `/#contact` links remain anywhere in `src/`.
- [ ] No hard-coded phone numbers or emails remain outside `contact.js`. Grep for `9895` and `info@` and list the remaining matches, which should be `contact.js` only.
- [ ] The call, email, WhatsApp and directions links all work, and WhatsApp opens with the pre-filled text.
- [ ] The form submits as `contact`. The consultation fields appear only when ticked. A weekend or past date is rejected both client-side and server-side.
- [ ] The admin shows "Contact enquiry", the "Consultation requested" badge and the date and time in the drawer.
- [ ] The test script passes and its rows are cleaned up.
- [ ] The FAQ country list is generated from the data.
- [ ] 360px: no horizontal scroll, and the sticky bar doesn't cover the form.
- [ ] `npm run build` passes.

---

## 7. Notes for later (don't build now)

- Email or WhatsApp alerts to staff for every new enquiry.
- Branch-wise routing of enquiries.

---

## 8. Stages

**Stage A:**
- Sections 1, 2 and 3 (the contact data, replacing all hard-coded details, the backend, admin, tests, routes and links)
- Stop and report, including the list of files changed and the grep results

**Stage B:**
- Sections 4 and 5 (the page)
- Run the Section 6 checklist
- Stop and report
