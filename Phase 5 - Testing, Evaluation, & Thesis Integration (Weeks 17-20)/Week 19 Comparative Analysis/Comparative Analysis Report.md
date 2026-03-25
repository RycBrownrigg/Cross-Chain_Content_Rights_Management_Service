# Week 19: Comparative Analysis Report

## 1. Overview

This report presents a side-by-side comparison of the blockchain-based cross-chain content rights management system against a functionally equivalent centralized implementation. Both systems implement the same 6 operations (register content, subscribe, purchase views, consume view, purchase ownership, check access) and were benchmarked using identical methodology.

**Test date:** 2026-03-25

**Blockchain system:** Polkadot parachain with `pallet-content-rights`, measured in Weeks 17-18
**Centralized system:** Express.js + SQLite (in-memory), measured in Week 19

The centralized benchmark represents the **best-case centralized performance** — local server, in-memory database, no network latency. This provides a generous baseline, ensuring the comparison is fair to the centralized approach.

---

## 2. Quantitative Comparison

### Table 1: Throughput Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| **Sustained TPS (stress, 3 min)** | 27 | **7,305** | 270× |
| Total operations (3 min) | 4,895 | 1,315,000 | 269× |
| Stress test success rate | 6.6% | **100%** | — |
| Stress test failure cause | RPC subscription limit | None | — |
| Peak TPS (burst) | 16.5 | ~13,000 | 788× |
| Max txs per "block" | 181 | N/A (no blocks) | — |

### Table 2: Latency Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| **register_content** | 6,000 ms | **0.14 ms** (server) | 42,857× |
| **subscribe** | 6,000 ms | **0.50 ms** (server) | 12,000× |
| **check_access** | 6,000 ms | **0.05 ms** (server) | 120,000× |
| Stress p50 | ~6,000 ms | **15 ms** (HTTP round-trip) | 400× |
| Stress p95 | ~6,050 ms | **24 ms** | 252× |
| Stress p99 | ~6,050 ms | **27 ms** | 224× |
| **Finality** | **12-18 seconds** | **Immediate** | — |

### Table 3: Storage Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| Per content item | 192 bytes | ~100-150 bytes | ~1.5× |
| Per subscription | 112 bytes | ~80-100 bytes | ~1.3× |
| Growth pattern | Linear O(n) | Linear O(n) | Same |

### Table 4: Cross-Chain / Inter-Service Comparison

| Metric | Blockchain (XCM) | Centralized (HTTP) | Ratio |
|--------|------------------|-------------------|-------|
| **Cross-chain latency** | **18-32 seconds** | **5-50 ms** (inter-service) | 400-6,000× |
| Protocol | XCM via HRMP relay | HTTP REST | — |
| Trust required | None (relay chain verifies) | Trust both services | — |

### Table 5: Reliability Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| MTTR | ~15-20 seconds | ~2-3 seconds | ~7× |
| State persistence | 100% (on-chain) | Requires backup/replication | — |
| Block production uptime | 90% | N/A (always available) | — |

---

## 3. Qualitative Comparison

### Table 6: Architectural Trade-offs

| Property | Blockchain | Centralized | Advantage |
|----------|-----------|-------------|-----------|
| **Trust model** | Trustless — relay chain consensus validates all state transitions | Trusted third party — operator controls all data | **Blockchain** |
| **Censorship resistance** | High — decentralised validators cannot censor individual transactions | None — operator can block any user or content | **Blockchain** |
| **Single point of failure** | None — relay chain + multiple collators | Yes — single server and database | **Blockchain** |
| **Auditability** | Full — all state transitions are public and verifiable | Operator-controlled — logs can be altered or deleted | **Blockchain** |
| **Data sovereignty** | User holds keys, controls their own access | Platform owns all user data | **Blockchain** |
| **Interoperability** | Native — XCM + Snowbridge enable cross-chain and cross-ecosystem access | Requires custom API integration per partner | **Blockchain** |
| **Performance (TPS)** | 27 TPS sustained | 7,305 TPS sustained | **Centralized (270×)** |
| **Latency** | ~6 seconds (1 block) | <1 ms (server-side) | **Centralized (42,000×)** |
| **Operational complexity** | High — collator, relay chain, XCM config | Low — single server deployment | **Centralized** |
| **Development complexity** | High — Rust, FRAME macros, no_std, XCM | Low — TypeScript, Express, SQL | **Centralized** |

---

## 4. Key Findings

