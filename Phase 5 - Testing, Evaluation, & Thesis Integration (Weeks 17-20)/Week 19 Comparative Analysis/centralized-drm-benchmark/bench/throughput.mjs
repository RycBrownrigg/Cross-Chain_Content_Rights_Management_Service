#!/usr/bin/env node
/**
 * Throughput benchmark for centralized DRM server.
 *
 * Mirrors scripts/perf/local-throughput.mjs methodology:
 * same batch sizes, same operations, same output format.
 *
 * @module throughput
 *
 * Usage: node bench/throughput.mjs [server-url]
 * Default: http://localhost:3000
 */

import { writeFileSync, mkdirSync } from 'fs';

const BASE_URL = process.argv[2] || 'http://localhost:3000';
const NUM_ACCOUNTS = 100;
const BATCH_SIZES = [1, 10, 20, 50, 100, 200, 500, 1000];

async function post(path, body) {
  const start = Date.now();
  const resp = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await resp.json();
  return { ...data, wallLatencyMs: Date.now() - start, ok: resp.ok };
}

async function get(path) {
  const start = Date.now();
  const resp = await fetch(`${BASE_URL}${path}`);
  const data = await resp.json();
  return { ...data, wallLatencyMs: Date.now() - start, ok: resp.ok };
}

async function setup() {
  // Reset database
  await post('/setup/reset', {});

  // Fund accounts
  for (let i = 0; i < NUM_ACCOUNTS; i++) {
    await post('/setup/balance', { userId: `user_${i}`, amount: 10000000 });
  }
}

function processResults(results, tStart, tEnd, batchSize) {
  const succeeded = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  const latencies = succeeded.map(r => r.wallLatencyMs).sort((a, b) => a - b);
  const serverLatencies = succeeded.map(r => r.latencyMs || 0).sort((a, b) => a - b);
  const wallClockMs = tEnd - tStart;

  return {
    batchSize,
    succeeded: succeeded.length,
    failed: failed.length,
    wallClockMs,
    tps: succeeded.length > 0 ? succeeded.length / (wallClockMs / 1000) : 0,
    meanLatencyMs: latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length * 100) / 100 : 0,
    p95LatencyMs: latencies.length > 0 ? latencies[Math.floor(latencies.length * 0.95)] : 0,
    meanServerLatencyMs: serverLatencies.length > 0 ? Math.round(serverLatencies.reduce((a, b) => a + b, 0) / serverLatencies.length * 1000) / 1000 : 0,
  };
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log(' Centralized DRM Benchmark: Throughput & Latency');
  console.log('═══════════════════════════════════════════════════════════');

  await setup();
  console.log(`  ${NUM_ACCOUNTS} accounts funded.`);

  const allResults = {};

  // ── register_content ───────────────────────────────────────────────────
  console.log('\n── register_content ──');
  allResults.register_content = {};
  for (const batchSize of BATCH_SIZES) {
    const tStart = Date.now();
    const promises = Array.from({ length: batchSize }, (_, i) =>
      post('/content', { creatorId: `user_${i % NUM_ACCOUNTS}`, metadataHash: `0x${i}`, title: `Content ${i}`, subscriptionPrice: 100, ppvPrice: 10, ownershipPrice: 500, periodLength: 600 })
    );
    const results = await Promise.all(promises);
    const tEnd = Date.now();
    const r = processResults(results, tStart, tEnd, batchSize);
    allResults.register_content[batchSize] = r;
    console.log(`  B=${batchSize}: ${r.succeeded}/${batchSize} | TPS: ${r.tps.toFixed(0)} | Wall: ${r.wallClockMs}ms | Mean: ${r.meanLatencyMs}ms | Server: ${r.meanServerLatencyMs}ms`);
  }

  // ── subscribe (fresh content per batch) ────────────────────────────────
  console.log('\n── subscribe ──');
  allResults.subscribe = {};
  for (const batchSize of BATCH_SIZES) {
    // Register fresh content
    const reg = await post('/content', { creatorId: 'user_0', metadataHash: `0xsub${batchSize}`, title: `Sub ${batchSize}`, subscriptionPrice: 100, ppvPrice: 10, ownershipPrice: 500, periodLength: 600 });
    const contentId = reg.contentId;

    const tStart = Date.now();
    const promises = Array.from({ length: batchSize }, (_, i) =>
      post(`/content/${contentId}/subscribe`, { userId: `user_${i % NUM_ACCOUNTS}_sub_${batchSize}_${i}` })
    );
    // Need unique users — use extended IDs and pre-fund them
    for (let i = 0; i < batchSize; i++) {
      await post('/setup/balance', { userId: `user_${i % NUM_ACCOUNTS}_sub_${batchSize}_${i}`, amount: 10000000 });
    }
    const results = await Promise.all(promises);
    const tEnd = Date.now();
    const r = processResults(results, tStart, tEnd, batchSize);
    allResults.subscribe[batchSize] = r;
    console.log(`  B=${batchSize}: ${r.succeeded}/${batchSize} | TPS: ${r.tps.toFixed(0)} | Wall: ${r.wallClockMs}ms | Mean: ${r.meanLatencyMs}ms | Server: ${r.meanServerLatencyMs}ms`);
  }

  // ── check_access ───────────────────────────────────────────────────────
  console.log('\n── check_access ──');
  allResults.check_access = {};
  for (const batchSize of BATCH_SIZES) {
    const tStart = Date.now();
    const promises = Array.from({ length: batchSize }, (_, i) =>
      get(`/content/1/access/user_${i % NUM_ACCOUNTS}`)
    );
    const results = await Promise.all(promises);
    const tEnd = Date.now();
    const r = processResults(results, tStart, tEnd, batchSize);
    allResults.check_access[batchSize] = r;
    console.log(`  B=${batchSize}: ${r.succeeded}/${batchSize} | TPS: ${r.tps.toFixed(0)} | Wall: ${r.wallClockMs}ms | Mean: ${r.meanLatencyMs}ms | Server: ${r.meanServerLatencyMs}ms`);
  }

  // ── Summary ────────────────────────────────────────────────────────────
  console.log('\n── Summary (batch=100) ──');
  console.log('Operation          | TPS      | Mean Latency | Server Latency');
  console.log('───────────────────|──────────|──────────────|──────────────');
  for (const [name, batches] of Object.entries(allResults)) {
    const r = batches[100] || batches[50];
    if (r) {
      console.log(`${name.padEnd(19)}| ${String(Math.round(r.tps)).padStart(8)} | ${(r.meanLatencyMs + 'ms').padStart(12)} | ${(r.meanServerLatencyMs + 'ms').padStart(12)}`);
    }
  }

  // ── Save ───────────────────────────────────────────────────────────────
  mkdirSync('bench/results', { recursive: true });
  writeFileSync('bench/results/throughput-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    server: BASE_URL,
    numAccounts: NUM_ACCOUNTS,
    batchSizes: BATCH_SIZES,
    results: allResults,
  }, null, 2));

  console.log('\n  Results saved to bench/results/throughput-results.json');
}

main().catch((e) => { console.error('Failed:', e.message); process.exit(1); });
