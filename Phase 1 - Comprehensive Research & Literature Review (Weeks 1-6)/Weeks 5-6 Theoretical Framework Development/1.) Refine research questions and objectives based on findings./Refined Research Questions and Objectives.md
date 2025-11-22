### Refined Research Questions and Objectives 

#### Primary Research Question (refined)

**Original**  

“What are the most effective strategies for designing and implementing a cross-chain content rights management service that aims to facilitate decentralized subscription, pay-per-view, and purchase models while ensuring scalability, interoperability, and economic efficiency across multiple blockchain networks?”

**Refined**
  
**“How can a shared-security, multi-chain framework built on Polkadot’s XCM and ink! smart contracts deliver a unified rights token that natively supports recurring subscriptions, pay-per-view micro-transactions, and permanent ownership transfers across heterogeneous blockchain networks, while achieving sub-second finality, sub-cent transaction costs, and creator revenue retention greater than 95 %?”**

#### Refined Sub-Questions

| ID | Refined Sub-Question (November 2025) | Rationale from Gap Analysis (G1–G7) |
| --- | --- | --- |
| SQ1 | How can XCM v5+ be extended to carry recurring subscription renewal messages and rich rights metadata (e.g., PPV counters, royalty splits) across Polkadot parachains and external networks (Ethereum, Cosmos) with >99 % atomic success rate? | Addresses G2 (no native recurring cross-chain) + G3 (missing rights metadata) |
| SQ2 | What ink!-based design patterns (unified rights token, chain extensions, off-chain indexing) enable Netflix-like <1 second access verification latency while maintaining a decentralization index (HHI) below 1,500 across 5–50 validator nodes? | Directly tackles G5 (decentralisation vs. UX trade-off) |
| SQ3 (new) | Can a single on-chain rights object simultaneously enforce subscription auto-renewal, pay-per-view consumption limits, and permanent ownership with automated royalty distribution across chains, and what are the resulting creator cost savings compared to 2025 centralized (30–45 %) and bridge-based (8–15 %) alternatives? | Targets G1 (protection focus) + G7 (no hybrid model exists) – the thesis’s core novelty |

#### Refined Research Objectives

| ID | Refined Objective (November 2025) | Target Metric / Deliverable (derived from 2025 benchmarks & gaps) |
| --- | --- | --- |
| RO1 | Design and prototype XCM extensions for recurring and metadata-rich rights transfers | >99 % atomic success, <2 s cross-chain finality |
| RO2 | Implement a unified ink! rights token with chain extensions and off-chain indexing | Single storage item enforcing all three monetisation models; <1 s access check |
| RO3 | Develop and merge subscription, PPV, and purchase logic into one composable rights pallet | One contract suite instead of three separate ones |
| RO4 | Benchmark scalability, interoperability, and economic efficiency against 2025 Ethereum L2s, centralised DRM, and bridge-based solutions | >500 TPS, <$0.002 effective cost per micro-tx, >95 % creator revenue retention |
| RO5 (new) | Incorporate optional zero-knowledge proof hooks for selective regulatory disclosure | Future-proof for 2026–2027 EU/US tokenized securities regulations |
| RO6 (new) | Quantify creator savings of the hybrid unified-rights-token model via Monte-Carlo simulation | >60 % cost reduction vs centralised platforms; >40 % vs current bridge-based alternatives |

These refined questions and objectives are now precisely aligned with the specific gaps identified in the literature (notably G1, G2, G3, G5, G7), and they establish measurable success criteria for the remainder of the thesis. They are prepared for direct inclusion into the revised Chapter 3 (Research Questions and Objectives).