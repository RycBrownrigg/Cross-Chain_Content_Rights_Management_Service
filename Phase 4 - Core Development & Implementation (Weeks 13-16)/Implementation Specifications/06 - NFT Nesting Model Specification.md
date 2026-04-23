# NFT Nesting Model Specification

**Document type:** Implementation specification
**Source:** `pallets/content-rights/src/lib.rs` (storage maps `Children`, `Parent`, `NextItemId`; helper `mint_and_nest_child`; lifecycle in `subscribe`, `purchase_views`, `purchase_ownership`, `consume_view`, `transfer_ownership`)
**NFT primitives:** `pallet-nfts` (`do_create_collection`, `do_mint`, `do_burn`, `set_attribute`)
**Last updated:** 2026-04-07

---

## 1. Purpose and Rationale

The CCRMS architecture treats every registered piece of content as a **single NFT collection** with one **parent NFT** (the "Content NFT") and zero-to-many **child NFTs** representing individual user rights. Each child NFT represents a specific monetization model (subscription, pay-per-view, or permanent ownership) held by a specific user.

This nesting model is inspired by RMRK 2.0's nested-NFT semantics but is implemented entirely on top of `pallet-nfts`, without depending on the deprecated `rmrk-substrate` pallet (which is incompatible with current Polkadot SDK versions). The thesis argues this design demonstrates that RMRK-style composability can be reproduced using only standard FRAME primitives.

The nesting model serves three purposes:

1. **Identity:** the parent Content NFT is the canonical on-chain identity of a piece of content. Its `(collection_id, item_id=0)` tuple is the primary key referenced by `ContentMetadata`.
2. **Rights tokenisation:** each child NFT is an independent transferable token representing the rights its owner holds. A user's wallet can show their rights as NFTs alongside other collectibles.
3. **Auditability:** the parent-child relationship is enforced on-chain, providing an unambiguous link from any rights NFT back to the content it grants access to.

---

## 2. Data Model

### 2.1 Storage maps

