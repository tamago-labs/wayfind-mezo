---
name: mezo
description: >
  Use Mezo for wallet operations, MUSD borrowing against BTC, trove management, Stability Pool staking, redemptions, and liquidations on Mezo.
  Provides wallet operations (balances, send tokens, transaction lookup), MUSD trove management (open/close/adjust trove, mint/repay MUSD),
  Stability Pool (stake/unstake MUSD, earn liquidation rewards), redemptions (burn MUSD for BTC at $1 peg), and liquidations (earn rewards by liquidating underwater troves).
  Use this skill whenever the user mentions Mezo, MUSD, borrowing against BTC, minting stablecoins, troves, Stability Pool, liquidations, redemptions,
  CDP positions, collateralized debt, or BTC-backed stablecoins.
  Also invoke when the user wants to check balances, send tokens, mint MUSD, manage trove positions, stake MUSD, or redeem MUSD.
---

# Mezo

Mezo is a Bitcoin-native platform that lets BTC holders mint MUSD — a USD-pegged stablecoin — by opening collateralized debt positions (troves). This skill provides wallet operations, full MUSD trove management, Stability Pool staking, redemptions, and liquidations.

## Mezo platform overview

Mezo uses BTC as the native asset. MUSD is minted by opening troves with BTC as collateral:

- **MUSD peg** — Maintained at $1 USD via redemptions (burn MUSD for BTC at 1:1 minus 0.75% fee) and collateralization requirements (min 110% ICR)
- **Trove** — A collateralized debt position. Deposit BTC, mint MUSD. Min debt: 1,800 MUSD
- **Stability Pool** — Stake MUSD to absorb liquidations. Earn collateral gains
- **Liquidations** — Troves below 110% ICR can be liquidated by anyone (earns reward)
- **Recovery Mode** — Activates when TCR < 150%, enforcing stricter borrowing rules

For full platform details, see [overview.md](references/overview.md).

## Setup

For installation, configuration, and environment variables, see [setup.md](references/setup.md).

Quick start:

```bash
npm install -g @tamago-labs/wayfind-mezo
```

Set `WALLET_PASSKEY` (12+ characters) and `WAYFIND_NETWORK` (testnet).

## Tool routing

Mezo exposes 20 MCP tools. Route by user intent:

### Wallet operations

| User intent | Tool |
|---|---|
| "What's my wallet address?" | `get_wallet_address` |
| "Show my balances" | `get_balances` |
| "Send X to address" | `send_tokens` |
| "Check transaction" | `get_transaction` |

### MUSD Trove management

| User intent | Tool |
|---|---|
| "Open a trove" / "Mint MUSD" | `musd_open_trove` |
| "Check my trove" | `musd_get_trove_status` |
| "Add more collateral" | `musd_add_collateral` |
| "Withdraw collateral" | `musd_withdraw_collateral` |
| "Repay MUSD" | `musd_repay_musd` |
| "Close trove" | `musd_close_trove` |

### Stability Pool

| User intent | Tool |
|---|---|
| "Stake MUSD" | `musd_stake_musd` |
| "Unstake MUSD" | `musd_unstake_musd` |
| "Check staked balance" | `musd_get_stability_pool` |

### Redemptions

| User intent | Tool |
|---|---|
| "Redeem MUSD for BTC" | `musd_redeem` |

### Protocol info

| User intent | Tool |
|---|---|

| "Protocol constants" | `musd_get_protocol_constants` |
| "System overview" | `musd_get_system_overview` |
| "Current interest rate" | `musd_get_interest_rate` |
| "Borrowing fee" | `musd_get_borrowing_fee` |
| "Max I can borrow" | `musd_get_max_borrowing_capacity` |

## Intent-based routing

**Mint MUSD intent** ("borrow MUSD", "mint stablecoins", "open trove"):
1. Use `musd_get_protocol_constants` to show CCR/MCR/min debt
2. Use `musd_get_borrowing_fee` to estimate the fee
3. Use `musd_open_trove` with musdAmount + collateralAmount (human-readable, e.g., '2000' and '0.03')

**Manage trove intent** ("add collateral", "repay debt", "close position"):
1. Use `musd_get_trove_status` to check current state
2. Use the appropriate action tool (`musd_add_collateral`, `musd_repay_musd`, etc.)

**Stake intent** ("earn yield", "stake in Stability Pool"):
1. Use `musd_get_balance` to confirm MUSD available
2. Use `musd_stake_musd` with the amount
3. Use `musd_get_stability_pool` to check staked balance + gains

**Redeem intent** ("redeem MUSD for BTC", "exit position"):
1. Use `musd_get_balance` to confirm MUSD balance
2. Use `musd_get_protocol_constants` to show redemption fee
3. Use `musd_redeem` to burn MUSD for BTC

## Execution rules

1. Always check `musd_get_trove_status` before borrowing — know current collateral/debt
2. Check `musd_get_protocol_constants` to inform user of CCR/MCR/min debt before actions
3. For redemptions, confirm TCR >= 110% (otherwise redemption will fail)
4. For liquidations, confirm ICR < 110% (trove must be underwater)
5. Amounts are in base units (18 decimals): 1 MUSD = 1000000000000000000
6. Borrowing fee is 0.1% of debt, deducted from minted amount
7. Redemption fee is 0.75% of redeemed amount

## Response format

For all operational responses, return:
1. What was done (action and scope)
2. The result (balances, tx hash, collateral/debt, etc.)
3. What to do next (or confirmation that the task is complete)

Keep output concise. Include explorer URLs for transactions.
