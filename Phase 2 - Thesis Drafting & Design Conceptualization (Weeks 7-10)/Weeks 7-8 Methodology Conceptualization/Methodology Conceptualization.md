### 4. Minor Updates to Research Questions and Objectives

Based on the three approved pivots from Phase 1 (21 Nov 2025) and subsequent refinements to adopt a measurement-focused approach, I have updated the research questions (RQs) and objectives (OBs) to enhance precision and ensure better alignment. These updates emphasise the Kusama/Polkadot ecosystem, composable NFTs, and cross-chain messaging, while framing the research around **measuring and evaluating achievable outcomes** rather than committing to specific predetermined targets. This approach maintains academic rigour by allowing results to be analysed and interpreted regardless of the specific performance figures achieved.

#### Primary Research Question (Refined)

**"How can a shared-security, multi-chain framework built on Polkadot's XCM and ink! smart contracts deliver a unified rights token that natively supports recurring subscriptions, pay-per-view micro-transactions, and permanent ownership transfers across heterogeneous blockchain networks, and what levels of transaction finality, cost efficiency, and creator revenue retention can such a system achieve?"**

#### Refined Sub-Questions

| ID | Refined Sub-Question | Rationale from Gap Analysis (G1–G7) |
| --- | --- | --- |
| SQ1 | To what extent can XCM v5+ be extended to carry recurring subscription renewal messages and rich rights metadata (e.g., PPV counters, royalty splits) across Polkadot parachains and external networks (Ethereum, Cosmos), and what atomic success rates and cross-chain finality times are achievable? | Addresses G2 (no native recurring cross-chain) + G3 (missing rights metadata) |
| SQ2 | What ink!-based design patterns (unified rights token, chain extensions, off-chain indexing) can minimise access verification latency while maintaining decentralisation, and how do the resulting latency and decentralisation index (HHI) metrics compare across varying validator node configurations (5–50 nodes)? | Directly tackles G5 (decentralisation vs. UX trade-off) |
| SQ3 | Can a single on-chain rights object simultaneously enforce subscription auto-renewal, pay-per-view consumption limits, and permanent ownership with automated royalty distribution across chains, and what are the resulting creator cost savings compared to 2025 centralised (30–45%) and bridge-based (8–15%) alternatives? | Targets G1 (protection focus) + G7 (no hybrid model exists) — the thesis's core novelty |

#### Refined Research Objectives

| ID | Refined Objective | Target Metric / Deliverable |
| --- | --- | --- |
| RO1 | Design and prototype XCM extensions for recurring and metadata-rich rights transfers, and measure the resulting atomic success rates and cross-chain finality times | Functional prototype; documented measurements of atomic success rate and finality times across test scenarios |
| RO2 | Implement a unified ink! rights token with chain extensions and off-chain indexing, and evaluate access verification latency under varying conditions | Single storage item enforcing all three monetisation models; latency measurements and analysis |
| RO3 | Develop and merge subscription, PPV, and purchase logic into one composable rights pallet, assessing the feasibility and trade-offs of unification | One contract suite instead of three separate ones; documented design trade-offs |
| RO4 | Benchmark scalability, interoperability, and economic efficiency against 2025 Ethereum L2s, centralised DRM, and bridge-based solutions | Comparative analysis of TPS, transaction costs, and creator revenue retention across systems |
| RO5 | Incorporate optional zero-knowledge proof hooks for selective regulatory disclosure and assess implementation feasibility | Proof-of-concept implementation; feasibility analysis for 2026–2027 EU/US tokenised securities regulations |
| RO6 | Quantify potential creator savings of the hybrid unified-rights-token model via Monte-Carlo simulation and comparative cost analysis | Simulation results with cost comparisons against centralised platforms and current bridge-based alternatives |

These updates incorporate the pivots seamlessly (e.g., specifying RMRK/XCM/Kusama) while adopting an exploratory, measurement-focused framing that supports rigorous academic evaluation regardless of specific outcomes achieved.

---

### 1. Methodology Chapter Draft

#### Introduction to Methodology

This chapter delineates the research methodology employed in developing the Cross-Chain Content Rights Management Service (CCRMS) framework. Given the interdisciplinary nature of the thesis—encompassing blockchain technology, decentralized systems, and content economics—the methodology adopts an iterative, design-oriented approach. It draws from design science research (DSR) paradigms, as proposed by Hevner et al. (2004), which emphasise artifact creation and evaluation within information systems. This approach is further complemented by mixed-methods evaluation to address both technical feasibility and practical implications.

