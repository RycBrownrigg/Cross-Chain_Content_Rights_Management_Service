# Royalty Algorithm Specification

**Document type:** Implementation specification
**Source:** `pallets/content-rights/src/lib.rs` lines 463-503 (`pay_with_royalties` helper) and lines 1276-1302 (`set_royalty_splits` extrinsic)
**Last updated:** 2026-04-07

---

## 1. Purpose

This document specifies the royalty distribution algorithm used by `pallet-content-rights` to split revenue between a content creator and up to 10 collaborators. It covers:

- The data model (`RoyaltySplit`, `RoyaltySplits` storage)
- Configuration via `set_royalty_splits` (call_index 13)
- The runtime distribution algorithm (`pay_with_royalties` helper)
- Worked examples
- Rounding and precision behaviour
- Operations to which royalties apply
- Limitations

The royalty algorithm is invoked automatically by every revenue-generating extrinsic (`subscribe`, `renew_subscription`, `purchase_views`, `purchase_ownership`, and their `xcm_*` variants). It is not invoked by `transfer_ownership` (peer-to-peer secondary market transfers).

---

## 2. Data Model

### 2.1 `RoyaltySplit`

```rust
pub struct RoyaltySplit {
    pub recipient: [u8; 32],   // raw AccountId32 bytes
    pub basis_points: u16,     // out of 10,000 (e.g., 2500 = 25%)
}
```

A single split entry represents one recipient and the share of each transaction they receive, expressed in **basis points**: 1 basis point = 0.01% = 1/10,000.

The `recipient` field is a raw 32-byte array rather than `T::AccountId` for two reasons:

1. **Storage type independence:** the `RoyaltySplits` storage map can be defined without bringing `T::AccountId` into the bound, simplifying the `BoundedVec<RoyaltySplit, ConstU32<10>>` type.
2. **XCM compatibility:** the raw byte form is the canonical representation for `AccountId32`, the type used by all standard Polkadot SDK runtimes.

The runtime (`pallet_content_rights::Config::AccountId`) is constrained to be decodable from this 32-byte form; any non-`AccountId32` configuration would fail at the decode step in `pay_with_royalties` (returning `InvalidRoyaltySplits`).

### 2.2 `RoyaltySplits` storage

```rust
#[pallet::storage]
pub type RoyaltySplits<T: Config> = StorageMap<
    _,
    Blake2_128Concat,
    u32,                                           // content_id
    BoundedVec<RoyaltySplit, ConstU32<10>>,        // splits, max 10
    ValueQuery,                                    // default = empty vec
>;
```

| Property | Value |
|----------|-------|
| Key | `content_id: u32` |
| Value | `BoundedVec<RoyaltySplit, 10>` |
| Default on missing key | empty vec (`ValueQuery`) |
| Maximum collaborators | 10 (compile-time bound) |
| Maximum total share | 10,000 basis points = 100% (validated at write) |

A content item with no entry in `RoyaltySplits`, or with an empty vector, sends 100% of every payment to the content creator.

---

## 3. Configuration: `set_royalty_splits`

### 3.1 Signature

```rust
pub fn set_royalty_splits(
    origin: OriginFor<T>,
    content_id: u32,
    splits: BoundedVec<RoyaltySplit, ConstU32<10>>,
) -> DispatchResult
```

### 3.2 Authorization

Only the **content creator** may call this extrinsic. The check is enforced at the top of the extrinsic body:

```rust
let caller = ensure_signed(origin)?;
let content = Contents::<T>::get(content_id).ok_or(Error::<T>::ContentNotFound)?;
ensure!(caller == content.creator, Error::<T>::NotContentCreator);
```

### 3.3 Validation

```rust
let total_bp: u32 = splits.iter().map(|s| s.basis_points as u32).sum();
ensure!(total_bp <= 10_000, Error::<T>::InvalidRoyaltySplits);
```

The sum of all basis points must be **less than or equal to** 10,000. The sum may be less than 10,000, in which case the residual share remains with the creator.

The `BoundedVec<_, ConstU32<10>>` type enforces the 10-collaborator limit at the type level: any attempt to construct a longer vector fails before the extrinsic is even dispatched.

### 3.4 Effect

```rust
RoyaltySplits::<T>::insert(content_id, splits);
```

The new vector **completely replaces** the previous configuration. There is no append or merge operation; updates are atomic replacements.

### 3.5 Event

```rust
Event::RoyaltySplitsUpdated {
    content_id,
    creator: caller,
    num_splits: splits.len() as u32,
}
```

The number of splits is included to make off-chain indexing easier; the full vector contents must be retrieved by storage query.

### 3.6 Errors

