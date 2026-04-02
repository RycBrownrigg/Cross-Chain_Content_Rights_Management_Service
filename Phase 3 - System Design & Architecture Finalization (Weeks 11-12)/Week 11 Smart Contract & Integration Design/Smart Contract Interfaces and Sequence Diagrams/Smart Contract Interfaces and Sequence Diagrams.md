# Smart Contract Interfaces and Sequence Diagrams

**Implementation stack:** These contractual agreements are executed utilizing **ink! 6** and deployed on the **content-rights-parachain** runtime through **pallet-revive** (PolkaVM). Deployment is conducted via `revive::uploadCode` / `revive::instantiate` or the Contracts User Interface (ui.use.ink); chain extensions should be employed to facilitate interactions with RMRK (or content-rights) pallet.

---

This document consolidates the designs for the subscription, pay-per-view (PPV), and purchase verification contract interfaces, along with an explanation of how these designs work together. It also includes UML sequence diagrams. The designs are based on RMRK 2.0 + scheduled XCM, ensuring a unified rights token with minimal custom code.

## Design Principles
- **Unified Rights Token**: One RMRK 2.0 NFT per content piece, with equipped resources for access tiers (subscription expiry, PPV view pack, permanent ownership flag).
- **ink! Contracts**: Lightweight wrappers around RMRK for monetization enforcement.
- **Cross-Chain Integration**: XCM for intra-Polkadot flows; bridges (e.g., Snowbridge) for external chains.
- **Economic Efficiency**: Low weight/gas; scheduled XCM for recurring actions.
- **Security**: Leverage audited RMRK primitives; custom ink! limited to verification.

## How These Designs Work Together
These designs constitute a **layered, synergistic architecture** utilizing RMRK 2.0 (a composable NFT standard) as the core token, ink! contracts for monetization enforcement and XCM for cross-chain interoperability. The **RightsManager** oversees all processes, while specialized handlers such as SubscriptionHandler, PayPerViewHandler, and PurchaseVerifier manage specific operational models. All components interact with the RMRK pallet for state management (e.g., equipping) resources).

- **RMRK 2.0 Foundation**: The base NFT holds ownership; equipped resources represent tiers (e.g., subscription child NFT with expiry).
- **ink! Layer**: Contracts enforce payments, updates, and royalties; query RMRK for state.
- **XCM/Bridges**: Propagate changes across chains (e.g., scheduled renewals).
- **Unified Flow**: Mint via RightsManager → equip tiers → handlers update resources → XCM transfers preserve state.

This accomplishes hybrid monetization (G7 gap) with fees below 5%, sub-second verification, and cross-chain capabilities portability.

## Core Data Structures (Storage Patterns)
```rust
#[ink(storage)]
pub struct RightsManager {
    collection_id: u32,  // RMRK collection ID
    content_to_nft: Mapping<ContentId, u64>,  // Content ID → NFT ID
    nft_access_state: Mapping<u64, AccessState>,  // Quick flags
    royalty_config: Mapping<u64, Vec<RoyaltyShare>>,  // Splits
    treasury: AccountId,  // Fee collector
}

pub struct AccessState {
    is_permanent: bool,
    last_access: u64,
    ppv_remaining: Option<u32>,
}

pub struct RoyaltyShare {
    recipient: AccountId,
    percentage: u16,  // Basis points
}
```

## Contract Interfaces

### RightsManager (Main Entry Point)
```rust
#[ink(message)]
pub fn mint_content_rights(
    &mut self,
    content_id: ContentId,
    initial_tier: AccessTier,  // Enum: Subscription(u64), PPV(u32), Permanent
    metadata_uri: String,
    royalty_shares: Vec<RoyaltyShare>,
) -> Result<u64, Error> {
    // Mint RMRK NFT + equip initial resource
    // Store royalty + return NFT ID
}

#[ink(message)]
pub fn check_access(&self, nft_id: u64, caller: AccountId) -> Result<AccessGrant, Error> {
    // Query RMRK ownership + equipped resources + flags
    // Return: FullAccess, SubscriptionActive(expiry), PPVRemaining(views), Denied
}
```

### SubscriptionHandler
```rust
#[ink(message)]
pub fn renew_subscription(&mut self, nft_id: u64, payment_amount: Balance) -> Result<(), Error> {
    // Verify payment
    // Extend equipped subscription resource expiry
    // Distribute royalties via XCM
    // Schedule next renewal (XCM v5+)
}
```

### PayPerViewHandler
```rust
#[ink(message)]
pub fn consume_view(&mut self, nft_id: u64, proof_of_view: Proof) -> Result<(), Error> {
    // Verify ownership/delegation
    // Decrement/burn equipped PPV resource
    // Distribute royalties
}
```

