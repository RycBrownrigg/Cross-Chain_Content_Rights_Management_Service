#!/usr/bin/env node
/**
 * Stress test for centralized DRM server.
 *
 * Mirrors scripts/perf/stress-test.mjs: 200 concurrent clients,
 * 3 minutes sustained load.
 *
 * @module stress
 *
 * Usage: node bench/stress.mjs [server-url]
 */

import { writeFileSync, mkdirSync } from 'fs';

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const NUM_CLIENTS = 200;
const DURATION_SECS = 180;

async function post(path, body) {
  const start = Date.now();
  try {
    const resp = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return { ok: resp.ok, latencyMs: Date.now() - start, serverLatencyMs: data.latencyMs || 0 };
  } catch {
    return { ok: false, latencyMs: Date.now() - start, serverLatencyMs: 0 };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' Centralized DRM Stress Test');
  console.log(`  Clients: ${NUM_CLIENTS}, Duration: ${DURATION_SECS}s`);
  console.log('═══════════════════════════════════════════════════════════');

  // Setup
  await post('/setup/reset', {});
  for (let i = 0; i < NUM_CLIENTS; i++) {
    await post('/setup/balance', { userId: `stress_${i}`, amount: 100000000 });
  }
  console.log(`  ${NUM_CLIENTS} accounts funded.`);

  let totalSubmitted = 0;
  let totalSucceeded = 0;
  let totalFailed = 0;
  let batchNum = 0;
  const allLatencies = [];

  const startTime = Date.now();
  const endTime = startTime + DURATION_SECS * 1000;

  console.log('  Time  | Submitted | Succeeded | Failed | TPS');
  console.log('  ──────|───────────|───────────|────────|────');

  while (Date.now() < endTime) {
    batchNum++;
    const promises = Array.from({ length: NUM_CLIENTS }, (_, i) =>
      post('/content', {
        creatorId: `stress_${i}`,
        metadataHash: `0x${batchNum}_${i}`,
        title: `Stress ${batchNum}-${i}`,
        subscriptionPrice: 100,
        ppvPrice: 10,
        ownershipPrice: 500,
        periodLength: 600,
      })
    );

    const results = await Promise.all(promises);
    totalSubmitted += results.length;
    for (const r of results) {
      if (r.ok) { totalSucceeded++; allLatencies.push(r.latencyMs); }
      else totalFailed++;
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const tps = elapsed > 0 ? (totalSucceeded / elapsed).toFixed(0) : '0';
    console.log(`  ${String(elapsed).padStart(4)}s | ${String(totalSubmitted).padStart(9)} | ${String(totalSucceeded).padStart(9)} | ${String(totalFailed).padStart(6)} | ${tps}`);
  }

  const totalTime = (Date.now() - startTime) / 1000;
  allLatencies.sort((a, b) => a - b);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(' STRESS TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  Duration:          ${totalTime.toFixed(1)}s`);
  console.log(`  Total submitted:   ${totalSubmitted}`);
  console.log(`  Total succeeded:   ${totalSucceeded}`);
  console.log(`  Total failed:      ${totalFailed}`);
  console.log(`  Success rate:      ${((totalSucceeded / totalSubmitted) * 100).toFixed(1)}%`);
  console.log(`  Sustained TPS:     ${(totalSucceeded / totalTime).toFixed(0)}`);
  console.log(`  Latency p50:       ${allLatencies[Math.floor(allLatencies.length * 0.5)]}ms`);
  console.log(`  Latency p95:       ${allLatencies[Math.floor(allLatencies.length * 0.95)]}ms`);
  console.log(`  Latency p99:       ${allLatencies[Math.floor(allLatencies.length * 0.99)]}ms`);
  console.log('═══════════════════════════════════════════════════════════');

  mkdirSync('bench/results', { recursive: true });
  writeFileSync('bench/results/stress-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    config: { numClients: NUM_CLIENTS, durationSecs: DURATION_SECS },
    summary: {
      totalSubmitted, totalSucceeded, totalFailed,
      successRate: totalSucceeded / totalSubmitted,
      sustainedTps: totalSucceeded / totalTime,
      latencyP50: allLatencies[Math.floor(allLatencies.length * 0.5)],
      latencyP95: allLatencies[Math.floor(allLatencies.length * 0.95)],
      latencyP99: allLatencies[Math.floor(allLatencies.length * 0.99)],
    },
  }, null, 2));
  console.log('  Results saved to bench/results/stress-results.json');
}

main().catch((e) => { console.error('Failed:', e.message); process.exit(1); });
