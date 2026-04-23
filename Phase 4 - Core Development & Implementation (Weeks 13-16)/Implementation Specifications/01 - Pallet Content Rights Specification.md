# Pallet Specification: `pallet-content-rights`

**Document type:** Implementation specification
**Source:** `content-rights-parachain/pallets/content-rights/src/lib.rs` (1,304 lines)
**Pallet index in runtime:** assigned via `construct_runtime!`
**Last updated:** 2026-04-07

---

## 1. Purpose

`pallet-content-rights` is the fundamental business logic module of the Cross-Chain Content Rights Management Service (CCRMS). It enforces a unified content rights token model, encompassing content registration, three monetization models (subscription, pay-per-view, permanent ownership), automatic royalty distribution, automatic subscription renewal, and cross-chain (XCM) variants of all monetary transaction operations.

The pallet utilizes `pallet-nfts` for NFT primitives, employing a parent/child nesting model where each registered content item functions as a "Content NFT" (parent), and each user's purchased rights are represented as child NFTs nested beneath it.

---

## 2. Configuration

The pallet's `Config` trait requires:

```rust
pub trait Config:
    frame_system::Config + pallet_nfts::Config<CollectionId = u32, ItemId = u32>
{
    type PaymentCurrency: fungible::Inspect<Self::AccountId>
                       + fungible::Mutate<Self::AccountId>;

    #[pallet::constant]
    type MaxChildren: Get<u32>;

    type ContentRightsWeightInfo: weights::WeightInfo;
}
```

| Parameter | Type | Purpose |
|-----------|------|---------|
| `PaymentCurrency` | Fungible token | The native or asset token used to settle subscription, PPV, and ownership payments |
| `MaxChildren` | `u32` (constant) | Hard upper bound on number of child NFTs that may be nested beneath a single Content NFT (currently 50, enforced via `BoundedVec`) |
| `ContentRightsWeightInfo` | Weight trait | Per-extrinsic weight constants (currently placeholder; benchmarking pending) |

The pallet additionally constrains `pallet_nfts::Config` so that both `CollectionId` and `ItemId` are `u32`. This simplifies storage keys and enables direct interoperability with the precompile interface.

---

## 3. Storage Items

| Storage | Type | Key | Value | Notes |
|---------|------|-----|-------|-------|
| `NextContentId` | `StorageValue` | — | `u32` | Auto-incrementing global content ID counter |
| `NextItemId` | `StorageMap` | `collection_id: u32` | `u32` | Per-collection child item ID counter (parent = 0) |
| `Contents` | `StorageMap` | `content_id: u32` | `ContentMetadata<T>` | Master record per registered content item |
| `Subscriptions` | `StorageDoubleMap` | `(content_id, subscriber)` | `SubscriptionInfo` | Active subscription state |
| `ViewPacks` | `StorageDoubleMap` | `(content_id, buyer)` | `ViewPackInfo` | Pay-per-view balance |
| `Ownership` | `StorageDoubleMap` | `(content_id, owner)` | `OwnershipInfo` | Permanent ownership records |
| `Children` | `StorageDoubleMap` | `(collection_id, parent_item)` | `BoundedVec<(u32,u32), 50>` | NFT nesting forward index |
| `Parent` | `StorageDoubleMap` | `(collection_id, child_item)` | `(u32, u32)` | NFT nesting reverse index |
| `AutoRenewIndex` | `StorageMap` | `(content_id, subscriber)` | `bool` | Index of subscriptions with auto-renew enabled (used by `on_initialize` sweep) |
| `RoyaltySplits` | `StorageMap` | `content_id: u32` | `BoundedVec<RoyaltySplit, 10>` | Up to 10 collaborator payout shares; if empty, 100% goes to creator |

All double maps use `Blake2_128Concat` hashing for both keys, enabling iteration by either key dimension and prefix-based scans.

### 3.1 Type definitions