The methodology is structured around iterative prototyping on the Kusama network, aligning with the modifications identified in Phase 1: initial implementation on a dedicated Kusama parachain through the Canary Chaos academic program; utilization of RMRK 2.0 composable NFTs with scheduled Cross-Chain Messaging (XCM); and provision of on-demand coretime via Asset Hub as a contingency. This approach ensures a cost-effective and pragmatic testing environment without dependency on custom tokens or the mainnet Polkadot.

The research adopts a **measurement-focused evaluation philosophy**, wherein the primary aim is to document and analyse the levels of performance, efficiency, and usability that can be attained, rather than to meet predetermined benchmarks. This approach ensures that the research contributions remain valid and valuable regardless of the specific metrics achieved and enables meaningful interpretation of both expected and unexpected outcomes results.

Key principles guiding the methodology include:

- **Decentralisation Focus:** All designs emphasize trustless interactions, deliberately avoiding the involvement of centralized intermediaries.

- **Iterative Development:** Prototyping cycles facilitate enhancements through feedback and analysis testing.

- **Measurement-Oriented Evaluation:** Outcomes are documented and analyzed rather than being evaluated against fixed standards or criteria targets.

- **Ethical Considerations:** Compliance with data privacy standards, such as GDPR-inspired principles in smart contracts, and adherence to open-source licensing for reproducibility purposes.

#### Research Design: Iterative Prototyping on Kusama

The primary research framework employs an iterative prototyping methodology, drawing inspiration from agile methodologies tailored to blockchain development, such as Ethereum's iterative upgrade process. This approach entails the development of successive prototypes on Kusama, a "canary network" for Polkadot, which facilitates rapid iteration and mitigates risks relative to alternative approaches to mainnets.

**Phase Breakdown:**

- **Conceptualisation (Weeks 7–10):** High-level architecture and design patterns are outlined without code, utilizing tools such as UML diagrams and flowcharts.

- **Prototyping (Weeks 11–16):** The implementation commences with the deployment of smart contracts on the Substrate framework for parachains, utilizing ink! for logic based on WebAssembly. RMRK 2.0 NFTs serve to represent content rights, with scheduled XCM protocols facilitating cross-chain transfers (e.g., from Kusama to other networks) parachains).

- **Evaluation (Weeks 17–20):** Mixed-methods testing on testnet deployments, with comprehensive data collection across technical, economic, and user-centric aspects domains.

- **Refinement and Documentation (Weeks 21–24):** Final iterations and thesis completion, including analysis and interpretation of all collected data measurements.

Prototyping iterates through build-test-refine cycles:

1. **Build:** Develop modular components (e.g., NFT minting for subscriptions).
2. **Test:** Deploy on Kusama parachain; simulate scenarios like PPV access.
3. **Measure:** Collect comprehensive data on performance, costs, and user experience.
4. **Refine:** Address gaps (e.g., scalability via Asset Hub coretime) based on measured outcomes.

This approach alleviates the challenges identified in Phase 1, including interoperability (G1) and resource costs (G3), by utilizing free academic resources.

#### Data Collection Methods

Data collection utilizes both qualitative and quantitative methodologies within a mixed-methods framework, thereby ensuring triangulation to enhance validity.

**Qualitative Methods:**

- **Literature Synthesis:** Building upon the compilation of 112 sources from Phase 1 and the top-25 annotated bibliography, subsequent reviews will incorporate emerging scholarly works (e.g., post-2025 Polkadot) updates).
- **Expert Interviews:** Semi-structured interviews with 5–10 blockchain experts (e.g., via Polkadot forums or academic networks) to validate designs. Questions focus on pivots, e.g., "How does RMRK 2.0 enhance content rights composability?"
- **Case Studies:** Analysis of existing systems such as Audius or Theta Network, tailored for cross-chain applications.

**Quantitative Methods:**

- **Simulation and Benchmarking:** Utilize tools such as Substrate's benchmarking pallet to assess transaction throughput, gas costs, and latency in prototypes. All measurements are meticulously documented for comparative purposes analysis.
- **User Surveys:** Post-prototype testing involving 20 to 30 participants, recruited through Web3 communities, utilizing Likert-scale questionnaires usability.
- **On-Chain Metrics:** Gather data from Kusama deployments, including NFT minting rates and XCM success ratios.

Sampling is purposive: Experts are selected for their extensive experience with Kusama and Polkadot, while users are drawn from diverse backgrounds, including creators and consumers.

#### System Implementation Approach

Implementation emphasises modularity and standards compliance. The framework uses:

- **Substrate Framework:** For parachain development, enabling custom runtime logic.
- **RMRK 2.0 NFTs:** Composable tokens for rights representation (e.g., nested NFTs for bundled subscriptions).
- **Scheduled XCM:** For cross-chain operations, ensuring atomic transfers without custom bridges.
- **Fallback Mechanisms:** If parachain slots are unavailable, shift to Asset Hub for on-demand coretime, reducing costs.

No mainnet deployments occur; all work is testnet-based for ethical and budgetary reasons. Code will be open-sourced on GitHub under MIT license.

#### Evaluation Framework Overview

Evaluation is embedded throughout, using a mixed-methods lens. Key Performance Indicators (KPIs) span technical (e.g., throughput, latency), economic (e.g., cost per transaction, creator revenue retention), and user-centric (e.g., usability scores, adoption barriers) categories. The evaluation framework is designed to **measure and document achievable outcomes** rather than assess against predetermined targets. This approach ensures:

1. **Academic rigour** — Results are analysed and interpreted regardless of whether they meet hypothetical benchmarks
2. **Meaningful contribution** — Even unexpected or suboptimal results provide valuable insights for the field
3. **Honest evaluation** — The Discussion chapter can critically assess what was achieved and why
4. **Foundation for future work** — Measured baselines inform subsequent research directions

Validity is ensured through peer reviews and reproducibility checks.

#### Limitations and Mitigation

Potential limitations include Kusama's volatility (mitigated by Asset Hub fallback) and sample size constraints (addressed via simulation scaling). Ethical risks, like smart contract vulnerabilities, are handled via audits using tools like Cargo-Clippy.

This methodology provides a robust path to answering the refined RQs and achieving ROs, bridging theory and practice in decentralised content systems.

*(References: Hevner et al., 2004 — from Phase 1 bibliography; additional sources to be integrated in final draft.)*

---

### 2. System Design and Architecture Conceptual Draft

#### Overview of System Architecture

The CCRMS framework proposes a decentralised architecture for managing content rights across blockchain ecosystems, supporting subscription, PPV, and purchase models. At a high level, it comprises modular layers: User Interface, Smart Contract Logic, Cross-Chain Interoperability, and Storage/Oracle Integration. This design addresses Phase 1 gaps (e.g., G2: Lack of cross-chain rights portability) by leveraging Kusama's parachain ecosystem.

Key design patterns include:

- **Modular Monolith to Microservices Transition:** Start with a unified Substrate runtime, evolving to composable modules.
- **Event-Driven Architecture:** Using Substrate events and XCM notifications for real-time updates.
- **Zero-Knowledge Proofs (Optional Pivot):** For privacy in PPV accesses, with feasibility to be assessed during implementation.

The architecture is conceptualised in three tiers: Front-End Access, Core Logic, and Backend Infrastructure.

#### High-Level Components

Table 1 summarises the core components:

| Component | Description | Technologies/Pivots |
|-----------|-------------|---------------------|
| **Content Rights NFTs** | Composable tokens representing rights (e.g., subscription as renewable NFT). | RMRK 2.0; Nested structures for bundles. |
| **Payment Gateway** | Handles models: Subscription (recurring XCM transfers), PPV (one-time unlocks), Purchase (permanent transfers). | Scheduled XCM for cross-chain; DOT/KSM as base assets. |
| **Access Control Module** | Enforces rights via on-chain verification. | Substrate pallets; ZK-SNARKs for off-chain proofs (feasibility to be evaluated). |
| **Oracle Integration** | Fetches off-chain content metadata (e.g., IPFS hashes). | Polkadot oracles; Decentralised storage like IPFS/Arweave. |
| **User Dashboard** | Web3 interface for creators/consumers. | Conceptual: React + Polkadot.js; No code yet. |

#### Conceptual Data Flows

Content creators mint NFTs on the Kusama parachain, embedding rights metadata (e.g., expiration for subscriptions). Consumers interact via:

1. **Subscription Flow:** User sends DOT/KSM; smart contract mints renewable NFT, schedules XCM for renewals.
2. **PPV Flow:** On-demand payment unlocks temporary access; NFT burns post-view.
3. **Purchase Flow:** Permanent NFT transfer; cross-chain via XCM to user's preferred chain.

Fallback: If parachain resources spike, migrate logic to Asset Hub for on-demand coretime, ensuring continuity.

#### Design Patterns and Challenges

**Patterns Employed:**

