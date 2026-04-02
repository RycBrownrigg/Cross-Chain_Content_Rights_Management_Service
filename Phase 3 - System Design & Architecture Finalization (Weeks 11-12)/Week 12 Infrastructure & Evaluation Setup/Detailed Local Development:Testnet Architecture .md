### Current stack: ink! 6 + pallet-revive
**Parachain A (Rights Management Chain)** is the **content-rights-parachain** runtime with **pallet-revive** (ink! 6 / PolkaVM) and ink! 6 contracts. When using the single-parachain Zombienet config (my-content-rights.toml), the parachain RPC is **ws://127.0.0.1:9990**.

---

This is a detailed local development/testnet architecture for a cross-chain content rights management service.

It exemplifies a practical configuration that can be executed on a single high-performance development machine. The objective is to replicate as comprehensively as possible the genuine Polkadot ecosystem locally, encompassing the relay chain, numerous parachains, RMRK collections, ink! contracts, and a fundamental bridge simulation.

### Architecture Overview (Text Summary)

```
[Developer Machine / Local Cluster]

                ┌──────────────────────────────┐
                │        Polkadot Relay Chain  │
                │   (4 validators in dev mode) │
                │     ws://127.0.0.1:9944      │
                └───────────────┬──────────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
┌─────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ Parachain A     │   │ Parachain B         │   │ Bridge Simulation   │
│ (Your Rights    │   │ (Asset Hub /        │   │ (Mock Snowbridge)   │
│  Management     │   │  Statemine-like)    │   │  - Ethereum side    │
│  Chain)         │   │                     │   │  - Relay messages   │
│   • Collator    │   │   • Collator        │   │                     │
│   • RMRK pallet │   │   • Assets pallet   │   └──────────┬──────────┘
│   • Your ink!   │   │                     │              │
│     contracts   │   └─────────────────────┘              │
│   ws://127.0.0.1:9946          ws://127.0.0.1:9948       │
└────────┬────────┘                                            │
         │                                                   │
         └──────────────────── XCM Messages ──────────────────┘
                                 (via relay chain HRMP channels)

External Tools / Monitoring:
• Prometheus + Grafana          (metrics: block time, tx pool, weight usage)
• SubQuery / Subsquid           (indexing events: mint, renew, consume_view)
• Polkadot.js Apps              (UI interaction & debugging)
• Local IPFS node               (metadata storage)
```

### Detailed Local Development Architecture

![Detailed Local Dev Architecture](assets/Detailed%20Local%20Dev%20Architecture.png)


### Recommended Local Ports & Access Points

| Component                  | Type          | WS Port | HTTP Port | Purpose / Access URL                              |
|----------------------------|---------------|---------|-----------|---------------------------------------------------|
| Relay Chain                | Node          | 9944    | 9933      | `ws://127.0.0.1:9944` / `http://127.0.0.1:9933`   |
| Parachain A (Rights Mgmt)  | Collator      | 9946    | 9935      | Main development target                           |
| Parachain B (Asset Hub)    | Collator      | 9948    | 9937      | Testing XCM asset transfers                       |
| Mock Bridge                | Custom        | 9950    | 9951      | Simulated Ethereum endpoint                       |
| Prometheus                 | Monitoring    | —       | 9090      | http://localhost:9090                             |
| Grafana                    | Dashboard     | —       | 3000      | http://localhost:3000 (default admin/admin)       |
| SubQuery Node              | Indexer       | —       | 3001      | GraphQL endpoint for events                       |
| IPFS                       | Storage       | —       | 5001      | http://localhost:5001/api/v0                      |

### Suggested docker-compose.yml Skeleton (high-level)

```yaml
version: '3.8'

services:
  relay:
    image: parity/polkadot:v1.15.0  # Use latest stable at time
    command: --dev --tmp --rpc-external --ws-external --rpc-cors all
    ports:
      - "9944:9944"   # WS
      - "9933:9933"   # HTTP RPC
    volumes:
      - ./relay-data:/data

  para-a-collator:
    image: parity/polkadot-parachain:v1.15.0  # or custom build with your runtime
    command: --alice --collator --chain ./chainspecs/para-a.json --base-path /data --port 40333 --ws-port 9946 --rpc-port 9935 -- --chain rococo-local --execution wasm --state-pruning archive
    depends_on:
      - relay
    ports:
      - "9946:9946"
      - "9935:9935"
    volumes:
      - ./para-a-data:/data
      - ./chainspecs:/chainspecs

  # Similar for para-b-collator...

  mock-bridge:
    build: ./bridge-simulator  # Your custom Rust/Go bridge mock
    ports:
      - "9950:9950"
      - "9951:9951"
    depends_on:
      - relay
      - para-a-collator

  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    depends_on:
      - prometheus

  subquery-node:
    image: onfinality/subql-node:latest
    # config for indexing your parachain...
```

---

## Implementation Notes (Phase 4-5)

### Actual Architecture Deployed

The local development architecture evolved significantly beyond the original plan. Two distinct topologies were used:

**Topology 1: XCM Testing (2-chain)**
```
Rococo Relay Chain (alice, bob)
├── ParaA (100) — Content Rights at ws://127.0.0.1:9990
└── ParaB (200) — Consumer chain at ws://127.0.0.1:9991
```
Config: `zombienet-xcm-test.toml`, used for performance testing and XCM latency measurement.

**Topology 2: Snowbridge Testing (4-chain + Ethereum)**
```
Rococo Relay Chain (alice, bob)
├── Bridge Hub (1013) at ws://127.0.0.1:8943
├── AssetHub (1000) at ws://127.0.0.1:9910
└── Content Rights (100) at ws://127.0.0.1:9990
    ↑
Ethereum (Geth v1.17.1 at :8545 + Lodestar v1.35.0 at :9596)
├── Gateway contracts (16 deployed)
├── Beacon state service at :8080
├── Beacon relay
└── Ethereum relay
```
Config: `zombienet-snowbridge.toml`, used for Ethereum bridge E2E testing.

### Changes From Original Plan

| Planned | Actual | Notes |
|---------|--------|-------|
| 4 relay validators | 2 validators (alice, bob) | Sufficient for local dev |
| ParaA at ws://9946 | ParaA at ws://9990 | Port changed in config |
| ParaB as Asset Hub at ws://9948 | ParaB as consumer chain at ws://9991 | Separate AssetHub in 4-chain topology |
| Mock Snowbridge | **Full Snowbridge v1** | Geth + Lodestar + real relayers + 16 Gateway contracts |
| RMRK pallet | `pallet-nfts` | RMRK abandoned |
| SubQuery/Subsquid | Not used | Events queried directly via polkadot-js API |
| Prometheus + Grafana | Prometheus only | Scraped via `resource-monitor.mjs` |
| Local IPFS | Not used | Metadata hash stored on-chain |
| Docker for all components | Zombienet native provider | Simpler, faster startup |

### Setup Scripts Created

| Script | Purpose |
|--------|---------|
| `scripts/start-ethereum.sh` | Start Geth + Lodestar for local Ethereum |
| `scripts/deploy-gateway.sh` | Deploy 16 Snowbridge contracts via Forge |
| `scripts/snowbridge-full-setup.sh` | Full automated Ethereum bridge setup (~40 min) |
| `scripts/open-hrmp-channels.mjs` | Open HRMP between 2 parachains |
| `scripts/open-hrmp-snowbridge.mjs` | Open HRMP for 4-chain topology |
| `scripts/configure-snowbridge.mjs` | Configure gateway, Ether asset, accounts |
