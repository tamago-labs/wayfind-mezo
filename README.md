# Wayfind Mezo

[![MCP](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/@tamago-labs/wayfind-mezo)
[![Network](https://img.shields.io/badge/Testnet-Mezo%2031611-orange)](https://mezo.org)

**Turn your bot into a Bitcoin DeFi operator on Mezo.**

## Overview

Wayfind Mezo extends your AI bot into Bitcoin-native DeFi. It combines an MCP server and agent skills to give your bot access to Mezo's borrowing, staking, and stablecoin infrastructure:

- **Mint MUSD** — Borrow the USD-pegged stablecoin against your BTC collateral
- **Stake MUSD** — Earn yield by depositing into the Stability Pool
- **Automate 24/7** — Your bot manages positions, monitors health, and executes strategies autonomously

No separate hosting. No manual intervention. Your bot has its own wallet, its own tools, and its own memory.

## How to Get MUSD

### Path 1: Borrow Against BTC (Available)

Deposit BTC as collateral and mint MUSD directly:

1. **Open a trove** — Deposit BTC (min 110% collateralization)
2. **Mint MUSD** — Borrow at a fixed 1% interest rate
3. **Manage freely** — Add/withdraw collateral, repay debt, close anytime

```
Example: Deposit 0.03 BTC → Borrow ~1800 MUSD (at 110% ICR)
```

### Path 2: Swap Any Token to MUSD (Coming Soon)

Swap tokens from any supported chain into MUSD via DEX aggregation:

- ETH → MUSD
- USDC → MUSD
- WBTC → MUSD
- Any ERC-20 → MUSD

## MUSD Utility

MUSD isn't just a stablecoin — it's a programmable dollar for your bot:

- **Payroll** — Pay contributors, freelancers, or team bots in USD-pegged stablecoins
- **Automated payments** — Schedule recurring payments, subscriptions, or service fees
- **Staking** — Deposit MUSD into the Stability Pool for yield (backed by liquidation rewards)
- **Cross-chain** — Move MUSD across supported chains for payments or yield opportunities

## Bot Use Cases

Your Wayfind bot isn't just a wallet — it's an autonomous DeFi operator:

### Position Monitoring & Alerts

- **ICR alerts** — Bot warns you when collateralization drops near 110% (liquidation risk)
- **Health checks** — Regular trove status reports with collateral, debt, and ICR
- **Price monitoring** — Track BTC price and its impact on your position

### Automated Position Management

- **Auto-collateral** — Bot adds more BTC collateral when ICR drops below your threshold
- **Auto-repay** — Bot repays MUSD debt when you have excess balance
- **Rebalance** — Maintain target collateralization ratio automatically

### Treasury Operations

- **Stake excess MUSD** — Automatically deposit idle MUSD into Stability Pool
- **Harvest gains** — Claim BTC collateral gains from liquidations
- **Payroll execution** — Process recurring MUSD payments on schedule

### Autonomous Strategies

- **Mint & stake loop** → Borrow MUSD → Stake for yield → Monitor → Repeat
- **DCA into MUSD** — Convert DCA purchases into yield-bearing staked MUSD
- **Liquidation protection** — Bot adds collateral before liquidation, saves your trove

## What's Inside

| Package | Description |
|---------|-------------|
| `mcp/` | MCP server — 14 tools for wallet, MUSD borrowing, staking, redemptions |
| `skills/` | Agent skills plugin — Claude, Cursor, Grok Bot manifests + intent routing |

## Setup

### MCP Server (local)

```bash
cd mcp
npm install
npm run build
WALLET_PASSKEY="your-secure-passphrase" WAYFIND_NETWORK=testnet npm start
```

### Install on Grok Bot

Set these environment variables in your Bot settings:

```
WALLET_PASSKEY="your-secure-passphrase"
WAYFIND_NETWORK=testnet
```

Then ask your bot: *"Set up Wayfind"* — it will install the tools and guide you through wallet setup.

### Install on Other Clients

**OpenCode** (`~/.config/opencode/opencode.jsonc`):

```jsonc
{
  "mcp": {
    "servers": {
      "wayfind-mcp": {
        "type": "local",
        "command": ["node", "path/to/mcp/dist/index.js"],
        "environment": {
          "WALLET_PASSKEY": "your-secure-passphrase",
          "WAYFIND_NETWORK": "testnet"
        }
      }
    }
  }
}
```

**Claude Desktop** (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "wayfind-mcp": {
      "command": "node",
      "args": ["path/to/mcp/dist/index.js"],
      "env": {
        "WALLET_PASSKEY": "your-secure-passphrase",
        "WAYFIND_NETWORK": "testnet"
      }
    }
  }
}
```

## MCP Tools

### Wallet

| Tool | Description |
|------|-------------|
| `get_wallet_address` | Get EVM + BTC addresses |
| `get_balances` | Native + token balances per chain |
| `send_tokens` | Send BTC, ETH, ERC-20 (human-readable amounts) |
| `get_transaction` | Transaction lookup by hash |

### MUSD Borrowing

| Tool | Description |
|------|-------------|
| `musd_open_trove` | Deposit BTC collateral, borrow MUSD (1% fixed rate) |
| `musd_add_collateral` | Add more BTC to trove |
| `musd_withdraw_collateral` | Remove BTC from trove |
| `musd_repay_musd` | Repay MUSD debt |
| `musd_close_trove` | Close trove, withdraw collateral |
| `musd_redeem` | Redeem MUSD for BTC at $1 peg |

### MUSD Query

| Tool | Description |
|------|-------------|
| `musd_get_trove_status` | Collateral, debt, ICR, interest rate |
| `musd_get_borrowing_fee` | Fee estimate for amount |
| `musd_get_system_overview` | TCR, total debt, trove count, BTC price |
| `musd_get_interest_rate` | Current borrowing rate (1.00% Fixed) |
| `musd_get_protocol_constants` | CCR, MCR, redemption fee |
| `musd_get_max_borrowing_capacity` | Max additional MUSD debt |

### Stability Pool

| Tool | Description |
|------|-------------|
| `musd_stake_musd` | Stake MUSD for liquidation rewards |
| `musd_unstake_musd` | Withdraw staked MUSD |

## Supported Chains

| Chain | Network | Native | Notable Tokens |
|-------|---------|--------|----------------|
| Mezo | Testnet (31611) | BTC | MUSD, MEZO |
| Ethereum | Sepolia (11155111) | ETH | USDC, WETH |
| Bitcoin | Testnet | BTC | — |

## Architecture

```
wayfind-mezo/
├── mcp/                      # MCP server package
│   └── src/
│       ├── agent.ts          # Agent class — routes to utils
│       ├── config.ts         # Passkey wallet, RPC pools
│       ├── index.ts          # MCP server bootstrap
│       ├── mcp/
│       │   ├── index.ts      # Tool registry
│       │   ├── musd/         # MUSD trove tools (13)
│       │   ├── staking/      # Stability Pool tools (2)
│       │   └── shared/       # Shared wallet tools (4)
│       ├── types.ts          # McpTool interface
│       └── utils/
│           ├── musd/
│           │   ├── contracts.ts  # Addresses + ABIs
│           │   ├── queries.ts    # Read-only MUSD calls
│           │   └── actions.ts    # Write MUSD calls
│           ├── evm-balance.ts    # EVM balance queries
│           ├── btc-balance.ts    # BTC balance queries
│           ├── evm-send.ts       # EVM token sends
│           ├── btc-send.ts       # BTC sends
│           └── chain-data.ts     # Chain config loader
├── skills/                       # Agent skills plugin
│   └── plugins/mezo/
│       ├── .claude-plugin/       # Claude Code manifest
│       ├── .cursor-plugin/       # Cursor manifest + MCP config
│       ├── .grok-plugin/         # Grok Bot manifest + MCP config
│       └── skills/mezo/          # SKILL.md + references
└── scripts/
    └── recover-wallet.ts         # Mnemonic-based wallet recovery
```

## License

MIT

© 2026 Tamago Labs
