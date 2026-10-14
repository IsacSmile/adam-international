import handler from '../api/lead.js';
import { sql } from '../api/_lib/db.js';

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

  // Ensure clean slate before running tests
  await sql`DELETE FROM leads WHERE name LIKE 'Test Lead%'`;
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
  // 12. Database Verification & Cleanup
  // ---------------------------------------------------------------------------
  console.log('\n12. Database Verification & Cleanup:');
  const testRows = await sql`
    SELECT id, name, email, phone, form_type, details
    FROM leads
    WHERE name LIKE 'Test Lead%'
    ORDER BY id ASC
  `;
  console.log(`  Total test rows created in database: ${testRows.length}`);
  assert(testRows.length > 0, 'Test leads were recorded in Neon database');

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

  console.log('  Confirmed DB rows for all 5 form types:');
  [apptRow, eligRow, admRow, visaRow, trainRow].forEach((r) => {
    if (r) {
      console.log(`   - [${r.form_type}] ${r.name}: details = ${JSON.stringify(r.details || {})}`);
    }
  });

  // Delete all test rows
  await sql`DELETE FROM leads WHERE name LIKE 'Test Lead%'`;
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

  const [afterCleanup] = await sql`
    SELECT count(*)::int AS count
    FROM leads
    WHERE name LIKE 'Test Lead%'
  `;
  assert(afterCleanup.count === 0, 'All test leads successfully deleted from database');

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
