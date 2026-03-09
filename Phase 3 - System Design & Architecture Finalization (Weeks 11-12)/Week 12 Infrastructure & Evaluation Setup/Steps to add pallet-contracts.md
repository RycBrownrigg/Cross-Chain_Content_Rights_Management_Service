# Steps to add pallet-contracts

> **Superseded for content-rights-parachain (2026).**  
> The **content-rights-parachain** repository uses **pallet-revive** (ink! 6 / PolkaVM), not pallet-contracts. **Do not add pallet-contracts** to that runtime. For build, deploy, and call workflows (Contracts UI, weight limits, mapAccount), see:
> 
> - **content-rights-parachain** → `docs/THESIS_ALIGNMENT_INK6_PALLET_REVIVE.md` 
> - **content-rights-parachain** → `INK_SETUP.md` and `docs/DEPLOY_AND_CALL.md`
> 
> The instructions below are retained for historical reference only (e.g. if working with a different template that still uses pallet-contracts).

---

### Step 1 – Add dependencies to `runtime/Cargo.toml`

Open the file:

```bash
cd ~/content-rights-parachain/runtime
code Cargo.toml   # or nano / vim / your preferred editor
```

At the bottom of the `[dependencies]` section add these lines (use the same branch as your polkadot-sdk checkout; if unsure, check with `cd ~/polkadot-sdk && git branch`):

```toml
# === Contracts pallet & support crates ===
pallet-contracts = { git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.4.0", default-features = false, features = ["std"] }
pallet-contracts-primitives = { git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.4.0", default-features = false, features = ["std"] }
pallet-contracts-rpc = { git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.4.0", optional = true }

# Required for randomness in contracts (most templates don't include it)
pallet-insecure-randomness-collective-flip = { git = "https://github.com/paritytech/polkadot-sdk.git", branch = "polkadot-v1.4.0", default-features = false, features = ["std"] }
```

Save and exit.

### Step 2 – Modify `runtime/src/lib.rs`

Open the file:

```bash
code src/lib.rs
```

**A. Add the randomness pallet to `construct_runtime!`**

Find the big `construct_runtime!({ ... })` macro.  
Add these two lines among the other pallet declarations (order doesn't matter much, but usually near `Timestamp` or `Balances`):

```rust
InsecureRandomnessCollectiveFlip: pallet_insecure_randomness_collective_flip,
Contracts: pallet_contracts,
```

Example (snippet – your file will have many more):

```rust
construct_runtime!(
    pub enum Runtime where
        Block = Block,
        NodeBlock = opaque::Block,
        UncheckedExtrinsic = UncheckedExtrinsic
    {
        // --- existing pallets ---
        System: frame_system,
        Timestamp: pallet_timestamp,
        // add here ↓
        InsecureRandomnessCollectiveFlip: pallet_insecure_randomness_collective_flip,
        Contracts: pallet_contracts,
        // other pallets continue...
    }
);
```

**B. Add the `pallet_contracts::Config` implementation**

Place this block **before** the `construct_runtime!` macro (or after other pallet configs):

```rust
impl pallet_contracts::Config for Runtime {
    type Time = Timestamp;
    type Randomness = pallet_insecure_randomness_collective_flip::Pallet<Runtime>;
    type Currency = Balances;
    type Event = Event;
    type WeightPrice = pallet_transaction_payment::Pallet<Self>;
    type WeightInfo = pallet_contracts::weights::SubstrateWeight<Self>;
    type ChainExtension = ();
    type Schedule = pallet_contracts::Schedule;
    type CallStack = [pallet_contracts::Frame<Self>; 31];
    type DeletionQueueDepth = frame_support::traits::ConstU32<128>;
    type DeletionWeightLimit = frame_support::traits::ConstU32<{ 500 * 1024 * 1024 }>;
    type DepositPerItem = frame_support::traits::ConstU128<{ 100_000_000_000 }>;  // ~0.1 DOT
    type DepositPerByte = frame_support::traits::ConstU128<{ 1_000_000_000 }>;    // ~1 mDOT / byte
    type AddressGenerator = pallet_contracts::DefaultAddressGenerator;
    type MaxCodeLen = frame_support::traits::ConstU32<{ 2 * 1024 * 1024 }>;       // 2 MiB
    type MaxStorageKeyLen = frame_support::traits::ConstU32<128>;
    type UnsafeUnstableInterface = frame_support::traits::ConstBool<false>;
    type MaxDebugBufferLen = frame_support::traits::ConstU32<{ 2 * 1024 * 1024 }>;
}
```

Save and exit.

### Step 3 – Rebuild the node binary

```bash
cd ~/content-rights-parachain

# Clean previous artifacts to avoid stale state
cargo clean

# Build only the node (faster than full workspace)
cargo build --release -p node
```

- First time after adding deps → 10–40 minutes (downloads + compilation)
- Watch for errors. If any appear (dependency version conflicts, missing traits, etc.), copy the **first error message** and paste it here.

### Step 4 – Restart the testnet

```bash
# Kill everything cleanly
pkill -f polkadot          || true
pkill -f parachain-template-node || true
rm -rf /tmp/zombie-*

# Launch again
zombienet spawn my-content-rights.toml --provider native
```

Wait for "Network launched 🚀🚀" and note the **new parachain WS port** (usually in the 37xxx–46xxx range).

### Step 5 – Verify `contracts` pallet is live

1. Open Polkadot.js Apps with the new WS URL  
   https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:NEW-PORT#/explorer

2. Go to **Developer → Chain State**
   
   - In the pallet dropdown (top left), scroll and look for **contracts**
   - If present → success! Select it and try querying `codeStorage` (should be empty or default)

3. Optional RPC check:
   
   - Developer → RPC Calls → `state` → `getRuntimeVersion` → Submit  
     Look for `"specVersion"` increased by 1 (or more) compared to before.

4. Check collator log for errors:
   
   ```bash
   tail -f /tmp/zombie-*/collator01.log | grep -i error
   ```

If `contracts` appears in the pallet list → the pallet is integrated.  
You can now move to creating and deploying your first ink! contract.

### What to do next (after confirmation)

Reply with one of:

- "Build succeeded, contracts pallet is visible in Chain State"
- "Build failed – here is the error: [paste first few lines]"
- "Spawned but no contracts pallet in dropdown"

Then we immediately continue with:

1. Creating the `RightsManager` ink! project
2. Basic contract skeleton matching your interfaces (`mint`, `renewSubscription`, etc.)
3. Building the WASM blob
4. Uploading & instantiating via Polkadot.js → Developer → Contracts

This is the exact point where your thesis prototype becomes executable on-chain. Let's get that pallet live — run the steps and tell me how it went!
