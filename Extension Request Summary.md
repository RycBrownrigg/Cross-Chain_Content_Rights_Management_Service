**Summary of Delays — Thesis Extension Request**

**Project:** Cross-Chain Content Rights Management Service
**Student:** Ryc Brownrigg
**Program:** Masters in Blockchain and Distributed Ledger Technologies

---

The original thesis plan designed the system architecture around RMRK 2.0 nested NFTs as the unified rights token layer, with ink! smart contracts deployed on a Polkadot parachain. During implementation, several unforeseen technical obstacles required significant research, rework, and architectural pivots.

**1. RMRK 2.0 ecosystem abandonment.** The `rmrk-substrate` pallets — central to the original design — were found to be frozen on `polkadot-v0.9.36` (circa 2022), dependent on the deprecated `pallet-uniques`, and wholly incompatible with current `polkadot-sdk`. The RMRK team has pivoted entirely to EVM/Solidity and no maintained Substrate fork exists. This required a complete reassessment of the NFT layer, including researching whether any community forks had been updated, consulting Parity ecosystem guidance, and ultimately settling on an alternative approach using `pallet-nfts` with RMRK-inspired nesting semantics.

**2. ink! and pallet compatibility mismatch.** ink! 6 and its tooling (`cargo-contract` 6) target `pallet-revive` (PolkaVM), but the parachain was initially configured with `pallet-contracts` (WASM). This produced runtime API errors that were not immediately diagnosable. Resolving this required integrating `pallet-revive` into the runtime — a non-trivial change involving dependency management, runtime configuration, and revalidation of the entire contract deployment pipeline.

**3. Polkadot SDK infrastructure complexity.** Establishing a working local development environment — Zombienet spawning, relay chain worker configuration, runtime macro resolution, and collator node builds — required extensive troubleshooting. The toolchain is still maturing, documentation contains gaps, and many issues required trial-and-error resolution across multiple iterations.

**4. Compounding architectural redesign.** The RMRK abandonment and ink!/pallet incompatibility together meant the project had to evaluate three fundamentally different implementation paths before a viable architecture could be confirmed. This research and decision-making process, while ultimately productive, was not anticipated in the original timeline.

**Current status:** The parachain is operational with `pallet-revive` and ink! 6 contract deployment verified. The architectural direction is settled. The custom content-rights pallet and RightsManager contract remain to be implemented.