| Error | Trigger |
|-------|---------|
| `ContentNotFound` | `content_id` not in `Contents` |
| `NotContentCreator` | Caller is not the creator |
| `InvalidRoyaltySplits` | `Σ basis_points > 10,000` |

The `BoundedVec` length bound (10) is enforced by SCALE decoding of the input parameter; an over-long vector causes the extrinsic to fail before any pallet code runs.

---

## 4. Distribution Algorithm: `pay_with_royalties`

### 4.1 Source

```rust
fn pay_with_royalties(
    from: &T::AccountId,
    creator: &T::AccountId,
    content_id: u32,
    amount: u128,
) -> DispatchResult {
    let splits = RoyaltySplits::<T>::get(content_id);

    if splits.is_empty() {
        // No splits — 100% to creator
        Self::transfer_amount(from, creator, amount)?;
    } else {
        let mut distributed: u128 = 0;
        for split in splits.iter() {
            let share = amount
                .saturating_mul(split.basis_points as u128)
                .saturating_div(10_000);
            if share > 0 {
                let recipient = T::AccountId::decode(&mut &split.recipient[..])
                    .map_err(|_| Error::<T>::InvalidRoyaltySplits)?;
                Self::transfer_amount(from, &recipient, share)?;
                distributed = distributed.saturating_add(share);

                Self::deposit_event(Event::RoyaltyDistributed {
                    content_id,
                    recipient,
                    amount: share,
                });
            }
        }
        // Remainder to creator (handles rounding)
        let remainder = amount.saturating_sub(distributed);
        if remainder > 0 {
            Self::transfer_amount(from, creator, remainder)?;
        }
    }

    Ok(())
}
```

### 4.2 Pseudocode

```
function pay_with_royalties(payer, creator, content_id, amount):
    splits ← RoyaltySplits[content_id]                      // BoundedVec<RoyaltySplit, 10>

    if splits is empty:
        transfer(payer → creator, amount)
        return Ok

    distributed ← 0
    for each split in splits:
        share ← (amount × split.basis_points) ÷ 10,000      // saturating arithmetic, integer division
        if share > 0:
            recipient ← decode(split.recipient)             // AccountId32 from raw bytes
            transfer(payer → recipient, share)
            distributed ← distributed + share
            emit RoyaltyDistributed(content_id, recipient, share)

    remainder ← amount − distributed                        // ≥ 0 by construction
    if remainder > 0:
        transfer(payer → creator, remainder)

    return Ok
```

### 4.3 Properties

The algorithm guarantees the following properties:

| Property | How it is guaranteed |
|----------|----------------------|
| **Conservation:** total amount transferred = `amount` | The remainder is always sent to the creator; `Σ share + remainder = amount` |
| **No over-distribution:** `Σ share ≤ amount` | Integer division truncates; saturating arithmetic prevents overflow |
| **Rounding favours the creator** | The remainder always goes to the creator |
| **Atomicity:** all transfers succeed or all fail | Each `transfer_amount` returns `DispatchResult`; the first failure propagates via `?` and reverts the entire extrinsic via FRAME's storage rollback |
| **Bounded weight** | At most 10 splits + 1 creator transfer = 11 fungible transfers per call |

### 4.4 Saturating arithmetic

The algorithm uses `saturating_mul`, `saturating_div`, `saturating_add`, and `saturating_sub` throughout. This guarantees that no arithmetic operation can panic. For an `amount` in the typical range (up to a few thousand DOT/ROC), the products `amount × basis_points` are well within `u128` range (`u128::MAX ≈ 3.4 × 10^38`, while a realistic upper bound for `amount × 10_000` is on the order of `10^22`). Saturation is therefore defensive rather than load-bearing.

### 4.5 Event emission

A `RoyaltyDistributed` event is emitted for **each non-zero share** sent to a non-creator recipient. The creator's residual transfer does not produce a `RoyaltyDistributed` event — it produces a `Balances::Transfer` event from the underlying `transfer_amount` call. This is a deliberate design choice: external indexers can reconstruct the full distribution by combining `RoyaltyDistributed` events with the surrounding `Balances::Transfer` event for the creator share.

---

## 5. Worked Examples

### 5.1 Example A — No splits configured

```
amount        = 1,000
splits        = []
creator       = 0xA
```

| Step | Recipient | Share |
|------|-----------|-------|
| 1 | Creator (0xA) | 1,000 |
| **Total** | | **1,000** |

Result: full payment to creator.

### 5.2 Example B — Single 25% collaborator

```
amount        = 1,000
splits        = [(0xB, 2500)]   // 25%
creator       = 0xA
```

| Step | Recipient | Calculation | Share | Event |
|------|-----------|-------------|-------|-------|
| 1 | 0xB (collaborator) | 1,000 × 2500 ÷ 10,000 | 250 | `RoyaltyDistributed` |
| 2 | 0xA (creator, residual) | 1,000 − 250 | 750 | (`Balances::Transfer`) |
| **Total** | | | **1,000** |