```rust
pub enum RightsType { Subscription, PayPerView, Ownership }

pub struct ContentMetadata<T> {
    creator: T::AccountId,
    metadata_hash: [u8; 32],
    collection_id: u32,
    content_item_id: u32,
    title: BoundedVec<u8, ConstU32<128>>,
    subscription_price: u128,
    ppv_price: u128,
    ownership_price: u128,
    period_length: u32,         // measured in blocks
}

pub struct SubscriptionInfo {
    expiry_block: u32,
    auto_renew: bool,
    child_item_id: u32,
}

pub struct ViewPackInfo {
    views_remaining: u32,
    child_item_id: u32,
}

pub struct OwnershipInfo {
    child_item_id: u32,
}

pub struct RoyaltySplit {
    recipient: [u8; 32],   // raw AccountId32 bytes
    basis_points: u16,     // out of 10,000 (e.g., 2500 = 25%)
}

pub struct RightsMetadata {
    content_id: u32,
    rights_type: RightsType,
    metadata_hash: [u8; 32],
    title: BoundedVec<u8, ConstU32<128>>,
    subscription_price: u128,
    ppv_price: u128,
    ownership_price: u128,
    period_length: u32,
    royalty_total_basis_points: u16,
    num_collaborators: u8,
}
```

`RightsMetadata` is the rich, self-describing payload emitted by `query_rights_metadata`. It is designed to be carried in XCM messages so that consuming chains can interpret rights policy without round-tripping back to the origin chain.

---

## 4. Errors

| Error | Trigger |
|-------|---------|
| `ContentNotFound` | The given `content_id` does not exist in `Contents` storage |
| `NotContentCreator` | Caller is not the creator of the content (used by `set_royalty_splits`) |
| `SubscriptionAlreadyExists` | Beneficiary already holds an active subscription for this content |
| `SubscriptionNotFound` | No subscription exists for `(content_id, subscriber)` |
| `SubscriptionNotExpired` | Renewal attempted before `expiry_block` has been reached |
| `ViewPackNotFound` | No PPV pack exists for `(content_id, viewer)` |
| `NoViewsRemaining` | `consume_view` called against a pack with `views_remaining == 0` |
| `AlreadyOwned` | Beneficiary already owns this content (cannot purchase or transfer to self) |
| `InsufficientPayment` | Balance conversion failed or payment value overflowed |
| `MaxChildrenReached` | Attempt to nest a 51st child NFT under a parent (bounded vec limit) |
| `ChildAlreadyNested` | Reserved for future use (currently unreachable) |
| `NftOperationFailed` | Underlying `pallet-nfts` call failed |
| `ContentIdOverflow` | `NextContentId` would exceed `u32::MAX` |
| `ItemIdOverflow` | `NextItemId` for a collection would exceed `u32::MAX` |
| `OwnershipNotFound` | Transfer attempted on content the caller does not own |
| `InvalidRoyaltySplits` | `set_royalty_splits` total basis points > 10,000, or recipient bytes failed to decode |
| `AutoRenewAlreadyEnabled` | `enable_auto_renew` called when already enabled |
| `AutoRenewNotEnabled` | `disable_auto_renew` called when not enabled |
| `Unauthorized` | `xcm_transfer_ownership` caller is not the current owner (Finding B remediation) |

---

## 5. Events

The pallet emits 22 distinct event variants covering registration, monetary operations, cross-chain operations, royalty distribution, NFT nesting, auto-renewal lifecycle, and rights metadata queries. Events are the canonical mechanism by which off-chain indexers and cross-chain consumers observe state changes.

Events are grouped below by purpose. Field types are abbreviated for clarity (`AccountId` = `T::AccountId`).

### 5.1 Content lifecycle

| Event | Fields | Emitted by |
|-------|--------|-----------|
| `ContentRegistered` | `content_id, creator, collection_id, item_id` | `register_content` |
| `ChildNested` | `parent_collection, parent_item, child_collection, child_item` | `mint_and_nest_child` (helper) |

### 5.2 Subscription operations

| Event | Fields | Emitted by |
|-------|--------|-----------|
| `SubscriptionCreated` | `content_id, subscriber, expiry_block` | `subscribe` |
| `SubscriptionRenewed` | `content_id, subscriber, new_expiry_block` | `renew_subscription` |
| `CrossChainSubscriptionCreated` | `content_id, beneficiary, payer, expiry_block` | `xcm_subscribe` |
| `CrossChainSubscriptionRenewed` | `content_id, beneficiary, payer, new_expiry_block` | `xcm_renew_subscription` |
| `AutoRenewEnabled` | `content_id, subscriber` | `enable_auto_renew` |
| `AutoRenewDisabled` | `content_id, subscriber` | `disable_auto_renew` |
| `AutoRenewalProcessed` | `content_id, subscriber, new_expiry_block` | `on_initialize` (block hook) |
| `AutoRenewalFailed` | `content_id, subscriber, reason` | `on_initialize` |

