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
  const testIp = '127.0.0.42';
  const testPhone = '+919895123456';

  // Ensure clean slate before running test cases
  await sql`DELETE FROM leads WHERE name = 'Test Lead'`;
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;

  // a) valid lead (name "Test Lead", a valid +91 phone, consent true) -> expect 200 ok
  const resA = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: testPhone,
        consent: true,
        country: 'United Kingdom',
        service: 'Career Counseling',
        branch: 'Kochi (Head Office)',
      },
    },
    resA
  );
  console.log(`a) Status: ${resA.statusCode}, Response: ${JSON.stringify(resA.body)}`);

  // b) same phone again -> expect 200 duplicate: true
  const resB = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: testPhone,
        consent: true,
      },
    },
    resB
  );
  console.log(`b) Status: ${resB.statusCode}, Response: ${JSON.stringify(resB.body)}`);

  // c) bad phone "12345" -> expect 400 with phone field error
  const resC = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '12345',
        consent: true,
      },
    },
    resC
  );
  console.log(`c) Status: ${resC.statusCode}, Response: ${JSON.stringify(resC.body)}`);

  // d) consent false -> expect 400
  const resD = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead',
        email: 'test@example.com',
        phone: '+919895123457',
        consent: false,
      },
    },
    resD
  );
  console.log(`d) Status: ${resD.statusCode}, Response: ${JSON.stringify(resD.body)}`);

  // e) honeypot filled -> expect 200 and nothing saved
  const resE = createMockRes();
  await handler(
    {
      method: 'POST',
      headers: { 'x-forwarded-for': testIp },
      body: {
        name: 'Test Lead',
        email: 'bot@example.com',
        phone: '+919895123458',
        company_website: 'https://spam-bot.com',
        consent: true,
      },
    },
    resE
  );
  console.log(`e) Status: ${resE.statusCode}, Response: ${JSON.stringify(resE.body)}`);

  // f) GET request -> expect 405
  const resF = createMockRes();
  await handler(
    {
      method: 'GET',
      headers: { 'x-forwarded-for': testIp },
    },
    resF
  );
  console.log(`f) Status: ${resF.statusCode}, Response: ${JSON.stringify(resF.body)}`);

  // 2. Count rows where name = 'Test Lead'
  const [countRow] = await sql`
    SELECT count(*)::int AS count
    FROM leads
    WHERE name = 'Test Lead'
  `;
  console.log(`Count of rows where name = 'Test Lead': ${countRow.count}`);

  // Delete test rows and matching lead_ip_log rows
  await sql`DELETE FROM leads WHERE name = 'Test Lead'`;
  await sql`DELETE FROM lead_ip_log WHERE ip = ${testIp}`;
  console.log('Cleaned up test rows from leads and lead_ip_log.');
}

run().catch((err) => {
  console.error('Error running test-lead script:', err);
  process.exit(1);
});
