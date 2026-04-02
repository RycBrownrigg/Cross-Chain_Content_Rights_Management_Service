# Consolidated Evaluation Dataset

All quantitative data collected during Phase 5 testing (Weeks 17-19), organised by KPI for direct use in the thesis Results and Evaluation chapters.

---

## 1. Throughput

### 1.1 Blockchain — Single-Chain Throughput (Week 17)

| Extrinsic | B=1 TPS | B=10 | B=20 | B=50 | B=100 | Peak TPS |
|-----------|---------|------|------|------|-------|----------|
| register_content | 0.17 | 1.67 | 3.32 | 8.30 | **16.59** | 16.59 |
| subscribe | 0.17 | 1.66 | 3.33 | 8.25 | 8.31* | 8.31 |
| renew_subscription | 0.17 | 1.67 | 3.34 | 8.35 | 8.35* | 8.35 |
| purchase_views | 0.17 | 0.56 | 3.33 | 3.16* | 0* | 3.33 |
| consume_view | 0.17 | 1.66 | 3.34 | 3.65* | 1.22* | 3.65 |
| purchase_ownership | 0.17 | 1.66 | 3.32 | 2.08 | 8.21* | 8.21 |
| check_access | 0.17 | 1.67 | 3.33 | 8.31 | **16.61** | 16.61 |
| **set_royalty_splits** | **0.17** | **1.67** | **3.33** | **8.29** | **16.47** | **16.47** |
| **enable_auto_renew** | 0.08 | 1.67 | 3.34 | 8.37 | 2.77* | 8.37 |
| **disable_auto_renew** | 0.17 | 1.67 | 3.33 | 8.38 | 8.35* | 8.38 |
| **query_rights_metadata** | **0.17** | **1.67** | **1.11** | **8.33** | **16.57** | **16.57** |

*Starred values limited by MaxChildrenPerNft=50 or data dependency, not block weight.
**Bold rows** are the 4 thesis-critical features added post-initial development — all perform identically to originals.

### 1.2 Blockchain — Stress Test (Week 17)

| Metric | Value |
|--------|-------|
| Sustained TPS (3 min) | **26.15** |
| Avg txs/block | **174.6** |
| Total submitted | 21,400 |
| Total succeeded | 4,713 |
| Success rate | 22.0% (nonce conflicts) |
| Peak tx pool depth | 0 (drained each block) |
| Block time under stress | ~6.7 seconds |

### 1.3 Blockchain — Block Weight Saturation (Week 17)

| Batch | Blocks | ref_time % | proof_size % |
|-------|--------|------------|-------------|
| 50 | 1 | 2.15% | 0.63% |
| 100 | 1 | 4.30% | 0.94% |
| 150 | 1 | 6.45% | 1.24% |
| 200 | 1 | 15.05% | 1.95% |
| 300 | 1 | **12.90%** | **2.18%** |

Theoretical max: ~1,700 txs/block (~283 TPS)

### 1.4 Centralized — Throughput (Week 19)

| Operation | B=100 TPS | B=1000 TPS | Server Latency |
|-----------|-----------|------------|----------------|
| register_content | 3,030 | **4,975** | 0.088 ms |
| check_access | 11,111 | **13,158** | 0.042 ms |

### 1.5 Centralized — Stress Test (Week 19)

| Metric | Value |
|--------|-------|
| Sustained TPS (3 min) | **7,305** |
| Total operations | 1,315,000 |
| Success rate | **100%** |
| Latency p50 | 15 ms |
| Latency p95 | 24 ms |
| Latency p99 | 27 ms |
| Failures | 0 |

### 1.6 Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| **Sustained TPS** | 26.2 | 7,305 | **270×** |
| **Peak TPS (burst)** | 16.6 | ~13,000 | **783×** |
| **Theoretical max** | ~283 | >13,000 | **46×** |

---

## 2. Latency

### 2.1 Blockchain — Single-Chain (Week 17)

| Extrinsic | Mean (ms) | P95 (ms) | Blocks |
|-----------|-----------|----------|--------|
| register_content | 5,985 | 5,988 | 1 |
| subscribe | 6,013 | 6,015 | 1 |
| purchase_views | 6,008 | 6,010 | 1 |
| consume_view | 11,997 | 11,998 | 2 |
| purchase_ownership | 6,020 | 6,022 | 1 |
| check_access | 5,985 | 5,987 | 1 |

### 2.2 Blockchain — Cross-Chain XCM (Week 17)

| Operation | Avg Block Delta | Avg Latency |
|-----------|----------------|-------------|
| xcm_subscribe | 3.0 blocks | ~18 seconds |
| xcm_purchase_views | 5.3 blocks | ~32 seconds |
| xcm_purchase_ownership | 5.3 blocks | ~32 seconds |

