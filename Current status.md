## Current status

**content-rights-parachain**

- Parachain with **pallet-revive** (ink! 6)
- Zombienet, Flipper deploy/call
- No custom content-rights pallet
- No RMRK integration
- No CCRMS contracts

**Thesis design (Phase 3)**

- **RightsManager**, **SubscriptionHandler**, **PayPerViewHandler**, **PurchaseVerifier** (interfaces defined)
- **RMRK 2.0** for unified rights tokens (Content NFT, Subscription Resource, View Pack, Ownership NFT)
- **XCM** for renewals, **Snowbridge** for Ethereum
- Chain extensions for contracts ↔ RMRK pallet

---

## Next implementation steps

**1. RMRK 2.0 on the parachain**

First step is to decide how to implement the RMRK layer:

- Check whether there is a Substrate pallet for RMRK 2.0 (e.g. `pallet-rmrk`, `rmrk-core`) we can integrate.
- If not, implement a small **content-rights pallet** that matches the design:
  - Content registration (content ID, metadata hash, creator)
  - Subscription state (expiry, etc.)
  - PPV counter (views remaining)
  - Ownership + perpetual access

**2. First ink! 6 contract (RightsManager skeleton)**

- Create a minimal **RightsManager** contract (ink! 6, pallet-revive)
- Implement `mint_content_rights` and `check_access` with simple storage (no RMRK yet)
- Deploy and call via Contracts UI
- Add chain extensions later once the pallet exists

**3. Chain extensions**

- Implement runtime chain extensions so contracts can call into the RMRK/content-rights pallet

**4. XCM and bridges**

- Implement scheduled XCM and bridge flows per Phase 3 design (later in the implementation)

---

## Practical starting point

A practical first step is:

1. **Look for an existing RMRK 2.0 pallet** in the Polkadot/RMRK ecosystem.
2. In parallel, **add a minimal RightsManager ink! 6 contract** in `content-rights-parachain` (simple storage, no pallet dependency yet).

That gives you an early contract running on pallet-revive while you sort out RMRK versus custom pallet.

Do you want to start with researching and integrating RMRK, or with scaffolding the RightsManager contract?

There **are RMRK 2.0 pallets** for the Substrate / Polkadot ecosystem, but they are **not usually packaged as a single “pallet-rmrk2”**. Instead, the RMRK 2.0 protocol is implemented as **a set of pallets that together implement the NFT 2.0 standard**. ([RMRKable Hacktoberfest][1])

## RMRK 2.0 pallets (Substrate implementation)

The Substrate implementation of **RMRK 2.0** typically includes several pallets:

1. **Core pallet**
   
   * Handles the main NFT logic.
   * Supports **nested NFTs** and **multi-resource NFTs**.

2. **Equippable pallet**
   
   * Allows NFTs to **equip other NFTs** (e.g., avatar wearing items).

3. **Base pallet**
   
   * Defines **slot / equipment rules** for NFTs.

4. **Emotes pallet**
   
   * Lets accounts react to NFTs with emojis or reactions. ([RMRKable Hacktoberfest][1])

Together these pallets provide the “NFT lego” system that RMRK 2.0 is known for—allowing NFTs to own other NFTs, have multiple representations, evolve, and be conditionally rendered. ([ChainSafe][2])

## GitHub repository with Substrate pallets

There is a Substrate reference implementation called:

* **`rmrk-substrate`**

It contains the runtime and pallets used to run RMRK-style NFTs on a Substrate chain. The runtime is composed using the normal Substrate `construct_runtime!` macro with these pallets included. ([RustRepo][3])

Typical repo structure:

```
rmrk-substrate/
 ├── node/
 ├── runtime/
 └── pallets/
     ├── rmrk-core
     ├── rmrk-equip
     ├── rmrk-base
     └── rmrk-emotes
```

These pallets can be imported into any **Substrate-based chain runtime** and integrated like any other FRAME pallet.

## Important context

Originally:

* Early **RMRK 1.0** ran as **remark-based metadata on Kusama** (a “chain graffiti” approach).
* **RMRK 2.0** moved toward **proper pallets and smart-contract implementations**. ([describedot.com][4])

RMRK 2.0 now exists in **three main implementations**:

1. **Substrate pallets (Rust)**
2. **EVM Solidity contracts**
3. **ink! smart contracts for Polkadot smart-contract chains** ([describedot.com][4])

---

 **Short answer:**
The RMRK 2.0 pallet implementation exists, but it’s actually a **suite of pallets** (`rmrk-core`, `rmrk-equip`, `rmrk-base`, `rmrk-emotes`) rather than a single pallet.

---

