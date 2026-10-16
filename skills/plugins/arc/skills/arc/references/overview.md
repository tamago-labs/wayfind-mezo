# Arc Platform Overview

Arc is an EVM-compatible Layer 2 blockchain with USDC as its native gas token. Built for financial applications, Arc provides fast finality (sub-second) and integrates with Circle's App Kits for unified balance, swaps, and earn vaults.

## Key Characteristics

- **USDC is native gas token** — No ETH needed for gas; USDC pays for transactions
- **EVM-compatible** — Deploy Ethereum contracts with minimal changes
- **Sub-second finality** — Transactions confirm in under 1 second
- **Circle Integration** — Native integration with Circle App Kits for DeFi operations

## Supported Tokens

| Symbol | Decimals | Address (Mainnet) | Description |
|--------|----------|-------------------|-------------|
| USDC | 6 | `0x3600000000000000000000000000000000000000` | USD Coin (native gas) |
| EURC | 6 | `0xbEf5f6d51CB62b58e6A8f77868681825C6fe21c1` | Euro Coin |
| cirBTC | 8 | `0x171A4217b86A807A64eB94757Db6849fb4bDbAA0` | Circle Wrapped Bitcoin |
| WETH | 18 | `0x128cC466B61f542da60c70e3aA11c10e19B84EDB` | Wrapped Ether |

## Networks

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Mainnet | 5042 | `https://rpc.mainnet.arc.io` | `https://explorer.arc.io` |
| Testnet | 5042002 | `https://rpc.testnet.arc.io` | `https://explorer.testnet.arc.io` |

## Circle App Kits

### Unified Balance
Combines USDC from multiple chains into one spendable balance. Deposit from any supported chain, spend on any other chain. Cross-chain transfers use Circle Gateway (burn on source, mint on destination).

### Swap Kit
Swap tokens on Arc via Circle's DEX aggregator. Supports USDC, WETH, cirBTC, EURC with configurable slippage.

### Earn Kit
Deposit tokens into earn vaults (e.g., Morpho) to earn yield. Check APY, deposit, withdraw, and track positions with principal and yield breakdown.