### PurchaseVerifier
```rust
#[ink(message)]
pub fn upgrade_to_permanent(&mut self, nft_id: u64, payment: Balance) -> Result<(), Error> {
    // Verify payment
    // Set is_permanent flag
    // Remove subscription/PPV resources
}
```

## XCM Message Formats (Conceptual)
For cross-chain (e.g., renewal on sibling parachain):
```
XCM Message:
- WithdrawAsset (payment)
- BuyExecution (weight)
- Transact (call handler)
- DepositAsset (royalties)
- Schedule (next renewal)
```
Payload: NFT ID, expiry, royalty vector (hashed if large).

## UML Sequence Diagrams

### Diagram 1: Mint + Initial Tier Equip

![Mint + Initial Tier Equip](assets/Mint%20+%20Initial%20Tier%20Equip.png)

### Diagram 2: Subscription Renewal (Intra-Parachain + Scheduled)

![Subscription Renewal -Intra-Parachain + Scheduled-](assets/Subscription%20Renewal%20(Intra-Parachain%20+%20Scheduled).png)


### Diagram 3: PPV Consumption

![PPV Consumption](assets/PPV%20Consumption.png)


### Diagram 4: Permanent Upgrade

![Permanent Upgrade](assets/Permanent%20Upgrade.png)

### Diagram 5: Cross-Chain Transfer Example (e.g., to Ethereum via Bridge)

![Cross-Chain Transfer Example -e.g., to Ethereum via Bridge-](assets/Cross-Chain%20Transfer%20Example%20(e.g.,%20to%20Ethereum%20via%20Bridge).png)

---

## Implementation Notes (Phase 4-5)

### Architectural Pivot: ink! Contracts → FRAME Pallet

The original design positioned ink! contracts (RightsManager, SubscriptionHandler, PayPerViewHandler, PurchaseVerifier) as the primary logic layer. During implementation, this was restructured:

| Original | Actual | Rationale |
|----------|--------|-----------|
| **ink! contracts** as primary logic | **`pallet-content-rights`** (FRAME pallet) as primary logic | Direct storage access, native weight system, no contract call overhead |
| **RightsManager** as orchestrator | Scaffolded but thin API layer | Pallet handles all state; contract provides external interface via pallet-revive precompile |
| **3 handler contracts** (Subscription, PPV, Purchase) | All logic in single pallet with `RightsType` enum | Simpler, more efficient, avoids cross-contract calls |
| **RMRK 2.0** for NFT state | **`pallet-nfts`** with attribute-based nesting | RMRK pallets abandoned; pallet-nfts is maintained and compatible |
| **Chain extensions** for contract→pallet | **Custom pallet-revive precompile** at `0x0000...0400` | Precompiles are the PolkaVM equivalent of chain extensions |

### Extrinsic Mapping (Design → Implementation)

| Designed Interface | Implemented Extrinsic | Call Index |
|-------------------|----------------------|------------|
| `RightsManager::mint_content_rights` | `register_content` | 0 |
| `SubscriptionHandler::subscribe` | `subscribe` | 1 |
| `SubscriptionHandler::renew` | `renew_subscription` | 2 |
| `PayPerViewHandler::purchase_views` | `purchase_views` | 3 |
| `PayPerViewHandler::consume_view` | `consume_view` | 4 |
| `PurchaseVerifier::purchase_ownership` | `purchase_ownership` | 5 |
| `RightsManager::check_access` | `check_access` | 6 |
| (not designed) | `xcm_subscribe`, `xcm_renew_subscription`, `xcm_purchase_views`, `xcm_purchase_ownership` | 7-10 |
| (not designed) | `transfer_ownership`, `xcm_transfer_ownership` | 11-12 |
| (not designed) | `set_royalty_splits` | 13 |
| (not designed) | `enable_auto_renew`, `disable_auto_renew` | 14-15 |
| (not designed) | `query_rights_metadata` | 16 |

### Data Structures: Design vs Implementation

| Designed | Implemented |
|----------|-------------|
| `RightsManager { collection_id, content_to_nft, nft_access_state, royalty_config, treasury }` | `ContentMetadata<T> { creator, metadata_hash, collection_id, content_item_id, title, subscription_price, ppv_price, ownership_price, period_length }` |
| `AccessState { is_permanent, last_access, ppv_remaining }` | Separate storage maps: `Subscriptions`, `ViewPacks`, `Ownership` |
| `RoyaltyShare { recipient, percentage }` | `RoyaltySplit { recipient: [u8; 32], basis_points: u16 }` |
| (not designed) | `RightsMetadata { content_id, rights_type, metadata_hash, title, prices, royalty_total_basis_points, num_collaborators }` |