[1]: https://rmrk.devpost.com/?utm_source=chatgpt.com "RMRKable Hacktoberfest: Expand Kusama's NFT ecosystem by building apps, tools, dashboards on the most advanced NFT protocol in the world - Devpost"
[2]: https://blog.chainsafe.io/ui-demo-rmrk-nfts-with-the-filecoin-substrate-bridge/?utm_source=chatgpt.com "UI Demo: RMRK NFTs with the Filecoin-Substrate Bridge"
[3]: https://rustrepo.com/repo/rmrk-team-rmrk-substrate?utm_source=chatgpt.com "Eternally liquid. Forward compatible. Nested, conditional, & Multi-resourced NFTs."
[4]: https://www.describedot.com/polkadot/an-overview-of-nfts-understanding-non-fungible-tokens/?utm_source=chatgpt.com "Polkadot NFTs: Understanding Non-Fungible Tokens | NFT | DescribeDot"

---

Here’s what the RMRK repo implies for your setup.

---

## Version mismatch

**rmrk-substrate** targets an older stack:

- Substrate branch: **polkadot-v0.9.36** (≈2022)
- Dependencies: `frame-support` 4.0, `frame-system` 4.0, `pallet-uniques`, `pallet-balances` from the old Substrate repo
- Uses: `rmrk-traits`, `pallet-rmrk-core`, `pallet-rmrk-equip`, `pallet-rmrk-market`

**content-rights-parachain** uses a current stack:

- **polkadot-sdk** (from git, recent)
- Different frame layout, naming, and APIs

So the RMRK pallets are not drop‑in compatible: you can’t add them as deps without porting work.

---

## Options

**1. Port RMRK pallets to polkadot-sdk**

- Rewrite RMRK pallets to use polkadot-sdk instead of Substrate `polkadot-v0.9.36`
- Update `frame-support`, `frame-system`, `sp-*`, `pallet-uniques` (or `pallet-nfts`), etc.
- Non‑trivial effort and maintenance

**2. Check maintained forks**

- Search for Ajuna, Astar, or others who forked rmrk-substrate and may have updated it
- If a fork already targets polkadot-sdk or a recent Polkadot release, integration could be easier

**3. Minimal content-rights pallet (recommended for thesis)**

- Add a small custom pallet that implements what the thesis needs:
  - Content registration
  - Subscription state (expiry, renewal)
  - PPV view counter
  - Ownership + perpetual access
- Implement only the parts needed for your RightsManager and handlers
- Keeps scope and schedule manageable for a thesis

---

### 1. What “version mismatch” means here

Your **parachain repo** uses the *new* Polkadot SDK stack:

- `polkadot-sdk = { git = "https://github.com/paritytech/polkadot-sdk.git", ... }`
- FRAME and pallets are pulled from this **monorepo** (new architecture).
- Versions are 2024–2026 era (what pallet‑revive / ink! 6 expect).

The **rmrk-substrate** pallets use an **old, pre‑SDK stack**:

- Every dependency is pinned to `polkadot-v0.9.36` branches of the old `substrate` repo:
  - `frame-support = 4.0.0-dev, git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.36"`
  - same for `frame-system`, `sp-runtime`, `pallet-balances`, `pallet-uniques`, etc.

Those are effectively **two different worlds**:

- Different crate graph, different `sp-*` / `frame-*` versions.
- APIs and types have changed.
- You **must not** mix “old Substrate git deps” with “new polkadot-sdk git deps” in the same runtime; you’ll hit:
  - duplicate types (`sp_runtime::RuntimeVersion` from two crates),
  - conflicting trait bounds,
  - linker errors / “multiple definitions”,
  - or dependency resolution failures.

So “drop rmrk-substrate into content-rights-parachain” is not just a config issue; it’s effectively trying to compile **two incompatible Substrate versions together**.

---

### 2. What would have to happen to use “real” RMRK pallets

Someone needs to:

1. **Port rmrk-substrate to polkadot-sdk**:
   - Change all `git = "https://github.com/paritytech/substrate.git", branch = "polkadot-v0.9.36"` deps to the `polkadot-sdk` monorepo (and correct versions).
   - Update imports and APIs wherever FRAME / SP changed.
   - Make it compile against a modern polkadot-sdk release.
2. Or provide a **new RMRK pallet implementation** that already targets polkadot-sdk.

That’s non‑trivial work, but absolutely feasible if a team maintains it.

---

### 3. What you need to find/decide

So, concretely, you need:

- **One of:**
  - A **modern RMRK pallet** that works with polkadot-sdk, or
  - A **clear statement** from Parity/RMRK that “there is no current port; use pallet‑nfts / custom pallet instead.”

Once we have that:

- If a port exists → we wire it into `content-rights-parachain` and your ink! 6 contracts.
- If not → we implement a **minimal nested‑NFT / rights pallet** that matches your RMRK 2.0 concepts (Content NFT, child resources, equip, ownership) and clearly document in the thesis that it is a **RMRK‑inspired nested NFT implementation on polkadot‑sdk**.# Is there an officially supported or recommended way to use RMRK‑style nested NFTs on a current polkadot-sdk chain (with pallet‑revive / ink! 6)?

