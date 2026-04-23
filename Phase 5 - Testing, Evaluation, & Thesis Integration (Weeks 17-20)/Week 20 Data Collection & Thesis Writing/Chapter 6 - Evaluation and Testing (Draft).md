# Chapter 6: Evaluation and Testing

*Draft — ~1,500 words*

---

## 6.1 Evaluation Methodology

The evaluation utilizes a comprehensive multi-tiered testing strategy that incorporates automated unit testing, integration testing across simulated and live networks, performance benchmarking, security evaluations, and a comparative analysis against a centralized baseline. This stratified approach ensures that findings are validated at multiple levels of abstraction, from individual pallet functions and cross-chain XCM flows to the entire Ethereum-to-Polkadot bridge pipeline.

### 6.1.1 Testing Layers

**Layer 1 — Unit Tests (56 tests):** Performed within an isolated mock runtime (`pallets/content-rights/src/tests.rs`), these tests assess both the successful execution and error scenarios of each extrinsic without requiring an active blockchain. The mock runtime simulates `pallet-nfts`, balances, and the content rights pallet within a controlled environment. The test suite comprises 23 functional tests, 10 security tests, 11 XCM tests, 5 royalty tests, 5 auto-renewal tests, and 2 metadata tests.

**Layer 2 — XCM Simulator Tests:** Utilizing the `xcm-simulator` framework, cross-chain operations are assessed within a simulated multi-parachain environment. This process verifies the construction of XCM messages, the calculation of fees, and the routing of sovereign accounts without the need to deploy actual systems nodes.

**Layer 3 — Zombienet End-to-End Tests:** Conducting live multi-chain tests on an operational Zombienet network, which includes the Rococo relay and two parachains, assesses the comprehensive transaction lifecycle, encompassing block production, HRMP relay, and on-chain state management verification.

**Layer 4 — Snowbridge E2E:** The comprehensive Ethereum-to-Polkadot bridge pipeline has been validated: `Gateway.sendToken()` on a local Ethereum network (Geth + Lodestar), relayed through Snowbridge's beacon and execution relays, verified on Bridge Hub, and delivered to the designated recipient AssetHub.

### 6.1.2 Performance Testing Framework

Seven automated benchmark scripts situated within the `scripts/perf/` directory evaluate throughput (including 11 extrinsic types), latency, block weight utilization, storage growth, XCM cross-chain latency, resource utilization, stress tolerance, and system reliability. Each script utilizes the `@polkadot/api` library to submit transactions and record wall-clock durations. The outcomes are documented in JSON format for further analysis reproducibility.

The centralized comparison benchmark (`centralized-drm-benchmark/`) executes the same six operations utilizing Express.js and SQLite, with benchmarking conducted using an identical methodology (including consistent batch sizes, concurrency levels, and measurement techniques).

## 6.2 Test Scenarios

### 6.2.1 Throughput and Latency (Week 17)

**Scenario:** Submit concurrent batches of each extrinsic type (batch sizes: 1, 10, 20, 50, 100) from distinct funded accounts. Measure the time from submission to block inclusion.

**Purpose:** Determine practical TPS limits and identify the throughput bottleneck (block weight versus configuration) parameters).

**Key variables:** Batch size, extrinsic type, number of unique accounts.

### 6.2.2 Block Weight Saturation (Week 17)

**Scenario:** Submit increasingly large batches (50 to 300) of `register_content` transactions and query `system.blockWeight` at the inclusion block to measure actual weight consumption.

**Purpose:** Determine how many transactions fit per block and what percentage of block weight budget is consumed.

### 6.2.3 Storage Growth (Week 17)

**Scenario:** Register content items incrementally (1, 5, 10, 25, 50), add subscribers (1, 5, 10, 20, 40), and add view packs (1, 5, 10, 20). At each step, query all storage maps via `.entries()` and measure SCALE-encoded sizes.

**Purpose:** Determine per-item storage costs and verify linear growth characteristics.

### 6.2.4 XCM Latency (Week 17)

**Scenario:** Send cross-chain operations (subscribe, purchase views, purchase ownership) from ParaB to ParaA via XCM `Transact` and measure the block delta between send and event arrival.

**Purpose:** Quantify cross-chain operation latency and validate the paid execution XCM model.

### 6.2.5 Stress Test (Week 17)

**Scenario:** 200 concurrent accounts continuously submitting `register_content` for 3 minutes.

**Purpose:** Find the system's breaking point under sustained maximum load.

### 6.2.6 Security Audit (Week 18)

**Scenario:** Static analysis (`cargo clippy`, `cargo audit`), manual access control review of all 17 extrinsics, and targeted unit tests for authorization gaps, boundary conditions, and edge cases.

