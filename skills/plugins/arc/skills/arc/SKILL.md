---
name: arc
description: >
  Use Arc for wallet operations, Circle Unified Balance (deposit/spend cross-chain), token swaps, and earn vault management on Arc chain.
  Provides wallet operations (balances, send tokens), unified balance (deposit, spend cross-chain, check balance),
  swaps (USDC, WETH, cirBTC), and earn vaults (list, deposit, check position, withdraw).
  Use this skill whenever the user mentions Arc, Circle Unified Balance, cross-chain transfers,
  earn vaults, token swaps on Arc, USDC on Arc, or Circle App Kits.
  Also invoke when the user wants to check balances, deposit to unified balance, swap tokens,
  manage earn positions, or send cross-chain transfers.
---

# Arc

Arc is an EVM-compatible L2 with USDC as the native gas token. This skill provides wallet operations, Circle Unified Balance (deposit/spend cross-chain), token swaps, and earn vault management via Circle App Kits.

## Arc platform overview

Arc uses USDC as its native gas token (not ETH). Circle App Kits provide:

- **Unified Balance** — Combine USDC from multiple chains into one spendable balance
- **Swap Kit** — Swap tokens on Arc via Circle's DEX aggregator
- **Earn Kit** — Deposit into earn vaults for yield (Morpho, etc.)

For full platform details, see [overview.md](references/overview.md).

## Setup

For installation, configuration, and environment variables, see [setup.md](references/setup.md).

Quick start:

```bash
npm install -g @tamago-labs/wayfind-arc-mcp
```

Set `ARC_PRIVATE_KEY` and optionally `ARC_CHAIN` (mainnet/testnet).

## Tool routing

Arc exposes 13 MCP tools. Route by user intent:

### Wallet operations

| User intent | Tool |
|---|---|
| "What's my wallet address?" | `arc_get_wallet_address` |
| "Show my balances" | `arc_get_balance` |
| "Send X to address" | `arc_send_tokens` |

### Unified Balance

| User intent | Tool |
|---|---|
| "Check my unified balance" | `arc_get_unified_balance` |
| "What chains can I send to?" | `arc_get_supported_chains` |
| "Deposit X USDC to unified balance" | `arc_deposit_unified_balance` |
| "Send X USDC to [chain]" | `arc_spend_unified_balance` |

### Swap & Earn

| User intent | Tool |
|---|---|
| "Swap X to Y" | `arc_swap_tokens` |
| "Show earn vaults" | `arc_list_earn_vaults` |
| "Deposit X to earn vault" | `arc_earn_deposit` |
| "Check my earn position" | `arc_get_earn_position` |
| "Withdraw X from earn vault" | `arc_earn_withdraw` |

### Prices

| User intent | Tool |
|---|---|
| "What are the token prices?" | `arc_get_prices` |

## Intent-based routing

**Balance check intent** ("check my balance", "show my wallet", "what do I have"):
- Use `arc_get_balance` to get all token balances (USDC, WETH, cirBTC)

**Deposit intent** ("deposit to unified balance", "add to unified balance"):
1. Use `arc_get_balance` to confirm available USDC
2. Use `arc_deposit_unified_balance` with the amount

**Cross-chain spend intent** ("send to Ethereum", "bridge to Base"):
1. Use `arc_get_unified_balance` to check available balance
2. Use `arc_get_supported_chains` to list available chains
3. Use `arc_spend_unified_balance` with amount and targetChain

**Swap intent** ("swap X to Y", "trade X for Y"):
1. Use `arc_swap_tokens` with fromSymbol, toSymbol, amount

**Earn intent** ("earn yield", "deposit to vault", "show vaults"):
1. Use `arc_list_earn_vaults` to show available vaults with APY
2. Use `arc_earn_deposit` to deposit to the chosen vault
3. Use `arc_get_earn_position` to check balance and yield
4. Use `arc_earn_withdraw` to withdraw

**Price intent** ("what's the price", "token prices"):
- Use `arc_get_prices` to get all token prices from CoinGecko

## Execution rules

1. For deposits, always check `arc_get_balance` first to confirm funds
2. For cross-chain spends, always check `arc_get_supported_chains` for valid chain names
3. For earn deposits, always list vaults first with `arc_list_earn_vaults` to show APY
4. For earn withdrawals, check position first with `arc_get_earn_position`
5. Token symbols: USDC, WETH, cirBTC, EURC (resolved from built-in config)
6. Cross-chain transfers burn USDC on source chain and mint on destination chain via Circle Gateway

## Response format

For all operational responses, return:
1. What was done (action and scope)
2. The result (balances, tx hash, chain breakdown, etc.)
3. What to do next (or confirmation that the task is complete)

Keep output concise. Include explorer URLs for transactions.