### Finding 1: Centralized is 270× faster but requires full trust

The centralized system sustains 7,305 TPS with zero failures vs the blockchain's 27 TPS. However, the centralized operator has full control over all data — they can modify subscriptions, revoke ownership, or delete content without user consent. The blockchain system makes this impossible by design.

### Finding 2: The blockchain's 27 TPS is sufficient for the use case

At 27 TPS, the blockchain processes **~2.3 million operations per day**. For a content rights management platform where the most frequent operation is subscription creation (not high-frequency trading), this throughput is more than adequate. Spotify has ~250 million subscribers total — the system could onboard all of them in ~108 days at sustained load, or handle daily churn of millions easily.

### Finding 3: Latency is the meaningful cost, not throughput

The real user-facing cost is the **6-second latency** per operation vs sub-millisecond centralized latency. For content rights operations (subscribing, purchasing, checking access), this is acceptable:
- **Subscribing** happens once, 6 seconds is negligible
- **Purchasing views** happens infrequently, 6 seconds is acceptable
- **Checking access** at 6 seconds is the weakest point — but can be cached client-side after first verification

### Finding 4: Storage costs are comparable

Both systems show similar per-item storage costs (192 vs ~100-150 bytes per content item). The blockchain's slight overhead comes from SCALE encoding and NFT metadata. At scale, storage is not a differentiating factor.

### Finding 5: The blockchain's stress test broke the RPC, not the chain

The blockchain stress test showed 6.6% success rate — but this was due to the RPC WebSocket subscription limit (1024), not the chain itself. The chain processed 181 transactions per block at only 13% weight utilisation. With production RPC infrastructure (load balancing, fire-and-forget submission), the blockchain would sustain much higher throughput.

### Finding 6: Cross-chain is the blockchain's unique capability

The centralized system has no equivalent to cross-chain operations. Inter-service HTTP calls (5-50ms) are the closest analogy, but they require trust between services. The blockchain's XCM (18-32 seconds) provides **trustless inter-chain operations** — a capability that simply does not exist in centralized architectures.

---

## 5. Thesis Argument

The comparative analysis demonstrates that the blockchain-based content rights management system trades raw performance (270× slower) for fundamental architectural properties that centralized systems cannot provide:

1. **Trustlessness:** No single entity can manipulate rights records
2. **Censorship resistance:** Content creators retain control without platform approval
3. **Cross-chain interoperability:** Rights are portable across heterogeneous blockchains via XCM and Snowbridge
4. **Auditability:** Every state transition is publicly verifiable

For the content rights management domain — where operations are infrequent (subscriptions, purchases) and trust is paramount (creators must trust the platform with their revenue) — the 270× performance cost is an acceptable trade-off for eliminating the trusted intermediary.

This aligns with the self-publishing model: creators register content, set prices, and receive payments directly, without publishers, PROs, or platform operators taking commissions or controlling access. The blockchain replaces the intermediary with a trustless protocol.

---

## 6. Methodology Notes

### Fairness of Comparison

The centralized benchmark uses an **in-memory SQLite database** on a **local Express server** — the absolute best case for centralized performance. A production deployment on AWS would show higher latency (network hops, cold starts) and lower throughput (shared infrastructure). By benchmarking against the best case, any blockchain advantages identified are robust and not artifacts of a slow centralized implementation.

### What's Not Compared

- **Economic cost:** Parachain slot costs (~$1000/month on Kusama) vs AWS hosting (~$10-50/month). The blockchain is more expensive to operate, but eliminates the intermediary's commission (typically 15-30% of revenue).
- **Scalability beyond single-chain:** Polkadot's horizontal scaling (100+ parachains) means aggregate network throughput scales linearly. A centralized system requires manual sharding and load balancing.
- **Regulatory compliance:** Blockchain provides inherent compliance for audit trails. Centralized systems require additional compliance infrastructure.

---

## Appendix A: Reproduction

```bash
# Start centralized server
cd "Phase 5/Week 19 Comparative Analysis/centralized-drm-benchmark"
npm install
npx tsx src/server.ts

# Run benchmarks (in separate terminal)
node bench/throughput.mjs
node bench/stress.mjs
```

## Appendix B: Raw Data

- `bench/results/throughput-results.json` — per-operation TPS and latency
- `bench/results/stress-results.json` — 3-minute sustained load results
- Blockchain results: `content-rights-parachain/scripts/perf/results/`
