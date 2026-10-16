# Arc Setup

## Prerequisites

- Node.js v22+
- An EVM wallet private key (0x...)

## Installation

### Global install

```bash
npm install -g @tamago-labs/wayfind-arc-mcp
```

### Local install (development)

```bash
cd mcp
npm install
npm run build
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ARC_PRIVATE_KEY` | Yes | — | EVM private key (0x...) |
| `ARC_CHAIN` | No | `mainnet` | Chain: `mainnet` or `testnet` |
| `ARC_RPC_URL` | No | Built-in | Custom Arc RPC endpoint |
| `ARC_EXPLORER_URL` | No | Built-in | Custom block explorer URL |

## OpenCode Configuration

Add to `~/.config/opencode/opencode.jsonc`:

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

## Claude Desktop Configuration

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

## Cursor Configuration

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

## Testnet Setup

For testnet, set `ARC_CHAIN=testnet` and get testnet tokens from [Circle Faucet](https://faucet.circle.com/):

1. Fund wallet with testnet USDC
2. Test deposits, swaps, and earn on testnet
3. Switch to mainnet for production

## Verify Setup

After configuration, restart your MCP client and run:

```
arc_get_wallet_address
```

This should return your wallet address derived from the private key.
