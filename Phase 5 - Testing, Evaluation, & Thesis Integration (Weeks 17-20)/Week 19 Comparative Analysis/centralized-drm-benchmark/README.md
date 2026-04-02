# Centralized DRM Benchmark

A centralized content rights management server built for direct performance comparison against the blockchain-based `pallet-content-rights` system. This benchmark provides the "centralized baseline" referenced throughout the thesis evaluation.

## Purpose

The thesis assesses a decentralized, cross-chain content rights management system. To contextualize the performance metrics of the blockchain, this benchmark employs the **same six core operations** as a traditional Express.js and SQLite application, facilitating a comparative analysis of throughput, latency, and cost.

## Architecture

- **Server:** Express.js (Node.js)
- **Database:** sql.js (in-memory SQLite, pure JavaScript; no native compilation required)
- **Schema:** Mirrors the blockchain pallet's storage maps (content, subscriptions, view packs, ownership, balances)
- **Transactions:** Each route wraps its logic in a SQLite transaction to match the atomic extrinsic semantics of the blockchain

## API Routes

| Route | Method | Blockchain Equivalent | Description |
|-------|--------|----------------------|-------------|
| `/content` | POST | `register_content` | Register new content with metadata and pricing |
| `/content/:id/subscribe` | POST | `subscribe` | Subscribe to content (payment deducted) |
| `/content/:id/views` | POST | `purchase_views` | Purchase a PPV view pack |
| `/content/:id/consume` | POST | `consume_view` | Consume one prepaid view |
| `/content/:id/own` | POST | `purchase_ownership` | Purchase permanent ownership |
| `/content/:id/access/:userId` | GET | `check_access` | Check access rights for a user |
| `/setup/balance` | POST | (sudo funding) | Set user balance for testing |
| `/setup/reset` | POST | — | Reset all data |
| `/health` | GET | — | Health check |

## Project Structure

```
centralized-drm-benchmark/
├── src/
│   ├── server.ts      — Express server entry point
│   ├── database.ts    — sql.js in-memory database setup and schema
│   ├── routes.ts      — REST API routes (6 content rights operations)
│   └── types.ts       — TypeScript type definitions
├── bench/
│   ├── throughput.mjs — Per-operation TPS and latency benchmark
│   ├── stress.mjs     — Sustained high-concurrency load test
│   └── results/       — JSON output from benchmark runs
│       ├── throughput-results.json
│       └── stress-results.json
├── package.json
└── tsconfig.json
```

## Usage

### Start the server

```bash
npm install
npm start
# Server running on http://localhost:3000
```

### Run benchmarks

```bash
# Per-operation throughput and latency
npm run bench:throughput

# Sustained stress test
npm run bench:stress

# Run all benchmarks
npm run bench:all
```

### Results

Benchmark results are written to `bench/results/` as JSON files. Key findings from the thesis evaluation:

| Metric | Centralized (this) | Blockchain (pallet) | Ratio |
|--------|-------------------|--------------------| ------|
| Sustained TPS | ~7,305 | ~26 | 270× |
| Mean latency | 0.089ms | ~6,000ms | 67,000× |
| Trust model | Trusted third party | Trustless (relay chain) | — |
| Creator revenue retention | Platform-dependent (55–70%) | 100% (self-publishing) | — |

## Design Decisions

- **sql.js** was chosen over `better-sqlite3` because the latter requires native compilation (which fails on some Node.js versions). sql.js is a pure JavaScript SQLite implementation compiled from C via Emscripten.
- **In-memory database** provides the best-case centralized performance (no disk I/O). This is intentional; the benchmark measures the ceiling of centralized performance to give the blockchain the hardest possible comparison.
- **No authentication or rate limiting** — the server has no middleware overhead, again providing a best-case baseline.

## Thesis Context

This benchmark supports the comparative analysis in the thesis evaluation (Week 19). The key finding is that the blockchain system is ~270× slower in raw throughput but offers trustlessness, censorship resistance, cross-chain portability, and 100% creator revenue retention; properties that centralized systems cannot replicate, regardless of their performance advantages.
