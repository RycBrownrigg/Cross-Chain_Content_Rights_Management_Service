# Snowbridge Integration Specification

**Document type:** Implementation specification
**Sources:**
- `content-rights-parachain/docs/SNOWBRIDGE_SESSION_LOG.md` (335 lines, 17-phase setup record)
- `content-rights-parachain/zombienet-snowbridge.toml` (4-chain topology)
- `content-rights-parachain/scripts/{configure-snowbridge,start-ethereum,deploy-gateway,snowbridge-full-setup,force-beacon-checkpoint,open-hrmp-snowbridge,verify-snowbridge-config}.{mjs,sh}`
- `content-rights-parachain/runtime/src/configs/xcm_config.rs` (Ethereum origin support via `HashedDescription`)
- `content-rights-parachain/polkadot-sdk/bridges/snowbridge/docs/v2.md` (V2 reference architecture)
**Last updated:** 2026-04-07

---

## 1. Purpose and Scope

This document specifies the Snowbridge integration achieved by the CCRMS prototype. It is intentionally narrow: it covers what was actually deployed, configured, and end-to-end tested, and clearly distinguishes that from the broader Snowbridge V2 architecture which is referenced as future work.

**End-to-end status as of 2026-03-23:** The local Snowbridge V1 pipeline is fully operational. **Two transactions successfully bridged 2 ETH from a local Ethereum chain to the local AssetHub parachain** via the full Snowbridge relay pipeline (Gateway contract → Ethereum execution layer → Lodestar beacon chain → Snowbridge relay → Bridge Hub light-client verification → XCM → AssetHub `foreignAssets.mint`).

The integration is **local-only** (Geth + Lodestar in-process Ethereum); it has **not** been exercised against a public testnet or mainnet. The thesis treats the local end-to-end demonstration as proof that the architecture works; production deployment would require connecting to a real Ethereum testnet.

The CCRMS parachain itself participates in the topology via HRMP channels with AssetHub. The pallet-content-rights extrinsics can in principle be paid for using bridged ETH held on AssetHub, but this final hop (bridged ETH → CCRMS subscription payment) was not exercised end-to-end during the prototype phase.

---

## 2. Architectural Overview

### 2.1 V1 trust model

Snowbridge V1 establishes a **trust-minimised, light-client-based bridge** between Ethereum and Polkadot:

| Direction | Trust assumption |
|-----------|-----------------|
| **Ethereum → Polkadot** | Trust the Ethereum beacon chain consensus (finalized headers verified via BLS signatures and Merkle proofs against the sync committee) |
| **Polkadot → Ethereum** | Trust the Polkadot validator set (BEEFY signatures verified by a Solidity light client deployed on Ethereum) |

Both directions verify cryptographic proofs end-to-end without requiring trusted intermediaries. The **relayer** is a permissionless actor: anyone can run a relayer to forward proofs and earn fees. Relayers do not have any privileged role; they cannot forge messages.

### 2.2 Bridge topology

```
                    ┌──────────────────┐
                    │   Rococo Relay   │
                    │   (alice, bob)   │
                    └────────┬─────────┘
                             │ HRMP
            ┌────────────────┼────────────────┐
            │                │                │
       ┌────▼────┐      ┌────▼────┐      ┌────▼────┐
       │ Bridge  │      │AssetHub │      │  CCRMS  │
       │  Hub    │◄────►│  (1000) │◄────►│  (100)  │
       │ (1013)  │ HRMP │         │ HRMP │         │
       └────┬────┘      └────┬────┘      └─────────┘
            │                │
            │                │
       ┌────▼────────────────▼──────┐
       │  Snowbridge Relayers       │
       │  ──────────────────────    │
       │  • Beacon Relay            │
       │  • Ethereum Relay          │
       └────┬────────────────┬──────┘
            │                │
       ┌────▼────┐      ┌────▼─────────┐
       │ Geth    │      │  Lodestar    │
       │ (exec)  │◄────►│ (beacon)     │
       │ :8545   │ EngineAPI :8551    │
       └────┬────┘      └──────────────┘
            │
       ┌────▼──────────────────────┐
       │  Gateway Contract Suite   │
       │  16 contracts             │
       │  GatewayProxy at          │
       │  0xb1185...8305           │
       └───────────────────────────┘
```

