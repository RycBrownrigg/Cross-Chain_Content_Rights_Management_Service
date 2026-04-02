# Chapter 7: Results

*Draft — ~1,500 words*

---

## 7.1 Performance Results

The system was assessed across six performance dimensions: single-chain throughput, block weight utilization, cross-chain latency, storage growth, sustained stress load, and resource utilization. All measurements were performed on a local Zombienet testnet featuring a Rococo relay chain with two validators and the Content Rights parachain with one validator collator.

### 7.1.1 Throughput

Table 7.1 presents the throughput results for each content rights extrinsic at varying concurrency levels.

**[Table 7.1: Single-Chain Throughput by Extrinsic Type and Batch Size]**

All eleven local extrinsic types were systematically evaluated, including the four thesis-critical features incorporated during development (royalty splits, auto-renewal, metadata query). At a batch size of 100, the extrinsics `register_content`, `check_access`, `set_royalty_splits`, and `query_rights_metadata` achieved a throughput of 16.5 to 16.6 transactions per second (TPS), with all 100 transactions consolidated within a single parachain block. The extrinsics `subscribe`, `purchase_ownership`, `enable_auto_renew`, and `disable_auto_renew` were limited to approximately 8.3 TPS; this limitation was not caused by block weight but by the `MaxChildrenPerNft` runtime constant (set to 50), which constrains the number of child NFTs that may be nested under a single content item. This configuration parameter, rather than the blockchain architecture, determines the subscriber capacity per content. Importantly, the performance of the four new extrinsics was identical to their established counterparts, thereby confirming the absence of any performance overhead attributable to the added functionalities functionality.

Under sustained stress testing with 200 concurrent accounts over a period of 3 minutes, the system achieved a throughput of 26.2 transactions per second (TPS), with an average of 174.6 transactions per block. The block weight utilization at 300 concurrent transactions was only 12.9% of the maximum `ref_time` budget and 2.2% of `proof_size`, indicating considerable available capacity. Based on these measurements, the estimated maximum throughput is approximately 283 TPS per parachain. This suggests that scaling to higher TPS levels is feasible through shorter block times or Elastic Scaling (utilizing multiple cores per parachain), without any modifications at the pallet level changes.

The stress test exhibited a failure rate of 78%, attributable to nonce conflicts at the RPC layer. The simultaneous submission of transactions by 200 accounts resulted in transaction-priority collisions within the mempool. Each transaction that was successfully incorporated into the chain was processed accordingly successfully.

### 7.1.2 Latency

Single-chain operations demonstrated a consistent mean latency of approximately 6,000 milliseconds, equivalent to one parachain block time. The standard deviation within a batch was less than 15 milliseconds, thereby confirming that all concurrent transactions are incorporated into the same block atomically. This deterministic latency contrasts with conventional blockchain systems, where transaction inclusion hinges on fee bidding and mempool dynamics.

Cross-chain operations utilizing XCM (Table 7.2) exhibited latencies ranging from 3.0 to 5.3 parachain blocks (18–32 seconds), with `xcm_subscribe` demonstrating the shortest latency at 3.0 blocks. The inherent variance of ±2 blocks is attributable to the HRMP message relay mechanism.

**[Table 7.2: XCM Cross-Chain Latency by Operation]**

### 7.1.3 Block Weight Analysis

Block weight saturation testing (Table 7.3) indicated that 300 `register_content` transactions utilized merely 12.9% of `ref_time` and 2.2% of `proof_size`. The block construction duration under load was 62 milliseconds, accounting for roughly 1% of the allotted 6-second time frame. This serves as evidence that the collator possesses significant computational capacity headroom.

**[Table 7.3: Block Weight Utilisation at Increasing Batch Sizes]**

## 7.2 Storage Results

The increase in storage capacity was entirely linear across all data categories. Each content item utilized 191 bytes of on-chain state (SCALE-encoded), each subscription 112 bytes, and each view pack 111 bytes. No evidence of overhead accumulation was observed; the cost of the 50th item was identical to that of the initial item, thereby confirming the O(1) complexity of the StorageMap operations.