## No single officially-supported path exists

There is no blessed, production-ready, officially-maintained solution that bridges RMRK-style nested NFTs directly to `pallet-revive` / ink! 6 as a first-class combo. What exists is a patchwork of options, each with real caveats.

---

## The three realistic approaches

### 1. RMRK's own Substrate pallet — stalled and deprecated-adjacent

The `rmrk-team/rmrk-substrate` repo exists and implements nested/multi-resource/equippable NFTs as FRAME pallets. Its initial implementation extends the Substrate Uniques pallet as a low-level NFT dependency, with mechanics based on the RMRK 2 standard. The problem: `pallet-uniques` is itself deprecated in favor of `pallet-nfts`, the pallet repo is marked **[WIP]**, and there has been no meaningful update to bring it in line with current polkadot-sdk. It predates `pallet-revive` entirely and has no ink! 6 integration.

### 2. RMRK EVM contracts via `pallet-revive` — the most viable current path

RMRK's active development has shifted almost entirely to EVM. Their modular NFT system is expressed as ERCs: ERC-5773 (multi-asset), ERC-7401 (parent-governed nestable, the successor to ERC-6059), ERC-6220 (composable/equippable), ERC-6454 (soulbound), ERC-7508 (dynamic attributes), and ERC-7590 (ERC-20 holder extension). RMRK publishes open-source Solidity implementations of all of these at `rmrk-team/evm-contracts`.

`pallet-revive` accepts RISC-V binaries and currently supports ink! (Rust) and Solidity via Parity's `revive` compiler. This means you can take RMRK's Solidity EVM contracts, compile them with `revive`, and deploy on any `pallet-revive`-enabled chain. This is currently the most tractable route, but it is **not an officially packaged integration** — you're composing two independent things yourself.

You can also build an ink! contract that speaks Solidity ABI at the edges, letting MetaMask and Solidity contracts interoperate, while using SCALE internally. This dual-ABI pattern means you could write a nestable NFT contract in ink! 6 that is compatible with the RMRK ERC-7401 interface at the ABI level, though implementing the full RMRK standard from scratch in ink! is non-trivial.

### 3. Unique Network pallet — the most polished native nesting story

If you're choosing your chain, not inheriting one, this is the ecosystem's most complete out-of-the-box answer for NFT 2.0 features. Unique Network creates NFTs as independent addressable objects that can receive and contain other NFTs, forming parent/child relationships through simple transfers rather than complex contracts. Key capabilities include nested NFT bundles, arbitrary metadata, multi-asset NFTs, controlled attribute mutability, and fractionalization. It also has EVM-Substrate interoperability that maps addresses to the Substrate address space, allowing direct interaction between EVM applications and native Substrate objects without intermediary contracts.

This is not RMRK-branded, but functionally covers the same use cases and is actively maintained.

---

## The structural gap

The specific combination you asked about — **RMRK semantics + pallet-revive + ink! 6** — has no official integration because:

- RMRK's team pivoted to EVM/ERC standards and largely abandoned the Substrate pallet path
- `pallet-revive` is still relatively new (PolkaVM/revive toolchain is production-usable but the ecosystem is young)
- `pallet-nfts` on Asset Hub has no native nesting, and `pallet-revive` contracts exist alongside it without a sanctioned bridge

**Practical recommendation by goal:**

| Goal                                          | Best option                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Native pallet-level nesting on your own chain | Unique Network pallet                                                              |
| RMRK feature set on a pallet-revive chain     | Deploy RMRK Solidity contracts via `revive`                                        |
| ink! 6 contract with nesting                  | Implement ERC-7401 interface in ink! manually; no off-the-shelf library exists yet |
| Existing RMRK ecosystem compatibility         | RMRK EVM on Moonbeam/Moonriver (bypasses pallet-revive entirely)                   |

The RMRK team's own documentation only lists EVM implementations under their nestable NFT spec — the Substrate pallet path is not something they're actively guiding builders toward as of early 2026.

# Is there a maintained fork of rmrk-substrate already updated to a recent Polkadot SDK?

**The canonical repo is frozen.** `rmrk-team/rmrk-substrate` still carries its "[WIP]" label in the README with the explicit disclaimer: "Warning: No stability and security guarantees. Not production ready." It hasn't seen meaningful commits in over two years, and it still depends on `pallet-uniques` as its underlying NFT primitive — the pallet that Parity itself deprecated in favour of `pallet-nfts`.

**Known forks are worse, not better.** The two forks that surface in searches are `Portalverse-Network/Rmrk-Substrate` (appears to be an unmodified mirror) and `cryply/rmrk-palletes`, which is explicitly 445 commits behind `rmrk-team:main` — meaning it's even further behind the already-stale upstream. Neither has touched the polkadot-sdk amalgamated repo structure, `pallet-nfts`, or anything resembling `stable2409`/`stable2506` dependencies.

