# CCRMS Dissertation — Review Draft
*Chapters 1–8 · ~14,403 words (UM-compliant count)*

---

# Introduction

## The Problem

The prevailing content economy is unfavorable to creators. An independent musician earning USD 100,000 in streaming revenue typically retains between USD 55,000 and USD 70,000 after platform fees and distributor commissions — a figure that is substantially lower for label-signed artists [musicBizResearch2024]. Centralized intermediaries retain between 30 and 60 percent of gross creator revenue, depending on the platform and contract structure; the per-platform breakdown used in our analysis is presented in Section 7.2.3 (Table 7.1.2). Fees are non-negotiable, audiences are non-portable, and content rights remain bound by the platform's terms of service throughout.

Consumers face similar fragmentation. A film bought on iTunes cannot be streamed on Amazon Prime; an Audible audiobook cannot be transferred to Google Play; a subscription started on one platform cannot be moved to another. Consumers do not own their purchases; they hold a platform-bound license that can be revoked, modified, or ignored. The fragmentation that constrains creators also restricts the consumers who support them.

Fragmentation extends to monetization models. Subscriptions typically live on Patreon; one-time sales on Gumroad; pay-per-view is scarcely supported because the overhead of conventional payment systems makes micro-transactions uneconomic. Each platform supports a single monetization model, has its own audience, charges its own fees, and produces its own accounting reports. A creator who wants to offer all three models is forced to run three or four platforms in parallel and reconcile them by hand.

Existing blockchain alternatives address parts of the problem but not the whole. Non-fungible tokens (NFTs) provide transferable ownership but not recurring access or per-view consumption. Subscription-style decentralized platforms (such as Audius) offer recurring revenue but are confined to a single chain and audience. Cross-chain bridges move assets between ecosystems but lack metadata for rights. Blockchain-based digital rights management has been examined in the academic literature specifically for the music industry [cirelloEtAl2023], and proposed solutions share a common limitation: they address rights metadata or royalty distribution in isolation, without combining all three monetization models into a single portable primitive. No existing system, centralized or decentralized, delivers subscription, pay-per-view, and permanent ownership from a single rights primitive that is portable across blockchains.

The technical primitives to address this (cross-chain messaging, programmable smart contracts, on-chain royalty distribution, and NFT-based rights tokenization) already exist as standalone capabilities. Hanneke et al. [hannekeEtAl2024] characterize this class of systems as an emerging *Internet of Value*, in which blockchain tokenization enables asset ownership and revenue flows that bypass centralized intermediaries entirely. Our research examines whether these primitives can be integrated into a coherent system that benefits creators more than existing solutions and the conditions under which creators would adopt it.

## Background Context

This dissertation sits at the intersection of three research and engineering areas: blockchain-based digital rights management, cross-chain interoperability, and decentralized content monetization. Each area is surveyed in Chapter 2; this section provides the context needed to motivate the work.

The global Digital Rights Management market is large and growing. Independent estimates from MarketsandMarkets, Mordor Intelligence, and Grand View Research place the market at approximately USD 6.7 billion in 2025, with a forecast to reach USD 11–14 billion by 2030 (10–11% CAGR), driven by streaming services, OTT platforms, rising AI-related piracy, and regulatory pressure. The blockchain-specific segment is smaller but expanding at approximately 33% annually, projected to reach USD 2.74 billion by 2030.

Cross-chain interoperability has emerged as an active research area during the implementation window. A 2023 survey in IEEE Transactions on Knowledge and Data Engineering [renEtAl2023] classifies interoperability approaches into five categories — sidechains, notary schemes, hashed time lock contracts, relays, and blockchain-agnostic protocols — and two further 2025 surveys [dengEtAl2025; liEtAl2025a] collectively cover more than 150 sources. The Polkadot ecosystem that underpins our technical foundation completed its 2.0 upgrade during this period, materially improving per-parachain latency and throughput; the Snowbridge V2 and JAM developments are surveyed in Chapter 2.

In January 2026, the ink! Alliance discontinued development of ink!, the language selected for the CCRMS contract layer. Our pallet-first architecture proved resilient to the change (Appendix A.9). The EU AI Act copyright provisions (August 2025) and MiCA (full enforcement July 2026) create regulatory demand for cryptographic provenance and tamper-evident rights records, capabilities that CCRMS can provide.

## Research Aim and Approach

Our objective is to **design, implement, and evaluate a functional prototype of a cross-chain content rights management service that supports three monetization models: subscription, pay-per-view, and permanent ownership, using a single unified rights primitive with automatic royalty distribution and cross-chain portability**. We designate this prototype CCRMS (the Cross-Chain Content Rights Management Service) and implement it as a Polkadot parachain.

The primary research question that guides our work is:

> How can a shared-security, multi-chain framework built on Polkadot's Cross-Consensus Messaging (XCM) and FRAME pallet primitives deliver a unified rights token that natively supports recurring subscriptions, pay-per-view microtransactions, and permanent ownership transfers across heterogeneous blockchain networks, and what levels of transaction finality, cost efficiency, and creator revenue retention can such a system achieve?

The question has two mutually constraining components: design feasibility and measurement — which are fully decomposed in Chapter 3.

Our research approach is grounded in **design science research** [hevnerEtAl2004] and applied to a multi-component blockchain prototype. We organize the methodology, detailed in Chapter 4, into iterative build-test-measure-refine cycles within a six-phase framework. Our evaluation strategy, as delineated in Chapter 6, combines quantitative measures, including technical benchmarks, security audits, comparative analyses, and Monte Carlo simulations of creator revenue, with qualitative insights from literature synthesis. We frame the evaluation as **measurement-focused** rather than target-driven: our objective is to document and analyze the levels of performance, security, and economic viability achieved by the system, rather than to verify conformity with a predefined set of criteria.

## Contributions

We make four contributions, described in detail in Section:

1. **A feasibility result for the unified rights primitive.** This dissertation demonstrates that a single FRAME pallet, with a unified priority-resolution access check across three storage maps, is sufficient to encode subscription, pay-per-view, and permanent ownership as native access modes for a single token type — without novel cryptographic or consensus-layer mechanisms. This closes the gap G7 identified in Chapter.

2. **Quantified decentralization–latency and revenue trade-offs.** The latency cost of decentralization is measured directly: CCRMS incurs a 67,000× overhead relative to a centralized baseline. The creator-revenue advantage is real but conditional: CCRMS produces higher mean revenue only for creators with approximately 2,000 followers or more, the point at which algorithmic discovery no longer compensates for higher platform fees.

3. **A cross-chain rights artifact demonstrating XCM sufficiency.** The CCRMS parachain — comprising two FRAME pallets, an ink! 6 wrapper contract, an EVM precompile, and benchmark and simulation scripts — demonstrates that XCM v3 with payer–beneficiary decoupling is sufficient for authenticated cross-chain rights operations without custom protocol extensions. The artifact is released under the MIT license.

4. **A DSR worked example for multi-component blockchain prototypes.** Applying design science research to a system spanning FRAME pallets, smart contracts, XCM, and Monte Carlo simulation is rarely illustrated in the existing DSR literature; this dissertation serves as a reference template for future researchers.

## Scope and Limitations

This dissertation is bound in several ways that the reader should be aware of before engaging with the main content chapters.

**The prototype is a back-end service, not a consumer application.** We did not develop a web or mobile interface for CCRMS. Our assessment focuses on pallet- and runtime-level behavior; we do not directly evaluate user-experience factors. We recognize this as a limitation in Chapters 6 and 8 and as an area for future research in Chapter 9.

**We take measurements on a local development network.** Our CCRMS prototype runs in a local Zombienet topology with two relay-chain validators and single-collator parachains. In production, parachains are hosted on the Polkadot or Kusama relay chains, which have hundreds of validators, real-world network latency, and competition from many other parachains. The throughput, latency, and reliability metrics in Chapter 7 should be treated as **upper bounds for the test environment**, not forecasts of real-world deployment performance.

**Our Snowbridge integration uses a local Ethereum stack.** We successfully demonstrated the bridge with two transactions, each transferring one ETH, from a local Ethereum chain to a local AssetHub parachain. However, the entire configuration remains local; no public testnet or mainnet has been used. This integration serves as a proof of architectural feasibility rather than a production validation.

**We have not commissioned any third-party audit, security review, or independent benchmarking.** A single author performed the implementation, test design, measurements, and interpretation for this dissertation. Deployment to production would require third-party validation before any substantive value is processed.

**We did not fully achieve two of the six research objectives.** RO5 (zero-knowledge proof hooks for selective regulatory disclosure) was not undertaken because its implementation complexity substantially exceeded the original Phase 2 estimate. RO2 (off-chain indexing) was partially implemented: the pallet emits sufficient events for on-chain queries, but no separate indexer was deployed. Both omissions are documented in Section 3.3 and revisited as future work in Chapter 9.

---

# Background and Related Work

This chapter sets the academic and commercial context for the Cross-Chain Content Rights Management Service (CCRMS). It synthesizes a broad range of scholarly and industry publications into a coherent narrative organized around four primary themes: blockchain-based content management (Section 2.1), cross-chain interoperability (Section 2.2), decentralized monetization models (Section 2.3), and the challenges and gaps that motivate our research (Section 2.4).

## Blockchain-Based Content Management

### Market Context

Three independent market research firms [marketsandMarkets2025; mordorIntelligence2026; grandViewResearch2025] converge on estimates that the global DRM market is valued at approximately USD 6.7–6.9 billion in 2025–2026, with projections reaching USD 11–14 billion by 2030–2033, representing a Compound Annual Growth Rate (CAGR) of 10–11%. This growth is primarily driven by streaming services, AI-enabled piracy, and regulatory pressures. The market is dominated by **content protection** solutions (such as Widevine, FairPlay, PlayReady), rather than **content monetization**.

### Foundational Work on Blockchain-Based DRM

Blockchain-based Digital Rights Management (DRM) is an active research domain. [garbaEtAl2021] incorporate digital watermarking into blockchain technology as a tamper-evident layer; [patilEtAl2022] build on this by introducing the DRMChain hybrid encryption architecture; and [yiEtAl2023] further extend the protection model with a redactable blockchain scheme that combines DRM with perceptual hashing, enabling selective content modification without invalidating ownership proofs. Both earlier studies prioritize protection mechanisms over the economics of content creators.

In the music industry, [cirelloEtAl2023] derive a set of design principles for blockchain-based DRM systems through expert interviews and prototype testing, identifying transparency of rights ownership, automated royalty distribution, and programmable licensing as the three foundational requirements. [cherdakovEtAl2023] and [mendozaTelloEtAl2024] propose Web3 implementations that embed these principles in music-streaming smart contracts, demonstrating the feasibility of on-chain licensing but stopping short of cross-chain portability.

The most operationally comprehensive recent work is [madapatiPradhan2025], whose Ethereum + IPFS + perceptual hashing framework achieves 409 TPS for registration and 484 TPS for verification, both higher than CCRMS. However, this is misleading because their pipeline hashes off-chain and stores only the results on-chain. [wangEtAl2025] present a BLS threshold signature scheme for intellectual property transactions that achieves 40 ms aggregation. Two Polkadot-specific studies [xieLiu2022; xieTang2024a] propose conceptual cross-chain copyright frameworks without working prototypes.

The collective contribution of this literature is that **blockchain-based DRM is a legitimate research domain with growing operational maturity**; its limitation is that nearly all work emphasizes protection rather than monetization. CCRMS explicitly reverses this priority.

### NFTs and Intellectual Property Rights

Work on NFTs in the context of intellectual property encompasses both legal analysis [uspto2024; davik2025; murray2022; eurojust2024] and proposals for standardization [reggianini2025; gattoEtAl2021; dreyerEtAl2021]. The most empirically significant study is [darshanEtAl2025], whose findings strongly support our research: **80% of mainstream NFTs fail to transfer copyright to purchasers, only 12–30% of marketplace listings include licensing information, and 50–60% of secondary sales bypass creator royalties**. [lahiriEtAl2026] provide an independent meta-analysis of 125 NFT studies, confirming these findings and concluding that legal clarity around NFT ownership transfers remains the field's primary unsolved problem. The existing NFT infrastructure is theoretically capable of effective rights management but is inadequate in practice. [cabotNadalEtAl2022] address a specific gap in the ERC-721 standard, proposing an extension that enables token recipients to reject unwanted transfers — a property relevant to our permanent-ownership mode, where rights revocation must be cryptographically blocked.

The most significant industry development is the February 2025 launch of **Story Protocol**, the first dedicated intellectual-property Layer-1 blockchain [storyFoundation2025]. Built on the Cosmos SDK with EVM compatibility and backed by USD 140 million in total funding (including a USD 80 million a16z-led Series B), it enables programmable IP registration, automated licensing, and on-chain royalty distribution. Story Protocol is the most direct industry comparator to CCRMS, validating the market premise and providing a useful architectural contrast: single-chain L1 versus cross-chain parachain.