**Purpose:** Identify security vulnerabilities and verify error handling.

### 6.2.7 Reliability (Week 18)

**Scenario:** Monitor block production for 2 minutes (baseline), kill the collator process, restart, verify state integrity, and monitor recovery for 2 minutes.

**Purpose:** Measure MTTR and validate crash consistency.

### 6.2.8 Comparative Analysis (Week 19)

**Scenario:** Implement the same six operations in a centralized Express.js + SQLite server. Run identical throughput and stress benchmarks.

**Purpose:** Quantify the performance cost of decentralization and identify the qualitative trade-offs.

## 6.3 Metrics and KPIs

The evaluation framework uses eleven key performance indicators:

### Table 6.1: KPI Definitions

| # | KPI | Definition | Target | Source |
|---|-----|-----------|--------|--------|
| 1 | **Throughput (TPS)** | Successful transactions per second under sustained load | >10 TPS | Stress test |
| 2 | **Inclusion latency** | Time from submission to block inclusion | <12 seconds (2 blocks) | Throughput test |
| 3 | **XCM latency** | Block delta for cross-chain operations | <10 blocks | XCM latency test |
| 4 | **Block utilisation** | Percentage of block weight consumed at capacity | <75% | Block saturation test |
| 5 | **Storage efficiency** | Bytes per content item and per subscriber | <500 bytes | Storage growth test |
| 6 | **Uptime** | Percentage of expected blocks actually produced | >85% | Reliability test |
| 7 | **MTTR** | Time from crash to resumed block production | <60 seconds | Reliability test |
| 8 | **State persistence** | Data integrity after crash restart | 100% | Reliability test |
| 9 | **Security findings** | Critical/High vulnerabilities in thesis code | 0 Critical, 0 High | Security audit |
| 10 | **Test coverage** | Error variants exercised by unit tests | >80% | Test suite |
| 11 | **Decentralisation ratio** | Performance cost vs centralized baseline | Documented | Comparative analysis |

### Table 6.2: KPI Results Summary

| # | KPI | Target | Measured | Status |
|---|-----|--------|----------|--------|
| 1 | Throughput | >10 TPS | **26.2 TPS** sustained | **Pass** |
| 2 | Inclusion latency | <12 s | **~6 s** (1 block) | **Pass** |
| 3 | XCM latency | <10 blocks | **3–5 blocks** | **Pass** |
| 4 | Block utilisation | <75% | **12.9%** at 300 txs | **Pass** |
| 5 | Storage efficiency | <500 bytes | **191 bytes**/content, **112 bytes**/subscriber | **Pass** |
| 6 | Uptime | >85% | **90%** | **Pass** |
| 7 | MTTR | <60 s | **~15–20 s** | **Pass** |
| 8 | State persistence | 100% | **100%** | **Pass** |
| 9 | Security findings | 0 Critical/High | **0 Critical, 0 High, 0 unresolved Medium** | **Pass** |
| 10 | Test coverage | >80% | **82%** (14/17 error variants) | **Pass** |
| 11 | Decentralisation ratio | Documented | **270× slower, qualitatively superior** | **Documented** |

All eleven KPIs achieved their respective targets. The security audit revealed five findings: one Medium (authorization gap in `xcm_transfer_ownership`) and four Low; the Medium finding and one Low finding (view pack overwrite) were addressed during the testing phase. The remaining three Low findings are documented design decisions deemed appropriate for a research prototype. All 56 unit tests pass.

## 6.4 Testing Infrastructure

### Table 6.3: Test Environment

| Component | Specification |
|-----------|--------------|
| Machine | macOS Darwin 25.3.0, Apple Silicon |
| Relay chain | Rococo-local, 2 validators (alice, bob) |
| Parachain A | Content Rights (para 100), 1 collator |
| Parachain B | Consumer chain (para 200), 1 collator |
| Bridge Hub | Para 1013 (Snowbridge tests only) |
| AssetHub | Para 1000 (Snowbridge tests only) |
| Ethereum | Geth v1.17.1 + Lodestar v1.35.0 (Snowbridge tests only) |
| Zombienet | Native provider |
| Block time | ~6 seconds (parachain) |
| Node binary | `parachain-template-node` (release build) |

### Reproducibility

All assessments are executed through automated scripts located in `scripts/perf/` and `bench/`. The outcomes are preserved as JSON files to facilitate independent verification. The configuration of Zombienet, the HRMP channel setup, and the Snowbridge deployment are thoroughly documented in `docs/SNOWBRIDGE_SETUP.md` and `docs/SNOWBRIDGE_SESSION_LOG.md`.
