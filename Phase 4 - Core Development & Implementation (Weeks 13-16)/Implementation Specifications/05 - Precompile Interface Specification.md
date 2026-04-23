# Precompile Interface Specification: `ContentRightsPrecompile`

**Document type:** Implementation specification
**Source:** `content-rights-parachain/runtime/src/precompiles.rs` (196 lines)
**Last updated:** 2026-04-07

---

## 1. Purpose

`ContentRightsPrecompile` is a custom EVM precompile registered with `pallet-revive` (PolkaVM, RISC-V execution environment). It exposes **read-only** access to `pallet-content-rights` storage, enabling Solidity contracts and Ethereum-compatible clients to verify content access rights via standard EVM ABI calls.

The precompile is the bridge between the Rust pallet world and the Solidity/Ethereum tooling ecosystem. It enables:

- ink! contracts to query rights state without needing chain extensions
- Solidity contracts deployed on `pallet-revive` to gate access based on subscription/ownership state
- Ethereum-compatible JSON-RPC clients (e.g., MetaMask, ethers.js, web3.js) to call standard `view` functions against the precompile address

**Write operations** (subscribe, purchase, transfer ownership, royalty configuration) are intentionally **not** exposed via the precompile. They remain as pallet extrinsics, dispatched through the normal Polkadot SDK transaction path. The rationale is that write operations involve fungible balance transfers, NFT minting, and event emission that benefit from the full FRAME dispatch context, including weight metering, fee payment, and the runtime's transaction ordering guarantees.

---

## 2. Address and Discovery

### 2.1 Address matcher

```rust
const MATCHER: AddressMatcher =
    AddressMatcher::Fixed(NonZero::new(0x1001).expect("0x1001 is non-zero"));
```

The precompile is matched at a **fixed** EVM address constructed by placing the 16-bit identifier `0x1001` into bytes `[16..18]` of a 20-byte H160 address. The full address is therefore:

```
0x0000000000000000000000000000000010010000
```

| Byte range | Value | Source |
|------------|-------|--------|
| `[0..16]` | `0x00 × 16` | Padding (precompile namespace) |
| `[16..18]` | `0x1001` | The fixed matcher constant |
| `[18..20]` | `0x00 × 2` | Padding |

This address is reserved at runtime configuration time. Solidity contracts reference it as a constant:

```solidity
address constant CONTENT_RIGHTS = 0x0000000000000000000000000000000010010000;
```

### 2.2 Contract info

```rust
const HAS_CONTRACT_INFO: bool = false;
```

The precompile is **stateless** from `pallet-revive`'s perspective: it has no contract storage, no constructor, no balance, and no code blob. All state lives in the underlying `pallet-content-rights` storage maps. This minimises the precompile's overhead and prevents accidental coupling between EVM contract storage and pallet storage.

---

## 3. Solidity Interface

The complete Solidity interface, defined in `precompiles.rs:26-57` via the `alloy::sol!` macro:

```solidity
interface IContentRights {
    /// Check whether `who` has access to content. Returns a RightsType enum value:
    /// 0 = Subscription, 1 = PayPerView, 2 = Ownership, 3 = None
    function checkAccess(uint32 contentId, address who)
        external view returns (uint8 rightsType);

    /// Get content metadata by ID.
    function getContent(uint32 contentId) external view returns (
        address creator,
        bytes32 metadataHash,
        uint128 subscriptionPrice,
        uint128 ppvPrice,
        uint128 ownershipPrice,
        uint32 periodLength
    );

    /// Check if a user owns content permanently.
    function isOwner(uint32 contentId, address who)
        external view returns (bool owned);

    /// Get subscription state for a user and content.
    function getSubscription(uint32 contentId, address subscriber)
        external view returns (bool exists, uint32 expiryBlock);

    /// Get view pack state for a user and content.
    function getViewPack(uint32 contentId, address viewer)
        external view returns (bool exists, uint32 viewsRemaining);
}
```

All five functions are declared `external view`. They never mutate state and never emit events. The dispatch path is purely a series of pallet storage reads followed by ABI encoding of the result.

### 3.1 Function selector reference

Function selectors (the first four bytes of the keccak256 of the function signature) for each call:

| Function | Signature | Selector |
|----------|-----------|----------|
| `checkAccess` | `checkAccess(uint32,address)` | computed at call site by alloy |
| `getContent` | `getContent(uint32)` | computed at call site by alloy |
| `isOwner` | `isOwner(uint32,address)` | computed at call site by alloy |
| `getSubscription` | `getSubscription(uint32,address)` | computed at call site by alloy |
| `getViewPack` | `getViewPack(uint32,address)` | computed at call site by alloy |

The `alloy::sol!` macro generates the selectors at compile time and dispatches the incoming call data to the matching enum variant in `Self::Interface = IContentRights::IContentRightsCalls`. There is no manual selector matching in the precompile body.

---

## 4. Function Specifications

### 4.1 `checkAccess(uint32 contentId, address who) → uint8 rightsType`

Returns the highest-priority rights type held by `who` for the given content.

**Return values:**

| Value | Meaning |
|-------|---------|
| `0` | Active subscription (subscription exists AND `current_block < expiry_block`) |
| `1` | Pay-per-view (active view pack with `views_remaining > 0`) |
| `2` | Permanent ownership |
| `3` | None — no rights held, but content exists |

**Reverts:**

| Condition | Revert message |
|-----------|---------------|
| Content does not exist | `"ContentNotFound"` |

**Resolution priority:**

The function checks rights in the following order, returning on the first match:

1. **Ownership** (`2`) — cheapest check; one storage map lookup
2. **Active subscription** (`0`) — requires reading the subscription record and comparing `expiry_block` against the current block number
3. **Pay-per-view** (`1`) — requires reading the view pack record and checking `views_remaining > 0`
4. **None** (`3`) — fallback if all checks fail

This priority is consistent with `pallet-content-rights::check_access` (extrinsic 6). The precompile mirrors the pallet's logic exactly.

**Storage reads:** Up to 3 storage reads (`Contents`, `Ownership`, then either `Subscriptions` or `ViewPacks`). Weight is charged at the start of the call as `StorageRead(3)`, regardless of how many reads actually fire — a conservative bound rather than a precise count.

**Source:** `precompiles.rs:95-135`

### 4.2 `getContent(uint32 contentId) → (creator, metadataHash, subscriptionPrice, ppvPrice, ownershipPrice, periodLength)`

Returns the full content metadata record.

**Return tuple:**

| Field | Solidity type | Source field |
|-------|--------------|-------------|
| `creator` | `address` | `content.creator` (converted via `AddressMapper::to_address`) |
| `metadataHash` | `bytes32` | `content.metadata_hash` |
| `subscriptionPrice` | `uint128` | `content.subscription_price` |
| `ppvPrice` | `uint128` | `content.ppv_price` |
| `ownershipPrice` | `uint128` | `content.ownership_price` |
| `periodLength` | `uint32` | `content.period_length` (in blocks) |

The `title` field of `ContentMetadata` is **not** exposed via this function. The precompile interface focuses on machine-readable identifiers and pricing; the human-readable title is best fetched off-chain via the standard pallet storage RPC (`state_getStorage`) when needed.

**Reverts:**

| Condition | Revert message |
|-----------|---------------|
| Content does not exist | `"ContentNotFound"` |

**Storage reads:** 1 (`Contents`). Weight charged as `StorageRead(1)`.

**Source:** `precompiles.rs:137-156`

### 4.3 `isOwner(uint32 contentId, address who) → bool owned`

Returns `true` if `who` holds permanent ownership of the content.

**Return value:** boolean.

**Behaviour:** Performs a single storage existence check on `Ownership[content_id, who]`. Does **not** check for subscription or PPV rights. Equivalent to `checkAccess(content_id, who) == 2`, but cheaper because it skips the content-existence check and the subscription/PPV reads.

**Reverts:** None. Returns `false` for non-existent content (silently — there is no `ContentNotFound` revert).

**Storage reads:** 1 (`Ownership`). Weight charged as `StorageRead(1)`.

**Source:** `precompiles.rs:158-165`

### 4.4 `getSubscription(uint32 contentId, address subscriber) → (bool exists, uint32 expiryBlock)`

Returns the raw subscription record, **without** evaluating whether the subscription is currently active.

**Return tuple:**