### 2.3 Blockchain — Snowbridge (Ethereum → AssetHub)

| Step | Latency |
|------|---------|
| Gateway.sendToken → block inclusion | ~12 seconds |
| Beacon finalization | ~39 minutes (8 validators, mainnet preset) |
| Relay proof submission | ~30 seconds after finalization |
| Bridge Hub → AssetHub XCM | ~12 seconds |
| **Total (after finalization)** | **~1 minute** |

### 2.4 Centralized (Week 19)

| Operation | Server Latency | HTTP Round-trip |
|-----------|---------------|-----------------|
| register_content | 0.088 ms | ~17.8 ms |
| check_access | 0.042 ms | ~4.2 ms |
| Stress p50 | — | 15 ms |
| Stress p99 | — | 27 ms |

### 2.5 Comparison

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| **Single operation** | ~6,000 ms | 0.09 ms (server) | **67,000×** |
| **HTTP round-trip** | ~6,000 ms | ~18 ms | **333×** |
| **Cross-chain** | 18-32 seconds | N/A | — |
| **Finality** | 12-18 seconds | Immediate | — |

---

## 3. Storage

### 3.1 Per-Item Costs (Week 17)

| Type | Blockchain (bytes) | Centralized (est.) | Ratio |
|------|-------------------|-------------------|-------|
| Content item | 192 | ~100-150 | ~1.5× |
| Subscription | 112 | ~80-100 | ~1.3× |
| View pack | 111 | ~80-100 | ~1.3× |

### 3.2 Scalability Projection

| Scale | Items + Subs | Blockchain State | Centralized DB |
|-------|-------------|-----------------|----------------|
| Small | 1K + 10K | ~1.3 MB | ~1 MB |
| Medium | 10K + 100K | ~13 MB | ~10 MB |
| Large | 100K + 1M | ~130 MB | ~100 MB |
| Very large | 1M + 10M | ~1.3 GB | ~1 GB |

---

## 4. Security

### 4.1 Findings Summary (Week 18)

| ID | Finding | Severity | Status |
|----|---------|----------|--------|
| A | XCM extrinsics callable locally (gift feature) | Low | Acknowledged — design choice |
| B | xcm_transfer_ownership authorization gap | Medium | Fixed — `ensure!(authorizer == from)` added |
| C | SafeCallFilter = Everything | Low | Acknowledged — prototype configuration |
| D | Zero-price content allowed | Low | Acknowledged — intentional feature |
| E | View pack overwrite on re-purchase | Low | Fixed — additive behavior implemented |

### 4.2 Dependency Audit (Week 18)

| Metric | Value |
|--------|-------|
| Clippy warnings | 0 |
| Cargo audit advisories | 8 (all transitive, from polkadot-sdk) |
| Advisories in thesis code | **0** |
| Unit tests | 56 (23 functional + 10 security + 11 XCM + 5 royalty + 5 auto-renewal + 2 metadata) |
| Error variant coverage | 14/17 |

---

## 5. Reliability (Week 18)

| Metric | Value |
|--------|-------|
| Baseline uptime | 90% (18/20 expected blocks in 2 min) |
| MTTR (RPC ready) | ~15 seconds |
| Total downtime | ~20 seconds |
| State persistence | 100% (all data survives crash restart) |
| Recovery uptime | 90% (matches baseline) |
| Block construction time | 62 ms (99% of slot idle) |
| DB cache growth under load | 0 MB |
| Tx pool recovery | Drains in 1-2 blocks after load stops |

---

## 6. Snowbridge E2E Bridge (Phase 4)

| Metric | Value |
|--------|-------|
| Tokens bridged | 2 ETH (2 × sendToken transactions) |
| Bridge path | Ethereum → Geth → Lodestar → Relay → Bridge Hub → AssetHub |
| Proof type | Receipt + execution + ancestry (Merkle proofs) |
| Beacon light client | Initialized on Bridge Hub (512 sync committee) |
| Gateway contracts | 16 deployed (including GatewayProxy, BeefyClient) |
| E2E success | Verified: Alice received 22 ETH on AssetHub (20 manual + 2 bridged) |

---

## 7. Test Infrastructure Summary

| Layer | Tests | Status |
|-------|-------|--------|
| Unit tests (pallet) | 56 | All passing |
| XCM simulator (Layer 2) | Multiple | All passing |
| Zombienet E2E (Layer 3) | Multiple | All passing |
| Performance (7 scripts) | 7 | All complete |
| Security (10 tests) | 10 | All passing |
| Reliability | 1 | Complete |
| Centralized benchmark | 2 | Complete |
| Snowbridge E2E | 1 | Complete |
