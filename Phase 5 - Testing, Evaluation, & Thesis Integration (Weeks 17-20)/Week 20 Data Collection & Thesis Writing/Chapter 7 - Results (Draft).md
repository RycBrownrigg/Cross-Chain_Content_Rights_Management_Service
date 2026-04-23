# Chapter 7: Results

*Draft — ~1,500 words*

---

## 7.1 Performance Results

The system was evaluated across six performance dimensions: single-chain throughput, block weight utilization, cross-chain latency, storage growth, sustained stress load, and resource utilization. All measurements were conducted on a local Zombienet testnet comprising a Rococo relay chain with two validators and the Content Rights parachain with a single validator collator.

### 7.1.1 Throughput

Table 7.1 presents the throughput results for each content rights extrinsic at varying concurrency levels.

**[Table 7.1: Single-Chain Throughput by Extrinsic Type and Batch Size]**

All eleven local extrinsic types were systematically evaluated, including the four thesis-critical features incorporated during development (royalty splits, auto-renewal, metadata query). At a batch size of 100, the extrinsics `register_content`, `check_access`, `set_royalty_splits`, and `query_rights_metadata` achieved a throughput of 16.5 to 16.6 transactions per second (TPS), with all 100 transactions consolidated within a single parachain block. The extrinsics `subscribe`, `purchase_ownership`, `enable_auto_renew`, and `disable_auto_renew` were limited to approximately 8.3 TPS; this limitation was not caused by block weight but by the `MaxChildrenPerNft` runtime constant (set to 50), which constrains the number of child NFTs that may be nested under a single content item. This configuration parameter, rather than the blockchain architecture, determines the subscriber capacity per content. Importantly, the performance of the four new extrinsics was identical to that of their established counterparts, thereby confirming the absence of any performance overhead attributable to the added functionality.

During sustained stress testing involving 200 concurrent accounts over a duration of three minutes, the system attained a throughput of 26.2 transactions per second (TPS), with an average of 174.6 transactions per block. The block weight utilization at 300 concurrent transactions was merely 12.9% of the maximum `ref_time` budget and 2.2% of `proof_size`, which indicates significant available capacity. Based on these observations, the estimated maximum throughput is approximately 283 TPS per parachain. This finding implies that scaling to higher TPS levels is feasible through shorter block times or Elastic Scaling (leveraging multiple cores per parachain), without requiring any modifications at the pallet level changes.

The stress test exhibited a failure rate of 78%, attributable to nonce conflicts at the RPC layer. The simultaneous submission of transactions by 200 accounts resulted in transaction-priority collisions within the mempool. Each transaction that was successfully incorporated into the chain was processed accordingly successfully.

### 7.1.2 Latency

Single-chain operations exhibited a consistent mean latency of approximately 6,000 milliseconds, which corresponds to the duration of a single parachain block. The standard deviation within a batch was less than 15 milliseconds, thereby confirming that all concurrent transactions are incorporated into the same block atomically. This deterministic latency contrasts with traditional blockchain systems, where transaction inclusion depends on fee bidding and the mempool dynamics.

Cross-chain operations utilizing XCM (Table 7.2) demonstrated latencies ranging from 3.0 to 5.3 parachain blocks (equivalent to 18–32 seconds), with `xcm_subscribe` exhibiting the shortest latency at 3.0 blocks. The inherent variance of approximately ±2 blocks can be attributed to the HRMP message relay mechanism.

**[Table 7.2: XCM Cross-Chain Latency by Operation]**

### 7.1.3 Block Weight Analysis

Block weight saturation testing (Table 7.3) demonstrated that 300 `register_content` transactions used only 12.9% of `ref_time` and 2.2% of `proof_size`. The block construction duration under load was 62 milliseconds, representing approximately 1% of the designated 6-second time limit. This indicates that the collator has substantial computational capacity headroom.

**[Table 7.3: Block Weight Utilisation at Increasing Batch Sizes]**

## 7.2 Storage Results

The augmentation of storage capacity was wholly linear across all data classifications. Each content element consumed 191 bytes of on-chain state (SCALE-encoded), each subscription 112 bytes, and each view pack 111 bytes. No indication of overhead accumulation was detected; the expense of the 50th item was equal to that of the initial item, thereby validating the O(1) complexity of the StorageMap operations.

**[Table 7.4: Per-Item Storage Costs]**

At the anticipated production scale, which includes 1 million content items and 10 million subscribers, the total state size would be approximately 1.3 GB. This capacity is well within the standard limits of a parachain database.

## 7.3 Security Results