**The RMRK team's own GitHub activity confirms the pivot.** Looking at their org page, recent activity is concentrated on TypeScript tooling: `rmrk-examples` (Jan 2025), `rmrk-evm-minting-scripts` (Nov 2024), `rmrk-composable-nft-creator` (Oct 2024), and `rmrk-js` (Sep 2024). All EVM-side. The Substrate pallet repo has no corresponding recent activity.

**What would a port actually require?** This is worth knowing if you're considering doing it yourself. A proper update to current polkadot-sdk would need to:

1. Replace all `pallet-uniques` imports and trait bounds with `pallet-nfts` equivalents — the APIs are substantially different
2. Migrate from the old separate `substrate`/`polkadot`/`cumulus` repos to the unified `paritytech/polkadot-sdk` workspace and its `stableYYMM` versioning
3. Update FRAME macro usage, weight annotations, and `RuntimeCall`/`RuntimeOrigin` patterns that changed significantly post-Substrate 4.x
4. Resolve the dual-ownership sync problem (the `rmrk-owner` vs `unique-owner` issue documented in their own issues) with `pallet-nfts`'s different ownership model
5. Add benchmarks, which the WIP repo largely lacked

That's a substantial but not impossible project — roughly a 2–4 week effort for someone already fluent in FRAME. But nobody appears to have done it publicly, and given RMRK's own team has fully moved on to EVM, it's unlikely to appear from them.

**Practical bottom line:** If you need this today and can't build on Unique Network's pallet, the most realistic path is implementing nesting semantics directly in `pallet-nfts` using its `set_attribute`/delegation features to store parent/child relationships as on-chain attributes, without the full RMRK multi-resource/equippable spec — or deploying RMRK's Solidity contracts (ERC-7401 + ERC-5773 + ERC-6220) via the `revive` compiler on a `pallet-revive` chain.

# **For a new project in 2026, would you recommend:**

### - Using a ported RMRK pallet on polkadot-sdk,

### - Building nested NFTs on top of **pallet‑nfts** or other SDK primitives,

### - Or using **ink! contracts** to model RMRK‑like nesting on pallet‑revive (without a full pallet integration)?

Here's a direct recommendation, not a "it depends" non-answer.

---

## Recommendation: Option 2 — build on `pallet-nfts` primitives

For most new projects in 2026, this is the right call. Here's the reasoning for each option:

---

### Option 1: Port the RMRK pallet — avoid this

The cost-to-benefit is poor. You'd be taking on a 2–4 week porting effort (minimum) to produce something that:

- Has no upstream maintainer, so every future polkadot-sdk stable release becomes your problem
- Carries the dual-ownership sync bugs documented in the original repo's own issues, which aren't trivially solved against `pallet-nfts`'s different ownership model
- Gives you RMRK 2 semantics, not the current ERC-7401/ERC-5773/ERC-6220 standard set that the broader tooling ecosystem (Singular, rmrk-js, etc.) has moved to
- Produces something with no marketplace, indexer, or wallet support out of the box

The only scenario where this makes sense is if you're joining an existing live chain that already has deployed RMRK pallet state and needs to migrate forward. For greenfield work, it's the worst of all worlds.

---

### Option 2: Build on `pallet-nfts` — recommended for most projects

`pallet-nfts` gives you more than people typically realize. The key primitives you can compose for nesting:

**Parent/child relationships** can be modelled as typed on-chain attributes. You store a `parent` attribute on a child item and maintain a `children` collection-level index on the parent. This is not as elegant as a purpose-built nesting pallet, but it's auditable, indexable, and doesn't require a separate ownership layer.

**The `set_attribute` delegation model** (`Admin`, `CollectionOwner`, `ItemOwner`) maps well onto the RMRK concept of who can accept/reject child NFTs — the parent NFT's owner controls acceptance, the child NFT's owner initiates the transfer.

**Soul-bound nesting** (RMRK's "cannot be unnested" children) maps onto `lock_item_transfer` on the child item after nesting it.

What you give up relative to full RMRK: you lose the multi-resource/multi-asset system (ERC-5773 equivalent) and the equippable slot/BASE system (ERC-6220 equivalent) unless you build them yourself. For many use cases — gaming inventories, credential bundles, composable identities — you don't actually need equippables, and multi-resource can be approximated with multiple attributes pointing to different URIs.

**The concrete upside:** you get Polkadot fellowship support, Asset Hub compatibility, KodaDot/Chaotic marketplace indexing, XCM transferability (RFC-0125 metadata alignment is in progress), and no maintenance cliff when the next stable SDK release drops.

---

### Option 3: ink! contracts on `pallet-revive` — right choice only in specific circumstances

This is the correct option if:

- Your chain doesn't control its own runtime (you're deploying to a shared smart contract chain like a future Asset Hub with `pallet-revive`, or a third-party chain)
- You want EVM ABI compatibility so that Solidity tooling (ethers.js, Hardhat, MetaMask) can interact with your NFTs without adapters
- You need to iterate on the nesting logic post-launch without runtime upgrades