`AutoRenewFailReason` discriminates between `InsufficientBalance` and `ContentNotFound`.

### 5.3 Pay-per-view operations

| Event | Fields | Emitted by |
|-------|--------|-----------|
| `ViewPackPurchased` | `content_id, buyer, views` | `purchase_views` |
| `ViewConsumed` | `content_id, viewer, views_remaining` | `consume_view` |
| `CrossChainViewPackPurchased` | `content_id, beneficiary, payer, views` | `xcm_purchase_views` |

### 5.4 Ownership operations

| Event | Fields | Emitted by |
|-------|--------|-----------|
| `OwnershipPurchased` | `content_id, buyer` | `purchase_ownership` |
| `OwnershipTransferred` | `content_id, from, to` | `transfer_ownership` |
| `CrossChainOwnershipPurchased` | `content_id, beneficiary, payer` | `xcm_purchase_ownership` |
| `CrossChainOwnershipTransferred` | `content_id, from, to, authorizer` | `xcm_transfer_ownership` |

### 5.5 Royalty and metadata operations

| Event | Fields | Emitted by |
|-------|--------|-----------|
| `RoyaltySplitsUpdated` | `content_id, creator, num_splits` | `set_royalty_splits` |
| `RoyaltyDistributed` | `content_id, recipient, amount` | `pay_with_royalties` (helper, fires per recipient) |
| `RightsMetadataQueried` | `content_id, metadata` | `query_rights_metadata` |
| `AccessChecked` | `content_id, who, has_access` | `check_access` |

---

## 6. Extrinsic Specifications

The pallet exposes 17 dispatchable extrinsics, indexed `0..=16` (note: `set_royalty_splits` uses index 13, the auto-renew enable/disable use 14/15, and `query_rights_metadata` uses 16, leaving the indexing slightly out-of-order in the source). All extrinsics require a signed origin via `ensure_signed`.

### 6.1 `register_content` (call_index 0)

Creates a new content item and the underlying NFT collection.

**Signature:**
```rust
pub fn register_content(
    origin: OriginFor<T>,
    metadata_hash: [u8; 32],
    title: BoundedVec<u8, ConstU32<128>>,
    subscription_price: u128,
    ppv_price: u128,
    ownership_price: u128,
    period_length: u32,
) -> DispatchResult
```

| Parameter | Description |
|-----------|-------------|
| `metadata_hash` | 32-byte content fingerprint (e.g., SHA-256 of off-chain content blob or IPFS CID hash) |
| `title` | Human-readable title, up to 128 bytes |
| `subscription_price` | Price for one subscription period, in `PaymentCurrency` units |
| `ppv_price` | Price for a single view, in `PaymentCurrency` units |
| `ownership_price` | Price for permanent ownership, in `PaymentCurrency` units |
| `period_length` | Subscription period length, in **blocks** (≈ 6 s/block) |

**Authorization:** Any signed account. The caller becomes the content creator.

**State changes:**
1. Allocates a new `collection_id` via `pallet_nfts::NextCollectionId`
2. Creates the NFT collection (caller = collection owner & admin)
3. Mints item `#0` as the parent "Content NFT", owned by the creator
4. Inserts the `ContentMetadata` record into `Contents`
5. Sets `NextItemId[collection_id] = 1` (item 0 reserved for the parent)
6. Increments `NextContentId`

**Errors:** `ContentIdOverflow`, `NftOperationFailed`

**Events:** `ContentRegistered`

### 6.2 `subscribe` (call_index 1)

Purchase a new subscription to content.

