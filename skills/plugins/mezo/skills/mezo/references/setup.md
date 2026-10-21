# Mezo Setup

## Prerequisites

- Node.js v22+
- A secure passphrase (12+ characters)

## Installation

### Global install

```bash
npm install -g @tamago-labs/wayfind-mezo
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
| `WALLET_PASSKEY` | Yes | — | Passphrase (12+ chars) — derives encrypted wallet |
| `WAYFIND_NETWORK` | No | `testnet` | `testnet` only in v0.1 |

> **Note:** No private key needed. The wallet is derived from your passphrase using PBKDF2 + BIP39 mnemonic. The encrypted wallet is stored at `~/.wayfind-mezo/.wallet.json` and the mnemonic backup at `~/.wayfind-mezo/REMOVE_AFTER_BACKUP.txt`.

## OpenCode Configuration

Add to `~/.config/opencode/opencode.jsonc`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "wayfind-mcp": {
        "type": "local",
        "command": ["node", "C:/projects/wayfind-mezo/mcp/dist/index.js"],
        "environment": {
          "WALLET_PASSKEY": "your-secure-passphrase-here",
          "WAYFIND_NETWORK": "testnet"
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
    "wayfind-mcp": {
      "command": "node",
      "args": ["C:/projects/wayfind-mezo/mcp/dist/index.js"],
      "env": {
        "WALLET_PASSKEY": "your-secure-passphrase-here",
        "WAYFIND_NETWORK": "testnet"
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
      "wayfind-mcp": {
        "command": "node",
        "args": ["C:/projects/wayfind-mezo/mcp/dist/index.js"],
        "env": {
          "WALLET_PASSKEY": "your-secure-passphrase-here",
          "WAYFIND_NETWORK": "testnet"
        }
      }
    }
  }
}
```

## Wallet Recovery

If you lose the wallet file but still have the mnemonic backup:

```powershell
$env:WALLET_PASSKEY="your-new-passphrase"; npx tsx scripts/recover-wallet.ts "your mnemonic phrase"
```

## Testnet Setup

1. Set `WAYFIND_NETWORK=testnet`
2. Start the MCP server — wallet is created automatically on first run
3. Get testnet BTC from the [Mezo Faucet](https://mezo.org/faucet)

## Verify Setup

After configuration, restart your MCP client and run:

```
get_wallet_address
```

This should return your EVM and BTC addresses.
