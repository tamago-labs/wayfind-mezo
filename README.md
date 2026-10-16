# Wayfind Arc

[![Frontend](https://img.shields.io/badge/Frontend-Next.js-black?logo=next.js)](https://github.com/tamago-labs/wayfind-arc)
[![MCP](https://img.shields.io/badge/MCP-Server-blue)](https://www.npmjs.com/package/@tamago-labs/wayfind-arc-mcp)

**Turn Grok Bot into a 24/7 onchain operator for Arc chain.**

## Background

Launched in September 2026, Grok Bot brings always-on AI teammates to your own dedicated computer. It can use a computer like a person does, run continuously, and work with Grok AI services. From automating everyday tasks to swiping on Tinder, its possibilities have quickly become a topic of conversation, with Elon Musk frequently posting about it.

## Quick Links

| Resource | Link |
|----------|------|
| Video Demo (3 mins) | [Watch on YouTube](https://youtu.be/Lqn_t6TYxv4) |
| Grok Bot template | [Import template](https://x.ai/bot/IX2bDYMLKqQhe1hYFnXdi) |
| Website | [arc.wayfind.click](https://arc.wayfind.click/) |

## Overview

**Wayfind** extends Grok Bot into onchain finance. It combines an MCP server, agent skills, and a web dashboard to give your bot access to Arc's blockchain ecosystem and financial tools:

- Manage Arc wallets — check balances, send tokens
- Move USDC across 12+ chains via Circle Unified Balance
- Swap tokens (USDC, WETH, cirBTC) via Circle Swap Kit
- Earn yield through earn vaults (Morpho, etc.)
- Operate autonomously, 24/7, on the bot's dedicated computer

No separate hosting. No manual intervention. Your bot has its own wallet, its own tools, and its own memory.

## Proven on Arc Mainnet

Wayfind bots have executed real onchain transactions on Arc Mainnet:

- **EURC → USDC swap** — Executed via Circle App Kit ([View transaction](https://arc.etherscan.io/tx/0x3b607ed814b7f8db691d05229b5d99852b3f0bdd0b25458f16ba2f49026c6b0e))
- **USDC deposit** — Deposited into Circle Unified Balance ([View transaction](https://arc.etherscan.io/tx/0x95d9a0f18284f0ea4d6d43c4e246fb38754cf38bd226a899ab5c071877afea72))
- **USDC payment** — Spent USDC from Unified Balance ([View transaction](https://arc.etherscan.io/tx/0x4b60ac92c91017aeaa14441ff59a3f57357aeeb941303fe6f3c91a0957ec441b))

## What's Inside

| Package | Description |
|---------|-------------|
| `frontend/` | Next.js frontend — landing page, dashboard to interact with Arc without setting up a bot |
| `mcp/` | MCP server — 13 tools for wallet, swaps, unified balance, earn via Circle App Kits  |
| `skills/` | Agent skills plugin — Claude, Cursor, Grok Bot manifests + intent routing |

## How It Works

1. **Import your Wayfind template**

   Download a template from [arc.wayfind.click](https://arc.wayfind.click). Open it directly in the Grok Bot desktop or mobile app to get started.

2. **Let your bot guide setup**

   Name your bot anything you like — CFO, for example — and ask it to help set up its wallet. It walks you through configuring the private key and choosing Arc Mainnet or Testnet. Wallet credentials are stored on the bot's dedicated computer, not in the chat.

3. **Put your bot to work**

   Make your bot an onchain operator querying protocol data, a publisher posting content onchain, or an automator running workflows like USDC payroll and payslip generation — 24/7.

## What Your Bot Can Do

**Automate payroll with CFO + HR bots** (As in video demo). HR tracks freelancer details, wallet addresses, payment amounts, and due dates. When a payment is due, HR sends a request to CFO, which asks for your approval before executing the USDC transfer. Once confirmed, CFO returns the transaction hash to HR, which generates the payslip with the onchain transaction record.

**Manage treasury with CFO + Research bots.** Research monitors protocol data, stablecoin yields, and treasury opportunities, then shares its findings with CFO. CFO evaluates potential allocations and prepares transactions for your approval.

**Coordinate marketing with Research + Marketing bots.** Research gathers ecosystem insights and project updates, while Marketing turns them into content and publishes approved updates onchain.

Each bot has a distinct role, and they work together to coordinate tasks, request approvals, and execute onchain actions through Wayfind MCP.

## Set It Up Locally

### Dashboard

```bash
cd frontend
npm install
npm run dev
```

### MCP Server (local)

```bash
cd mcp
npm install
npm run build
ARC_PRIVATE_KEY=0x... ARC_CHAIN=mainnet npm start
```

### Install on Grok Bot

Add the MCP server to your Grok Bot environment:

```
ARC_PRIVATE_KEY=0x...
ARC_CHAIN=mainnet
```

Then ask your bot: *"Set up Wayfind"* — it will install the tools and guide you through wallet setup.

### Install on Other Clients

**OpenCode** (`~/.config/opencode/opencode.jsonc`):

```jsonc
{
  "mcp": {
    "servers": {
      "wayfind-arc": {
        "type": "local",
        "command": ["npx", "-y", "@tamago-labs/wayfind-arc-mcp"],
        "environment": {
          "ARC_PRIVATE_KEY": "your_key_here",
          "ARC_CHAIN": "mainnet"
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
    "wayfind-arc": {
      "command": "npx",
      "args": ["-y", "@tamago-labs/wayfind-arc-mcp"],
      "env": {
        "ARC_PRIVATE_KEY": "your_key_here",
        "ARC_CHAIN": "mainnet"
      }
    }
  }
}
```

## MCP Tools

### Wallet

| Tool | Description |
|------|-------------|
| `arc_get_wallet_address` | Get wallet address from private key |
| `arc_get_balance` | Get all token balances (USDC, WETH, cirBTC) |
| `arc_send_tokens` | Send tokens by symbol to an address |

### Unified Balance

| Tool | Description |
|------|-------------|
| `arc_get_unified_balance` | Check total USDC and chain breakdown |
| `arc_get_supported_chains` | List chains available for cross-chain transfers |
| `arc_deposit_unified_balance` | Deposit USDC into Unified Balance |
| `arc_spend_unified_balance` | Withdraw/spend USDC, optionally cross-chain |

### Swap & Earn

| Tool | Description |
|------|-------------|
| `arc_swap_tokens` | Swap tokens via Circle Swap Kit |
| `arc_list_earn_vaults` | List available earn vaults with APY |
| `arc_earn_deposit` | Deposit into an earn vault |
| `arc_get_earn_position` | Check position (balance, shares, yield) |
| `arc_earn_withdraw` | Withdraw from an earn vault |

### Prices

| Tool | Description |
|------|-------------|
| `arc_get_prices` | Get all token prices from CoinGecko |

## Supported Tokens

| Symbol | Decimals | CoinGecko |
|--------|----------|-----------|
| USDC | 6 | usd-coin |
| EURC | 6 | euro-coin |
| cirBTC | 8 | circle-wrapped-btc |
| WETH | 18 | weth |

Configured for both Arc Mainnet and Testnet.

## Architecture

```
wayfind-arc/
├── frontend/                 # Next.js web dashboard
│   └── app/
│       ├── dashboard/        # Portfolio, explore, token detail
│       ├── api/              # Backend API routes
│       ├── contexts/         # Web3 contexts (wallet, prices, earn)
│       └── components/       # UI components
├── mcp/                      # MCP server package
│   └── src/
│       ├── agent.ts          # Agent class: wallet, adapter, SDK methods
│       ├── config.ts         # Chain config (mainnet/testnet)
│       ├── data/             # Token config (symbols, addresses)
│       └── mcp/arc/          # 13 MCP tool definitions
└── skills/                   # Agent skills plugin
    └── plugins/arc/
        ├── .claude-plugin/   # Claude Code manifest
        ├── .cursor-plugin/   # Cursor manifest + MCP config
        ├── .grok-plugin/     # Grok Bot manifest + MCP config
        └── skills/arc/       # SKILL.md + references
```

## License

MIT

© 2026 Tamago Labs