### 2.3 Component responsibilities

| Component | Role |
|-----------|------|
| **Gateway contracts (Ethereum)** | User-facing entry point. `Gateway.sendToken(asset, beneficiary, amount)` locks ETH/ERC-20 on Ethereum and emits an `OutboundMessage` event |
| **Geth** | Local Ethereum execution layer (chain ID 11155111, Snowbridge default) |
| **Lodestar** | Local Ethereum beacon chain producing finalized headers and sync committee proofs |
| **Beacon Relay** | Watches Lodestar finality, generates inclusion proofs, submits beacon header updates to Bridge Hub's `EthereumBeaconClient` pallet |
| **Ethereum Relay** | Watches Gateway events, generates receipt+execution+ancestry proofs, submits message bundles to Bridge Hub's `EthereumInboundQueue` pallet |
| **Bridge Hub** | Verifies beacon proofs and message proofs against the maintained beacon light client; forwards verified messages to AssetHub via XCM |
| **AssetHub** | Holds the foreign-asset reserve for bridged tokens; mints `Ether` foreign asset on receipt of verified message |
| **CCRMS (this parachain)** | Consumes bridged tokens via HRMP from AssetHub to pay for content rights operations |

### 2.4 Critical hop: AssetHub → CCRMS

The final hop — using bridged ETH (held as a foreign asset on AssetHub) to pay for a CCRMS subscription, PPV purchase, or ownership purchase — is **conceptually straightforward** but **not exercised end-to-end** in the prototype. The mechanism would be:

1. The user holds `Ether` foreign asset on AssetHub (received via the verified Snowbridge pipeline).
2. The user constructs an XCM message with `WithdrawAsset(Ether) → BuyExecution → Transact(xcm_subscribe(content_id, beneficiary))` and sends it via XCMP from AssetHub to CCRMS.
3. CCRMS's runtime debits the AssetHub sovereign account on CCRMS (via `pay_with_royalties` against `T::PaymentCurrency`) and creates the rights record.

The thesis acknowledges this final hop as documented but not measured. The intermediate steps (bridge to AssetHub, XCMP from AssetHub to a sibling parachain) are individually proven in their respective tests.

---

## 3. What Was Actually Deployed and Tested

### 3.1 Network topology

`zombienet-snowbridge.toml` defines a 4-chain topology:

| Para ID | Chain | Binary | Spec |
|---------|-------|--------|------|
| — | Rococo Relay | `polkadot` (alice, bob) | rococo-local |
| 1013 | Bridge Hub | `polkadot-parachain` | bridge-hub-rococo-local |
| 1000 | AssetHub | `polkadot-parachain` | asset-hub-rococo-local |
| 100 | CCRMS | `parachain-template-node` | local |

Post-launch, four HRMP channels are opened by `open-hrmp-snowbridge.mjs`:

- Bridge Hub (1013) → AssetHub (1000)
- AssetHub (1000) → Bridge Hub (1013)
- AssetHub (1000) → CCRMS (100)
- CCRMS (100) → AssetHub (1000)

This gives Snowbridge messages a path from Bridge Hub through AssetHub and onward to CCRMS, and a return path for any future Polkadot → Ethereum flows.

### 3.2 Ethereum side

| Component | Version | Role |
|-----------|---------|------|
| Geth | v1.17.1 | Execution layer; HTTP :8545, WS :8546, Engine API :8551 |
| Lodestar | **v1.35.0 (built from source)** | Beacon chain; mainnet preset, 8 validators |
| Snowbridge Gateway suite | latest from `polkadot-sdk/bridges/snowbridge` | 16 Solidity contracts deployed via Forge |
| GatewayProxy address | `0xb1185ede04202fe62d38f5db72f71e38ff3e8305` | User-facing entry point |

