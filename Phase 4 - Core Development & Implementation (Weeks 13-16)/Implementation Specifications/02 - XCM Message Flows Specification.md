# XCM Message Flows Specification

**Document type:** Implementation specification
**Sources:**
- `content-rights-parachain/runtime/src/configs/xcm_config.rs` (213 lines)
- `content-rights-parachain/scripts/perf/xcm-latency.mjs` (229 lines)
- `content-rights-parachain/scripts/xcm-e2e-test.mjs`
**XCM version in use:** XCM v3 (`AdvertisedXcmVersion = pallet_xcm::CurrentXcmVersion`)
**Last updated:** 2026-04-07

---

## 1. Purpose

This document specifies the XCM message formats used by CCRMS to perform cross-chain rights operations. It covers:

- The runtime XCM configuration (executor, barrier, router, fee model)
- The canonical XCM instruction sequence used for all cross-chain rights operations
- Sovereign account derivation
- Per-operation flow diagrams (subscribe, renew, purchase views, purchase ownership, transfer ownership)
- Observed end-to-end latency
- Limitations and known issues

The cross-chain extrinsics on `pallet-content-rights` (`xcm_subscribe`, `xcm_renew_subscription`, `xcm_purchase_views`, `xcm_purchase_ownership`, `xcm_transfer_ownership`) are documented separately in `01 - Pallet Content Rights Specification.md` § 6.8–6.13. This document explains how those extrinsics are reached from a remote chain.

---

## 2. XCM Runtime Configuration

The CCRMS parachain runs the standard Cumulus / `pallet-xcm` configuration, with the customisations summarised below.

### 2.1 Universal location

```rust
pub UniversalLocation: InteriorLocation = [
    GlobalConsensus(NetworkId::ByGenesis(ROCOCO_GENESIS_HASH)),
    Parachain(ParachainInfo::parachain_id().into()),
].into();
```

The chain identifies itself by its global consensus (Rococo) and parachain ID. This enables multi-hop XCM routing (e.g., `Ethereum → Bridge Hub → Asset Hub → CCRMS`) when integrated with Snowbridge.

### 2.2 Origin conversion

```rust
pub type XcmOriginToTransactDispatchOrigin = (
    SovereignSignedViaLocation<LocationToAccountId, RuntimeOrigin>,
    RelayChainAsNative<RelayChainOrigin, RuntimeOrigin>,
    SiblingParachainAsNative<cumulus_pallet_xcm::Origin, RuntimeOrigin>,
    SignedAccountId32AsNative<RelayNetwork, RuntimeOrigin>,
    XcmPassthrough<RuntimeOrigin>,
);
```

The converter is tried in declaration order; the first match wins. For sibling-parachain Transact messages, `SovereignSignedViaLocation` derives a deterministic local `AccountId32` from the sender's `MultiLocation` (see § 2.3). The converted origin is then passed to the dispatched extrinsic as a normal `Signed` origin, which is what `pallet-content-rights` extrinsics see when they call `ensure_signed`.

### 2.3 `LocationToAccountId`

```rust
pub type LocationToAccountId = (
    ParentIsPreset<AccountId>,
    SiblingParachainConvertsVia<Sibling, AccountId>,
    AccountId32Aliases<RelayNetwork, AccountId>,
    HashedDescription<AccountId, DescribeFamily<DescribeAllTerminal>>,
    GlobalConsensusParachainConvertsFor<UniversalLocation, AccountId>,
);
```

For a sibling parachain (the most common case for CCRMS XCM flows), `SiblingParachainConvertsVia<Sibling, _>` produces the well-known **sibling sovereign account** format:

```
bytes[0..4]   = "sibl"        (0x7369626c)
bytes[4..8]   = ParaId as little-endian u32
bytes[8..32]  = 0x00 × 24
```

For Parachain ID 200, the sovereign account on Parachain 100 is therefore:

```
0x7369626cc8000000000000000000000000000000000000000000000000000000
```

This account is debited when the remote parachain forwards an XCM `Transact` that pays for a CCRMS operation.