**Signature:**
```rust
pub fn subscribe(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Authorization:** Any signed account. Caller is both payer and beneficiary.

**Preconditions:**
- `content_id` must exist
- Caller must not already have an active subscription to this content

**State changes:**
1. Charges `content.subscription_price` from caller via `pay_with_royalties`
2. Mints a child NFT under the Content NFT, marked with `RightsType::Subscription`
3. Inserts `SubscriptionInfo { expiry_block, auto_renew: false, child_item_id }`

**Errors:** `ContentNotFound`, `SubscriptionAlreadyExists`, `MaxChildrenReached`, `InsufficientPayment`, `NftOperationFailed`

**Events:** `RoyaltyDistributed` (×N), `ChildNested`, `SubscriptionCreated`

### 6.3 `renew_subscription` (call_index 2)

Renew an expired subscription. Only callable after `expiry_block` has been reached.

**Signature:**
```rust
pub fn renew_subscription(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Authorization:** Any signed account. Caller renews their own subscription.

**Preconditions:**
- `content_id` must exist
- Caller must have an existing subscription
- `current_block >= sub.expiry_block` (subscription must be expired)

**State changes:**
1. Charges `content.subscription_price` via `pay_with_royalties`
2. Updates `expiry_block = current_block + period_length`

The existing child NFT is reused; no new NFT is minted on renewal.

**Errors:** `ContentNotFound`, `SubscriptionNotFound`, `SubscriptionNotExpired`, `InsufficientPayment`

**Events:** `RoyaltyDistributed` (×N), `SubscriptionRenewed`

### 6.4 `purchase_views` (call_index 3)

Purchase a pay-per-view pack of `num_views` views.

**Signature:**
```rust
pub fn purchase_views(
    origin: OriginFor<T>,
    content_id: u32,
    num_views: u32,
) -> DispatchResult
```

**Authorization:** Any signed account.

**Behaviour:**
- Total payment = `ppv_price × num_views`. Overflow returns `InsufficientPayment`.
- If the buyer already has an active view pack, the new views are **added** to the existing pack (additive purchase, Finding E remediation). No new NFT is minted in this case.
- If the buyer has no existing pack, a new child NFT is minted (`RightsType::PayPerView`) and the pack is created.

**Errors:** `ContentNotFound`, `InsufficientPayment`, `MaxChildrenReached`, `NftOperationFailed`

**Events:** `RoyaltyDistributed` (×N), `ChildNested` (only if new pack), `ViewPackPurchased`

### 6.5 `consume_view` (call_index 4)

Consume one view from an existing pay-per-view pack.

**Signature:**
```rust
pub fn consume_view(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Authorization:** Any signed account. Caller consumes their own pack.

**Behaviour:**
1. Decrements `views_remaining` by 1
2. If `views_remaining == 0` after decrement, the child NFT is **burned**, removed from `Children`/`Parent` indices, and the `ViewPacks` entry is deleted

**Errors:** `ViewPackNotFound`, `NoViewsRemaining`, `ContentNotFound`

**Events:** `ViewConsumed`

### 6.6 `purchase_ownership` (call_index 5)

Purchase permanent ownership of content. Pays the creator (with royalties) and mints an Ownership child NFT.

**Signature:**
```rust
pub fn purchase_ownership(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Authorization:** Any signed account.

**Preconditions:**
- `content_id` must exist
- Caller must not already own the content

**State changes:**
1. Charges `content.ownership_price` via `pay_with_royalties`
2. Mints a child NFT under the Content NFT (`RightsType::Ownership`)
3. Inserts `OwnershipInfo { child_item_id }`

**Errors:** `ContentNotFound`, `AlreadyOwned`, `MaxChildrenReached`, `InsufficientPayment`, `NftOperationFailed`

**Events:** `RoyaltyDistributed` (×N), `ChildNested`, `OwnershipPurchased`

### 6.7 `check_access` (call_index 6)

Verify whether the caller has any active rights to the content. Used as both a query mechanism (via emitted event) and an on-chain access gate.

**Signature:**
```rust
pub fn check_access(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Behaviour:** Checks rights in priority order: Ownership → active Subscription → PPV with `views_remaining > 0`. The result is published via the `AccessChecked` event.

**Errors:** `ContentNotFound`

**Events:** `AccessChecked`

### 6.8 `xcm_subscribe` (call_index 7)

Cross-chain variant of `subscribe`. The XCM origin (typically a sibling parachain's sovereign account) pays, and the rights are granted to a separately-specified beneficiary.

**Signature:**
```rust
pub fn xcm_subscribe(
    origin: OriginFor<T>,
    content_id: u32,
    beneficiary: T::AccountId,
) -> DispatchResult
```

**Semantics:** Identical to `subscribe` except the payer (the XCM origin) and beneficiary are decoupled. Used when a remote parachain forwards a subscription request on behalf of one of its users; the sovereign account of the remote chain is debited, and the local rights record is created against the user's `AccountId32` representation.

**Errors / Events:** Same as `subscribe`, but emits `CrossChainSubscriptionCreated` instead of `SubscriptionCreated`.

### 6.9 `xcm_renew_subscription` (call_index 8)

Cross-chain variant of `renew_subscription`.

**Signature:**
```rust
pub fn xcm_renew_subscription(
    origin: OriginFor<T>,
    content_id: u32,
    beneficiary: T::AccountId,
) -> DispatchResult
```

Identical semantics to `renew_subscription` except the payer ≠ beneficiary. Emits `CrossChainSubscriptionRenewed`.

### 6.10 `xcm_purchase_views` (call_index 9)

Cross-chain variant of `purchase_views`.

**Signature:**
```rust
pub fn xcm_purchase_views(
    origin: OriginFor<T>,
    content_id: u32,
    beneficiary: T::AccountId,
    num_views: u32,
) -> DispatchResult
```

Identical semantics to `purchase_views`. Emits `CrossChainViewPackPurchased`.

### 6.11 `xcm_purchase_ownership` (call_index 10)

Cross-chain variant of `purchase_ownership`.

**Signature:**
```rust
pub fn xcm_purchase_ownership(
    origin: OriginFor<T>,
    content_id: u32,
    beneficiary: T::AccountId,
) -> DispatchResult
```

Identical semantics to `purchase_ownership`. Emits `CrossChainOwnershipPurchased`.

### 6.12 `transfer_ownership` (call_index 11)

Peer-to-peer secondary market transfer of permanent ownership. **No payment is sent to the original creator.**

**Signature:**
```rust
pub fn transfer_ownership(
    origin: OriginFor<T>,
    content_id: u32,
    to: T::AccountId,
) -> DispatchResult
```

**Authorization:** Caller must be the current owner of the content.

**Preconditions:**
- `content_id` must exist
- Caller must currently own the content
- Recipient `to` must not already own it

**State changes:**
1. Burns the seller's Ownership child NFT
2. Removes nesting index entries for the burned NFT
3. Mints a fresh Ownership child NFT for `to`
4. Removes `Ownership[content_id, from]` and inserts `Ownership[content_id, to]`

**Design note:** The mint-burn-mint pattern (rather than NFT transfer) ensures the new owner's NFT is freshly attributed to the original creator, preserving provenance. No royalties are charged; this models a secondary-market sale where the on-chain peer-to-peer transfer reflects the conclusion of an off-chain payment between buyer and seller. A future iteration could add an optional resale royalty.

**Errors:** `ContentNotFound`, `OwnershipNotFound`, `AlreadyOwned`, `MaxChildrenReached`

**Events:** `ChildNested`, `OwnershipTransferred`

### 6.13 `xcm_transfer_ownership` (call_index 12)

Cross-chain variant of `transfer_ownership`. Allows ownership transfer to be initiated from a remote parachain.

**Signature:**
```rust
pub fn xcm_transfer_ownership(
    origin: OriginFor<T>,
    content_id: u32,
    from: T::AccountId,
    to: T::AccountId,
) -> DispatchResult
```

**Authorization:** **The caller (`authorizer`) must equal `from`.** This check (Finding B remediation) prevents the sovereign account of one parachain from transferring ownership held by an unrelated account.

In practice this means a cross-chain ownership transfer requires the `from` account to itself dispatch the XCM message — typically by signing an extrinsic on the remote parachain that wraps the local `xcm_transfer_ownership` call.

**State changes:** Same as `transfer_ownership`, applied to `from → to`.

**Errors:** `Unauthorized`, plus all errors from `transfer_ownership`

**Events:** `CrossChainOwnershipTransferred`

### 6.14 `set_royalty_splits` (call_index 13)

Configure the royalty distribution table for a content item. Only the creator may call.

**Signature:**
```rust
pub fn set_royalty_splits(
    origin: OriginFor<T>,
    content_id: u32,
    splits: BoundedVec<RoyaltySplit, ConstU32<10>>,
) -> DispatchResult
```

**Authorization:** Caller must be the content's creator.

**Preconditions:**
- `content_id` must exist
- Sum of all `basis_points` ≤ 10,000

**State changes:** Replaces `RoyaltySplits[content_id]` with the new vector.

**Behaviour notes:**
- An empty vector is valid; it disables splits and sends 100% to the creator
- Up to 10 collaborators may be specified
- The remainder (10,000 − Σ basis_points) is paid to the creator on each subsequent transaction
- Splits apply to all future payments (subscribe, renew, PPV, ownership purchase) but not to already-completed ones
- Secondary-market transfers (`transfer_ownership`) do not trigger royalty distribution

**Errors:** `ContentNotFound`, `NotContentCreator`, `InvalidRoyaltySplits`

**Events:** `RoyaltySplitsUpdated`

### 6.15 `enable_auto_renew` (call_index 14)

Enable automatic renewal for the caller's existing subscription. The on-chain scheduler (`on_initialize`) will automatically call `renew_subscription` when the subscription expires, provided the subscriber has sufficient balance.

**Signature:**
```rust
pub fn enable_auto_renew(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Authorization:** Caller must own the subscription.

**Preconditions:** Subscription must exist and `auto_renew` must currently be `false`.

**State changes:**
1. Sets `Subscriptions[content_id, caller].auto_renew = true`
2. Inserts `(content_id, caller)` into `AutoRenewIndex`

**Errors:** `SubscriptionNotFound`, `AutoRenewAlreadyEnabled`

**Events:** `AutoRenewEnabled`

### 6.16 `disable_auto_renew` (call_index 15)

Disable automatic renewal.

**Signature:**
```rust
pub fn disable_auto_renew(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Errors:** `SubscriptionNotFound`, `AutoRenewNotEnabled`

**Events:** `AutoRenewDisabled`

### 6.17 `query_rights_metadata` (call_index 16)

Emit an event containing the complete rights policy for a content item, including pricing, royalty configuration, and content metadata. Designed to allow cross-chain consumers to interpret rights policy without round-tripping back to the origin chain.

**Signature:**
```rust
pub fn query_rights_metadata(origin: OriginFor<T>, content_id: u32) -> DispatchResult
```

**Errors:** `ContentNotFound`

**Events:** `RightsMetadataQueried { content_id, metadata: RightsMetadata }`

The `rights_type` field in the emitted metadata is inferred from which prices are non-zero (priority: `ownership_price > 0` → `Ownership`, else `ppv_price > 0` → `PayPerView`, else → `Subscription`).

---

## 7. Block Hooks

### 7.1 `on_initialize`

Each block, the pallet sweeps `AutoRenewIndex` to find expired subscriptions and attempts to renew them automatically.

**Algorithm:**
```
MAX_RENEWALS_PER_BLOCK = 10
entries = take(AutoRenewIndex.iter(), MAX_RENEWALS_PER_BLOCK * 2)
for each (content_id, subscriber) in entries:
    if renewals_processed >= MAX_RENEWALS_PER_BLOCK: break
    sub = Subscriptions[content_id, subscriber]
    if sub does not exist: remove from index; continue
    if current_block < sub.expiry_block: continue        // not yet expired
    content = Contents[content_id]
    if content does not exist:
        emit AutoRenewalFailed(ContentNotFound)
        remove from index
        continue
    result = pay_with_royalties(subscriber, creator, content_id, subscription_price)
    if result.ok():
        sub.expiry_block = current_block + content.period_length
        emit AutoRenewalProcessed
        renewals_processed += 1
    else:
        sub.auto_renew = false
        remove from index
        emit AutoRenewalFailed(InsufficientBalance)
```

**Bounded work:** At most 10 renewals are processed per block. The iterator scans up to 20 index entries (oversampling to skip non-expired subscriptions). This bounds the worst-case weight of the hook regardless of total subscriber count.

**Failure handling:** If payment fails (insufficient balance), `auto_renew` is automatically disabled and the entry is removed from the index. The user must re-enable it manually after topping up. This prevents infinite retries against an empty balance.

**Self-cleaning:** Subscriptions that have been removed from `Subscriptions` (e.g., by future cleanup logic) are also removed from `AutoRenewIndex` on encounter.

---

## 8. Internal Helpers

### 8.1 `next_collection_id`
Allocates the next NFT collection ID by mutating `pallet_nfts::NextCollectionId`. Returns `ContentIdOverflow` on `u32` overflow.

### 8.2 `mint_and_nest_child(creator, owner, collection_id, parent_item_id, rights_type) → child_item_id`
Mints a child NFT under the given parent and updates the nesting indices.
1. Allocates the next item ID for the collection (overflow → `ItemIdOverflow`)
2. Calls `pallet_nfts::do_mint` (creator pays the deposit, ownership goes to `owner`)
3. Sets a `rights_type` attribute on the child NFT via `pallet_nfts::set_attribute` (CollectionOwner namespace)
4. Pushes the child onto `Children[collection_id, parent_item_id]` (returns `MaxChildrenReached` if full)
5. Inserts the reverse mapping into `Parent`
6. Increments `NextItemId`
7. Emits `ChildNested`

### 8.3 `pay_with_royalties(from, creator, content_id, amount)`
Distributes a payment according to the royalty splits configured for the content.

**Behaviour:**
- If `RoyaltySplits[content_id]` is empty, transfers the full amount to `creator`.
- Otherwise, for each `RoyaltySplit { recipient, basis_points }`:
  - Computes `share = amount × basis_points / 10,000` (saturating arithmetic)
  - If `share > 0`, decodes the raw 32-byte recipient into `T::AccountId`, transfers `share`, and emits `RoyaltyDistributed`
- Pays the **remainder** (`amount − Σshare`) to the creator. This handles rounding losses (which always favour the creator) and represents the creator's own implicit share.

The full distribution algorithm and worked examples are documented separately in `04 - Royalty Algorithm Specification.md`.

### 8.4 `transfer_amount(from, to, amount)`
Low-level fungible transfer helper using `Preservation::Preserve` (will not reap the sender's account). Returns `InsufficientPayment` on numeric conversion failure.

---

## 9. Invariants and Constraints

| Invariant | Enforcement |
|-----------|-------------|
| `Σ basis_points ≤ 10,000` per content | Validated in `set_royalty_splits` |
| At most 10 collaborators per content | `BoundedVec<_, ConstU32<10>>` type |
| At most 50 child NFTs per parent | `BoundedVec<_, ConstU32<50>>` type; `MaxChildrenReached` error |
| `NextContentId ≤ u32::MAX` | Checked add in `register_content` |
| `NextItemId[collection] ≤ u32::MAX` | Checked add in `mint_and_nest_child` |
| Item ID `0` is reserved for the parent Content NFT | `register_content` mints item 0; `NextItemId` starts at 1 |
| `Subscriptions` and `Ownership` cannot coexist for the same `(content_id, account)` from a single purchase, but a user may hold both via independent purchases | No invariant; `check_access` resolves priority Ownership → Subscription → PPV |
| `xcm_transfer_ownership` requires `authorizer == from` | Explicit `ensure!` check (Finding B remediation) |
| Auto-renew payment failure disables auto-renew | `on_initialize` failure branch |
| Auto-renew bounded to 10 renewals per block | Hard-coded constant |

---

## 10. Known Limitations

1. **Weight benchmarking is incomplete.** The current `WeightInfo` values are placeholder constants. Production deployment requires running the FRAME benchmarking suite and substituting measured weights.

2. **No royalty on secondary market transfers.** `transfer_ownership` is a pure peer-to-peer transfer with no creator share. A future iteration could add an optional resale royalty configurable per content item.

3. **Royalty split recipients use raw 32-byte arrays.** This allows storage to be `T`-independent but requires consumers to ensure the `AccountId` type is `AccountId32`. A future generic version would tie `RoyaltySplit` to `T::AccountId` directly.

4. **`MaxChildren = 50` per parent is a hard limit.** Highly popular content items will reach this ceiling. The architectural rationale is bounded weight per extrinsic; lifting this requires either (a) increasing the bound and re-benchmarking or (b) introducing a different storage layout that does not track children in a single bounded vec. See the ChildNested events as the canonical off-chain index source.

5. **`xcm_transfer_ownership` authorization model is conservative.** Requiring `authorizer == from` rules out delegated transfers (e.g., a marketplace contract transferring on behalf of the owner). A future capability-based authorization would relax this safely.

6. **No content deletion or update.** Content metadata is immutable post-registration. The thesis treats this as a feature (immutable rights policy) but a real deployment would need amendable terms or content takedown for legal compliance.

7. **`query_rights_metadata`'s `rights_type` inference is heuristic.** It is derived from which prices are non-zero rather than declared explicitly at registration. Content offering all three monetization models will report `Ownership` due to priority ordering; consumers should treat this field as advisory only and inspect the price fields directly.

---

## 11. Cross-references

- **NFT nesting model:** see `06 - NFT Nesting Model Specification.md`
- **Royalty algorithm:** see `04 - Royalty Algorithm Specification.md`
- **XCM message flows:** see `02 - XCM Message Flows Specification.md`
- **Security analysis & authorization:** see `03 - Security Threat Model and Authorization Matrix.md`
- **EVM precompile interface:** see `05 - Precompile Interface Specification.md`
- **Cross-chain verification (`pallet-rights-verifier`):** documented separately
- **Snowbridge integration:** see `07 - Snowbridge Integration Specification.md`
