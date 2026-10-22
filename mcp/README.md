# @tamago-labs/wayfind-mezo

MCP server for the Mezo platform. Wallet operations, MUSD borrowing against BTC, trove management, Stability Pool staking, redemptions, and liquidations.

## What is Mezo & MUSD

Mezo is a Bitcoin-native DeFi platform. MUSD is the USD-pegged stablecoin minted on Mezo against BTC collateral.

### Mezo

Mezo brings DeFi to Bitcoin holders. Built as an EVM-compatible chain with BTC as the native asset:

- **BTC as gas** — No separate gas token needed
- **Fast finality** — Sub-second confirmation
- **Bitcoin security** — Proof-of-work via merge-mining
- **EVM compatibility** — Full Ethereum tooling support

### MUSD

MUSD is a collateralized debt position (CDP) stablecoin. Deposit BTC, mint MUSD, access liquidity without selling your Bitcoin.

1. **Open a Trove** — Deposit BTC as collateral, mint MUSD (min 1,800 MUSD debt, 110% collateralization)
2. **Maintain collateralization** — Keep ICR above 110% to avoid liquidation
3. **Manage freely** — Add/withdraw collateral, repay debt, close trove anytime

### How they work together

MUSD maintains its $1 peg through arbitrage:

- **$1 floor** — Anyone can redeem MUSD for BTC at 1:1 USD value (minus 0.75% fee)
- **$1.10 ceiling** — Min 110% ICR means minting pressure pushes price down
- **Recovery Mode** — Activates when system TCR drops below 150%

### Ecosystem roles

| Role | Action | Earn |
|------|--------|------|
| **Borrower** | Open trove, mint MUSD | Liquidity without selling BTC |
| **Stability Provider** | Stake MUSD in Stability Pool | BTC collateral gains from liquidations |
| **Liquidator** | Liquidate underwater troves | Gas compensation + collateral reward |
| **Redeemer** | Burn MUSD for BTC at peg | Arbitrage when MUSD < $1 |

### Protocol constants

| Constant | Value | Purpose |
|----------|-------|---------|
| MCR | 110% | Minimum Collateralization Ratio |
| CCR | 150% | Critical ratio (below = Recovery Mode) |
| Borrowing Fee | 0.1% | One-time fee on debt |
| Redemption Fee | 0.75% | Fee on redeemed amount |
| Min Debt | 1,800 MUSD | Minimum trove debt |

## MCP Features

- **Passkey-based wallet** — No private key management, encrypted with PBKDF2 + sodium
- **Multi-chain** — Mezo, Ethereum (Sepolia), Bitcoin testnet
- **Full MUSD lifecycle** — Borrow, stake, redeem, liquidate
- **Gas-efficient hints** — Automatic sorted trove insertion hints
- **BTC transaction signing** — Native Bitcoin testnet support
- **20 tools** — Complete coverage of wallet + MUSD operations

## Install

```bash
npm install -g @tamago-labs/wayfind-mezo
```

## Quick Start

```bash
export WALLET_PASSKEY="your-secure-passphrase"  # 12+ characters
export WAYFIND_NETWORK=testnet
npx @tamago-labs/wayfind-mezo
```

On first run, a wallet is created and stored at `~/.wayfind-mezo/.wallet.json`. A mnemonic backup is written to `~/.wayfind-mezo/REMOVE_AFTER_BACKUP.txt` — back it up securely and delete the file.

## Configuration

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `WALLET_PASSKEY` | Yes | — | Passphrase (12+ chars) — derives encrypted wallet |
| `WAYFIND_NETWORK` | No | `testnet` | `testnet` only in v0.1 |

## Security Model

No private key required. The wallet is derived from your passphrase using a secure key derivation pipeline:

1. **PBKDF2-SHA256** (100,000 iterations) derives encryption key from passphrase
2. **BIP39 mnemonic** is generated and encrypted with sodium secretbox
3. **BIP32 HD wallet** derives EVM + BTC keys from the seed
4. **Encrypted storage** at `~/.wayfind-mezo/.wallet.json` (mode 0600)
5. **Mnemonic backup** at `~/.wayfind-mezo/REMOVE_AFTER_BACKUP.txt`

### Wallet recovery

If the wallet file is lost but you have the mnemonic:

```bash
WALLET_PASSKEY="new-passphrase" npx tsx scripts/recover-wallet.ts "your mnemonic phrase"
```

## Tools (20)

### Wallet Operations

| Tool | Description |
|------|-------------|
| `get_wallet_address` | Get EVM + BTC addresses |
| `get_balances` | Native + token balances per chain |
| `send_tokens` | Send BTC, ETH, ERC-20 tokens. Accepts human-readable amounts. |
| `get_transaction` | Transaction lookup by hash |

### MUSD Query (read-only)

| Tool | Description |
|------|-------------|
| `musd_get_trove_status` | Collateral, debt, ICR, interest |
| `musd_get_stability_pool` | Staked MUSD + collateral gains |
| `musd_get_borrowing_fee` | Fee estimate for amount |
| `musd_get_system_overview` | TCR, total debt, trove count, BTC price |
| `musd_get_interest_rate` | Current borrowing APR |
| `musd_get_protocol_constants` | CCR, MCR, redemption fee |
| `musd_get_max_borrowing_capacity` | Max additional MUSD debt |

### MUSD Actions

| Tool | Description |
|------|-------------|
| `musd_open_trove` | Deposit BTC, borrow MUSD. 200 MUSD liquidation deposit added to debt. Pass human-readable amounts. |
| `musd_add_collateral` | Add BTC to trove |
| `musd_withdraw_collateral` | Remove BTC from trove |
| `musd_repay_musd` | Pay back MUSD debt |
| `musd_close_trove` | Close trove, withdraw collateral |
| `musd_stake_musd` | Stake MUSD in Stability Pool |
| `musd_unstake_musd` | Withdraw staked MUSD |
| `musd_redeem` | Burn MUSD for BTC at $1 peg |

## Client Configuration

### Claude Desktop

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "wayfind-mcp": {
      "command": "npx",
      "args": ["-y", "@tamago-labs/wayfind-mezo"],
      "env": {
        "WALLET_PASSKEY": "your-passphrase",
        "WAYFIND_NETWORK": "testnet"
      }
    }
  }
}
```

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcp": {
    "servers": {
      "wayfind-mcp": {
        "command": "npx",
        "args": ["-y", "@tamago-labs/wayfind-mezo"],
        "env": {
          "WALLET_PASSKEY": "your-passphrase",
          "WAYFIND_NETWORK": "testnet"
        }
      }
    }
  }
}
```

### OpenCode

Add to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "mcp": {
    "servers": {
      "wayfind-mcp": {
        "type": "local",
        "command": ["npx", "-y", "@tamago-labs/wayfind-mezo"],
        "environment": {
          "WALLET_PASSKEY": "your-passphrase",
          "WAYFIND_NETWORK": "testnet"
        }
      }
    }
  }
}
```

## Architecture

```
mcp/
├── src/
│   ├── agent.ts           # Agent class — routes to utils
│   ├── config.ts          # Passkey wallet, RPC pools, chain loading
│   ├── index.ts           # MCP server bootstrap
│   ├── mcp/
│   │   ├── index.ts       # Tool registry
│   │   ├── musd/          # MUSD tool definitions (15 tools)
│   │   └── shared/        # Shared wallet tools
│   ├── types.ts           # McpTool interface
│   └── utils/
│       ├── evm-balance.ts # EVM native + ERC-20 balance queries
│       ├── btc-balance.ts # BTC testnet balance (Blockstream API)
│       ├── evm-send.ts    # EVM native + ERC-20 sends
│       ├── btc-send.ts    # BTC transaction signing + broadcast
│       ├── chain-data.ts  # Multi-path chain config loader
│       └── musd/
│           ├── contracts.ts # Contract addresses + minimal ABIs
│           ├── queries.ts   # Read-only MUSD protocol calls
│           └── actions.ts   # Write MUSD protocol calls
├── data/chains/
│   ├── mezo-testnet.json
│   └── ethereum-testnet.json
├── scripts/
│   └── recover-wallet.ts  # Mnemonic-based wallet recovery
└── package.json
```

## Supported Chains

| Chain | Network | Native | Notable Tokens |
|-------|---------|--------|----------------|
| Mezo | Testnet (31611) | BTC | MUSD, MEZO ERC-20 |
| Ethereum | Sepolia (11155111) | ETH | USDC, WETH |
| Bitcoin | Testnet | BTC | — |

## License

MIT