> **Implementation note (recorded as a memory item):** when constructing the sovereign account from JavaScript via `polkadot.js`, `u32.toHex()` defaults to big-endian encoding. The little-endian form must be obtained explicitly with `toHex(true)`. An early version of the test harness used the wrong endianness and produced an account that was funded but never debited.

### 2.4 Asset model

| Property | Value | Notes |
|----------|-------|-------|
| `IsReserve` | `NativeAsset` | Only the relay chain native asset is treated as a reserve |
| `IsTeleporter` | `()` | Teleports completely disabled |
| `AssetTransactor` | `LocalAssetTransactor` (`FungibleAdapter` on `Balances`) | Local fungible operations route through the native balance pallet |
| `AssetTrap` | `PolkadotXcm` | Trapped assets are claimable via `pallet-xcm` |

The exclusion of teleports is a deliberate trust-minimisation decision: only the relay chain asset is considered a reserve, and all cross-chain payments are sourced from the sender's sovereign account holding rather than from teleported balances.

### 2.5 Weight, fees, and limits

| Constant | Value | Source |
|----------|-------|--------|
| `UnitWeightCost` | `Weight::from_parts(1_000_000_000, 64 * 1024)` | `xcm_config.rs:100` |
| `MaxInstructions` | `100` | `xcm_config.rs:189` |
| `MaxAssetsIntoHolding` | `64` | `xcm_config.rs` |
| `Weigher` | `FixedWeightBounds<UnitWeightCost, RuntimeCall, MaxInstructions>` | `xcm_config.rs:142` |
| `Trader` | `UsingComponents<WeightToFee, RelayLocation, AccountId, Balances, ToAuthor<Runtime>>` | `xcm_config.rs:143–144` |
| Fee destination | Block author (`ToAuthor<Runtime>`) | |
| `XCM_FEE_AMOUNT` (test harness) | `100_000_000_000` | `xcm-latency.mjs:25` |

The 100 billion-token fee allowance was chosen empirically to cover the dominant cost component, which is `proof_size` rather than `ref_time`. See the recorded memory item *"XCM fees ~75–100B tokens due to BlockRatioFee proof_size scaling"* for the reasoning.

### 2.6 Barrier configuration

```rust
pub type Barrier = TrailingSetTopicAsId<
    DenyThenTry<
        DenyRecursively<DenyReserveTransferToRelayChain>,
        (
            TakeWeightCredit,
            WithComputedOrigin<
                (
                    AllowTopLevelPaidExecutionFrom<Everything>,
                    AllowExplicitUnpaidExecutionFrom<ParentOrParentsExecutivePlurality>,
                ),
                UniversalLocation,
                ConstU32<8>,
            ),
        ),
    ),
>;
```

Salient points:

- **All paid execution is allowed.** Any origin may dispatch Transact messages provided they pay for execution via `BuyExecution`. This is required for CCRMS's open cross-chain access model.
- **Unpaid execution is restricted** to the relay chain and the relay's executive plurality (governance).
- **Reserve transfers to the relay chain are denied** (recursively), reflecting that CCRMS does not act as a reserve for the relay asset.

> **Implementation note (recorded as a memory item):** *"User requires paid XCM execution (WithdrawAsset+BuyExecution), not UnpaidExecution workarounds."* All cross-chain rights operations therefore use the paid pattern, even in the local Zombienet test environment.

### 2.7 Router

```rust
pub type XcmRouter = WithUniqueTopic<(
    cumulus_primitives_utility::ParentAsUmp<ParachainSystem, (), ()>,
    XcmpQueue,
)>;
```

- **`ParentAsUmp`** delivers messages addressed to the relay chain via Upward Message Passing.
- **`XcmpQueue`** delivers messages to sibling parachains via XCMP.
- **`WithUniqueTopic`** wraps every outgoing message with a unique topic ID, enabling cross-chain message tracing.

---

## 3. Canonical Instruction Sequence

Every CCRMS cross-chain rights operation uses the same three-instruction XCM message:

```
1. WithdrawAsset       (from sovereign account holding)
2. BuyExecution        (purchase weight credit with the withdrawn asset)
3. Transact            (dispatch the local pallet extrinsic)
```

In XCM v3 JSON form (as constructed by `xcm-latency.mjs:59-65`):

```javascript
const xcmMessage = {
  V3: [
    {
      WithdrawAsset: [
        {
          id:  { Concrete: { parents: 1, interior: 'Here' } },  // relay chain native asset
          fun: { Fungible: 100_000_000_000 }                    // 100B tokens
        }
      ]
    },
    {
      BuyExecution: {
        fees: {
          id:  { Concrete: { parents: 1, interior: 'Here' } },
          fun: { Fungible: 100_000_000_000 }
        },
        weightLimit: 'Unlimited'
      }
    },
    {
      Transact: {
        originKind: 'SovereignAccount',
        requireWeightAtMost: { refTime: 1_000_000_000, proofSize: 100_000 },
        call: { encoded: encodedCall }                          // SCALE-encoded extrinsic
      }
    }
  ]
};
```

The destination is always a sibling parachain `MultiLocation`:

```javascript
const dest = { V3: { parents: 1, interior: { X1: { Parachain: 100 } } } };
```

`parents: 1` ascends to the relay chain; `Parachain(100)` descends to CCRMS (parachain ID 100 in the local Zombienet).

### 3.1 Why these three instructions and no more

CCRMS cross-chain operations are **stateful side-effects**, not asset transfers. They never need to deposit anything back into the sender's holding, never require `RefundSurplus`/`DepositAsset` instructions, and never need to round-trip a response. The minimal three-instruction pattern is therefore sufficient and avoids unnecessary weight overhead.

If a future flow needed to return a response (e.g., a query for content metadata), it would extend the message with `ReportTransactStatus` or `QueryResponse` instructions.

### 3.2 Origin kind: `SovereignAccount`

`originKind: 'SovereignAccount'` instructs the executor to derive the dispatch origin via `SovereignSignedViaLocation`. The resulting `Signed` origin is the sibling sovereign account derived in § 2.3. From the perspective of `pallet-content-rights`, this is indistinguishable from a normal local extrinsic.

This is why the `xcm_*` extrinsics on the pallet take a `beneficiary: T::AccountId` parameter: the **payer** is the sovereign account (debited via `pay_with_royalties`), but the **rights subject** is the user account on the remote chain, passed in explicitly.

---

## 4. Per-Operation Flows

For each operation, the diagram shows the actors:

- **User on Para B** (the originating party — typically Alice/Bob in tests)
- **Para B** (the remote parachain — content rights consumer)
- **Para B Sovereign Account on Para A** (the deterministic sibling-account derivation, § 2.3)
- **Para A = CCRMS** (this parachain)
- **Creator** (content creator on Para A)
- **Royalty recipients** (zero or more, configured via `set_royalty_splits`)

Throughout: **Para A** is CCRMS (parachain ID 100), **Para B** is the remote parachain (parachain ID 200).

### 4.1 Cross-chain subscribe (`xcm_subscribe`)

```
User (Alice on Para B)
   │
   │  pallet_xcm.send(dest=Para A, message=[Withdraw, BuyExec, Transact(xcmSubscribe(content_id, beneficiary=Bob))])
   ▼
Para B  ───── XCMP ─────►  Para A executor
                              │
                              │ 1. WithdrawAsset 100B from holding (sourced from Para B sovereign acct)
                              │ 2. BuyExecution: convert tokens → weight credit
                              │ 3. Transact:
                              │      origin = SovereignSignedViaLocation(Para B) = Para B sovereign account
                              │      call   = pallet_content_rights::xcm_subscribe(content_id, Bob)
                              │
                              ▼
Para A: pallet_content_rights::xcm_subscribe
                              │
                              │  ensure_signed(origin)               → payer = Para B sovereign acct
                              │  Contents[content_id]                → fetch creator, prices
                              │  pay_with_royalties(payer, creator, ...) → debit sovereign acct, credit creator + collaborators
                              │  mint_and_nest_child(creator, Bob, ...)  → mint Subscription child NFT, owner = Bob
                              │  Subscriptions[content_id, Bob] = SubscriptionInfo { expiry_block, auto_renew=false, child_item_id }
                              │  emit CrossChainSubscriptionCreated { content_id, beneficiary=Bob, payer, expiry_block }
                              ▼
                          state change persisted
```

