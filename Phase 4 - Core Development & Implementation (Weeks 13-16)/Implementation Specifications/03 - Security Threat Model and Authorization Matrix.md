# Security Threat Model and Authorization Matrix

**Document type:** Implementation specification
**Sources:**
- `pallets/content-rights/src/lib.rs` (1,304 lines)
- `pallets/content-rights/src/tests.rs` (1,490 lines, of which 10 are security-focused tests)
- Phase 5 / Week 18 Security & Reliability Testing Report
- Reliability test results (`scripts/perf/results/reliability-results.json`)
**Last updated:** 2026-04-07

---

## 1. Purpose and Scope

This document specifies the security threat model for the CCRMS parachain, with particular focus on `pallet-content-rights`. It covers:

- The trust model and assumptions about the operating environment
- An authorization matrix listing every dispatchable extrinsic and the access control checks it performs
- The set of identified findings (A through H), their severity, exploitation conditions, and remediation status
- The set of unit tests that verify each authorization check
- The dependency-level vulnerability surface
- Production-hardening recommendations

This document does **not** cover:

- Network-layer attacks against the underlying libp2p stack (handled by the Polkadot SDK)
- Consensus-layer attacks (BABE/GRANDPA, handled by the relay chain)
- Runtime upgrade attacks (handled by the runtime upgrade governance process)
- Off-chain UI / wallet vulnerabilities (no UI was built for the prototype)

---

## 2. Trust Model and Assumptions

The CCRMS parachain operates under the following assumptions:

| Assumption | Justification |
|------------|---------------|
| The Polkadot relay chain provides safe consensus and message ordering | Inherited from the Polkadot SDK; out of scope for this thesis |
| The `pallet-nfts` and `pallet-balances` implementations are correct | Audited upstream; CCRMS uses public APIs only |
| The `pallet-revive` precompile sandbox enforces gas metering and storage isolation | Inherited from `pallet-revive`; CCRMS does not modify executor internals |
| Sibling parachain sovereign accounts are deterministically derived and cannot be impersonated | Enforced by `SovereignSignedViaLocation` (see XCM spec § 2.3) |
| Block authors are honest with respect to extrinsic ordering | Standard FRAME assumption; mitigations against transaction reordering are out of scope |
| All cryptographic primitives (Blake2, sr25519, BLS) are unbroken | Standard cryptographic assumption |

The threat model below considers attackers who can:

1. Submit any signed extrinsic with arbitrary parameters from a normal account
2. Operate a sibling parachain and craft arbitrary XCM messages
3. Hold creator, subscriber, or buyer roles for any content they choose to register or purchase

The threat model does **not** consider attackers who can:

- Compromise the relay chain validator set
- Modify pallet code via runtime upgrade (assumed to require legitimate governance)
- Bypass `pallet-revive` gas metering or precompile sandboxing

---

## 3. Authorization Matrix

The pallet exposes 17 dispatchable extrinsics. Every extrinsic uses `ensure_signed` to obtain a verified caller `AccountId`. Beyond that, each extrinsic performs business-logic authorization checks via `ensure!` clauses and storage lookups.

In the table below:

- **Identity check** = whether the caller's identity is constrained beyond "any signed account"
- **Storage check** = whether the extrinsic verifies pre-conditions against pallet state before mutating

| # | Extrinsic | Identity check | Storage check | Threat level |
|---|-----------|---------------|---------------|--------------|
| 0 | `register_content` | None (open) | None | Low — caller becomes the creator |
| 1 | `subscribe` | Caller = beneficiary | `!Subscriptions[content_id, caller]` | Low — caller pays for own access |
| 2 | `renew_subscription` | Caller = beneficiary | `Subscriptions[content_id, caller]` exists, `current_block ≥ expiry_block` | Low |
| 3 | `purchase_views` | Caller = beneficiary | None (additive purchase allowed) | Low |
| 4 | `consume_view` | Caller = consumer | `ViewPacks[content_id, caller]` exists, `views_remaining > 0` | Low |
| 5 | `purchase_ownership` | Caller = beneficiary | `!Ownership[content_id, caller]` | Low |
| 6 | `check_access` | None (open) | `Contents[content_id]` exists | None — read-only |
| 7 | `xcm_subscribe` | None (any payer) | `!Subscriptions[content_id, beneficiary]` | Low — see Finding A |
| 8 | `xcm_renew_subscription` | None (any payer) | `Subscriptions[content_id, beneficiary]` exists & expired | Low — see Finding A |
| 9 | `xcm_purchase_views` | None (any payer) | None | Low — see Finding A |
| 10 | `xcm_purchase_ownership` | None (any payer) | `!Ownership[content_id, beneficiary]` | Low — see Finding A |
| 11 | `transfer_ownership` | Caller = `from` (implicit, derived from origin) | `Ownership[content_id, caller]` exists, `!Ownership[content_id, to]` | Medium without check, Low with — verified by `OwnershipNotFound` semantics |
| 12 | `xcm_transfer_ownership` | **`ensure!(authorizer == from)`** (Finding B remediation) | `Ownership[content_id, from]` exists, `!Ownership[content_id, to]` | **Medium** — explicit authorization required |
| 13 | `set_royalty_splits` | **`ensure!(caller == content.creator)`** | `Contents[content_id]` exists, `Σ basis_points ≤ 10,000` | Medium — creator-only |
| 14 | `enable_auto_renew` | Caller = subscriber | `Subscriptions[content_id, caller]` exists, `!auto_renew` | Low |
| 15 | `disable_auto_renew` | Caller = subscriber | `Subscriptions[content_id, caller]` exists, `auto_renew == true` | Low |
| 16 | `query_rights_metadata` | None (open) | `Contents[content_id]` exists | None — read-only |

