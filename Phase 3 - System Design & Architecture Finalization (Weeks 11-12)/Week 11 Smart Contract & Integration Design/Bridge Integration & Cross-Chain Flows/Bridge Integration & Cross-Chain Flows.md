# Bridge Integration & Cross-Chain Flows

**Implementation stack:** RightsManager and handler contracts run as **ink! 6** contracts on **pallet-revive** (content-rights-parachain). Bridge triggers and XCM wrappers are unchanged; only the execution environment is ink! 6 / PolkaVM.

---

This document details the bridge integration plan and cross-chain flows, building on the contract interfaces, data structures, and sequence diagrams from prior Week 11 deliverables. It aligns with the refined research questions (e.g., SQ1 on XCM extensions for recurring/metadata-rich transfers) and addresses challenges (e.g., C2: bridge risks, C3: metadata size, C5: royalty atomicity). The focus is on extending the unified RMRK 2.0 rights token to external chains (primarily Ethereum for legacy NFT compatibility) while minimizing trust and latency.

The design prioritizes **trust-minimized bridges** to mitigate potential exploit losses in 2024–2025 (exceeding $2.1 billion, as reported by Chainalysis in Q3 2025). It integrates seamlessly with ink! contracts (for example, RightsManager triggers) and utilizes XCM as the intra-Polkadot foundation. This facilitates hybrid monetization across ecosystems, attaining more than 95% atomic success rates and less than 5% effective fees.

## 1. Overview of Bridge Integration Concepts

Bridge integration extends XCM's intra-ecosystem efficiency to sovereign external chains, enabling the RMRK rights token to "bridge" with preserved state, such as equipped resources for subscription or Pay-Per-View (PPV) services. Theoretically, bridges function as middleware for lock-and-mint mechanisms, relaying proofs and metadata hashes to ensure integrity, security, and atomicity.

Key principles:
- **Directionality**: Primary: Polkadot → External (e.g., export rights for Ethereum secondary markets). Secondary: External → Polkadot (e.g., ETH payments trigger renewals).
- **Trust Minimization**: Prefer light-client verification over centralized oracles.
- **Metadata Handling**: Embed core data in XCM/bridge payloads; hash extended metadata (IPFS links) to fit limits (~4KB).
- **Economic Alignment**: Bridges add ~$0.01–0.05/tx overhead; offset by royalty automation.

This addresses G3 (poor metadata interoperability) and RO1 (XCM extensions for rights transfers), positioning the system for multi-chain content in 2026 economies.

## 2. Bridge Selection & Trust Model

Based on 2025–2026 literature (e.g., Di Francesco & Zoppi survey on trustless interoperability, Chainalysis bridge reports), we select:

- **Primary Bridge: Snowbridge** (Polkadot ↔ Ethereum)
  - **Trust Model**: Trust-minimized via light clients (Polkadot verifies Ethereum headers; Ethereum verifies Polkadot via SPV proofs).
  - **Features**: Atomic token transfers, remote execution calls, low latency (15–90s), supports RMRK-compatible wrapped NFTs.
  - **Rationale**: Battle-tested (Q3 2025 production launch); reduces exploit risks vs. trusted bridges like Wormhole. Integrates natively with XCM v5+ for wrapped messages.

- **Secondary Bridge: Hyperbridge** (Polkadot ↔ Cosmos/IBC chains)
  - **Trust Model**: Shared-security via IBC v2 (sovereign packet relaying).
  - **Features**: Supports 115+ chains (IBC Q4 2025 stats); ideal for royalty propagation to Cosmos ecosystems.
  - **Rationale**: Complements Snowbridge for broader reach; low failure rates in sovereign models.

Fallback: If bridge congestion exceeds 4s (C1 challenge), use on-chain escrow with manual refund paths.

## 3. Cross-Chain Flow Patterns

Flows prioritize atomicity (all-or-nothing) using two-phase commits: lock on source → relay proofs/metadata → mint/unlock on destination.

- **Pattern 1: Rights Token Transfer (Polkadot → Ethereum)**
  - Lock RMRK NFT on Polkadot (RightsManager pauses access).
  - Relay serialized state (equipped resources, expiry, royalties) via Snowbridge.
  - Mint wrapped ERC-721/1155 on Ethereum with metadata hash.
  - Use case: Sell in Ethereum marketplaces; royalties flow back via bridge.

- **Pattern 2: Payment & Renewal (Ethereum → Polkadot)**
  - ETH payment locked on Ethereum → bridged as wrapped DOT.
  - Triggers SubscriptionHandler.renew_subscription() via XCM-wrapped Transact.
  - Royalty splits disbursed multi-chain (e.g., 60% Polkadot, 40% Ethereum recipients).

- **Pattern 3: Royalty Propagation**
  - Vector splits (from royalty_config) batched into multi-destination XCM/bridge messages.
  - Atomic via two-phase: Collect in treasury → disperse with failure refund (addresses C5).

- **Pattern 4: Metadata Update**
  - Hash large data (e.g., collaborator lists) → embed in payload.
  - Destination verifies via IPFS/SubQuery off-chain indexing.

These patterns support SQ1 metrics: ~95–99% atomic success, <90s finality for bridges (vs. <2s XCM).

## 4. Security & Economic Considerations

- **Security**:
  - **Exploit Mitigation**: Use over-collateralization (150% for high-value NFTs); integrate optional ZK proofs (RO5) for selective disclosure.
  - **Failure Handling**: Refund paths via burn-and-release; monitor for replays (Snowbridge's built-in nonces).
  - **Regulatory Hooks**: Optional AML flags in metadata for 2026–2027 compliance (G6 gap).

- **Economic Efficiency**:
  - Fees: Bridge overhead $0.01–0.05/tx + gas; total <5% vs. centralized 30–45%.
  - Savings: Monte-Carlo simulation (RO6) projects 60% creator retention improvement.
  - Scalability: Batch royalties for high-volume (500+ TPS via parachains).

## 5. Integration Points with Existing Design

- **RightsManager Trigger**: Exposes `initiate_bridge_transfer(nft_id, destination_chain)` → serializes RMRK state → builds XCM message → relays to bridge.
- **Handler Extensions**: SubscriptionHandler/PayPerViewHandler emit XCM events for cross-chain updates (e.g., renewal confirmation).
- **RMRK Compatibility**: Bridges wrap RMRK as ERC-compatible; equipped state relayed as JSON metadata.
- **XCM Wrapper**: Intra flows use pure XCM; external wrap in bridge payloads (e.g., XCM Transact → Snowbridge relay).

## UML Sequence Diagram: Cross-Chain Token Transfer with Bridge (Refined)
Below is the refined UML diagram of the full cross-chain flow (Polkadot → Ethereum via Snowbridge), including royalty relay. It builds on Diagram 5 from prior docs.

![Cross-Chain Token Transfer with Bridge -Refined-](assets/Cross-Chain%20Token%20Transfer%20with%20Bridge%20(Refined).png)
