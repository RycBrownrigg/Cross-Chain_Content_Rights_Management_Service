### Refined Research Questions and Objectives 

#### Primary Research Question (refined)

**Original**  

"What are the most effective strategies for designing and implementing a cross-chain content rights management service that aims to facilitate decentralized subscription, pay-per-view, and purchase models while ensuring scalability, interoperability, and economic efficiency across multiple blockchain networks?"

**Refined**
  
**"How can a shared-security, multi-chain framework built on Polkadot's XCM and ink! smart contracts deliver a unified rights token that natively supports recurring subscriptions, pay-per-view micro-transactions, and permanent ownership transfers across heterogeneous blockchain networks, and what levels of transaction finality, cost efficiency, and creator revenue retention can such a system achieve?"**

#### Refined Sub-Questions

| ID | Refined Sub-Question (November 2025) | Rationale from Gap Analysis (G1–G7) |
| --- | --- | --- |
| SQ1 | To what extent can XCM v5+ be extended to carry recurring subscription renewal messages and rich rights metadata (e.g., PPV counters, royalty splits) across Polkadot parachains and external networks (Ethereum, Cosmos), and what atomic success rates and cross-chain finality times are achievable? | Addresses G2 (no native recurring cross-chain) + G3 (missing rights metadata) |
| SQ2 | What ink!-based design patterns (unified rights token, chain extensions, off-chain indexing) can minimise access verification latency while maintaining decentralisation, and how do the resulting latency and decentralisation index (HHI) metrics compare across varying validator node configurations (5–50 nodes)? | Directly tackles G5 (decentralisation vs. UX trade-off) |
| SQ3 (new) | Can a single on-chain rights object simultaneously enforce subscription auto-renewal, pay-per-view consumption limits, and permanent ownership with automated royalty distribution across chains, and what are the resulting creator cost savings compared to 2025 centralised (30–45%) and bridge-based (8–15%) alternatives? | Targets G1 (protection focus) + G7 (no hybrid model exists) — the thesis's core novelty |

#### Refined Research Objectives

| ID | Refined Objective (November 2025) | Target Metric / Deliverable |
| --- | --- | --- |
| RO1 | Design and prototype XCM extensions for recurring and metadata-rich rights transfers, and measure the resulting atomic success rates and cross-chain finality times | Functional prototype; documented measurements of atomic success rate and finality times across test scenarios |
| RO2 | Implement a unified ink! rights token with chain extensions and off-chain indexing, and evaluate access verification latency under varying conditions | Single storage item enforcing all three monetisation models; latency measurements and analysis |
| RO3 | Develop and merge subscription, PPV, and purchase logic into one composable rights pallet, assessing the feasibility and trade-offs of unification | One contract suite instead of three separate ones; documented design trade-offs |
| RO4 | Benchmark scalability, interoperability, and economic efficiency against 2025 Ethereum L2s, centralised DRM, and bridge-based solutions | Comparative analysis of TPS, transaction costs, and creator revenue retention across systems |
| RO5 (new) | Incorporate optional zero-knowledge proof hooks for selective regulatory disclosure and assess implementation feasibility | Proof-of-concept implementation; feasibility analysis for 2026–2027 EU/US tokenised securities regulations |
| RO6 (new) | Quantify potential creator savings of the hybrid unified-rights-token model via Monte-Carlo simulation and comparative cost analysis | Simulation results with cost comparisons against centralised platforms and current bridge-based alternatives |

---

#### Alignment with Literature Gaps

These refined questions and objectives are precisely aligned with the specific gaps identified in the literature (notably G1, G2, G3, G5, G7). By framing the research around **measurement and evaluation** rather than predetermined targets, the thesis:

1. **Maintains academic rigour** — Results are analysed and interpreted regardless of whether they meet hypothetical benchmarks
2. **Allows for meaningful contribution** — Even unexpected or suboptimal results provide valuable insights for the field
3. **Supports honest evaluation** — The Discussion chapter can critically assess what was achieved and why
4. **Establishes a foundation for future work** — Measured baselines inform subsequent research directions

The deliverables now emphasise functional prototypes, documented measurements, comparative analyses, and feasibility assessments — all of which constitute valid academic contributions regardless of the specific performance figures achieved.