### 3.1 Authorization patterns by category

The pallet enforces three distinct authorization patterns:

1. **Self-authorized** (extrinsics 1, 2, 3, 4, 5, 11, 14, 15) — the caller is the only party affected by the operation. The natural alignment between caller identity and resource ownership means no additional `ensure!` is needed beyond storage existence checks.

2. **Creator-authorized** (extrinsic 13) — `set_royalty_splits` enforces `caller == content.creator` because royalty configuration affects the creator's revenue distribution and must not be modifiable by third parties.

3. **Cross-chain authorized** (extrinsic 12) — `xcm_transfer_ownership` enforces `authorizer == from`. This is the only extrinsic that performs an explicit identity check beyond the natural caller-as-actor pattern, because the cross-chain calling convention separates the dispatch origin (the sovereign account) from the rights subject (`from`), creating an opportunity for impersonation that would not exist in a local-only flow.

### 3.2 Why XCM payment-split extrinsics (7–10) are intentionally permissive

`xcm_subscribe`, `xcm_renew_subscription`, `xcm_purchase_views`, and `xcm_purchase_ownership` deliberately permit any caller to pay on behalf of any beneficiary. This is **economically neutral**: the payer always bears the cost, and the beneficiary cannot manipulate the payer into paying. The asymmetry enables legitimate use cases (cross-chain access purchases, gift transactions, parental delegation) at the cost of allowing the same pattern locally. Finding A (§ 4.1) records this trade-off explicitly.

---

## 4. Identified Findings

Eight findings were identified during Phase 5 / Week 18 security testing. Five (A, C, D, F, G) are documented as design properties or accepted limitations. Two (B, E) were vulnerabilities and have been remediated. One (H) is a positive observation about reliability.

### 4.1 Finding A — XCM extrinsics callable locally (Low, accepted)

**Severity:** Low
**Affected extrinsics:** `xcm_subscribe` (7), `xcm_renew_subscription` (8), `xcm_purchase_views` (9), `xcm_purchase_ownership` (10)

**Description:** The `xcm_*` extrinsics that decouple payer from beneficiary are callable from any local signed account, not just from XCM origins. A local user can call them as gift transactions, paying for another user's access.

**Threat analysis:** No theft is possible. The payer always bears the cost; the beneficiary cannot manipulate the caller. The pattern is economically equivalent to the payer manually transferring funds and then calling the standard extrinsic on behalf of the beneficiary.

**Status:** Accepted as a deliberate design property. Documented for production hardening; if a future deployment wants to restrict these to genuine XCM origins, the solution is to gate dispatch on `RawOrigin::Signed(_)` of a specific sovereign-account format, but this is not implemented.

### 4.2 Finding B — Authorization gap in `xcm_transfer_ownership` (Medium, FIXED)

**Severity:** Medium
**Affected extrinsic:** `xcm_transfer_ownership` (12)
**Status:** Remediated (commit `9ceca57`)

**Description:** The original implementation of `xcm_transfer_ownership(content_id, from, to)` performed only `ensure_signed(origin)` and then proceeded to look up `Ownership[content_id, from]`, burn the seller's NFT, and mint a new one for `to`. **No check enforced that the caller had any relationship to `from`.** An attacker could specify an arbitrary `from` and steal ownership of any content.

**Exploitation:** A signed account `attacker` could call:
```
xcm_transfer_ownership(content_id=42, from=victim, to=attacker)
```
and successfully transfer ownership of content 42 from `victim` to `attacker`, without the victim's consent.

**Remediation:** A single-line check was added at the top of the extrinsic body:

```rust
let authorizer = ensure_signed(origin)?;
ensure!(authorizer == from, Error::<T>::Unauthorized);
```