| Field | Meaning |
|-------|---------|
| `exists` | `true` if a subscription record exists for `(content_id, subscriber)` |
| `expiryBlock` | The block at which the subscription expires; `0` if no record exists |

**Caller responsibility:** the caller must compare `expiryBlock` against the current block height to determine whether the subscription is active. This is intentional: it allows callers to distinguish between "expired but still on record" (e.g., for renewal eligibility) and "active". For a single boolean active-or-not check, use `checkAccess` and compare against `0`.

**Reverts:** None.

**Storage reads:** 1 (`Subscriptions`). Weight charged as `StorageRead(1)`.

**Source:** `precompiles.rs:167-178`

### 4.5 `getViewPack(uint32 contentId, address viewer) → (bool exists, uint32 viewsRemaining)`

Returns the raw view pack record.

**Return tuple:**

| Field | Meaning |
|-------|---------|
| `exists` | `true` if a view pack record exists |
| `viewsRemaining` | The number of remaining views; `0` if no record exists |

**Caller responsibility:** if `viewsRemaining == 0` and `exists == true`, the pack is depleted but has not yet been cleaned up by `consume_view`. The caller should treat this case as "no PPV access available", equivalent to `exists == false` for access-control purposes.

**Reverts:** None.

**Storage reads:** 1 (`ViewPacks`). Weight charged as `StorageRead(1)`.

**Source:** `precompiles.rs:180-193`

---

## 5. Address Mapping

Solidity callers identify accounts using 20-byte `address` types (H160). `pallet-content-rights` stores accounts as `T::AccountId`, which in the standard configuration is `AccountId32` (32 bytes). The precompile bridges these two representations using `pallet-revive`'s `AddressMapper` trait.

### 5.1 Solidity address → AccountId

Used by `checkAccess`, `isOwner`, `getSubscription`, `getViewPack` to convert the `address` parameter into the type expected by storage reads.

```rust
let who = env.to_account_id(&H160(call.who.0 .0));
```

`Ext::to_account_id` is the pallet-revive helper that delegates to the runtime's configured `AddressMapper`. The mapping is deterministic and reversible (within the precompile's purposes).

### 5.2 AccountId → Solidity address

Used by `getContent` to return the creator's identity in a Solidity-friendly form.

```rust
let creator_h160 =
    <<T as pallet_revive::Config>::AddressMapper as pallet_revive::AddressMapper<T>>::to_address(
        &content.creator
    );
```

### 5.3 Implications for Solidity callers

A Solidity caller passing an `address` parameter is implicitly addressing the **pallet-revive AccountId32** that maps to that address. If the underlying pallet stores rights against a different AccountId32 (e.g., one created by a Polkadot-native client without ever interacting with `pallet-revive`), the precompile will report no rights — even though the Polkadot-native query would succeed.

This is a known limitation of any EVM/Substrate hybrid runtime. It does not affect rights granted through the precompile path or through Solidity contracts using the pallet's extrinsics, but it does mean that mixed Polkadot-native + EVM use of the same content requires careful account-mapping coordination.

---

## 6. Weight Charging

All five functions charge weight via the `StorageRead` token before performing any storage reads. The token is defined as:

```rust
#[derive(Copy, Clone, Debug)]
struct StorageRead(u32);

impl<T: Config> Token<T> for StorageRead {
    fn weight(&self) -> Weight {
        // Placeholder: ~25_000 ref_time per storage read, no proof size
        Weight::from_parts(25_000 * self.0 as u64, 0)
    }
}
```

| Token | Function | `ref_time` charged |
|-------|----------|-------------------|
| `StorageRead(3)` | `checkAccess` | 75,000 |
| `StorageRead(1)` | `getContent`, `isOwner`, `getSubscription`, `getViewPack` | 25,000 |

**Important caveat:** the 25,000 `ref_time` per read is a placeholder constant, not a benchmarked value. The TODO marker is preserved in the source. Production deployment requires running the FRAME benchmarking suite for the precompile's storage reads and substituting measured weights. The current values are sufficient to prevent free unbounded reads but should not be relied upon for accurate fee calculation.

The `proof_size` component is currently set to zero. This is incorrect for any storage read that contributes to the PoV — a benchmarked replacement should include realistic proof_size charges.

---

## 7. Example Usage

