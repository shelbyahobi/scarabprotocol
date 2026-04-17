/**
 * SCARAB Data Access API Integration Tests
 * tests/api/dataAccess.test.js
 *
 * Tests the data API routing and access tier gating.
 * Run with: node tests/api/dataAccess.test.js
 */
const assert = require('assert');

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

async function fetchJSON(path, options = {}) {
    const res = await fetch(`${BASE_URL}${path}`, options);
    return { status: res.status, body: await res.json() };
}

async function runTests() {
    console.log('🧪 Running Data Access API Tests...\n');
    let passed = 0;
    let failed = 0;

    // Test 1: GET /api/data/aggregate returns valid JSON without API key
    try {
        const { status, body } = await fetchJSON('/api/data/aggregate');
        assert.strictEqual(status, 200, 'Expected 200');
        assert.ok(body.total_active_devices !== undefined, 'Missing total_active_devices');
        assert.ok(body.total_kwh_verified !== undefined, 'Missing total_kwh_verified');
        assert.ok(body.total_co2_avoided_kg !== undefined, 'Missing total_co2_avoided_kg');
        assert.ok(body.total_waste_processed_kg !== undefined, 'Missing total_waste_processed_kg');
        console.log('  ✅ GET /api/data/aggregate: returns valid aggregate stats without key');
        passed++;
    } catch (e) {
        console.log(`  ❌ GET /api/data/aggregate: ${e.message}`);
        failed++;
    }

    // Test 2: GET /api/data/jurisdiction/:h3 returns 401 without key
    try {
        const { status } = await fetchJSON('/api/data/jurisdiction/852834bffffffff');
        assert.strictEqual(status, 401, 'Expected 401 without API key');
        console.log('  ✅ GET /api/data/jurisdiction: 401 without API key');
        passed++;
    } catch (e) {
        console.log(`  ❌ GET /api/data/jurisdiction (no key): ${e.message}`);
        failed++;
    }

    // Test 3: POST /api/cluster-waitlist validates and stores correctly
    try {
        const { status, body } = await fetchJSON('/api/cluster-waitlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', lat: 48.5, lon: 9.0, deviceType: 'Bokashi' })
        });
        assert.strictEqual(status, 200, 'Expected 200');
        assert.strictEqual(body.status, 'queued', 'Expected status: queued');
        console.log('  ✅ POST /api/cluster-waitlist: validates and queues');
        passed++;
    } catch (e) {
        console.log(`  ❌ POST /api/cluster-waitlist: ${e.message}`);
        failed++;
    }

    // Test 4: POST /api/municipality/apply stores and returns 200
    try {
        const { status, body } = await fetchJSON('/api/municipality/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                city_name: 'Test Stadt',
                contact_name: 'Max Mustermann',
                role: 'Abfallwirtschaft',
                email: 'max@teststadt.de',
                district_population: '50000'
            })
        });
        assert.strictEqual(status, 200, 'Expected 200');
        assert.strictEqual(body.status, 'received', 'Expected status: received');
        console.log('  ✅ POST /api/municipality/apply: stores and returns 200');
        passed++;
    } catch (e) {
        console.log(`  ❌ POST /api/municipality/apply: ${e.message}`);
        failed++;
    }

    console.log(`\n📊 Results: ${passed} passed, ${failed} failed out of ${passed + failed}`);
    if (failed > 0) process.exit(1);
}

runTests();
