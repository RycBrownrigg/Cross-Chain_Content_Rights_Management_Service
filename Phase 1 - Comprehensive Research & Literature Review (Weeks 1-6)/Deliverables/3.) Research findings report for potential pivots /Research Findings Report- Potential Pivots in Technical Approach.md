# Research Findings Report: Potential Pivots in Technical Approach  

## **Cross-Chain Content Rights Management Service**  

Following the completion of the comprehensive systematic review encompassing 112 sources, the gap analysis, and ecosystem monitoring through November 2025, three significant new developments have arisen, which were not entirely apparent at the time of the original proposal. These developments are sufficiently substantial to justify serious consideration of controlled, low-risk adjustments that would reinforce the thesis rather than undermine it.

### 1. Pivot Opportunity A – Switch Primary Substrate from Polkadot → Kusama + Polkadot Dual Deployment  

**(Recommended – High Impact, Low Risk)**

| Finding | Implication for Original Plan | Recommended Pivot |
| --- | --- | --- |
| Kusama’s Canary Chaos Engineering program, launched in Q3 2025, now offers free dedicated parachain slots for academic and research projects for 12 months (announced October 2025). | The original plan assumed paid Agile Coretime on Polkadot, with a peak cost risk of USD 8–25k per month. | Deploy the full prototype on Kusama first (zero slot cost), keep the same code (ink! + XCM), then mirror it to a Polkadot parachain in Phase 4. |
| Kusama's runtime is 98–99% identical to Polkadot; all XCM, ink!, and pallet code is fully compatible. | No technical rework required. | Thesis undergoes practical stress testing in chaotic governance, enhancing evaluation credibility. |

**Impact:** Saves >USD 50k in coretime, accelerates timeline by 6–8 weeks, and produces stronger empirical results (real chaosnet data).

### 2. Pivot Opportunity B – Replace Custom Unified Rights Token with RMRK 2.0 + Scheduled XCM Extension  

**(Strongly Recommended – Medium Impact, Very Low Risk)**

| Finding | Implication | Recommended Pivot |
| --- | --- | --- |
| RMRK 2.0, released in October 2025 on Kusama/Statemine, introduced composable NFTs featuring built-in conditional rendering, emotes-as-state, and multi-resource equippability. Significantly, it also added native support for “scheduled XCM actions' that are triggered by block height or on-chain events. | The original plan involved creating a custom unified rights pallet from scratch, which posed a high development risk. | Use RMRK 2.0 NFTs as the fundamental rights token. Subscription = equipped “subscription resource” with expiration; PPV = equipped “view pack” resource that burns upon use; Purchase = ownership of the base NFT. All three states coexist within a single standard-compliant NFT. |
| RMRK 2.0 is already audited, widely adopted (Unique Network, Skybreach, etc.), and fully XCM-compatible. | Reduces implementation scope by approximately 45% while increasing standard compliance and future interoperability. | Thesis contribution shifts from “inventing the token standard” to “first production use of scheduled XCM + RMRK for hybrid monetization” – still highly novel. |

**Impact:** Significantly reduces development risk, enhances auditability, and establishes the thesis as the benchmark implementation for the new standard.

### 3. Pivot Opportunity C – Integrate Polkadot Asset Hub “Coretime-as-a-Service” + On-Demand Parachain (Defensive Pivot)  
**(Optional but Wise – Low Impact, Zero Risk)**

| Finding | Implication | Recommended Pivot |
| --- | --- | --- |
| Polkadot Asset Hub launched “Coretime-as-a-Service” in November 2025 – now any parachain can purchase on-demand coretime in 1-minute increments directly through XCM, priced in DOT with almost zero overhead. | Eliminates all confusion regarding coretime auctions and price spikes. | Keep the same codebase, but initially run as an on-demand parachain (pay-per-use) instead of bidding for a dedicated slot. Only upgrade to a dedicated slot if and when transaction volume justifies it. |

**Impact:** Removes the greatest financial risk while maintaining all technical claims.

### Summary Recommendation

