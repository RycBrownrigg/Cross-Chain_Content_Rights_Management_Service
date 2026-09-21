# Conclusion and Future Work

This closing chapter restates the contributions, summarizes the principal findings, identifies the most important threads of future work, and offers a brief closing reflection.

## Summary of Contributions

Section 1.4 stated four contributions. We expand each here.

1. **A feasibility result for the unified rights primitive.** The central conceptual contribution is the demonstration that subscription, pay-per-view, and permanent ownership can be encoded as native access modes of a single on-chain token — not as configurations of a generic licensing primitive, but as first-class state transitions enforced by a unified access check. The implementation uses three storage maps (`Subscriptions`, `ViewPacks`, `Owners`) with a single priority-resolution check and shared royalty logic; all 56 unit tests and all 11 KPIs confirm correct enforcement. No novel cryptographic or consensus-layer mechanisms are required. This result closes gap G7 from Chapter 2 and is the dissertation's primary intellectual contribution.

2. **Quantified decentralization–latency and revenue trade-offs.** Prior work endorsed decentralization qualitatively or measured only centralized performance in isolation. This dissertation measures the trade-off directly. The latency overhead is 67,000× and the throughput penalty is 270× against a centralized Express.js baseline; the Herfindahl-Hirschman Index improvement is approximately 300-fold (Polkadot HHI ~33 vs. centralized DRM at 10,000). The Monte Carlo creator-revenue simulation over 10,000 iterations shows a conditional advantage: CCRMS produces a 25.4% higher mean revenue, but only for creators above approximately 2,000 followers. Both quantifications are novel in the context of blockchain content rights systems.

3. **A cross-chain rights artifact demonstrating XCM sufficiency.** The CCRMS parachain — `pallet-content-rights`, `pallet-rights-verifier`, an ink! 6 wrapper contract, an EVM read-only precompile, and benchmark and simulation scripts — demonstrates that XCM v3 with payer–beneficiary decoupling is sufficient for all five authenticated cross-chain rights operations without custom protocol extensions. Seven implementation specifications (pallet design, XCM message flows, security threat model, royalty algorithm, precompile interface, NFT nesting model, and Snowbridge integration) provide design knowledge intended to support future replication and extension. The artifact and specifications are released open source under the MIT license.

4. **A DSR worked example for multi-component blockchain prototypes.** The full DSR cycle — problem identification, design, instantiation, evaluation, and communication — is applied to a system spanning FRAME pallets, ink! contracts, XCM, Snowbridge, and Monte Carlo simulation. This combination is seldom exemplified in existing DSR literature, which tends to address single-component blockchain systems. Future researchers developing comparable multi-layer blockchain prototypes may use this dissertation as a methodological reference.

## Principal Findings

Six principal findings emerge from the work:

1. **The architecture works.** All planned functionality is implemented; all KPIs are met; all 56 unit tests pass on every commit.
2. **The major architectural decisions aged well.** The pallet-first decision was vindicated by the January 2026 ink! discontinuation; the RMRK 2.0 to `pallet-nfts` pivot, the unified rights token model, and the cross-chain operation pattern are likewise vindicated to varying degrees. In retrospect, we would not change any of the major decisions.
3. **The economic advantage is conditional on the creator's audience size.** CCRMS wins for creators with 10,000+ followers but loses to centralized platforms for creators with fewer than ~2,000 followers because algorithmic discovery dominates. The headline number (CCRMS earns more on average) is true, but the conditional version is the more accurate framing for individual creator decisions.
4. **Cross-chain operation is operationally feasible but latency-bound.** XCM v3 is sufficient; cross-chain finality measured on a pre-Polkadot 2.0 toolchain serves as an upper bound, not a fundamental limit.
5. **Standards reimplementation is sometimes preferable to standards adoption** when the reference implementation is unmaintained; the RMRK 2.0 pivot is the exemplar.
6. **Forward compatibility is a defensive engineering goal.** Configuring the runtime to accept Ethereum-originated XCM messages at minimal additional cost in Phase 4 enabled the Snowbridge integration to succeed without pallet-level modifications.

## Future Work

11 threads of future work emerged from the research. Appendix E provides full descriptions.

**Table: Future Work Summary**

| # | Thread | Priority | Key action |
| --- | --- | --- | --- |
| 9.3.1 | Production deployment | Near-term | Deploy to public testnet/mainnet; obtain third-party security audit |
| 9.3.2 | Polkadot 2.0 migration | Near-term | Target newer SDK release (no pallet changes); compress latency via Async Backing, Agile Coretime, Elastic Scaling |
| 9.3.3 | Smart contract layer migration | Near-term | Choose among Solidity rewrite, `wrevive` adoption, or contract removal (ink! discontinued Jan 2026) |
| 9.3.4 | 50-child cap mitigation | Near-term | Raise bound + re-benchmark, replace with membership map, or introduce hierarchical nesting |
| 9.3.5 | User study | Near-term | Build minimal wallet/CLI; test with Web3 creators and consumers (highest-priority research extension) |
| 9.3.6 | Bridged-payment final hop | Near-term | Configure `PaymentCurrency` for foreign Ether or add swap step |
| 9.3.7 | Resale royalties | Medium-term | Add optional `resale_royalty_basis_points`; requires on-chain marketplace for price verification |
| 9.3.8 | Capability-based delegation | Medium-term | Relax Finding B remediation with time-limited delegate authorization |
| 9.3.9 | Monte Carlo extensions | Medium-term | Add creator psychology, network effects, longitudinal and regulatory modeling |
| 9.3.10 | Formal verification | Long-term | Apply Isabelle/HOL techniques to authorization model, royalty algorithm, cross-chain pattern |
| 9.3.11 | JAM transition | Long-term | Migrate to JAM when mainnet launches (mid-to-late 2026); no rebuild required |

## Closing Reflection

CCRMS began with a premise: that creators deserve more of the value they generate and that blockchain technology offers a credible path to delivering it. We tested the premise by building a working prototype, measuring its operational properties, and simulating its economic outcomes. The premise held, but it was also **refined**: the Monte Carlo simulation contradicts the naive form ("decentralization is universally better for creators") and supports the conditional form ("decentralization is better for creators who have outgrown the discovery value of centralized platforms"). An honest conditional is more valuable than a universal claim.

The Polkadot ecosystem changed substantially during the implementation window (Polkadot 2.0 moved to production, Snowbridge V2 went live, ink! was discontinued, JAM reached testnet, Story Protocol launched), and any of these could have invalidated the work under different architectural decisions. None did, because we chose conservatively: favoring maintained primitives, minimizing reliance on non-essential components, and preferring deployable patterns over speculative future features. In retrospect, the dissertation is a study in **defensive engineering applied to a fast-moving research domain**, and a case for **conservatively chosen, carefully documented architectural decisions as the most durable deliverable**.

CCRMS is a prototype in one corner of one blockchain ecosystem, addressing one aspect of one industry's structural problems. It is not the future of content rights management, and we do not claim it is. But it demonstrates that the future of content rights management can be built on open, decentralized, cryptographically verifiable infrastructure, and it provides a starting point for others to continue the work.