**Lodestar version pinning is critical.** Lodestar v1.41.0 silently ignores `LODESTAR_PRESET=mainnet` in dev mode and falls back to the minimal preset (32-validator sync committee). Bridge Hub's `EthereumBeaconClient` pallet, however, is compiled with `pubkeys: [PublicKey; 512]` — the mainnet preset's sync committee size — and rejects any update derived from the minimal preset. The only working configuration is **Lodestar v1.35.0 from source** with `LODESTAR_PRESET=mainnet` set explicitly. This single dependency choice was the difference between a working bridge and a permanently failing one.

### 3.3 Substrate side configuration

`scripts/configure-snowbridge.mjs` performs the following on a freshly-launched Zombienet:

1. **Set the Gateway contract address on Bridge Hub** via `system.setStorage` dispatched through relay sudo XCM (Superuser origin via `sendGovernanceTransact`).
2. **Create the `Ether` foreign asset on AssetHub** with the location `(GlobalConsensus(Ethereum { chain_id: 11155111 }))`.
3. **Set the Ether reserve on AssetHub** via a simulated bridge origin (`DescendOrigin` from Bridge Hub 1002, pallet 91, `UniversalOrigin Ethereum`). This step initialises the foreign asset's reserve information so AssetHub will accept future minting requests originating from Bridge Hub.
4. **Mint Ether to Alice and Ferdie** on AssetHub (10 ETH each) for testing purposes.

These steps are pre-encoded calls drawn from the Snowbridge reference implementation. They establish the on-chain state required for the relayer pipeline to deliver messages successfully.

### 3.4 Beacon checkpoint initialization

The Bridge Hub `EthereumBeaconClient` pallet maintains a light client of the Ethereum beacon chain. It must be **initialized** with a checkpoint — a finalized beacon header plus the corresponding sync committee — before it can verify any subsequent updates.

The initialisation flow (from `snowbridge-full-setup.sh`):

1. Wait approximately 20–40 minutes for Lodestar to reach a finalized epoch (with 8 validators on mainnet preset, finalization is slow due to sparse committee assignments).
2. Start the beacon state service **immediately** so that historical proofs for the finalized epoch are cached as they occur.
3. Generate the checkpoint via `force-beacon-checkpoint.mjs`, which submits the checkpoint hex through a sudo XCM message to Bridge Hub.
4. Verify the light client is initialized (`ethereumBeaconClient.latestFinalizedBlockRoot` is non-zero).

The artefact `dump-initial-checkpoint.json` is the JSON form of the generated checkpoint (a beacon header at slot 96 plus the 512-pubkey sync committee). The artefact `genesis.ssz` is the SSZ-encoded beacon genesis state used by Lodestar at startup. Both files are generated locally and are not version-controlled (they are deterministic per-run for a given Lodestar version and validator set).

### 3.5 Relayer deployment

Two relayers run concurrently after checkpoint initialization:

| Relayer | Source | Role |
|---------|--------|------|
| **Beacon Relay** | `snowbridge/relayer/cmd/beacon-relay` | Subscribes to Lodestar finality events; generates BLS signature inclusion proofs; submits beacon header updates to Bridge Hub |
| **Ethereum Relay** | `snowbridge/relayer/cmd/execution-relay-asset-hub` | Subscribes to Gateway `OutboundMessage` events on Geth; generates receipt + execution + ancestry proofs; submits message bundles to Bridge Hub's `EthereumInboundQueue` |

**Sovereign account funding** is required before the relayers can deliver messages. The Snowbridge sovereign account (`0xce796a...`) and the checking account (`0x6d6f646c...`) must hold balance on both Bridge Hub and AssetHub to pay for the XCM execution that delivers the bridged tokens. This funding is part of the setup script.

### 3.6 End-to-end verification

The full path was exercised twice (`ethNonce=2, paraNonce=2`):

