// ============================================================
//  Specteq Load Test — 1000 User Registrations
//  Target: Live Render backend
//  Run with: node load-test.js
// ============================================================

const BASE_URL = 'https://specteq2026-backend.onrender.com';
const TOTAL_USERS = 1000;
const BATCH_SIZE = 50; // concurrent requests per batch

const results = {
  success: 0,
  failed: 0,
  errors: 0,
  responseTimes: [],
  statusCodes: {},
};

async function registerUser(index) {
  const userData = {
    fullName: `LoadTest User ${index}`,
    email: `loadtest_${index}_${Date.now()}@test.com`,
    password: 'TestPass123!',
  };

  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const elapsed = Date.now() - start;
    results.responseTimes.push(elapsed);

    const code = res.status;
    results.statusCodes[code] = (results.statusCodes[code] || 0) + 1;

    if (code === 201) {
      results.success++;
      process.stdout.write('\x1b[32m.\x1b[0m'); // green dot
    } else {
      results.failed++;
      process.stdout.write('\x1b[33mF\x1b[0m'); // yellow F
    }
  } catch (err) {
    results.errors++;
    results.responseTimes.push(Date.now() - start);
    process.stdout.write('\x1b[31mE\x1b[0m'); // red E
  }
}

async function runBatch(indices) {
  await Promise.all(indices.map(i => registerUser(i)));
}

function avg(arr) {
  return arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
}

function percentile(arr, p) {
  const sorted = [...arr].sort((a, b) => a - b);
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, idx)];
}

async function runLoadTest() {
  console.log('='.repeat(60));
  console.log('  SPECTEQ LOAD TEST — 1000 User Registrations');
  console.log('='.repeat(60));
  console.log(`  Target:     ${BASE_URL}`);
  console.log(`  Users:      ${TOTAL_USERS}`);
  console.log(`  Batch size: ${BATCH_SIZE} concurrent`);
  console.log('='.repeat(60));
  console.log('\n  Legend: . = Success  F = Failed  E = Network Error\n');

  const testStart = Date.now();

  for (let i = 0; i < TOTAL_USERS; i += BATCH_SIZE) {
    const batchIndices = [];
    for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_USERS); j++) {
      batchIndices.push(j + 1);
    }
    await runBatch(batchIndices);

    const done = Math.min(i + BATCH_SIZE, TOTAL_USERS);
    const pct = Math.round((done / TOTAL_USERS) * 100);
    process.stdout.write(` ${pct}%\n`);
  }

  const totalTime = ((Date.now() - testStart) / 1000).toFixed(2);

  console.log('\n' + '='.repeat(60));
  console.log('  RESULTS');
  console.log('='.repeat(60));
  console.log(`  Successful:      ${results.success} / ${TOTAL_USERS}`);
  console.log(`  Failed (4xx):    ${results.failed}`);
  console.log(`  Errors (crash):  ${results.errors}`);
  console.log(`  Total time:      ${totalTime}s`);
  console.log(`  Throughput:      ${Math.round(TOTAL_USERS / totalTime)} req/s`);
  console.log('');
  console.log('  Response Times:');
  console.log(`    Avg:    ${avg(results.responseTimes)}ms`);
  console.log(`    P50:    ${percentile(results.responseTimes, 50)}ms`);
  console.log(`    P90:    ${percentile(results.responseTimes, 90)}ms`);
  console.log(`    P99:    ${percentile(results.responseTimes, 99)}ms`);
  console.log(`    Max:    ${Math.max(...results.responseTimes)}ms`);
  console.log('');
  console.log('  HTTP Status Code Breakdown:');
  for (const [code, count] of Object.entries(results.statusCodes)) {
    console.log(`    ${code}: ${count} requests`);
  }
  console.log('='.repeat(60));

  const successRate = (results.success / TOTAL_USERS) * 100;
  console.log('\n  VERDICT:');
  if (successRate >= 95) {
    console.log('  EXCELLENT — Server handled load very well!');
  } else if (successRate >= 80) {
    console.log('  GOOD — Some failures under heavy load (expected on free tier)');
  } else if (successRate >= 50) {
    console.log('  STRUGGLING — Server is getting overwhelmed');
  } else {
    console.log('  FAILING — Server cannot handle this load');
  }
  console.log(`  Success Rate: ${successRate.toFixed(1)}%`);
  console.log('='.repeat(60));
}

runLoadTest();