The downside is real though. ink! contracts on `pallet-revive` sit one layer above the chain's native storage, which means: higher per-call costs, no direct XCM integration without precompile support from the chain, and you're outside the `pallet-nfts` ecosystem entirely (no Polkadot-native marketplace will index your contract NFTs automatically). The `pallet-revive`/PolkaVM toolchain is also still maturing — you'd be an early adopter in 2026, not on stable ground.

If you go this route, use RMRK's existing Solidity implementations (ERC-7401 + ERC-5773) compiled with `revive` rather than writing from scratch. The contracts are open source and battle-tested on EVM chains already.

---

## Decision tree in short

```
Do you control the chain runtime?
├── No  → Option 3 (ink!/pallet-revive, use RMRK Solidity contracts)
└── Yes
    ├── Do you need full equippables + multi-resource?
    │   ├── No  → Option 2 (pallet-nfts, model nesting as attributes)
    │   └── Yes
    │       ├── Gaming-heavy with XCM needs? → Option 2 + custom equip pallet layer
    │       └── EVM ecosystem compatibility matters? → Option 3
    └── Are you migrating an existing RMRK deployment?
        └── Yes → Option 1 (the one justified case for the port)
```

For a genuinely new 2026 project on a chain you control, Option 2 is the right foundation — the SDK is actively maintained, the ecosystem tooling aligns with it, and the nesting semantics you need are achievable without carrying a forked pallet as permanent debt.

# Is it acceptable to implement **RMRK semantics** (nested, multi‑resource NFTs) in a custom pallet / contract layer **inspired by RMRK 2.0**, rather than integrating the exact historical `rmrk-substrate` pallets?

Yes, absolutely — and it's arguably the *correct* interpretation of what RMRK was always meant to be.

## Why this is fine, technically and philosophically

**RMRK was always a spec, not a mandatory implementation.** The rmrk-substrate repo was one reference implementation of the RMRK 2.0 standard, not the canonical artifact you must inherit. The spec itself defines the *semantics* — what it means for an NFT to own another NFT, what a resource is, how acceptance/rejection works — not the specific Rust types or storage layouts you must use. Building something "inspired by RMRK 2.0" that faithfully implements those semantics is entirely legitimate.

**The EVM side already does this.** RMRK's own team extracted the core concepts into ERC-7401 (nesting), ERC-5773 (multi-asset), and ERC-6220 (equippables) precisely so that implementations across chains and languages could conform to the *interface* without copying the original code. A custom pallet or contract that implements the same logical interface is a conformant implementation.

**The historical pallets are not stable reference material anyway.** They carry internal design debt (the dual-ownership sync problem), depend on a deprecated pallet, and were never production-stamped. Treating them as sacred would be a mistake even if you wanted to.

---

## What "inspired by RMRK 2.0" should preserve to be meaningful

If you want the label to carry weight — interoperability, tooling compatibility, recognizable semantics — there are a handful of invariants worth keeping:

**Nesting invariants (ERC-7401 / RMRK Nestable):**