**Encoded call (test harness):**
```javascript
const xcmSubscribeCall = apiA.tx.contentRights.xcmSubscribe(contentId, bob.address);
sendXcmTransact(apiA, apiB, xcmSubscribeCall.method.toHex(), alice, 'xcmSubscribe');
```

**Result on Para A:**
- `Balances::Transfer` events (payer → creator and any royalty recipients)
- `pallet_nfts::Issued` event (child NFT minted to Bob)
- `pallet_content_rights::ChildNested`
- `pallet_content_rights::CrossChainSubscriptionCreated`

### 4.2 Cross-chain renew (`xcm_renew_subscription`)

Identical message structure to § 4.1, with `xcm_renew_subscription(content_id, beneficiary)` as the encoded call. Preconditions on Para A:

- The beneficiary must already have a subscription
- `current_block ≥ sub.expiry_block`

**Encoded call:**
```javascript
const xcmRenewCall = apiA.tx.contentRights.xcmRenewSubscription(contentId, bob.address);
```

**Result events on Para A:**
- `Balances::Transfer` (payer → recipients)
- `pallet_content_rights::CrossChainSubscriptionRenewed`

No new NFT is minted; the existing child NFT is reused.

### 4.3 Cross-chain purchase views (`xcm_purchase_views`)

**Encoded call:**
```javascript
const xcmPpvCall = apiA.tx.contentRights.xcmPurchaseViews(contentId, charlie.address, numViews);
```

The third parameter, `num_views`, multiplies the per-view price. Otherwise the flow is identical to § 4.1, with the resulting events being:

- `Balances::Transfer` (payer → recipients)
- `pallet_nfts::Issued` (PPV child NFT for `charlie`, only if `charlie` does not already hold a pack — additive purchase reuses the existing child NFT, see pallet spec § 6.4)
- `pallet_content_rights::CrossChainViewPackPurchased`

### 4.4 Cross-chain purchase ownership (`xcm_purchase_ownership`)

**Encoded call:**
```javascript
const xcmOwnershipCall = apiA.tx.contentRights.xcmPurchaseOwnership(contentId, charlie.address);
```

Preconditions: `charlie` must not already own the content. Result:

- `Balances::Transfer` (payer → recipients)
- `pallet_nfts::Issued` (Ownership child NFT for `charlie`)
- `pallet_content_rights::ChildNested`
- `pallet_content_rights::CrossChainOwnershipPurchased`

### 4.5 Cross-chain transfer ownership (`xcm_transfer_ownership`)

**Encoded call:**
```javascript
const xcmTransferCall = apiA.tx.contentRights.xcmTransferOwnership(contentId, fromAccount, toAccount);
```

Critical authorization constraint (Finding B remediation, see `03 - Security Threat Model and Authorization Matrix.md`): **the dispatch origin must equal `from`**. This means the sovereign account that initiates the XCM must itself be the `from` account.

In practice, this is achieved one of two ways:

1. **The `from` user holds funds on Para A directly and signs locally.** (Not really an XCM flow.)
2. **The `from` user signs an extrinsic on Para B that wraps `xcm_transfer_ownership`**, and the message is dispatched with `originKind: SovereignAccount` so that the resulting Para A origin is the user's sibling-derived sovereign account, *which must equal `from`*.

In the second case, the `from` parameter passed to `xcm_transfer_ownership` must be the deterministic sibling sovereign account of the user, not their Para B account directly. This is a significant constraint and is one reason the user-facing UX for cross-chain ownership transfers is more complex than for purchases.

