# Arc — Grok Bot Install

Install the Arc MCP server on your Grok Bot.

## Install

1. Open your Grok Bot dashboard
2. Go to **Plugins** → **Install from GitHub**
3. Enter: `tamago-labs/wayfind-arc`
4. Select the `skills` directory as the plugin root

## Configure

After install, set these environment variables in your Bot settings:

| Variable | Value |
|----------|-------|
| `ARC_PRIVATE_KEY` | Your EVM private key (0x...) |
| `ARC_CHAIN` | `mainnet` or `testnet` |

## Verify

Ask your Bot: "What's my wallet address?"

The Bot should respond with your Arc wallet address.

## Testnet

For testing, set `ARC_CHAIN=testnet` and get tokens from [Circle Faucet](https://faucet.circle.com/).