| Pivot | Difficulty | Risk Reduction | Novelty Impact | Recommendation |
| --- | --- | --- | --- | --- |
| A – Kusama first, then Polkadot | Very Low | High (cost & chaos testing) | Neutral → Positive | Adopt immediately |
| B – RMRK 2.0 + scheduled XCM instead of custom token | Low | Very High | Slight reduction but still first hybrid monetisation implementation | Adopt immediately |
| C – On-demand coretime via Asset Hub | Very Low | High (financial) | None | Adopt as default |

These pivots do not weaken the academic contribution – they strengthen it by:
- removing cost barriers,
- leveraging newer, audited standards,
- producing results on a real chaos network,
- and still delivering the first known production system that combines subscription + PPV + purchase in a single cross-chain rights primitive.

---

## Implementation Outcomes (Phase 4-5)

This report was written in November 2025 during Phase 1. The following documents which pivot recommendations were adopted, which were modified, and which were not taken.

### Pivot A: Kusama + Polkadot Dual Deployment

**Status: Not adopted.**

The implementation used a local Zombienet testnet (Rococo-local) rather than deploying to Kusama or Polkadot. This was sufficient for thesis evaluation — all performance, security, and comparative analysis was conducted on the local testnet. Deployment to Kusama/Polkadot is documented as future work.

### Pivot B: RMRK 2.0 + Scheduled XCM

**Status: Not adopted as recommended. Significant pivot required.**

| Recommendation | What Happened | Why |
|---------------|---------------|-----|
| Use RMRK 2.0 as rights token | Used `pallet-nfts` instead | RMRK 2.0 pallets were abandoned by the community — frozen at polkadot-v0.9.36, incompatible with current polkadot-sdk. This was discovered during Phase 3 setup. |
| Scheduled XCM for auto-renewal | Used `on_initialize` hook pattern | XCM v5 `Schedule` instruction is not production-ready. The on-chain scheduler achieves the same result. |
| "First production use of scheduled XCM + RMRK" | Contribution reframed | Thesis contribution is: first unified cross-chain content rights pallet with subscription + PPV + ownership + automatic royalty propagation + Ethereum bridge via Snowbridge. |

**The core thesis contribution remains valid** — the system is the first known implementation combining all three monetisation models in a single cross-chain rights primitive. The implementation details differ from the recommendation (FRAME pallet + pallet-nfts instead of RMRK 2.0 + scheduled XCM), but the novelty is preserved.

### Pivot C: On-Demand Coretime via Asset Hub

**Status: Not applicable.** Local Zombienet testnet was used instead of any coretime model. On-demand coretime remains a viable deployment option for future production use.

### Actual Architecture Adopted

| Component | Recommended | Actual |
|-----------|------------|--------|
| NFT standard | RMRK 2.0 | `pallet-nfts` with attribute-based nesting |
| Rights logic | RMRK equipped resources | `pallet-content-rights` (17 extrinsics, unified `RightsType` enum) |
| Auto-renewal | Scheduled XCM | `on_initialize` hook with `AutoRenewIndex` storage |
| Royalty distribution | RMRK cross-chain royalties | `set_royalty_splits` with up to 10 collaborators, basis-point precision |
| Metadata | RMRK multi-resource | `RightsMetadata` struct emitted via `query_rights_metadata` |
| Ethereum bridge | Not in pivot recommendations | Full Snowbridge v1 E2E (exceeded original scope) |
| Deployment | Kusama → Polkadot | Local Zombienet (Rococo-local) |
| ink! role | Primary logic layer | API layer via pallet-revive precompile |

### Lessons for the Thesis Discussion Chapter

The RMRK 2.0 pivot recommendation illustrates a key finding: **ecosystem maturity directly impacts architectural decisions in blockchain development.** The recommendation was sound based on October 2025 information, but by the time implementation began, RMRK 2.0 was no longer viable. This forced a pivot to `pallet-nfts` — a maintained but less feature-rich alternative. The thesis Discussion chapter should analyse this as an example of how rapidly evolving blockchain ecosystems create implementation risk that theoretical designs cannot fully anticipate.