- A child NFT can only have one parent at a time
- Transferring into a parent is a two-step process: the sender initiates, the parent's owner accepts (or rejects) — this prevents griefing
- The owner of a parent controls all descendants for transfer/burn purposes
- A child can be "abandoned" (rejected without requiring the child owner's signature)

**Multi-resource invariants (ERC-5773 / RMRK MultiAsset):**

- Resources are added by the collection issuer and must be accepted by the NFT owner before becoming active
- Priority ordering of resources is set by the owner, not the issuer
- Resources are identified independently, not by position

**What you can freely change:**

- Storage layout (how you index children, how you store resource lists)
- The specific type system and Rust structs
- Whether you use `pallet-nfts` underneath or build standalone
- Weight/fee model
- Whether equippables are in scope at all (many projects only need nesting + multi-resource)

---

## The one practical caveat

If you want **ecosystem interoperability** — meaning Singular marketplace, rmrk-js SDK, or existing RMRK indexers to recognise your NFTs — you need to emit compatible events and metadata, not just implement the logic correctly internally. The RMRK 2.0 spec defines specific interaction patterns that off-chain indexers look for. If cross-ecosystem indexing matters, study what Singular's indexer actually consumes and treat that as your interface contract, regardless of how your internals are built.

If you're building for your own chain and your own tooling, this constraint doesn't apply and you have full freedom of implementation.

---

**Short answer:** implementing RMRK semantics in a fresh custom pallet built on current polkadot-sdk primitives, faithful to the logical spec but not the historical code, is not just acceptable — it's the approach the ecosystem's own evolution points toward.

---

# Is there an officially supported or recommended way to use RMRK‑style nested NFTs on a current polkadot-sdk chain (with pallet‑revive / ink! 6)?

## No single officially-supported path exists

There is no blessed, production-ready, officially-maintained solution that bridges RMRK-style nested NFTs directly to `pallet-revive` / ink! 6 as a first-class combo. What exists is a patchwork of options, each with real caveats.

---

## The three realistic approaches

### 1. RMRK's own Substrate pallet — stalled and deprecated-adjacent

The `rmrk-team/rmrk-substrate` repo exists and implements nested/multi-resource/equippable NFTs as FRAME pallets. Its initial implementation extends the Substrate Uniques pallet as a low-level NFT dependency, with mechanics based on the RMRK 2 standard. The problem: `pallet-uniques` is itself deprecated in favor of `pallet-nfts`, the pallet repo is marked **[WIP]**, and there has been no meaningful update to bring it in line with current polkadot-sdk. It predates `pallet-revive` entirely and has no ink! 6 integration.

### 2. RMRK EVM contracts via `pallet-revive` — the most viable current path

RMRK's active development has shifted almost entirely to EVM. Their modular NFT system is expressed as ERCs: ERC-5773 (multi-asset), ERC-7401 (parent-governed nestable, the successor to ERC-6059), ERC-6220 (composable/equippable), ERC-6454 (soulbound), ERC-7508 (dynamic attributes), and ERC-7590 (ERC-20 holder extension). RMRK publishes open-source Solidity implementations of all of these at `rmrk-team/evm-contracts`.

`pallet-revive` accepts RISC-V binaries and currently supports ink! (Rust) and Solidity via Parity's `revive` compiler. This means you can take RMRK's Solidity EVM contracts, compile them with `revive`, and deploy on any `pallet-revive`-enabled chain. This is currently the most tractable route, but it is **not an officially packaged integration** — you're composing two independent things yourself.

You can also build an ink! contract that speaks Solidity ABI at the edges, letting MetaMask and Solidity contracts interoperate, while using SCALE internally. This dual-ABI pattern means you could write a nestable NFT contract in ink! 6 that is compatible with the RMRK ERC-7401 interface at the ABI level, though implementing the full RMRK standard from scratch in ink! is non-trivial.

### 3. Unique Network pallet — the most polished native nesting story

If you're choosing your chain, not inheriting one, this is the ecosystem's most complete out-of-the-box answer for NFT 2.0 features. Unique Network creates NFTs as independent addressable objects that can receive and contain other NFTs, forming parent/child relationships through simple transfers rather than complex contracts. Key capabilities include nested NFT bundles, arbitrary metadata, multi-asset NFTs, controlled attribute mutability, and fractionalization. It also has EVM-Substrate interoperability that maps addresses to the Substrate address space, allowing direct interaction between EVM applications and native Substrate objects without intermediary contracts.

This is not RMRK-branded, but functionally covers the same use cases and is actively maintained.

---

## The structural gap

The specific combination you asked about — **RMRK semantics + pallet-revive + ink! 6** — has no official integration because:

- RMRK's team pivoted to EVM/ERC standards and largely abandoned the Substrate pallet path
- `pallet-revive` is still relatively new (PolkaVM/revive toolchain is production-usable but the ecosystem is young)
- `pallet-nfts` on Asset Hub has no native nesting, and `pallet-revive` contracts exist alongside it without a sanctioned bridge

**Practical recommendation by goal:**

| Goal                                          | Best option                                                                        |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Native pallet-level nesting on your own chain | Unique Network pallet                                                              |
| RMRK feature set on a pallet-revive chain     | Deploy RMRK Solidity contracts via `revive`                                        |
| ink! 6 contract with nesting                  | Implement ERC-7401 interface in ink! manually; no off-the-shelf library exists yet |
| Existing RMRK ecosystem compatibility         | RMRK EVM on Moonbeam/Moonriver (bypasses pallet-revive entirely)                   |

The RMRK team's own documentation only lists EVM implementations under their nestable NFT spec — the Substrate pallet path is not something they're actively guiding builders toward as of early 2026.

# Is there a maintained fork of rmrk-substrate already updated to a recent Polkadot SDK?

**The canonical repo is frozen.** `rmrk-team/rmrk-substrate` still carries its "[WIP]" label in the README with the explicit disclaimer: "Warning: No stability and security guarantees. Not production ready." It hasn't seen meaningful commits in over two years, and it still depends on `pallet-uniques` as its underlying NFT primitive — the pallet that Parity itself deprecated in favour of `pallet-nfts`.

**Known forks are worse, not better.** The two forks that surface in searches are `Portalverse-Network/Rmrk-Substrate` (appears to be an unmodified mirror) and `cryply/rmrk-palletes`, which is explicitly 445 commits behind `rmrk-team:main` — meaning it's even further behind the already-stale upstream. Neither has touched the polkadot-sdk amalgamated repo structure, `pallet-nfts`, or anything resembling `stable2409`/`stable2506` dependencies.

**The RMRK team's own GitHub activity confirms the pivot.** Looking at their org page, recent activity is concentrated on TypeScript tooling: `rmrk-examples` (Jan 2025), `rmrk-evm-minting-scripts` (Nov 2024), `rmrk-composable-nft-creator` (Oct 2024), and `rmrk-js` (Sep 2024). All EVM-side. The Substrate pallet repo has no corresponding recent activity.

**What would a port actually require?** This is worth knowing if you're considering doing it yourself. A proper update to current polkadot-sdk would need to:

1. Replace all `pallet-uniques` imports and trait bounds with `pallet-nfts` equivalents — the APIs are substantially different
2. Migrate from the old separate `substrate`/`polkadot`/`cumulus` repos to the unified `paritytech/polkadot-sdk` workspace and its `stableYYMM` versioning
3. Update FRAME macro usage, weight annotations, and `RuntimeCall`/`RuntimeOrigin` patterns that changed significantly post-Substrate 4.x
4. Resolve the dual-ownership sync problem (the `rmrk-owner` vs `unique-owner` issue documented in their own issues) with `pallet-nfts`'s different ownership model
5. Add benchmarks, which the WIP repo largely lacked

That's a substantial but not impossible project — roughly a 2–4 week effort for someone already fluent in FRAME. But nobody appears to have done it publicly, and given RMRK's own team has fully moved on to EVM, it's unlikely to appear from them.

**Practical bottom line:** If you need this today and can't build on Unique Network's pallet, the most realistic path is implementing nesting semantics directly in `pallet-nfts` using its `set_attribute`/delegation features to store parent/child relationships as on-chain attributes, without the full RMRK multi-resource/equippable spec — or deploying RMRK's Solidity contracts (ERC-7401 + ERC-5773 + ERC-6220) via the `revive` compiler on a `pallet-revive` chain.

# **For a new project in 2026, would you recommend:**

### - Using a ported RMRK pallet on polkadot-sdk,

### - Building nested NFTs on top of **pallet‑nfts** or other SDK primitives,

### - Or using **ink! contracts** to model RMRK‑like nesting on pallet‑revive (without a full pallet integration)?

Here's a direct recommendation, not a "it depends" non-answer.

---

## Recommendation: Option 2 — build on `pallet-nfts` primitives

For most new projects in 2026, this is the right call. Here's the reasoning for each option:

---

### Option 1: Port the RMRK pallet — avoid this

The cost-to-benefit is poor. You'd be taking on a 2–4 week porting effort (minimum) to produce something that:

- Has no upstream maintainer, so every future polkadot-sdk stable release becomes your problem
- Carries the dual-ownership sync bugs documented in the original repo's own issues, which aren't trivially solved against `pallet-nfts`'s different ownership model
- Gives you RMRK 2 semantics, not the current ERC-7401/ERC-5773/ERC-6220 standard set that the broader tooling ecosystem (Singular, rmrk-js, etc.) has moved to
- Produces something with no marketplace, indexer, or wallet support out of the box

The only scenario where this makes sense is if you're joining an existing live chain that already has deployed RMRK pallet state and needs to migrate forward. For greenfield work, it's the worst of all worlds.

---

### Option 2: Build on `pallet-nfts` — recommended for most projects

`pallet-nfts` gives you more than people typically realize. The key primitives you can compose for nesting:

**Parent/child relationships** can be modelled as typed on-chain attributes. You store a `parent` attribute on a child item and maintain a `children` collection-level index on the parent. This is not as elegant as a purpose-built nesting pallet, but it's auditable, indexable, and doesn't require a separate ownership layer.

**The `set_attribute` delegation model** (`Admin`, `CollectionOwner`, `ItemOwner`) maps well onto the RMRK concept of who can accept/reject child NFTs — the parent NFT's owner controls acceptance, the child NFT's owner initiates the transfer.

**Soul-bound nesting** (RMRK's "cannot be unnested" children) maps onto `lock_item_transfer` on the child item after nesting it.

What you give up relative to full RMRK: you lose the multi-resource/multi-asset system (ERC-5773 equivalent) and the equippable slot/BASE system (ERC-6220 equivalent) unless you build them yourself. For many use cases — gaming inventories, credential bundles, composable identities — you don't actually need equippables, and multi-resource can be approximated with multiple attributes pointing to different URIs.

**The concrete upside:** you get Polkadot fellowship support, Asset Hub compatibility, KodaDot/Chaotic marketplace indexing, XCM transferability (RFC-0125 metadata alignment is in progress), and no maintenance cliff when the next stable SDK release drops.

---

### Option 3: ink! contracts on `pallet-revive` — right choice only in specific circumstances

This is the correct option if:

- Your chain doesn't control its own runtime (you're deploying to a shared smart contract chain like a future Asset Hub with `pallet-revive`, or a third-party chain)
- You want EVM ABI compatibility so that Solidity tooling (ethers.js, Hardhat, MetaMask) can interact with your NFTs without adapters
- You need to iterate on the nesting logic post-launch without runtime upgrades

The downside is real though. ink! contracts on `pallet-revive` sit one layer above the chain's native storage, which means: higher per-call costs, no direct XCM integration without precompile support from the chain, and you're outside the `pallet-nfts` ecosystem entirely (no Polkadot-native marketplace will index your contract NFTs automatically). The `pallet-revive`/PolkaVM toolchain is also still maturing — you'd be an early adopter in 2026, not on stable ground.

If you go this route, use RMRK's existing Solidity implementations (ERC-7401 + ERC-5773) compiled with `revive` rather than writing from scratch. The contracts are open source and battle-tested on EVM chains already.

---

## Decision tree in short

```
Do you control the chain runtime?
├── No  → Option 3 (ink!/pallet-revive, use RMRK Solidity contracts)
└── Yes
    ├── Do you need full equippables + multi-resource?
    │   ├── No  → Option 2 (pallet-nfts, model nesting as attributes)
    │   └── Yes
    │       ├── Gaming-heavy with XCM needs? → Option 2 + custom equip pallet layer
    │       └── EVM ecosystem compatibility matters? → Option 3
    └── Are you migrating an existing RMRK deployment?
        └── Yes → Option 1 (the one justified case for the port)
```

For a genuinely new 2026 project on a chain you control, Option 2 is the right foundation — the SDK is actively maintained, the ecosystem tooling aligns with it, and the nesting semantics you need are achievable without carrying a forked pallet as permanent debt.

# Is it acceptable to implement **RMRK semantics** (nested, multi‑resource NFTs) in a custom pallet / contract layer **inspired by RMRK 2.0**, rather than integrating the exact historical `rmrk-substrate` pallets?

Yes, absolutely — and it's arguably the *correct* interpretation of what RMRK was always meant to be.

## Why this is fine, technically and philosophically

**RMRK was always a spec, not a mandatory implementation.** The rmrk-substrate repo was one reference implementation of the RMRK 2.0 standard, not the canonical artifact you must inherit. The spec itself defines the *semantics* — what it means for an NFT to own another NFT, what a resource is, how acceptance/rejection works — not the specific Rust types or storage layouts you must use. Building something "inspired by RMRK 2.0" that faithfully implements those semantics is entirely legitimate.

**The EVM side already does this.** RMRK's own team extracted the core concepts into ERC-7401 (nesting), ERC-5773 (multi-asset), and ERC-6220 (equippables) precisely so that implementations across chains and languages could conform to the *interface* without copying the original code. A custom pallet or contract that implements the same logical interface is a conformant implementation.

**The historical pallets are not stable reference material anyway.** They carry internal design debt (the dual-ownership sync problem), depend on a deprecated pallet, and were never production-stamped. Treating them as sacred would be a mistake even if you wanted to.

---

## What "inspired by RMRK 2.0" should preserve to be meaningful

If you want the label to carry weight — interoperability, tooling compatibility, recognizable semantics — there are a handful of invariants worth keeping:

**Nesting invariants (ERC-7401 / RMRK Nestable):**

- A child NFT can only have one parent at a time
- Transferring into a parent is a two-step process: the sender initiates, the parent's owner accepts (or rejects) — this prevents griefing
- The owner of a parent controls all descendants for transfer/burn purposes
- A child can be "abandoned" (rejected without requiring the child owner's signature)

**Multi-resource invariants (ERC-5773 / RMRK MultiAsset):**

- Resources are added by the collection issuer and must be accepted by the NFT owner before becoming active
- Priority ordering of resources is set by the owner, not the issuer
- Resources are identified independently, not by position

**What you can freely change:**

- Storage layout (how you index children, how you store resource lists)
- The specific type system and Rust structs
- Whether you use `pallet-nfts` underneath or build standalone
- Weight/fee model
- Whether equippables are in scope at all (many projects only need nesting + multi-resource)

---

## The one practical caveat

If you want **ecosystem interoperability** — meaning Singular marketplace, rmrk-js SDK, or existing RMRK indexers to recognise your NFTs — you need to emit compatible events and metadata, not just implement the logic correctly internally. The RMRK 2.0 spec defines specific interaction patterns that off-chain indexers look for. If cross-ecosystem indexing matters, study what Singular's indexer actually consumes and treat that as your interface contract, regardless of how your internals are built.

If you're building for your own chain and your own tooling, this constraint doesn't apply and you have full freedom of implementation.

---

**Short answer:** implementing RMRK semantics in a fresh custom pallet built on current polkadot-sdk primitives, faithful to the logical spec but not the historical code, is not just acceptable — it's the approach the ecosystem's own evolution points toward.