**Result events on Para A:**
- `pallet_nfts::Burned` (the seller's child NFT is burned)
- `pallet_nfts::Issued` (a fresh child NFT is minted to `to`)
- `pallet_content_rights::ChildNested`
- `pallet_content_rights::CrossChainOwnershipTransferred { content_id, from, to, authorizer }`

No royalties are charged (peer-to-peer secondary market).

---

## 5. Observed End-to-End Latency

Measurements from `xcm-latency.mjs` (3-run average, local Zombienet, single relay validator pair, single Para A and Para B collators):

| Operation | Block delta (ParaA send → ParaA event) | Wall-clock |
|-----------|---------------------------------------|------------|
| `xcm_subscribe` | 3 ± 2 blocks | ~99.6 s |
| `xcm_purchase_views` | 5 ± 1 blocks | ~100 s |
| `xcm_purchase_ownership` | 5 ± 2 blocks | ~100 s |

**Components of the observed latency:**

1. Block production on Para B (≈ 6 s)
2. Para B XCMP queue dispatch (one block)
3. Relay chain delivery (one or two relay blocks, ≈ 6 s each)
4. Para A XCMP queue receipt (one block)
5. Para A execution and event emission (within the receiving block)

The wall-clock dominates the block-delta measure because it includes the **wait** for the next Para A block after delivery, plus relay-chain finalization. In a high-throughput Polkadot 2.0 environment (Async Backing + Elastic Scaling, 2 s blocks with 3 cores), the latency would compress significantly — but the architectural minimum is still 3 block periods because of the producer/relay/consumer hop count.

**Implication for thesis evaluation:** these latency figures should be presented as upper bounds for the test environment, with a note that the underlying Polkadot 2.0 production network would deliver substantially better numbers.

---

## 6. Limitations and Known Issues

1. **XCM v3 only.** The runtime does not yet advertise XCM v4 or v5. Migration to v5 (which is bundled with Polkadot 2.0) would require updating the message construction in test scripts and revalidating multi-hop flows. The `pallet-content-rights` extrinsics themselves are unaffected.

2. **Fees are flat and oversized.** The 100 billion-token fee allowance is hard-coded and intentionally generous. A production deployment would compute fees dynamically based on the destination's `WeightToFee` configuration.

3. **No response/result handling.** The Transact instruction does not request a response. If the dispatched extrinsic fails on Para A (e.g., because `content_id` does not exist), the failure is observable only by inspecting Para A events. The remote chain does not receive a structured failure notification.

4. **`xcm_transfer_ownership` requires a sovereign-account origin equal to `from`.** This rules out delegated transfers (e.g., a marketplace contract on Para B initiating a transfer on behalf of the owner). A capability-based authorization model would relax this constraint while preserving safety.

5. **Single bridge dimension tested.** Only sibling-to-sibling XCMP flows have been measured end-to-end. Multi-hop flows (e.g., Ethereum → Bridge Hub → Asset Hub → CCRMS via Snowbridge) are documented in `07 - Snowbridge Integration Specification.md` but were not exercised at the integration test level due to the beacon-checkpoint blocker recorded in the project memory.

6. **Asset trapping is enabled but not exercised.** `AssetTrap = PolkadotXcm` allows trapped assets to be claimed, but the test flows always succeed in `BuyExecution`. The trap behaviour has not been tested under partial-failure conditions.

---

## 7. Cross-references

- **Pallet extrinsic specifications:** `01 - Pallet Content Rights Specification.md` § 6.8–6.13
- **Authorization model and Finding B:** `03 - Security Threat Model and Authorization Matrix.md`
- **NFT child lifecycle on cross-chain operations:** `06 - NFT Nesting Model Specification.md`
- **Bridging beyond Polkadot:** `07 - Snowbridge Integration Specification.md`
- **Project memory items:**
  - `feedback_sovereign_endianness.md` — `toHex(true)` for sovereign account derivation
  - `feedback_xcm_payment_required.md` — paid execution required, not unpaid
  - `project_xcm_fee_calculation.md` — 75–100B fee due to proof_size scaling
  - `project_layer3_xcm_e2e_passing.md` — Layer 3 XCM E2E test passing as of 2026-03-14