- **Composable Design:** RMRK 2.0 allows NFTs to nest (e.g., PPV as child of subscription NFT), enhancing flexibility.
- **Cross-Chain Atomicity:** Scheduled XCM ensures fail-safe transfers, addressing G1 (interoperability gaps).
- **Scalability Layers:** Use Kusama's relay chain for consensus; offload storage to IPFS.

**Addressed Challenges (from Phase 1's 10 Documented):**

- **C1: High Transaction Costs:** Mitigated by free parachain via Canary Chaos; batching XCM calls.
- **C2: User Onboarding Barriers:** Simplified via wallet integrations (e.g., Talisman).
- **C3: Rights Enforcement:** On-chain ACLs with off-chain oracles for content delivery.
- **C4: Cross-Chain Latency:** Scheduled XCM; actual latency to be measured during evaluation.
- **C5–C10:** Similar mappings, e.g., security via runtime upgrades.

#### Security and Scalability Considerations

Security relies on Substrate's FRAME macros for audited pallets. Scalability will be measured via parachain optimisations; fallback to Asset Hub prevents bottlenecks. The evaluation phase will document achievable TPS and identify any performance constraints.

This conceptual design sets the foundation for prototyping, aligning with updated RO2 and RO3.

---

### 3. Evaluation Plan Section

#### Evaluation Objectives and Scope

The evaluation plan assesses the CCRMS framework's effectiveness in addressing RQs, focusing on technical viability, economic sustainability, and user adoption. It occurs in Weeks 17–20, post-prototyping, using mixed-methods on Kusama testnet. Scope: Simulated environments with 50–100 transactions; no real monetary value.

The evaluation adopts a **measurement-focused approach**, documenting achievable outcomes across all KPI categories rather than assessing against predetermined targets. This ensures that the research contribution is valid regardless of specific results and enables meaningful analysis of both successes and limitations.

#### Key Performance Indicators (KPIs)

Table 2 lists KPIs across categories, with measurement methods and comparative baselines:

| Category | KPI | Measurement Method | Comparative Baseline |
|----------|-----|--------------------|-----------------------|
| **Technical** | Transaction Throughput (TPS) | Benchmarking tools (Substrate) | Ethereum L2s, centralised DRM systems |
| **Technical** | XCM Success Rate | On-chain logs analysis | Bridge-based alternatives |
| **Technical** | Cross-Chain Finality Time | Timestamp analysis across chains | Existing cross-chain solutions |
| **Technical** | Access Verification Latency | End-to-end timing measurements | Centralised streaming services |
| **Economic** | Cost per Transaction | Gas fee analysis and simulation | Ethereum, centralised platforms |
| **Economic** | Creator Revenue Retention | Revenue flow analysis | Centralised (30–45% fees), bridge-based (8–15% fees) |
| **Economic** | Model Viability | ROI modelling via simulation | Break-even analysis |
| **User-Centric** | Usability Score | Likert-scale surveys (post-testing) | Industry benchmarks |
| **User-Centric** | Adoption Barriers | Interview feedback and thematic analysis | Qualitative assessment |
| **Security** | Vulnerability Assessment | Automated audits (e.g., Cargo-Clippy, cargo-fuzz) | Industry security standards |
| **Decentralisation** | HHI Index | Validator distribution analysis | Centralised alternatives |

#### Methods and Procedures

- **Quantitative Testing:** Deploy prototypes; run scripts for load testing (e.g., 1,000 PPV requests). Collect and document all metrics via tools like Prometheus.
- **Qualitative Assessment:** User testing sessions (n=20); thematic analysis of feedback on pivots (e.g., RMRK ease of use).
- **Comparative Analysis:** Benchmark measured results against baselines (e.g., ERC-721 on Ethereum, centralised DRM systems).
- **Validity Measures:** Triangulation (multiple data sources); peer debriefing.

#### Analysis Approach

All collected data will be analysed to:

1. **Document achieved performance levels** across all KPI categories
2. **Compare results** against existing solutions (Ethereum L2s, centralised DRM, bridge-based systems)
3. **Identify trade-offs** between competing objectives (e.g., decentralisation vs. latency)
4. **Assess feasibility** of the unified rights token approach for real-world deployment
5. **Inform recommendations** for future development and adoption

#### Timeline and Resources

- **Week 17:** Setup testnet; baseline tests and initial data collection.
- **Week 18:** User evaluations and qualitative data gathering.
- **Weeks 19–20:** Comprehensive data analysis; documentation of findings; refinements.

Resources: Free Kusama parachain via Canary Chaos program; open-source tools.

This plan ensures comprehensive validation through measurement and comparative analysis, informing the Discussion and Conclusion chapters with evidence-based findings.