## Cross-Chain Interoperability

### Polkadot Architecture

Polkadot [wood2016] is a heterogeneous multi-chain framework in which parachains share security through a central relay chain and communicate via XCM. The core primitives are parachains, the relay chain, validators, collators, and XCM. [habermeierEtAl2021] and [wood2022] provide the primary technical documentation for the XCM message format and multi-hop features that underpin our cross-chain implementation. The XCM protocol itself has received dedicated academic attention: [morhacEtAl2023a] build ParaSpell, a developer SDK that abstracts XCM message construction across parachains, and [morhacEtAl2023b] demonstrate XCMP interoperability at the protocol level. Together with [morhacEtAl2025], which proposes the Unispell universal adapter, they form the most coherent body of peer-reviewed academic work on XCM in practice.

### Cross-Chain Technology Surveys

The cross-chain literature matured rapidly from 2022 to 2025. [renEtAl2023] provide a comprehensive taxonomy in IEEE Transactions on Knowledge and Data Engineering, classifying interoperability solutions into five categories: sidechains, notary schemes, hashed time lock contracts, relays, and blockchain-agnostic protocols. [maoEtAl2022] covered the same terrain earlier with a three-category classification; [bigiottiEtAl2025] extend both frameworks in ACM Computing Surveys, with particular attention to protocol-agnostic designs. Two more recent surveys significantly expand the field: **[dengEtAl2025]** systematically analyze more than 150 sources covering atomic swaps, sidechains, light clients, and relay chains; **[liEtAl2025a]** distinguish between **asset interoperability** (the transfer of tokens across chains) and **data interoperability** (the verification of cross-chain state). Li's distinction is particularly relevant to our research, which addresses both aspects through XCM payments and the `pallet-rights-verifier` Merkle proof mechanism. [kumarVEtAl2025] and [caoEtAl2025] examine cross-chain efficiency and trustless interoperability, respectively, both aligned with CCRMS's design intent. [sevim2024] provides comparative metrics across LayerZero, Wormhole, Chainlink, Circle, Polkadot, and Cosmos; [valastinEtAl2024] introduce LiquiSpell for cross-parachain liquidity, and their observation of parachain heterogeneity informs our cross-chain operational pattern.

### Bridges and Snowbridge

The academic literature on bridge architectures includes [yinEtAl2022] on Bool Network (multi-party computation over hidden committees), [chenKEtAl2023] on reputation-based trust management, and [maricEtAl2025] on formal verification of fail-safe bridges using Isabelle/HOL. Maric et al.'s work sets a methodological precedent for future formal analyses of CCRMS.

The most operationally significant development in blockchain infrastructure is **Snowbridge**, a trust-minimized bridge enabling interoperability between Polkadot and Ethereum. Snowbridge V2 was officially launched on the Polkadot mainnet on November 7, 2025, and includes support for arbitrary Ethereum contract calls from Polkadot, a 50% fee reduction, and unordered message execution [snowfork2025a]. The associated Polkassembly proposal [snowfork2025b] documents more than a year of operational stability with no on-chain downtime. We position our Snowbridge integration as forward-compatible with V2, even though we developed the initial prototype against V1.

### Polkadot 2.0 and JAM

Two major ecosystem developments shaped our implementation timeline. **Polkadot 2.0** was comprehensively launched by October 2025, introducing Async Backing (eliminating relay-chain wait), Agile Coretime (on-demand block production), Elastic Scaling (multiple cores per parachain), and XCM v5 (multi-hop transactions) [parityUpgrade2025; polkadotNetwork2025]. Parachains using the full feature set achieve approximately 2-second block latency with three cores, with an anticipated reduction to 500 milliseconds at twelve cores. **JAM** (Join-Accumulate Machine, [wood2024]) is expected to succeed the relay-chain model within the Polkadot ecosystem, with its testnet launched in January 2026 and mainnet scheduled for mid-to-late 2026. These developments collectively demonstrate that the Polkadot architecture is **maturing rather than stagnating**, creating a positive environment for ongoing research within the ecosystem.

### Cross-Chain Copyright Management as a Research Target

Numerous studies examine cross-chain copyright management as a research issue [xieLiu2022; xieTang2024a; munsonEtAl2022; mareckova2024; oreroEtAl2023; buzu2021]; however, none have developed a functional end-to-end prototype comparable to the CCRMS platform.

## Decentralized Monetization Models

### Creator Economy Context

[communipass2026] forecasts that the creator economy will exceed USD 280 billion by the end of 2026. The blockchain-specific segment is relatively small but growing rapidly: [iresearch3602025] predicts it will be worth USD 499.52 million in 2024 and reach USD 2.74 billion by 2030, a CAGR of 32.78%. The primary drivers of this growth include creator dissatisfaction with centralized platforms, demand for cross-platform interoperability, and increasingly mature blockchain infrastructure.

### DeFi and Web3 Foundations

The conceptual foundation for decentralized monetization lies in DeFi. [gogelEtAl2021] present the canonical Wharton overview of the DeFi ecosystem, covering AMMs, lending, derivatives, and stablecoins; [atzori2017] analyzes decentralized governance through a political economy lens; and [busch2022] provides a technical overview of Web3 from the United States Congressional Research Service.

### Subscription, Pay-Per-View, and Purchase Models

Earlier work on blockchain subscription and pay-per-view models includes [munson2019; khan2024; castweet2019; steem2025; banerjeeEtAl2020]. Most of these works examine blockchain incentives without addressing the micropayment problem. Two more recent works are particularly relevant: **[osemwegie2025]** surveys decentralized media monetization (identifying the problems CCRMS targets but not proposing a working system), and **[shah2025]** proposes a smart-contract framework for royalty distribution that is the closest to our royalty propagation design in the existing literature. CCRMS extends Shah's approach by embedding royalty distribution as a feature within a broader unified rights token, using a FRAME pallet with stronger atomicity guarantees than a Solidity contract. [wamugo2024] provides empirical data on NFT adoption by media organizations in Kenya, demonstrating that blockchain monetization is under active consideration in emerging markets.

### Pay-Per-View and the Micropayment Problem

Pay-per-view models have historically struggled on blockchain platforms because gas fees have often exceeded content costs. [goyalEtAl2019] introduce Gringotts, a secure micropayment system, but do not address the core fee issue. [chegenizadehEtAl2024] directly address the micropayment verification layer, proposing a multi-agent, privacy-preserving approach for resource-constrained offline devices that reduces per-transaction overhead through smart-contract batching; their work supports our strategic decision to model PPV as a counter rather than a sequence of individual on-chain transactions. A notable industry advancement is the **Coinbase x402 protocol** [coinbaseX402_2025] (May 2025), which embeds payment logic directly in HTTP responses, enabling stablecoin settlement in two seconds.

### Smart Contracts as the Implementation Layer

Surveys of the smart contract literature [ante2020; linEtAl2022; singhEtAl2024a; quanEtAl2024] establish the field as mature. Parity Technologies' ink! blog posts [parityTechnologiesInk3_2022; parityTechnologiesInk_2022] served as the primary technical references during our implementation, when ink! was the recommended smart contract language for Polkadot parachains. The most consequential development in this field is the **discontinuation of ink! development in January 2026** [inkAlliance2026], which we discuss as a literature gap (G8 in Table 2.1) and as an architectural episode in Appendix A.9.

### Royalty Automation

Most royalty automation literature appears in industry blog posts rather than in peer-reviewed journals; [shah2025] and [reggianini2025] are the primary academic exceptions and are discussed in Section 2.3.3.

## Challenges and Gaps

We synthesize the literature above into eight gaps that CCRMS addresses. Table 2.1 summarizes each gap and our corresponding contribution.

**Table 2.1: Literature Gaps and CCRMS Contributions**

| ID | Gap | Supporting literature | CCRMS contribution |
| --- | --- | --- | --- |
| G1 | Existing systems are protection-focused, not monetization-focused | [garbaEtAl2021]; [patilEtAl2022]; [cirelloEtAl2023]; [madapatiPradhan2025]; commercial DRM (Widevine, FairPlay, PlayReady) | Unified rights token with monetization as the primary design goal; protection becomes a secondary consequence of correct rights management. |
| G2 | No native cross-chain recurring payments | Existing cross-chain protocols (XCM, Wormhole, LayerZero, Snowbridge) address one-time transfers; [xieLiu2022; xieTang2024a] propose theoretical frameworks without recurring payments | On-chain `on_initialize` block hook scheduler for automatic renewal. XCM v5 `Schedule` is not yet production-ready; we defer the implementation of true cross-chain scheduling to future work. |
| G3 | Cross-chain protocols strip rights metadata on transfer | [reggianini2025] addresses part of the standardization problem within European NFT licensing | `query_rights_metadata` extrinsic emitting a self-describing `RightsMetadata` event; metadata canonical on CCRMS, authenticated by `pallet-rights-verifier` Merkle proofs. |
| G4 | Pay-per-view is economically unviable at micro-transaction scale on traditional blockchains | [goyalEtAl2019]; [chegenizadehEtAl2024]; [khan2024]; x402 [coinbaseX402_2025] | PPV reconceptualized as a counter: one payment per pack, cheap storage updates per view, with additive purchases (Appendix). |
| G5 | The decentralization–latency trade-off is poorly characterized quantitatively | Most works endorse decentralization qualitatively or measure only centralized performance; [madapatiPradhan2025] is an exception but uses an off-chain pipeline; [raoEtAl2024] provide a scalability review but no cross-paradigm comparison | Direct comparative benchmark against an Express.js + SQLite baseline (Section) plus HHI calculation (Section) make the trade-off numerical. |
| G6 | Regulatory uncertainty for tokenized rights (EU AI Act Aug 2025; MiCA full enforcement Jul 2026; EP report A10-0019/2026) | [esma2025]; [guadamuz2025] | Cryptographic provenance, immutable records, and automated royalty distribution align with emerging compliance infrastructure. MiCA classification of subscription tokens remains an open legal question. |
| G7 | No existing system provides first-class native support for subscription, pay-per-view, and permanent ownership as three access modes of a **single unified rights primitive**. Story Protocol's Programmable IP License (PIL) can be configured to approximate these models, but it requires separate PIL configurations and license-token types for each, and it does not natively support time-bounded subscription renewal. | Patreon (subscription only); OpenSea (ownership only); pay-per-view absent from most blockchain systems; Story Protocol (flexible licensing primitive, not unified rights); [shah2025] addresses royalty automation as a single feature | Unified rights token treats the three models as **native access modes** of a single content registration, not as configurations of a generic licensing primitive. A single FRAME pallet storage entry (`Content<T>`) encodes subscription terms, PPV quota, and ownership state simultaneously; a single integrated access check enforces all three; renewal and expiry are first-class state transitions, not contract-layer constructs. This is the dissertation's central conceptual contribution. |
| G8 | ink! discontinuation (January 2026) leaves Polkadot without a viable institutionally supported smart contract language; alternatives (`revive`, raw `pallet-revive`, `wrevive`) each carry trade-offs | Appendix A.9| Pallet-first architecture demonstrates that substantial functionality can be delivered without a smart contract language. The gap remains for systems whose business logic is better expressed in contracts. |

We fully address gaps G1 and G7; we address G6 and G8 only partially because they depend on factors outside the prototype's control. The collective contribution is that a single working prototype demonstrates feasibility for a category of systems that the literature has addressed only partially.

## Summary

We reviewed 100 academic and industry sources on blockchain-based content management, cross-chain interoperability, and decentralized monetization. The foundational primitives are in place; the market for decentralized content monetization is real and expanding rapidly; and existing methodologies address the issue only partially. CCRMS bridges the eight identified gaps by deploying a unified rights token on a Polkadot parachain.

Table 2.1 maps the eight identified gaps to CCRMS contributions; the remaining chapters address them as follows. G1 (protection vs. monetization) and G7 (no unified rights primitive) are the dissertation's primary targets: Chapter 4 presents the unified rights token design; Chapter 5 details the `pallet-content-rights` implementation; and Chapters 6–7 measure its performance and economic outcomes. G4 (PPV viability) is addressed through the PPV counter model (Chapter 4); G5 (the decentralization–latency trade-off) is addressed through the comparative benchmark and HHI calculation (Chapter 7). G2 (cross-chain recurring payments) is partially addressed via the `on_initialize` block hook; true cross-chain scheduling remains future work (Chapter 9). G3 (metadata stripped on transfer) is addressed by the `pallet-rights-verifier` Merkle proof mechanism (Chapter 5). G6 (regulatory uncertainty) and G8 (ink! discontinuation) are discussed as implications in Chapter 8.

---

# Research Questions and Objectives

This chapter presents the research questions and objectives that underpin our study. We formulated them in Phase 1 and refined them in Phase 2 following the gap analysis in Chapter 2.