This restricts the cross-chain transfer to a caller that is itself the `from` account. In the cross-chain case, this means the user's own sovereign account (derived deterministically) must be the dispatch origin. Combined with `SovereignSignedViaLocation`, this provides the property that **only the rights holder can authorize the transfer**, without requiring an additional cryptographic authorization mechanism.

**Test verification:** `tests.rs::security_xcm_transfer_ownership_any_account_can_steal` confirms the exploit attempt now returns `Unauthorized`.

**Constraint introduced:** The fix rules out delegated transfers (e.g., a marketplace contract on a remote chain initiating the transfer on behalf of the owner). A capability-based authorization model would relax this constraint while preserving safety, but is out of scope for the prototype.

### 4.3 Finding C — Permissive `SafeCallFilter` configuration (Low, accepted)

**Severity:** Low
**Location:** `runtime/src/configs/xcm_config.rs:157`
**Status:** Accepted prototype configuration; documented for production hardening

**Description:** The XCM executor's `SafeCallFilter` is set to `Everything`, meaning any `RuntimeCall` may be dispatched via XCM `Transact`. A more restrictive production configuration would limit this to `ContentRights` and `Balances` calls only.

**Threat analysis:** In the current prototype, no other pallet exposes a privileged extrinsic that could be abused via XCM. The threat is purely architectural — a future addition of a privileged extrinsic could be unintentionally exposed cross-chain.

**Recommendation:** Replace `Everything` with an explicit allowlist of cross-chain-safe extrinsics before any production deployment.

### 4.4 Finding D — Zero-price content allowed (Low, accepted)

**Severity:** Low
**Affected extrinsic:** `register_content` (0)
**Status:** Accepted as intentional

**Description:** Content can be registered with all three prices (`subscription_price`, `ppv_price`, `ownership_price`) set to zero. The pallet does not enforce a minimum price floor.

**Threat analysis:** Free content distribution is a legitimate use case (open-access content, promotional material, public service media). No theft or denial-of-service is possible.

**Status:** Accepted. Documented as a feature, not a bug.

### 4.5 Finding E — View pack overwrite on re-purchase (Low, FIXED)

**Severity:** Low
**Affected extrinsic:** `purchase_views` (3)
**Status:** Remediated (commit `9ceca57`)

**Description:** The original implementation of `purchase_views` always overwrote `ViewPacks[content_id, buyer]` with a new `ViewPackInfo`. A user holding 10 views who purchased an additional 5 views would end up with **5 views, not 15** — losing their previously-paid views.

**Exploitation:** No malicious exploitation; the bug caused users to lose their own paid-for views. Treated as a Low severity finding because the harm is limited to the affected user.

**Remediation:** The extrinsic now checks for an existing pack and adds to it:

```rust
if let Some(mut existing) = ViewPacks::<T>::get(content_id, &buyer) {
    existing.views_remaining = existing.views_remaining.saturating_add(num_views);
    ViewPacks::<T>::insert(content_id, &buyer, existing);
} else {
    // mint new child NFT and create pack
}
```

**Test verification:** `tests.rs::security_purchase_views_overwrites_existing_pack` confirms 10 + 5 = 15.

### 4.6 Finding F — Single-collator MTTR ≈ 15-20 seconds (Low, accepted)

**Severity:** Informational
**Source:** Reliability test (Week 18)

**Description:** A single-collator parachain instance recovers from a SIGTERM-induced crash in approximately 15 seconds (RPC ready) and 20 seconds (first new block produced).

**Threat analysis:** In a production multi-collator deployment, the failure of any individual collator has zero user-visible impact because other collators continue producing blocks. The single-collator MTTR is therefore an artifact of the test environment and does not represent the production threat surface.

**Status:** Accepted; documented as the worst-case bound for a degenerate single-collator topology.

### 4.7 Finding G — 100% state persistence across crash (positive)

**Severity:** Informational (positive finding)
**Source:** Reliability test (Week 18)

**Description:** Following a SIGTERM-induced crash, all on-chain state was preserved. Pre-crash content registrations, subscriptions, ownership records, and royalty configurations were intact and queryable after restart. New transactions succeeded immediately.

**Threat analysis:** Confirms RocksDB-backed crash consistency at the Substrate framework level. No data loss observed.

### 4.8 Finding H — Block production rate unchanged after recovery (positive)

**Severity:** Informational (positive finding)
**Source:** Reliability test (Week 18)

**Description:** Post-restart block production rate (6.67 s/block, 90% uptime over 120 s) was indistinguishable from baseline. No lingering performance degradation was observed.

**Status:** Confirms the system returns to steady-state operation immediately after recovery.

---

## 5. Security Test Suite

The pallet's `tests.rs` file contains 56 unit tests, of which 10 are explicitly security-focused. Each security test maps to a finding or to a specific authorization invariant.