### 5.3 Example C — Three collaborators summing to 100%

```
amount        = 1,000
splits        = [(0xB, 4000), (0xC, 3500), (0xD, 2500)]   // 40% / 35% / 25%
creator       = 0xA
```

| Step | Recipient | Calculation | Share | Event |
|------|-----------|-------------|-------|-------|
| 1 | 0xB | 1,000 × 4000 ÷ 10,000 | 400 | `RoyaltyDistributed` |
| 2 | 0xC | 1,000 × 3500 ÷ 10,000 | 350 | `RoyaltyDistributed` |
| 3 | 0xD | 1,000 × 2500 ÷ 10,000 | 250 | `RoyaltyDistributed` |
| 4 | 0xA (residual) | 1,000 − 1,000 | 0 | (no transfer) |
| **Total** | | | **1,000** |

Note that the creator receives nothing in this case because the splits sum to exactly 10,000 basis points. The residual transfer is skipped because `remainder == 0`.

### 5.4 Example D — Rounding loss favours the creator

```
amount        = 100
splits        = [(0xB, 333), (0xC, 333), (0xD, 333)]   // 3.33% × 3 = 9.99%
creator       = 0xA
```

| Step | Recipient | Calculation | Share | Event |
|------|-----------|-------------|-------|-------|
| 1 | 0xB | 100 × 333 ÷ 10,000 = 3.33 → **3** | 3 | `RoyaltyDistributed` |
| 2 | 0xC | 100 × 333 ÷ 10,000 = 3.33 → **3** | 3 | `RoyaltyDistributed` |
| 3 | 0xD | 100 × 333 ÷ 10,000 = 3.33 → **3** | 3 | `RoyaltyDistributed` |
| 4 | 0xA (residual) | 100 − 9 | **91** | (`Balances::Transfer`) |
| **Total** | | | **100** |

The total distributed to collaborators is 9 (not 9.99); the rounding loss of 0.99 is added to the creator's share. This is intentional: the creator is the *fallback* recipient and absorbs all rounding error, ensuring conservation of the total amount.

In practice, for typical token amounts (where 1 unit = 10⁻¹⁰ DOT), the rounding error is negligible. For very small amounts (e.g., a 10-unit micropayment), the rounding error becomes proportionally significant — but it always favours the creator, never the payer or a third party.

### 5.5 Example E — Splits sum to less than 100%

```
amount        = 1,000
splits        = [(0xB, 1000), (0xC, 500)]   // 10% / 5%, total 15%
creator       = 0xA
```

| Step | Recipient | Calculation | Share | Event |
|------|-----------|-------------|-------|-------|
| 1 | 0xB | 1,000 × 1000 ÷ 10,000 | 100 | `RoyaltyDistributed` |
| 2 | 0xC | 1,000 × 500 ÷ 10,000 | 50 | `RoyaltyDistributed` |
| 3 | 0xA (residual) | 1,000 − 150 | 850 | (`Balances::Transfer`) |
| **Total** | | | **1,000** |

The creator implicitly receives 85% of the payment (the 8,500 unallocated basis points), without needing an explicit `RoyaltySplit` entry.

### 5.6 Example F — Zero-share split entry

```
amount        = 50
splits        = [(0xB, 1)]   // 0.01%
creator       = 0xA
```

| Step | Recipient | Calculation | Share | Event |
|------|-----------|-------------|-------|-------|
| 1 | 0xB | 50 × 1 ÷ 10,000 = 0.005 → **0** | — | (skipped: `share == 0`) |
| 2 | 0xA (residual) | 50 − 0 | 50 | (`Balances::Transfer`) |
| **Total** | | | **50** |

When `share == 0`, the algorithm skips the transfer and the event emission. This avoids no-op `Balances::Transfer` calls and prevents pollution of the event log with zero-value royalty events. The skipped recipient is silently absorbed into the creator's residual.

### 5.7 Example G — All-or-nothing failure mode

```
amount        = 1,000
splits        = [(0xB, 5000)]   // 50%
creator       = 0xA
```

If the recipient `0xB` has been reaped or has insufficient existential deposit such that `transfer_amount(payer → 0xB, 500)` fails, the **entire extrinsic reverts** because of the `?` operator on the failed transfer. Neither 0xA nor 0xB receives anything; the payer's balance is unchanged. The consumer of `pay_with_royalties` (e.g., `subscribe`) sees a propagated `DispatchError`.

This is the intended behaviour: a partial distribution would leave the system in an inconsistent state (some recipients paid, no rights granted). All-or-nothing is the correct semantic.

---

## 6. Operations Subject to Royalties

The royalty algorithm is invoked by the following extrinsics:

| Extrinsic | Amount | Trigger |
|-----------|--------|---------|
| `subscribe` | `subscription_price` | Per subscription purchase |
| `renew_subscription` | `subscription_price` | Per renewal |
| `purchase_views` | `ppv_price × num_views` | Per PPV purchase (also additive purchases) |
| `purchase_ownership` | `ownership_price` | Per ownership purchase |
| `xcm_subscribe` | `subscription_price` | Per cross-chain subscription |
| `xcm_renew_subscription` | `subscription_price` | Per cross-chain renewal |
| `xcm_purchase_views` | `ppv_price × num_views` | Per cross-chain PPV purchase |
| `xcm_purchase_ownership` | `ownership_price` | Per cross-chain ownership purchase |
| `on_initialize` (auto-renewal) | `subscription_price` | Per automatic renewal |

The following operations **do not** invoke royalty distribution:

| Extrinsic | Why not |
|-----------|---------|
| `transfer_ownership` | Peer-to-peer secondary-market transfer; no creator share is taken. Discussed under Limitations. |
| `xcm_transfer_ownership` | Same rationale as `transfer_ownership` |
| `consume_view` | View consumption is not a payment event; the payment occurred at `purchase_views` |
| `check_access` / `query_rights_metadata` | Read-only |
| `enable_auto_renew` / `disable_auto_renew` | State toggles; not payment events |
| `set_royalty_splits` | Configuration; not a payment |
| `register_content` | No payment occurs at registration |

---

## 7. Limitations and Open Questions

1. **No resale royalty.** `transfer_ownership` and `xcm_transfer_ownership` are pure peer-to-peer transfers with no creator share. Mainstream NFT marketplaces (OpenSea, Magic Eden) typically support resale royalties of 5-10%; CCRMS does not. A future iteration could add an optional resale royalty as a per-content configuration field, applied via `pay_with_royalties` on each transfer. This was deferred to keep the prototype focused on the primary distribution model.

2. **Recipient must be `AccountId32`.** The raw 32-byte recipient field assumes the runtime's `AccountId` type is `AccountId32`. A runtime using `AccountId20` (as some EVM-compatible chains do) would fail to decode recipients. This is acceptable for the standard Polkadot SDK runtime configuration but should be noted for any future chain extension.

3. **No per-recipient minimum threshold.** A recipient with a `basis_points` value low enough to round down to zero on a typical transaction (Example F) is silently skipped. This could surprise creators who do not understand the rounding behaviour. A future iteration could emit a `RoyaltyDistributedZero` event or aggregate fractional shares across multiple transactions, but neither is implemented.

4. **No vesting or escrow.** Royalties are paid immediately on each transaction. There is no concept of a vesting schedule, time-locked escrow, or batched payouts. A future iteration could integrate with `pallet-vesting` for delayed distribution.

5. **Splits cannot be set at registration.** A creator must call `set_royalty_splits` after `register_content`. There is a brief window (between the two calls) during which any subscription/PPV/ownership purchase will go entirely to the creator, even if the creator intended to share. A future iteration could accept an optional `Vec<RoyaltySplit>` parameter on `register_content`. This is captured as a known UX rough edge.

6. **No on-chain validation that recipients exist.** A creator can configure splits with recipient bytes that decode to a valid `AccountId32` but do not correspond to a funded account. The first transaction will then fail at the `transfer_amount` step (recipient cannot be created without a non-zero amount + existential deposit), causing the entire extrinsic to revert. This is detectable but only at the first payment, not at configuration time.

7. **Splits cannot be conditional.** The basis points for a given recipient are static; they cannot vary by buyer, by amount, by time, or by monetization model. A creator wishing to give 50% to a producer on subscriptions but 25% on ownership purchases would need to use a different content registration for each, or post-process distributions off-chain.

---

## 8. Cross-references

- **Extrinsic specifications using `pay_with_royalties`:** `01 - Pallet Content Rights Specification.md` § 6.2–6.13
- **Authorization model for `set_royalty_splits`:** `03 - Security Threat Model and Authorization Matrix.md` § 3
- **Why secondary transfers do not trigger royalties:** `01 - Pallet Content Rights Specification.md` § 6.12 design note
- **Storage layout:** `01 - Pallet Content Rights Specification.md` § 3 (`RoyaltySplits` entry)
- **Source code:**
  - Helper: `pallets/content-rights/src/lib.rs:463-503`
  - Configuration extrinsic: `pallets/content-rights/src/lib.rs:1276-1302`
  - Storage definition: `pallets/content-rights/src/lib.rs:121-128`
  - Type definitions: `pallets/content-rights/src/types.rs:68-72`
- **Royalty tests:** `pallets/content-rights/src/tests.rs` (5 royalty-focused tests)