```
Ethereum: Gateway.sendToken(WETH, Beneficiary{ AccountId32(Alice) }, 1 ETH)
   ↓
Geth: transaction included in block
   ↓
Lodestar: block finalized at epoch ≥ 162
   ↓
Beacon Relay: generates inclusion proof, submits to Bridge Hub
   ↓
Bridge Hub: ethereumBeaconClient.submit(...) verifies BLS signatures
            against sync committee, advances latestFinalizedBlockRoot
   ↓
Ethereum Relay: generates receipt+execution+ancestry proof for the
                Gateway sendToken event, submits message bundle
   ↓
Bridge Hub: ethereumInboundQueue.submit(...) verifies the proof
            against the verified beacon state root
   ↓
Bridge Hub: dispatches XCM message to AssetHub via HRMP
   ↓
AssetHub: foreignAssets.mint(Ether, Alice, 1 ETH)  ✅
```

After two successful runs, Alice held 22 ETH on AssetHub (20 minted manually for testing + 2 bridged via Snowbridge). The full path was confirmed via block explorer queries on each chain.

---

## 4. CCRMS XCM Configuration for Ethereum Origins

The CCRMS runtime is configured to recognise Ethereum-originated XCM messages even though the prototype did not exercise the final AssetHub → CCRMS hop. Two specific configuration choices enable this:

### 4.1 Universal location includes the global consensus

```rust
pub UniversalLocation: InteriorLocation = [
    GlobalConsensus(NetworkId::ByGenesis(ROCOCO_GENESIS_HASH)),
    Parachain(ParachainInfo::parachain_id().into()),
].into();
```

The inclusion of `GlobalConsensus(Rococo)` enables the runtime to interpret incoming messages whose origin paths begin with `GlobalConsensus(Ethereum)` — a multi-hop path that traverses two consensus systems (Ethereum, then Rococo, then a parachain).

### 4.2 `LocationToAccountId` chain handles Ethereum addresses

```rust
pub type LocationToAccountId = (
    ParentIsPreset<AccountId>,
    SiblingParachainConvertsVia<Sibling, AccountId>,
    AccountId32Aliases<RelayNetwork, AccountId>,
    HashedDescription<AccountId, DescribeFamily<DescribeAllTerminal>>,         // ← Ethereum
    GlobalConsensusParachainConvertsFor<UniversalLocation, AccountId>,         // ← multi-consensus
);
```

`HashedDescription<_, DescribeFamily<DescribeAllTerminal>>` is the converter that handles Ethereum-originated locations such as `GlobalConsensus(Ethereum) → AccountKey20(0xabc...)`. It produces a deterministic 32-byte sovereign account on CCRMS by hashing the description of the location with Blake2-256.

`GlobalConsensusParachainConvertsFor` handles cases where the origin descends from a different global consensus through a parachain (for example, `GlobalConsensus(Ethereum) → Parachain(1000)` for a sovereign account derived from AssetHub-as-seen-from-Ethereum).

The combined effect: any Ethereum address mentioned in an XCM message's origin will be deterministically mapped to a unique 32-byte CCRMS account, against which `pay_with_royalties` can be charged.

This means the CCRMS pallet is **already prepared** to receive and process cross-chain rights operations originating from Ethereum, even though the end-to-end test path was not exercised. The architectural prerequisite is satisfied.

---

## 5. Critical Issues Encountered and Resolved

The session log records nine non-trivial issues that had to be resolved before the end-to-end pipeline worked. Three are technically fundamental and are summarised below.

### 5.1 Lodestar preset mismatch

**Symptom:** Bridge Hub rejected all beacon header updates with a sync-committee-size mismatch.

**Root cause:** Lodestar v1.41.0 silently ignores `LODESTAR_PRESET=mainnet` in dev mode and uses the minimal preset (32-validator sync committee). Bridge Hub's `EthereumBeaconClient` pallet is compiled with `pubkeys: [PublicKey; 512]` (the mainnet preset value), so any minimal-preset update fails to deserialise.