## Primary Research Question

The primary research question of our work is:

> **How can a shared-security, multi-chain framework built on Polkadot's Cross-Consensus Messaging (XCM) and FRAME pallet primitives deliver a unified rights token that natively supports recurring subscriptions, pay-per-view micro-transactions, and permanent ownership transfers across heterogeneous blockchain networks, and what levels of transaction finality, cost efficiency, and creator revenue retention can such a system achieve?**

The question has two components: **design feasibility** (whether such a system can be built using the available Polkadot SDK primitives) and **measurement** (what operational properties it exhibits once built). We treat them as mutually constraining; a design that is feasible to build yet performs poorly is not viable, nor is one that performs well in benchmarks but cannot be implemented in practice. The primary concern is framed as an **achievability** question rather than a hypothesis test, consistent with the measurement-focused evaluation philosophy established in Section 4.1.4.

## Sub-Questions

We decompose the primary research question into five sub-questions. Table 3.1 presents each sub-question, its motivation, and the literature gaps it addresses.

**Table 3.1: Research Sub-Questions**

| ID | Question | Gaps | Motivation |
| --- | --- | --- | --- |
| SQ1 | To what extent can XCM carry recurring subscription renewal messages and rich rights metadata across Polkadot parachains and external networks, and what atomic success rates and cross-chain finality times are achievable? | G2, G3 | Existing cross-chain protocols lack native recurring payments and strip rights metadata. SQ1 asks whether existing XCM primitives suffice or whether custom extensions are needed. |
| SQ2 | What design patterns can minimize access verification latency while maintaining decentralization, and how do the resulting metrics compare across varying validator configurations? | G5 | The decentralization-latency trade-off is poorly characterized quantitatively. SQ2 asks for a direct measurement on a working Polkadot parachain with explicit numerical comparisons against centralized alternatives. |
| SQ3 | Can a single on-chain rights object simultaneously enforce subscription auto-renewal, pay-per-view consumption limits, and permanent ownership with automated royalty distribution across chains, and what are the resulting creator cost savings? | G7 | No existing system offers all three monetization models as first-class access modes of a single unified primitive. Story Protocol's PIL can be configured to approximate them but requires separate license-token types and does not natively model subscription renewal. SQ3 asks whether a unified primitive can be built and whether its economics justify the effort. |
| SQ4 | What authorization model is appropriate for cross-chain rights operations that decouple the payer from the beneficiary, and how does it perform under adversarial conditions? | (added Phase 5) | Added in response to Finding B from the security audit. Cross-chain extrinsics, which decouple payer from beneficiary, pose unique authorization concerns absent from local-only extrinsics. |
| SQ5 | Under realistic creator audience distributions, does the CCRMS model produce demonstrably better creator outcomes than centralized, bridge-based, or marketplace alternatives, and under what conditions? | (added Phase 5) | Added during the Monte Carlo simulation. SQ5 clarifies that the economic question is conditional ("yes, for creators with these characteristics") rather than a simple yes-or-no. |

## Research Objectives

We pursue the five sub-questions through six research objectives. Table 3.2 summarizes each; Appendix B provides the full statements, deliverables, and revision notes.

**Table 3.2: Research Objectives Summary**

| Objective | Focus | Sub-questions |
| --- | --- | --- |
| RO1 | Design and prototype XCM extensions for recurring and metadata-rich rights transfers | SQ1, SQ2 |
| RO2 | Implement a unified rights token (originally ink!, revised to FRAME pallet) with access-verification latency measurement | SQ2, SQ3 |
| RO3 | Merge subscription, PPV, and purchase logic into one composable rights pallet | SQ3, SQ4 |
| RO4 | Benchmark scalability, interoperability, and economic efficiency against centralized and bridge-based alternatives | SQ2, SQ5 |
| RO5 | Incorporate optional zero-knowledge proof hooks for selective regulatory disclosure (restated as future work in Section ) | Broader feasibility |
| RO6 | Quantify creator savings via Monte Carlo simulation and comparative cost analysis | SQ5 |

## Mapping Questions to Objectives, Methods, and Chapters

Table 3.3 maps each sub-question to its research objectives, evaluation methods, and the sections where results are reported.

**Table 3.3: Mapping of Sub-Questions to Objectives, Methods, and Chapters**

| Sub-Question | Primary Objective | Supporting Objective(s) | Primary Method | Reported In |
| --- | --- | --- | --- | --- |
| SQ1 (XCM rights operations) | RO1 | RO3 | XCM latency benchmark; end-to-end XCM test | Section 5.2; Section 7.1.2; Section 7.1.6|
| SQ2 (Latency vs decentralization) | RO2, RO4 | -- | Throughput and latency benchmark; HHI calculation | Section 7.1.2; Section 7.3.3|
| SQ3 (Unified rights token) | RO3 | RO2, RO6 | Unit tests; royalty propagation tests; Monte Carlo simulation | Section 5.1; Section 7.2|
| SQ4 (Security and authorization) | (added Phase 5) | RO3 | Security audit; authorization unit tests | Section 5.3; Section 7.3.1|
| SQ5 (Economic viability) | RO6 | RO4 | Monte Carlo simulation; comparative benchmark | Section 7.2; Section 7.1.7|

Two cells in the table require acknowledgment. The "Primary Objective" for SQ4 is marked "(added Phase 5)" because a sub-question was added after the original objectives were finalized. There is no direct Phase 2 link; however, RO3 (unified rights pallet) provided context for the security finding. RO5 (zero-knowledge proof hooks) is not in the table because it was not implemented. It is kept in Section (RO5) as an unachieved future objective and reiterated in Chapter 9.

## Summary

The five sub-questions and six research objectives are grounded in the gaps identified in Chapter 2 and mapped to evaluation methods and reporting chapters in Table 3.1. SQ4 (security) and SQ5 (economic viability) were added in Phase 5, consistent with the DSR principle that the search process itself may modify the initial framing.

---

# Methodology and System Design

This chapter outlines the research methodology we used to develop CCRMS and the resulting system design. Section 4.1 presents the methodology, including design science framing, iterative prototyping, data collection, and evaluation philosophy. Section 4.2 describes the system design at the conceptual level; Chapter 5 covers implementation details.

## Research Methodology

### Design Science Research Framing

CCRMS is fundamentally a systems-building project with a primary artifact: a working software prototype. The most appropriate methodological framework is therefore **design science research (DSR)**, as defined by [hevnerEtAl2004]. Our dissertation aligns with Hevner's seven DSR guidelines as follows: (1) *design as an artifact:* the CCRMS parachain and seven implementation specifications; (2) *problem relevance:* the commercial and academic gaps identified in Chapter 2; (3) *design evaluation:* eleven KPIs covered in Chapters 6–7; (4) *research contributions:* the artifact, the design knowledge captured in the specifications, and the empirical measurements; (5) *research rigor:* established Polkadot SDK primitives, standard Rust testing, and peer-reviewed Monte Carlo methodology; (6) *design as a search process:* nine significant pivots documented in Section 5.3; (7) *communication of research:* this dissertation and an open-source code release.

DSR is particularly appropriate here because it treats both the artifact and the design knowledge it produces as coequal contributions.

### Iterative Prototyping

Within the DSR framework, the development process follows an **iterative prototyping** model (build, test, measure, refine). We chose iteration deliberately: the Polkadot SDK monorepo releases stable versions approximately quarterly, making a waterfall approach prone to conclusions based on an outdated toolchain. The architectural intricacies of a cross-chain system mean that certain design decisions can be thoroughly assessed only once the system is operational. In practice, this iterative methodology led to nine substantial architectural pivots during Phase 4, documented as challenges in Section 5.3. We executed the work across six four-week phases (Appendix F); references to "Phase N" throughout the dissertation denote work produced in that phase.

### Data Collection Methods

Our evaluation uses a mixed-methods approach: quantitative measurements include unit tests, throughput and latency benchmarks, storage growth, cross-chain XCM latency, reliability tests, a centralized comparative benchmark, and a Monte Carlo simulation of creator revenue. Qualitative inputs are drawn from a literature synthesis. Chapter 6 describes each method. All quantitative outputs are systematically stored as machine-readable JSON files in the `scripts/perf/results/` directory to ensure reproducibility.

### Evaluation Philosophy: Measurement-Focused, Not Target-Driven

We adopt a **measurement-focused philosophy**: the goal is to document and analyze the system's performance, efficiency, security, and economic viability rather than to verify that it meets predetermined targets. This measurement-centric approach preserves academic rigor regardless of whether specific results meet hypothetical benchmarks, treats unexpected results as valuable rather than embarrassing, encourages truthful reporting, and establishes a baseline for future researchers.

Each of the eleven KPIs in Section 6.5 has a target derived from the Phase 2 methodology, but we treat those targets as reference points rather than pass/fail criteria. In practice, all eleven met their targets; the methodology would have remained valid even if some had not.

### Methodology Pivots

We revised the methodology established in Phase 4. The original plan called for Kusama via the Canary Chaos program, implementing RMRK 2.0 composable NFTs, scheduling XCM for automatic renewal, and conducting a Monte Carlo simulation, which had not yet been executed. The actual implementation modified this approach by substituting Kusama with local Zombienet to enable faster iteration, replacing RMRK 2.0 with `pallet-nfts` (noting that the RMRK pallets are frozen on SDK version 0.9.36), replacing the scheduled XCM with an `on_initialize` block hook (since the XCM v5 `Schedule` instruction is not yet production-ready), and completing the Monte Carlo simulation in Phase 5.

The most significant methodological pivot is unrelated to the original plan: the **emphasis on architectural decisions and pivots as first-class research outcomes**. The Phase 2 methodology treated implementation merely as a means to generate measurements; however, in practice, the architectural decisions made during the pivots proved to be equally valuable as the measurements themselves.

## System Design

This section outlines the conceptual design. Section 5.1 provides the implementation details.

### The Unified Rights Token Concept

This subsection addresses SQ3: it demonstrates that subscription, pay-per-view, and permanent ownership can serve as first-class access modes for a single on-chain record, rather than as separate platform categories.

The principal intellectual contribution of CCRMS is the **unified rights token**: a single on-chain asset that can represent three distinct modes of content access (an active subscription, a remaining pay-per-view balance, or permanent ownership) for a single piece of content from a single creator, all governed by a single set of rules.

The unified token addresses the gap identified as G7 in Section 2.4. Current blockchain platforms force creators and consumers to choose among monetization models: subscription platforms cannot represent per-view or ownership rights, NFT marketplaces cannot enable recurring access, and pay-per-view systems rarely work effectively on-chain. The unified token treats the three models as **access modes** of a single underlying content registration, rather than as separate platforms. A creator registers content once and can offer it through all three modes concurrently; a consumer chooses the mode that best suits their needs; and the system enforces all three modes from a single canonical record.

### The Three Monetization Models

The academic design challenge is to encode three semantically distinct access modes—time-bounded, counter-based, and indefinite—in a single on-chain record without cross-contamination of state across modes. The literature identifies subscription, pay-per-view, and permanent ownership as the canonical creator-economy requirements [cirelloEtAl2023; mendozaTelloEtAl2024], but addresses each in isolation; CCRMS treats their unification into a single primitive as the central design problem.

The architecture supports three models, each motivated by a different gap in the existing landscape:

- **Subscription:** time-limited access valid for a configurable number of blocks per content item, with optional automatic renewal triggered by an on-chain block hook.
- **Pay-per-view (PPV):** prepaid access to a specified number of views of a content item is available. Each `consume_view` operation decrements the counter; additional purchases increase the count rather than overwrite it. Conceptualizing PPV as a counter rather than a sequence of individual view transactions avoids the micro-transaction problem that has historically impeded on-chain PPV models [chegenizadehEtAl2024].
- **Permanent ownership:** unrestricted and transferable access. Ownership is prioritized during access verification. Transfers follow a mint-burn-mint pattern rather than a direct NFT transfer, preserving provenance and attribution consistency.

A single content item can offer all three models concurrently, each with independently configured pricing. The `check_access` function resolves rights in priority order (Ownership > Subscription > PPV).

*[Figure 4.1: The three monetization models natively supported by the unified rights token (addresses SQ3). A single content registration may offer all three models concurrently; `check_access` resolves in priority order: Ownership > Subscription > PPV.]*

### NFT-Based Rights Tokenization

NFT-based tokenization provides the technical foundation for SQ3: standard `pallet-nfts` primitives can encode RMRK 2.0 composability semantics for a unified token, without relying on unmaintained pallets.

