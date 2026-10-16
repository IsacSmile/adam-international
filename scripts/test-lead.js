import { neonConfig } from '@neondatabase/serverless';
import handler from '../api/lead.js';
import { sql } from '../api/_lib/db.js';
import { formatEventErrorMessage, isRegistrationOpen, getClosedRegistrationLabel } from '../src/lib/events.js';

// Resilient retry wrapper for test runner across network latency
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
    setHeader(key, value) {
      this.headers[key.toLowerCase()] = value;
      return this;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

async function run() {
  const testIp = '127.0.0.99';
  console.log('--- Starting Lead API Test Suite ---');

  // 1. First LIST how many existing test leads are in the DB, then delete only those
  const existingTestLeads = await sql`
    SELECT id, name, email, phone FROM leads
    WHERE phone LIKE '+919895111%' OR name LIKE 'Test Lead%'
  `;
  console.log(`Found ${existingTestLeads.length} existing test leads in the database before starting.`);
  if (existingTestLeads.length > 0) {
    console.log('Cleaning up existing test leads:');
    existingTestLeads.forEach((l) => console.log(`  - Lead ID ${l.id}: ${l.name} (${l.phone})`));
    await sql`DELETE FROM leads WHERE phone LIKE '+919895111%' OR name LIKE 'Test Lead%'`;
  }
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

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

  const dedicatedOpenEventSlug = `test-lead-open-${Date.now()}`;
  const dedicatedClosedEventSlug = `test-lead-closed-${Date.now()}`;

  try {
    // Insert dedicated test events inside the test run so tests do not rely on manual content
    await sql`
      INSERT INTO events (
        type, status, title, slug, summary, country, date, registration_open, created_at, updated_at
      ) VALUES (
        'spot-admission', 'published', 'Dedicated Open Test Event', ${dedicatedOpenEventSlug},
        'Summary for open test event', 'hungary', '2026-11-20', true, NOW(), NOW()
      )
    `;
    await sql`
      INSERT INTO events (
        type, status, title, slug, summary, country, date, registration_open, created_at, updated_at
      ) VALUES (
        'spot-admission', 'published', 'Dedicated Closed Test Event', ${dedicatedClosedEventSlug},
        'Summary for closed test event', 'germany', '2026-11-20', false, NOW(), NOW()
      )
    `;

  function getValidWorkingDayIST() {
    for (let i = 1; i <= 60; i++) {
      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      const [y, m, d] = todayStr.split('-').map(Number);
      const date = new Date(Date.UTC(y, m - 1, d + i));
      const day = date.getUTCDay();
      if (day >= 1 && day <= 5) {
        return date.toISOString().slice(0, 10);
      }
    }
  }

  function getWeekendDayIST() {
    for (let i = 1; i <= 60; i++) {
      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
      const [y, m, d] = todayStr.split('-').map(Number);
      const date = new Date(Date.UTC(y, m - 1, d + i));
      const day = date.getUTCDay();
      if (day === 0 || day === 6) {
        return date.toISOString().slice(0, 10);
      }
    }
  }

  function getPastDateIST() {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const [y, m, d] = todayStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d - 2));
    return date.toISOString().slice(0, 10);
  }

  function getFarFutureDateIST() {
    const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const [y, m, d] = todayStr.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d + 70));
    return date.toISOString().slice(0, 10);
  }

  // ---------------------------------------------------------------------------
  // 1. Basic Appointment Form (default formType)
  // ---------------------------------------------------------------------------
  console.log('\n1. Test Appointment Form (default):');
  const resAppt = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead Appointment',
        email: 'appt@example.com',
        phone: '+919895111001',
        consent: true,
        country: 'United Kingdom',
        service: 'Career Counselling',
        branch: 'Kochi (Head Office)',
      },
    },
    resAppt
  );
  assert(resAppt.statusCode === 200 && resAppt.body?.ok === true, 'Appointment lead accepted with 200');

  // ---------------------------------------------------------------------------
  // 2. Duplicate Guard (same phone + same formType within 10 min)
  // ---------------------------------------------------------------------------
  console.log('\n2. Test Duplicate Guard (same phone + same formType):');
  const resDup = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead Appointment Dup',
        email: 'appt-dup@example.com',
        phone: '+919895111001',
        consent: true,
      },
    },
    resDup
  );
  assert(
    resDup.statusCode === 200 && resDup.body?.duplicate === true,
    'Duplicate phone + formType returns 200 with duplicate: true'
  );

  // ---------------------------------------------------------------------------
  // 3. Different Form Type with same phone (should NOT be duplicate)
  // ---------------------------------------------------------------------------
  console.log('\n3. Test Same Phone with DIFFERENT Form Type:');
  const resDiffForm = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'eligibility',
        name: 'Test Lead Eligibility SamePhone',
        email: 'diff-form@example.com',
        phone: '+919895111001',
        consent: true,
        details: {
          qualification: "Bachelor's degree",
          score: '80%',
        },
      },
    },
    resDiffForm
  );
  assert(
    resDiffForm.statusCode === 200 && resDiffForm.body?.duplicate !== true,
    'Different formType with same phone is NOT treated as duplicate'
  );

  // Clear IP log so rate limit does not interfere
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

  // ---------------------------------------------------------------------------
  // 4. Form Type: Eligibility Check
  // ---------------------------------------------------------------------------
  console.log('\n4. Test Form Type: Eligibility Check:');
  const resElig = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'eligibility',
        name: 'Test Lead Eligibility',
        email: 'elig@example.com',
        phone: '+919895111002',
        consent: true,
        details: {
          qualification: "Bachelor's degree",
          score: '85%',
          fieldOfStudy: 'Computer Science',
          graduationYear: '2024',
          englishTest: 'IELTS',
          country: 'Germany',
          budget: '₹10–15 lakh',
        },
      },
    },
    resElig
  );
  assert(resElig.statusCode === 200 && resElig.body?.ok === true, 'Eligibility enquiry accepted with 200');

  // ---------------------------------------------------------------------------
  // 5. Form Type: Admission Enquiry
  // ---------------------------------------------------------------------------
  console.log('\n5. Test Form Type: Admission Enquiry:');
  const resAdm = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'admission',
        name: 'Test Lead Admission',
        email: 'adm@example.com',
        phone: '+919895111003',
        consent: true,
        details: {
          qualification: "Bachelor's degree",
          score: '7.8 CGPA',
          courseInterest: 'MSc Data Science',
          country: 'United Kingdom',
          intake: 'Not sure yet',
        },
      },
    },
    resAdm
  );
  assert(resAdm.statusCode === 200 && resAdm.body?.ok === true, 'Admission enquiry accepted with 200');

  // ---------------------------------------------------------------------------
  // 6. Form Type: Visa Enquiry
  // ---------------------------------------------------------------------------
  console.log('\n6. Test Form Type: Visa Enquiry:');
  const resVisa = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'visa',
        name: 'Test Lead Visa',
        email: 'visa@example.com',
        phone: '+919895111004',
        whatsapp: true,
        consent: true,
        message: 'Need help with France student visa appointment and document checklist.',
        details: {
          currentQualification: "Bachelor's degree",
          country: 'France',
          admissionStatus: "I've received an offer",
        },
      },
    },
    resVisa
  );
  assert(resVisa.statusCode === 200 && resVisa.body?.ok === true, 'Visa enquiry accepted with 200');

  // ---------------------------------------------------------------------------
  // 7. Form Type: Training Enquiry
  // ---------------------------------------------------------------------------
  console.log('\n7. Test Form Type: Training Enquiry:');
  const resTrain = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'training',
        name: 'Test Lead Training',
        email: 'train@example.com',
        phone: '+919895111005',
        whatsapp: false,
        consent: true,
        message: 'Interested in German language A1/A2 batch schedule.',
        details: {
          programme: 'Not sure yet',
        },
      },
    },
    resTrain
  );
  assert(resTrain.statusCode === 200 && resTrain.body?.ok === true, 'Training enquiry accepted with 200');

  // Clear IP log
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

  // ---------------------------------------------------------------------------
  // 7b. Form Type: Contact Enquiry (Valid without consultation)
  // ---------------------------------------------------------------------------
  console.log('\n7b. Test Form Type: Contact Enquiry:');
  const resContact = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'contact',
        name: 'Test Lead Contact',
        email: 'contact@example.com',
        phone: '+919895111020',
        consent: true,
        country: 'Germany',
        message: 'This is an enquiry about studying in Germany.',
      },
    },
    resContact
  );
  assert(resContact.statusCode === 200 && resContact.body?.ok === true, 'Contact enquiry accepted with 200');

  // ---------------------------------------------------------------------------
  // 7c. Form Type: Contact Enquiry (Valid with Consultation Date & Time)
  // ---------------------------------------------------------------------------
  console.log('\n7c. Test Form Type: Contact Enquiry with Consultation Date & Time:');
  const validWorkingDay = getValidWorkingDayIST();
  const resContactDateTime = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'contact',
        name: 'Test Lead Contact DateTime',
        email: 'contact-datetime@example.com',
        phone: '+919895111021',
        consent: true,
        country: 'France',
        message: 'I want to book an in-person consultation.',
        details: {
          preferredDate: validWorkingDay,
          preferredTime: 'Morning (9:30 AM – 12:00 PM)',
        },
      },
    },
    resContactDateTime
  );
  assert(
    resContactDateTime.statusCode === 200 && resContactDateTime.body?.ok === true,
    'Contact enquiry with valid date & time accepted with 200'
  );

  // ---------------------------------------------------------------------------
  // 7d. Form Type: Contact Enquiry (Weekend Date Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n7d. Test Contact Enquiry Weekend Date Rejected:');
  const weekendDay = getWeekendDayIST();
  const resContactWeekend = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'contact',
        name: 'Test Lead Contact Weekend',
        email: 'contact-weekend@example.com',
        phone: '+919895111022',
        consent: true,
        message: 'This has a weekend consultation date.',
        details: {
          preferredDate: weekendDay,
          preferredTime: 'Morning (9:30 AM – 12:00 PM)',
        },
      },
    },
    resContactWeekend
  );
  assert(
    resContactWeekend.statusCode === 400 &&
      resContactWeekend.body?.fields?.preferredDate === 'Please choose a working day within the next 60 days.',
    'Contact enquiry with weekend date rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 7e. Form Type: Contact Enquiry (Past Date Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n7e. Test Contact Enquiry Past Date Rejected:');
  const pastDay = getPastDateIST();
  const resContactPast = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'contact',
        name: 'Test Lead Contact Past',
        email: 'contact-past@example.com',
        phone: '+919895111023',
        consent: true,
        message: 'This has a past consultation date.',
        details: {
          preferredDate: pastDay,
          preferredTime: 'Morning (9:30 AM – 12:00 PM)',
        },
      },
    },
    resContactPast
  );
  assert(
    resContactPast.statusCode === 400 &&
      resContactPast.body?.fields?.preferredDate === 'Please choose a working day within the next 60 days.',
    'Contact enquiry with past date rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 7f. Form Type: Contact Enquiry (Date > 60 Days Ahead Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n7f. Test Contact Enquiry Date > 60 Days Ahead Rejected:');
  const futureDay = getFarFutureDateIST();
  const resContactFuture = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'contact',
        name: 'Test Lead Contact FarFuture',
        email: 'contact-future@example.com',
        phone: '+919895111024',
        consent: true,
        message: 'This has a consultation date > 60 days.',
        details: {
          preferredDate: futureDay,
          preferredTime: 'Morning (9:30 AM – 12:00 PM)',
        },
      },
    },
    resContactFuture
  );
  assert(
    resContactFuture.statusCode === 400 &&
      resContactFuture.body?.fields?.preferredDate === 'Please choose a working day within the next 60 days.',
    'Contact enquiry with date > 60 days ahead rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 7g. Form Type: Event Registration (Valid)
  // ---------------------------------------------------------------------------
  console.log('\n7g. Test Form Type: Event Registration:');
  const resEvent = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'event',
        name: 'Test Lead Event Open',
        email: 'event-open@example.com',
        phone: '+919895111030',
        consent: true,
        country: 'Hungary',
        message: 'Looking forward to the Hungary spot admission event.',
        details: {
          eventSlug: dedicatedOpenEventSlug,
          qualification: "Bachelor's degree",
          country: 'Hungary',
        },
      },
    },
    resEvent
  );
  assert(resEvent.statusCode === 200 && resEvent.body?.ok === true, 'Valid event registration accepted with 200');

  // ---------------------------------------------------------------------------
  // 7h. Form Type: Event Registration (Unknown eventSlug Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n7h. Test Event Registration Unknown eventSlug Rejected:');
  const resEventUnknown = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'event',
        name: 'Test Lead Event Unknown',
        email: 'event-unknown@example.com',
        phone: '+919895111031',
        consent: true,
        details: {
          eventSlug: 'non-existent-event-slug',
          qualification: "Bachelor's degree",
        },
      },
    },
    resEventUnknown
  );
  assert(
    resEventUnknown.statusCode === 400 &&
      resEventUnknown.body?.fields?.eventSlug === 'Unknown event selected.',
    'Event registration with unknown eventSlug rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 7i. Form Type: Event Registration (Award Slug Rejected)
  // ---------------------------------------------------------------------------
  console.log('\n7i. Test Event Registration Award Slug Rejected:');
  const resEventAward = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'event',
        name: 'Test Lead Event Award',
        email: 'event-award@example.com',
        phone: '+919895111032',
        consent: true,
        details: {
          eventSlug: 'consumer-protection-award-2026',
          qualification: "Bachelor's degree",
        },
      },
    },
    resEventAward
  );
  assert(
    resEventAward.statusCode === 400 &&
      resEventAward.body?.fields?.eventSlug === 'Registrations are not open for this event.',
    'Event registration for award slug rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 7j. Event Banner Message Mapping
  // ---------------------------------------------------------------------------
  console.log('\n7j. Test Event Banner Message Mapping & Closed Registration Labels:');
  assert(
    formatEventErrorMessage('Registrations are not open for this event.') ===
      'Registration not open yet — talk to an advisor',
    'Banner for "Registrations are not open..." maps to "Registration not open yet — talk to an advisor"'
  );
  assert(
    formatEventErrorMessage('This event is not available for registration.') ===
      'This event is no longer available.',
    'Banner for "This event is not available..." maps to "This event is no longer available."'
  );
  assert(
    formatEventErrorMessage('Unknown event selected.') === 'This event is no longer available.',
    'Banner for "Unknown event selected." maps to "This event is no longer available."'
  );
  assert(
    formatEventErrorMessage('This event has ended.') === 'Registration closed',
    'Banner for "This event has ended." maps to "Registration closed"'
  );
  assert(
    getClosedRegistrationLabel({ registration_open: false, date: '2026-12-01' }, new Date('2026-10-01')) ===
      'Registration not open yet — talk to an advisor',
    'getClosedRegistrationLabel returns "Registration not open yet — talk to an advisor" for upcoming closed event'
  );
  assert(
    getClosedRegistrationLabel({ registration_open: false, date: '2020-01-01' }, new Date('2026-10-01')) ===
      'Registration closed',
    'getClosedRegistrationLabel returns "Registration closed" for ended event'
  );

  // ---------------------------------------------------------------------------
  // 7k. Unit Tests for isRegistrationOpen (Single Source of Truth)
  // ---------------------------------------------------------------------------
  console.log('\n7k. Unit Tests for isRegistrationOpen:');
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthStr = `${currentYear}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Open event (published, registration_open: true, upcoming date)
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        date: `${currentYear + 1}-06-15`,
      },
      now
    ) === true,
    'isRegistrationOpen returns true for open published upcoming event'
  );

  // 2. Closed flag (registration_open: false)
  assert(
    isRegistrationOpen(
      {
        registration_open: false,
        status: 'published',
        type: 'spot-admission',
        date: `${currentYear + 1}-06-15`,
      },
      now
    ) === false,
    'isRegistrationOpen returns false when registration_open is false'
  );

  // 3. Draft status
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'draft',
        type: 'spot-admission',
        date: `${currentYear + 1}-06-15`,
      },
      now
    ) === false,
    'isRegistrationOpen returns false when status is draft'
  );

  // 4. Ended exact date
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        date: '2020-01-01',
      },
      now
    ) === false,
    'isRegistrationOpen returns false for ended exact date'
  );

  // 5. Month-only current month (counts as not ended until end of month in IST)
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        month: currentMonthStr,
      },
      now
    ) === true,
    'isRegistrationOpen returns true for month-only current month'
  );

  // 6. Month-only past month
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        month: '2020-01',
      },
      now
    ) === false,
    'isRegistrationOpen returns false for month-only past month'
  );

  // 7. Year-only current/future year vs past year
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        year: String(currentYear + 1),
      },
      now
    ) === true,
    'isRegistrationOpen returns true for future year-only event'
  );
  assert(
    isRegistrationOpen(
      {
        registration_open: true,
        status: 'published',
        type: 'spot-admission',
        year: '2020',
      },
      now
    ) === false,
    'isRegistrationOpen returns false for past year-only event'
  );

  // ---------------------------------------------------------------------------
  // 7l. API Tests for Closed Event Rejection & Open Event Acceptance
  // ---------------------------------------------------------------------------
  console.log('\n7l. API Tests: Closed Event Rejection vs Open Event Acceptance:');

  // Closed Event Rejection (using dedicated test event with registration_open = false)
  const resClosedEvent = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'event',
        name: 'Test Lead Closed Event',
        email: 'closed-event@example.com',
        phone: '+919895111050',
        consent: true,
        details: {
          eventSlug: dedicatedClosedEventSlug,
          qualification: "Bachelor's degree",
        },
      },
    },
    resClosedEvent
  );
  assert(
    resClosedEvent.statusCode === 400 &&
      resClosedEvent.body?.fields?.eventSlug === 'Registrations are not open for this event.',
    'API POST /api/lead rejects closed event with 400 validation error'
  );

  // Open Event Acceptance (using dedicated test event with registration_open = true)
  const resOpenEvent = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'event',
        name: 'Test Lead Open Event Dedicated',
        email: 'open-dedicated-event@example.com',
        phone: '+919895111051',
        consent: true,
        details: {
          eventSlug: dedicatedOpenEventSlug,
          qualification: "Bachelor's degree",
        },
      },
    },
    resOpenEvent
  );
  assert(
    resOpenEvent.statusCode === 200 && resOpenEvent.body?.ok === true,
    'API POST /api/lead accepts open event with 200 OK'
  );

  // Clear IP log
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

  // ---------------------------------------------------------------------------
  // 8. Unknown Detail Key Being Dropped
  // ---------------------------------------------------------------------------
  console.log('\n8. Test Unknown Detail Key Dropped:');
  const resDropped = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'eligibility',
        name: 'Test Lead UnknownKeyDropped',
        email: 'dropped@example.com',
        phone: '+919895111006',
        consent: true,
        details: {
          qualification: 'Plus Two',
          score: '92%',
          secretHackerKey: 'injected_extra_value',
          isAdmin: true,
        },
      },
    },
    resDropped
  );
  assert(resDropped.statusCode === 200 && resDropped.body?.ok === true, 'Submission with unknown detail keys accepted');

  // Verify in database that unknown keys were omitted
  const [droppedRow] = await sql`
    SELECT details FROM leads
    WHERE email = 'dropped@example.com'
    LIMIT 1
  `;
  const savedDetails = droppedRow?.details || {};
  assert(
    savedDetails.qualification === 'Plus Two' &&
    savedDetails.score === '92%' &&
    savedDetails.secretHackerKey === undefined &&
    savedDetails.isAdmin === undefined,
    'Database row contains allowed keys and omitted unknown keys'
  );

  // ---------------------------------------------------------------------------
  // 9. Invalid Detail Value Rejected (400)
  // ---------------------------------------------------------------------------
  console.log('\n9. Test Invalid Detail Value Rejected (400):');
  // Invalid select option
  const resBadSelect = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'eligibility',
        name: 'Test Lead BadSelect',
        email: 'badopt@example.com',
        phone: '+919895111007',
        consent: true,
        details: {
          qualification: 'Super Doctorate in Sorcery',
        },
      },
    },
    resBadSelect
  );
  assert(
    resBadSelect.statusCode === 400 && resBadSelect.body?.error === 'validation',
    'Invalid select option rejected with 400 validation error'
  );

  // Text exceeding max length
  const resBadLength = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'eligibility',
        name: 'Test Lead BadLength',
        email: 'badlen@example.com',
        phone: '+919895111008',
        consent: true,
        details: {
          score: 'A'.repeat(25), // max is 20
        },
      },
    },
    resBadLength
  );
  assert(
    resBadLength.statusCode === 400 && resBadLength.body?.error === 'validation',
    'Text exceeding max length rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 10. Unknown Form Type Rejected (400)
  // ---------------------------------------------------------------------------
  console.log('\n10. Test Unknown Form Type Rejected (400):');
  const resBadForm = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        formType: 'super_secret_form',
        name: 'Test Lead BadForm',
        email: 'badform@example.com',
        phone: '+919895111009',
        consent: true,
      },
    },
    resBadForm
  );
  assert(
    resBadForm.statusCode === 400 && resBadForm.body?.error === 'validation',
    'Unknown formType rejected with 400 validation error'
  );

  // ---------------------------------------------------------------------------
  // 11. Other Existing Edge Cases (Phone, Consent, Honeypot, GET method)
  // ---------------------------------------------------------------------------
  console.log('\n11. Test Standard Validation Edge Cases:');
  // Bad phone
  const resBadPhone = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead BadPhone',
        email: 'badphone@example.com',
        phone: '12345',
        consent: true,
      },
    },
    resBadPhone
  );
  assert(resBadPhone.statusCode === 400, 'Invalid phone number rejected with 400');

  // Consent false
  const resNoConsent = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead NoConsent',
        email: 'noconsent@example.com',
        phone: '+919895111010',
        consent: false,
      },
    },
    resNoConsent
  );
  assert(resNoConsent.statusCode === 400, 'Missing consent rejected with 400');

  // Honeypot filled
  const resBot = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead Bot',
        email: 'bot@example.com',
        phone: '+919895111011',
        company_website: 'https://spam-bot.com',
        consent: true,
      },
    },
    resBot
  );
  assert(resBot.statusCode === 200, 'Honeypot returns 200 immediately without saving');

  // GET request rejected
  const resGet = createMockRes();
  await handler(
    {
      method: 'GET',
      headers: { 'x-forwarded-for': testIp },
    },
    resGet
  );
  assert(resGet.statusCode === 405, 'GET method rejected with 405');

  // ---------------------------------------------------------------------------
  // 11b. Country Validation Tests (Sweden, Czech Republic, United States)
  // ---------------------------------------------------------------------------
  console.log('\n11b. Country Validation Tests (Sweden, Czech Republic, United States):');

  // Test Sweden is saved
  const resSweden = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead Sweden',
        email: 'sweden@example.com',
        phone: '+919895111020',
        consent: true,
        country: 'Sweden',
      },
    },
    resSweden
  );
  assert(resSweden.statusCode === 200 && resSweden.body?.ok === true, 'Lead with country Sweden accepted');

  // Test Czech Republic is saved
  const resCzech = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead Czech Republic',
        email: 'czech@example.com',
        phone: '+919895111021',
        consent: true,
        country: 'Czech Republic',
      },
    },
    resCzech
  );
  assert(resCzech.statusCode === 200 && resCzech.body?.ok === true, 'Lead with country Czech Republic accepted');

  // Test United States is stored as null
  const resUS = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead United States',
        email: 'us@example.com',
        phone: '+919895111022',
        consent: true,
        country: 'United States',
      },
    },
    resUS
  );
  assert(resUS.statusCode === 200 && resUS.body?.ok === true, 'Lead with country United States accepted');

  // ---------------------------------------------------------------------------
  // 12. Database Verification & Cleanup
  // ---------------------------------------------------------------------------
  console.log('\n12. Database Verification & Cleanup:');
  const testRows = await sql`
    SELECT id, name, email, phone, country, form_type, details
    FROM leads
    WHERE name LIKE 'Test Lead%'
    ORDER BY id ASC
  `;
  console.log(`  Total test rows created in database: ${testRows.length}`);
  assert(testRows.length > 0, 'Test leads were recorded in Neon database');

  // Verify Sweden, Czech Republic, and United States
  const swedenRow = testRows.find((r) => r.name === 'Test Lead Sweden');
  assert(swedenRow && swedenRow.country === 'Sweden', 'DB Row: country Sweden is saved correctly');

  const czechRow = testRows.find((r) => r.name === 'Test Lead Czech Republic');
  assert(czechRow && czechRow.country === 'Czech Republic', 'DB Row: country Czech Republic is saved correctly');

  const usRow = testRows.find((r) => r.name === 'Test Lead United States');
  assert(usRow && usRow.country === null, 'DB Row: country United States is stored as null');

  // Verify each of the 5 form types
  const apptRow = testRows.find((r) => r.name === 'Test Lead Appointment');
  assert(apptRow && apptRow.form_type === 'appointment', 'DB Row: appointment has form_type="appointment"');

  const eligRow = testRows.find((r) => r.name === 'Test Lead Eligibility');
  assert(
    eligRow &&
    eligRow.form_type === 'eligibility' &&
    eligRow.details?.qualification === "Bachelor's degree" &&
    eligRow.details?.country === 'Germany',
    'DB Row: eligibility has form_type="eligibility" with matching qualification and country'
  );

  const admRow = testRows.find((r) => r.name === 'Test Lead Admission');
  assert(
    admRow &&
    admRow.form_type === 'admission' &&
    admRow.details?.courseInterest === 'MSc Data Science' &&
    admRow.details?.country === 'United Kingdom',
    'DB Row: admission has form_type="admission" with matching courseInterest and country'
  );

  const visaRow = testRows.find((r) => r.name === 'Test Lead Visa');
  assert(
    visaRow &&
    visaRow.form_type === 'visa' &&
    visaRow.details?.country === 'France' &&
    visaRow.details?.admissionStatus === "I've received an offer",
    'DB Row: visa has form_type="visa" with matching country and admissionStatus'
  );

  const trainRow = testRows.find((r) => r.name === 'Test Lead Training');
  assert(
    trainRow &&
    trainRow.form_type === 'training' &&
    trainRow.details?.programme === 'Not sure yet',
    'DB Row: training has form_type="training" with matching programme'
  );

  const contactRow = testRows.find((r) => r.name === 'Test Lead Contact');
  assert(contactRow && contactRow.form_type === 'contact', 'DB Row: contact has form_type="contact"');

  const contactDtRow = testRows.find((r) => r.name === 'Test Lead Contact DateTime');
  assert(
    contactDtRow &&
    contactDtRow.form_type === 'contact' &&
    contactDtRow.details?.preferredDate === validWorkingDay &&
    contactDtRow.details?.preferredTime === 'Morning (9:30 AM – 12:00 PM)',
    'DB Row: contact with date/time saved properly'
  );

  const eventRow = testRows.find((r) => r.name === 'Test Lead Event Open');
  assert(
    eventRow &&
    eventRow.form_type === 'event' &&
    eventRow.details?.eventSlug === dedicatedOpenEventSlug &&
    eventRow.details?.qualification === "Bachelor's degree",
    'DB Row: event has form_type="event" with matching eventSlug and qualification'
  );

  console.log('  Confirmed DB rows for all 7 form types:');
  [apptRow, eligRow, admRow, visaRow, trainRow, contactRow, contactDtRow, eventRow].forEach((r) => {
    if (r) {
      console.log(`   - [${r.form_type}] ${r.name}: details = ${JSON.stringify(r.details || {})}`);
    }
  });
  } finally {
    // -------------------------------------------------------------------------
    // 13. Guaranteed Cleanup in finally block
    // -------------------------------------------------------------------------
    console.log('\n--- Cleanup in finally block ---');
    try {
      if (dedicatedClosedEventSlug) {
        await sql`DELETE FROM events WHERE slug = ${dedicatedClosedEventSlug}`;
      }
      if (dedicatedOpenEventSlug) {
        await sql`DELETE FROM events WHERE slug = ${dedicatedOpenEventSlug}`;
      }
      await sql`DELETE FROM leads WHERE phone LIKE '+919895111%' OR name LIKE 'Test Lead%'`;
      await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

      const [afterCleanup] = await sql`
        SELECT count(*)::int AS count
        FROM leads
        WHERE phone LIKE '+919895111%' OR name LIKE 'Test Lead%'
      `;
      assert(afterCleanup.count === 0, 'All test leads successfully deleted from database in finally');
      console.log(`✓ Cleanup completed. Remaining test leads: ${afterCleanup.count}`);
    } catch (cleanupErr) {
      console.error('Error during cleanup:', cleanupErr);
    }
  }

  console.log('\n=======================================');
  console.log(`RESULTS: ${passed} passed, ${failed} failed`);
  console.log('=======================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Error running test suite:', err);
  process.exit(1);
});
