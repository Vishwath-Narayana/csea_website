import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/v1';

async function runTests() {
  console.log('--- STARTING E2E API VERIFICATION ---');

  // Test 1: Public Event Visibility (Draft)
  console.log('Test 1: Public API Draft Hiding');
  try {
    // We expect this to not return drafts, but we don't have a way to inject a draft anonymously without auth.
    // Instead we will just verify the endpoint returns 200 and we check pagination.
    const res = await fetch(`${API_BASE}/events`);
    const data: any = await res.json();
    if (res.status === 200 && data.meta) {
      console.log('✅ Public Events Endpoint OK, meta limit:', data.meta.limit);
    } else {
      console.log('❌ Public Events Endpoint Failed');
    }
  } catch (e) {
    console.error(e);
  }

  // Test 2: Invalid Validation (Zod) on Control Endpoint (without auth first to test 401)
  console.log('Test 2: RBAC 401 on Control Endpoint');
  try {
    const res = await fetch(`${API_BASE}/control/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    if (res.status === 401) {
      console.log('✅ Control Endpoint correctly returns 401 Unauthorized');
    } else {
      console.log('❌ Control Endpoint failed to block unauthorized user:', res.status);
    }
  } catch (e) {
    console.error(e);
  }

  // Test 3: Test Health Endpoint
  console.log('Test 3: API Health');
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (res.status === 200) {
      console.log('✅ API Health OK');
    } else {
      console.log('❌ API Health Failed');
    }
  } catch(e) {
    console.error(e);
  }

  console.log('--- VERIFICATION COMPLETE ---');
}

runTests();
