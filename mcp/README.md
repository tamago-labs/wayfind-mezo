# Wayfind Arc MCP

![NPM Version](https://img.shields.io/npm/v/@tamago-labs/wayfind-arc-mcp)

**Wayfind Arc MCP** is a Model Context Protocol (MCP) server for Arc chain. It provides wallet operations, Circle Unified Balance (deposit/spend cross-chain), token swaps, and earn vault management via Circle App Kits.

## Features

- **13 MCP tools** covering wallet management, unified balance, swaps, and earn
- **Circle Unified Balance** — deposit USDC, spend/withdraw cross-chain to 12+ chains
- **Cross-chain transfers** — spend USDC from Arc to Ethereum, Base, Arbitrum, and more
- **Token swaps** — swap USDC, WETH, cirBTC via Circle Swap Kit
- **Earn vaults** — list vaults, deposit, withdraw, check position with yield
- **Self-contained pricing** — CoinGecko prices built-in, no API key needed
- **Token symbol resolution** — send/swap by symbol, resolved from built-in config

## Installation

```bash
npm install -g @tamago-labs/wayfind-arc-mcp
```

## Configuration

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ARC_PRIVATE_KEY` | Yes | — | EVM private key (0x...) |
| `ARC_CHAIN` | No | `mainnet` | Chain: `mainnet` or `testnet` |
| `ARC_RPC_URL` | No | Built-in | Custom Arc RPC endpoint |
| `ARC_EXPLORER_URL` | No | Built-in | Custom block explorer URL |

### OpenCode

Add to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "wayfind-arc": {
        "type": "local",
        "command": ["node", "/absolute/path/to/wayfind-arc/mcp/dist/index.js"],
        "cwd": "/absolute/path/to/wayfind-arc/mcp",
        "environment": {
          "ARC_PRIVATE_KEY": "your_private_key_here",
          "ARC_CHAIN": "mainnet"
        }
      }
    }
  }
}
```

Or with npx:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "wayfind-arc": {
        "type": "local",
        "command": ["npx", "-y", "@tamago-labs/wayfind-arc-mcp"],
        "environment": {
          "ARC_PRIVATE_KEY": "your_private_key_here",
          "ARC_CHAIN": "mainnet"
        }
      }
    }
  }
}
```

### Claude Desktop

```json
{
  "mcpServers": {
    "wayfind-arc": {
      "command": "npx",
      "args": ["-y", "@tamago-labs/wayfind-arc-mcp"],
      "env": {
        "ARC_PRIVATE_KEY": "your_private_key_here",
        "ARC_CHAIN": "mainnet"
      }
    }
  }
}
```

### Cursor

```json
{
  "mcp": {
    "servers": {
      "wayfind-arc": {
        "command": "npx",
        "args": ["-y", "@tamago-labs/wayfind-arc-mcp"],
        "env": {
          "ARC_PRIVATE_KEY": "your_private_key_here",
          "ARC_CHAIN": "mainnet"
        }
      }
    }
  }
}
```

## Available Tools

### Wallet Operations

| Tool Name | Description | Example Prompt |
|-----------|-------------|----------------|
| `arc_get_wallet_address` | Get wallet address from private key | "What's my wallet address?" |
| `arc_get_balance` | Get all token balances (USDC, WETH, cirBTC) | "Show my wallet balances" |
| `arc_send_tokens` | Send tokens by symbol to an address | "Send 10 USDC to 0x..." |

### Unified Balance

| Tool Name | Description | Example Prompt |
|-----------|-------------|----------------|
| `arc_get_unified_balance` | Check total USDC and chain breakdown | "Check my unified balance" |
| `arc_get_supported_chains` | List chains available for cross-chain transfers | "What chains can I send to?" |
| `arc_deposit_unified_balance` | Deposit USDC into Unified Balance | "Deposit 100 USDC to unified balance" |
| `arc_spend_unified_balance` | Withdraw/spend USDC, optionally cross-chain | "Send 50 USDC to Ethereum" |

### Swap & Earn

| Tool Name | Description | Example Prompt |
|-----------|-------------|----------------|
| `arc_swap_tokens` | Swap tokens via Circle Swap Kit | "Swap 1 WETH to USDC" |
| `arc_list_earn_vaults` | List available earn vaults with APY | "Show earn vaults for USDC" |
| `arc_earn_deposit` | Deposit into an earn vault | "Deposit 100 USDC to the best vault" |
| `arc_get_earn_position` | Check position (balance, yield) | "Check my earn position" |
| `arc_earn_withdraw` | Withdraw from an earn vault | "Withdraw 50 USDC from the vault" |

### Prices

| Tool Name | Description | Example Prompt |
|-----------|-------------|----------------|
| `arc_get_prices` | Get all token prices from CoinGecko | "What are the token prices?" |

## Architecture

```
mcp/
├── package.json                # @tamago-labs/wayfind-arc-mcp
├── tsconfig.json
├── tsup.config.ts              # Build: CJS + ESM + .d.ts
├── README.md
└── src/
    ├── index.ts                # MCP server bootstrap
    ├── config.ts               # Chain config (mainnet/testnet)
    ├── types.ts                # McpTool interface
    ├── agent.ts                # Agent class: wallet, adapter, SDK methods
    ├── data/
    │   └── arc-tokens.json     # Token config (symbols, addresses, coingeckoId)
    └── mcp/
        ├── index.ts            # Tool registry
        └── arc/                # All Arc MCP tools
            ├── get_wallet_address_tool.ts
            ├── get_balance_tool.ts
            ├── send_tokens_tool.ts
            ├── get_prices_tool.ts
            ├── get_supported_chains_tool.ts
            ├── get_unified_balance_tool.ts
            ├── deposit_unified_tool.ts
            ├── spend_unified_tool.ts
            ├── swap_tokens_tool.ts
            ├── list_earn_vaults_tool.ts
            ├── get_earn_position_tool.ts
            └── earn_deposit_tool.ts
            └── earn_withdraw_tool.ts
```

## Supported Tokens

Tokens are configured in `src/data/arc-tokens.json` with Arc mainnet and testnet addresses:

| Symbol | Decimals | Address (Mainnet) | CoinGecko |
|--------|----------|-------------------|-----------|
| USDC | 6 | `0x3600000000000000000000000000000000000000` | usd-coin |
| EURC | 6 | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | euro-coin |
| cirBTC | 8 | `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0` | circle-wrapped-btc |
| WETH | 18 | `0x128cC466B61f542da60c70e3aA11c10e19B84EDB` | weth |

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@modelcontextprotocol/sdk` | ^1.10.2 | MCP server + StdioServerTransport |
| `@circle-fin/adapter-ethers-v6` | ^1.0.0 | Ethers adapter for Circle SDKs |
| `@circle-fin/unified-balance-kit` | ^1.0.0 | Unified Balance deposit/spend |
| `@circle-fin/swap-kit` | ^1.0.0 | Token swaps |
| `@circle-fin/earn-kit` | ^1.0.0 | Earn vault operations |
| `ethers` | ^6.13.0 | EVM wallet and contract interaction |
| `zod` | ^3.24.3 | Tool parameter schemas |

## Building

```bash
cd mcp
npm install
npm run build      # Outputs to dist/
npm start          # Run the server
```

## License

MIT
