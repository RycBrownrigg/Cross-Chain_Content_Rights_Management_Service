# Week 19: Comparative Analysis Plan

## Objective

Compare the cross-chain content rights management system (blockchain) against a functionally equivalent centralized implementation, measuring the same operations under the same conditions to produce a defensible side-by-side evaluation for the thesis.

## Approach

### Centralized Benchmark System

A minimal Express.js + SQLite server implementing the same 6 content rights operations as the blockchain pallet. This represents the **best-case centralized performance** — no cloud overhead, no network latency — providing a generous baseline for comparison.

**Rationale for local over AWS:**
- Measures the *architectural pattern* (centralized vs decentralized), not a specific cloud provider
- Zero cost, fully reproducible (`npm start && npm test`)
- Avoids AWS Lambda cold starts and network latency distorting measurements
- A reviewer cannot argue the comparison is unfair — we gave centralized every advantage

For the thesis: "A production centralized system would typically deploy on AWS/GCP with managed databases. Our local benchmark represents the best-case centralized performance (no network latency to cloud services), providing a generous baseline for comparison."

### Operation Mapping

| Blockchain Extrinsic | REST Endpoint | Method |
|---------------------|---------------|--------|
| `register_content` | `POST /content` | Create content |
| `subscribe` | `POST /content/:id/subscribe` | Create subscription |
| `purchase_views` | `POST /content/:id/views` | Buy view pack |
| `consume_view` | `POST /content/:id/consume` | Use one view |
| `purchase_ownership` | `POST /content/:id/own` | Buy ownership |
| `check_access` | `GET /content/:id/access/:userId` | Check access |

### Benchmark Scripts (3, mirroring Week 17)

| Script | Mirrors | What It Measures |
|--------|---------|------------------|
| `bench/throughput.mjs` | `scripts/perf/local-throughput.mjs` | TPS + latency per operation at batch sizes 1-1000 |
| `bench/storage.mjs` | `scripts/perf/storage-growth.mjs` | Bytes per content item and per subscription |
| `bench/stress.mjs` | `scripts/perf/stress-test.mjs` | 200 concurrent clients, 3 min sustained load |

### Metrics to Compare

| Metric | Blockchain Source | Centralized Source |
|--------|------------------|-------------------|
| TPS (sustained) | stress-test.mjs: 27 TPS | stress.mjs |
| Latency (mean) | local-throughput.mjs: ~6,000ms | throughput.mjs |
| Storage per content | storage-growth.mjs: 192 bytes | storage.mjs |
| Storage per subscription | storage-growth.mjs: 112 bytes | storage.mjs |
| Cost per operation | Weight fees | CPU time × compute cost |
| MTTR | reliability-test.mjs: ~15-20s | Server restart time |
| Cross-chain equivalent | xcm-latency.mjs: 18-32s | Inter-service HTTP call |

### Qualitative Comparison

| Property | Blockchain | Centralized |
|----------|-----------|-------------|
| Trust model | Trustless (relay chain consensus) | Trusted third party |
| Censorship resistance | High (decentralised validators) | None (operator controlled) |
| Single point of failure | None (relay + collators) | Yes (single server/DB) |
| Auditability | Full (public chain state) | Operator-controlled |
| Data sovereignty | User owns keys | Platform owns data |
| Interoperability | XCM + Snowbridge (cross-chain native) | API integration required |
| Finality | Deterministic (~12-18s) | Immediate (DB commit) |

## Technology Stack

```
centralized-drm-benchmark/
├── package.json           # express, better-sqlite3, typescript, tsx
├── tsconfig.json
├── src/
│   ├── server.ts          # Express app setup
│   ├── database.ts        # SQLite schema (6 tables mirroring pallet storage)
│   ├── routes.ts          # 6 REST endpoints with transaction semantics
│   └── types.ts           # TypeScript interfaces matching pallet types
├── bench/
│   ├── throughput.mjs     # TPS + latency benchmark
│   ├── storage.mjs        # Storage growth measurement
│   ├── stress.mjs         # Sustained load test
│   └── results/           # JSON output (same format as blockchain results)
└── README.md
```

**Dependencies:** 6 packages total — `express`, `better-sqlite3`, `typescript`, `tsx`, `@types/express`, `@types/better-sqlite3`

## Deliverables

1. **Centralized benchmark system** — Working Express + SQLite server with 6 endpoints
2. **Benchmark results** — JSON files matching blockchain result format
3. **Comparison tables** — Side-by-side quantitative comparison
4. **Comparative Analysis Report** — Thesis-ready document with findings and discussion

## Expected Results

| Metric | Blockchain (Measured) | Centralized (Expected) | Ratio |
|--------|----------------------|----------------------|-------|
| TPS | 27 | 5,000-15,000 | 200-500× |
| Latency (p50) | 6,000ms | 1-3ms | 2,000-6,000× |
| Storage/content | 192 bytes | ~100-150 bytes | ~1.3× |
| MTTR | 15-20s | ~2-3s | ~7× |
| Cross-chain equivalent | 18-32s | 5-50ms | 400-6,000× |

**Thesis argument:** The centralized system is 200-6,000× faster for raw operations, but sacrifices trustlessness, censorship resistance, auditability, and fault tolerance. The blockchain system's 27 TPS (1.4M ops/day) is sufficient for content rights management, making the performance cost acceptable for the trust guarantees gained.

## Estimated Effort

| Step | Time |
|------|------|
| Build server + database | 3 hours |
| Build 3 benchmark scripts | 3 hours |
| Run benchmarks | 30 minutes |
| Write comparison report | 1.5 hours |
| **Total** | **~8 hours** |