| Test name | Verifies | Maps to |
|-----------|----------|---------|
| `security_xcm_transfer_ownership_any_account_can_steal` | Exploit of Finding B is now blocked (`Unauthorized`) | Finding B |
| `security_zero_price_content_registration` | Zero-price content can be registered successfully | Finding D |
| `security_zero_views_purchase` | Edge case: purchasing 0 views creates a pack with 0 views | edge case |
| `security_self_subscribe_as_creator` | Creator can subscribe to their own content (self-payment is allowed) | edge case |
| `security_max_children_boundary` | 50th child NFT succeeds, 51st returns `MaxChildrenReached` | Boundary invariant |
| `security_content_id_overflow` | `NextContentId == u32::MAX` triggers `ContentIdOverflow` | Boundary invariant |
| `security_insufficient_balance_for_subscription` | Account with zero balance cannot subscribe | Payment integrity |
| `security_purchase_views_overwrites_existing_pack` | Finding E fix: 10 + 5 = 15 (additive) | Finding E |
| `security_double_ownership_purchase_rejected` | Second `purchase_ownership` call returns `AlreadyOwned` | Ownership uniqueness |
| `security_transfer_ownership_requires_ownership` | Non-owner attempting `transfer_ownership` returns `OwnershipNotFound` | Ownership integrity |

### 5.1 Error variant coverage

All 14 critical `Error` variants are exercised by the test suite:

```
ContentNotFound, SubscriptionAlreadyExists, SubscriptionNotFound,
SubscriptionNotExpired, ViewPackNotFound, NoViewsRemaining, AlreadyOwned,
InsufficientPayment, MaxChildrenReached, ContentIdOverflow,
OwnershipNotFound, Unauthorized, AutoRenewAlreadyEnabled, AutoRenewNotEnabled
```

This provides complete coverage of error-path handling for the public API surface.

---

## 6. Dependency Vulnerability Surface

`cargo audit` against the parachain workspace reports 8 advisories. **All originate from transitive dependencies of `polkadot-sdk`; none are in pallet code authored for this thesis.**

| Advisory category | Count | Component | Mitigation |
|-------------------|------:|-----------|------------|
| Networking | 2 | `quinn-proto`, `ring` | DoS / panic; no runtime impact (relay-only) |
| WASM executor | 4 | `wasmtime` | Resource exhaustion / panics / f64 segfault; sandboxed by Polkadot |
| TLS | 1 | `rustls-webpki` | CRL bypass; node-side only |
| Logging | 1 | `tracing-subscriber` | Log injection; observer layer only |

**Recommendation:** Update `polkadot-sdk` to the latest stable release. None of the advisories are exploitable through pallet logic written for the thesis; all are mitigated by Polkadot's WASM sandboxing and the runtime/node split.

---

## 7. Production-Hardening Recommendations

The following recommendations summarise the security posture changes required before any non-prototype deployment:

1. **Apply Finding B remediation** (DONE — included in commit `9ceca57`).
2. **Apply Finding E remediation** (DONE — included in commit `9ceca57`).
3. **Restrict `SafeCallFilter`** (Finding C) to an explicit allowlist of `ContentRights` and `Balances` calls.
4. **Update `polkadot-sdk`** to clear the 8 transitive advisories.
5. **Run full FRAME benchmarking** to replace placeholder weights (currently causing all extrinsics to be charged at constant cost, which underestimates worst-case load).
6. **Commission a third-party audit** for mainnet readiness. The Phase 5 internal review covers obvious local and XCM threat vectors; production deployment should add an independent review.
7. **Optionally enforce a price floor** on `register_content` to prevent dust-pricing attacks (Finding D is currently accepted but a production deployment may want a minimum).
8. **Optionally add resale royalties** to `transfer_ownership` to align with standard NFT marketplace expectations.
9. **Consider capability-based delegation** for `xcm_transfer_ownership` to enable safe delegated transfers without weakening Finding B's protection.

---

## 8. Cross-references

- **Per-extrinsic specifications:** `01 - Pallet Content Rights Specification.md`
- **XCM origin derivation and sovereign accounts:** `02 - XCM Message Flows Specification.md` § 2.3
- **Royalty distribution algorithm:** `04 - Royalty Algorithm Specification.md`
- **Test source:** `pallets/content-rights/src/tests.rs` (security tests at lines 875-1099)
- **Original security testing report:** `Phase 5/Week 18 Security & Reliability Testing/Security Testing Report.md`
- **Reliability data:** `scripts/perf/results/reliability-results.json`
- **Remediation commits:**
  - `9ceca57` — Findings B and E
  - `c2d6599` — Security test suite
  - `2a81b45` — Reliability tests
