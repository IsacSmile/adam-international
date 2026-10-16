import { SignJWT } from 'jose';
import { neonConfig } from '@neondatabase/serverless';
import { sql } from '../api/_lib/db.js';
import adminContentHandler from '../api/admin/content.js';
import adminUploadHandler from '../api/admin/upload.js';
import publicContentHandler from '../api/content.js';
import leadHandler from '../api/lead.js';
import adminLeadsHandler from '../api/admin/leads.js';
import { renderMarkdown } from '../src/lib/blog.js';

// Resilient retry wrapper for database calls
const originalFetch = globalThis.fetch;
neonConfig.fetchFunction = async (url, options) => {
  let attempts = 0;
  while (attempts < 4) {
    try {
      attempts++;
      return await originalFetch(url, options);
    } catch (err) {
      if (attempts >= 4) throw err;
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    headersSent: false,
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    getHeader(key) {
      return this.headers[key.toLowerCase()];
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      this.headersSent = true;
      return this;
    },
    end(data) {
      if (data && !this.body) {
        try {
          this.body = JSON.parse(data);
        } catch {
          this.body = data;
        }
      }
      this.headersSent = true;
      return this;
    },
  };
}

async function signAdminCookie(admin, secret) {
  const secretKey = new TextEncoder().encode(secret);
  const token = await new SignJWT({ email: admin.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(secretKey);

  return `ai_admin=${token}`;
}

async function run() {
  console.log('--- Starting Admin Content & CMS API Test Suite ---\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  PASS: ${message}`);
      passed++;
    } else {
      console.error(`  FAIL: ${message}`);
      failed++;
    }
  }

  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret) {
    console.error('Fatal: SESSION_SECRET is not set.');
    process.exit(1);
  }

  const adminRows = await sql`SELECT id, email FROM admins LIMIT 1`;
  if (!adminRows || adminRows.length === 0) {
    console.error('Fatal: No admin user found in database.');
    process.exit(1);
  }
  const adminUser = adminRows[0];
  const adminCookie = await signAdminCookie(adminUser, sessionSecret);
  const defaultHost = 'localhost:3000';
  const defaultOrigin = 'http://localhost:3000';
  const foreignOrigin = 'https://malicious-attacker.com';

  const testEventPrefix = `test-ev-${Date.now()}`;
  const testPostPrefix = `test-post-${Date.now()}`;

  try {
    // -------------------------------------------------------------------------
    // 1. Security & Authentication Checks
    // -------------------------------------------------------------------------
    console.log('1. Security: Admin Authentication & CSRF Origin Checks');

    // GET without cookie -> 401
    const resNoCookieGet = createMockRes();
    await adminContentHandler(
      { method: 'GET', query: { type: 'events' }, headers: {} },
      resNoCookieGet
    );
    assert(resNoCookieGet.statusCode === 401, 'GET /api/admin/content without cookie returns 401');

    // POST without cookie -> 401
    const resNoCookiePost = createMockRes();
    await adminContentHandler(
      { method: 'POST', query: { type: 'event' }, headers: {}, body: {} },
      resNoCookiePost
    );
    assert(resNoCookiePost.statusCode === 401, 'POST /api/admin/content without cookie returns 401');

    // PATCH without cookie -> 401
    const resNoCookiePatch = createMockRes();
    await adminContentHandler(
      { method: 'PATCH', query: { type: 'event', id: 'fake-id' }, headers: {}, body: {} },
      resNoCookiePatch
    );
    assert(resNoCookiePatch.statusCode === 401, 'PATCH /api/admin/content without cookie returns 401');

    // DELETE without cookie -> 401
    const resNoCookieDel = createMockRes();
    await adminContentHandler(
      { method: 'DELETE', query: { type: 'event', id: 'fake-id' }, headers: {} },
      resNoCookieDel
    );
    assert(resNoCookieDel.statusCode === 401, 'DELETE /api/admin/content without cookie returns 401');

    // Foreign origin on POST -> 403
    const resForeignPost = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: foreignOrigin,
        },
        body: {},
      },
      resForeignPost
    );
    assert(resForeignPost.statusCode === 403, 'POST /api/admin/content with foreign origin returns 403');

    // Foreign origin on PATCH -> 403
    const resForeignPatch = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'event', id: 'fake-id' },
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: foreignOrigin,
        },
        body: {},
      },
      resForeignPatch
    );
    assert(resForeignPatch.statusCode === 403, 'PATCH /api/admin/content with foreign origin returns 403');

    // Foreign origin on DELETE -> 403
    const resForeignDel = createMockRes();
    await adminContentHandler(
      {
        method: 'DELETE',
        query: { type: 'event', id: 'fake-id' },
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: foreignOrigin,
        },
      },
      resForeignDel
    );
    assert(resForeignDel.statusCode === 403, 'DELETE /api/admin/content with foreign origin returns 403');

    // -------------------------------------------------------------------------
    // 2. Upload API Checks
    // -------------------------------------------------------------------------
    console.log('\n2. Upload API: Token Generation, Auth & Path Rules');

    // Upload without cookie -> 401
    const resUploadNoCookie = createMockRes();
    await adminUploadHandler(
      {
        method: 'POST',
        headers: {},
        body: {
          type: 'blob.generate-client-token',
          payload: { pathname: 'events/test.jpg', multipart: false, clientPayload: null },
        },
      },
      resUploadNoCookie
    );
    assert(resUploadNoCookie.statusCode === 401, 'POST /api/admin/upload without cookie returns 401');

    // Upload with foreign origin -> 403
    const resUploadForeign = createMockRes();
    await adminUploadHandler(
      {
        method: 'POST',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: foreignOrigin,
        },
        body: {
          type: 'blob.generate-client-token',
          payload: { pathname: 'events/test.jpg', multipart: false, clientPayload: null },
        },
      },
      resUploadForeign
    );
    assert(resUploadForeign.statusCode === 403, 'POST /api/admin/upload with foreign origin returns 403');

    // Upload with invalid pathname -> 400
    const resUploadInvalidPath = createMockRes();
    await adminUploadHandler(
      {
        method: 'POST',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
        },
        body: {
          type: 'blob.generate-client-token',
          payload: { pathname: 'unauthorized-folder/test.jpg', multipart: false, clientPayload: null },
        },
      },
      resUploadInvalidPath
    );
    assert(resUploadInvalidPath.statusCode === 400, 'POST /api/admin/upload with invalid path prefix returns 400');

    // -------------------------------------------------------------------------
    // 3. Validation Rules
    // -------------------------------------------------------------------------
    console.log('\n3. Server-side Validation Rules');

    // Event with both date and month -> 400
    const resBothDateMonth = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event With Both Dates',
          summary: 'Summary description for testing',
          date: '2026-11-20',
          month: '2026-11',
        },
      },
      resBothDateMonth
    );
    assert(resBothDateMonth.statusCode === 400 && resBothDateMonth.body?.fields?.date, 'Event with both date and month returns 400');

    // Spot admission with highlight but no condition_note -> 400
    const resNoCondition = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Spot Admission Event',
          summary: 'Summary description for testing',
          highlight: 'On-the-spot offer letters issued',
          // condition_note missing
        },
      },
      resNoCondition
    );
    assert(resNoCondition.statusCode === 400 && resNoCondition.body?.fields?.condition_note, 'Spot admission with highlight but no condition note returns 400');

    // Unknown country -> 400
    const resUnknownCountry = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event In Atlantis',
          summary: 'Summary description for testing',
          country: 'atlantis-fantasy-land',
        },
      },
      resUnknownCountry
    );
    assert(resUnknownCountry.statusCode === 400 && resUnknownCountry.body?.fields?.country, 'Event with unknown country slug returns 400');

    // Foreign image host -> 400
    const resForeignImage = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event With Foreign Image',
          summary: 'Summary description for testing',
          image: 'https://evil-cdn.com/malicious.jpg',
        },
      },
      resForeignImage
    );
    assert(resForeignImage.statusCode === 400 && resForeignImage.body?.fields?.image, 'Event with foreign image host returns 400');

    // Event with only month set (others null) -> 201
    const resOnlyMonth = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event Only Month',
          slug: `${testEventPrefix}-only-month`,
          summary: 'Summary for only month event',
          month: '2026-10',
          date: null,
          year: null,
        },
      },
      resOnlyMonth
    );
    assert(
      resOnlyMonth.statusCode === 201 && resOnlyMonth.body?.month === '2026-10' && !resOnlyMonth.body?.date && !resOnlyMonth.body?.year,
      'Event with only month set (date and year null) creates successfully with 201'
    );

    // Event with only year set (others null) -> 201
    const resOnlyYear = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event Only Year',
          slug: `${testEventPrefix}-only-year`,
          summary: 'Summary for only year event',
          year: '2026',
          date: null,
          month: null,
        },
      },
      resOnlyYear
    );
    assert(
      resOnlyYear.statusCode === 201 && resOnlyYear.body?.year === '2026' && !resOnlyYear.body?.date && !resOnlyYear.body?.month,
      'Event with only year set (date and month null) creates successfully with 201'
    );

    // Event with only date set (others null) -> 201
    const resOnlyDate = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event Only Date',
          slug: `${testEventPrefix}-only-date`,
          summary: 'Summary for only date event',
          date: '2026-11-20',
          month: null,
          year: null,
        },
      },
      resOnlyDate
    );
    assert(
      resOnlyDate.statusCode === 201 && resOnlyDate.body?.date === '2026-11-20' && !resOnlyDate.body?.month && !resOnlyDate.body?.year,
      'Event with only date set (month and year null) creates successfully with 201'
    );

    // Event with month:'' + year:'' + date:'2026-11-20' -> 201 (should pass)
    const resEmptyStringsDate = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Event Empty Strings With Date',
          slug: `${testEventPrefix}-empty-strings-date`,
          summary: 'Summary for empty strings date event',
          date: '2026-11-20',
          month: '',
          year: '',
          tagline: '',
          location: '',
        },
      },
      resEmptyStringsDate
    );
    assert(
      resEmptyStringsDate.statusCode === 201 &&
        resEmptyStringsDate.body?.date === '2026-11-20' &&
        resEmptyStringsDate.body?.month === null &&
        resEmptyStringsDate.body?.year === null &&
        resEmptyStringsDate.body?.tagline === null &&
        resEmptyStringsDate.body?.location === null,
      'Event with month:"", year:"" and date:"2026-11-20" normalizes empty strings to null and returns 201'
    );

    // -------------------------------------------------------------------------
    // 4. Draft Events, Public Visibility & Preview
    // -------------------------------------------------------------------------
    console.log('\n4. Draft Events, Public Visibility & Preview Mode');

    const draftEventSlug = `${testEventPrefix}-draft`;
    const resCreateDraft = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          status: 'draft',
          title: 'Draft Spot Admission Event',
          slug: draftEventSlug,
          summary: 'This is a draft event that should not be public.',
          country: 'germany',
          month: '2026-12',
          poster: '/images/events/germany-spot-admission.jpg',
          poster_thumb: '/images/events/germany-spot-admission-thumb.jpg',
          poster_width: 1024,
          poster_height: 765,
        },
      },
      resCreateDraft
    );
    assert(resCreateDraft.statusCode === 201, 'Created draft event via admin content API');
    const createdEvent = resCreateDraft.body;
    assert(createdEvent?.posterThumb === '/images/events/germany-spot-admission-thumb.jpg', 'Draft event returned posterThumb in camelCase');

    // Public list (?type=events) does NOT include draft
    const resPubEvents = createMockRes();
    await publicContentHandler(
      { method: 'GET', query: { type: 'events' }, headers: {} },
      resPubEvents
    );
    const pubEvents = resPubEvents.body || [];
    const containsDraft = pubEvents.some((e) => e.slug === draftEventSlug);
    assert(!containsDraft, 'Public /api/content?type=events does NOT include draft event');

    // Preview without cookie -> 404
    const resPreviewNoCookie = createMockRes();
    await publicContentHandler(
      { method: 'GET', query: { type: 'event', slug: draftEventSlug, preview: '1' }, headers: {} },
      resPreviewNoCookie
    );
    assert(resPreviewNoCookie.statusCode === 404, 'Draft preview without cookie returns 404');

    // Preview with admin cookie -> 200
    const resPreviewWithCookie = createMockRes();
    await publicContentHandler(
      {
        method: 'GET',
        query: { type: 'event', slug: draftEventSlug, preview: '1' },
        headers: { cookie: adminCookie },
      },
      resPreviewWithCookie
    );
    assert(resPreviewWithCookie.statusCode === 200 && resPreviewWithCookie.body?.slug === draftEventSlug, 'Draft preview with admin cookie returns 200');

    // Clean slate for test emails
    await sql`DELETE FROM leads WHERE email IN ('applicant@example.com', 'another@example.com')`;

    // -------------------------------------------------------------------------
    // 5. Publishing, Lead Registration & Unpublishing
    // -------------------------------------------------------------------------
    console.log('\n5. Publishing, Lead Registration & Unpublishing');

    // Publish the event
    const resPublishEvent = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'event', id: createdEvent.id },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          status: 'published',
          registration_open: true,
          date: '2026-11-25',
          month: null,
          highlight: 'Instant eligibility check',
          condition_note: 'Subject to university criteria.',
        },
      },
      resPublishEvent
    );
    assert(resPublishEvent.statusCode === 200 && resPublishEvent.body?.status === 'published', 'Published event via PATCH');

    // Public list NOW includes the published event
    const resPubEventsNow = createMockRes();
    await publicContentHandler(
      { method: 'GET', query: { type: 'events' }, headers: {} },
      resPubEventsNow
    );
    const pubEventsNow = resPubEventsNow.body || [];
    assert(pubEventsNow.some((e) => e.slug === draftEventSlug), 'Public /api/content?type=events now includes published event');

    // Register lead for this published event -> 200
    const uniquePhone1 = `+919895111${String(Date.now()).slice(-3)}`;
    const resLeadReg = createMockRes();
    await leadHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.99' },
        body: {
          form_type: 'event',
          name: 'Test Event Applicant',
          email: 'applicant@example.com',
          phone: uniquePhone1,
          consent: true,
          details: {
            eventSlug: draftEventSlug,
          },
        },
      },
      resLeadReg
    );
    assert(resLeadReg.statusCode === 200 && resLeadReg.body?.ok === true && !resLeadReg.body?.duplicate, 'Event lead registration accepted with 200');

    // Unpublish event (back to draft)
    const resUnpublish = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'event', id: createdEvent.id },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          status: 'draft',
        },
      },
      resUnpublish
    );
    assert(resUnpublish.statusCode === 200 && resUnpublish.body?.status === 'draft', 'Unpublished event back to draft');

    // Lead registration for now-unpublished event -> 400
    const uniquePhone2 = `+919895111${String(Date.now()).slice(-3)}`;
    const resLeadRegDraft = createMockRes();
    await leadHandler(
      {
        method: 'POST',
        headers: { 'x-forwarded-for': '127.0.0.99' },
        body: {
          form_type: 'event',
          name: 'Another Applicant',
          email: 'another@example.com',
          phone: uniquePhone2,
          consent: true,
          details: {
            eventSlug: draftEventSlug,
          },
        },
      },
      resLeadRegDraft
    );
    assert(resLeadRegDraft.statusCode === 400, 'Lead registration for unpublished draft event returns 400');

    // -------------------------------------------------------------------------
    // 5b. Partial PATCH: Preserving registration_open, poster, and images
    // -------------------------------------------------------------------------
    console.log('\n5b. Partial PATCH: Preserving fields across unpublish / publish');

    const partialEventSlug = `${testEventPrefix}-partial`;
    const resCreatePartial = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          status: 'published',
          title: 'Event for Partial Patch Testing',
          slug: partialEventSlug,
          summary: 'Testing partial PATCH preserves registration_open and other fields.',
          country: 'latvia',
          registration_open: true,
          date: '2026-12-15',
          poster: '/images/events/germany-spot-admission.jpg',
          poster_thumb: '/images/events/germany-spot-admission-thumb.jpg',
        },
      },
      resCreatePartial
    );
    assert(
      resCreatePartial.statusCode === 201 &&
        (resCreatePartial.body?.registration_open === true || resCreatePartial.body?.registrationOpen === true),
      'Created event with registration_open=true'
    );
    const partialId = resCreatePartial.body?.id;

    // Unpublish: only status: 'draft' sent
    const resUnpubPartial = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'event', id: partialId },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          status: 'draft',
        },
      },
      resUnpubPartial
    );
    assert(
      resUnpubPartial.statusCode === 200 &&
        resUnpubPartial.body?.status === 'draft' &&
        (resUnpubPartial.body?.registration_open === true || resUnpubPartial.body?.registrationOpen === true),
      'Unpublish with status:"draft" only: status changed to draft, registration_open preserved as true'
    );

    // Publish: only status: 'published' sent
    const resPubPartial = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'event', id: partialId },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          status: 'published',
        },
      },
      resPubPartial
    );
    assert(
      resPubPartial.statusCode === 200 &&
        resPubPartial.body?.status === 'published' &&
        (resPubPartial.body?.registration_open === true || resPubPartial.body?.registrationOpen === true),
      'Publish with status:"published" only: status changed to published, registration_open preserved as true'
    );

    // Re-read event: GET /api/admin/content?type=event&id=...
    const resReread = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        query: { type: 'event', id: partialId },
        headers: { cookie: adminCookie },
      },
      resReread
    );
    assert(
      resReread.statusCode === 200 &&
        resReread.body?.status === 'published' &&
        resReread.body?.registration_open === true &&
        resReread.body?.poster === '/images/events/germany-spot-admission.jpg',
      'Re-read event: status is published, registration_open is STILL true, poster is preserved'
    );

    // -------------------------------------------------------------------------
    // 6. Duplicate Slug Conflicts (409)
    // -------------------------------------------------------------------------
    console.log('\n6. Duplicate Slug Conflicts (409)');

    const resDupSlug = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'event' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          type: 'spot-admission',
          title: 'Duplicate Slug Attempt',
          slug: draftEventSlug,
          summary: 'Should fail with 409.',
        },
      },
      resDupSlug
    );
    assert(resDupSlug.statusCode === 409 && resDupSlug.body?.error === 'slug_taken', 'Creating event with duplicate slug returns 409 slug_taken');

    // -------------------------------------------------------------------------
    // 7. Blog: Featured Toggling & Markdown Sanitization
    // -------------------------------------------------------------------------
    console.log('\n7. Blog: Featured Post Swapping & Markdown Sanitization');

    // Create post A (featured: true)
    const postASlug = `${testPostPrefix}-a`;
    const resPostA = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'post' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Alpha Featured',
          slug: postASlug,
          category: 'study-in-europe',
          summary: 'Summary for post A',
          body_md: '## Hello world from Post A',
          image: '/images/blog/_placeholder/study-in-germany.jpg',
          image_thumb: '/images/blog/_placeholder/study-in-germany-thumb.jpg',
          image_alt: 'Study in Germany',
          status: 'published',
          featured: true,
        },
      },
      resPostA
    );
    assert(resPostA.statusCode === 201 && resPostA.body?.featured === true, 'Created Post A with featured = true');
    const postAId = resPostA.body?.id;
    assert(resPostA.body?.imageThumb === '/images/blog/_placeholder/study-in-germany-thumb.jpg', 'Post A returned imageThumb in camelCase');

    // Create post B (featured: true)
    const postBSlug = `${testPostPrefix}-b`;
    const resPostB = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'post' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Beta Featured',
          slug: postBSlug,
          category: 'student-visa-guidance',
          summary: 'Summary for post B',
          body_md: '## Hello world from Post B',
          image: '/images/blog/_placeholder/schengen-visa.jpg',
          image_alt: 'Schengen Visa',
          status: 'published',
          featured: true,
        },
      },
      resPostB
    );
    assert(resPostB.statusCode === 201 && resPostB.body?.featured === true, 'Created Post B with featured = true');
    const postBId = resPostB.body?.id;

    // Verify Post A was unfeatured automatically
    const resGetPostA = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        query: { type: 'post', id: postAId },
        headers: { cookie: adminCookie },
      },
      resGetPostA
    );
    assert(resGetPostA.statusCode === 200 && resGetPostA.body?.featured === false, 'Post A was automatically unfeatured when Post B was featured');

    // Unit test renderMarkdown sanitization
    const maliciousMd = 'Check this: <script>alert("xss")</script> and <img src=x onerror=alert(1)> and [Click](https://example.com)';
    const sanitizedHtml = renderMarkdown(maliciousMd);
    assert(!sanitizedHtml.includes('<script>'), 'Markdown renderer stripped <script> tag');
    assert(!sanitizedHtml.includes('onerror='), 'Markdown renderer stripped onerror attribute');
    assert(sanitizedHtml.includes('rel="noopener noreferrer"'), 'Markdown renderer added rel="noopener noreferrer" to external link');

    // -------------------------------------------------------------------------
    // 7b. Blog: Country Tags Validation, Deduplication & Partial PATCH
    // -------------------------------------------------------------------------
    console.log('\n7b. Blog: Country Tags Validation, Deduplication & Partial PATCH');

    // 1. Unknown slug rejected (400 validation error)
    const postInvalidCountrySlug = `${testPostPrefix}-inv-country`;
    const resInvCountry = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'post' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Invalid Country',
          slug: postInvalidCountrySlug,
          category: 'study-in-europe',
          summary: 'Summary test',
          body_md: '## Test',
          status: 'draft',
          countries: ['germany', 'atlantis-invalid'],
        },
      },
      resInvCountry
    );
    assert(
      resInvCountry.statusCode === 400 && resInvCountry.body?.fields?.countries,
      'Post with unknown country slug rejected with 400 validation error'
    );

    // 2. More than 5 countries rejected (400 validation error)
    const postExcessCountrySlug = `${testPostPrefix}-excess-country`;
    const resExcessCountry = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'post' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Excess Countries',
          slug: postExcessCountrySlug,
          category: 'study-in-europe',
          summary: 'Summary test',
          body_md: '## Test',
          status: 'draft',
          countries: ['germany', 'france', 'spain', 'italy', 'austria', 'malta'],
        },
      },
      resExcessCountry
    );
    assert(
      resExcessCountry.statusCode === 400 && resExcessCountry.body?.fields?.countries,
      'Post with >5 countries rejected with 400 validation error'
    );

    // 3. Valid tags saved and deduplicated
    const postCountrySlug = `${testPostPrefix}-valid-country`;
    const resValidCountry = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        query: { type: 'post' },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Valid Countries',
          slug: postCountrySlug,
          category: 'study-in-europe',
          summary: 'Summary test',
          body_md: '## Test',
          status: 'draft',
          countries: ['germany', 'spain', 'germany'],
        },
      },
      resValidCountry
    );
    assert(
      resValidCountry.statusCode === 201 &&
        Array.isArray(resValidCountry.body?.countries) &&
        resValidCountry.body.countries.length === 2 &&
        resValidCountry.body.countries[0] === 'germany' &&
        resValidCountry.body.countries[1] === 'spain',
      'Valid country tags saved and deduplicated'
    );
    const countryPostId = resValidCountry.body?.id;

    // 4. PATCH without countries leaves them unchanged
    const resPatchNoCountries = createMockRes();
    await adminContentHandler(
      {
        method: 'PATCH',
        query: { type: 'post', id: countryPostId },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        body: {
          title: 'Post Valid Countries Updated Title',
        },
      },
      resPatchNoCountries
    );
    assert(
      resPatchNoCountries.statusCode === 200 &&
        Array.isArray(resPatchNoCountries.body?.countries) &&
        resPatchNoCountries.body.countries.length === 2 &&
        resPatchNoCountries.body.countries.includes('germany') &&
        resPatchNoCountries.body.countries.includes('spain'),
      'PATCH without countries leaves them unchanged'
    );

    // Verify GET returns countries
    const resGetCountryPost = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        query: { type: 'post', id: countryPostId },
        headers: { cookie: adminCookie },
      },
      resGetCountryPost
    );
    assert(
      resGetCountryPost.statusCode === 200 &&
        Array.isArray(resGetCountryPost.body?.countries) &&
        resGetCountryPost.body.countries.length === 2,
      'GET /api/admin/content?type=post returns countries'
    );

    // -------------------------------------------------------------------------
    // 8. Event Deletion, Registration Count & Leads Resolution
    // -------------------------------------------------------------------------
    console.log('\n8. Event Deletion & Lead Reference Resolution');

    // Check registrations endpoint before deletion
    const resRegCount = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        query: { type: 'event-registrations', slug: draftEventSlug },
        headers: { cookie: adminCookie },
      },
      resRegCount
    );
    assert(resRegCount.statusCode === 200 && resRegCount.body?.count === 1, `GET ?type=event-registrations returns count: 1 (got ${resRegCount.body?.count})`);

    // Delete the event
    const resDelEvent = createMockRes();
    await adminContentHandler(
      {
        method: 'DELETE',
        query: { type: 'event', id: createdEvent.id },
        headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
      },
      resDelEvent
    );
    assert(resDelEvent.statusCode === 200 && resDelEvent.body?.count === 1, `DELETE event returns { ok: true, count: 1 } (got ${resDelEvent.body?.count})`);

    // Leads API still lists the lead, and resolves eventTitle to "{slug} (deleted)"
    const resAdminLeads = createMockRes();
    await adminLeadsHandler(
      {
        method: 'GET',
        headers: { cookie: adminCookie },
        query: { form_type: 'event', q: 'applicant@example.com' },
      },
      resAdminLeads
    );
    assert(resAdminLeads.statusCode === 200, 'GET /api/admin/leads succeeded');
    const matchedLead = resAdminLeads.body?.leads?.find((l) => l.email === 'applicant@example.com');
    assert(Boolean(matchedLead), 'Lead still exists in database after event was deleted');
    assert(
      matchedLead?.eventTitle === `${draftEventSlug} (deleted)`,
      `Lead eventTitle resolves to "${draftEventSlug} (deleted)"`
    );

    // Delete test post A and post B
    if (postAId) {
      await adminContentHandler(
        {
          method: 'DELETE',
          query: { type: 'post', id: postAId },
          headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        },
        createMockRes()
      );
    }
    if (postBId) {
      await adminContentHandler(
        {
          method: 'DELETE',
          query: { type: 'post', id: postBId },
          headers: { cookie: adminCookie, host: defaultHost, origin: defaultOrigin },
        },
        createMockRes()
      );
    }

    // -------------------------------------------------------------------------
    // 8b. Browser Requests: Empty Body & No Content-Type Handling
    // -------------------------------------------------------------------------
    console.log('\n8b. Browser Requests: Empty Body & No Content-Type Handling');

    // 1. GET list (events) with empty body and no content-type
    const resEmptyGetEvents = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        url: '/api/admin/content?type=events',
        headers: { cookie: adminCookie },
        body: '',
      },
      resEmptyGetEvents
    );
    assert(
      resEmptyGetEvents.statusCode === 200 && Array.isArray(resEmptyGetEvents.body),
      'GET /api/admin/content?type=events with empty body and no content-type returns 200'
    );

    // 2. GET list (posts) with empty body and no content-type
    const resEmptyGetPosts = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        url: '/api/admin/content?type=posts',
        headers: { cookie: adminCookie },
        body: '',
      },
      resEmptyGetPosts
    );
    assert(
      resEmptyGetPosts.statusCode === 200 && Array.isArray(resEmptyGetPosts.body),
      'GET /api/admin/content?type=posts with empty body and no content-type returns 200'
    );

    // 3. Create a test post to test GET single and DELETE with empty body & no content-type
    const testPostC = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        url: '/api/admin/content?type=post',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Post Empty Body Browser Test',
          slug: `${testPostPrefix}-c`,
          category: 'study-in-europe',
          summary: 'Testing empty body handling.',
          body_md: 'Content here',
          status: 'draft',
        }),
      },
      testPostC
    );
    assert(testPostC.statusCode === 201, 'Created test post C for browser GET/DELETE tests');
    const postCId = testPostC.body?.id;

    // 4. GET single post with empty body and no content-type
    const resEmptyGetPostSingle = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        url: `/api/admin/content?type=post&id=${postCId}`,
        headers: { cookie: adminCookie },
        body: '',
      },
      resEmptyGetPostSingle
    );
    assert(
      resEmptyGetPostSingle.statusCode === 200 && resEmptyGetPostSingle.body?.id === postCId,
      'GET single post with empty body and no content-type returns 200'
    );

    // 5. DELETE post with empty body and no content-type
    const resEmptyDelPost = createMockRes();
    await adminContentHandler(
      {
        method: 'DELETE',
        url: `/api/admin/content?type=post&id=${postCId}`,
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
        },
        body: '',
      },
      resEmptyDelPost
    );
    assert(
      resEmptyDelPost.statusCode === 200 && resEmptyDelPost.body?.ok === true,
      'DELETE post with empty body and no content-type returns 200'
    );

    // 6. Create a test event to test GET single and DELETE with empty body & no content-type
    const testEventD = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        url: '/api/admin/content?type=event',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          type: 'spot-admission',
          title: 'Event Empty Body Browser Test',
          slug: `${testEventPrefix}-d`,
          summary: 'Testing empty body handling for events.',
          status: 'draft',
        }),
      },
      testEventD
    );
    assert(testEventD.statusCode === 201, 'Created test event D for browser GET/DELETE tests');
    const eventDId = testEventD.body?.id;

    // 7. GET single event with empty body and no content-type
    const resEmptyGetEventSingle = createMockRes();
    await adminContentHandler(
      {
        method: 'GET',
        url: `/api/admin/content?type=event&id=${eventDId}`,
        headers: { cookie: adminCookie },
        body: '',
      },
      resEmptyGetEventSingle
    );
    assert(
      resEmptyGetEventSingle.statusCode === 200 && resEmptyGetEventSingle.body?.id === eventDId,
      'GET single event with empty body and no content-type returns 200'
    );

    // 8. DELETE event with empty body and no content-type
    const resEmptyDelEvent = createMockRes();
    await adminContentHandler(
      {
        method: 'DELETE',
        url: `/api/admin/content?type=event&id=${eventDId}`,
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
        },
        body: '',
      },
      resEmptyDelEvent
    );
    assert(
      resEmptyDelEvent.statusCode === 200 && resEmptyDelEvent.body?.ok === true,
      'DELETE event with empty body and no content-type returns 200'
    );

    // 9. POST with empty body returns 400 validation error (NOT invalid_json)
    const resEmptyPost = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        url: '/api/admin/content?type=event',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
        },
        body: '',
      },
      resEmptyPost
    );
    assert(
      resEmptyPost.statusCode === 400 && resEmptyPost.body?.error === 'validation',
      'POST with empty body returns 400 validation error (not invalid_json)'
    );

    // 10. POST with malformed JSON string returns 400 invalid_json
    const resMalformedPost = createMockRes();
    await adminContentHandler(
      {
        method: 'POST',
        url: '/api/admin/content?type=event',
        headers: {
          cookie: adminCookie,
          host: defaultHost,
          origin: defaultOrigin,
        },
        body: '{not-json',
      },
      resMalformedPost
    );
    assert(
      resMalformedPost.statusCode === 400 && resMalformedPost.body?.error === 'invalid_json',
      'POST with malformed JSON string returns 400 invalid_json'
    );
  } finally {
    // -------------------------------------------------------------------------
    // 9. Clean up all test data
    // -------------------------------------------------------------------------
    console.log('\n9. Cleaning up test data...');
    await sql`DELETE FROM leads WHERE email IN ('applicant@example.com', 'another@example.com') OR phone LIKE '+919895111%'`;
    await sql`DELETE FROM events WHERE slug LIKE ${`${testEventPrefix}%`}`;
    await sql`DELETE FROM blog_posts WHERE slug LIKE ${`${testPostPrefix}%`}`;
    console.log('✓ Cleanup completed.');
  }

  console.log(`\n--- Results: ${passed} passed, ${failed} failed ---`);
  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test suite failed with unexpected error:', err);
  process.exit(1);
});
