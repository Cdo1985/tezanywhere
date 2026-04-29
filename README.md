@"
# TezAnywhere – Cross-Chain Payment Receipts Without Bridges

**Turn a Tezos payment into an instant update on any EVM chain (like Base).**

## How it works (the basic form)
1. User sends tez from their Tezos wallet to a destination address.
2. The transaction hash (receipt) is sent off‑chain to your server.
3. Your server verifies the payment on Tezos (using a node or indexer).
4. Upon confirmation, your server updates a ledger / smart contract / database on Base chain.
5. No token bridging, no wrapped assets, no long waits.

## What it unlocks
- Cross‑chain tipping for Farcaster / X / Discord
- AI agent micro‑payments (tez → API access)
- Subscription gating without custody
- Point‑to‑tez redemption (solve high gas fees)

## Quick start
```bash
git clone https://github.com/Cdo1985/tezanywhere.git
cd tezanywhere
npm install
cp .env.example .env
# Add your Tezos RPC URL and Base private key (for ledger updates)
npm run verify -- --hash <tezos_tx_hash>
