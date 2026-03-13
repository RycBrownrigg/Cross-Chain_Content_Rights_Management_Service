# Implementation Decisions & Design Rationale

**Project:** Cross-Chain Content Rights Management Service
**Student:** Ryc Brownrigg
**Document purpose:** Record of architectural decisions, design thinking, and testing for each implementation step. Intended as a thesis defense reference.

---

## Step 1: Add `pallet-nfts` to Runtime

**Date:** March 2026
**Commit:** `Add pallet-nfts to runtime for content rights NFT layer`

### Decision

Integrate `pallet-nfts` (Polkadot SDK's official NFT pallet) into the parachain runtime as the foundation for content rights tokens, rather than using RMRK 2.0 pallets or a standalone custom NFT implementation.

### Alternatives Considered

| Option | Verdict | Reasoning |
|--------|---------|-----------|
| **Port `rmrk-substrate` pallets** | Rejected | Frozen on `polkadot-v0.9.36` (2022), depends on deprecated `pallet-uniques`, no maintainer. Porting estimated at 2-4 weeks with ongoing maintenance burden. |
| **Use a maintained RMRK fork** | Rejected | No maintained fork exists. Known forks (`Portalverse-Network`, `cryply`) are further behind than upstream. |
| **Deploy RMRK Solidity contracts via `pallet-revive`** | Rejected | Would bypass native pallet integration, lose XCM transferability, and sit outside the `pallet-nfts` ecosystem (no marketplace indexing). |
| **Unique Network pallet** | Rejected | Most complete nesting story, but introduces a third-party dependency not part of the Polkadot SDK. Harder to justify in a thesis focused on SDK primitives. |
| **`pallet-nfts` with RMRK-inspired semantics** | **Accepted** | Actively maintained by Parity/Polkadot fellowship. Supports attributes, delegation, locking — sufficient to model parent/child nesting. Asset Hub compatible. No maintenance cliff. |

### Design Details

- Registered at **pallet index 42** in `construct_runtime!`
- Collection and Item IDs both use `u32`
- All pallet features enabled (`PalletFeatures::all_enabled()`)
- Deposits configured to reasonable values for a dev/test parachain
- `BlockNumberProvider = System` added (required by current polkadot-sdk, not documented in older examples)

### Testing

- **Build verification:** Full `cargo build --release -p parachain-template-node` succeeded
- No unit tests at this stage (pallet-nfts is upstream Polkadot SDK code; testing its integration happens in Step 2)

### Key Insight for Defense

The decision to use `pallet-nfts` rather than RMRK pallets was not a simplification — it was the architecturally correct choice for 2026. RMRK 2.0 was always a specification, not a mandatory implementation. The RMRK team themselves pivoted to EVM (ERC-7401/ERC-5773/ERC-6220). Building RMRK-inspired semantics on `pallet-nfts` is a conformant implementation of the same logical interface, using the ecosystem's actively maintained primitives.

---

## Step 2: Build `pallet-content-rights`

**Date:** March 2026

### Decision

Create a custom FRAME pallet (`pallet-content-rights`) that implements the thesis domain logic — content registration, subscriptions, pay-per-view, and permanent ownership — as a layer on top of `pallet-nfts`, with RMRK-inspired parent/child nesting.

### Architecture: Why a Pallet, Not Just Contracts

| Approach | Verdict | Reasoning |
|----------|---------|-----------|
| **Pure ink! contracts** | Rejected for core logic | Contracts on `pallet-revive` sit above native storage: higher per-call costs, no direct XCM integration, outside `pallet-nfts` ecosystem. Appropriate for user-facing access control (Step 3), not for the rights registry itself. |
| **Custom FRAME pallet** | **Accepted** | Direct access to `pallet-nfts` internal APIs (`do_mint`, `do_burn`, `do_create_collection`). Can be called via XCM. Native storage efficiency. Weights can be benchmarked. |
| **Hybrid (pallet + contract)** | Planned | The pallet holds the authoritative state; ink! contracts (Step 3) will provide the user-facing API via chain extensions. This separation matches the thesis design's RightsManager/SubscriptionHandler/PayPerViewHandler/PurchaseVerifier contract interfaces. |

### Design Decisions

#### Tight Coupling to `pallet-nfts`

The pallet's `Config` trait requires `pallet_nfts::Config<CollectionId = u32, ItemId = u32>`. This is a deliberate choice:

- **Pro:** Enables direct calls to `pallet_nfts::Pallet::<T>::do_mint()`, `do_burn()`, `do_create_collection()` without dispatching through the extrinsic layer.
- **Pro:** Compile-time guarantees that the runtime has `pallet-nfts` configured correctly.
- **Con:** Pins `CollectionId` and `ItemId` to `u32`. Acceptable for a thesis project where the runtime is fully controlled.
- **Trade-off with naming:** Both `pallet-nfts` and our pallet define `Currency` and `WeightInfo` associated types. Resolved by renaming ours to `PaymentCurrency` and `ContentRightsWeightInfo` to avoid ambiguity.

#### One Collection Per Content Item

Each call to `register_content` creates a new `pallet-nfts` collection. Item #0 in the collection is the "Content NFT" (parent). All rights tokens (subscriptions, view packs, ownership certificates) are minted as subsequent items in the same collection and nested under item #0.

- **Why per-content collections:** Isolates content items from each other. A creator's subscription tokens for Content A cannot interfere with Content B. Maps cleanly to the RMRK concept of a "collection = content, items = rights tokens".
- **Alternative considered:** Single global collection with content IDs as attributes. Rejected because it conflates ownership semantics and makes nesting ambiguous.

#### Nesting Implementation

RMRK-inspired nesting is implemented via two storage maps rather than `pallet-nfts` attributes alone:

- `Children`: `(parent_collection, parent_item) -> BoundedVec<(child_collection, child_item)>`
- `Parent`: `(child_collection, child_item) -> (parent_collection, parent_item)`

**Why dual storage maps instead of just attributes:**
- Attributes are set via `set_attribute` dispatchable (since `do_set_attribute` is `pub(crate)` in pallet-nfts), which requires an origin and charges deposits. Querying nested children from attributes would require iterating all attributes.
- Dedicated storage maps provide O(1) parent lookup and O(n) children enumeration, which is what the access check and burn-on-zero-views logic needs.
- The `rights_type` attribute is still written to the NFT via `set_attribute` for on-chain discoverability by indexers.

#### Payment Model

Payments use the `fungible::Mutate` trait (`transfer` with `Preservation::Preserve`). The creator receives payment directly — no escrow, no fee splitting.

- **Why direct transfer:** Simplest model that demonstrates the thesis concept. Fee splitting, royalties, and escrow are future work, not needed for the research question.
- **Deposit awareness:** NFT operations (collection creation, minting, attribute setting) charge deposits from the creator's account. The test assertions verify that the creator's balance increases after receiving payment, rather than asserting an exact amount, to account for these deposit costs.

#### Block Number for Subscription Expiry

Subscription expiry is tracked as a `u32` block number rather than a timestamp.

- **Why block numbers:** Deterministic and available on-chain without an oracle. `pallet_timestamp` provides wall-clock time but adds a dependency and introduces non-determinism in cross-chain scenarios (different chains may have different timestamp granularity).
- **Trade-off:** Block numbers are less human-readable and their real-world duration depends on block time (6 seconds in this parachain). Acceptable for a thesis prototype.

### Extrinsics

| Index | Function | Purpose | Key Design Note |
|-------|----------|---------|-----------------|
| 0 | `register_content` | Creator registers content with pricing | Creates NFT collection + parent item; stores metadata including all three price tiers |
| 1 | `subscribe` | User subscribes to content | Mints Subscription child NFT; prevents duplicate subscriptions per user/content |
| 2 | `renew_subscription` | Renew expired subscription | Only allowed after expiry (prevents pre-paying multiple periods) |
| 3 | `purchase_views` | Buy a PPV view pack | Mints PayPerView child NFT; allows any number of views |
| 4 | `consume_view` | Use one view | Decrements counter; burns NFT and cleans nesting at zero |
| 5 | `purchase_ownership` | Buy permanent access | Mints Ownership child NFT; one-time purchase per user/content |
| 6 | `check_access` | Unified access verification | Checks ownership → subscription → PPV in priority order; emits event with result |

#### Why `check_access` Is an Extrinsic, Not a View Function

In the current polkadot-sdk, runtime view functions (`#[pallet::view_function]`) are available but the `check_access` logic benefits from being callable on-chain (e.g., from XCM or chain extensions). The event emission provides an indexable access log. A view function alternative can be added later without breaking changes.

### Storage Design

```
NextContentId         : u32 (auto-increment)
NextItemId            : Map<CollectionId, u32> (per-collection item counter)
Contents              : Map<ContentId, ContentMetadata>
Subscriptions         : DoubleMap<ContentId, AccountId, SubscriptionInfo>
ViewPacks             : DoubleMap<ContentId, AccountId, ViewPackInfo>
Ownership             : DoubleMap<ContentId, AccountId, bool>
Children              : DoubleMap<CollectionId, ItemId, BoundedVec<(CollectionId, ItemId)>>
Parent                : DoubleMap<CollectionId, ItemId, (CollectionId, ItemId)>
```

**Why `StorageDoubleMap` for rights state:** Natural key structure is `(content_id, account_id)`. `StorageDoubleMap` allows efficient queries by content (all subscribers for a content) or by user (all content a user has access to), both of which are needed for the thesis evaluation.

### Testing

**23 unit tests, all passing.** Test categories:

| Category | Tests | What's Verified |
|----------|-------|-----------------|
| Content registration | 2 | Storage correctness, sequential IDs, separate collections |
| Subscription lifecycle | 5 | Payment, storage, expiry, renewal after expiry, duplicate prevention, missing content |
| Pay-per-view lifecycle | 4 | Payment, view counting, NFT burn at zero views, missing pack |
| Ownership | 2 | Payment, storage, double-purchase prevention |
| Access control | 6 | Access via each rights type, expired subscription denial, no-rights denial, missing content |
| Nesting integrity | 1 | Multiple children, parent record consistency |

**Mock runtime setup:**
- Uses `MultiSignature`-based `AccountId` (required by `pallet-nfts` for `OffchainSignature`/`OffchainPublic`)
- Three funded accounts (creator, user_a, user_b) with 10,000 balance each
- NFT deposits set to minimal values (collection: 2, item: 1, attribute: 1) to keep test balances simple
- Block number starts at 1 (avoids edge cases with block 0)

**Build verification:** Full node binary (`cargo build --release -p parachain-template-node`) compiles successfully with the pallet at index 51.

### Challenges Encountered

1. **`do_set_attribute` is `pub(crate)`** — Cannot call pallet-nfts' internal attribute-setting helper directly. Resolved by using the `set_attribute` dispatchable with a synthesized signed origin from the creator.

2. **Ambiguous associated types** — Both `pallet-nfts` and our pallet define `Currency` and `WeightInfo`. Resolved by renaming ours to `PaymentCurrency` and `ContentRightsWeightInfo`.

3. **`do_create_collection` signature** — Takes `(collection_id, owner, admin, config, deposit, event)`, not `(config, owner, admin, admin, callback)` as initially assumed. Required reading the pallet-nfts source directly from the cargo git checkout.

4. **NFT deposit costs in tests** — Balance assertions initially failed because pallet-nfts charges deposits for collection creation, minting, and attribute setting. Resolved by asserting relative balance changes rather than exact amounts.

5. **`NextCollectionId` is `Option<u32>`** — The pallet-nfts counter stores `Option<CollectionId>`, not `CollectionId`. Required `unwrap_or(0)` handling in the `next_collection_id` helper.

---

## Step 3: Scaffold RightsManager ink! 6 Contract

*To be completed.*

---

## Step 4: Chain Extensions

*To be completed.*

---

## Step 5: XCM Flows

*To be completed.*

---

## Appendix A: Technology Stack Justification

| Component | Choice | Why |
|-----------|--------|-----|
| Blockchain | Polkadot parachain | Thesis research question specifically targets XCM and cross-chain |
| Runtime framework | FRAME (polkadot-sdk) | Standard for Polkadot parachains; required for XCM integration |
| Smart contracts | ink! 6 on `pallet-revive` (PolkaVM) | Current-generation contract platform; Ethereum tx compatibility |
| NFT layer | `pallet-nfts` | Actively maintained; Asset Hub compatible; supports attributes for nesting |
| Cross-chain | XCM | Native to Polkadot; the thesis research question centers on this |
| Local testing | Zombienet (native provider) | Standard Polkadot ecosystem tool for local multi-node testing |
| Para ID | 100 (local dev) | Conventional for local development |

## Appendix B: RMRK 2.0 Conformance

The implementation preserves these RMRK 2.0 nesting invariants:

| RMRK Invariant | How Implemented |
|----------------|-----------------|
| Child has exactly one parent | `Parent` storage map enforces single parent; `ChildAlreadyNested` error prevents re-nesting |
| Parent owner controls children | Child NFTs are minted by the content creator (collection owner); nesting is managed by the pallet, not users |
| Children are enumerable | `Children` storage provides bounded list per parent |
| Burn propagation | When a view pack reaches zero, the child NFT is burned and nesting records cleaned up |

Invariants **not** implemented (out of scope for thesis):
- Two-step accept/reject nesting (RMRK's griefing prevention) — not needed since the pallet controls all nesting
- Multi-resource / multi-asset (ERC-5773) — content has a single representation
- Equippable slots (ERC-6220) — not relevant to content rights