**Resolution:** Build Lodestar v1.35.0 from source (which honours the `LODESTAR_PRESET` environment variable in dev mode) and set `LODESTAR_PRESET=mainnet`.

**Implication:** Bridge Hub cannot be reconfigured at runtime to accept a smaller sync committee. The mainnet preset is hard-coded into the pallet's storage layout. Any production deployment is locked to the mainnet preset.

### 5.2 Fork version configuration interpretation

**Symptom:** Beacon relay generated Merkle inclusion proofs at the wrong tree position (gindex 54 instead of 86 for Electra), causing Bridge Hub to reject the proofs.

**Root cause:** The Snowbridge relayer's `forkVersions` configuration field was being set to four-byte version bytes (e.g., `"deneb": "0x04000000"`) on the assumption that this matched the Ethereum spec's fork version identifier. The relayer code, however, interprets this field as a **fork activation epoch** — so `0x04000000` was being parsed as the integer `83,886,080`, putting the active fork far in the future and causing the relayer to use the wrong fork's gindex.

**Resolution:** Change the configuration to use plain epoch numbers:

```yaml
forkVersions:
  deneb: 0
  electra: 0
  fulu: 5000000
```

This tells the relayer that Deneb and Electra are active from genesis and Fulu is far in the future. The relayer then uses the Electra gindex (86) for Merkle proof construction, matching what Bridge Hub expects.

### 5.3 Beacon state cache timing

**Symptom:** Relay would attempt to generate proofs for the initial sync committee but find the required historical state had not been cached, causing the relay to abandon proof requests and stall.

**Root cause:** The beacon state service caches finalized state proofs as they occur, but only for new finalizations. If the service starts after Lodestar has already finalized several epochs, the historical proofs needed for the initial sync committee are missing. Additionally, the relay's `retryWithBackoff` logic would abandon proof requests as soon as it noticed a newer finalized header, rather than continuing to retry the original request.

**Resolution:** Two changes:

1. **Start the beacon state service immediately after Lodestar starts**, so it captures every finalized epoch from the beginning. This is enforced in `snowbridge-full-setup.sh`.
2. **Patch `snowbridge/relayer/relays/beacon/header/syncer/syncer.go`** to disable the "newer finalized header" abandonment check, so the relay continues to retry the original request even if newer headers arrive in the meantime.

The patch is specific to the local development environment and would not be needed in a production deployment where the state service runs continuously from genesis.

---

## 6. Snowbridge V2: Reference for Future Work

The polkadot-sdk repository includes a V2 design document at `polkadot-sdk/bridges/snowbridge/docs/v2.md`. V2 is the production version that went live on Polkadot mainnet in November 2025 (see the literature review v2 entries for `Snowbridge V2 Is Live!` and the Polkassembly proposal). It is **not** what the CCRMS prototype implements; the prototype targets V1.

V2's improvements relevant to CCRMS:

| Feature | V1 (this project) | V2 (production, future work) |
|---------|------------------|-----------------------------|
| Message ordering | Global nonce per direction | Unordered messaging via Merkle tree commitment |
| Programmability | Two-step (bridge then transact locally) | Direct `Transact` from Ethereum to any parachain |
| Fee model | Fixed pre-funding | Dry-run cost calculation across all hops |
| Fee assets | Native chain assets | WETH (P→E), ETH (E→P) |
| Latency | ~150 blocks per E2E | Pipelined, ~35 minutes per V2 production data |
| TVL | n/a (local) | $75M as of Nov 2025 (per Snowfork announcement) |

The thesis can legitimately claim that the architecture chosen in the CCRMS prototype is **forward-compatible with V2**. The XCM configuration that enables Ethereum-origin processing on CCRMS (`HashedDescription`, `GlobalConsensusParachainConvertsFor`) is the same configuration V2 uses. Migrating CCRMS to a V2-based bridge would not require changes to `pallet-content-rights` itself; it would be confined to the bridge configuration on AssetHub and Bridge Hub.