CCRMS encodes content rights as non-fungible tokens using a parent–child nesting model built on `pallet-nfts`. The decision to use NFTs rather than a bespoke storage configuration was motivated by their widespread acceptance as a standard, compatibility with existing digital wallets, independent transferability (which facilitates a secondary market for ownership rights), and the clear separation of the content item's identity (the parent) from user-specific rights derived from it (the children). The mint-burn-mint transfer pattern for the permanent ownership mode aligns with the approach proposed by [dondjioKazamias2024], who demonstrate that re-minting on transfer preserves on-chain provenance without the ambiguity of direct NFT reassignment.

The conceptual model: each content registration is an NFT collection comprising one parent Content NFT and zero or more child rights NFTs, each tagged with a `rights_type` attribute (Subscription, PPV, or Ownership) and owned by the respective user. The parent–child structure serves three purposes: establishing identity, tokenizing individual rights, and enabling on-chain auditability of the rights-to-content relationship.

The nesting pattern is inspired by RMRK 2.0, the composable NFT specification for Polkadot; however, it is implemented directly on top of `pallet-nfts` rather than relying on the `rmrk-substrate` pallets, which are locked to SDK 0.9.36. Appendix A.1 details this transition. The outcome shows that RMRK-style composability can be achieved using only standard FRAME primitives.

