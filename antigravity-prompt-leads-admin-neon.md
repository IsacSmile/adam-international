# Antigravity Prompt — Booking Form Backend + Leads Admin Panel (Vercel + Neon Postgres)

## 0. Context

The site is React 18 + Vite + Tailwind with react-router-dom and AppointmentContext, hosted on **Vercel**. `AppointmentModal.jsx` currently stores nothing: it shows a fake success message and closes, so every lead is lost.

**Goal:**
- Save every booking request to a **Neon Postgres** database through Vercel serverless functions.
- Give the client a private `/admin` panel to view and manage leads.

**Architecture rule:** the browser **never** talks to the database. All database access happens inside `/api` functions. The admin panel calls `/api/admin/*`, which checks a secure session cookie first.

**Rules:**
- **Dependencies:** add only `@neondatabase/serverless`, `bcryptjs` and `jose`. Nothing else.
- **Secrets stay server-side:** `DATABASE_URL` and `SESSION_SECRET` are used only inside `/api` and `/scripts`. Never in frontend code, never with a `VITE_` prefix.
- **Keep the public site as it is:** don't change its design or copy except where this prompt says so.
- **Work in stages:** follow the stages in Section 9 and stop after each one.

---

## 1. Environment variables

Create `.env.example` (committed) and make sure `.env` / `.env.local` are in `.gitignore`.

```
DATABASE_URL=            # Neon pooled connection string
SESSION_SECRET=          # at least 32 random characters
```

---

## 2. Database (write to `db/schema.sql`. I will run it in the Neon SQL editor.)

```sql
create extension if not exists pgcrypto;

do $$ begin
  create type lead_status as enum ('new','contacted','follow_up','converted','not_interested');
exception when duplicate_object then null; end $$;

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (char_length(email) <= 254),
  phone text not null check (char_length(phone) <= 20),
  country text,
  service text,
  university text,
  branch text,
  source_page text,
  consent boolean not null default false,
  consent_text text,
  status lead_status not null default 'new',
  notes text,
  assigned_to text
);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
create index if not exists leads_phone_idx on leads (phone);

create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists login_attempts (
  id bigserial primary key,
  email text not null,
  ip text,
  success boolean not null,
  created_at timestamptz not null default now()
);
create index if not exists login_attempts_lookup_idx on login_attempts (email, created_at desc);

create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();
```

Also write `db/README.md` with my manual steps:

1. Create a Neon project.
2. Run `schema.sql`.
3. Copy the **pooled** connection string into `.env.local` and into Vercel environment variables.
4. Generate `SESSION_SECRET` with `openssl rand -base64 48`.
5. Create admin users with the script in Section 3.
6. Test locally with `npx vercel dev`, not `npm run dev`, because `/api` doesn't run under plain Vite.

---

## 3. Admin user script: `scripts/create-admin.js`