### 7.1 Solidity contract using the precompile

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IContentRights {
    function checkAccess(uint32 contentId, address who)
        external view returns (uint8 rightsType);
}

contract GatedContent {
    address constant CONTENT_RIGHTS = 0x0000000000000000000000000000000010010000;
    uint32 public contentId;

    constructor(uint32 _contentId) {
        contentId = _contentId;
    }

    modifier onlyWithAccess() {
        uint8 rights = IContentRights(CONTENT_RIGHTS).checkAccess(contentId, msg.sender);
        require(rights != 3, "No access");  // 3 = None
        _;
    }

    function streamUrl() external view onlyWithAccess returns (string memory) {
        return "https://example.com/content/secret";
    }
}
```

### 7.2 ethers.js client

```javascript
const { ethers } = require('ethers');

const CONTENT_RIGHTS_ABI = [
    "function checkAccess(uint32 contentId, address who) external view returns (uint8)",
    "function getContent(uint32 contentId) external view returns (address, bytes32, uint128, uint128, uint128, uint32)",
];

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:9990");
const contentRights = new ethers.Contract(
    "0x0000000000000000000000000000000010010000",
    CONTENT_RIGHTS_ABI,
    provider
);

const rightsType = await contentRights.checkAccess(42, "0x...");
console.log("Rights:", ["Subscription", "PayPerView", "Ownership", "None"][rightsType]);

const [creator, metadataHash, subPrice, ppvPrice, ownPrice, period] =
    await contentRights.getContent(42);
console.log("Creator:", creator);
console.log("Subscription price:", subPrice.toString());
```

---

## 8. Limitations and Open Questions

1. **Weight constants are placeholders.** The 25,000 `ref_time` per storage read is unbenchmarked. Production deployment requires measured values, including realistic proof_size charges.

2. **No write surface.** The precompile does not expose any write operations. Contracts must dispatch pallet extrinsics through the normal extrinsic submission path (via `pallet-revive`'s `instantiate`/`call` or via Substrate transactions). A future iteration could expose a small subset of write operations through a separate stateful precompile, at the cost of additional auditing surface.

3. **`getContent` omits `title`.** The human-readable content title is not returned; only the 32-byte `metadata_hash` and the pricing fields are exposed. This is a deliberate trade-off — strings would inflate the encoded return size and complicate the Solidity interface. Callers needing the title should use the standard Polkadot RPC (`state_getStorage` against `Contents[content_id]`).

4. **No batch query interface.** Each function reads a single content item. A caller wishing to verify access to N items must make N calls. A future `checkAccessBatch(uint32[] contentIds, address who)` could amortise the per-call overhead, but is not implemented.

5. **`getSubscription` and `getViewPack` return raw state.** They do not perform expiry/depletion checks. Callers must implement the active-or-not logic themselves, or use `checkAccess` instead.

6. **Address mapping assumes `pallet-revive`'s configured `AddressMapper`.** If a content item was created by a Polkadot-native account that has never interacted with `pallet-revive`, the precompile will not be able to map a Solidity `address` query back to that account. Mixed-mode use requires either consistent mapping or a separate AccountId32-keyed query path.

7. **No event emission.** Precompile calls do not emit events. Off-chain monitoring of access checks performed via the precompile requires external tracing (Solidity contract event mirroring, or RPC-level tracing).

8. **`isOwner` does not validate content existence.** Querying a non-existent content ID returns `false` rather than reverting. This is inconsistent with `checkAccess` and `getContent`, which both revert with `"ContentNotFound"`. The inconsistency reflects different design goals: `isOwner` is optimised for the common "do you own this?" check and skips the existence check for performance, while `checkAccess` performs the existence check to give consumers a clean error path.

---

## 9. Cross-references

- **Pallet storage layout:** `01 - Pallet Content Rights Specification.md` § 3
- **Equivalent extrinsic:** `01 - Pallet Content Rights Specification.md` § 6.7 (`check_access`)
- **Authorization model (pallet writes):** `03 - Security Threat Model and Authorization Matrix.md`
- **Source code:** `runtime/src/precompiles.rs` (entire file, 196 lines)
- **`alloy::sol!` macro reference:** alloy-rs `sol_types` crate documentation
- **`pallet-revive` precompile traits:** `pallet_revive::precompiles::{AddressMatcher, Precompile, Token}`
