# Database Setup Guide (Neon Postgres)

Follow these manual steps to initialize your database and configure credentials:

1. **Create a Neon project:**
   Sign up or log in at [Neon Console](https://console.neon.tech/) and create a new Postgres database project.

2. **Run `schema.sql`:**
   Open the Neon SQL Editor for your database and execute all statements from `db/schema.sql` to create extensions, enum types, tables (`leads`, `admins`, `login_attempts`, `lead_ip_log`), indexes, and triggers.

3. **Copy the pooled connection string:**
   From the Neon project dashboard, copy the **pooled connection string** (ends with `-pooler.postgres.neon.tech/...`). Add it to `.env.local` locally and into the Vercel project environment variables for production:
   ```env
   DATABASE_URL="postgres://user:password@ep-xyz-pooler.region.neon.tech/neondb?sslmode=require"
   ```

4. **Generate `SESSION_SECRET`:**
   Generate a cryptographic session secret by running the following command in your terminal:
   ```bash
   openssl rand -base64 48
   ```
   Save this value to `SESSION_SECRET` in `.env.local` and in Vercel environment variables.

5. **Create admin users:**
   Run the interactive script:
   ```bash
   npm run create-admin admin@example.com
   ```
   or
   ```bash
   node scripts/create-admin.js admin@example.com
   ```
   Enter a secure password of at least 12 characters when prompted.

6. **Test locally:**
   Run:
   ```bash
   npx vercel dev
   ```
   Do not test serverless functions with `npm run dev`, because `/api` routes run under Vercel Serverless Functions and not plain Vite.

---

## Content management (events & blog)

- **Creating the Blob store:** Vercel → project → **Storage** → **Create** → **Blob** → connect it to this project (Production, Preview and Development). This adds `BLOB_READ_WRITE_TOKEN` automatically.
- **Local development:** copy `BLOB_READ_WRITE_TOKEN` into `.env.local` and run `npx vercel dev`.
- **Seeding:** `npm run db:seed-content`, once.
- **Delay:** changes appear on the public site within about a minute, because of the 60-second cache.
- **Free limits:** the Hobby plan includes 1 GB of Blob storage. Images are resized to 1600px before upload to stay well within it.

---

## Vercel Blob

Do NOT revoke BLOB_READ_WRITE_TOKEN in Vercel. Uploads, deletes and the cleanup script depend on it.


