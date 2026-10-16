# Arc Tools

## Wallet Operations

### `arc_get_wallet_address`
Get the wallet address derived from the configured private key.

**Parameters:** None

**Returns:** `{ walletAddress, chain }`

**Example:** "What's my wallet address?"

---

### `arc_get_balance`
Get all token balances for the wallet. Returns USDC and all tokens configured for the current chain.

**Parameters:** None

**Returns:** `{ walletAddress, chain, tokens: [{ symbol, address, balance, decimals, isNative }] }`

**Example:** "Show my wallet balances"

---

### `arc_send_tokens`
Send tokens by symbol to a specific address.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | string | Yes | Token symbol (USDC, WETH, cirBTC, EURC) |
| `to` | string | Yes | Recipient address (0x...) |
| `amount` | string | Yes | Amount to send (e.g. "100.5") |

**Returns:** `{ txHash, explorer, symbol, to, amount, blockNumber }`

**Example:** "Send 10 USDC to 0x1234..."

## Unified Balance

### `arc_get_unified_balance`
Check total USDC balance and breakdown by network.

**Parameters:** None

**Returns:** `{ token, totalConfirmed, totalPending, chains: [{ chain, confirmed, pending }] }`

**Example:** "Check my unified balance"

---

### `arc_get_supported_chains`
Get all chains available for cross-chain transfers. Returns chain names that can be used as targetChain.

**Parameters:** None

**Returns:** `{ token, totalConfirmed, totalPending, chains: [{ chain, confirmed, pending }] }`

**Example:** "What chains can I send to?"

---

### `arc_deposit_unified_balance`
Deposit USDC into Circle Unified Balance. Makes USDC available for cross-chain spending.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | Amount of USDC to deposit (e.g. "100.5") |

**Returns:** `{ txHash, explorer, amount, token, depositedTo, chain }`

**Example:** "Deposit 100 USDC to unified balance"

---

### `arc_spend_unified_balance`
Spend/withdraw USDC from Unified Balance. Can send to a different address and bridge to another chain.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | Amount of USDC to spend/withdraw |
| `recipient` | string | No | Recipient address (defaults to sender) |
| `targetChain` | string | No | Target chain for cross-chain (use arc_get_supported_chains) |

**Returns:** `{ txHash, explorer, recipientAddress, destinationChain, allocations, fees, transferId }`

**Example:** "Send 50 USDC to Ethereum"

## Swap

### `arc_swap_tokens`
Swap tokens on Arc via Circle Swap Kit.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `fromSymbol` | string | Yes | Token to swap from (e.g. "WETH") |
| `toSymbol` | string | Yes | Token to swap to (e.g. "USDC") |
| `amount` | string | Yes | Amount of from token to swap |
| `slippagePercent` | string | No | Slippage tolerance (default: "0.5") |

**Returns:** `{ txHash, explorer, fromSymbol, toSymbol, amount, outputAmount }`

**Example:** "Swap 1 WETH to USDC"

## Earn

### `arc_list_earn_vaults`
List all available earn vaults on Arc with APY. Optionally filter by symbol.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `symbol` | string | No | Filter by asset symbol (e.g. "USDC"). Omit for all. |

**Returns:** `[{ vaultAddress, name, protocol, asset, currentApy, status, totalDeposits, liquidity }]`

**Example:** "Show earn vaults for USDC"

---

### `arc_earn_deposit`
Deposit into an earn vault.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | Amount to deposit (e.g. "100.5") |
| `vaultAddress` | string | Yes | Vault address (from arc_list_earn_vaults) |

**Returns:** `{ txHash, explorer, vaultAddress, amount, kind }`

**Example:** "Deposit 100 USDC to the best vault"

---

### `arc_get_earn_position`
Check position in an earn vault — balance, shares, principal, and yield earned.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `vaultAddress` | string | Yes | Vault address to query |

**Returns:** `{ vaultAddress, currentBalance, shares, principalDeposited, totalYieldEarned }`

**Example:** "Check my earn position"

---

### `arc_earn_withdraw`
Withdraw from an earn vault.

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| `amount` | string | Yes | Amount to withdraw |
| `vaultAddress` | string | Yes | Vault address to withdraw from |

**Returns:** `{ txHash, explorer, vaultAddress, amount }`

**Example:** "Withdraw 50 USDC from the vault"

## Prices

### `arc_get_prices`
Get all token prices from CoinGecko.

**Parameters:** None

**Returns:** `{ USDC: { price, marketCap, volume24h, percentChange24h, ... }, WETH: { ... }, ... }`

**Example:** "What are the token prices?"
