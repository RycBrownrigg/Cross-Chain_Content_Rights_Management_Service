# Smart Contract Interfaces and Sequence Diagrams

**Implementation stack:** These contracts are implemented in **ink! 6** and deployed on the **content-rights-parachain** runtime via **pallet-revive** (PolkaVM). Deploy using `revive::uploadCode` / `revive::instantiate` or the Contracts UI (ui.use.ink); use chain extensions to interact with the RMRK (or content-rights) pallet.

---

This document consolidates the designs for the subscription, pay-per-view (PPV), and purchase verification contract interfaces, along with an explanation of how these designs work together. It also includes UML sequence diagrams. The designs are based on RMRK 2.0 + scheduled XCM, ensuring a unified rights token with minimal custom code.

## Design Principles
- **Unified Rights Token**: One RMRK 2.0 NFT per content piece, with equipped resources for access tiers (subscription expiry, PPV view pack, permanent ownership flag).
- **ink! Contracts**: Lightweight wrappers around RMRK for monetization enforcement.
- **Cross-Chain Integration**: XCM for intra-Polkadot flows; bridges (e.g., Snowbridge) for external chains.
- **Economic Efficiency**: Low weight/gas; scheduled XCM for recurring actions.
- **Security**: Leverage audited RMRK primitives; custom ink! limited to verification.

## How These Designs Work Together
These designs form a **layered, synergistic architecture** leveraging RMRK 2.0 (composable NFT standard) for the core token, ink! contracts for monetization enforcement, and XCM for cross-chain operations. The **RightsManager** orchestrates everything, while specialized handlers (SubscriptionHandler, PayPerViewHandler, PurchaseVerifier) manage specific models. All interact with the RMRK pallet for state (e.g., equipping resources).

- **RMRK 2.0 Foundation**: The base NFT holds ownership; equipped resources represent tiers (e.g., subscription child NFT with expiry).
- **ink! Layer**: Contracts enforce payments, updates, and royalties; query RMRK for state.
- **XCM/Bridges**: Propagate changes across chains (e.g., scheduled renewals).
- **Unified Flow**: Mint via RightsManager → equip tiers → handlers update resources → XCM transfers preserve state.

This achieves hybrid monetization (G7 gap) with <5% fees, sub-second verification, and cross-chain portability.

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

![ PPV Consumption](assets/%20PPV%20Consumption.png)


### Diagram 4: Permanent Upgrade

![Permanent Upgrade](assets/Permanent%20Upgrade.png)

### Diagram 5: Cross-Chain Transfer Example (e.g., to Ethereum via Bridge)

![Cross-Chain Transfer Example -e.g., to Ethereum via Bridge-](assets/Cross-Chain%20Transfer%20Example%20(e.g.,%20to%20Ethereum%20via%20Bridge).png)