Run it as `node scripts/create-admin.js admin@example.com`. It:
- prompts for the password **hidden** in the terminal (don't take it as a command-line argument),
- requires at least 12 characters,
- hashes it with `bcryptjs` (cost 12),
- upserts the admin into `admins`.

Add `npm run create-admin`. There is **no sign-up page anywhere**.

---

## 4. Shared server code: `api/_lib/`

- `db.js`: `import { neon } from '@neondatabase/serverless'; export const sql = neon(process.env.DATABASE_URL);`. Always use tagged-template parameterised queries. **Never** build SQL with string concatenation.
- `session.js`:
  - `createSession(res, admin)` signs a JWT with `jose` (HS256, `SESSION_SECRET`, 8-hour expiry, payload `{ sub: admin.id, email }`) and sets the cookie `ai_admin` with `HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`.
  - `requireAdmin(req, res)` verifies the cookie and confirms the admin still exists in the database. If either check fails, it returns 401 and stops.
  - `clearSession(res)`.
- `origin.js`: for every POST, PATCH and DELETE under `/api/admin`, reject the request with 403 if the `Origin` header doesn't match the site's host. This is the CSRF protection.
- `allowed.js`: allowed country, service and branch values plus university slugs. Import them from `src/data/*.js` if that works in the Vercel function. If it doesn't, copy the values here with a comment saying to keep them in sync.

Keep the total number of function files small. Use exactly these three endpoint files: `api/lead.js`, `api/admin/auth.js`, `api/admin/leads.js`.

---

## 5. Public endpoint: `api/lead.js`

`POST` only. Any other method returns 405.

### Server-side validation

- `name`: required, trimmed, 2–100 characters.
- `email`: required, basic regex, max 254 characters, lowercased.
- `phone`: required. Strip spaces and dashes, match `^(\+91)?[6-9]\d{9}$`, and normalise to `+91XXXXXXXXXX`.
- `country`, `service`, `branch`: optional. Must be an allowed value or "Not sure yet". Anything else is stored as null.
- `university`: optional. Must be a known slug, otherwise null.
- `consent`: must be `true`. Otherwise return 400.
- `source_page`: optional, max 200 characters.

### Spam and duplicate protection

- **Honeypot:** `company_website`. If it's filled, return `200 { ok: true }` and save nothing.
- **Duplicate guard:** if the same phone number submitted within the last 10 minutes, don't insert. Return `200 { ok: true, duplicate: true }`.
- **Rate limit:** more than 5 leads from the same IP in an hour returns 429. Get the IP from the `x-forwarded-for` header (first value). Store it in a small `lead_ip_log` table; add its create statement to `schema.sql` with an index on `(ip, created_at)`.

### Responses

- `200 { ok: true }`
- `400 { ok: false, error: 'validation', fields: {...} }`
- `429 { ok: false, error: 'rate_limited' }`
- `500 { ok: false, error: 'server' }`

Never send internal error details to the client; log them with `console.error`.

### Fix `vercel.json`

The SPA rewrite must not catch `/api`:

```json
{ "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }] }
```

---

## 6. Admin endpoints

### `api/admin/auth.js`

- **`POST ?action=login`** with body `{ email, password }`:
  - **Lockout:** if there have been 5 or more failed attempts for that email in the last 15 minutes, return 429 with the message `Too many attempts. Try again in 15 minutes.`
  - **Checking the password:** look up the admin and compare with bcrypt. When the email doesn't exist, still run a bcrypt compare against a dummy hash, so the response time doesn't reveal which emails exist.
  - **Logging:** record every attempt in `login_attempts`.
  - **Wrong email or password:** return 401 with the generic message `Incorrect email or password.`
  - **Success:** call `createSession` and return `{ ok: true, email }`.
- **`POST ?action=logout`:** call `clearSession` and return `{ ok: true }`.
- **`GET ?action=me`:** `requireAdmin`, then return `{ email }`.

### `api/admin/leads.js`

Every method calls `requireAdmin` first.

- **`GET`** returns a list.
  - **Query params:**
    - `q`: case-insensitive search on name, email or phone
    - `status`, `country`, `service`, `branch`
    - `range`: `today`, `7d`, `30d` or `all`
    - `page`: 25 per page
  - **Returns:**
    - `{ leads, total, page, pageSize }`
    - `counts`: `{ new, contacted, follow_up, converted, not_interested, all }`. The counts apply the same filters except status, so the chips stay meaningful.
- **`GET ?export=csv`** with the same filters and no pagination.
  - **Response:** returns `text/csv` with `Content-Disposition: attachment; filename="adam-leads-YYYY-MM-DD.csv"`.
  - **Escaping:** escape quotes properly.
  - **Spreadsheet formula injection:** prefix any cell that starts with `=`, `+`, `-` or `@` with `'`, so a malicious name can't run as a formula in Excel. This matters because the name field is public input.
- **`PATCH ?id=`** with body containing any of `status` (must be a valid enum value), `notes` (max 5000 characters) and `assigned_to` (max 100 characters). Returns the updated lead.
- **`DELETE ?id=`** deletes the lead. Use this for data-deletion requests. Returns `{ ok: true }`.

---

## 7. Frontend changes

### 7.1 AppointmentModal

- **"Nearest branch" field:** add it as optional, with options Kochi (Head Office), Kozhikode, Trivandrum, Bangalore, Mangalore, Alappuzha and "Not sure yet". Put the list in `src/data/branches.js`.
- **Honeypot input:** add `company_website`, visually hidden, with `tabIndex={-1}`, `autoComplete="off"` and `aria-hidden="true"`.
- **Required consent checkbox** with this exact text: `I agree to Adam International contacting me by phone, email or WhatsApp about my enquiry, and I've read the Privacy Policy.` "Privacy Policy" links to `/privacy-policy` and opens in a new tab.
- **Client-side validation:** use the same rules as the server. Show an inline error under each field:
  - Name: `Please enter your name.`
  - Email: `Please enter a valid email address.`
  - Phone: `Please enter a valid 10-digit Indian mobile number.`
  - Consent: `Please tick the box so we can contact you.`
- **Submitting:** POST JSON to `/api/lead`. While sending, disable the button and change its label to `Sending…`. Send `source_page` set to the current pathname.
- **Success** (only when the response is `ok: true`):
  - Title: `Thanks, we've got your details.`
  - Text: `An advisor will call you back, usually within one working day. If it's urgent, call us on +91 9895 890 500.`
  - Button: `Close`
  - Don't auto-close. Reset the form after the modal closes.
- **Error, 429 or network failure:** show `Sorry, something went wrong and your request wasn't sent. Please try again, or call us on +91 9895 890 500.` Keep the form filled in.

### 7.2 Privacy and Terms placeholder pages

- Create `/privacy-policy` and `/terms` using PageHero. **Do not write any legal text.**
- Each page shows: `This page is being updated. For any questions, email info@adaminternational.in.` Add a `// TODO: replace with client-approved text before launch` comment.
- Point the footer links to these pages.

### 7.3 Admin panel

Lazy-load all admin code so none of it ships in the public bundle.

**Routes:** `/admin/login` and `/admin`, both outside MainLayout (no public header or footer). Not linked anywhere on the public site.

**Hiding from search engines:** give both routes `<meta name="robots" content="noindex, nofollow">` through Helmet, and add `Disallow: /admin` to `public/robots.txt` (create the file if it's missing).

**API calls:** every admin request uses `fetch` with `credentials: 'same-origin'`. Any 401 response redirects to `/admin/login`.

**`/admin/login`:** email and password, with a submit button showing `Signing in…`. Show the server's error message as-is.

**`AdminRoute` wrapper:** calls `GET /api/admin/auth?action=me` on mount. Shows a skeleton while loading. Redirects to `/admin/login` on 401.

**`/admin` layout:**

- **Top bar:** "Leads", the admin's email, and a Sign out button.
- **Status chips:** a count for each status plus All. Clicking a chip sets the status filter.
- **Filters:** search, status, country, service, branch and date range. All of them sync to URL query params. Debounce the search by 300ms.
- **Leads list:** a table on desktop and cards on mobile, newest first, paginated.
  - **Date:** formatted like `14 Oct 2026, 10:56`.
  - **Name**
  - **Phone:** a `tel:` link plus a WhatsApp link `https://wa.me/{digits}`.
  - **Email:** a `mailto:` link.
  - **Country**, **Service**, **Branch**, **Source page**
  - **Status:** an inline dropdown. Update it optimistically through PATCH and roll back if the request fails.
- **Row drawer:** clicking a row opens a drawer showing all fields, an editable Notes field, an editable Assigned to field, a Save button, and Delete lead (with a confirm dialog).
- **Export CSV:** downloads all leads matching the current filters, not just the visible page.
- **Empty, loading and error states:**
  - Empty: `No leads match these filters.`
  - Loading: the existing skeleton style.
  - Error: a banner with a Retry button.
- **Look:** clean and simple, using the site's navy and gold tokens. Function over decoration.

---

## 8. Security checklist (report PASS or FAIL for each)

- [ ] `DATABASE_URL` and `SESSION_SECRET` appear nowhere in `src/` or the built `dist/`. Grep `dist/` for `neon.tech` and for `postgres`: zero matches.
- [ ] Every query is a parameterised tagged template. There is no string-built SQL.
- [ ] Every `/api/admin/*` call without a valid cookie returns 401.
- [ ] Admin POST, PATCH and DELETE requests with a foreign `Origin` header return 403.
- [ ] Login lockout triggers after 5 failed attempts.
- [ ] The session cookie is `HttpOnly`, `Secure` and `SameSite=Strict`.
- [ ] `/api/lead` rejects a bad phone number and missing consent, silently drops honeypot submissions, and rate-limits.
- [ ] CSV export neutralises cells starting with `=`, `+`, `-` or `@`.
- [ ] `vercel.json` excludes `/api` from the SPA rewrite.
- [ ] `/admin` is not linked publicly and has noindex.

---

## 9. Stages (stop after each one and report)

1. `.env.example`, `db/schema.sql`, `db/README.md`, `src/data/branches.js`, `vercel.json` fix, `scripts/create-admin.js`.
2. `api/_lib/*` and `api/lead.js`.
3. AppointmentModal changes, plus the privacy and terms pages.
4. `api/admin/auth.js`, the admin login page and `AdminRoute`.
5. `api/admin/leads.js` and the leads dashboard.
6. Section 8 checklist. Clearly mark items you couldn't test without a real Neon database.