---

## 7. Limitations of the Prototype Integration

1. **Local Ethereum only.** Geth + Lodestar run in-process. No public testnet has been used. The integration has not been validated against the realities of public Ethereum (variable block times, contention, MEV, beacon-chain reorgs).

2. **Final hop not exercised end-to-end.** Bridged ETH on AssetHub has not been used to pay for a CCRMS subscription via XCM. The XCM configuration on CCRMS supports it, but the explicit AssetHub → CCRMS payment flow was not measured.

3. **Snowbridge V1, not V2.** The production network uses V2. The prototype's results are valid as a proof of architectural feasibility, but the latency and fee figures should not be compared directly against V2 production benchmarks.

4. **Lodestar v1.35.0 dependency is fragile.** Future Lodestar versions may not honour `LODESTAR_PRESET=mainnet` in dev mode. A production deployment would not face this issue (the production beacon chain always uses mainnet preset by default), but reproducing the local setup years from now will require careful version pinning.

5. **Sync committee size is hard-coded in Bridge Hub.** Switching to the minimal preset (e.g., for faster local testing) would require recompiling Bridge Hub with a different `pubkeys` array length. This is an upstream Snowbridge constraint, not a CCRMS one.

6. **Manual checkpoint generation and submission.** The beacon checkpoint must be generated and submitted at a specific point in the setup sequence (immediately after the first finalization). A production deployment would have a more robust initialisation flow, including the ability to recover from a stale checkpoint.

7. **Relayer is patched.** The local relay required patching `syncer.go` to disable the newer-finalized-header abandonment check. This patch is local-environment-specific and is not upstreamed. A production deployment would not need it.

8. **CCRMS does not yet accept a foreign asset as `PaymentCurrency`.** The current CCRMS runtime configures `PaymentCurrency` to be the native parachain token. To pay for content rights with bridged ETH from AssetHub, a future iteration would need to either (a) configure `PaymentCurrency` as the foreign Ether asset, or (b) introduce a swap step that converts ETH to the native asset before invoking `pay_with_royalties`. Option (b) is more flexible but adds complexity; option (a) is simpler but ties pricing to a single bridged asset.

---

## 8. Cross-references

- **Local-only XCM flows (sibling parachains, no bridge):** `02 - XCM Message Flows Specification.md`
- **CCRMS runtime XCM configuration:** `02 - XCM Message Flows Specification.md` § 2
- **Ethereum address mapping:** `02 - XCM Message Flows Specification.md` § 2.3 and § 4 of this document
- **Source artefacts:**
  - Session log: `content-rights-parachain/docs/SNOWBRIDGE_SESSION_LOG.md` (335 lines)
  - Topology: `content-rights-parachain/zombienet-snowbridge.toml`
  - Substrate configuration: `content-rights-parachain/scripts/configure-snowbridge.mjs`
  - Ethereum bring-up: `content-rights-parachain/scripts/start-ethereum.sh`
  - Contract deployment: `content-rights-parachain/scripts/deploy-gateway.sh`
  - Full setup automation: `content-rights-parachain/scripts/snowbridge-full-setup.sh`
  - Checkpoint forcing: `content-rights-parachain/scripts/force-beacon-checkpoint.mjs`
  - HRMP setup: `content-rights-parachain/scripts/open-hrmp-snowbridge.mjs`
  - Diagnostics: `content-rights-parachain/scripts/verify-snowbridge-config.mjs`
- **Reference V2 design:** `content-rights-parachain/polkadot-sdk/bridges/snowbridge/docs/v2.md`
- **Memory:** `project_snowbridge_progress.md` (E2E COMPLETE 2026-03-23, two transactions bridged successfully)
- **Literature review entries:** Snowbridge V2 production launch (Nov 2025), Snowbridge 2025/2026 stabilization, in `Phase 1/Literature review v2.md` (entries 85-86)