**[Table 7.4: Per-Item Storage Costs]**

At the projected production scale, involving 1 million content items and 10 million subscribers, the total state would be approximately 1.3 GB, which is well within the standard capacity of a parachain database.

## 7.3 Security Results

Static analysis yielded no Clippy warnings. The dependency vulnerability scan (`cargo audit`) identified eight advisories, all pertaining to transitive dependencies inherited from the Polkadot SDK framework; none were found within the thesis code. This exemplifies the practical reality of developing on extensive frameworks: the application developer assumes the framework's supply chain risk but lacks the means to remediate it independently without a comprehensive framework update upgrade.

The access control audit of all 17 extrinsics identified five findings (1 Medium, 4 Low). The medium finding, an authorization gap in `xcm_transfer_ownership` that permitted any caller to transfer ownership belonging to another individual, was rectified by incorporating an `ensure!(authorizer == from)` check. One low finding, concerning view pack overwrites upon re-purchase, was also addressed through the implementation of additive behavior. The remaining three low findings pertain to documented design decisions suitable for a research prototype. A comprehensive summary of the findings is provided in Table 7.5.

**[Table 7.5: Security Findings Summary]**

The unit test suite consists of 56 tests: 23 functional, 10 security, 11 XCM, 5 royalty, 5 auto-renewal, and 2 metadata tests. The security assessments address boundary conditions (MaxChildren overflow, ContentId overflow), edge cases (zero-price, zero-views, self-subscription), and confirm that the authorization modification prevents the previously identified issues exploit.

## 7.4 Reliability Results

Baseline block production achieved 90% uptime (18 of 20 expected blocks within a two-minute interval), with an average block time of 6.67 seconds. The 10% deviation from the theoretical 6-second target is typical for a local testnet, where relay chain slot allocation is not perfectly optimized regular.

Following the termination of the collator process (SIGTERM), the Mean Time To Recovery (MTTR) was approximately 15 seconds to RPC availability and 20 seconds to the first new block. All on-chain state, including content registrations, subscriptions, and ownership records, remained intact after the restart. Post-recovery block production precisely matched the baseline rate, with no residual performance degradation.

The resource monitoring test verified that block construction requires only 62 milliseconds under sustained load, with over 99% of the block slot remaining idle. The database cache experienced no growth, maintaining a size of 0 MB throughout all testing phases. The transaction pool remained constrained to 20–40 pending transactions and was entirely drained within 1–2 blocks following the load cessation.

## 7.5 Snowbridge Bridge Results

The Ethereum-to-Polkadot bridge underwent comprehensive validation, confirming its end-to-end functionality. Two `Gateway.sendToken()` transactions, each amounting to 1 ETH, were executed on a local Ethereum network utilizing Geth and Lodestar v1.35.0. These transactions were relayed through the Snowbridge beacon relay and execution relay, subsequently verified by the Bridge Hub's `ethereumBeaconClient` and `ethereumInboundQueue` components. The transactions were successfully delivered as Ether foreign assets on AssetHub. Alice's final account balance of 22 ETH, comprising 20 ETH manually minted and 2 ETH bridged, substantiates the successful operation of the token transfer process delivery.

The setup of the bridge necessitated addressing multiple complex integration issues, including a mismatch in fork-version configurations (epoch numbers versus hexadecimal bytes) that resulted in silent Merkle proof failures, a caching problem within the beacon state service that demanded careful startup sequencing, and the requirement to fund Snowbridge sovereign accounts to facilitate XCM execution fees.

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

The centralized system significantly exceeded the blockchain in sustained throughput, achieving a 270-fold improvement, and demonstrated markedly lower latency. However, it is essential to recognize that the centralized system functions under a fundamentally different trust model; it necessitates complete trust in the operator, offers no resistance to censorship, and possesses a single point of failure.

The blockchain's 26.2 TPS equates to approximately 2.3 million operations per day, surpassing the transaction volume typically observed in content rights management platforms. Although the 6-second latency is slower than that of centralized alternatives, it remains deterministic and acceptable for infrequent operations such as subscribing and purchasing, rather than high-frequency activities.
