# Mezo Platform Overview

Mezo is a Bitcoin-native DeFi platform that lets BTC holders mint MUSD — a USD-pegged stablecoin — using their BTC as collateral.

## Key Characteristics

- **BTC is native asset** — Transactions use BTC (18 decimals on Mezo)
- **MUSD stablecoin** — USD-pegged, minted against BTC collateral in troves
- **$1 peg via redemptions** — Burn MUSD for BTC at 1:1 rate (minus 0.75% fee)
- **Minimum collateral** — 110% ICR required to avoid liquidation
- **Recovery mode** — Activates when TCR < 150%, enforcing stricter rules

## MUSD Protocol Architecture

### Core Contracts (Testnet)

| Contract | Address | Purpose |
|----------|---------|---------|
| BorrowerOperations | `0xCdF7028ceAB81fA0C6971208e83fa7872994beE5` | Open/adjust/close troves |
| TroveManager | `0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0` | Liquidations, redemptions |
| MUSD Token | `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503` | MUSD stablecoin ERC-20 |
| StabilityPool | `0x1CCA7E410eE41739792eA0A24e00349Dd247680e` | Stake MUSD, earn liquidation rewards |
| PriceFeed | `0x86bCF0841622a5dAC14A313a15f96A95421b9366` | BTC/USD oracle |
| InterestRateManager | `0xD4D6c36A592A2c5e86035A6bca1d57747a567f37` | Borrowing interest rates |
| SortedTroves | `0x722E4D24FD6Ff8b0AC679450F3D91294607268fA` | Sorted trove list |
| HintHelpers | `0x4e4cBA3779d56386ED43631b4dCD6d8EacEcBCF6` | Gas-efficient hints |

### Protocol Constants

| Constant | Value | Description |
|----------|-------|-------------|
| MCR | 110% | Minimum Collateralization Ratio (below = liquidatable) |
| CCR | 150% | Critical Collateral Ratio (below = Recovery Mode) |
| Borrowing Fee | 0.1% | One-time fee on debt |
| Redemption Fee | 0.75% | Fee on redeemed amount |
| Min Debt | 1,800 MUSD | Minimum trove debt (net of 200 MUSD liquidation deposit) |
| Interest Rate | Variable | Per-trove, fixed at open, can refinance |

### Networks

| Network | Chain ID | RPC | Explorer |
|---------|----------|-----|----------|
| Testnet | 31611 | `https://rpc.test.mezo.org` | `https://explorer.test.mezo.org` |
| Mainnet | — | `https://rpc.mezo.org` | `https://explorer.mezo.org` |

## How MUSD Works

1. **Open Trove** — Deposit BTC, mint MUSD (min 1,800 MUSD debt, min 110% ICR)
2. **Stability Pool** — Stake MUSD to earn liquidation rewards (BTC gains)
3. **Redemption** — Burn MUSD for BTC at $1 value (maintains peg floor)
4. **Liquidation** — Anyone can liquidate underwater troves (earns collateral reward)
5. **Peg Mechanism** — Redemptions create $1 floor, 110% MCR creates $1.10 ceiling