Static analysis did not reveal any Clippy warnings. The vulnerability assessment of dependencies, conducted via `cargo audit`, identified eight advisories, all related to transitive dependencies inherited from the Polkadot SDK framework; none were present within the thesis code. This exemplifies the practical reality of developing within extensive frameworks: the application developer bears the supply chain risk associated with the framework but lacks the means to independently remediate it without an overarching framework update.

The access control audit of all 17 extrinsics identified five findings (1 Medium, 4 Low). The medium finding, an authorization gap in `xcm_transfer_ownership` that permitted any caller to transfer ownership belonging to another individual, was rectified by incorporating an `ensure!(authorizer == from)` check. One low finding, concerning view pack overwrites upon re-purchase, was also addressed by implementing additive behavior. The remaining three low findings pertain to documented design decisions suitable for a research prototype. A comprehensive summary of the findings is provided in Table 7.5.

**[Table 7.5: Security Findings Summary]**

The unit test suite comprises 56 tests: 23 functional, 10 security, 11 XCM, 5 royalty, 5 auto-renewal, and 2 metadata assessments. The security evaluations address boundary conditions (MaxChildren overflow, ContentId overflow), edge cases (zero-price, zero-views, self-subscription), and verify that the authorization modifications prevent the issues previously identified exploit.

## 7.4 Reliability Results

The baseline block production attained a 90% uptime, corresponding to 18 of the 20 expected blocks within a two-minute interval, with an average block time of 6.67 seconds. The deviation of 10% from the theoretical 6-second target is customary for a local testnet, where relay chain slot allocation is not entirely optimized regular.

Following the termination of the collator process (SIGTERM), the Mean Time To Recovery (MTTR) was approximately 15 seconds to RPC availability and 20 seconds to the first new block. All on-chain state, including content registrations, subscriptions, and ownership records, remained intact after the restart. Post-recovery block production precisely matched the baseline rate, with no residual performance degradation.

The resource monitoring test confirmed that block construction requires only 62 milliseconds under sustained load, with over 99% of the block slots remaining idle. The database cache exhibited no growth, remaining at 0 MB throughout all testing phases. The transaction pool remained limited to 20–40 pending transactions and was completely drained within 1–2 blocks following the load cessation.

## 7.5 Snowbridge Bridge Results

The Ethereum-to-Polkadot bridge has undergone comprehensive validation, confirming its end-to-end functionality. Two `Gateway.sendToken()` transactions, each amounting to 1 ETH, were executed on a local Ethereum network utilizing Geth and Lodestar v1.35.0. These transactions were relayed through the Snowbridge beacon relay and execution relay, subsequently verified by the Bridge Hub's `ethereumBeaconClient` and `ethereumInboundQueue` components. The transactions were successfully delivered as Ether foreign assets on AssetHub. Alice's final account balance of 22 ETH, which includes 20 ETH manually minted and 2 ETH bridged, substantiates the successful operation of the token transfer process delivery.

The establishment of the bridge required the resolution of several intricate integration challenges, including a discrepancy in fork-version configurations (epoch numbers versus hexadecimal bytes) which led to silent failures of Merkle proofs, a caching issue within the beacon state service that necessitated meticulous startup sequencing, and the imperative to fund Snowbridge sovereign accounts to enable XCM execution fees.

## 7.6 Comparative Results

The centralized benchmark (Express.js + SQLite) implemented the same six content rights operations and was tested using the same methodology.

**[Table 7.6: Blockchain vs Centralized Comparison]**

| Metric | Blockchain | Centralized | Ratio |
|--------|-----------|-------------|-------|
| Sustained TPS | 26.2 | 7,305 | 270× |
| Operation latency (server) | ~6,000 ms | 0.09 ms | 67,000× |
| Stress test success rate | 22% (RPC nonce conflicts) | 100% | — |
| Storage per content | 191 bytes | ~100–150 bytes | 1.5× |
| MTTR | 15–20 s | 2–3 s | 7× |
| Cross-chain equivalent | 18–32 s | 5–50 ms | 400–6,000× |

The centralized system markedly outperformed the blockchain in sustained throughput, achieving a 270-fold enhancement, and exhibited considerably lower latency. However, it is crucial to acknowledge that the centralized system operates under a fundamentally different trust model; it requires absolute trust in the operator, provides no defenses against censorship, and contains a single point of failure.

The blockchain's capacity of 26.2 TPS corresponds to approximately 2.3 million operations per day, exceeding the transaction volume commonly observed in content rights management platforms. Although the 6-second latency is greater than that of centralized alternatives, it remains deterministic and suitable for infrequent operations such as subscribing and purchasing, rather than high-frequency transactions activities.