| Storage | Key | Value | Direction |
|---------|-----|-------|-----------|
| `NextItemId` | `collection_id: u32` | `u32` (next item ID to mint) | counter |
| `Children` | `(collection_id, parent_item_id)` | `BoundedVec<(u32, u32), ConstU32<50>>` | parent → children |
| `Parent` | `(collection_id, child_item_id)` | `(u32, u32)` (the parent's `(collection_id, item_id)`) | child → parent |

Both `Children` and `Parent` use `Blake2_128Concat` hashing, enabling iteration and prefix scans.

### 2.2 Why two indices

The pallet maintains both forward (`Children`) and reverse (`Parent`) indices to support two distinct query patterns:

- **Forward (`Children`):** "List all rights NFTs nested under this content." Used by external indexers and analytics, and internally for membership checks during burn operations.
- **Reverse (`Parent`):** "Given a child NFT, what content does it grant rights to?" Used during consumption (`consume_view`) and ownership operations to verify that the burn target is genuinely a child of the expected parent before removing it from the forward index.

The reverse index is also useful for off-chain wallet display: a wallet enumerating a user's NFTs can group them by parent without scanning the full `Children` map.

### 2.3 Why `BoundedVec` rather than per-child storage

`Children` is a single bounded vector of up to 50 entries per parent, rather than a `StorageDoubleMap<parent, child, ()>` membership table. The reasons:

1. **Bounded weight per extrinsic.** Looking up a parent's children is a single storage read returning a small vector, rather than an iterator. Worst-case extrinsic weight is therefore predictable.
2. **Insertion failure surfaces immediately.** When the bound is reached, `try_push` returns an error in O(1), allowing the extrinsic to revert with `MaxChildrenReached` cleanly. A double-map would require an additional counter to enforce the limit.
3. **Easy enumeration.** Off-chain indexers reading the children list get a complete answer in one call, rather than needing to iterate a sub-map.

The trade-off is the 50-child hard cap discussed under Limitations (§ 7).

### 2.4 Item ID allocation

`NextItemId[collection_id]` is initialised to `1` at content registration time (because item ID `0` is reserved for the parent Content NFT). Each call to `mint_and_nest_child` increments it. The counter never decrements; burned item IDs are not reused.

This monotonicity is important: it ensures that NFT identifiers are unique across the lifetime of a collection, which simplifies off-chain indexing and prevents accidental reuse of an identifier that was previously bound to a different right.

---

## 3. Lifecycle

### 3.1 Parent Content NFT creation (`register_content`)

When `register_content` is dispatched:

1. A new collection is created via `pallet_nfts::do_create_collection` (collection owner = creator, admin = creator).
2. Item `#0` is minted via `pallet_nfts::do_mint`, owned by the creator.
3. `ContentMetadata` is inserted with `content_item_id = 0`.
4. `NextItemId[collection_id]` is set to `1`.

The parent NFT is **always** item ID 0, by convention. This is enforced at registration time and assumed by all child operations.

```
After register_content(content_id=42):
    pallet_nfts::Collection[collection_id=N]   = { owner: creator, ... }
    pallet_nfts::Item[N, 0]                    = { owner: creator }
    Contents[42]                               = { collection_id: N, content_item_id: 0, ... }
    NextItemId[N]                              = 1
    Children[N, 0]                             = []   (default ValueQuery)
```

The parent NFT does not appear in `Parent` (it has no parent).

### 3.2 Child NFT mint and nest (`mint_and_nest_child`)

This internal helper is invoked by `subscribe`, `purchase_views`, `purchase_ownership`, `xcm_subscribe`, `xcm_purchase_views`, `xcm_purchase_ownership`, `transfer_ownership`, and `xcm_transfer_ownership`.

**Algorithm (`pallets/content-rights/src/lib.rs:396-459`):**

```
function mint_and_nest_child(creator, owner, collection_id, parent_item_id, rights_type):
    child_item_id ← NextItemId[collection_id]
    next_id       ← child_item_id + 1                       // checked add → ItemIdOverflow

    // 1. Mint the child NFT (creator pays deposit, owner receives the NFT)
    pallet_nfts::do_mint(collection_id, child_item_id, Some(creator), owner, default_config)

    // 2. Tag the child with its rights type as an NFT attribute
    rights_key   ← b"rights_type"
    rights_value ← rights_type.encode()
    pallet_nfts::set_attribute(
        signed_origin(creator),
        collection_id, Some(child_item_id),
        AttributeNamespace::CollectionOwner,
        rights_key, rights_value
    )

    // 3. Update the forward index
    Children[collection_id, parent_item_id].try_push((collection_id, child_item_id))
        // → MaxChildrenReached if already at 50

    // 4. Update the reverse index
    Parent[collection_id, child_item_id] ← (collection_id, parent_item_id)

    // 5. Advance the counter
    NextItemId[collection_id] ← next_id

    emit ChildNested { parent_collection, parent_item, child_collection, child_item }

    return child_item_id
```

**Properties:**

- **Atomicity.** All steps run within the dispatching extrinsic. Any failure (mint failure, attribute set failure, bound exceeded, overflow) reverts the entire extrinsic via FRAME's storage rollback.
- **Creator pays the NFT deposit.** `pallet_nfts::do_mint` requires a deposit; the third argument `Some(creator)` directs the deposit to the creator's account. The new NFT is owned by `owner` (the user receiving the rights).
- **Single-collection nesting.** All children of a Content NFT live in the same collection as the parent. There is no cross-collection nesting in this design.

### 3.3 Tagging children with their rights type

Each child NFT carries an `rights_type` attribute set on `pallet-nfts` in the `CollectionOwner` namespace:

| Attribute key | Attribute value |
|---------------|----------------|
| `b"rights_type"` | SCALE-encoded `RightsType` enum (1 byte: `0` Subscription, `1` PayPerView, `2` Ownership) |

This attribute is **the** way an off-chain observer can determine what monetization model a given child NFT represents without consulting `pallet-content-rights` storage. Wallet applications can display "Subscription", "Pay-per-view pack", or "Permanent ownership" labels based purely on `pallet-nfts` attribute queries.

Note that the **canonical** rights state is still in the pallet's storage maps (`Subscriptions`, `ViewPacks`, `Ownership`). The NFT attribute is a redundant tag for off-chain consumption; the pallet itself does not read it back during access checks.

### 3.4 Consumption and burning

Three operations cause a child NFT to be burned:

| Operation | Trigger | Burn target |
|-----------|---------|-------------|
| `consume_view` | `views_remaining` decrements to `0` | The PPV pack's child NFT |
| `transfer_ownership` | Always | The seller's Ownership child NFT (a fresh one is then minted for the recipient) |
| `xcm_transfer_ownership` | Always | Same as `transfer_ownership` |

**Burn algorithm (consume_view, source `pallets/content-rights/src/lib.rs:747-768`):**

```
if pack.views_remaining == 0 after decrement:
    pallet_nfts::do_burn(content.collection_id, pack.child_item_id, |_| Ok(()))
    Children[collection_id, parent_item_id].retain(|&(_, item)| item != pack.child_item_id)
    Parent::<T>::remove(collection_id, pack.child_item_id)
    ViewPacks::<T>::remove(content_id, viewer)
```

The burn updates all three indices: `pallet_nfts::Item` (via `do_burn`), `Children` (via `retain`), and `Parent` (via `remove`). The pallet's own storage entry (`ViewPacks`) is also removed, completing the cleanup.

**Subscription expiry does not burn.** When a subscription's `expiry_block` is reached, the child NFT is **not** burned. Renewal reuses the same NFT. The rationale: a user who renews their subscription should retain a continuous "subscriber NFT" rather than receiving a new one each period, both for wallet UX and for off-chain analytics that track subscription longevity.

A future iteration could add an explicit `cleanup_expired_subscription` extrinsic to burn the NFT and free the slot in `Children` if the user does not intend to renew, but this is not currently implemented.

### 3.5 Ownership transfer (mint-burn-mint pattern)

`transfer_ownership` and `xcm_transfer_ownership` follow a **burn-then-remint** pattern rather than a simple `pallet_nfts::do_transfer`:

```
function transfer_ownership_inner(content_id, from, to):
    // Burn old owner's child NFT
    pallet_nfts::do_burn(collection_id, ownership_info.child_item_id, |_| Ok(()))
    Children[collection_id, parent_item_id].retain(|&(_, item)| item != ownership_info.child_item_id)
    Parent::<T>::remove(collection_id, ownership_info.child_item_id)

    // Mint new child NFT for recipient
    new_child_item_id ← mint_and_nest_child(creator, to, collection_id, parent_item_id, Ownership)

    // Update Ownership storage
    Ownership::<T>::remove(content_id, from)
    Ownership::<T>::insert(content_id, to, OwnershipInfo { child_item_id: new_child_item_id })

    emit OwnershipTransferred { content_id, from, to }
```

**Why mint-burn-mint and not transfer:**

1. **Provenance preservation.** Re-minting via `mint_and_nest_child` ensures the new NFT is freshly attributed to the original creator (creator pays the deposit, creator's address appears in the mint event). A simple `do_transfer` would leave the deposit attributed to the previous owner.
2. **Attribute consistency.** The fresh child carries the `rights_type=Ownership` attribute set by the helper. A transferred NFT would carry the original attributes, but at the cost of obscuring whether the transfer pattern was ever used (the attribute namespace is shared, so an external observer cannot easily distinguish a transferred NFT from an originally-minted one).
3. **Item ID reflects transfer history.** The new owner's NFT has a distinct item ID. Off-chain indexers can reconstruct the chain of transfers by following `OwnershipTransferred` events without needing to compare attributes.

The cost is that each transfer consumes one slot in the `Children` bounded vec, contributing toward the 50-child cap (§ 7). Burning the previous child does free a slot, so the net change per transfer is zero — but a popular content item with frequent transfers will see the `NextItemId` counter increase rapidly.

### 3.6 Subscriber-renewal optimisation

When `renew_subscription` (or `xcm_renew_subscription`) is called, the existing child NFT is reused. The pallet only updates the `expiry_block` field in the `Subscriptions` storage record. No mint, no burn, no `Children` mutation.

This optimisation is significant for high-renewal content: a user with an auto-renewing subscription does not consume new `Children` slots on each renewal cycle.

### 3.7 PPV additive purchase optimisation (Finding E remediation)

When a buyer purchases additional views for content they already have a pack for, `purchase_views` adds the new views to the existing pack's `views_remaining` rather than minting a new child NFT. This is the Finding E remediation discussed in `03 - Security Threat Model and Authorization Matrix.md` § 4.5.

The result is that a single user can hold at most **one** PPV child NFT per content item, regardless of how many additive purchases they make. This prevents PPV operations from consuming the `Children` cap.

---

## 4. Constraints and Invariants

| Invariant | Enforcement | Failure mode |
|-----------|------------|--------------|
| Parent item ID is always `0` | `register_content` mints item 0; `NextItemId` starts at `1` | Convention; not enforced at runtime, but no other code mints item 0 |
| At most 50 children per parent | `BoundedVec<_, ConstU32<50>>` type | `MaxChildrenReached` |
| `NextItemId[collection_id] ≤ u32::MAX` | Checked add in `mint_and_nest_child` | `ItemIdOverflow` |
| Every child has a `Parent` entry | Set atomically in `mint_and_nest_child` step 4 | Only violated if mint succeeds and Parent insert is skipped (impossible by construction) |
| Every child appears in `Children` of its parent | Set atomically in `mint_and_nest_child` step 3 | Same — atomic |
| Burned children are removed from both indices | `consume_view` and `transfer_ownership` explicitly remove | Only violated if burn succeeds but cleanup is skipped (impossible by construction) |
| The `rights_type` attribute on a child matches the pallet's storage (Subscription / PayPerView / Ownership) | Set atomically in step 2 of `mint_and_nest_child` | Cannot diverge unless an external `set_attribute` call mutates the attribute, which requires creator origin |

---

## 5. Off-Chain Indexing

External indexers can build a complete view of CCRMS state by subscribing to the following events:

| Event | Use |
|-------|-----|
| `ContentRegistered` | Discover new content; populate content table |
| `ChildNested` | Track every new rights NFT and its parent linkage |
| `OwnershipTransferred` / `CrossChainOwnershipTransferred` | Update ownership records |
| `SubscriptionCreated` / `SubscriptionRenewed` / `AutoRenewalProcessed` | Track subscription state |
| `ViewPackPurchased` / `ViewConsumed` | Track PPV state |
| `pallet_nfts::Burned` | Track NFT lifecycle (e.g., for analytics on PPV depletion) |

The combination of `ChildNested` (which contains both parent and child IDs) and the various rights-specific events provides a complete picture without requiring storage scans.

---

## 6. Worked Examples

### 6.1 Single content item with 3 distinct users

```
1. register_content (creator=Alice, content=42)
   → collection #N created
   → item (N, 0) minted to Alice (parent)
   → Children[N, 0] = []

2. Bob calls subscribe(content_id=42)
   → mint_and_nest_child mints item (N, 1) to Bob, attribute rights_type=Subscription
   → Children[N, 0] = [(N, 1)]
   → Parent[N, 1] = (N, 0)
   → Subscriptions[42, Bob] = { expiry, auto_renew=false, child_item_id=1 }

3. Charlie calls purchase_views(content_id=42, num_views=10)
   → mint_and_nest_child mints item (N, 2) to Charlie, attribute rights_type=PayPerView
   → Children[N, 0] = [(N, 1), (N, 2)]
   → Parent[N, 2] = (N, 0)
   → ViewPacks[42, Charlie] = { views_remaining=10, child_item_id=2 }

4. Dave calls purchase_ownership(content_id=42)
   → mint_and_nest_child mints item (N, 3) to Dave, attribute rights_type=Ownership
   → Children[N, 0] = [(N, 1), (N, 2), (N, 3)]
   → Parent[N, 3] = (N, 0)
   → Ownership[42, Dave] = { child_item_id=3 }
```

After step 4, the parent NFT has 3 children, the collection has 4 items (one parent + three rights), and `NextItemId[N] = 4`.

### 6.2 PPV depletion frees a slot

```
Continuing from § 6.1:

5. Charlie calls consume_view(content_id=42)  ×10
   → On the 10th call, views_remaining drops to 0
   → pallet_nfts::do_burn(N, 2)
   → Children[N, 0].retain → [(N, 1), (N, 3)]
   → Parent::remove(N, 2)
   → ViewPacks::remove(42, Charlie)
```

Charlie's NFT is gone; the slot in `Children` is freed. `NextItemId[N]` is still `4` — the freed item ID is not reused.

### 6.3 Ownership transfer

```
Continuing from § 6.2:

6. Dave calls transfer_ownership(content_id=42, to=Eve)
   → pallet_nfts::do_burn(N, 3)
   → Children[N, 0].retain → [(N, 1)]
   → Parent::remove(N, 3)
   → mint_and_nest_child mints item (N, 4) to Eve
   → Children[N, 0] = [(N, 1), (N, 4)]
   → Parent[N, 4] = (N, 0)
   → Ownership::remove(42, Dave); Ownership::insert(42, Eve, { child_item_id=4 })
```

Net effect on `Children[N, 0]`: one slot freed (Dave's old NFT), one slot used (Eve's new NFT). Total stays at 2.

### 6.4 Reaching the children cap

A pathological content item with 50 active subscribers, no PPV, no ownership, and no expirations will fill `Children[N, 0]` to capacity. The 51st `subscribe` call will fail with `MaxChildrenReached`. Mitigations:

- Wait for an existing subscriber to either explicitly cancel (requires future `cancel_subscription` extrinsic) or for the subscription to expire and the user to fail to renew (auto-renew failure removes the subscriber from the index but does not free the NFT slot — see § 3.4).
- Re-architect the content into multiple registrations.

Neither mitigation is satisfactory; the cap is the most pressing limitation of the nesting model and is discussed under § 7.

---

## 7. Limitations

1. **50-child hard cap.** This is the dominant limitation. The cap is set by the `BoundedVec<_, ConstU32<50>>` type and cannot be raised at runtime. Highly popular content will hit it. Mitigation paths:
   - **Increase the bound:** changing 50 to (say) 1000 increases worst-case extrinsic weight proportionally and would require re-benchmarking. Eventually `BoundedVec` becomes inefficient.
   - **Separate counter from membership list:** track child count in a separate `StorageMap` and store individual children in a `StorageDoubleMap<(parent), child, ()>`. Removes the cap but loses single-read enumeration.
   - **Hierarchical nesting:** introduce an intermediate "rights bucket" NFT layer to fan out children. Adds complexity.
   The thesis acknowledges this limitation and treats it as future work.

2. **Subscription NFTs persist after expiry.** A subscriber whose subscription has expired (and who does not renew) still occupies a slot in `Children[N, 0]`. There is no automatic cleanup. A future `cleanup_expired_subscription` extrinsic could free the slot.

3. **Item IDs are never reused.** `NextItemId` only increments. Over very long lifespans this is theoretically a problem (`u32::MAX ≈ 4.3 billion`) but practically negligible.

4. **`rights_type` attribute is set in CollectionOwner namespace.** The creator (collection owner) holds the only authority to update this attribute. This is correct for on-chain integrity but means the creator could in principle modify a child's `rights_type` attribute after minting. The pallet's own storage is not affected by such a modification — the canonical rights are still those in `Subscriptions`/`ViewPacks`/`Ownership` — but the off-chain wallet display would be misled. Mitigation: lock the attribute via `pallet_nfts::lock_item_properties` after minting. Not currently implemented.

5. **No explicit "burn" in the public API.** Users cannot voluntarily burn their own rights NFTs. The only burn paths are PPV depletion (automatic) and ownership transfer (which immediately re-mints). A subscriber who wants to walk away cleanly cannot release their NFT.

6. **No cross-collection nesting.** Each Content NFT and its children all live in one collection. There is no mechanism to nest a child NFT from collection A under a parent in collection B. This rules out interesting "rights-of-rights" patterns (e.g., a "season pass" parent NFT whose children are rights to individual episodes from different collections).

7. **The `Children` vector is unordered with respect to insertion semantics.** `try_push` appends; `retain` filters in place. The vector's order is consistent with insertion order modulo removals, but consumers should not rely on this — it is an implementation detail.

---

## 8. Cross-references

- **Pallet extrinsics that mint/burn children:** `01 - Pallet Content Rights Specification.md` § 6.2–6.13 (subscribe, purchase_views, purchase_ownership, consume_view, transfer_ownership, and XCM variants)
- **`pallet-nfts` integration:** see runtime configuration in `runtime/src/configs/mod.rs`
- **Authorization for `transfer_ownership`:** `03 - Security Threat Model and Authorization Matrix.md` § 4.2
- **Source code:**
  - Storage definitions: `pallets/content-rights/src/lib.rs:97-133`
  - `mint_and_nest_child` helper: `pallets/content-rights/src/lib.rs:396-459`
  - `consume_view` burn path: `pallets/content-rights/src/lib.rs:747-768`
  - `transfer_ownership` mint-burn-mint: `pallets/content-rights/src/lib.rs:1052-1108`
  - `register_content` parent creation: `pallets/content-rights/src/lib.rs:531-604`
- **Relationship to RMRK 2.0:** see `Phase 4 - Core Development & Implementation/Implementation Decisions & Design Rationale.md` Step 1