*[Figure 4.2: Parent–child NFT nesting model. Each content registration creates an NFT collection containing a parent Content NFT (the canonical on-chain identity of the content) and zero or more child rights NFTs, each owned by an individual user and tagged with the user's access mode.]*

One significant constraint is that the `Children` storage entry is a `BoundedVec<_, ConstU32<50>>`, limiting child NFTs to fifty per parent. This restriction is necessary for FRAME benchmarking because the worst-case weight must be calculable in advance. The examination of this constraint is detailed in Appendix A.8, and mitigation is treated as future work in Section 9.1.

### Cross-Chain Communication Model

This model addresses SQ1 (XCM rights operations across chains) and SQ4 (payer–beneficiary authorization): the two properties that make cross-chain rights management nontrivial are the decoupling of payment from rights receipt and the trustless verification of the remote rights state.

Cross-chain operation is the mechanism by which the unified rights token model enables portable digital ownership: a user who acquires rights on one blockchain should be able to use them on another without losing access or repurchasing. The model has two conceptual properties.

**Payer–beneficiary decoupling.** Each cross-chain rights operation distinguishes between the funding account and the rights recipient account. In a local call, the payer and the beneficiary are the same (the caller); in a cross-chain call, the dispatch origin is the sovereign account of the remote parachain, and the beneficiary is a separate user account. This configuration allows a remote parachain to acquire rights on behalf of its users without requiring those users to be present on CCRMS.

*[Figure 4.3: XCM cross-chain rights operation (addresses SQ1 and SQ4). The three-instruction sequence dispatches an `xcm_*` extrinsic on the CCRMS parachain, decoupling the paying account (the Para B sovereign account) from the rights beneficiary (the end user). The same pattern applies to all five `xcm_*` extrinsics.]*

**Trustless verification of remote rights.** A second pallet, `pallet-rights-verifier`, provides Merkle proof verification of the CCRMS rights state for other parachains. A consuming chain can verify, without relying on any oracle or relayer, that a specific account holds an active subscription by submitting a storage proof against a known CCRMS state root. This approach upholds the principle that CCRMS rights are **canonical on the CCRMS chain**: other chains authenticate cryptographically rather than maintaining replicas.

The model also extends beyond Polkadot via **Snowbridge**, a trust-minimized bridge connecting Polkadot and Ethereum. We configure the runtime to accept messages from Ethereum using the standard `LocationToAccountId` converters. At this stage, our architectural choice was to ensure **forward compatibility with Ethereum bridging without relying on it**. Section 5.2 provides a comprehensive account of the cross-chain integration.

### Pallet-First Architecture

The pallet-first decision directly shapes the answers to SQ2 (latency versus decentralization) and SQ3 (unified primitive): placing business logic in a FRAME pallet rather than in smart contracts reduces execution overhead and eliminates the chain-extension boundary that would otherwise constrain write operations.

The most significant architectural decision was to centralize the business logic within a **FRAME pallet** rather than in smart contracts. This decision was made during Phase 4 for three reasons: the operational maturity gap between FRAME pallets and `pallet-revive`; the unavailability of the chain extension mechanism, which the original contract-first approach relied on for write operations; and a pallet-first design that uses standard Polkadot wallets without EVM-style adaptation. Appendix A.2 provides detailed documentation of this decision; Appendix A.9 notes that it was unexpectedly validated by the discontinuation of ink! development in January 2026.

### Layered Architecture

The layered architecture determines the answers to SQ1 (cross-chain reach) and SQ2 (the latency–decentralization trade-off): each layer can evolve independently, so XCM protocol upgrades and relay-chain migration to JAM do not require changes to the Layer 3 business logic.

The system is organized into six distinct, independently replaceable layers: (1) the **Polkadot relay chain** provides shared security and enables HRMP message passing; (2) the **parachain runtime** composes the CCRMS FRAME pallets, configures the XCM executor, and includes a custom EVM precompile; (3) the **business logic** layer comprises `pallet-content-rights` (17 extrinsics, 10 storage items) and `pallet-rights-verifier`; (4) the **NFT layer** uses the standard `pallet-nfts`, with parent–child nesting enabled by `pallet-content-rights`; (5) the **smart contract / precompile layer** provides EVM- and ink!-compatible access through the `rights_manager` contract and the `ContentRightsPrecompile`, both of which are non-load-bearing wrappers; (6) the **cross-chain layer** manages XCM v3 messaging and the Snowbridge integration. Independence among layers is a fundamental design objective: the smart contract layer may be removed or replaced, the XCM protocol may evolve from v3 to v5, and the relay chain may transition to JAM, all without affecting the pallet code.

*[Figure 4.4: CCRMS six-layer architecture (addresses SQ1 and SQ2). Each layer is independently replaceable: Layer 5 (smart contracts) may be removed; Layer 6 (XCM) may be upgraded from v3 to v5; and Layer 1 (relay chain) may migrate to JAM, without modifying the business logic in Layer 3.]*

## Summary

This chapter framed CCRMS within the design science research paradigm and presented the six conceptual design decisions that govern implementation: the unified rights token (closing gap G7), the three monetization models, NFT-based tokenization via `pallet-nfts`, the cross-chain payer–beneficiary model, the pallet-first architecture, and the six-layer system structure. Chapter 5 covers implementation details.

---

# Implementation

This chapter describes what was built and how key decisions played out in practice. The development environment, toolchain, and workspace layout are documented in Appendix C. Section 5.1 summarizes the pallet implementation; Section 5.2 covers cross-chain integration; and Section 5.3 documents the nine challenges encountered and their resolutions.

## Pallet Implementation and Smart Contract Layer

Figure 5.1 shows the six implementation components and their relationships.

*[Figure 5.1: CCRMS implementation-level component diagram. Solid arrows indicate active extrinsic dispatch; dashed arrows indicate read-only storage access. `pallet-content-rights` is the sole authoritative state layer; the ink! contract and EVM precompile are stateless wrappers that forward calls or read storage, respectively. XCM delivers cross-chain calls via HRMP. `pallet-rights-verifier` enables remote parachains to validate rights state via Merkle storage proofs, without oracles or relayers.]*

The core of CCRMS is `pallet-content-rights`, a FRAME pallet that implements all business logic: content registration, the three monetization models (subscription, pay-per-view, and permanent ownership), on-chain royalty distribution to up to ten collaborators, automated subscription renewal via an `on_initialize` hook, and cross-chain variants of every financial operation. It exposes 17 dispatchable extrinsics, 10 storage items, and 22 event variants; the full reference tables are in Appendix C. Content rights are represented as NFT collections using a parent–child nesting model built on `pallet-nfts`: a parent Content NFT is the canonical on-chain identity for each piece of content, and each user's access rights are a child NFT tagged with a `rights_type` attribute (Subscription, PPV, or Ownership). The smart contract and precompile layers are stateless wrappers; all authoritative state resides in the pallet (Appendices A.2 and A.9).

## Cross-Chain Integration

The core challenge in cross-chain integration is enabling remote parachains to acquire and verify content rights without a shared trust anchor or custodian. Two sub-problems follow: (1) how to dispatch authenticated, fee-paying rights operations across HRMP in a single atomic message; and (2) how to extend that reach to Ethereum without custodial bridges. The key lesson from both is that the CCRMS runtime's XCM configuration and payer–beneficiary decoupling are sufficient; no custom XCM extensions were required.

### XCM Message Flows

Cross-chain operations use Polkadot XCM v3 to enable remote parachains to acquire content rights. The pallet exposes five XCM extrinsics: `xcm_subscribe`, `xcm_renew_subscription`, `xcm_purchase_views`, `xcm_purchase_ownership`, and `xcm_transfer_ownership`. Each separates the dispatch origin (**payer**) from the **beneficiary** of the rights record: when a remote parachain sends a `Transact` message, the origin is the remote parachain's sovereign account, but the rights record is issued to a distinct `beneficiary` account representing the end user on the remote chain.

The runtime's XCM configuration follows the standard Cumulus pattern, with one customization: the `LocationToAccountId` chain adds `HashedDescription<_, DescribeFamily<DescribeAllTerminal>{}>` and `GlobalConsensusParachainConvertsFor<_, _>`, enabling the runtime to interpret Ethereum locations of the form `GlobalConsensus(Ethereum)` → `AccountKey20(0x...)`. This is required for Snowbridge (Section). The full Ethereum-to-CCRMS flow is configured but has not been end-to-end tested.

Each XCM rights operation uses the three-instruction sequence `WithdrawAsset`, `BuyExecution`, and `Transact`. This is sufficient because rights operations are stateful side effects, not asset transfers (the Appendix C shows the full message structure). The allocated fee of 100 billion tokens reflects the dominance of `proof_size` over `ref_time` in the `BlockRatioFee` model; Phase 4 data place the typical fee range at 75–100 billion tokens, with lower allowances triggering `BarrierError(WeightLimitExceeded)`.

Sovereign account derivation is handled by `SiblingParachainConvertsVia` using the layout `[0x73, 0x69, 0x62, 0x6c]` `||` `u32_le(para_id)` `||` `[0x00; 24]`: ASCII `sibl` followed by the parachain ID in little-endian, zero-padded to 32 bytes. An early XCM test used `toHex()` in big-endian mode. The resulting accounts received funds but were never debited. The fix was `toHex(true)` for little-endian output; diagnosis was slow because the transfer appeared to succeed.

We measured end-to-end XCM latency at approximately 100 seconds of wall-clock time (a 3–5-block delta on the CCRMS chain) for `xcm_subscribe`, `xcm_purchase_views`, and `xcm_purchase_ownership` in the local Zombienet topology (Table 7.2). The block delta undercounts the true elapsed time: the relay-chain hop and HRMP processing pipeline add ~70 seconds of wall-clock overhead that is not reflected in the CCRMS block count. Polkadot 2.0 features (Async Backing, Agile Coretime, Elastic Scaling) would substantially reduce the latency floor in production.

A secondary pallet, `pallet-rights-verifier`, provides trustless verification of CCRMS rights status for other parachains via Merkle storage proofs. A remote parachain can verify an active subscription without oracles or relayers by submitting a proof against a known CCRMS state root, which the verifier replays against the Substrate trie. Three extrinsics (`verify_ownership`, `verify_subscription`, `verify_view_pack`) construct a storage key, validate the proof, and emit a result event. Proof validation costs roughly 100 million `ref_time` per call and avoids any network round-trip.

### Snowbridge Integration with Ethereum

We extended the cross-chain architecture to Ethereum via Snowbridge, a trust-minimized bridge that uses light-client verification on both sides, eliminating custodians and relayer trust. During Phase 4, we bridged two 1-ETH transactions from a local Ethereum chain to a local AssetHub parachain using the Snowbridge pipeline, demonstrating that the CCRMS runtime can accept bridged Ethereum messages with the same XCM configuration as sibling-parachain messages (via `HashedDescription` and `GlobalConsensusParachainConvertsFor` in `LocationToAccountId`).

The topology spans four parachains and a local Ethereum network: CCRMS (parachain 100); Bridge Hub (parachain 1013), which hosts the inbound queue and the Ethereum beacon light client; AssetHub (parachain 1000), which holds the foreign-asset reserve; and the Rococo relay chain. Four HRMP channels link Bridge Hub ↔ AssetHub and AssetHub ↔ CCRMS, carrying bridge messages and enabling future Polkadot–Ethereum interoperability.

The Ethereum side runs Geth v1.17.1 (chain ID 11155111) as the execution layer, Lodestar v1.35.0 as the beacon node, and the 16-contract Snowbridge Gateway suite deployed via Forge. After initializing the beacon light client, two relayer processes run: a beacon relay that forwards Lodestar finality events to the `EthereumBeaconClient` pallet, and an execution relay that forwards Gateway events from Geth to the `EthereumInboundQueue` pallet.

The integration revealed three persistent issues, documented in Appendix A: a Lodestar version-pinning requirement that forces source compilation; a configuration bug in the fork version that produced invalid Merkle proofs; and a beacon state cache timing issue that required reordering the setup sequence.

The final step, using bridged Ether on AssetHub to pay for a CCRMS rights operation, is conceptually straightforward but was not implemented in the prototype. The CCRMS XCM side is already prepared; the remaining task is to configure `pallet-content-rights::PaymentCurrency` to accept both foreign Ether and the native token. This is listed as future work in Chapter 9.

## Challenges and Solutions

The CCRMS implementation encountered nine technical issues that shaped the final architecture and security posture. Table 5.1 summarizes each issue, our response, and the key lesson; Appendix A provides full details.

**Table 5.1: Implementation Challenges Summary**

| # | Challenge | Response | Key Lesson |
| --- | --- | --- | --- |
| A.1 | RMRK 2.0 pallets frozen on SDK 0.9.36, incompatible with current monorepo | Replicated RMRK nesting semantics on `pallet-nfts` directly | Standards reimplementation is preferable when reference implementation is unmaintained |
| A.2 | Contract-first design blocked: chain extensions non-functional for writes, debugging complexity | Inverted to pallet-first; retained ink! contract as thin wrapper | Pallet-first proved resilient to ink! discontinuation (A.9) |
| A.3 | Snowbridge beacon relay generated proofs at wrong gindex (54 vs. 86) | `forkVersions` field means activation epoch, not version hex; changed to `{"deneb": 0, "electra": 0}` | Cryptographic systems fail silently on configuration errors |
| A.4 | Lodestar v1.41.0 ignored `LODESTAR_PRESET=mainnet` in dev mode (32 vs. 512 validators) | Pinned Lodestar v1.35.0, built from source | Light clients impose strict counterpart requirements; bridge toolchain compatibility is fragile |
| A.5 | XCM tests: funds debited on source chain but `InsufficientPayment` on CCRMS | polkadot.js `toHex()` used big-endian; CCRMS expects little-endian; fixed with `toHex(true)` | Endianness bugs produce valid-looking but wrong addresses |
| A.6 | XCM `BuyExecution` failed at 1B tokens; required ~75–100B | `proof_size` dominates `BlockRatioFee`, not `ref_time` | Polkadot fee modeling is driven by proof size, not computation |
| A.7 | `xcm_transfer_ownership` had no check that caller == `from` (Medium severity) | Added `ensure!(authorizer == from)`; unit test confirms block | Cross-chain extrinsics accepting identity parameters need explicit authorization |
| A.8 | `MaxChildrenReached` at 50 subscribers per content item | Documented as known limitation; benchmark scripts rotate content items | Bounded FRAME collections trade benchmarkability for capacity limits |
| A.9 | ink! development discontinued Jan 2026 | 95% of logic in pallet; contract layer is non-load-bearing; migration deferred | Minimize dependency on non-essential components for ecosystem resilience |

## Summary

Cross-chain rights operations are delivered via XCM v3 with payer–beneficiary decoupling, and the Snowbridge integration demonstrates forward compatibility with Ethereum bridging. Nine challenges shaped the final architecture; the two most consequential—the RMRK-to-`pallet-nfts` pivot and the contract-first-to-pallet-first pivot—are examined in greater detail in Chapter 8. Full implementation details are provided in Appendix C.

---

# Evaluation and Testing

This chapter outlines the evaluation methodology used to assess CCRMS against the research questions in Chapter 3. It focuses on **how** the system was evaluated; the results are presented in Chapter 7. This chapter covers the evaluation approach, the four-layer testing architecture, the eight test scenarios, the 11 KPIs, the testing infrastructure, and the validity considerations that inform our interpretation of the findings.

## Evaluation Approach

Our evaluation methodology spans unit testing, integration testing, performance benchmarking, security assessment, comparative analysis against a centralized baseline, and Monte Carlo simulation, covering the technical, economic, and security domains of the research questions. Table 6.1 maps each evaluation activity to the specific research sub-questions it addresses.

**Table 6.1: Mapping of Evaluation Activities to Research Sub-Questions**

| Research Question | Primary evaluation activity | Supporting activities |
| --- | --- | --- |
| SQ1 (XCM cross-chain rights operations and finality) | XCM latency benchmark, end-to-end XCM test | Unit tests for `xcm_*` extrinsics |
| SQ2 (Latency vs decentralization trade-offs) | Throughput and latency benchmark, HHI calculation | Comparative analysis vs centralized |
| SQ3 (Unified rights token with royalty distribution) | Unit tests, royalty propagation tests, comparative benchmark | Monte Carlo creator revenue simulation |
| SQ4 (Security and authorization) | Security audit, authorization unit tests | Reliability test |
| SQ5 (Economic viability) | Monte Carlo creator revenue simulation | Literature comparison |

## Testing Layers

We organize testing into four layers, each executed at the lowest applicable level of abstraction. Figure 6.1 summarizes the stack; the subsections below describe each layer.

*[Figure: Four-layer testing architecture (Layer 1 at the base: fastest and most granular, run on every commit; Layer 4 at the apex: broadest scope, run infrequently). Each layer tests what lower layers cannot: unit tests isolate individual extrinsic logic; the XCM simulator isolates message-construction failures; Zombienet provides definitive wall-clock performance evidence; and Snowbridge validates the complete Ethereum bridge pathway.]*

## Performance Testing Framework

Seven automated scripts in `scripts/perf/` cover various aspects of system behavior and each produce machine-readable JSON output. Table 6.2 summarizes the benchmark categories.

**Table 6.2: Benchmark Scripts**

| Category | Script | What it measures |
| --- | --- | --- |
| Throughput | `local-throughput.mjs` | TPS across 11 extrinsic types at batch sizes 1, 10, 20, 50, 100 |
| Stress | `stress-test.mjs` | Sustained TPS from 200 concurrent accounts over 180 seconds |
| XCM latency | `xcm-latency.mjs` | Block delta between send (Para B) and event arrival (Para A) |
| Block weight | `block-utilization.mjs` | Percentage of `ref_time` and `proof_size` consumed at batch sizes 50–300 |
| Storage | `storage-growth.mjs` | SCALE-encoded byte size per content item, subscriber, and view pack |
| Resource monitoring | `resource-monitor.mjs` | CPU, memory, and disk usage via Prometheus scraping during load |
| Reliability | `reliability-test.mjs` | Baseline uptime, MTTR after SIGTERM, state persistence, recovery uptime |
| Comparative | `centralized-drm-benchmark/` | Same six operations on Express.js + SQL.js under identical conditions |

A separate Monte Carlo simulation (`monte-carlo-revenue.mjs`) models 1,000 creators over 10,000 iterations across four platform configurations (centralized 30–45% fees, Web3 marketplace 5–10%, bridge-based 8–15%, CCRMS 1–5%), incorporating algorithmic discovery, organic growth, and monthly churn. This simulation provides the primary evidence for research question SQ5. We document the methodology in `scripts/perf/results/monte-carlo-findings.md`.

All scripts are reproducible: each is an independent Node.js program with explicit parameters and deterministic output paths, and each is archived as timestamped JSON in `scripts/perf/results/`.

## Test Scenarios

We designed eight test scenarios to cover the full range of evaluation activities. Table 6.3 summarizes each scenario, and the corresponding scripts are located in `scripts/perf/`.

**Table 6.3: Test Scenarios**

| # | Scenario | Description | Target |
| --- | --- | --- | --- |
| 1 | Throughput and latency | Submit concurrent batches (1, 10, 20, 50, 100) for each of the 11 local extrinsics; measure submission-to-inclusion time. | >10 TPS sustained; ~6 s inclusion latency |
| 2 | Block weight saturation | Submit progressively larger `register_content` batches (50–300); query `system.blockWeight` at inclusion. | Block weight <75% of budget at max batch |
| 3 | Storage growth | Register content, subscribers, and view packs in incremental quantities; measure SCALE-encoded byte size per map. | <500 bytes per content item; linear growth |
| 4 | XCM latency | Send `xcm_subscribe`, `xcm_purchase_views`, `xcm_purchase_ownership` from Para B to Para A via the canonical `WithdrawAsset` → `BuyExecution` → `Transact` sequence; measure block delta. | <10 parachain blocks per operation |
| 5 | Stress test | 200 funded accounts continuously submit `register_content` for 180 seconds. | Sustained TPS substantially above single-batch throughput |
| 6 | Security audit | Static analysis (`cargo clippy`, `cargo audit`), manual review of all 17 extrinsics, targeted unit tests for authorization gaps and edge cases. | 0 Critical / 0 High vulnerabilities; complete authorization coverage |
| 7 | Reliability | Monitor block production for 120 s (baseline), SIGTERM the collator, restart, verify state, monitor for 120 s (recovery). | MTTR <60 s; 100% state persistence |
| 8 | Comparative analysis | Re-implement the same six operations in Express.js + SQL.js (in-memory SQLite); run identical benchmarks against both. | Document the performance cost of decentralization |

The comparative benchmark is intentionally minimal, using Express.js for HTTP and SQL.js for in-process SQLite. A more comprehensive, centralized implementation with caching, replication, and distributed databases would perform worse than our baseline but would still be significantly faster than CCRMS. The minimal version serves as a near-optimal reference point for comparison and precludes any implication of manipulation.

## Metrics and Key Performance Indicators

Our evaluation uses 11 key performance indicators (KPIs) across four domains: technical, economic, security, and reliability. Each KPI includes a description, measurement methodology, originating source (the test scenario or activity that generates it), and a target value. These targets were set as stated design objectives during Phase 2 planning, informed by commercial comparators rather than by published academic benchmarks; they are treated throughout as reference points rather than strict pass/fail criteria. The inclusion latency target of two block intervals reflects the 6-second parachain block time of the test environment; the uptime target of 85% is sized for a single-collator Zombienet topology, not a production service-level agreement.

**Table 6.4: KPI Definitions**

| # | KPI | Definition | Target | Source |
| --- | --- | --- | --- | --- |
| 1 | **Throughput (TPS)** | Successful transactions per second under sustained load | >10 TPS | Stress test |
| 2 | **Inclusion latency** | Time from submission to block inclusion | <12 seconds (2 blocks) | Throughput test |
| 3 | **XCM latency** | Block delta for cross-chain operations | <10 blocks | XCM latency test |
| 4 | **Block utilization** | Percentage of block weight consumed at capacity | <75% | Block saturation test |
| 5 | **Storage efficiency** | Bytes per content item and per subscriber | <500 bytes | Storage growth test |
| 6 | **Uptime** | Percentage of expected blocks actually produced | >85% | Reliability test |
| 7 | **MTTR** | Time from crash to resumed block production | <60 seconds | Reliability test |
| 8 | **State persistence** | Data integrity after crash restart | 100% | Reliability test |
| 9 | **Security findings** | Critical/High vulnerabilities in dissertation code | 0 Critical, 0 High | Security audit |
| 10 | **Test coverage** | Error variants exercised by unit tests | >80% | Test suite |
| 11 | **Decentralization ratio** | Performance cost vs centralized baseline | Documented | Comparative analysis |

**Table 6.5: KPI Results Summary**

| # | KPI | Target | Measured | Status |
| --- | --- | --- | --- | --- |
| 1 | Throughput | >10 TPS | **26.2 TPS** sustained | **Pass** |
| 2 | Inclusion latency | <12 s | **~6 s** (1 block) | **Pass** |
| 3 | XCM latency | <10 blocks | **3–5 blocks** | **Pass** |
| 4 | Block utilization | <75% | **12.9%** at 300 txs | **Pass** |
| 5 | Storage efficiency | <500 bytes | **191 bytes**/content, **112 bytes**/subscriber | **Pass** |
| 6 | Uptime | >85% | **90%** | **Pass** |
| 7 | MTTR | <60 s | **~15–20 s** | **Pass** |
| 8 | State persistence | 100% | **100%** | **Pass** |
| 9 | Security findings | 0 Critical/High | **0 Critical, 0 High, 0 unresolved Medium** | **Pass** |
| 10 | Test coverage | >80% | **84%** (16/19 error variants) | **Pass** |
| 11 | Decentralization ratio | Documented | **270× slower, qualitatively superior** | **Documented** |

All 11 KPIs met their targets. The security audit identified eight findings (see Table 5.1, Appendix D): two vulnerabilities were remediated (B, E), three design properties were accepted (A, C, D), and three observations regarding positive reliability were noted (F, G, H). Chapter 8 provides an interpretation of these results.

## Testing Infrastructure

**Table 6.6: Test Environment Specifications**

| Component | Specification |
| --- | --- |
| Machine | macOS Tahoe 26.5.2, Apple Silicon |
| Relay chain | Rococo-local, 2 validators (alice, bob) |
| Parachain A | Content Rights (parachain 100), 1 collator |
| Parachain B | Consumer chain (parachain 200), 1 collator |
| Bridge Hub | Parachain 1013 (Snowbridge tests only) |
| AssetHub | Parachain 1000 (Snowbridge tests only) |
| Ethereum | Geth v1.17.1 + Lodestar v1.35.0 (Snowbridge tests only) |
| Zombienet provider | Native |
| Block time | ~6 seconds (parachain) |
| Node binary | `parachain-template-node` (release build) |
| Polkadot SDK version | stable2512 (December 2024) |
| Test scripts | `scripts/perf/*.mjs` (Node.js, `@polkadot/api` library) |
| Centralized benchmark | `centralized-drm-benchmark/` (Express.js + SQL.js) |

The single-machine topology simplifies setup and eliminates reliance on external infrastructure, with implications for interpreting the results discussed in Section . Benchmark scripts and raw JSON outputs are version-controlled, allowing any reader with access to the Polkadot SDK toolchain to independently re-execute them.

## Validity and Limitations

**Internal validity.** We run all benchmarks multiple times and report the average results; maintain a consistent test environment across all runs; apply the same methodology to CCRMS and the centralized baseline; and run the deterministic unit test suite on each commit.

**External validity.** This is the dimension in which our evaluation is most limited. Four constraints apply: (1) we measure in a local Zombienet environment with two relay-chain validators and no real network latency, so the figures serve as upper bounds within the test environment rather than predictive metrics for production; (2) the Snowbridge integration uses a local Ethereum stack rather than a public testnet, avoiding variability in block times, MEV, contention, and beacon chain reorganizations; (3) because of the maturation gap of Polkadot 2.0, the latency figures reflect a pre-2.0 toolchain, and several measurements are expected to improve significantly in a production Polkadot 2.0 environment; (4) our scale is modest, comprising up to 200 concurrent accounts and a few hundred content items, and empirical verification of linear storage growth at production scale has not yet been conducted.

**Construct validity.** The figure of 26.2 TPS quantifies the successful inclusion rate under sustained load but is insufficient to assess user-perceived performance, which also depends on wallet user experience, mempool latency, and RPC responsiveness. The baseline uptime of 90% assesses single-collator block production and does not account for multi-collator production availability. The Monte Carlo simulation evaluates expected revenue using a probabilistic model; the input parameter sources and assumptions are documented in Section 7.2.1.

**Threats to validity.** (a) **Selection bias:** the eight test scenarios may not capture production conditions such as high subscriber concurrency on a single content item, large multi-collator topologies, or extended multi-month uptime. (b) **Measurement instrument bias:** any bug in `@polkadot/api` or `system.blockWeight` would propagate into our results; although the library is widely used, it is not bug-free. (c) **Confirmation bias:** the author was responsible for designing, implementing, and evaluating the system; this risk is mitigated by using externally referenced KPI targets and by disclosing all scripts and raw results. (d) **Single-author validation:** no external code review, third-party security audit, or benchmark validation has been conducted; we recognize this as a significant limitation and intend to address it in future work (Section 9.1).

## Summary

The evaluation uses four testing layers, eight test scenarios, seven automated benchmarks, a Monte Carlo simulation, and 11 KPIs grounded in a measurement-focused philosophy. Section 6.7 outlines the primary validity constraints. Chapter 7 presents the results.

---

# Results

This chapter presents the measured results. Section 7.1 covers technical results, Section 7.2 covers economic results, and Section 7.3 covers security and user-centric results. We defer interpretation to Chapter 8.

## Technical Results

The technical results in this section address SQ1 (XCM cross-chain finality, Section 7.1.2), SQ2 (the latency–decentralization trade-off, Section 7.1.7), and SQ3 (unified rights token throughput and storage performance, Sections 7.1.1–7.1.4).

### Throughput

We evaluated all 11 local extrinsic types across four batch sizes (1, 10, 50, 100). At a batch size of 100, extrinsics without nesting constraints achieved 16.6 TPS, whereas those involving the minting of child NFTs (`subscribe`, `purchase_ownership`, `enable_auto_renew`, `disable_auto_renew`, `transfer_ownership`) were limited to 8.3 TPS by the maximum children constraint (`MaxChildren=50`) rather than by block weight. Phase 4 extrinsics matched the baseline throughput, confirming that the unified rights token model incurs no measurable performance overhead.

**Table 7.1: Single-Chain Throughput by Extrinsic Type and Batch Size**

| Extrinsic | Batch=1 (TPS) | Batch=10 (TPS) | Batch=50 (TPS) | Batch=100 (TPS) |
| --- | --- | --- | --- | --- |
| `register_content` | 0.17 | 1.66 | 8.31 | 16.62 |
| `check_access` | 0.17 | 1.66 | 8.31 | 16.62 |
| `set_royalty_splits` | 0.17 | 1.66 | 8.31 | 16.62 |
| `query_rights_metadata` | 0.17 | 1.66 | 8.31 | 16.62 |
| `subscribe` | 0.17 | 1.66 | 8.31 | 8.31* |
| `purchase_ownership` | 0.17 | 1.66 | 8.31 | 8.31* |
| `purchase_views` | 0.17 | 1.66 | 8.31 | 16.62 |
| `consume_view` | 0.17 | 1.66 | 8.31 | 16.62 |
| `enable_auto_renew` | 0.17 | 1.66 | 8.31 | 8.31* |
| `disable_auto_renew` | 0.17 | 1.66 | 8.31 | 8.31* |
| `transfer_ownership` | 0.17 | 1.66 | 8.31 | 8.31* |

* Limited by `MaxChildren=50` constraint, not by block weight or block production.

TPS scales linearly with batch size, given a 6-second block time and one block per batch. During the sustained stress test, 200 concurrent accounts submitted `register_content` transactions over 180 seconds, achieving a sustained throughput of **26.2 TPS** (174.6 transactions per block across 27 blocks). Block weight utilization at 300 transactions was only **12.9% of `ref_time`** and **2.2% of `proof_size`**, indicating an estimated theoretical maximum of approximately **283 TPS** per parachain. The stress test had a transaction failure rate of 78%, primarily due to RPC-layer nonce conflicts rather than parachain failures; all successfully included transactions were processed accurately.

### Latency

Single-chain inclusion latency was consistently **~6,000 ms** (one parachain block), with a standard deviation of <15 ms within a batch, confirming atomic same-block inclusion for concurrent transactions. Cross-chain XCM latencies are detailed in Table 7.2, with averages computed across three separate executions.

**Table 7.2: XCM Cross-Chain Latency by Operation**

| Operation | Mean Block Delta | Standard Deviation | Approximate Wall-Clock |
| --- | --- | --- | --- |
| `xcm_subscribe` | 3.0 blocks | ±2.0 blocks | ~99.6 seconds |
| `xcm_purchase_views` | 5.0 blocks | ±1.0 blocks | ~100 seconds |
| `xcm_purchase_ownership` | 5.0 blocks | ±2.0 blocks | ~100 seconds |

The approximately 100-second wall-clock latency is primarily due to the relay chain hop and Para A's wait for its next block slot. In a Polkadot 2.0 environment with Async Backing, Agile Coretime, and Elastic Scaling, these delays would decrease significantly; the 100-second figure serves as an upper bound in the pre-2.0 testing environment.

### Block Weight Utilization

**Table 7.3: Block Weight Utilization at Increasing Batch Sizes**

| Batch Size | `ref_time` Consumed | `proof_size` Consumed | Block Construction Time |
| --- | --- | --- | --- |
| 50 | 2.2% | 0.4% | ~10 ms |
| 100 | 4.3% | 0.7% | ~21 ms |
| 150 | 6.5% | 1.1% | ~31 ms |
| 200 | 8.6% | 1.5% | ~42 ms |
| 250 | 10.7% | 1.8% | ~52 ms |
| 300 | 12.9% | 2.2% | ~62 ms |

At 300 transactions, block weight accounts for 12.9% of `ref_time` and 2.2% of `proof_size`, with a construction time of about 62 milliseconds (~1% of the 6-second block). The 6:1 `ref_time`-to-`proof_size` ratio highlights the lightweight nature of NFT minting; operations with larger storage footprints would change this ratio.

### Storage Growth

**Table 7.4: Per-Item Storage Costs (SCALE-encoded)**

| Item Type | Storage Map | Bytes per Item |
| --- | --- | --- |
| Content registration | `Contents` | 191 |
| Active subscription | `Subscriptions` | 112 |
| View pack | `ViewPacks` | 111 |
| Ownership record | `Ownership` | 36 |
| Royalty splits (per collaborator) | `RoyaltySplits` | 34 |
| Child NFT nesting record | `Children` | 8 (per child) |

Growth was perfectly linear: the 50th item cost the same as the first, confirming **O(1)** `StorageMap` complexity. At a hypothetical production scale of one million content items and ten million subscribers, total state is projected to be approximately 1.3 GB — manageable for a production parachain node, since RocksDB (the default Substrate storage backend) supports databases several orders of magnitude larger on commodity hardware. This also significantly exceeds the 500-byte Phase 2 target.

### Reliability

**Table 7.5: Reliability Test Results**

| Phase | Metric | Value |
| --- | --- | --- |
| Baseline | Blocks produced | 18 of 20 expected |
| Baseline | Uptime | 90% |
| Baseline | Mean block time | 6.67 seconds |
| Failure | Time to RPC ready (post-restart) | ~15 seconds |
| Failure | Time to first new block (post-restart) | ~20 seconds |
| Recovery | State integrity | 100% preserved |
| Recovery | Blocks produced | 18 of 20 expected |
| Recovery | Uptime | 90% (matches baseline) |
| Recovery | Mean block time | 6.67 seconds (matches baseline) |

A baseline uptime of 90% reflects typical single-collator behavior (Finding F). Production multi-collator topologies would mask individual failures. MTTR was approximately 15 seconds for RPC and approximately 20 seconds for the first new block, with 100% state preservation across restarts (validated at the RocksDB layer). Recovery-phase metrics were statistically indistinguishable from the baseline: 90% uptime, a mean block time of 6.67 seconds, and no lingering degradation.

### Snowbridge End-to-End Bridge

We bridged two 1 ETH transactions from the local Ethereum network to the local AssetHub via the complete Snowbridge pipeline, which comprises four parachains, Geth, Lodestar, 16 Gateway contracts, and two relayers. Both transactions were successful; consequently, Alice had 22 ETH on AssetHub thereafter: 20 minted for testing and 2 bridged. Table 7.6 provides an overview of the message pathway.

**Table 7.6: Snowbridge End-to-End Message Path (Verified)**

| Step | Component | Action |
| --- | --- | --- |
| 1 | Geth | Transaction `Gateway.sendToken(1 ETH, Alice)` included in block 5157 |
| 2 | Lodestar | Block finalized at epoch ≥ 162 |
| 3 | Beacon Relay | Generated inclusion proof, submitted beacon header update |
| 4 | Bridge Hub | `ethereumBeaconClient.submit(...)` verified BLS signatures, advanced `latestFinalizedBlockRoot` |
| 5 | Execution Relay | Generated receipt + execution + ancestry proof, submitted message bundle |
| 6 | Bridge Hub | `ethereumInboundQueue.submit(...)` verified the proof against the verified beacon state root |
| 7 | Bridge Hub → AssetHub | XCM message dispatched via HRMP |
| 8 | AssetHub | `foreignAssets.mint(Ether, Alice, 1 ETH)` succeeded |

The CCRMS parachain served as a passive participant: the XCM runtime configuration was preconfigured to receive cross-consensus messages without modification, thereby validating the **forward-compatibility** claim. We did not execute the final hop (bridged ETH paying for a CCRMS rights operation) end-to-end; this limitation is acknowledged in Section 8.5. The integration challenges (Lodestar version pinning, fork-version configuration, and beacon state cache timing) are documented in Appendix A.

### Comparative Analysis vs. Centralized Baseline

We benchmarked CCRMS against Express.js with SQL.js for the same six operations, using the same methodology. Table 7.7 presents the comparison.

**Table 7.7: Comparative Analysis: CCRMS Parachain vs. Centralized (Express.js + SQLite)**

| Metric | CCRMS Parachain | Centralized | Ratio |
| --- | --- | --- | --- |
| Sustained TPS | 26.2 | 7,305 | 270× |
| Operation latency (server-side) | ~6,000 ms | 0.09 ms | 67,000× |
| Stress test success rate | 22% (RPC nonce conflicts) | 100% | – |
| Storage per content | 191 bytes | ~100–150 bytes | 1.5× |
| MTTR | 15–20 seconds | 2–3 seconds | 7× |
| Cross-chain equivalent | ~100 seconds | 5–50 ms (HTTP request) | 2,000–20,000× |

The centralized implementation outperforms CCRMS across all quantitative metrics (270× TPS, 67,000× latency). These figures reaffirm the well-known performance cost of decentralization but do not argue against it. The qualitative properties offered by CCRMS (no single point of failure, cross-chain support, provable rights state, and censorship resistance) are not captured in the quantitative data, yet they are crucial for the specific use case. The 26.2 TPS equates to approximately 2.3 million operations per day. Rights management transactions — purchases, renewals, and transfers — are discrete, low-frequency events; this throughput is sufficient for the use case without approaching architectural limits. In Chapter 8, we contend that the appropriate framework should be characterized as **architectural fit for purpose**, rather than focusing solely on raw performance.

## Economic Results

The economic results in this section address SQ5 (economic viability under realistic creator-audience distributions) using Monte Carlo simulation, the audience-size crossover finding, and a comparative analysis of platform fees.

### Monte Carlo Creator Revenue Simulation

The simulation models 1,000 creators across 10,000 iterations under four platform configurations, drawing creator parameters from realistic distributions and projecting one-year revenue using platform-specific fees and dynamics (algorithmic discovery, organic growth, and monthly churn). Figure 7.1 illustrates the simulation structure, and Table 7.8 summarizes the results.

*[Figure 7.1: Monte Carlo simulation structure (1,000 creators × 10,000 iterations = 10 million revenue paths per platform). Creator parameters are sampled for each creator; the platform fee is drawn uniformly from each platform's range at each iteration. The four paths run in parallel and are aggregated independently, yielding the mean revenue figures in Table 7.8, the 95% confidence intervals in Table 7.11, and the audience-size crossover finding in Table 7.9.]*

**Table 7.8: Monte Carlo Creator Revenue Simulation (Mean Annual Revenue Per Creator)**

| Platform Model | Fee Range | Mean Revenue | vs. CCRMS |
| --- | --- | --- | --- |
| Centralized (YouTube/Spotify-style) | 30–45% | $45,416 | CCRMS +16.8% |
| Web3 marketplace (OpenSea-style) | 5–10% | $48,711 | CCRMS +8.9% |
| Bridge-based cross-chain | 8–15% | $45,369 | CCRMS +16.9% |
| **CCRMS** | **1–5%** | **$53,053** | **Baseline** |

### Audience Size Dependency

The mean revenue figures in Table 7.8 obscure an important nuance: the advantage of CCRMS is not consistent across all creators. It is heavily dependent on **audience size**. Table 7.9 categorizes the simulation outcomes by creator audience size tiers.

**Table 7.9: CCRMS Advantage by Creator Audience Tier**

| Audience Tier | Followers | CCRMS Win Rate vs Centralized | Notes |
| --- | --- | --- | --- |
| Tiny | <500 | 0% | Centralized algorithmic discovery dominates |
| Small | 500–2,000 | <5% | Centralized still preferred |
| Crossover | ~2,000 | 6.6% | Crossover point begins |
| Mid-size | 10,000–100,000 | 99%+ | CCRMS strongly preferred |
| Large | 100,000+ | 99.9% | CCRMS near-certain advantage |

The crossover effect is notable. For creators with fewer than about 2,000 organic followers, centralized platforms are generally preferable because algorithmic discovery provides an audience that would otherwise be inaccessible. This benefit significantly outweighs the higher fees. Conversely, for creators with 10,000 or more followers, the advantage of algorithmic discovery diminishes, and the fee differential becomes the primary consideration; CCRMS is the preferred choice in over 99% of simulated scenarios.

Table 7.10 reports the per-scenario break-even rates.

**Table 7.10: Per-Scenario Break-Even Rates**

| Comparison | CCRMS Per-Scenario Win Rate |
| --- | --- |
| CCRMS vs Centralized | 28.0% |
| CCRMS vs Web3 marketplace | 38.6% |
| CCRMS vs Bridge-based cross-chain | 66.5% |

The per-scenario win rates are lower than the mean revenue advantage suggests. CCRMS produces a higher overall mean revenue, but it loses in a substantial share of individual scenarios, typically those with small audiences. The 66.5% win rate against bridge-based cross-chain is particularly informative: the only configuration in which CCRMS dominates is when it competes against an alternative that is also cross-chain and shares many of the same assumptions about audience access.

Table 7.11 presents the 95% confidence intervals for total simulated revenue across all 1,000 creators.

**Table 7.11: 95% Confidence Intervals for Total Simulated Revenue (1,000 Creators)**

| Platform | Total Revenue Range |
| --- | --- |
| Centralized | $30.9M–$69.1M |
| Web3 marketplace | $35.1M–$78.4M |
| Bridge-based cross-chain | $30.7M–$69.4M |
| **CCRMS** | **$36.7M–$84.1M** |

The width of each confidence interval reflects the range of plausible aggregate revenue outcomes across 10,000 iterations; a narrower interval indicates a more predictable platform, while a wider interval indicates greater sensitivity to individual creator audience size and churn. CCRMS has the broadest confidence interval, indicating greater variability around the mean. This observation aligns with the audience-dependent advantage shown in Table: a CCRMS distribution includes both high-earning creators (large audiences who retain most of their revenue) and low-earning creators (small audiences without an algorithmic discovery boost).

### Comparative Fee Analysis

We drew the platform fee structures used in the Monte Carlo simulation from publicly available data on representative platforms within each category. Table 7.12 delineates the assumed fee ranges and the corresponding data sources.

**Table 7.12: Assumed Fee Ranges for Each Platform Category**

| Category | Fee Range | Representative Platforms |
| --- | --- | --- |
| Centralized | 30–60% | YouTube (45% [youtubePartnerProgram]), Spotify (~30% [spotifyForArtists]), Apple Music (~48% [appleForArtists]), Audible (retains 60% [audibleAcx]) |
| Web3 marketplace | 5–10% | OpenSea (2.5% protocol fee [openSeaFees]), Magic Eden (2% [magicEdenFees]) |
| Bridge-based cross-chain | 8–15% | Wormhole, LayerZero, Multichain (estimated range combining bridge protocol fees and destination DEX swap costs; varies by route and asset) |
| CCRMS | 1–5% | Polkadot transaction fees (target), conservative range |

The CCRMS fee range of 1–5% is the direct mechanism by which the system addresses SQ5 (economic viability for creators): by minimizing platform extraction, the creator retains a larger share of gross revenue, an advantage that compounds over time for creators with established audiences (Section 7.2.2).

Fee ranges are sampled uniformly at each iteration, incorporating uncertainty into the revenue figures; the CCRMS range of 1–5% combines the minimal on-chain transaction cost with any hypothetical service fees, with the lower bound representing pure protocol fees.

The simulation excludes self-custody friction, node-operation costs, content delivery infrastructure, and legal compliance costs. These are acknowledged as limitations in Chapter 8.

## Security and User-Centric Results

### Security Audit Findings

The security audit (Scenario 6, Section 6.4) produced eight findings labeled A through H. Table 7.13 summarizes them.

**Table 7.13: Security Audit Findings**

| ID | Severity | Description | Status |
| --- | --- | --- | --- |
| A | Low | XCM extrinsics callable locally as gift transactions (intentional) | Accepted design |
| B | **Medium** | Authorization gap in `xcm_transfer_ownership` | **Fixed** (commit `9ceca57`) |
| C | Low | Permissive `SafeCallFilter = Everything` configuration | Accepted prototype config |
| D | Low | Zero-price content registration allowed | Accepted feature |
| E | Low | View pack overwrite on re-purchase | **Fixed** (commit `9ceca57`) |
| F | Informational | Single-collator MTTR ~15–20 seconds | Test environment artifact |
| G | Positive | 100% state persistence across crash | Confirmed |
| H | Positive | Block production rate unchanged after recovery | Confirmed |

Among the eight findings, two (B and E) were identified as security vulnerabilities that we have remediated; three (A, C, D) are accepted design properties documented for production hardening; and the remaining three (F, G, H) are positive observations regarding reliability. **Finding B** (Medium severity, the `xcm_transfer_ownership` authorization gap) and **Finding E** (Low severity, the view-pack overwrite bug) have both been addressed in commit `9ceca57`. Appendix D provides the complete narrative for each finding.

### Test Coverage

Our unit test suite covers **16 of the 19 distinct error variants** defined in `pallet-content-rights`, achieving 84 percent coverage, which exceeds the Phase 2 objective of 80 percent. Three variants remain untested and are out of scope for the unit test suite: `ItemIdOverflow` requires exhausting a `u32` counter during normal extrinsic dispatch, which is not feasible in a test environment; `NftOperationFailed` is triggered only by internal `pallet-nfts` state corruption that the mock runtime does not replicate; and `ChildAlreadyNested` cannot be reached through any publicly exposed extrinsic. The comprehensive error variant table is provided in Appendix D.

### Decentralization Assessment (HHI)

The Herfindahl-Hirschman Index (HHI) was calculated theoretically using the actual validator distribution on the Polkadot mainnet, taking into account that a parachain adopts the relay chain's security model. Table 7.14 presents the relevant comparison.

**Table 7.14: Herfindahl-Hirschman Index (HHI) Comparison**

| System | Validators / Entities | HHI (approx.) | Nakamoto Coefficient |
| --- | --- | --- | --- |
| Polkadot mainnet (NPoS, ~300 validators) | ~300 (near-equal stake) | ~33 | ~80–100 |
| Ethereum PoS | ~900K validators (concentrated in ~5 staking providers) | ~1,200–2,000 | ~5–7 |
| Solana | ~1,900 validators (top-heavy stake distribution) | ~200–500 | ~19–25 |
| Centralized DRM (e.g., Spotify) | 1 entity | 10,000 | 1 |
| US DOJ "unconcentrated" threshold | -- | <1,500 | -- |

Polkadot's HHI of ~33 is well below the US DOJ "unconcentrated" threshold of 1,500 and is orders of magnitude lower than that of a centralized monopoly at 10,000. The Nakamoto coefficient (~80–100 for Polkadot, compared to approximately 5–7 for Ethereum Proof of Stake (PoS) and 1 for centralized Digital Rights Management (DRM)) confirms that a CCRMS deployment on Polkadot would meet or exceed the decentralization attributes of the alternative systems.

### Static Analysis and Dependency Audit

Static analysis with `cargo clippy` reported zero warnings in the dissertation's codebase. `cargo audit` reported 8 advisories, all related to transitive dependencies of the Polkadot SDK, including networking, the WebAssembly (WASM) executor, Transport Layer Security (TLS), and logging. Importantly, none of these advisories affect our pallet code. These issues are effectively mitigated by the architectural separation between the sandboxed WASM runtime and the node binary. See the Appendix for the full advisory breakdown.

## Summary

All 11 KPIs met their targets. The most significant outcome is the audience-dependent CCRMS advantage identified in the Monte Carlo simulation, as discussed in Chapter 8.

---

# Discussion

This chapter analyzes the findings of Chapter 7 by identifying the questions addressed, the decisions substantiated, and the limitations that shape the interpretation of the contribution.

## Answering the Research Questions

### SQ1: Cross-Chain Rights Operations and Finality

The academic challenge was ensuring that rights acquisition remains an atomic operation despite the absence of a shared transaction context across chains. The key finding is that the payer–beneficiary decoupling pattern, combined with XCM's `Transact` instruction, is sufficient to delegate rights issuance to the authoritative chain without requiring two-phase commit or a shared sequencer. The remote parachain pays; CCRMS issues the rights record; no distributed rollback is needed because the rights state is always authoritative on one chain.

**Affirmative with one caveat.** XCM v3 is sufficient for executing cross-chain rights operations: the canonical sequence `WithdrawAsset` → `BuyExecution` → `Transact` covers all five `xcm_*` extrinsics and achieves complete atomic success with finality of 3 to 5 blocks (Section ). No custom XCM extensions are required. The only caveat is that cross-chain **recurring** renewals depend on the readiness of XCM v5 `Schedule` production; in the meantime, an on-chain block hook manages local auto-renewal.

### SQ2: Latency versus Decentralization Trade-Offs

The trade-off is real but highly asymmetric: CCRMS operational latency is approximately 67,000× higher than the centralized baseline (Table 7.7: ~6,000 ms vs. 0.09 ms), while achieving an HHI of ~33, compared with 10,000 for a centralized monopoly (Table 7.14), a decentralization gain of roughly two orders of magnitude on that index. For discrete, low-frequency rights operations—the CCRMS use case—the trade-off is advantageous; for high-frequency interactive applications, it is not.

### SQ3: Unified Rights Token Enforcing All Three Monetization Models

**Yes, the cost savings are substantial but audience-dependent.** The academic challenge was to represent three fundamentally different access semantics—time-bounded, usage-counted, and indefinite—in a single composable token without cross-contamination of state across models. The unified primitive works (Section 5.1). The access check resolves rights in priority order across all three storage maps, and royalty propagation applies uniformly to all primary-market revenue. The Monte Carlo simulation (Section 7.2) confirms the cost savings, with the audience-dependent nuance discussed in Section 8.2.2. The unification itself is the dissertation's most significant **conceptual** contribution: it closes gap G7 by showing that three independent storage maps, together with a unified priority-resolution access check, are sufficient to enforce all three semantics without requiring novel cryptographic or consensus-layer mechanisms.

### SQ4: Security and Authorization

`xcm_transfer_ownership` accepted a `from` identity parameter without verifying that the caller held it; a one-line `ensure!` check (Finding B, Section 7.3.1) remediated the issue. The lesson generalizes: **cross-chain extrinsics that accept identity parameters require explicit authorization checks**.

### SQ5: Economic Viability under Realistic Creator Audience Distributions

**Yes, conditionally.** The Monte Carlo simulation (Section 7.2) provides a definitive empirical answer: CCRMS yields higher mean creator revenue across all four simulated platform configurations, with an advantage ranging from 8.9% to 16.9%. However, this advantage depends heavily on the size of the creator's audience. We explore the crossover point and its implications in Section 8.2.2. Our contribution is to transform this conditionality into a **quantitative and reproducible** framework rather than merely qualitative observations.

## Interpretation of Key Results

### The 26.2 TPS Figure in Context

The figure of 26.2 TPS reflects a single parachain on a pre-Polkadot 2.0 toolchain and does not represent the architecture's maximum capacity. Polkadot achieves scalability through **horizontal** scaling: with 100 parachains at 26 TPS each, the total capacity reaches 2,600 TPS [polkadotParachainSlots; wood2016]. Additionally, Elastic Scaling (currently in production) enhances per-parachain throughput across multiple cores. The 26.2 TPS figure is consistent with the throughput range documented by [raoEtAl2024] for public blockchain systems at an equivalent single-node scale—their survey confirms that 20–30 TPS is characteristic of NPoS-secured networks without Layer-2 acceleration, and that horizontal scaling across multiple chains is the principal path to higher aggregate throughput. More importantly, the 270× ratio relative to the centralized baseline is misleading. CCRMS is designed to process low-frequency events; it records discrete rights transactions with cryptographic finality, automatic royalty propagation, and cross-chain portability, none of which the centralized baseline provides at any throughput level. When assessed against its actual workload, 26.2 TPS comfortably exceeds the demands of every creator-economy platform.

### The Economic Crossover at ~2,000 Followers

The economic advantage of CCRMS primarily benefits creators with established audiences. For those with fewer than ~2,000 followers, centralized platforms tend to generate greater revenue because algorithmic discovery helps creators reach audiences they might not otherwise reach. While this initially appears to challenge the notion that CCRMS serves as a creator-friendly alternative, the more accurate and credible assertion is conditional: (decentralized = better for creators **with established audiences**). CCRMS is primarily a tool designed **for creators who have surpassed the discovery benefits of centralized platforms and seek to maximize revenue retention** [rogersEverett2003; moore2014].

### The Snowbridge End-to-End Demonstration

The CCRMS parachain served as a **passive participant** in the Snowbridge test: the runtime's XCM configuration was preconfigured to receive Ethereum-originated messages without modification. The integration succeeded because we had configured the runtime early, at minimal cost. Our development against V1 demonstrates forward compatibility with the production V2 bridge (Section 8.4). The final hop (bridged ETH paying for a CCRMS operation) was not executed end-to-end (Section 8.5); a production deployment would address this deficiency.

## Architectural Decisions Revisited

The major architectural decisions are each assessed against the measurements and the events during the implementation window (see Appendix A for full details).

**The pallet-first decision is most emphatically vindicated.** The discontinuation of ink! in January 2026 confirmed a Phase 4 decision made for unrelated engineering reasons, demonstrating that *architectural decisions that reduce dependence on any single non-essential component become more valuable as the ecosystem evolves* [parnas1972; bassEtAl2021]. This principle is also reflected in the choice of `pallet-nfts` over the frozen RMRK pallets and in HRMP rather than in custom inter-parachain protocols.

The unified rights token and the payer–beneficiary cross-chain pattern are likewise vindicated: the former scales linearly with no measurable overhead (caveat: Section ), and the latter is sound under the explicit authorization requirement of Finding B.

## The Work in Context

The Polkadot ecosystem evolved during implementation. **Polkadot 2.0** features reached production by late 2025, indicating that our latency metrics are pre-2.0 upper bounds; deployment uses the updated SDK with no pallet-level changes. **Snowbridge V2** is backward-compatible with the V1 prototype. **Story Protocol** confirms the market premise from a single-chain Layer 1 perspective. **EU regulation** (AI Act copyright, MiCA) drives demand for cryptographic provenance and royalty records; MiCA's classification of subscription tokens remains legally unclear. Cross-chain interoperability surveys [madapatiPradhan2025; dengEtAl2025; liEtAl2025a; maricEtAl2025] provide context but do not change the conclusions.

## Limitations

The CCRMS prototype has five principal limitations:

1. **No production deployment.** All measurements are from a local Zombienet topology with two relay-chain validators, single-collator parachains, and no real-world latency. Chapter 7 results serve as upper bounds in this test environment and do not predict production behavior. In production, latency might improve with Polkadot 2.0, throughput could remain similar, and reliability could be lower under real-world conditions.
2. **Single-author validation.** A single author performed the implementation, test design, measurement collection, and interpretation. No independent code review, third-party security audit, or external benchmark validation has been conducted. Production deployment would require all three before any non-trivial value passes through the system.
3. **Local-only Snowbridge integration.** Geth and Lodestar ran on the same machine as the Polkadot side, avoiding many realities of public Ethereum (variable block times, MEV, network contention, beacon chain reorgs). The integration serves as a proof of architectural feasibility but provides no data on production bridge behavior.
4. **The 50-child cap.** The `BoundedVec<_, ConstU32<50>{}>` limit on `Children` is the most pressing operational constraint. Popular content items will reach this limit. We identify three mitigation paths in Section 9.1, but none have been implemented in the prototype yet.
5. **No empirical proof of the bridged-payment final hop.** The bridged-ETH-pays-for-CCRMS-operation flow is conceptually straightforward but has not been tested end-to-end. We claim forward-compatibility with the flow, which is a weaker claim than an empirical demonstration would provide.

## Implications

The findings extend beyond the immediate prototype in four directions.

**For platform designers,** the overarching lesson is that **architectural choices that minimize reliance on any single non-essential component pay dividends during ecosystem-level changes**. Two corollaries: **cross-chain extrinsics that accept identity parameters require explicit authorization audits** (Finding B), and **reimplementing an unmaintained standard is preferable to depending on it** (the RMRK 2.0 pivot).

**For creators,** the Monte Carlo simulation suggests that the question "Is a decentralized platform actually better for me?" has a conditional answer: **yes, depending on audience size**. Creators with over 10,000 followers substantially benefit from lower fees and direct revenue retention; conversely, those with fewer than ~2,000 followers are typically better served by centralized platforms, whose algorithmic discovery delivers an audience they could not otherwise reach. The choice should be based on the creator's career stage rather than a universal preference. Additionally, there is an operational benefit to simplifying multi-model unification: a creator managing separate Patreon and Gumroad accounts for identical content can, through CCRMS, register the content once and offer all three models from a single record.

**For regulators,** on-chain rights management systems should be treated as **compliance infrastructure** for emerging copyright and AI training regimes, rather than as alternative payment platforms. The open question regarding MiCA's classification of subscription tokens with fungible characteristics would benefit from regulatory clarity, as the current ambiguity poses risks for would-be EU deployers.

**For the research community,** the prototype, implementation specifications, and Monte Carlo simulation are intended to support follow-up research. The methodological contribution is a worked DSR example for multi-component blockchain prototyping. The empirical contribution is the audience-dependent finding, which future research could refine using real-world migration data or models that incorporate creator psychology and switching costs.

## Critical Self-Reflection

In retrospect, we would have **initiated the Snowbridge integration earlier**; the setup complexity (Appendix A) required several days of unexpected debugging. We would also have **prioritized FRAME benchmarking earlier** to report fee-adjusted throughput. We would **not** change the pallet-first decision, the unified rights token model, or the cross-chain operation pattern.

## Summary

The five research sub-questions are answered affirmatively; the most economically significant finding is the audience-dependent CCRMS advantage. The major architectural decisions are vindicated, most emphatically the pallet-first decision. The five principal limitations constrain how the contribution should be read but do not invalidate it. Chapter 9 presents the conclusion and future work.

# Conclusion and Future Work

This closing chapter restates the contributions, summarizes the key findings, identifies the most important threads for future work, and offers a brief closing reflection.

## Summary of Contributions

Section 1.4 stated four contributions. We expand each here.

1. **A feasibility result for the unified rights primitive.** The central contribution shows that subscription, pay-per-view, and ownership can be encoded as native access modes of a single on-chain token — not as configurations of a licensing primitive, but as state transitions enforced by a unified access check. It uses three storage maps (`Subscriptions`, `ViewPacks`, `Owners`) with a single check and shared royalty logic; all tests and KPIs confirm correct enforcement. No cryptographic or consensus mechanisms are needed. This closes gap G7 and is the main academic contribution.

2. Prior work endorsed decentralization qualitatively or measured only centralized performance. This dissertation quantifies the trade-offs directly. Latency overhead is 67,000×, throughput penalty is 270× compared to centralized Express.js; Herfindahl-Hirschman Index improves ~300× (Polkadot HHI ~33 vs. DRM at 10,000). Monte Carlo simulation shows CCRMS yields 25.4% higher revenue for creators with ~2,000 followers. Both are novel in blockchain content rights systems.

3. **A cross-chain rights artifact demonstrating XCM sufficiency.** The CCRMS parachain — `pallet-content-rights`, `pallet-rights-verifier`, an ink! 6 wrapper contract, an EVM read-only precompile, and benchmark and simulation scripts — demonstrates that XCM v3 with payer–beneficiary decoupling is sufficient for all five authenticated cross-chain rights operations without custom protocol extensions. Seven implementation specifications (pallet design, XCM message flows, security threat model, royalty algorithm, precompile interface, NFT nesting model, and Snowbridge integration) provide design knowledge intended to support future replication and extension. The artifact and specifications are released open source under the MIT license.

4. **A DSR worked example for multi-component blockchain prototypes.** The full DSR cycle—problem identification, design, instantiation, evaluation, and communication—is applied to a system with FRAME pallets, ink! contracts, XCM, Snowbridge, and Monte Carlo simulation. This combination is rarely seen in existing DSR literature, which typically focuses on single-component blockchain systems. Future researchers building similar multi-layer blockchain prototypes can use this dissertation as a methodological reference.

## Principal Findings

Six principal findings emerge from the work:

1. **The architecture works.** All planned functionality is implemented; all KPIs are met; and all 56 unit tests pass on every commit.
2. **The major architectural decisions aged well.** The pallet-first decision was validated by the January 2026 ink! discontinuation; the RMRK 2.0 to `pallet-nfts` pivot, the unified rights token model, and the cross-chain operation pattern are also vindicated. In retrospect, we would not change these decisions.
3. **The economic advantage depends on audience size.** CCRMS benefits creators with 10,000+ followers but is less competitive than centralized platforms for those with under ~2,000 followers due to algorithmic discovery. While CCRMS earns more on average, the conditional framing better reflects individual creator decisions.
4. **Cross-chain operation is operationally feasible but latency-bound.** XCM v3 is sufficient; cross-chain finality measured on a pre-Polkadot 2.0 toolchain serves as an upper bound, not a fundamental limit
5. **Standards reimplementation is sometimes preferable to standards adoption** when the reference implementation is unmaintained; the RMRK 2.0 pivot exemplifies this.
6. **Forward compatibility is a defensive engineering goal.** Configuring the runtime to accept Ethereum-originated XCM messages at minimal additional cost in Phase 4 enabled the Snowbridge integration to succeed without any pallet-level modifications.

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

CCRMS started with the idea that creators deserve more value, and blockchain offers a way to achieve this. We built a prototype, tested its operations, and simulated its economic effects. The premise held but was refined: Monte Carlo simulations show that decentralization is better for creators who have outgrown centralized platforms' discovery value, not universally. An honest, conditional claim is more valuable than a universal one.

The Polkadot ecosystem evolved significantly during implementation, with major updates like Polkadot 2.0, Snowbridge V2, and others. None invalidated our work because we chose conservatively—favoring stable primitives, minimizing reliance on non-essential parts, and preferring proven deployment patterns. This highlights a study in **defensive engineering** and **conservative, well-documented architecture** as the most durable approach.

CCRMS is a prototype in a single blockchain ecosystem, addressing a specific industry's structural issues. It isn't the future of content rights management, nor do we claim it to be. However, it shows that content rights management can be built on open, decentralized, cryptographically verifiable infrastructure, serving as a starting point for others to build upon.
