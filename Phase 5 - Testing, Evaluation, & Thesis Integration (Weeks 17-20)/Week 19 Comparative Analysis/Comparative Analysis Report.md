# Week 19: Comparative Analysis Report

## 1. Overview

This report presents a side-by-side comparison of the blockchain-based cross-chain content rights management system against a functionally equivalent centralized implementation. Both systems implement the same 6 operations (register content, subscribe, purchase views, consume view, purchase ownership, check access) and were benchmarked using identical methodology.

**Test date:** 2026-03-25

**Blockchain system:** Polkadot parachain with `pallet-content-rights`, measured in Weeks 17-18
**Centralized system:** Express.js + SQLite (in-memory), measured in Week 19

The centralized benchmark represents the **best-case centralized performance**; local server, in-memory database, no network latency. This provides a generous baseline, ensuring the comparison is fair to the centralized approach.

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

The centralized system supports 7,305 transactions per second (TPS) with zero failures, in comparison to the blockchain's 27 TPS. However, the centralized operator possesses complete authority over all data; they have the capability to modify subscriptions, revoke ownership, or delete content without obtaining user consent. Conversely, the blockchain system renders such actions impossible by design.

### Finding 2: The blockchain's 27 TPS is sufficient for the use case

At 27 TPS, the blockchain executes approximately 2.3 million operations daily. For a content rights management platform where the predominant operation is subscription creation (rather than high-frequency trading), this throughput is more than sufficient. Spotify has approximately 250 million subscribers; the system could onboard all of them within approximately 108 days under sustained load, or easily accommodate millions of daily churns.

### Finding 3: Latency is the meaningful cost, not throughput

The real user-facing cost is the **6-second latency** per operation, compared with sub-millisecond centralized latency. For content rights operations (subscribing, purchasing, checking access), this is acceptable:
- **Subscribing** happens once; 6 seconds is negligible
- **Purchasing views** happens infrequently, 6 seconds is acceptable
- **Checking access** at 6 seconds is the weakest point, but can be cached client-side after the first verification

### Finding 4: Storage costs are comparable

Both systems exhibit comparable per-item storage costs, with 192 bytes versus approximately 100-150 bytes per content item. The marginal overhead associated with the blockchain results from SCALE encoding and NFT metadata. When scaled, storage capacity does not constitute a distinguishing factor.

### Finding 5: The blockchain's stress test broke the RPC, not the chain

The blockchain stress test revealed a success rate of 6.6%, primarily due to the RPC WebSocket subscription limit (1024) rather than the chain's capabilities. The blockchain processed 181 transactions per block with only 13% of the weight utilized. With production-grade RPC infrastructure, including load balancing and fire-and-forget submission, the blockchain would be able to sustain significantly higher throughput.

### Finding 6: Cross-chain is the blockchain's unique capability

The centralized system lacks a counterpart for cross-chain operations. Inter-service HTTP calls (5-50ms) serve as the nearest analogy; however, they necessitate mutual trust between services. In contrast, the blockchain's XCM (18-32 seconds) offers **trustless inter-chain operations**, a capability that is absent in centralized systems architectures.

---

## 5. Thesis Argument

The comparative analysis demonstrates that the blockchain-based content rights management system trades raw performance (270× slower) for fundamental architectural properties that centralized systems cannot provide:

1. **Trustlessness:** No single entity can manipulate rights records
2. **Censorship resistance:** Content creators retain control without platform approval
3. **Cross-chain interoperability:** Rights are portable across heterogeneous blockchains via XCM and Snowbridge
4. **Auditability:** Every state transition is publicly verifiable

In the domain of content rights management, where operations such as subscriptions and purchases are infrequent, and trust is of utmost importance, given that creators must entrust the platform with their revenue, the performance cost at 270× is considered an acceptable compromise to eliminate the need for a trust intermediary.

This aligns with the self-publishing model: creators register content, set prices, and receive payments directly, without publishers, PROs, or platform operators taking commissions or controlling access. The blockchain replaces the intermediary with a trustless protocol.

---

## 6. Methodology Notes

### Fairness of Comparison

The centralized benchmark utilizes an **in-memory SQLite database** hosted on a **local Express server**, representing the optimal scenario for centralized performance. Deployment in a production environment on AWS would likely result in increased latency (due to network hops and cold starts) and reduced throughput (due to shared infrastructure). By benchmarking against this best-case scenario, any advantages associated with blockchain technology are shown to be resilient rather than merely artifacts of a slow centralized system implementation.

### What's Not Compared

- **Economic cost:** Parachain slot costs (~$1000/month on Kusama) vs AWS hosting (~$10-50/month). The blockchain is more expensive to operate, but it eliminates the intermediary's commission (typically 15-30% of revenue).
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
