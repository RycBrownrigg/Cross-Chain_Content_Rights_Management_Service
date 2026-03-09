# SETUP GUIDE for Local Parachain

# Local Polkadot Parachain Setup Guide – Content Rights Management Thesis

**Cross-Chain Content Rights Management Service**  
**Date of last successful run:** January 23, 2026  
**Hardware:** System76 Oryx Pro – Pop!_OS 22.04 LTS  
**Goal:** Run a local Rococo relay + custom parachain (ID 100) with Zombienet native provider, using a built-from-source parachain node with **pallet-revive** (ink! 6) and RMRK pallets.

---

## Current stack (ink! 6 + pallet-revive)

The **content-rights-parachain** repository uses **pallet-revive** (PolkaVM / ink! 6), not pallet-contracts. Use this repo as the parachain project:

- **Start network:** From the repo root: `./zombienet-spawn.sh my-content-rights.toml --provider native`
- **Parachain RPC:** **ws://127.0.0.1:9990** (fixed in `my-content-rights.toml`)
- **Chain state:** Developer → Chain state → pallet **revive** (for ink! 6 contracts)
- **Deploy/call contracts:** Contracts UI (ui.use.ink) or Extrinsics (`revive::uploadCode`, `revive::instantiate`); use **weight_limit** and see docs for RefTime/ProofSize limits and **revive::mapAccount** for extension accounts.

See **content-rights-parachain** → `README.md`, `SETUP_INSTRUCTIONS.md`, `INK_SETUP.md`, and `docs/THESIS_ALIGNMENT_INK6_PALLET_REVIVE.md` for full setup and deploy/call workflows.

---

## 1. Prerequisites – Fresh OS / Toolchain Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install build essentials + git + clang (required by Substrate)
sudo apt install -y build-essential git clang curl libssl-dev llvm libudev-dev protobuf-compiler pkg-config

# Install Rust (stable + wasm target + rust-src for WASM runtime compilation)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
rustup default stable
rustup target add wasm32-unknown-unknown
rustup component add rust-src --toolchain stable-x86_64-unknown-linux-gnu

# Optional: nightly for ink! contracts later
rustup toolchain install nightly
rustup target add wasm32-unknown-unknown --toolchain nightly
```

## 2. Clone Polkadot SDK & Parachain Template

```bash
# Clone the full SDK monorepo (we used polkadot-v1.4.0 branch)
git clone https://github.com/paritytech/polkadot-sdk.git
cd polkadot-sdk
git checkout polkadot-v1.4.0   # or release-polkadot-v1.5.0 / latest stable tag

# The template lives in templates/parachain
cd templates/parachain
```

**Alternative (recommended for cleaner separation – what we ended up using):**

```bash
cd ~
git clone https://github.com/paritytech/polkadot-sdk-parachain-template.git content-rights-parachain
cd content-rights-parachain
```

## 3. Build the Custom Parachain Node Binary

```bash
# First-time build (takes 10–60+ min)
cargo build --release -p node

# Verify binary exists
ls -la target/release/parachain-template-node
./target/release/parachain-template-node --version
# Expected: parachain-template-node 0.1.0-xxxx (polkadot-v1.x based)
```

**Important notes:**

- If `cargo build --release` (without `-p node`) succeeds but no binary appears → normal (workspace excludes node by default).
- Always use `-p node` to target the binary crate.

## 4. Zombienet Configuration (my-content-rights.toml)

Create or edit `~/my-content-rights.toml`:

```toml
[settings]
node_verifier = "None"
prometheus = true

[relaychain]
default_command = "polkadot"
default_args = [ "-lparachain=debug", "--rpc-external", "--rpc-methods=unsafe" ]
chain = "rococo-local"

[[relaychain.nodes]]
name = "alice"

[[relaychain.nodes]]
name = "bob"

[[parachains]]
id = 100
command = "/home/ryc/content-rights-parachain/target/release/parachain-template-node"
args = [
  "--rpc-external",
  "--rpc-cors=all",
  "--rpc-methods=unsafe",
  "--force-authoring"
]
name = "content-rights-parachain"

[[parachains.collators]]
name = "collator01"
# Do NOT duplicate args here – inherit from parachain level
```

## 5. Launch the Local Testnet

```bash
# Kill any lingering processes
pkill -f polkadot || true
pkill -f parachain-template-node || true
rm -rf /tmp/zombie-*

# Spawn
zombienet spawn my-content-rights.toml --provider native
```

**Expected outcome:**

- "Network launched 🚀🚀"
- Relay nodes (alice, bob) and collator01 running
- Parachain WS endpoint: **ws://127.0.0.1:9990** (when using content-rights-parachain’s `my-content-rights.toml`; otherwise check spawn output for the collator port)
- Blocks producing on both relay and parachain

**Verify in browser:**

- Open https://polkadot.js.org/apps/?rpc=ws://127.0.0.1:9990#/explorer (parachain; use port from spawn output if different)
- Watch block numbers increase
- Developer → RPC Calls → `state_getRuntimeVersion` → should show `"specName": "parachain-template"`

## 6. Troubleshooting Checklist (used during setup)

| Issue                                       | Fix / Command                                                               |
| ------------------------------------------- | --------------------------------------------------------------------------- |
| No `target/release/parachain-template-node` | Use `cargo build --release -p node`                                         |
| `no standard library sources` error         | `rustup component add rust-src --toolchain stable-x86_64-unknown-linux-gnu` |
| Missing `protoc` (litep2p build fail)       | `sudo apt install protobuf-compiler`                                        |
| `--rpc-cors` used multiple times            | Remove duplicate `args` from `[[parachains.collators]]`                     |
| No blocks producing                         | Check collator log: `tail -f /tmp/zombie-*/collator01.log`                  |
| Metadata not showing nicely                 | Use Developer → RPC Calls → state → getMetadata / getRuntimeVersion         |

## 7. Current Status

- Stable local Rococo relay + Parachain ID 100
- Custom runtime from `parachain-template` source with **pallet-revive** (ink! 6)
- Block production confirmed
- Smart contracts via **pallet-revive** (no pallet-contracts addition needed)
- Ready for RMRK pallet integration and ink! 6 contracts

Next planned steps:

- Integrate RMRK 2.0 (or RMRK-like) pallet for composable NFTs & royalty support
- Build & deploy ink! 6 contracts (`RightsManager`, handlers) via `revive::uploadCode` / `revive::instantiate` or Contracts UI

**Repository locations:**

- Polkadot SDK: `~/polkadot-sdk`
- Parachain project: `~/content-rights-parachain`
- Zombienet config: `~/my-content-rights.toml`
- Thesis contract code: (to be created) `~/content-rights-contracts/`

**Notes:**

- Always clean zombie dirs before re-spawn (`rm -rf /tmp/zombie-*`)
- Use absolute paths in TOML to avoid resolution issues
- Prometheus metrics available at collator port (e.g. http://127.0.0.1:41793/metrics)

This setup is reproducible on a fresh Pop!_OS install with the above commands.

Last verified: stable block production on ws://127.0.0.1:9990 (content-rights-parachain with pallet-revive).
