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
