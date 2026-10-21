# Mezo — Grok Bot Install

Install the Mezo MCP server on your Grok Bot.

## Install

1. Open your Grok Bot dashboard
2. Go to **Plugins** → **Install from GitHub**
3. Enter: `tamago-labs/wayfind-mezo`
4. Select the `skills` directory as the plugin root

## Configure

After install, set these environment variables in your Bot settings:

| Variable | Value |
|----------|-------|
| `WALLET_PASSKEY` | Your secure passphrase (12+ characters) |
| `WAYFIND_NETWORK` | `testnet` or `mainnet` |

> **No private key needed.** The wallet is derived from your passphrase using PBKDF2 + BIP39. Encrypted wallet stored at `~/.wayfind-mezo/.wallet.json`.

## Verify

Ask your Bot: "What's my wallet address?"

The Bot should respond with your EVM and BTC addresses.

## Testnet

For testing, set `WAYFIND_NETWORK=testnet` and get testnet BTC from the [Mezo Faucet](https://mezo.org/faucet).

## Wallet Recovery

If you lose the wallet file, recover from your mnemonic backup:

```powershell
$env:WALLET_PASSKEY="your-new-passphrase"; npx tsx scripts/recover-wallet.ts "your mnemonic phrase"
```
